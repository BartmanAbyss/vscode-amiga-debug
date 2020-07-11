'use strict';

import { AmigaDebugSession } from './amigaDebug';

import * as cp from 'child_process';
import * as fs from 'fs';
import * as Net from 'net';
import * as os from 'os';
import * as path from 'path';
import * as vscode from 'vscode';
import { CppToolsApi, Version, CustomConfigurationProvider, getCppToolsApi, SourceFileConfigurationItem, WorkspaceBrowseConfiguration, SourceFileConfiguration } from 'vscode-cpptools';
import { CancellationToken } from 'vscode-jsonrpc';

import { DisassemblyContentProvider } from './disassembly_content_provider';
import { MemoryContentProvider } from './memory_content_provider';
import { ProfileCodeLensProvider} from './profile_codelens_provider';
import { ProfileEditorProvider } from './profile_editor_provider';
import { AmigaAssemblyLanguageProvider } from './assembly_language_provider';
import { BaseNode as RBaseNode, RecordType as RRecordType, RegisterTreeProvider, TreeNode as RTreeNode } from './registers';
import { NumberFormat, SymbolInformation, SymbolScope } from './symbols';
import { SymbolTable } from './backend/symbols';
import { SourceMap, Profiler } from './backend/profile';

/*
 * Set the following compile time flag to true if the
 * debug adapter should run inside the extension host.
 * Please note: the test suite does not (yet) work in this mode.
 */
const EMBED_DEBUG_ADAPTER = true;

// .vscode/amiga.json
interface AmigaConfiguration {
	includePath?: string[];
	defines?: string[];
	shrinkler?: {
		[config: string]: string;
	};
}

class AmigaCppConfigurationProvider implements CustomConfigurationProvider {
	public compilerPath: string;
	constructor(extensionPath: string) {
		this.compilerPath = extensionPath + "\\bin\\opt\\bin\\m68k-amiga-elf-gcc.exe";
	}

	public readonly name = "Amiga C/C++";
	public readonly extensionId = "BartmanAbyss.amiga-debug";

	private config: AmigaConfiguration = {};

	public async init() {
		const workspaceFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;
		const jsonPath = path.join(workspaceFolder, ".vscode", "amiga.json");
		try {
			this.config = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
			for(let i = 0; i < this.config.includePath.length; i++) {
				this.config.includePath[i] = this.config.includePath[i].replace(/\$\{workspaceFolder\}/g, workspaceFolder);
			}
		} catch(e) { /**/ }
	}

	public async canProvideConfiguration(uri: vscode.Uri, token?: CancellationToken) {
		return true;
	}
	public async provideConfigurations(uris: vscode.Uri[], token?: CancellationToken) {
		const items: SourceFileConfigurationItem[] = [];
		for(const uri of uris) {
			const configuration: SourceFileConfiguration = {
				includePath: this.config.includePath,
				defines: [ "__GNUC__=10", "_NO_INLINE", ...this.config.defines ],
				intelliSenseMode: 'gcc-x64',
				standard: uri.toString().endsWith('.c') ? 'c11' : 'c++17',
				compilerPath: this.compilerPath,
			};
			const config: SourceFileConfigurationItem = { uri, configuration };
			items.push(config);
		}
		return items;
	}
	public async canProvideBrowseConfiguration(token?: CancellationToken) {
		return true;
	}
	public async provideBrowseConfiguration(token?: CancellationToken) {
		const config: WorkspaceBrowseConfiguration = { 
			browsePath: [],
			compilerPath: this.compilerPath,
		};
		return config;
	}
	public async canProvideBrowseConfigurationsPerFolder(token?: CancellationToken) {
		return false;
	}
	public async provideFolderBrowseConfiguration(uri: vscode.Uri, token?: CancellationToken) {
		const config: WorkspaceBrowseConfiguration = { browsePath: [] };
		return config;
	}

	public dispose() {
	}
}

class AmigaDebugExtension {
	private registerProvider: RegisterTreeProvider;
	private memoryProvider: MemoryContentProvider;
	private outputChannel: vscode.OutputChannel;

	private functionSymbols: SymbolInformation[] | null = null;
	private extensionPath: string = '';
	private cppToolsApi: CppToolsApi;

	constructor(private context: vscode.ExtensionContext) {
		this.registerProvider = new RegisterTreeProvider();
		this.memoryProvider = new MemoryContentProvider();
		this.outputChannel = vscode.window.createOutputChannel('Amiga');

		this.extensionPath = context.extensionPath;

		const lenses = new ProfileCodeLensProvider();
		const assemblyLanguageProvider = new AmigaAssemblyLanguageProvider(this.extensionPath);
		const assemblyLanguageSelector: vscode.DocumentSelector = { language: AmigaAssemblyLanguageProvider.getLanguageId() };

		context.subscriptions.push(
			// text editors
			vscode.workspace.registerTextDocumentContentProvider('examinememory', this.memoryProvider),
			vscode.workspace.registerTextDocumentContentProvider('disassembly', new DisassemblyContentProvider()),

			// commands
			vscode.commands.registerCommand('amiga.registers.selectedNode', this.registersSelectedNode.bind(this)),
			vscode.commands.registerCommand('amiga.registers.copyValue', this.registersCopyValue.bind(this)),
			vscode.commands.registerCommand('amiga.registers.setFormat', this.registersSetFormat.bind(this)),
			vscode.commands.registerCommand('amiga.examineMemory', this.examineMemory.bind(this)),
			vscode.commands.registerCommand('amiga.viewDisassembly', this.showDisassembly.bind(this)),
			vscode.commands.registerCommand('amiga.setForceDisassembly', this.setForceDisassembly.bind(this)),
			vscode.commands.registerCommand('amiga.startProfile', this.startProfile.bind(this)),
			vscode.commands.registerCommand('amiga.startProfileMulti', this.startProfileMulti.bind(this)),
			vscode.commands.registerCommand('amiga.profileSize', (uri: vscode.Uri) => this.profileSize(uri)),
			vscode.commands.registerCommand('amiga.shrinkler', (uri: vscode.Uri) => this.shrinkler(uri)),
			vscode.commands.registerCommand('amiga.bin-path', () => path.join(this.extensionPath, 'bin')),
			vscode.commands.registerCommand('amiga.initProject', this.initProject.bind(this)),
			vscode.commands.registerCommand('amiga.terminal', this.openTerminal.bind(this)),

			// window
			vscode.window.registerTreeDataProvider('amiga.registers', this.registerProvider),
			vscode.window.onDidChangeActiveTextEditor(this.activeEditorChanged.bind(this)),
			vscode.window.onDidChangeTextEditorSelection((e: vscode.TextEditorSelectionChangeEvent) => { if (e && e.textEditor.document.fileName.endsWith('.amigamem')) { this.memoryProvider.handleSelection(e); } }),
			vscode.window.registerCustomEditorProvider('amiga.profile', new ProfileEditorProvider(context, lenses), { webviewOptions: { retainContextWhenHidden: true }}),

			// debugger
			vscode.debug.onDidReceiveDebugSessionCustomEvent(this.receivedCustomEvent.bind(this)),
			vscode.debug.onDidStartDebugSession(this.debugSessionStarted.bind(this)),
			vscode.debug.onDidTerminateDebugSession(this.debugSessionTerminated.bind(this)),
			vscode.debug.registerDebugConfigurationProvider('amiga', new AmigaDebugConfigurationProvider()),

			// code lenses (from profiler)
			vscode.languages.registerCodeLensProvider('*', lenses),
			vscode.commands.registerCommand('extension.amiga.profile.clearCodeLenses', () => lenses.clear()),

			// assembly language
			vscode.languages.registerDocumentSemanticTokensProvider(assemblyLanguageSelector, assemblyLanguageProvider, AmigaAssemblyLanguageProvider.getSemanticTokensLegend()),
			vscode.languages.registerDocumentSymbolProvider(assemblyLanguageSelector, assemblyLanguageProvider),
			vscode.languages.registerDefinitionProvider(assemblyLanguageSelector, assemblyLanguageProvider),
			assemblyLanguageProvider.diagnosticCollection,

			// output channel
			this.outputChannel
		);
	}

	public async init() {
		const provider = new AmigaCppConfigurationProvider(this.extensionPath);
		this.cppToolsApi = await getCppToolsApi(Version.v4);
		this.cppToolsApi.registerCustomConfigurationProvider(provider);
		await provider.init();
		this.cppToolsApi.notifyReady(provider);
	}

	public async dispose() {
		this.cppToolsApi.dispose();
	}

	private activeEditorChanged(editor: vscode.TextEditor) {
		if (editor !== undefined && vscode.debug.activeDebugSession && vscode.debug.activeDebugSession.type === 'amiga') {
			const uri = editor.document.uri;
			if (uri.scheme === 'file') {
				// vscode.debug.activeDebugSession.customRequest('set-active-editor', { path: uri.path });
			} else if (uri.scheme === 'disassembly') {
				vscode.debug.activeDebugSession.customRequest('set-active-editor', { path: `${uri.scheme}://${uri.authority}${uri.path}` });
			}
		}
	}

	private async showDisassembly() {
		if (!vscode.debug.activeDebugSession) {
			vscode.window.showErrorMessage('No debugging session available');
			return;
		}

		if (!this.functionSymbols) {
			try {
				const resp = await vscode.debug.activeDebugSession.customRequest('load-function-symbols');
				this.functionSymbols = resp.functionSymbols;
			} catch (e) {
				vscode.window.showErrorMessage('Unable to load symbol table. Disassembly view unavailable.');
			}
		}

		try {
			const funcname: string = await vscode.window.showInputBox({
				placeHolder: 'main',
				ignoreFocusOut: true,
				prompt: 'Function Name to Disassemble'
			}) || "";

			const functions = this.functionSymbols!.filter((s) => s.name === funcname);

			let url: string;

			if (functions.length === 0) {
				vscode.window.showErrorMessage(`No function with name ${funcname} found.`);
				return;
			} else if (functions.length === 1) {
				if (functions[0].scope === SymbolScope.Global) {
					url = `disassembly:///${functions[0].name}.amigaasm`;
				} else {
					url = `disassembly:///${functions[0].file}::${functions[0].name}.amigaasm`;
				}
			} else {
				const selected = await vscode.window.showQuickPick(functions.map((f) => {
					return {
						label: f.name,
						name: f.name,
						file: f.file,
						scope: f.scope,
						description: f.scope === SymbolScope.Global ? 'Global Scope' : `Static in ${f.file}`
					};
				}), {
						ignoreFocusOut: true
					});

				if (selected!.scope === SymbolScope.Global) {
					url = `disassembly:///${selected!.name}.amigaasm`;
				} else {
					url = `disassembly:///${selected!.file}::${selected!.name}.amigaasm`;
				}
			}

			vscode.window.showTextDocument(vscode.Uri.parse(url));
		} catch (e) {
			vscode.window.showErrorMessage('Unable to show disassembly.');
		}
	}
	private initProject() {
		const copyRecursiveSync = (src: string, dest: string) => {
			const exists = fs.existsSync(src);
			const stats = exists && fs.statSync(src);
			const isDirectory = exists && stats.isDirectory();
			if (exists && isDirectory) {
				try {
					fs.mkdirSync(dest);
				} catch(err) {
					// don't care...
				}
				fs.readdirSync(src).forEach((childItemName) => {
					copyRecursiveSync(path.join(src, childItemName),
						path.join(dest, childItemName));
				});
			} else {
				fs.copyFileSync(src, dest);
			}
		};
		try {
			const source = this.extensionPath + '/template';
			const dest = vscode.workspace.workspaceFolders[0].uri.fsPath;
			const files = fs.readdirSync(dest);
			if(files.length) {
				vscode.window.showErrorMessage(`Failed to init project. Project folder is not empty`);
				return;
			}
			copyRecursiveSync(source, dest);
		} catch(err) {
			vscode.window.showErrorMessage(`Failed to init project. ${err.toString()}`);
		}
	}

	private terminal: vscode.Terminal = null;

	private openTerminal() {
		if (!this.terminal)
			this.terminal = vscode.window.createTerminal({
				name: 'Amiga',
				env: {
					path: `\${env:PATH};${this.extensionPath}\\bin;${this.extensionPath}\\bin\\opt\\bin`
				}
			});
		this.terminal.show();
	}

	private setForceDisassembly() {
		vscode.window.showQuickPick(
			[
				{ label: 'Auto', description: 'Show disassembly for functions when source cannot be located.' },
				{ label: 'Forced', description: 'Always show disassembly for functions.' }
			],
			{ matchOnDescription: true, ignoreFocusOut: true }
		).then((result) => {
			const force = result!.label === 'Forced';
			vscode.debug.activeDebugSession!.customRequest('set-force-disassembly', { force });
		}, (error) => { });
	}

	private startProfile() {
		vscode.debug.activeDebugSession!.customRequest('start-profile', { numFrames: 1 });
	}

	private startProfileMulti() {
		vscode.debug.activeDebugSession!.customRequest('start-profile', { numFrames: 10 });
	}

	private async profileSize(uri: vscode.Uri) {
		if(uri.scheme !== 'file') {
			vscode.window.showErrorMessage(`Error during size profiling: Don't know how to open ${uri.toString()}`);
			return;
		}
		const binPath = path.join(this.extensionPath, 'bin/opt/bin');

		try {
			const symbolTable = new SymbolTable(path.join(binPath, 'm68k-amiga-elf-objdump.exe'), uri.fsPath);
			const sourceMap = new SourceMap(path.join(binPath, 'm68k-amiga-elf-addr2line.exe'), uri.fsPath, symbolTable);
			const profiler = new Profiler(sourceMap, symbolTable);
			const tmp = path.join(os.tmpdir(), `${path.basename(uri.fsPath)}.size.amigaprofile`);
			fs.writeFileSync(tmp, profiler.profileSize(path.join(binPath, 'm68k-amiga-elf-objdump.exe'), uri.fsPath));
			await vscode.commands.executeCommand("vscode.open", vscode.Uri.file(tmp), { preview: false } as vscode.TextDocumentShowOptions);
		} catch(error) {
			vscode.window.showErrorMessage(`Error during size profiling: ${error.message}`);
		}
	}

	private shrinklerTerminal: vscode.Terminal;
	private shrinklerFinished = false;

	private async shrinkler(uri: vscode.Uri) {
		if(uri.scheme !== 'file') {
			vscode.window.showErrorMessage(`Error during shrinkling: Don't know how to open ${uri.toString()}`);
			return;
		}
		const binPath = path.join(this.extensionPath, 'bin');

		try {
			const workspaceFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;
			const jsonPath = path.join(workspaceFolder, ".vscode", "amiga.json");
			let config: AmigaConfiguration;
			try {
				config = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
			} catch(e) { /**/ }
			if(config === undefined || config.shrinkler === undefined || Object.keys(config.shrinkler).length === 0) {
				vscode.window.showErrorMessage(`No shrinkler configurations found in '.vscode/amiga.json'`);
				return;
			}

			const items: vscode.QuickPickItem[] = [];

			// tslint:disable-next-line: forin
			for(const key in config.shrinkler) {
				items.push({ label: key, description: config.shrinkler[key] });
			}
			
			const result = await vscode.window.showQuickPick(items, { placeHolder: 'Select shrinkler configuration', matchOnDescription: true, ignoreFocusOut: true });
			if(result === undefined)
				return;
			const output = uri.fsPath + '.' + result.label + '.shrinkled';
			const args = [...result.description.split(' '), uri.fsPath, output];
			const cmd = `${binPath}\\shrinkler.exe`;

			const writeEmitter = new vscode.EventEmitter<string>();
			let p: cp.ChildProcess;
			const pty: vscode.Pseudoterminal = {
				onDidWrite: writeEmitter.event,
				open: () => {
					writeEmitter.fire(`\x1b[1m> Executing ${cmd} ${args.join(' ')} <\x1b[0m\r\n`);
					writeEmitter.fire(`\x1b[31mPress CTRL+C to abort\x1b[0m\r\n\r\n`);
					//p = cp.exec(cmd);
					p = cp.spawn(cmd, args);
					p.stderr.on('data', (data: string) => {
						writeEmitter.fire(data);
					});
					p.stdout.on('data', (data: string) => {
						writeEmitter.fire(data);
					});
					p.on('exit', (code: number, signal: string) => {
						if (signal === 'SIGTERM') {
							writeEmitter.fire('\r\nSuccessfully killed process\r\n');
							writeEmitter.fire('-----------------------\r\n');
							writeEmitter.fire('\r\n');
						} else {
							vscode.commands.executeCommand("vscode.open", vscode.Uri.file(output + '.shrinklerstats'), { preview: false } as vscode.TextDocumentShowOptions);
						}
						this.shrinklerFinished = true;
					});
				},
				close: () => {},
				handleInput: (char: string) => {
					if(char === '\x03')
						p.kill('SIGTERM');
				}
			};

			if(this.shrinklerTerminal && this.shrinklerFinished) {
				this.shrinklerTerminal.dispose();
				this.shrinklerTerminal = null;
				this.shrinklerFinished = false;
			}

			this.shrinklerTerminal = vscode.window.createTerminal({
				name: 'Amiga',
				pty
			});
			this.shrinklerTerminal.show();
		} catch(error) {
			vscode.window.showErrorMessage(`Error during shrinkling: ${error.message}`);
		}
	}

	private examineMemory() {
		function validateValue(address) {
			if (/^0x[0-9a-f]{1,8}$/i.test(address)) {
				return address;
			} else if (/^[0-9]+$/i.test(address)) {
				return address;
			} else {
				return null;
			}
		}

		if (!vscode.debug.activeDebugSession) {
			vscode.window.showErrorMessage('No debugging session available');
			return;
		}

		vscode.window.showInputBox({
			placeHolder: 'Prefix with 0x for hexidecimal format',
			ignoreFocusOut: true,
			prompt: 'Memory Address'
		}).then(
			(address) => {
				if (!validateValue(address)) {
					vscode.window.showErrorMessage('Invalid memory address entered');
					return;
				}

				vscode.window.showInputBox({
					placeHolder: 'Prefix with 0x for hexidecimal format',
					ignoreFocusOut: true,
					prompt: 'Length'
				}).then(
					(length) => {
						if (!validateValue(length)) {
							vscode.window.showErrorMessage('Invalid length entered');
							return;
						}

						const timestamp = new Date().getTime();
						// tslint:disable-next-line:max-line-length
						vscode.workspace.openTextDocument(vscode.Uri.parse(`examinememory:///Memory%20[${address}+${length}].amigamem?address=${address}&length=${length}&timestamp=${timestamp}`))
							.then((doc) => {
								vscode.window.showTextDocument(doc, { viewColumn: 2, preview: false });
							}, (error) => {
								vscode.window.showErrorMessage(`Failed to examine memory: ${error}`);
							});
					},
					(error) => { }
				);
			},
			(error) => { }
		);
	}

	// Registers
	private registersSelectedNode(node: RBaseNode): void {
		if (node.recordType !== RRecordType.Field) { node.expanded = !node.expanded; }
		this.registerProvider.refresh();
	}

	private registersCopyValue(tn: RTreeNode): void {
		const cv = tn.node!.getCopyValue();
		if (cv) {
			vscode.env.clipboard.writeText(cv);
		}
	}

	private async registersSetFormat(tn: RTreeNode): Promise<void> {
		const result = await vscode.window.showQuickPick([
			{ label: 'Auto', description: 'Automatically choose format (Inherits from parent)', value: NumberFormat.Auto },
			{ label: 'Hex', description: 'Format value in hexidecimal', value: NumberFormat.Hexidecimal },
			{ label: 'Decimal', description: 'Format value in decimal', value: NumberFormat.Decimal },
			{ label: 'Binary', description: 'Format value in binary', value: NumberFormat.Binary }
		]);

		tn.node!.setFormat(result ? result.value : NumberFormat.Auto);
		this.registerProvider.refresh();
	}

	// Debug Events
	private debugSessionStarted(session: vscode.DebugSession) {
		if (session.type !== 'amiga') { return; }

		this.functionSymbols = null;

		session.customRequest('get-arguments').then((args) => {
			this.registerProvider.debugSessionStarted();
		}, (error) => {
			// TODO: Error handling for unable to get arguments
		});
	}

	private debugSessionTerminated(session: vscode.DebugSession) {
		if (session.type !== 'amiga') { return; }

		this.registerProvider.debugSessionTerminated();
	}

	private receivedCustomEvent(e: vscode.DebugSessionCustomEvent) {
		if (vscode.debug.activeDebugSession && vscode.debug.activeDebugSession.type !== 'amiga') { return; }
		switch (e.event) {
			case 'custom-output':
				this.receivedOutputEvent(e);
			case 'custom-stop':
				this.receivedStopEvent(e);
				break;
			case 'custom-continued':
				this.receivedContinuedEvent(e);
				break;
			default:
				break;
		}
	}

	private receivedOutputEvent(e: vscode.DebugSessionCustomEvent) {
		this.outputChannel.append(e.body.output);
	}

	private receivedStopEvent(e: vscode.DebugSessionCustomEvent) {
		this.registerProvider.debugStopped();
		vscode.workspace.textDocuments.filter((td) => td.fileName.endsWith('.amigamem'))
			.forEach((doc) => { this.memoryProvider.update(doc); });
	}

	private receivedContinuedEvent(e: vscode.DebugSessionCustomEvent) {
		this.registerProvider.debugContinued();
	}
}

let extension: AmigaDebugExtension;

export async function activate(context: vscode.ExtensionContext) {
	extension = new AmigaDebugExtension(context);
	await extension.init();
}

export async function deactivate() {
	await extension.dispose();
}

class AmigaDebugConfigurationProvider implements vscode.DebugConfigurationProvider {
	private server?: Net.Server;

	/**
	 * Massage a debug configuration just before a debug session is being launched,
	 * e.g. add all missing attributes to the debug configuration.
	 */
	public resolveDebugConfiguration(folder: vscode.WorkspaceFolder | undefined, config: vscode.DebugConfiguration, token?: vscode.CancellationToken): vscode.ProviderResult<vscode.DebugConfiguration> {
		// if launch.json is missing or empty
		if (!config.type && !config.request && !config.name) {
			return vscode.window.showInformationMessage("Cannot find a launch.json config").then((_) => {
				return undefined;	// abort launch
			});
		}

		if (!config.program) {
			return vscode.window.showInformationMessage("Cannot find a program to debug").then((_) => {
				return undefined;	// abort launch
			});
		}

		if (EMBED_DEBUG_ADAPTER) {
			// start port listener on launch of first debug session
			if (!this.server) {
				// start listening on a random port
				this.server = Net.createServer((socket) => {
					const session = new AmigaDebugSession();
					session.setRunAsServer(true);
					session.start(socket as NodeJS.ReadableStream, socket);
				}).listen(0);
			}
			// make VS Code connect to debug server instead of launching debug adapter
			const address: any = this.server.address();
			if (address instanceof Object) {
				config.debugServer = address.port;
			}
		}

		return config;
	}
}
