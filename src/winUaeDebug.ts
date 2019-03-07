import { Logger, logger, DebugSession, LoggingDebugSession, InitializedEvent, TerminatedEvent, ContinuedEvent, OutputEvent, Thread, ThreadEvent, StackFrame, Scope, Source, Handles, Event, StoppedEvent, BreakpointEvent } from 'vscode-debugadapter';
import { DebugProtocol } from 'vscode-debugprotocol';
import { MI2 } from './backend/mi2/mi2';
import { Breakpoint, IBackend, Variable, VariableObject, MIError } from './backend/backend';
import { MINode } from './backend/mi_parse';
import { expandValue, isExpandable } from './backend/gdb_expansion';

import * as fs from 'fs';
import { basename } from 'path';

//import { SymbolTable } from './backend/symbols';
//import { SymbolInformation, SymbolScope, SymbolType, DisassemblyInstruction } from './symbols';

interface LaunchRequestArguments extends DebugProtocol.LaunchRequestArguments {
	/** An absolute path to the "program" to debug. */
	program: string;
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

export class WinUaeDebugSession extends LoggingDebugSession {
	private args: LaunchRequestArguments;
	//	private symbolTable: SymbolTable;

    protected variableHandles = new Handles<string | VariableObject | ExtendedVariable>(VAR_HANDLES_START);
    protected variableHandlesReverse: { [id: string]: number } = {};
	protected quit: boolean;
	protected started: boolean;
	protected crashed: boolean;
	protected debugReady: boolean;
	protected miDebugger: MI2;
	protected forceDisassembly: boolean = false;
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
		response.body.supportsHitConditionalBreakpoints = true;
		response.body.supportsConfigurationDoneRequest = true;
		response.body.supportsConditionalBreakpoints = true;
		response.body.supportsFunctionBreakpoints = true;
		response.body.supportsEvaluateForHovers = true;
		response.body.supportsSetVariable = true;
		response.body.supportsRestartRequest = true;
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
			'interpreter-exec console "target remote localhost:2345"',
			'exec-continue' // no stop on entry
		];

		this.miDebugger.connect(".", this.args.program, commands).then(() => {
			this.started = true;
			this.sendResponse(response);
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

	protected setFunctionBreakPointsRequest(
		response: DebugProtocol.SetFunctionBreakpointsResponse,
		args: DebugProtocol.SetFunctionBreakpointsArguments
	): void {
		const createBreakpoints = async (shouldContinue) => {
			const all: Promise<Breakpoint | null>[] = [];
			args.breakpoints.forEach((brk) => {
				all.push(this.miDebugger.addBreakPoint({ raw: brk.name, condition: brk.condition, countCondition: brk.hitCondition }));
			});

			try {
				let brkpoints = await Promise.all(all);
				const finalBrks: DebugProtocol.Breakpoint[] = [];
				brkpoints.forEach((brkp) => {
					if (brkp) { finalBrks.push({ verified: true, line: brkp.line || -1 }); }
				});
				response.body = {
					breakpoints: finalBrks
				};
				this.sendResponse(response);
			}
			catch (msg) {
				this.sendErrorResponse(response, 10, msg.toString());
			}
			if (shouldContinue) {
				await this.miDebugger.sendCommand('exec-continue');
			}
		};

		const process = async () => {
			if (this.stopped) { await createBreakpoints(false); }
			else {
				this.miDebugger.sendCommand('exec-interrupt');
				this.miDebugger.once('generic-stopped', () => { createBreakpoints(true); });
			}
		};

		if (this.debugReady) { process(); }
		else { this.miDebugger.once('debug-ready', process); }
	}

	protected setBreakPointsRequest(response: DebugProtocol.SetBreakpointsResponse, args: DebugProtocol.SetBreakpointsArguments) {
		const createBreakpoints = async (shouldContinue) => {
			this.debugReady = true;
			const currentBreakpoints = (this.breakpointMap.get(args.source.path || "") || []).map((bp) => bp.number || -1);

			try {
				await this.miDebugger.removeBreakpoints(currentBreakpoints);
				this.breakpointMap.set(args.source.path || "", []);

				const all: Array<Promise<Breakpoint | null>> = [];
				const sourcepath = decodeURIComponent(args.source.path || "");
/*
				if (sourcepath.startsWith('disassembly:/')) {
					let sidx = 13;
					if (sourcepath.startsWith('disassembly:///')) { sidx = 15; }
					const path = sourcepath.substring(sidx, sourcepath.length - 6); // Account for protocol and extension
					const parts = path.split('::');
					let func: string;
					let file: string;

					if (parts.length === 2) {
						func = parts[1];
						file = parts[0];
					}
					else {
						func = parts[0];
					}

					const symbol: SymbolInformation = await this.getDisassemblyForFunction(func, file);

					args.breakpoints.forEach((brk) => {
						if (brk.line <= symbol.instructions.length) {
							const line = symbol.instructions[brk.line - 1];
							all.push(this.miDebugger.addBreakPoint({
								file: args.source.path,
								line: brk.line,
								condition: brk.condition,
								countCondition: brk.hitCondition,
								raw: line.address
							}));
						}
					});
				}
				else*/ {
					if (args.breakpoints) {
						args.breakpoints.forEach((brk) => {
							all.push(this.miDebugger.addBreakPoint({
								file: args.source.path,
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

				this.breakpointMap.set(args.source.path || "", finalBrks);
				this.sendResponse(response);
			}
			catch (msg) {
				this.sendErrorResponse(response, 9, msg.toString());
			}

			if (shouldContinue) {
				await this.miDebugger.sendCommand('exec-continue');
			}
		};

		const process = async () => {
			if (this.stopped) {
				await createBreakpoints(false);
			}
			else {
				await this.miDebugger.sendCommand('exec-interrupt');
				this.miDebugger.once('generic-stopped', () => { createBreakpoints(true); });
			}
		};

		if (this.debugReady) { process(); }
		else { this.miDebugger.once('debug-ready', process); }
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

    private createVariable(arg, options?): number {
        if (options) {
            return this.variableHandles.create(new ExtendedVariable(arg, options));
        }
        else {
            return this.variableHandles.create(arg);
        }
    }

    private findOrCreateVariable(varObj: VariableObject): number {
        let id: number;
        if (this.variableHandlesReverse.hasOwnProperty(varObj.name)) {
            id = this.variableHandlesReverse[varObj.name];
        }
        else {
            id = this.createVariable(varObj);
            this.variableHandlesReverse[varObj.name] = id;
        }
        return varObj.isCompound() ? id : 0;
    }

    protected scopesRequest(response: DebugProtocol.ScopesResponse, args: DebugProtocol.ScopesArguments): void {
        const scopes = new Array<Scope>();
        scopes.push(new Scope('Local', parseInt(args.frameId as any), false));
        scopes.push(new Scope('Global', GLOBAL_HANDLE_ID, false));
        scopes.push(new Scope('Static', STATIC_HANDLES_START + parseInt(args.frameId as any), false));

        response.body = {
            scopes: scopes
        };
        this.sendResponse(response);
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
					}
					catch (err) {
						if (err instanceof MIError && err.message === 'Variable object not found') {
							varObj = await this.miDebugger.varCreate(variable.name, varObjName);
							const varId = this.findOrCreateVariable(varObj);
							varObj.exp = variable.name;
							varObj.id = varId;
						}
						else {
							throw err;
						}
					}
					variables.push(varObj.toProtocolVariable());
				}
				catch (err) {
					variables.push({
						name: variable.name,
						value: `<${err}>`,
						variablesReference: 0
					});
				}
			}
			response.body = {
				variables: variables
			};
			this.sendResponse(response);
		}
		catch (err) {
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
				}
				else {
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
			}
			catch (e) {
				this.sendErrorResponse(response, 2, `Could not expand variable: ${e}`);
			}
		}
		catch (err) {
			this.sendErrorResponse(response, 1, `Could not expand variable: ${err}`);
		}
	}

	protected async variablesRequest(response: DebugProtocol.VariablesResponse, args: DebugProtocol.VariablesArguments): Promise<void> {
		let id: number | string | VariableObject | ExtendedVariable;

/*		if (args.variablesReference === GLOBAL_HANDLE_ID) {
			return this.globalVariablesRequest(response, args);
		}
		else if (args.variablesReference >= STATIC_HANDLES_START && args.variablesReference <= STATIC_HANDLES_FINISH) {
			const frameId = args.variablesReference & 0xFF;
			const threadId = (args.variablesReference & 0xFF00) >>> 8;
			return this.staticVariablesRequest(threadId, frameId, response, args);
		}
		else*/ if (args.variablesReference >= STACK_HANDLES_START && args.variablesReference < STATIC_HANDLES_START) {
			const frameId = args.variablesReference & 0xFF;
			const threadId = (args.variablesReference & 0xFF00) >>> 8;
			return this.stackVariablesRequest(threadId, frameId, response, args);
		}
		else {
			id = this.variableHandles.get(args.variablesReference);

			if (typeof id === 'string') {
				return this.variableMembersRequest(id, response, args);
			}
			else if (typeof id === 'object') {
				if (id instanceof VariableObject) {
					let pvar = id as VariableObject;
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
							}
							else {
								child.fullExp = `${pvar.fullExp || pvar.exp}.${child.exp}`;
							}
							return child.toProtocolVariable();
						});

						response.body = {
							variables: vars
						};
						this.sendResponse(response);
					}
					catch (err) {
						this.sendErrorResponse(response, 1, `Could not expand variable: ${err}`);
					}
				}
				else if (id instanceof ExtendedVariable) {
					const variables: DebugProtocol.Variable[] = [];

					const varReq = id;
					if (varReq.options.arg) {
						const strArr:any[] = [];
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
								}
								else {
									if (typeof expanded === 'string') {
										if (expanded === '<nullptr>') {
											if (argsPart) { argsPart = false; }
											else { return submit(); }
										}
										else if (expanded[0] !== '"') {
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
									}
									else {
										strArr.push({
											name: '[err]',
											value: expanded,
											variablesReference: 0
										});
										submit();
									}
								}
							}
							catch (e) {
								this.sendErrorResponse(response, 14, `Could not expand variable: ${e}`);
							}
						};
						addOne();
					}
					else {
						this.sendErrorResponse(response, 13, `Unimplemented variable request options: ${JSON.stringify(varReq.options)}`);
					}
				}
				else {
					response.body = {
						variables: id
					};
					this.sendResponse(response);
				}
			}
			else {
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

	protected async stepInRequest(response: DebugProtocol.NextResponse, args: DebugProtocol.NextArguments): Promise<void> {
		try {
			let assemblyMode = this.forceDisassembly;
			/*			if (!assemblyMode) {
							const frame = await this.miDebugger.getFrame(args.threadId, 0);
							assemblyMode = !(await this.checkFileExists(frame.file));
			
							if (this.activeEditorPath && this.activeEditorPath.startsWith('disassembly:///')) {
								const symbolInfo = this.symbolTable.getFunctionByName(frame.function, frame.fileName);
								let url: string;
								if (symbolInfo.scope !== SymbolScope.Global) {
									url = `disassembly:///${symbolInfo.file}::${symbolInfo.name}.cdasm`;
								}
								else {
									url = `disassembly:///${symbolInfo.name}.cdasm`;
								}
								if (url === this.activeEditorPath) { assemblyMode = true; }
							}
						}
			*/
			const done = await this.miDebugger.step(args.threadId, assemblyMode);
			this.sendResponse(response);
		}
		catch (msg) {
			this.sendErrorResponse(response, 6, `Could not step over: ${msg}`);
		}
	}

	protected stepOutRequest(response: DebugProtocol.NextResponse, args: DebugProtocol.NextArguments): void {
		this.miDebugger.stepOut(args.threadId).then((done) => {
			this.sendResponse(response);
		}, (msg) => {
			this.sendErrorResponse(response, 5, `Could not step out: ${msg}`);
		});
	}

	protected async nextRequest(response: DebugProtocol.NextResponse, args: DebugProtocol.NextArguments): Promise<void> {
		try {
			let assemblyMode = this.forceDisassembly;
			/*			if (!assemblyMode) {
							const frame = await this.miDebugger.getFrame(args.threadId, 0);
							assemblyMode = !(await this.checkFileExists(frame.file));
			
							if (this.activeEditorPath && this.activeEditorPath.startsWith('disassembly:///')) {
								const symbolInfo = this.symbolTable.getFunctionByName(frame.function, frame.fileName);
								let url: string;
								if (symbolInfo.scope !== SymbolScope.Global) {
									url = `disassembly:///${symbolInfo.file}::${symbolInfo.name}.cdasm`;
								}
								else {
									url = `disassembly:///${symbolInfo.name}.cdasm`;
								}
								if (url === this.activeEditorPath) { assemblyMode = true; }
							}
						}
			*/
			const done = await this.miDebugger.next(args.threadId, assemblyMode);
			this.sendResponse(response);
		}
		catch (msg) {
			this.sendErrorResponse(response, 6, `Could not step over: ${msg}`);
		}
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

function prettyStringArray(strings) {
    if (typeof strings === 'object') {
        if (strings.length !== undefined) {
            return strings.join(', ');
        }
        else {
            return JSON.stringify(strings);
        }
    }
    else { return strings; }
}
