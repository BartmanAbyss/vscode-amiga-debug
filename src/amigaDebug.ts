import * as vscode from 'vscode';
import { BreakpointEvent, ContinuedEvent, DebugSession, Event, Handles, InitializedEvent, Logger, logger, LoggingDebugSession, OutputEvent, Scope, Source, StackFrame, StoppedEvent, TerminatedEvent, Thread, ThreadEvent } from 'vscode-debugadapter';
import { DebugProtocol } from 'vscode-debugprotocol';
import { Breakpoint, IBackend, MIError, Variable, VariableObject, Section } from './backend/backend';
import { expandValue, isExpandable } from './backend/gdb_expansion';
import { MI2 } from './backend/mi2';
import { MINode } from './backend/mi_parse';
import { hexFormat } from './utils';

import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

import { SymbolTable } from './backend/symbols';
import { DisassemblyInstruction, NumberFormat, SymbolInformation, SymbolScope, SourceLineWithDisassembly } from './symbols';
import { resolve } from 'url';

interface LaunchRequestArguments extends DebugProtocol.LaunchRequestArguments {
	program: string; 	// An absolute path to the "program" to debug. basename only; .elf and .exe will be added respectively to find ELF and Amiga-HUNK file
}

class ExtendedVariable {
	constructor(public name, public options) {
	}
}

const GLOBAL_HANDLE_ID = 0xFE;
const STACK_HANDLES_START = 0x100;
const STACK_HANDLES_FINISH = 0xFFFF;
const STATIC_HANDLES_START = 0x010000;
const STATIC_HANDLES_FINISH = 0x01FFFF;
const VAR_HANDLES_START = 0x020000;

class CustomStoppedEvent extends Event implements DebugProtocol.Event {
	public readonly body: {
		reason: string,
		threadID: number,
	};
	public readonly event: string;

	constructor(reason: string, threadID: number) {
		super('custom-stop', { reason, threadID });
	}
}

class CustomContinuedEvent extends Event implements DebugProtocol.Event {
	public readonly body: {
		threadID: number;
		allThreads: boolean;
	};
	public readonly event: string;

	constructor(threadID: number, allThreads: boolean = true) {
		super('custom-continued', { threadID, allThreads });
	}
}

export class AmigaDebugSession extends LoggingDebugSession {
	protected variableHandles = new Handles<string | VariableObject | ExtendedVariable>(VAR_HANDLES_START);
	protected variableHandlesReverse: { [id: string]: number } = {};
	protected quit: boolean;
	protected started: boolean;
	protected crashed: boolean;
	protected debugReady: boolean;
	protected miDebugger: MI2;
	protected forceDisassembly: boolean = false;
	protected activeEditorPath: string | null = null;
	protected currentThreadId: number = 1;

	protected breakpointMap: Map<string, Breakpoint[]> = new Map();
	protected fileExistsCache: Map<string, boolean> = new Map();

	private args: LaunchRequestArguments;
	private symbolTable: SymbolTable;
	private stopped: boolean = false;
	private stoppedReason: string = '';

	private currentFile: string;

	public constructor() {
		super("amiga-debug.txt");
	}

	protected initDebugger() {
		this.miDebugger.on('launcherror', this.launchError.bind(this));
		this.miDebugger.on('quit', this.quitEvent.bind(this));
		this.miDebugger.on('exited-normally', this.quitEvent.bind(this));
		this.miDebugger.on('stopped', this.stopEvent.bind(this));
		this.miDebugger.on('msg', this.handleMsg.bind(this));
		this.miDebugger.on('breakpoint', this.handleBreakpoint.bind(this));
		this.miDebugger.on('step-end', this.handleBreak.bind(this));
		this.miDebugger.on('step-out-end', this.handleBreak.bind(this));
		this.miDebugger.on('signal-stop', this.handlePause.bind(this));
		this.miDebugger.on('running', this.handleRunning.bind(this));
		this.miDebugger.on('thread-created', this.handleThreadCreated.bind(this));
		this.miDebugger.on('thread-exited', this.handleThreadExited.bind(this));
		this.miDebugger.on('thread-selected', this.handleThreadSelected.bind(this));
		this.sendEvent(new InitializedEvent());
	}

	protected initializeRequest(response: DebugProtocol.InitializeResponse, args: DebugProtocol.InitializeRequestArguments): void {
		response.body = response.body || {};
		response.body.supportsHitConditionalBreakpoints = true;
		response.body.supportsConfigurationDoneRequest = true;
		response.body.supportsConditionalBreakpoints = true;
		response.body.supportsFunctionBreakpoints = true;
		response.body.supportsEvaluateForHovers = true;
		response.body.supportsSetVariable = true;
		response.body.supportsRestartRequest = true;
		this.sendResponse(response);
	}

	protected async launchRequest(response: DebugProtocol.LaunchResponse, args: LaunchRequestArguments): Promise<void> {
		logger.setup(Logger.LogLevel.Warn, false);

		const binPath = await vscode.commands.executeCommand("amiga.bin-path") as string;
		const objdumpPath = path.join(binPath, "opt/bin/m68k-amiga-elf-objdump.exe");

		const gdbPath = path.join(binPath, "opt/bin/m68k-amiga-elf-gdb.exe");
		const gdbArgs = ['-q', '--interpreter=mi2'];

		const winuaePath = path.join(binPath, "winuae-gdb.exe");
		const winuaeArgs = [
			'-s', 'use_gui=no',
			'-s', 'win32.start_not_captured=yes',
			'-s', 'quickstart=a500',
			'-s', 'debugging_features=gdbserver',
			'-0', args.program + ".exe"
		];

		this.args = args;
		this.symbolTable = new SymbolTable(objdumpPath, args.program + ".elf");
		this.symbolTable.loadSymbols();
		this.breakpointMap = new Map();
		this.fileExistsCache = new Map();

		if (!fs.existsSync(this.args.program + ".elf")) {
			this.sendErrorResponse(response, 103, `Unable to find executable file at ${this.args.program + ".elf"}.`);
			return;
		}

		if (!fs.existsSync(this.args.program + ".exe")) {
			this.sendErrorResponse(response, 103, `Unable to find executable file at ${this.args.program + ".exe"}.`);
			return;
		}

		this.quit = false;
		this.started = false;
		this.crashed = false;
		this.debugReady = false;
		this.stopped = false;

		const winUae = childProcess.spawn(winuaePath, winuaeArgs, { stdio: 'ignore', detached: true });

		this.miDebugger = new MI2(gdbPath, gdbArgs);
		this.initDebugger();

		this.miDebugger.printCalls = true;
		//this.miDebugger.debugOutput = true;

		this.miDebugger.once('sections-loaded', (sections) => {
			if(sections.length > 0) {
				this.symbolTable.relocate(sections);
				this.started = true;
				this.sendResponse(response);
			} else {
				this.sendErrorResponse(response, 103, 'no sections found');
			}
		});

		this.miDebugger.once('debug-ready', () => {
			this.debugReady = true;
		});
		const commands = [
			`file-exec-and-symbols ${this.args.program + ".elf"}`,
			'enable-pretty-printing',
			'interpreter-exec console "target remote localhost:2345"'
		];

		this.miDebugger.connect(".", this.args.program + ".elf", commands).then(() => {
		}, (err) => {
			this.sendErrorResponse(response, 103, `Failed to launch GDB: ${err.toString()}`);
		});
	}

	protected customRequest(command: string, response: DebugProtocol.Response, args: any): void {
		switch (command) {
			case 'set-force-disassembly':
				response.body = { success: true };
				this.forceDisassembly = args.force;
				if (this.stopped) {
					this.activeEditorPath = null;
					this.sendEvent(new ContinuedEvent(this.currentThreadId, true));
					this.sendEvent(new StoppedEvent(this.stoppedReason, this.currentThreadId));
				}
				this.sendResponse(response);
				break;
			case 'load-function-symbols':
				response.body = { functionSymbols: this.symbolTable.getFunctionSymbols() };
				this.sendResponse(response);
				break;
			case 'set-active-editor':
				if (args.path !== this.activeEditorPath) {
					this.activeEditorPath = args.path;
					// if (this.stopped) {
					//     this.sendEvent(new StoppedEvent(this.stoppedReason, this.currentThreadId, true));
					// }
				}
				response.body = {};
				this.sendResponse(response);
				break;
			case 'get-arguments':
				response.body = this.args;
				this.sendResponse(response);
				break;
			case 'read-memory':
				this.readMemoryRequest(response, args['address'], args['length']);
				break;
			case 'write-memory':
				this.writeMemoryRequest(response, args['address'], args['data']);
				break;
			case 'read-registers':
				this.readRegistersRequest(response);
				break;
			case 'read-register-list':
				this.readRegisterListRequest(response);
				break;
			case 'disassemble':
				this.disassembleRequest(response, args);
				break;
			case 'execute-command':
				let cmd = args['command'] as string;
				if (cmd.startsWith('-')) {
					cmd = cmd.substring(1);
				} else {
					cmd = `interpreter-exec console "${cmd}"`;
				}
				this.miDebugger.sendCommand(cmd).then((node) => {
					response.body = node.resultRecords;
					this.sendResponse(response);
				}, (error) => {
					response.body = error;
					this.sendErrorResponse(response, 110, 'Unable to execute command');
				});
				break;
			default:
				response.body = { error: 'Invalid command.' };
				this.sendResponse(response);
				break;
		}
	}

	protected async disassembleRequest(response: DebugProtocol.Response, args: any): Promise<void> {
		if (args.function) {
			const funcInfo = await this.getDisassemblyForFunction(args.function, args.file);
			if(funcInfo) {
				response.body = funcInfo;
				this.sendResponse(response);
			} else {
				this.sendErrorResponse(response, 1, `Unable to disassemble ${args.function}`);
			}
			return;
		} else if (args.startAddress !== undefined) {
			let funcInfo = this.symbolTable.getFunctionAtAddress(args.startAddress);
			if (funcInfo) {
				funcInfo = await this.getDisassemblyForFunction(funcInfo.name, funcInfo.file || undefined);
				if(funcInfo) {
					response.body = funcInfo;
					this.sendResponse(response);
					return;
				}
			}
			const lines = await this.getDisassemblyForAddresses(args.startAddress, args.length || 256);
			response.body = { lines };
			this.sendResponse(response);
			return;
		} else {
			this.sendErrorResponse(response, 1, 'Unable to disassemble; invalid parameters.');
		}
	}

	protected readMemoryRequest(response: DebugProtocol.Response, startAddress: number, length: number) {
		const address = hexFormat(startAddress, 8);
		this.miDebugger.sendCommand(`data-read-memory-bytes ${address} ${length}`).then((node) => {
			const startAddress = node.resultRecords.results[0][1][0][0][1];
			const endAddress = node.resultRecords.results[0][1][0][2][1];
			const data = node.resultRecords.results[0][1][0][3][1];
			const bytes = data.match(/[0-9a-f]{2}/g).map((b) => parseInt(b, 16));
			response.body = {
				startAddress,
				endAddress,
				bytes
			};
			this.sendResponse(response);
		}, (error) => {
			response.body = { error };
			this.sendErrorResponse(response, 114, `Unable to read memory: ${error.toString()}`);
		});
	}

	protected writeMemoryRequest(response: DebugProtocol.Response, startAddress: number, data: string) {
		const address = hexFormat(startAddress, 8);
		this.miDebugger.sendCommand(`data-write-memory-bytes ${address} ${data}`).then((node) => {
			this.sendResponse(response);
		}, (error) => {
			response.body = { error };
			this.sendErrorResponse(response, 114, `Unable to write memory: ${error.toString()}`);
		});
	}

	protected readRegistersRequest(response: DebugProtocol.Response) {
		this.miDebugger.sendCommand('data-list-register-values --skip-unavailable x').then((node) => {
			if (node.resultRecords.resultClass === 'done') {
				const rv = node.resultRecords.results[0][1];
				response.body = rv.map((n) => {
					const val = {};
					n.forEach((x) => {
						val[x[0]] = x[1];
					});
					return val;
				});
			} else {
				response.body = {
					error: 'Unable to parse response'
				};
			}
			this.sendResponse(response);
		}, (error) => {
			response.body = { error };
			this.sendErrorResponse(response, 115, `Unable to read registers: ${error.toString()}`);
		});
	}

	protected readRegisterListRequest(response: DebugProtocol.Response) {
		this.miDebugger.sendCommand('data-list-register-names').then((node) => {
			if (node.resultRecords.resultClass === 'done') {
				let registerNames;
				node.resultRecords.results.forEach((rr) => {
					if (rr[0] === 'register-names') {
						registerNames = rr[1];
					}
				});
				response.body = registerNames;
			} else {
				response.body = { error: node.resultRecords.results };
			}
			this.sendResponse(response);
		}, (error) => {
			response.body = { error };
			this.sendErrorResponse(response, 116, `Unable to read register list: ${error.toString()}`);
		});
	}

	protected disconnectRequest(response: DebugProtocol.DisconnectResponse, args: DebugProtocol.DisconnectArguments): void {
		if (this.miDebugger) {
			this.miDebugger.abort(this.stopped === false).then((done) => {
				this.sendResponse(response);
			});
		} else {
			this.sendResponse(response);
		}
	}

	protected handleMsg(type: string, msg: string) {
		if (type === 'target') { type = 'stdout'; }
		if (type === 'log') { type = 'stderr'; }
		this.sendEvent(new OutputEvent(msg, type));
	}

	protected handleRunning(info: MINode) {
		this.stopped = false;
		this.sendEvent(new ContinuedEvent(this.currentThreadId));
		this.sendEvent(new CustomContinuedEvent(this.currentThreadId, true));
	}

	protected handleBreakpoint(info: MINode) {
		this.stopped = true;
		this.stoppedReason = 'breakpoint';
		this.sendEvent(new StoppedEvent('breakpoint', this.currentThreadId));
		this.sendEvent(new CustomStoppedEvent('breakpoint', this.currentThreadId));
	}

	protected handleBreak(info: MINode) {
		this.stopped = true;
		this.stoppedReason = 'step';
		this.sendEvent(new StoppedEvent('step', this.currentThreadId));
		this.sendEvent(new CustomStoppedEvent('step', this.currentThreadId));
	}

	protected handlePause(info: MINode) {
		this.stopped = true;
		this.stoppedReason = 'user request';
		this.sendEvent(new StoppedEvent('user request', this.currentThreadId));
		this.sendEvent(new CustomStoppedEvent('user request', this.currentThreadId));
	}

	protected handleThreadCreated(info: { threadId: number, threadGroupId: number }) {
		this.sendEvent(new ThreadEvent('started', info.threadId));
	}

	protected handleThreadExited(info: { threadId: number, threadGroupId: number }) {
		this.sendEvent(new ThreadEvent('exited', info.threadId));
	}

	protected handleThreadSelected(info: { threadId: number }) {
		this.currentThreadId = info.threadId;
		this.sendEvent(new ThreadEvent('selected', info.threadId));
	}

	protected stopEvent(info: MINode) {
		if (!this.started) { this.crashed = true; }
		if (!this.quit) {
			this.stopped = true;
			this.stoppedReason = 'exception';
			this.sendEvent(new StoppedEvent('exception', this.currentThreadId));
			this.sendEvent(new CustomStoppedEvent('exception', this.currentThreadId));
		}
	}

	protected quitEvent() {
		this.quit = true;
		this.sendEvent(new TerminatedEvent());
	}

	protected launchError(err: any) {
		this.handleMsg('stderr', 'Could not start debugger process, does the program exist in filesystem?\n');
		this.handleMsg('stderr', err.toString() + '\n');
		this.quitEvent();
	}

	protected async setVariableRequest(response: DebugProtocol.SetVariableResponse, args: DebugProtocol.SetVariableArguments): Promise<void> {
		try {
			let name = args.name;
			if (args.variablesReference >= VAR_HANDLES_START) {
				const parent = this.variableHandles.get(args.variablesReference) as VariableObject;
				name = `${parent.name}.${name}`;
			}

			const res = await this.miDebugger.varAssign(name, args.value);
			response.body = {
				value: res.result('value')
			};
			this.sendResponse(response);
		} catch (err) {
			this.sendErrorResponse(response, 11, `Could not continue: ${err}`);
		}
	}

	protected setFunctionBreakPointsRequest(response: DebugProtocol.SetFunctionBreakpointsResponse, args: DebugProtocol.SetFunctionBreakpointsArguments): void {
		const createBreakpoints = async (shouldContinue) => {
			const all: Array<Promise<Breakpoint | null>> = [];
			args.breakpoints.forEach((brk) => {
				all.push(this.miDebugger.addBreakPoint({ raw: brk.name, condition: brk.condition, countCondition: brk.hitCondition }));
			});

			try {
				const brkpoints = await Promise.all(all);
				const finalBrks: DebugProtocol.Breakpoint[] = [];
				brkpoints.forEach((brkp) => {
					if (brkp) { finalBrks.push({ verified: true, line: brkp.line || -1 }); }
				});
				response.body = {
					breakpoints: finalBrks
				};
				this.sendResponse(response);
			} catch (msg) {
				this.sendErrorResponse(response, 10, msg.toString());
			}
			if (shouldContinue) {
				await this.miDebugger.sendCommand('exec-continue');
			}
		};

		const process = async () => {
			if (this.stopped) {
				await createBreakpoints(false);
			} else {
				this.miDebugger.sendCommand('exec-interrupt');
				this.miDebugger.once('generic-stopped', () => { createBreakpoints(true); });
			}
		};

		if (this.debugReady) { process(); } else { this.miDebugger.once('debug-ready', process); }
	}

	protected setBreakPointsRequest(response: DebugProtocol.SetBreakpointsResponse, args: DebugProtocol.SetBreakpointsArguments) {
		const createBreakpoints = async (shouldContinue: boolean) => {
			const normalizedPath = normalizePath(args.source.path || "");
			this.debugReady = true;
			const currentBreakpoints = (this.breakpointMap.get(normalizedPath) || [])
				.filter((bp) => bp.line !== undefined)
				.map((bp) => bp.number!);

			try {
				await this.miDebugger.removeBreakpoints(currentBreakpoints);
				this.breakpointMap.set(normalizedPath, []);

				const all: Array<Promise<Breakpoint | null>> = [];
				const sourcepath = decodeURIComponent(normalizedPath);
				if (sourcepath.startsWith('disassembly:/')) {
					let sidx = 13;
					if (sourcepath.startsWith('disassembly:///')) { sidx = 15; }
					const path = sourcepath.substring(sidx, sourcepath.length - 9 /* ".amigaasm" */); // Account for protocol and extension
					const parts = path.split('::');
					let func: string;
					let file: string | undefined;

					if(parts.length === 1 && parts[0].startsWith('0x')) {
						if (args.breakpoints) {
							args.breakpoints.forEach((brk) => {
								all.push(this.miDebugger.addBreakPoint({
									condition: brk.condition,
									countCondition: brk.hitCondition,
									raw: parts[0]
								}));
							});
						}
					} else {
						if (parts.length === 2) {
							func = parts[1];
							file = parts[0];
						} else {
							func = parts[0];
						}

						const symbol = await this.getDisassemblyForFunction(func, file);
						const getLineAndAddress = (brkLine: number) => {
							let curLine = 1;
							for(const l of symbol.lines) {
								const sourceLine = curLine;
								if(l.source !== undefined)
									curLine++;
								for(const i of l.instructions) {
									if(brkLine === sourceLine || brkLine === curLine) {
										return { line: curLine, address: i.address };
									}
									curLine++;
								}
							}
							return undefined;
						};

						if (args.breakpoints && symbol && symbol.lines) {
							args.breakpoints.forEach((brk) => {
								const lineAndAddress = getLineAndAddress(brk.line);
								if(lineAndAddress !== undefined) {
									all.push(this.miDebugger.addBreakPoint({
										file: args.source.path, // disassembly, just for editor
										line: lineAndAddress.line,
										condition: brk.condition,
										countCondition: brk.hitCondition,
										raw: lineAndAddress.address
									}));
								}
							});
						}
					}
				} else {
					// real source
					if (args.breakpoints) {
						args.breakpoints.forEach((brk) => {
							all.push(this.miDebugger.addBreakPoint({
								file: unnormalizePath(args.source.path || ""),
								line: brk.line,
								condition: brk.condition,
								countCondition: brk.hitCondition
							}));
						});
					}
				}

				const brkpoints = await Promise.all(all);

				const finalBrks: Breakpoint[] = brkpoints.filter((bp): bp is Breakpoint => bp !== null);

				response.body = {
					breakpoints: finalBrks.map((bp) => {
						return {
							line: bp.line,
							id: bp.number,
							verified: true
						};
					})
				};

				this.breakpointMap.set(normalizedPath, finalBrks);
				this.sendResponse(response);
			} catch (msg) {
				this.sendErrorResponse(response, 9, msg.toString());
			}

			if (shouldContinue) {
				await this.miDebugger.sendCommand('exec-continue');
			}
		};

		const process = async () => {
			if (this.stopped) {
				await createBreakpoints(false);
			} else {
				await this.miDebugger.sendCommand('exec-interrupt');
				this.miDebugger.once('generic-stopped', () => { createBreakpoints(true); });
			}
		};

		if (this.debugReady) { process(); } else { this.miDebugger.once('debug-ready', process); }
	}

	protected async threadsRequest(response: DebugProtocol.ThreadsResponse): Promise<void> {
		if (!this.stopped) {
			response.body = { threads: [] };
			this.sendResponse(response);
		}
		try {
			const threadIdNode = await this.miDebugger.sendCommand('thread-list-ids');
			const threadIds: number[] = threadIdNode.result('thread-ids').map((ti) => parseInt(ti[1]));
			const currentThread = threadIdNode.result('current-thread-id');

			if (!currentThread) {
				await this.miDebugger.sendCommand(`thread-select ${threadIds[0]}`);
				this.currentThreadId = threadIds[0];
			} else {
				this.currentThreadId = parseInt(currentThread);
			}

			const nodes = await Promise.all(threadIds.map((id) => this.miDebugger.sendCommand(`thread-info ${id}`)));

			const threads = nodes.map((node: MINode) => {
				let th = node.result('threads');
				if (th.length === 1) {
					th = th[0];
					const id = parseInt(MINode.valueOf(th, 'id'));
					const tid = MINode.valueOf(th, 'target-id');
					const details = MINode.valueOf(th, 'details');

					return new Thread(id, details || tid);
				} else {
					return null;
				}
			}).filter((t) => t !== null) as Thread[];

			response.body = {
				threads
			};
			this.sendResponse(response);
		} catch (e) {
			this.sendErrorResponse(response, 1, `Unable to get thread information: ${e}`);
		}
	}

	protected async stackTraceRequest(response: DebugProtocol.StackTraceResponse, args: DebugProtocol.StackTraceArguments): Promise<void> {
		try {
			const stack = await this.miDebugger.getStack(args.threadId, args.startFrame, args.levels);
			const ret: StackFrame[] = [];
			for (const element of stack) {
				const stackId = (args.threadId << 8 | (element.level & 0xFF)) & 0xFFFF;
				let file;
				let disassemble = this.forceDisassembly || element.file === undefined;
				if (!disassemble) {
					file = normalizePath(element.file);
					disassemble = !(await this.checkFileExists(file)); 
				}
				if (!disassemble && this.activeEditorPath && this.activeEditorPath.startsWith('disassembly:///')) {
					const symbolInfo = this.symbolTable.getFunctionByName(element.function, element.fileName);
					let url: string;
					if (symbolInfo) {
						if (symbolInfo.scope !== SymbolScope.Global && symbolInfo.file !== "") {
							url = `disassembly:///${symbolInfo.file}::${symbolInfo.name}.amigaasm`;
						} else {
							url = `disassembly:///${symbolInfo.name}.amigaasm`;
						}
						if (url === this.activeEditorPath) { disassemble = true; }
					}
				}
				if (disassemble) {
					const tryFunction = async () => {
						const symbolInfo = await this.getDisassemblyForFunction(element.function, element.fileName);
						if(symbolInfo) {
							let line = -1;
							if (symbolInfo.lines) {
								const getLine = () => {
									let curLine = 1;
									for(const l of symbolInfo.lines) {
										const sourceLine = curLine;
										if(l.source !== undefined)
											curLine++;
										for(const i of l.instructions) {
											if(element.address === i.address) {
												return curLine;
											}
											curLine++;
										}
									}
									return -1;
								};
								line = getLine();
							}

							if (line !== -1) {
								let fname: string;
								let url: string;
								if (symbolInfo.scope !== SymbolScope.Global && symbolInfo.file !== "") {
									fname = `${symbolInfo.file}::${symbolInfo.name}.amigaasm`;
									url = `disassembly:///${symbolInfo.file}::${symbolInfo.name}.amigaasm`;
								} else {
									fname = `${symbolInfo.name}.amigaasm`;
									url = `disassembly:///${symbolInfo.name}.amigaasm`;
								}

								ret.push(new StackFrame(stackId, `${element.function}@${element.address}`, new Source(fname, url), line, 0));
								return true;
							}
						}
						return false;
					};

					if(!await tryFunction()) {
						const fname = `${element.address}.amigaasm`;
						const url = `disassembly:///${element.address}.amigaasm`;
						ret.push(new StackFrame(stackId, element.address, new Source(fname, url), 1, 0));
					}
				} else {
					ret.push(new StackFrame(stackId, element.function + '@' + element.address, this.createSource(file), element.line, 0));
				}
			}

			response.body = {
				stackFrames: ret
			};
			this.sendResponse(response);
		} catch (err) {
			this.sendErrorResponse(response, 12, `Failed to get Stack Trace: ${err.toString()}`);
		}
	}

	protected async configurationDoneRequest(response: DebugProtocol.ConfigurationDoneResponse, args: DebugProtocol.ConfigurationDoneArguments): Promise<void> {
		await this.miDebugger.continue(this.currentThreadId);
		this.sendResponse(response);
	}

	protected scopesRequest(response: DebugProtocol.ScopesResponse, args: DebugProtocol.ScopesArguments): void {
		const scopes = new Array<Scope>();
		scopes.push(new Scope('Local', parseInt(args.frameId as any), false));
		scopes.push(new Scope('Global', GLOBAL_HANDLE_ID, false));
		scopes.push(new Scope('Static', STATIC_HANDLES_START + parseInt(args.frameId as any), false));

		response.body = {
			scopes
		};
		this.sendResponse(response);
	}

	protected async variablesRequest(response: DebugProtocol.VariablesResponse, args: DebugProtocol.VariablesArguments): Promise<void> {
		let id: number | string | VariableObject | ExtendedVariable;

		if (args.variablesReference === GLOBAL_HANDLE_ID) {
			return this.globalVariablesRequest(response, args);
		} else if (args.variablesReference >= STATIC_HANDLES_START && args.variablesReference <= STATIC_HANDLES_FINISH) {
			const frameId = args.variablesReference & 0xFF;
			const threadId = (args.variablesReference & 0xFF00) >>> 8;
			return this.staticVariablesRequest(threadId, frameId, response, args);
		} else if (args.variablesReference >= STACK_HANDLES_START && args.variablesReference < STATIC_HANDLES_START) {
			const frameId = args.variablesReference & 0xFF;
			const threadId = (args.variablesReference & 0xFF00) >>> 8;
			return this.stackVariablesRequest(threadId, frameId, response, args);
		} else {
			id = this.variableHandles.get(args.variablesReference);

			if (typeof id === 'string') {
				return this.variableMembersRequest(id, response, args);
			} else if (typeof id === 'object') {
				if (id instanceof VariableObject) {
					const pvar = id as VariableObject;
					const variables: DebugProtocol.Variable[] = [];

					// Variable members
					let children: VariableObject[];
					try {
						children = await this.miDebugger.varListChildren(id.name);
						const vars = children.map((child) => {
							const varId = this.findOrCreateVariable(child);
							child.id = varId;
							if (/^\d+$/.test(child.exp)) {
								child.fullExp = `${pvar.fullExp || pvar.exp}[${child.exp}]`;
							} else {
								child.fullExp = `${pvar.fullExp || pvar.exp}.${child.exp}`;
							}
							return child.toProtocolVariable();
						});

						response.body = {
							variables: vars
						};
						this.sendResponse(response);
					} catch (err) {
						this.sendErrorResponse(response, 1, `Could not expand variable: ${err}`);
					}
				} else if (id instanceof ExtendedVariable) {
					const variables: DebugProtocol.Variable[] = [];

					const varReq = id;
					if (varReq.options.arg) {
						const strArr: any[] = [];
						let argsPart = true;
						let arrIndex = 0;
						const submit = () => {
							response.body = {
								variables: strArr
							};
							this.sendResponse(response);
						};
						const addOne = async () => {
							const variable = await this.miDebugger.evalExpression(JSON.stringify(`${varReq.name}+${arrIndex})`));
							try {
								const expanded = expandValue(this.createVariable.bind(this), variable.result('value'), varReq.name, variable);
								if (!expanded) {
									this.sendErrorResponse(response, 15, 'Could not expand variable');
								} else {
									if (typeof expanded === 'string') {
										if (expanded === '<nullptr>') {
											if (argsPart) { argsPart = false; } else { return submit(); }
										} else if (expanded[0] !== '"') {
											strArr.push({
												name: '[err]',
												value: expanded,
												variablesReference: 0
											});
											return submit();
										}
										strArr.push({
											name: `[${(arrIndex++)}]`,
											value: expanded,
											variablesReference: 0
										});
										addOne();
									} else {
										strArr.push({
											name: '[err]',
											value: expanded,
											variablesReference: 0
										});
										submit();
									}
								}
							} catch (e) {
								this.sendErrorResponse(response, 14, `Could not expand variable: ${e}`);
							}
						};
						addOne();
					} else {
						this.sendErrorResponse(response, 13, `Unimplemented variable request options: ${JSON.stringify(varReq.options)}`);
					}
				} else {
					response.body = {
						variables: id
					};
					this.sendResponse(response);
				}
			} else {
				response.body = {
					variables: []
				};
				this.sendResponse(response);
			}
		}
	}

	protected pauseRequest(response: DebugProtocol.PauseResponse, args: DebugProtocol.ContinueArguments): void {
		this.miDebugger.interrupt(args.threadId).then((done) => {
			this.sendResponse(response);
		}, (msg) => {
			this.sendErrorResponse(response, 3, `Could not pause: ${msg}`);
		});
	}

	protected continueRequest(response: DebugProtocol.ContinueResponse, args: DebugProtocol.ContinueArguments): void {
		this.miDebugger.continue(args.threadId).then((done) => {
			response.body = { allThreadsContinued: true };
			this.sendResponse(response);
		}, (msg) => {
			this.sendErrorResponse(response, 2, `Could not continue: ${msg}`);
		});
	}

	private async stepInOrOverRequest(response: DebugProtocol.NextResponse, args: DebugProtocol.NextArguments, stepIn: boolean): Promise<void> {
		try {
			let assemblyMode = this.forceDisassembly;
			if (!assemblyMode) {
				const frame = await this.miDebugger.getFrame(args.threadId, 0);
				assemblyMode = frame.file === undefined || !(await this.checkFileExists(normalizePath(frame.file)));

				if (this.activeEditorPath && this.activeEditorPath.startsWith('disassembly:///')) {
					const symbolInfo = this.symbolTable.getFunctionByName(frame.function, frame.fileName);
					if (symbolInfo) {
						let url: string;
						if (symbolInfo.scope !== SymbolScope.Global) {
							url = `disassembly:///${symbolInfo.file}::${symbolInfo.name}.amigaasm`;
						} else {
							url = `disassembly:///${symbolInfo.name}.amigaasm`;
						}
						if (url === this.activeEditorPath) { assemblyMode = true; }
					}
				}
			}
			const done = await stepIn ? this.miDebugger.step(args.threadId, assemblyMode) : this.miDebugger.next(args.threadId, assemblyMode);
			this.sendResponse(response);
		} catch (msg) {
			this.sendErrorResponse(response, 6, `Could not step: ${msg}`);
		}
	}

	protected async stepInRequest(response: DebugProtocol.NextResponse, args: DebugProtocol.NextArguments): Promise<void> {
		return this.stepInOrOverRequest(response, args, true);
	}

	protected async stepOutRequest(response: DebugProtocol.NextResponse, args: DebugProtocol.NextArguments): Promise<void> {
		const node = await this.miDebugger.sendCommand('data-list-register-values x 17 16'); // get PC, SR
		if (node.resultRecords.resultClass === 'done') {
			const rv = node.resultRecords.results[0][1];
			const pc = parseInt(rv[0][1][1]);
			const sr = parseInt(rv[1][1][1]);
			if(sr & (1 << 13)) {
				// in Interrupt handler (supervisor mode)
				await this.miDebugger.sendCommand("break-insert -t *0xeeeeeeee");
				await this.miDebugger.sendCommand("exec-continue");
				this.sendResponse(response);
			} else if(pc >= 0xF80000) {
				// in Kickstart
				await this.miDebugger.sendCommand("break-insert -t *0xffffffff");
				await this.miDebugger.sendCommand("exec-continue");
				this.sendResponse(response);
			} else {
				this.miDebugger.stepOut(args.threadId).then((done) => {
					this.sendResponse(response);
				}, (msg) => {
					this.sendErrorResponse(response, 5, `Could not step out: ${msg}`);
				});
			}
		}
	}

	protected async nextRequest(response: DebugProtocol.NextResponse, args: DebugProtocol.NextArguments): Promise<void> {
		return this.stepInOrOverRequest(response, args, false);
	}

	protected checkFileExists(name: string): Promise<boolean> {
		if (!name)
			return Promise.resolve(false);

		if (this.fileExistsCache.has(name)) // Check cache
			return Promise.resolve(this.fileExistsCache.get(name) || false);

		return new Promise((resolve, reject) => {
			fs.exists(name, (exists) => {
				this.fileExistsCache.set(name, exists);
				resolve(exists);
			});
		});
	}

	protected async evaluateRequest(response: DebugProtocol.EvaluateResponse, args: DebugProtocol.EvaluateArguments): Promise<void> {
		const createVariable = (arg, options?) => {
			if (options) {
				return this.variableHandles.create(new ExtendedVariable(arg, options));
			} else {
				return this.variableHandles.create(arg);
			}
		};

		const findOrCreateVariable = (varObj: VariableObject): number => {
			let id: number;
			if (this.variableHandlesReverse.hasOwnProperty(varObj.name)) {
				id = this.variableHandlesReverse[varObj.name];
			} else {
				id = createVariable(varObj);
				this.variableHandlesReverse[varObj.name] = id;
			}
			return varObj.isCompound() ? id : 0;
		};

		if (args.context === 'watch') {
			try {
				const exp = args.expression;
				const varObjName = `watch_${exp.replace(/\./g, '__').replace(/\[/g, '_').replace(/\]/g, '_')}`;
				let varObj: VariableObject;
				try {
					const changes = await this.miDebugger.varUpdate(varObjName);
					const changelist = changes.result('changelist');
					changelist.forEach((change) => {
						const name = MINode.valueOf(change, 'name');
						const vId = this.variableHandlesReverse[name];
						const v = this.variableHandles.get(vId) as any;
						v.applyChanges(change);
					});
					const varId = this.variableHandlesReverse[varObjName];
					varObj = this.variableHandles.get(varId) as any;
					response.body = {
						result: varObj.value,
						variablesReference: varObj.id
					};
				} catch (err) {
					if (err instanceof MIError && err.message === 'Variable object not found') {
						varObj = await this.miDebugger.varCreate(exp, varObjName);
						const varId = findOrCreateVariable(varObj);
						varObj.exp = exp;
						varObj.id = varId;
						response.body = {
							result: varObj.value,
							variablesReference: varObj.id
						};
					} else {
						throw err;
					}
				}

				this.sendResponse(response);
			} catch (err) {
				response.body = {
					result: `<${err.toString()}>`,
					variablesReference: 0
				};
				this.sendErrorResponse(response, 7, err.toString());
			}
		} else if (args.context === 'hover') {
			try {
				const res = await this.miDebugger.evalExpression(args.expression);
				response.body = {
					variablesReference: 0,
					result: res.result('value')
				};
				this.sendResponse(response);
			} catch (e) {
				this.sendErrorResponse(response, 7, e.toString());
			}
		} else {
			this.miDebugger.sendUserInput(args.expression).then((output) => {
				if (typeof output === 'undefined') {
					response.body = {
						result: '',
						variablesReference: 0
					};
				} else {
					response.body = {
						result: JSON.stringify(output),
						variablesReference: 0
					};
				}
				this.sendResponse(response);
			}, (msg) => {
				this.sendErrorResponse(response, 8, msg.toString());
			});
		}
	}

	private async getDisassemblyForFunction(functionName: string, file?: string): Promise<SymbolInformation|null> {
		const symbol = this.symbolTable.getFunctionByName(functionName, file);

		if (!symbol)
			return null;

		if (symbol.lines) { return symbol; }

		symbol.lines = await this.getDisassemblyForAddresses(symbol.address, symbol.length);
		return symbol;
	}

	private async getDisassemblyForAddresses(startAddress: number, length: number): Promise<SourceLineWithDisassembly[]> {
		const fileCache: Map<string, string[]> = new Map();
		const readFile = util.promisify(fs.readFile);
		const endAddress = startAddress + length;
		// 0 disassembly only
		// 2 disassembly with raw opcodes
		// 4 mixed source and disassembly
		// 5 mixed source and disassembly with raw opcodes
		const parsed = await this.miDebugger.sendCommand(`data-disassemble -s ${hexFormat(startAddress, 8)} -e ${hexFormat(endAddress, 8)} -- 5`);
		const asm_insn = parsed.resultRecords.results[0][1];
		const lines: SourceLineWithDisassembly[] = [];
		for(const ri of asm_insn) {
			if(ri[0] === "src_and_asm_line") {
				// mixed source and disassembly
				const srcAndAsmLine = ri[1];
				const line = MINode.valueOf(srcAndAsmLine, "line");
				const file = MINode.valueOf(srcAndAsmLine, "file");
				const fullname = MINode.valueOf(srcAndAsmLine, "fullname");
				const instructions: DisassemblyInstruction[] = [];
				const lineAsmInsn = MINode.valueOf(srcAndAsmLine, "line_asm_insn");
				let source = "";

				const normalizedPath = normalizePath(fullname);
				if(await this.checkFileExists(normalizedPath)) {
					if(!fileCache.has(normalizedPath)) {
						const data = await readFile(normalizedPath);
						fileCache.set(normalizedPath, data.toString().replace("\r", "").split("\n"));
					}
					const sourceLines = fileCache.get(normalizedPath);
					if(line < sourceLines.length + 1)
						source = sourceLines[line - 1];
				}
				for(const lineAsm of lineAsmInsn) {
					const address = MINode.valueOf(lineAsm, 'address');
					const functionName = MINode.valueOf(lineAsm, 'func-name');
					const offset = parseInt(MINode.valueOf(lineAsm, 'offset'));
					const inst = MINode.valueOf(lineAsm, 'inst');
					const opcodes = MINode.valueOf(lineAsm, 'opcodes');
					instructions.push({
						address,
						functionName,
						offset,
						instruction: inst,
						opcodes
					});
				}
				lines.push({
					source,
					line,
					file,
					fullname,
					instructions
				});
			} else {
				if(lines.length === 0) {
					lines.push({
						instructions: []
					});
				}

				// no source information
				const address = MINode.valueOf(ri, 'address');
				const functionName = MINode.valueOf(ri, 'func-name');
				const offset = parseInt(MINode.valueOf(ri, 'offset'));
				const inst = MINode.valueOf(ri, 'inst');
				const opcodes = MINode.valueOf(ri, 'opcodes');

				lines[0].instructions.push({
					address,
					functionName,
					offset,
					instruction: inst,
					opcodes
				});
			}
		}

		return lines;
	}

	private async globalVariablesRequest(response: DebugProtocol.VariablesResponse, args: DebugProtocol.VariablesArguments): Promise<void> {
		const symbolInfo = this.symbolTable.getGlobalVariables();

		const globals: DebugProtocol.Variable[] = [];
		for (const symbol of symbolInfo) {
			try {
				const varObjName = `global_var_${symbol.name}`;
				let varObj: VariableObject;
				try {
					const changes = await this.miDebugger.varUpdate(varObjName);
					const changelist = changes.result('changelist');
					changelist.forEach((change) => {
						const name = MINode.valueOf(change, 'name');
						const vId = this.variableHandlesReverse[name];
						const v = this.variableHandles.get(vId) as any;
						v.applyChanges(change);
					});
					const varId = this.variableHandlesReverse[varObjName];
					varObj = this.variableHandles.get(varId) as any;
				} catch (err) {
					if (err instanceof MIError && err.message === 'Variable object not found') {
						varObj = await this.miDebugger.varCreate(symbol.name, varObjName);
						const varId = this.findOrCreateVariable(varObj);
						varObj.exp = symbol.name;
						varObj.id = varId;
					} else {
						throw err;
					}
				}
				globals.push(varObj.toProtocolVariable());
			} catch (err) {
				// this occurs usually when the linker renames duplicate static variables when LTO is activated. 
				// nothing much we can do about it. If this is important, try to resolve it via raw address
				// see https://stackoverflow.com/questions/27866865/
			}
		}

		response.body = { variables: globals };
		this.sendResponse(response);
	}

	private async staticVariablesRequest(
		threadId: number,
		frameId: number,
		response: DebugProtocol.VariablesResponse,
		args: DebugProtocol.VariablesArguments
	): Promise<void> {
		const statics: DebugProtocol.Variable[] = [];

		try {
			const frame = await this.miDebugger.getFrame(threadId, frameId);
			const file = frame.fileName;
			const staticSymbols = this.symbolTable.getStaticVariables(file);

			for (const symbol of staticSymbols) {
				const varObjName = `${file}_static_var_${symbol.name}`;
				let varObj: VariableObject;
				try {
					const changes = await this.miDebugger.varUpdate(varObjName);
					const changelist = changes.result('changelist');
					changelist.forEach((change) => {
						const name = MINode.valueOf(change, 'name');
						const vId = this.variableHandlesReverse[name];
						const v = this.variableHandles.get(vId) as any;
						v.applyChanges(change);
					});
					const varId = this.variableHandlesReverse[varObjName];
					varObj = this.variableHandles.get(varId) as any;
				} catch (err) {
					if (err instanceof MIError && err.message === 'Variable object not found') {
						varObj = await this.miDebugger.varCreate(symbol.name, varObjName);
						const varId = this.findOrCreateVariable(varObj);
						varObj.exp = symbol.name;
						varObj.id = varId;
					} else {
						throw err;
					}
				}

				statics.push(varObj.toProtocolVariable());
			}

			response.body = { variables: statics };
			this.sendResponse(response);
		} catch (err) {
			this.sendErrorResponse(response, 1, `Could not get global variable information: ${err}`);
		}
	}

	private createVariable(arg, options?): number {
		if (options) {
			return this.variableHandles.create(new ExtendedVariable(arg, options));
		} else {
			return this.variableHandles.create(arg);
		}
	}

	private findOrCreateVariable(varObj: VariableObject): number {
		let id: number;
		if (this.variableHandlesReverse.hasOwnProperty(varObj.name)) {
			id = this.variableHandlesReverse[varObj.name];
		} else {
			id = this.createVariable(varObj);
			this.variableHandlesReverse[varObj.name] = id;
		}
		return varObj.isCompound() ? id : 0;
	}

	private async stackVariablesRequest(
		threadId: number,
		frameId: number,
		response: DebugProtocol.VariablesResponse,
		args: DebugProtocol.VariablesArguments
	): Promise<void> {
		const variables: DebugProtocol.Variable[] = [];
		let stack: Variable[];
		try {
			stack = await this.miDebugger.getStackVariables(threadId, frameId);
			for (const variable of stack) {
				try {
					const varObjName = `var_${variable.name}`;
					let varObj: VariableObject;
					try {
						const changes = await this.miDebugger.varUpdate(varObjName);
						const changelist = changes.result('changelist');
						changelist.forEach((change) => {
							const name = MINode.valueOf(change, 'name');
							const vId = this.variableHandlesReverse[name];
							const v = this.variableHandles.get(vId) as any;
							v.applyChanges(change);
						});
						const varId = this.variableHandlesReverse[varObjName];
						varObj = this.variableHandles.get(varId) as any;
					} catch (err) {
						if (err instanceof MIError && err.message === 'Variable object not found') {
							varObj = await this.miDebugger.varCreate(variable.name, varObjName);
							const varId = this.findOrCreateVariable(varObj);
							varObj.exp = variable.name;
							varObj.id = varId;
						} else {
							throw err;
						}
					}
					variables.push(varObj.toProtocolVariable());
				} catch (err) {
					variables.push({
						name: variable.name,
						value: `<${err}>`,
						variablesReference: 0
					});
				}
			}
			response.body = {
				variables
			};
			this.sendResponse(response);
		} catch (err) {
			this.sendErrorResponse(response, 1, `Could not expand variable: ${err}`);
		}
	}

	private async variableMembersRequest(id: string, response: DebugProtocol.VariablesResponse, args: DebugProtocol.VariablesArguments): Promise<void> {
		// Variable members
		let variable;
		try {
			variable = await this.miDebugger.evalExpression(JSON.stringify(id));
			try {
				let expanded = expandValue(this.createVariable.bind(this), variable.result('value'), id, variable);
				if (!expanded) {
					this.sendErrorResponse(response, 2, 'Could not expand variable');
				} else {
					if (typeof expanded[0] === 'string') {
						expanded = [
							{
								name: '<value>',
								value: prettyStringArray(expanded),
								variablesReference: 0
							}
						];
					}
					response.body = {
						variables: expanded
					};
					this.sendResponse(response);
				}
			} catch (e) {
				this.sendErrorResponse(response, 2, `Could not expand variable: ${e}`);
			}
		} catch (err) {
			this.sendErrorResponse(response, 1, `Could not expand variable: ${err}`);
		}
	}

	//---- helpers

	private createSource(filePath: string): Source {
		return new Source(path.basename(filePath), filePath);
	}
}

// gdb(cygwin)->windows
function normalizePath(filePath: string): string {
	return filePath; // not needed with MinGW

	if(filePath.startsWith('disassembly:') || filePath.startsWith('examinememory:'))
		return filePath;

	let converted = filePath.replace(/\/+/g, path.sep);
	if(converted.toLowerCase().startsWith('\\cygdrive\\'))
		converted = converted[10] + ':' + converted.substr(11);
	if(converted.length > 0 && converted[0] === '\\')
		converted = 'c:\\cygwin64' + converted;
	return converted;
}

// windows->gdb(cygwin)
function unnormalizePath(filePath: string): string {
	return filePath; // not needed with MinGW

	if(filePath.startsWith('disassembly:') || filePath.startsWith('examinememory:'))
		return filePath;

	let converted = filePath.replace(/\\+/g, '/');
	if(converted.toLowerCase().startsWith('c:/cygwin64'))
		converted = converted.substr(11 /* "c:/cygwin64" */);
	else if(converted.length > 2 && converted[1] === ':')
		converted = '/cygdrive/' + converted[0] + '/' + converted.substr(2);
	return converted;
}

function prettyStringArray(strings) {
	if (typeof strings === 'object') {
		if (strings.length !== undefined) {
			return strings.join(', ');
		} else {
			return JSON.stringify(strings);
		}
	} else { return strings; }
}
