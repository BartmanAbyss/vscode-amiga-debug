import { Logger, logger, DebugSession, LoggingDebugSession, InitializedEvent, TerminatedEvent, ContinuedEvent, OutputEvent, Thread, ThreadEvent, StackFrame, Scope, Source, Handles, Event, StoppedEvent, BreakpointEvent } from 'vscode-debugadapter';
import { DebugProtocol } from 'vscode-debugprotocol';
import { MI2 } from './backend/mi2/mi2';
import { Breakpoint, IBackend, Variable, VariableObject, MIError } from './backend/backend';
import { MINode } from './backend/mi_parse';
//import { expandValue, isExpandable } from './backend/gdb_expansion';

import * as fs from 'fs';
import { basename } from 'path'; 

//import { SymbolTable } from './backend/symbols';
//import { SymbolInformation, SymbolScope, SymbolType, DisassemblyInstruction } from './symbols';

interface LaunchRequestArguments extends DebugProtocol.LaunchRequestArguments {
	/** An absolute path to the "program" to debug. */
	program: string;
}

export class WinUaeDebugSession extends LoggingDebugSession {
	private args: LaunchRequestArguments;
	//	private symbolTable: SymbolTable;

	protected quit: boolean;
	protected started: boolean;
	protected crashed: boolean;
	protected debugReady: boolean;
	protected miDebugger: MI2;
	protected currentThreadId: number = 0;

	private stopped: boolean = false;
	private stoppedReason: string = '';

	protected breakpointMap: Map<string, Breakpoint[]> = new Map();
	protected fileExistsCache: Map<string, boolean> = new Map();

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
		//		response.body.supportsHitConditionalBreakpoints = true;
		response.body.supportsConfigurationDoneRequest = true;
		//		response.body.supportsConditionalBreakpoints = true;
		//		response.body.supportsFunctionBreakpoints = true;
		//		response.body.supportsEvaluateForHovers = true;
		//		response.body.supportsSetVariable = true;
		//		response.body.supportsRestartRequest = true;
		this.sendResponse(response);
	}

	protected launchRequest(response: DebugProtocol.LaunchResponse, args: LaunchRequestArguments): void {
		logger.setup(Logger.LogLevel.Verbose, false);

		this.args = args;
		//this.symbolTable = new SymbolTable(args.toolchainPath, args.executable);
		//this.symbolTable.loadSymbols();
		this.breakpointMap = new Map();
		this.fileExistsCache = new Map();

		if (!fs.existsSync(this.args.program)) {
			this.sendErrorResponse(response, 103, `Unable to find executable file at ${this.args.program}.`);
			return;
		}

		this.quit = false;
		this.started = false;
		this.crashed = false;
		this.debugReady = false;
		this.stopped = false;

		//let gdbargs = ['' '-q', '--interpreter=mi2'];
		this.miDebugger = new MI2("cmd.exe", ['/c', 'c:/cygwin64/home/Chuck/amiga_test/debug.cmd']);
		this.initDebugger();

		//this.miDebugger.printCalls = true;
		//this.miDebugger.debugOutput = true;

		this.miDebugger.once('debug-ready', () => {
			this.debugReady = true;
		});
		const commands = [
			`file-exec-and-symbols ${this.args.program}`,
			'enable-pretty-printing',
			'interpreter-exec console "target remote localhost:2345"'
		];

		this.miDebugger.connect(".", this.args.program, commands).then(() => {
			this.started = true;
			this.sendResponse(response);

/*			const launchComplete = () => {
				setTimeout(() => {
					this.stopped = true;
					this.stoppedReason = 'start';
					this.sendEvent(new StoppedEvent('start', this.currentThreadId));
				}, 50);
			};

			launchComplete();*/
		}, (err) => {
			this.sendErrorResponse(response, 103, `Failed to launch GDB: ${err.toString()}`);
		});
	}

	protected disconnectRequest(response: DebugProtocol.DisconnectResponse, args: DebugProtocol.DisconnectArguments): void {
		if (this.miDebugger) {
			this.miDebugger.stop();
		}
		this.sendResponse(response);
	}

	protected async threadsRequest(response: DebugProtocol.ThreadsResponse): Promise<void> {
		response.body = {
			threads: [
				new Thread(1, "thread 1")
			]
		};
		this.sendResponse(response);
	}

	protected async stackTraceRequest(response: DebugProtocol.StackTraceResponse, args: DebugProtocol.StackTraceArguments): Promise<void> {
		try {
			const stack = await this.miDebugger.getStack(args.threadId, args.startFrame, args.levels);
			const ret: StackFrame[] = [];
			for (const element of stack) {
				const stackId = (args.threadId << 8 | (element.level & 0xFF)) & 0xFFFF;
				const file = element.file;
				/*				let disassemble = this.forceDisassembly || !file;
								if (!disassemble) { disassemble = !(await this.checkFileExists(file)); }
								if (!disassemble && this.activeEditorPath && this.activeEditorPath.startsWith('disassembly:///')) {
									const symbolInfo = this.symbolTable.getFunctionByName(element.function, element.fileName);
									let url: string;
									if (symbolInfo) {
										if (symbolInfo.scope !== SymbolScope.Global) {
											url = `disassembly:///${symbolInfo.file}::${symbolInfo.name}.cdasm`;
										}
										else {
											url = `disassembly:///${symbolInfo.name}.cdasm`;
										}
										if (url === this.activeEditorPath) { disassemble = true; }
									}
								}
				*/
				try {
/*					if (disassemble) {
						const symbolInfo = await this.getDisassemblyForFunction(element.function, element.fileName);
						let line = -1;
						symbolInfo.instructions.forEach((inst, idx) => {
							if (inst.address === element.address) { line = idx + 1; }
						});

						if (line !== -1) {
							let fname: string;
							let url: string;
							if (symbolInfo.scope !== SymbolScope.Global) {
								fname = `${symbolInfo.file}::${symbolInfo.name}.cdasm`;
								url = `disassembly:///${symbolInfo.file}::${symbolInfo.name}.cdasm`;
							}
							else {
								fname = `${symbolInfo.name}.cdasm`;
								url = `disassembly:///${symbolInfo.name}.cdasm`;
							}

							ret.push(new StackFrame(stackId, `${element.function}@${element.address}`, new Source(fname, url), line, 0));
						}
						else {
							ret.push(new StackFrame(stackId, element.function + '@' + element.address, null, element.line, 0));
						}
					}
					else*/ {
						ret.push(new StackFrame(stackId, element.function + '@' + element.address, this.createSource(file), element.line, 0));
					}
				}
				catch (e) {
					ret.push(new StackFrame(stackId, element.function + '@' + element.address, undefined, element.line, 0));
				}
			}

			response.body = {
				stackFrames: ret
			};
			this.sendResponse(response);
		}
		catch (err) {
			this.sendErrorResponse(response, 12, `Failed to get Stack Trace: ${err.toString()}`);
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

	protected configurationDoneRequest(response: DebugProtocol.ConfigurationDoneResponse, args: DebugProtocol.ConfigurationDoneArguments): void {
		this.sendResponse(response);
	}

	protected handleMsg(type: string, msg: string) {
		if (type === 'target') { type = 'stdout'; }
		if (type === 'log') { type = 'stderr'; }
		this.sendEvent(new OutputEvent(msg, type));
	}

	protected handleRunning(info: MINode) {
		this.stopped = false;
		this.sendEvent(new ContinuedEvent(this.currentThreadId));
	}

	protected handleBreakpoint(info: MINode) {
		this.stopped = true;
		this.stoppedReason = 'breakpoint';
		this.sendEvent(new StoppedEvent('breakpoint', this.currentThreadId));
	}

	protected handleBreak(info: MINode) {
		this.stopped = true;
		this.stoppedReason = 'step';
		this.sendEvent(new StoppedEvent('step', this.currentThreadId));
	}

	protected handlePause(info: MINode) {
		this.stopped = true;
		this.stoppedReason = 'user request';
		this.sendEvent(new StoppedEvent('user request', this.currentThreadId));
	}

	protected handleThreadCreated(info: { threadId: number, threadGroupId: number }) {
		this.currentThreadId = info.threadId;
		this.sendEvent(new ThreadEvent('started', info.threadId));
	}

	protected handleThreadExited(info: { threadId: number, threadGroupId: number }) {
		this.sendEvent(new ThreadEvent('exited', info.threadId));
	}

	protected handleThreadSelected(info: { threadId: number }) {
		this.sendEvent(new ThreadEvent('selected', info.threadId));
	}

	protected stopEvent(info: MINode) {
		if (!this.started) { this.crashed = true; }
		if (!this.quit) {
			this.stopped = true;
			this.stoppedReason = 'exception';
			this.sendEvent(new StoppedEvent('exception', this.currentThreadId));
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

	//---- helpers

	private createSource(filePath: string): Source {
		const convertedPath = 'c:/cygwin64' + filePath;
		return new Source(basename(filePath), convertedPath);
	}
}

