import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as util from 'util';
import * as vscode from 'vscode';
import { ContinuedEvent, Event, Handles, InitializedEvent, Logger, logger, LoggingDebugSession, OutputEvent, Scope, Source, StackFrame, StoppedEvent, TerminatedEvent, Thread, ThreadEvent } from 'vscode-debugadapter';
import { DebugProtocol } from 'vscode-debugprotocol';
import { Breakpoint, MIError, Variable, VariableObject, Watchpoint } from './backend/backend';
import { expandValue } from './backend/gdb_expansion';
import { MI2 } from './backend/mi2';
import { MINode } from './backend/mi_parse';
import { Profiler, SourceMap, UnwindTable, ProfileFrame, ProfileFile, Disassemble } from './backend/profile';
import { SymbolTable } from './backend/symbols';
import { DisassemblyInstruction, SourceLineWithDisassembly, SymbolInformation, SymbolScope } from './symbols';
import { hexFormat } from './utils';

// global debug switch
const DEBUG = false;

interface LaunchRequestArguments extends DebugProtocol.LaunchRequestArguments {
	config?: string; // A500 (default), A1200, etc.
	program: string; // An absolute path to the "program" to debug. basename only; .elf and .exe will be added respectively to find ELF and Amiga-HUNK file
	kickstart?: string; // An absolute path to a Kickstart ROM; if not specified, AROS will be used
	cpuboard?: string; // An absolute path to a CPU Board Expansion ROM
	endcli?: boolean;
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

class CustomOutputEvent extends OutputEvent {
	constructor(output: string, category?: string, data?: any) {
		super(output, category, data);
		this.event = 'custom-output';
	}
}

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

let winuae: childProcess.ChildProcess;
let gdb: childProcess.ChildProcess;

export class AmigaDebugSession extends LoggingDebugSession {
	protected variableHandles = new Handles<string | VariableObject | ExtendedVariable>(VAR_HANDLES_START);
	protected variableHandlesReverse: { [id: string]: number } = {};
	protected quit: boolean;
	protected started: boolean;
	protected firstBreak: boolean = true;
	protected crashed: boolean;
	protected debugReady: boolean;
	protected miDebugger: MI2;
	protected forceDisassembly: boolean = false;
	protected activeEditorPath: string | null = null;
	protected currentThreadId: number = 1;

	protected breakpointMap: Map<string, Breakpoint[]> = new Map();
	protected watchpoints: Watchpoint[] = [];
	protected fileExistsCache: Map<string, boolean> = new Map();

	private args: LaunchRequestArguments;
	private symbolTable: SymbolTable;

	// we may need to temporarily stop the target when setting breakpoints; don't let VSCode let it know though,
	// it will send requests for threads and registers, they will fail because we already continued..
	protected disableSendStoppedEvents = false;
	private stopped: boolean = false;
	private stoppedReason: string = '';
	private stoppedEventPending = false;

	private currentFile: string;

	public constructor() {
		super("amiga-debug.txt");
	}

	protected initDebugger() {
		this.miDebugger.on('launcherror', this.launchErrorEvent.bind(this));
		this.miDebugger.on('quit', this.quitEvent.bind(this));
		this.miDebugger.on('exited-normally', this.quitEvent.bind(this));
		this.miDebugger.on('stopped', this.stopEvent.bind(this));
		this.miDebugger.on('msg', this.msgEvent.bind(this));
		this.miDebugger.on('breakpoint', this.breakpointEvent.bind(this));
		this.miDebugger.on('watchpoint', this.watchpointEvent.bind(this));
		this.miDebugger.on('step-end', this.stepEndEvent.bind(this));
		this.miDebugger.on('step-out-end', this.stepEndEvent.bind(this));
		this.miDebugger.on('signal-stop', this.signalStopEvent.bind(this));
		this.miDebugger.on('running', this.runningEvent.bind(this));
		this.miDebugger.on('thread-created', this.threadCreatedEvent.bind(this));
		this.miDebugger.on('thread-exited', this.threadExitedEvent.bind(this));
		this.miDebugger.on('thread-selected', this.threadSelectedEvent.bind(this));
		this.sendEvent(new InitializedEvent());
	}

	protected initializeRequest(response: DebugProtocol.InitializeResponse, args: DebugProtocol.InitializeRequestArguments): void {
		response.body = response.body || {};
		response.body.supportsHitConditionalBreakpoints = true;
		response.body.supportsConfigurationDoneRequest = true;
		response.body.supportsConditionalBreakpoints = true;
		response.body.supportsFunctionBreakpoints = true;
		response.body.supportsDataBreakpoints = true;
		response.body.supportsEvaluateForHovers = true;
		response.body.supportsSetVariable = true;
		response.body.supportsRestartRequest = true;
		this.sendResponse(response);
	}

	protected async launchRequest(response: DebugProtocol.LaunchResponse, args: LaunchRequestArguments): Promise<void> {
		logger.setup(Logger.LogLevel.Warn, false);
		if(DEBUG)
			logger.setup(Logger.LogLevel.Verbose, false);

		const binPath = await vscode.commands.executeCommand("amiga.bin-path") as string;
		const objdumpPath = path.join(binPath, "opt/bin/m68k-amiga-elf-objdump.exe");
		const dh0Path = path.join(binPath, "dh0");

		const gdbPath = path.join(binPath, "opt/bin/m68k-amiga-elf-gdb.exe");
		const gdbArgs = ['-q', '--interpreter=mi2'];

		const parseCfg = (str: string) => {
			const out = [];
			const lines = str.split(/[\r\n]+/g);
			const re = /^([^=]+)=(.*)$/i;
			for(const line of lines) {
				if(line.startsWith(';'))
					continue;
				const match = line.match(re);
				if(match) {
					out[match[1]] = match[2];
				}
			}
			return out;
		};
		const stringifyCfg = (cfg) => {
			let out: string = "";
			for (const [key, value] of Object.entries(cfg)) {
				out += key + '=' + cfg[key] + '\r\n';
			}
			return out;
		};

		const defaultPath = path.join(binPath, "default.uae");
		let config = [];
		try {
			config = parseCfg(fs.readFileSync(defaultPath, 'utf-8'));
		} catch(e) { /**/ }

		// mandatory
		config['use_gui'] = 'no';
		config['win32.start_not_captured'] = 'yes';
		config['win32.nonotificationicon'] = 'yes'; // tray icons remain after killing WinUAE, so just disable altogether
		config['boot_rom_uae'] = 'min'; // so we can control warp mode, KPrintF, debug overlay from within amiga executables

		// WinUAE: built_in_prefs
		switch(args.config?.toLowerCase()) {
		case 'a500':
		default:
			config['quickstart'] = 'a500,1'; // 1 = KS 1.3, ECS Agnus, 0.5M Chip + 0.5M Slow
			break;
		case 'a1200':
			config['quickstart'] = 'a1200,0'; // 68020, 2MB Chip
			break;
		case 'a1200-fast':
			config['quickstart'] = 'a1200,1'; // 68020, 2MB Chip 4MB FAST
			break;
		case 'a1200-030':
			config['quickstart'] = 'a1200,2'; // 68030, 2MB Chip 32MB FAST, Blizzard 1230-IV
			//config['quickstart'] = 'a1200,4'; // 68060, 2MB Chip 32MB FAST, Blizzard 1260
			//config['quickstart'] = 'a1200,3'; // 68040, 2MB Chip 32MB FAST, Blizzard 1260
			break;
		case 'a3000':
			config['quickstart'] = 'a3000,2'; // 68030, 2MB Chip
			break;
		case 'a4000':
			config['quickstart'] = 'a4000,0'; // 68030, 68882, 2MB Chip 8MB FAST
			//config['quickstart'] = 'a4000,1'; // 68040, 2MB Chip 8MB FAST
			break;
		}

		if(args.kickstart !== undefined) {
			if (!fs.existsSync(args.kickstart)) {
				this.sendErrorResponse(response, 103, `Unable to find Kickstart ROM at ${args.kickstart}.`);
				return;
			}
			config['kickstart_rom_file'] = args.kickstart;
		}

		if(args.cpuboard !== undefined) {
			if (!fs.existsSync(args.cpuboard)) {
				this.sendErrorResponse(response, 103, `Unable to find CPU Board Extension ROM at ${args.cpuboard}.`);
				return;
			}
			config['cpuboard_rom_file'] = args.cpuboard;
		}

		// nice
		config['cpu_cycle_exact'] = 'true';
		config['cpu_memory_cycle_exact'] = 'true';
		config['blitter_cycle_exact'] = 'true';
		config['cycle_exact'] = 'true';
		// optional
		config['input.config'] = '1';
		config['input.1.keyboard.0.friendlyname'] = 'WinUAE keyboard';
		config['input.1.keyboard.0.name'] = 'NULLKEYBOARD';
		config['input.1.keyboard.0.empty'] = 'false';
		config['input.1.keyboard.0.disabled'] = 'false';
		config['input.1.keyboard.0.button.41.GRAVE'] = 'SPC_SINGLESTEP.0';
		config['input.1.keyboard.0.button.201.PREV'] = 'SPC_WARP.0';
		// filesystems
		delete config['uaehf0'];
		delete config['uaehf1'];
		// delete old filesystem, then add new filesystem so order is correct in config (otherwise won't boot)
		delete config['filesystem'];
		delete config['filesystem2'];
		config['filesystem'] = 'rw,dh0:' + dh0Path;
		config['filesystem2'] = 'rw,dh1:dh1:' + path.dirname(args.program) + ',-128';
		// debugging options
		config['debugging_features'] = 'gdbserver';
		if(args.endcli)
			config['debugging_trigger'] = path.basename(args.program) + ".exe";
		else
			config['debugging_trigger'] = ':' + path.basename(args.program) + ".exe";

		try {
			fs.writeFileSync(defaultPath, stringifyCfg(config));
		} catch(e) {
			this.sendErrorResponse(response, 103, `Unable to write WinUAE config ${defaultPath}.`);
			return;
		}

		// all WinUAE options now in config file
		const winuaePath = path.join(binPath, "winuae-gdb.exe");
		const winuaeArgs = [ '-portable' ];

		this.args = args;
		this.symbolTable = new SymbolTable(objdumpPath, args.program + ".elf");
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

		const ssPath = path.join(dh0Path, "s/startup-sequence");
		try {
			if(args.endcli)
				fs.writeFileSync(ssPath, `cd dh1:\nrun >nil: <nil: ${config['debugging_trigger']} >nil: <nil:\nendcli >nil:\n`);
			else
				fs.writeFileSync(ssPath, 'cd dh1:\n' + config['debugging_trigger']);
		} catch (err) {
			this.sendErrorResponse(response, 103, `Failed to rewrite startup sequence at ${ssPath}. ${err.toString()}`);
			return;
		}

		this.quit = false;
		this.started = false;
		this.crashed = false;
		this.debugReady = false;
		this.stopped = false;

		// kill leftover WinUAE & GDB process
		if(winuae !== undefined) {
			winuae.kill();
			winuae = undefined;
		}
		if(gdb !== undefined) {
			gdb.kill();
			gdb = undefined;
		}

		// launch WinUAE
		winuae = childProcess.spawn(winuaePath, winuaeArgs, { stdio: 'ignore', detached: true });

		// init debugger
		this.miDebugger = new MI2(gdbPath, gdbArgs);
		this.miDebugger.procEnv = { XDG_CACHE_HOME: gdbPath }; // to shut up GDB about index cache directory
		this.initDebugger();

		if(DEBUG) {
			//this.miDebugger.printCalls = true;
			//this.miDebugger.debugOutput = true;
			//this.miDebugger.trace = true;
		}

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
			gdb = this.miDebugger.process;
			this.debugReady = true;
		});
		const commands = [
			'enable-pretty-printing',
			//'interpreter-exec console "set debug remote 1"',
			'interpreter-exec console "target remote localhost:2345"',
		];

		// launch GDB and connect to WinUAE
		this.miDebugger.connect(".", this.args.program + ".elf", commands).catch((err) => {
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
				if(!this.stopped) return;
				this.customReadMemoryRequest(response, args['address'], args['length']);
				break;
			case 'write-memory':
				if(!this.stopped) return;
				this.customWriteMemoryRequest(response, args['address'], args['data']);
				break;
			case 'read-registers':
				if(!this.stopped) return;
				this.customReadRegistersRequest(response);
				break;
			case 'read-register-list':
				if(!this.stopped) return;
				this.customReadRegisterListRequest(response);
				break;
			case 'amiga-disassemble':
				this.customDisassembleRequest(response, args);
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
			case 'start-profile':
				this.customStartProfileRequest(response, args, true);
				break;
			default:
				response.body = { error: 'Invalid command.' };
				this.sendResponse(response);
				break;
		}
	}

	protected async customDisassembleRequest(response: DebugProtocol.Response, args: any): Promise<void> {
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
			let funcInfo = this.symbolTable.getFunctionAtAddress(args.startAddress, true);
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

	protected customReadMemoryRequest(response: DebugProtocol.Response, startAddress: number, length: number) {
		const address = hexFormat(startAddress, 8);
		this.miDebugger.sendCommand(`data-read-memory-bytes ${address} ${length}`).then((node) => {
			const startAddress2 = node.resultRecords.results[0][1][0][0][1];
			const endAddress = node.resultRecords.results[0][1][0][2][1];
			const data = node.resultRecords.results[0][1][0][3][1];
			const bytes = data.match(/[0-9a-f]{2}/g).map((b) => parseInt(b, 16));
			response.body = {
				startAddress2,
				endAddress,
				bytes
			};
			this.sendResponse(response);
		}, (error) => {
			response.body = { error };
			this.sendErrorResponse(response, 114, `Unable to read memory: ${error.toString()}`);
		});
	}

	protected customWriteMemoryRequest(response: DebugProtocol.Response, startAddress: number, data: string) {
		const address = hexFormat(startAddress, 8);
		this.miDebugger.sendCommand(`data-write-memory-bytes ${address} ${data}`).then((node) => {
			this.sendResponse(response);
		}, (error) => {
			response.body = { error };
			this.sendErrorResponse(response, 114, `Unable to write memory: ${error.toString()}`);
		});
	}

	protected async customStartProfileRequest(response: DebugProtocol.Response, args: any, autoStop: boolean) {
		try {
			if(autoStop && !this.stopped) {
				// GDB reports stopping of target after a while
				const oldListenersStop = this.miDebugger.listeners("signal-stop");
				const oldListenersRun = this.miDebugger.listeners("running");
				this.miDebugger.removeAllListeners("signal-stop");
				this.miDebugger.removeAllListeners("running");
				this.miDebugger.once("signal-stop", async () => {
					// try again after target execution has stopped
					await this.customStartProfileRequest(response, args, false);
					this.miDebugger.continue(this.currentThreadId);
				});
				this.miDebugger.once("running", async () => {
					for(const l of oldListenersStop) {
						// @ts-ignore
						this.miDebugger.addListener("signal-stop", l);
					}
					for(const l of oldListenersRun) {
						// @ts-ignore
						this.miDebugger.addListener("running", l);
					}
				});
				await this.miDebugger.interrupt(this.currentThreadId);
				return;
			}

			await vscode.window.withProgress({
				location: vscode.ProgressLocation.Notification,
				title: "Profiling"
			}, async (progress, token) => {
				const numFrames = args?.numFrames || 1;

				const binPath = await vscode.commands.executeCommand("amiga.bin-path") as string;
				const addr2linePath = path.join(binPath, "opt/bin/m68k-amiga-elf-addr2line.exe");
				const objdumpPath = path.join(binPath, "opt/bin/m68k-amiga-elf-objdump.exe");

				const date = new Date();
				const dateString = date.getFullYear().toString() + "." + (date.getMonth()+1).toString().padStart(2, '0') + "." + date.getDate().toString().padStart(2, '0') + "-" + 
					date.getHours().toString().padStart(2, '0') + "." + date.getMinutes().toString().padStart(2, '0') + "." + date.getSeconds().toString().padStart(2, '0');

				const tmp = path.join(os.tmpdir(), `amiga-profile-${dateString}`);

				// write unwind table for WinUAE
				const unwind = new UnwindTable(objdumpPath, this.args.program + ".elf", this.symbolTable);
				fs.writeFileSync(tmp + ".unwind", unwind.unwind);

				progress.report({ message: 'Starting profile...'});

				const debuggerProgress = (type: string, message: string) => {
					if(message.startsWith("PRF: ")) {
						const match = message.match(/(\d+)\/(\d+)/);
						if(match)
							progress.report({ increment: 100 / parseInt(match[2]), message: `Profiling frame ${match[1]} of ${match[2]} `});
						else
							progress.report({ message });
					}
				};

				this.miDebugger.on('msg', debuggerProgress);

				// path to profile file
				const tmpQuoted = tmp.replace(/\\/g, '\\\\');
				await this.miDebugger.sendUserInput(`monitor profile ${numFrames} "${tmpQuoted}.unwind" "${tmpQuoted}"`);
				if(!DEBUG)
					fs.unlinkSync(tmp + ".unwind");

				progress.report({ message: 'Reading profile...'});

				// read profile file
				const profileArchive = new ProfileFile(tmp);
				if(!DEBUG)
					fs.unlinkSync(tmp);

				// resolve and generate output
				const sourceMap = new SourceMap(addr2linePath, this.args.program + ".elf", this.symbolTable);
				const profiler = new Profiler(sourceMap, this.symbolTable);
				progress.report({ message: 'Writing profile...'});
				fs.writeFileSync(tmp + ".amigaprofile", profiler.profileTime(profileArchive, Disassemble(objdumpPath, this.args.program + ".elf")));

				// open output
				await vscode.commands.executeCommand("vscode.open", vscode.Uri.file(tmp + ".amigaprofile"), { preview: false } as vscode.TextDocumentShowOptions);
				this.miDebugger.off('msg', debuggerProgress);
			});
			this.sendResponse(response);
		} catch (error) {
			response.body = { error };
			this.sendErrorResponse(response, 114, `Unable to start profiling: ${error.toString()}`);
		}
	}

	protected customReadRegistersRequest(response: DebugProtocol.Response) {
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

	protected customReadRegisterListRequest(response: DebugProtocol.Response) {
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
		const done = () => {
			if(winuae)
				winuae.kill();
			this.sendResponse(response);
			vscode.commands.executeCommand("workbench.view.explorer");
		};

		if (this.miDebugger) {
			this.miDebugger.abort(this.stopped === false).then(done);
		} else {
			done();
		}
	}

	protected msgEvent(type: string, msg: string) {
		//console.log("msgEvent", type, msg);
		if(type === 'console' || type === 'log') {
			// send GDB console output and debugger log to 'Amiga' output channel (not debug console)
			this.sendEvent(new CustomOutputEvent(msg, type));
		} else {
			if (type === 'target') {
				if(msg.startsWith("DBG: ")) { // user output (KPrintF, etc.)
					msg = msg.substr(5); // remove "DBG: " prefix added by uaelib.cpp
					type = 'stdout';
				} else if(msg.startsWith("PRF: ")) { // don't display profiler output, handled by profiler
					return;
				} else { // WinUAE output
					type = 'stderr';
				}
			}
			this.sendEvent(new OutputEvent(msg, type));
		}
	}

	// events from miDebugger
	protected runningEvent(info: MINode) {
		this.stopped = false;
		this.sendEvent(new ContinuedEvent(this.currentThreadId));
		this.sendEvent(new CustomContinuedEvent(this.currentThreadId, true));
	}

	protected breakpointEvent(info: MINode) {
		this.stopped = true;
		this.stoppedReason = 'breakpoint';
		if(!this.disableSendStoppedEvents) {
			this.sendEvent(new StoppedEvent(this.stoppedReason, this.currentThreadId));
			this.sendEvent(new CustomStoppedEvent(this.stoppedReason, this.currentThreadId));
		} else {
			this.stoppedEventPending = true;			
		}
	}

	protected watchpointEvent(info: MINode) {
		this.stopped = true;
		this.stoppedReason = 'data breakpoint';
		if(!this.disableSendStoppedEvents) {
			this.sendEvent(new StoppedEvent(this.stoppedReason, this.currentThreadId));
			this.sendEvent(new CustomStoppedEvent(this.stoppedReason, this.currentThreadId));
		} else {
			this.stoppedEventPending = true;			
		}
	}

	protected stepEndEvent(info: MINode) {
		this.stopped = true;
		this.stoppedReason = 'step';
		if(!this.disableSendStoppedEvents) {
			this.sendEvent(new StoppedEvent(this.stoppedReason, this.currentThreadId));
			this.sendEvent(new CustomStoppedEvent(this.stoppedReason, this.currentThreadId));
		} else {
			this.stoppedEventPending = true;			
		}
	}

	protected signalStopEvent(info: MINode) {
		const signalName = info.record('signal-name');
		//const signalMeaning = info.record('signal-meaning');
		if(signalName === 'SIGEMT')
			this.stoppedReason = 'TRAP #7 (undefined behavior)';
		else if(signalName === 'SIGSEGV')
			this.stoppedReason = 'NULL access (undefined behavior)';
		else if(signalName === 'SIGBUS')
			this.stoppedReason = 'address error';
		else
			this.stoppedReason = 'user request';
		this.stopped = true;
		if(!this.disableSendStoppedEvents) {
			this.sendEvent(new StoppedEvent(this.stoppedReason, this.currentThreadId));
			this.sendEvent(new CustomStoppedEvent(this.stoppedReason, this.currentThreadId));
		} else {
			this.stoppedEventPending = true;			
		}
	}

	protected threadCreatedEvent(info: { threadId: number, threadGroupId: number }) {
		this.sendEvent(new ThreadEvent('started', info.threadId));
	}

	protected threadExitedEvent(info: { threadId: number, threadGroupId: number }) {
		this.sendEvent(new ThreadEvent('exited', info.threadId));
		this.quitEvent();
	}

	protected threadSelectedEvent(info: { threadId: number }) {
		this.currentThreadId = info.threadId;
		this.sendEvent(new ThreadEvent('selected', info.threadId));
	}

	protected stopEvent(info: MINode) {
		if (!this.started) { this.crashed = true; }
		if (!this.quit) {
			if(this.firstBreak) {
				// ignore break-at-main
				this.firstBreak = false;
				this.stopped = true;
				this.stoppedReason = 'entry';
				// configurationDoneEvent will issue a 'continue' command
			} else {
				this.stopped = true;
				this.stoppedReason = 'exception';
				this.sendEvent(new StoppedEvent(this.stoppedReason, this.currentThreadId));
				this.sendEvent(new CustomStoppedEvent(this.stoppedReason, this.currentThreadId));
			}
		}
	}

	protected quitEvent() {
		this.quit = true;
		this.sendEvent(new TerminatedEvent());
	}

	protected launchErrorEvent(err: any) {
		this.msgEvent('stderr', 'Could not start debugger process, does the program exist in filesystem?\n');
		this.msgEvent('stderr', err.toString() + '\n');
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
			this.disableSendStoppedEvents = false;
			const all: Array<Promise<Breakpoint | null>> = [];
			args.breakpoints.forEach((brk) => {
				all.push(this.miDebugger.addBreakpoint({ raw: brk.name, condition: brk.condition, countCondition: brk.hitCondition }));
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
				this.disableSendStoppedEvents = true;
				this.miDebugger.once('generic-stopped', () => { createBreakpoints(true); });
				this.miDebugger.sendCommand('exec-interrupt');
			}
		};

		if (this.debugReady) { process(); } else { this.miDebugger.once('debug-ready', process); }
	}

	protected setBreakPointsRequest(response: DebugProtocol.SetBreakpointsResponse, args: DebugProtocol.SetBreakpointsArguments) {
		const createBreakpoints = async (shouldContinue: boolean) => {
			this.debugReady = true;
			const currentBreakpoints = (this.breakpointMap.get(args.source.path) || [])
				.filter((bp) => bp.line !== undefined)
				.map((bp) => bp.number!);

			try {
				this.disableSendStoppedEvents = false;
				await this.miDebugger.removeBreakpoints(currentBreakpoints);
				this.breakpointMap.set(args.source.path, []);

				const all: Array<Promise<Breakpoint | null>> = [];
				const sourcepath = decodeURIComponent(args.source.path);
				if (sourcepath.startsWith('disassembly:/')) {
					let sidx = 13;
					if (sourcepath.startsWith('disassembly:///')) { sidx = 15; }
					const path2 = sourcepath.substring(sidx, sourcepath.length - 9 /* ".amigaasm" */); // Account for protocol and extension
					const parts = path2.split('::');
					let func: string;
					let file: string | undefined;

					if(parts.length === 1 && parts[0].startsWith('0x')) {
						if (args.breakpoints) {
							args.breakpoints.forEach((brk) => {
								all.push(this.miDebugger.addBreakpoint({
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
									all.push(this.miDebugger.addBreakpoint({
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
							all.push(this.miDebugger.addBreakpoint({
								file: args.source.path || "",
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

				this.breakpointMap.set(args.source.path, finalBrks);
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
				this.disableSendStoppedEvents = true;
				this.miDebugger.once('generic-stopped', () => { createBreakpoints(true); });
				await this.miDebugger.sendCommand('exec-interrupt');
			}
		};

		if (this.debugReady) { process(); } else { this.miDebugger.once('debug-ready', process); }
	}

	protected async dataBreakpointInfoRequest(response: DebugProtocol.DataBreakpointInfoResponse, args: DebugProtocol.DataBreakpointInfoArguments, request?: DebugProtocol.Request): Promise<void> {
		let name = args.name;
		if (args.variablesReference >= VAR_HANDLES_START) {
			const parent = this.variableHandles.get(args.variablesReference) as VariableObject;
			name = `${parent.exp}.${name}`;
		}

		response.body = {
			dataId: name,
			description: `When ${name} changes`,
			accessTypes: ['read', 'write', 'readWrite']
		};
		this.sendResponse(response);
	}

	protected async setDataBreakpointsRequest(response: DebugProtocol.SetDataBreakpointsResponse, args: DebugProtocol.SetDataBreakpointsArguments, request?: DebugProtocol.Request): Promise<void> {
		// clear old watchpoints
		try {
		await this.miDebugger.removeBreakpoints(this.watchpoints.map((wp) => wp.number!));
		this.watchpoints = [];

		// add new watchpoints
		const all: Array<Promise<Watchpoint | null>> = [];
		if (args.breakpoints) {
			args.breakpoints.forEach((brk) => {
				all.push(this.miDebugger.addWatchpoint(brk.dataId, /*brk.accessType as string*/'write')); // hmm.. there seems to be a bug in VSCode where we don't get accessType
			});
		}
		this.watchpoints = await Promise.all(all);

		// response
		response.body = { breakpoints: [] };
		for(const wp of this.watchpoints) {
			response.body.breakpoints.push({
				id: wp.number,
				verified: true
			});
		}
		this.sendResponse(response);
		} catch (e) {
			this.sendErrorResponse(response, 1, `Unable to set data breakpoints: ${e}`);
		}
	}

	protected async threadsRequest(response: DebugProtocol.ThreadsResponse): Promise<void> {
		if (!this.stopped || this.disableSendStoppedEvents) {
			response.body = { threads: [ new Thread(1, 'Dummy') ] }; // dummy thread, otherwise "pause" doesn't work
			this.sendResponse(response);
		} else try {
			const threadIdNode = await this.miDebugger.sendCommand('thread-list-ids');
			const threadIds: number[] = threadIdNode.result('thread-ids').map((ti) => parseInt(ti[1]));
			const currentThread = threadIdNode.result('current-thread-id');

			if (!currentThread) {
				await this.miDebugger.sendCommand(`thread-select ${threadIds[0]}`);
				this.currentThreadId = threadIds[0];
			} else {
				this.currentThreadId = parseInt(currentThread);
			}

			if (this.stoppedEventPending) {
				this.stoppedEventPending = false;
				this.sendEvent(new StoppedEvent(this.stoppedReason, this.currentThreadId));
				this.sendEvent(new CustomStoppedEvent(this.stoppedReason, this.currentThreadId));
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
		if ((this.stopped === false) || this.disableSendStoppedEvents) {
			// Mar 20, 2020: A recent change in VSCode changed order of things. It is asking for stack traces when we are running
			// happens at the start of the session and runToMain is enabled. This causes falses popups/errors
			this.sendResponse(response);    // Send a blank response instead of an error
			return;
		}
		try {
			const maxDepth = await this.miDebugger.getStackDepth(args.threadId);
			const highFrame = Math.min(maxDepth, args.startFrame + args.levels) - 1;
			const stack = await this.miDebugger.getStack(args.threadId, args.startFrame, highFrame);
			const ret: StackFrame[] = [];
			for (const element of stack) {
				const stackId = (args.threadId << 8 | (element.level & 0xFF)) & 0xFFFF;
				let file;
				let disassemble = this.forceDisassembly || element.file === undefined;
				if (!disassemble) {
					file = element.file;
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
						let symbolInfo = await this.getDisassemblyForFunction(element.function, element.fileName);
						if(!symbolInfo) {
							// not found, this could be inlined function that no longer exists, so try by address instead
							const funcInfo = this.symbolTable.getFunctionAtAddress(parseInt(element.address.substr(2), 16), true);
							if(funcInfo)
								symbolInfo = await this.getDisassemblyForFunction(funcInfo.name, funcInfo.file);
						}

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
				stackFrames: ret,
				totalFrames: maxDepth
			};
			this.sendResponse(response);
		} catch (err) {
			if(this.stopped) // Between the time we asked for a info, a continue occured
				this.sendErrorResponse(response, 12, `Failed to get Stack Trace: ${err.toString()}`);
		}
	}

	protected async configurationDoneRequest(response: DebugProtocol.ConfigurationDoneResponse, args: DebugProtocol.ConfigurationDoneArguments): Promise<void> {
		//this.handleMsg("log", `configurationDoneRequest: stopped = ${this.stopped}\n`);
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
		if(!this.stopped) return;
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

	protected pauseRequest(response: DebugProtocol.PauseResponse, args: DebugProtocol.PauseArguments): void {
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
				assemblyMode = frame.file === undefined || !(await this.checkFileExists(frame.file));

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
			//const sr = parseInt(rv[1][1][1]);
			if(pc >= 0xF80000) {
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

		return new Promise((resolve2, reject) => {
			fs.exists(name, (exists) => {
				this.fileExistsCache.set(name, exists);
				resolve2(exists);
			});
		});
	}

	protected async evaluateRequest(response: DebugProtocol.EvaluateResponse, args: DebugProtocol.EvaluateArguments): Promise<void> {
		if(!this.stopped) return;
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

		symbol.lines = await this.getDisassemblyForAddresses(symbol.base + symbol.address, symbol.size);
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
		const asmInsn = parsed.resultRecords.results[0][1];
		const lines: SourceLineWithDisassembly[] = [];
		for(const ri of asmInsn) {
			if(ri[0] === "src_and_asm_line") {
				// mixed source and disassembly
				const srcAndAsmLine = ri[1];
				const line = MINode.valueOf(srcAndAsmLine, "line");
				const file = MINode.valueOf(srcAndAsmLine, "file");
				const fullname = MINode.valueOf(srcAndAsmLine, "fullname");
				const instructions: DisassemblyInstruction[] = [];
				const lineAsmInsn = MINode.valueOf(srcAndAsmLine, "line_asm_insn");
				let source = "";

				if(await this.checkFileExists(fullname)) {
					if(!fileCache.has(fullname)) {
						const data = await readFile(fullname);
						fileCache.set(fullname, data.toString().replace("\r", "").split("\n"));
					}
					const sourceLines = fileCache.get(fullname);
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
		if(!this.stopped) return;
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

function prettyStringArray(strings) {
	if (typeof strings === 'object') {
		if (strings.length !== undefined) {
			return strings.join(', ');
		} else {
			return JSON.stringify(strings);
		}
	} else { return strings; }
}
