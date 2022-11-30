'use strict';

import { AmigaDebugSession } from './amigaDebug';

import * as cp from 'child_process';
import * as fs from 'fs';
import { chmod } from 'fs/promises';
import * as Net from 'net';
import * as os from 'os';
import * as path from 'path';
import * as vscode from 'vscode';
import { CppToolsApi, Version, CustomConfigurationProvider, getCppToolsApi, SourceFileConfigurationItem, WorkspaceBrowseConfiguration, SourceFileConfiguration } from 'vscode-cpptools';
import { CancellationToken } from 'vscode-jsonrpc';

import { DisassemblyContentProvider } from './disassembly_content_provider';
import { ProfileCodeLensProvider } from './profile_codelens_provider';
import { ProfileEditorProvider } from './profile_editor_provider';
import { AmigaAssemblyDocumentMananger, AmigaAssemblyLanguageProvider, getEditorForDocument } from './assembly_language_provider';
import { BaseNode as RBaseNode, CustomRegisterTreeProvider, FieldNode, RegisterTreeProvider, TreeNode as RTreeNode } from './registers';
import { NumberFormat, SourceLineWithDisassembly, SymbolInformation, SymbolScope } from './symbols';
import { SymbolTable } from './backend/symbols';
import { SourceMap, Profiler } from './backend/profile';
import { ObjdumpEditorProvider } from './objdump_editor_provider';
import { SavestateEditorProvider } from './savestate_editor_provider';
import { hexFormat } from './utils';
import { DebugProtocol } from 'vscode-debugprotocol';
import { DisassembledMemoryProvider } from './disassembled_memory_provider';

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
		this.compilerPath = path.join(extensionPath, "bin", process.platform, "opt", "bin", "m68k-amiga-elf-gcc");
	}

	public readonly name = "Amiga C/C++";
	public readonly extensionId = "BartmanAbyss.amiga-debug";

	private config: AmigaConfiguration = {};

	public async init() {
		const workspaceFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;
		const jsonPath = path.join(workspaceFolder, ".vscode", "amiga.json");
		try {
			this.config = JSON.parse(fs.readFileSync(jsonPath, 'utf-8')) as AmigaConfiguration;
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
				defines: ["__GNUC__=11", "_NO_INLINE", ...this.config.defines],
				intelliSenseMode: 'gcc-x64',
				standard: uri.toString().endsWith('.c') ? 'gnu11' : 'gnu++20',
				compilerPath: this.compilerPath
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
		/**/
	}
}

type OnOutputReadyFunction = (output: string) => void;

class AmigaDebugExtension {
	private registerProvider: RegisterTreeProvider;
	private customRegisterProvider: CustomRegisterTreeProvider;
	private disassembledMemoryProvider: DisassembledMemoryProvider;
	private outputChannel: vscode.OutputChannel;
	private objdumpEditorProvider: ObjdumpEditorProvider;
	private assemblyLanguageSelector: vscode.DocumentSelector;
	private assemblyDocumentManager: AmigaAssemblyDocumentMananger;

	private functionSymbols: SymbolInformation[] | null = null;
	private extensionPath = '';
	private binPath = '';
	private cppToolsApi: CppToolsApi;

	constructor(private context: vscode.ExtensionContext) {
		this.extensionPath = context.extensionPath;
		this.binPath = path.join(this.extensionPath, "bin", process.platform);
		this.registerProvider = new RegisterTreeProvider();
		this.customRegisterProvider = new CustomRegisterTreeProvider();
		this.disassembledMemoryProvider = new DisassembledMemoryProvider();
		this.objdumpEditorProvider = new ObjdumpEditorProvider(context);
		this.outputChannel = vscode.window.createOutputChannel('Amiga');

		const lenses = new ProfileCodeLensProvider();
		const assemblyLanguagesInt: vscode.DocumentFilter[] = [ { language: 'amiga.assembly' } ];
		const assemblyLanguagesExt: vscode.DocumentFilter[] = [ { language: 'm68k' } ];
		this.assemblyLanguageSelector = [
			...assemblyLanguagesInt,
			...assemblyLanguagesExt,
		];
		this.assemblyDocumentManager = new AmigaAssemblyDocumentMananger(context.extensionPath, this.assemblyLanguageSelector);

		const assemblyLanguageProvider = new AmigaAssemblyLanguageProvider(this.assemblyDocumentManager);
		const assemblyLanguageProviderExt = new AmigaAssemblyLanguageProvider(this.assemblyDocumentManager, false);

		context.subscriptions.push(
			// text editors
			vscode.workspace.registerTextDocumentContentProvider('disassembly', new DisassemblyContentProvider()),

			// commands
			vscode.commands.registerCommand('amiga.registers.selectedNode', this.registersSelectedNode.bind(this)),
			vscode.commands.registerCommand('amiga.registers.copyValue', this.registersCopyValue.bind(this)),
			vscode.commands.registerCommand('amiga.registers.setFormat', this.registersSetFormat.bind(this)),
			vscode.commands.registerCommand('amiga.examineMemory', this.examineMemoryInput.bind(this)),
			vscode.commands.registerCommand('amiga.examineMemoryVariable', (ctx) => this.examineVariableMemory(ctx.variable, false)),
			vscode.commands.registerCommand('amiga.examineMemoryVariableIndirect', (ctx) => this.examineVariableMemory(ctx.variable, true)),
			vscode.commands.registerCommand('amiga.viewDisassembly', this.showDisassembly.bind(this)),
			vscode.commands.registerCommand('amiga.setForceDisassembly', this.setForceDisassembly.bind(this)),
			vscode.commands.registerCommand('amiga.startProfile', this.startProfile.bind(this)),
			vscode.commands.registerCommand('amiga.startProfileMulti', this.startProfileMulti.bind(this)),
			vscode.commands.registerCommand('amiga.profileSize', (uri: vscode.Uri) => this.profileSize(uri)),
			vscode.commands.registerCommand('amiga.shrinkler', (uri: vscode.Uri) => this.shrinkler(uri)),
			vscode.commands.registerCommand('amiga.disassembleElf', (uri: vscode.Uri) => this.disassembleElf(uri)),
			vscode.commands.registerCommand('amiga.bin-path', () => path.join(this.extensionPath, 'bin', process.platform)),
			vscode.commands.registerCommand('amiga.initProject', this.initProject.bind(this)),
			vscode.commands.registerCommand('amiga.terminal', this.openTerminal.bind(this)),
			vscode.commands.registerCommand('amiga.exe2adf', (uri: vscode.Uri) => this.exe2adf(uri)),
			vscode.commands.registerCommand('amiga.cleanTemp', this.cleanTemp.bind(this)),
			vscode.commands.registerCommand('amiga.externalResources.gradientMaster', () => vscode.env.openExternal(vscode.Uri.parse('http://deadliners.net/gradientmaster'))),
			vscode.commands.registerCommand('amiga.externalResources.imageTool', () => vscode.env.openExternal(vscode.Uri.parse('http://deadliners.net/ImageTool'))),
			vscode.commands.registerCommand('amiga.externalResources.colorReducer', () => vscode.env.openExternal(vscode.Uri.parse('http://deadliners.net/ColorReducer'))),
			vscode.commands.registerCommand('amiga.externalResources.bltconCheatSheet', () => vscode.env.openExternal(vscode.Uri.parse('http://deadliners.net/BLTCONCheatSheet'))),
			vscode.commands.registerCommand('amiga.externalResources.amigaHRM', () => vscode.commands.executeCommand('simpleBrowser.show', 'http://amigadev.elowar.com/read/ADCD_2.1/Hardware_Manual_guide/node0000.html')),
			vscode.commands.registerCommand('amiga.setDisassembledMemory', (lines: SourceLineWithDisassembly[]) => this.disassembledMemoryProvider.setDisassembledMemory(lines)),

			// window
			vscode.window.registerTreeDataProvider('amiga.registers', this.registerProvider),
			vscode.window.registerTreeDataProvider('amiga.customRegisters', this.customRegisterProvider),
			vscode.window.registerTreeDataProvider('amiga.disassembledMemory', this.disassembledMemoryProvider),
			vscode.window.onDidChangeActiveTextEditor(this.activeEditorChanged.bind(this)),
			vscode.window.onDidChangeTextEditorSelection(this.editorSelectionChanged.bind(this)),
			vscode.window.registerCustomEditorProvider('amiga.profile', new ProfileEditorProvider(context, lenses), { webviewOptions: { retainContextWhenHidden: true } }),
			vscode.window.registerCustomEditorProvider('amiga.objdump', this.objdumpEditorProvider, { webviewOptions: { retainContextWhenHidden: true } }),
			vscode.window.registerCustomEditorProvider('amiga.savestate', new SavestateEditorProvider(context, this.outputChannel), { webviewOptions: { retainContextWhenHidden: true } }),

			// debugger
			vscode.debug.onDidReceiveDebugSessionCustomEvent(this.receivedCustomEvent.bind(this)),
			vscode.debug.onDidStartDebugSession(this.debugSessionStarted.bind(this)),
			vscode.debug.onDidTerminateDebugSession(this.debugSessionTerminated.bind(this)),
			vscode.debug.registerDebugConfigurationProvider('amiga', new AmigaDebugConfigurationProvider()),

			// code lenses (from profiler)
			vscode.languages.registerCodeLensProvider('*', lenses),
			vscode.commands.registerCommand('extension.amiga.profile.clearCodeLenses', () => lenses.clear()),

			// assembly language (built in)
			vscode.languages.registerDocumentSemanticTokensProvider(assemblyLanguagesInt, assemblyLanguageProvider, AmigaAssemblyLanguageProvider.getSemanticTokensLegend()),
			vscode.languages.registerDocumentSymbolProvider(assemblyLanguagesInt, assemblyLanguageProvider),
			vscode.languages.registerDefinitionProvider(assemblyLanguagesInt, assemblyLanguageProvider),
			vscode.languages.registerHoverProvider(assemblyLanguagesInt, assemblyLanguageProvider),
			vscode.languages.registerCompletionItemProvider(assemblyLanguagesInt, assemblyLanguageProvider),
			// assembly language (extensions)
			vscode.languages.registerHoverProvider(assemblyLanguagesExt, assemblyLanguageProviderExt),
			this.assemblyDocumentManager,

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
		if (process.platform !== "win32") {
			await this.setPermissions();
		}

		if (vscode.extensions.getExtension('gigabates.m68k-lsp')) {
			const config = vscode.workspace.getConfiguration();
			// Ensure m68k.includePaths contains the bundled system includes dir
			const sysIncDir = path.join("opt", "m68k-amiga-elf", "sys-include");
			const sysIncPath = path.join(this.binPath, sysIncDir);
			const currentIncludePaths: string[] = config.get('m68k.includePaths');
			if (!currentIncludePaths.includes(sysIncPath)) {
				await config.update("m68k.includePaths", [
					// Remove any old paths to sys-include:
					// The location may change between environments and extension versions
					...currentIncludePaths.filter((inc) => !inc.endsWith(sysIncDir)),
					// Add new sys-include path
					sysIncPath,
				]);
			}
		}
	}

	public async dispose() {
		this.cppToolsApi.dispose();
	}

	private activeEditorChanged(editor: vscode.TextEditor) {
		if(vscode.languages.match(this.assemblyLanguageSelector, editor?.document)) {
			this.assemblyDocumentManager.getSourceContext(editor.document.fileName).setEmptyDecorations(getEditorForDocument(editor.document));
			this.assemblyDocumentManager.getSourceContext(editor.document.fileName).setDecorations(getEditorForDocument(editor.document));
			return;
		}
		if(editor !== undefined && vscode.debug.activeDebugSession && vscode.debug.activeDebugSession.type === 'amiga') {
			const uri = editor.document.uri;
			if(uri.scheme === 'file') {
				// vscode.debug.activeDebugSession.customRequest('set-active-editor', { path: uri.path });
			} else if(uri.scheme === 'disassembly') {
				void vscode.debug.activeDebugSession.customRequest('set-active-editor', { path: `${uri.scheme}://${uri.authority}${uri.path}` });
			}
		}
		if(editor === undefined || editor.document.uri.scheme !== 'objdump')
			this.objdumpEditorProvider.handleEditorChanged(editor);
	}

	private editorSelectionChanged(e: vscode.TextEditorSelectionChangeEvent) {
		if(vscode.window.activeTextEditor === e.textEditor)
			void this.objdumpEditorProvider.handleSelectionChanged(e);
	}

	private async showDisassembly() {
		if(!vscode.debug.activeDebugSession) {
			void vscode.window.showErrorMessage('No debugging session available');
			return;
		}

		if(!this.functionSymbols) {
			try {
				const resp = await vscode.debug.activeDebugSession.customRequest('load-function-symbols');
				this.functionSymbols = resp.functionSymbols;
			} catch(e) {
				void vscode.window.showErrorMessage('Unable to load symbol table. Disassembly view unavailable.');
			}
		}

		try {
			const funcname: string = await vscode.window.showInputBox({
				placeHolder: 'main',
				ignoreFocusOut: true,
				prompt: 'Function Name to Disassemble'
			}) || "";

			const functions = this.functionSymbols.filter((s) => s.name === funcname);

			let url: string;

			if(functions.length === 0) {
				void vscode.window.showErrorMessage(`No function with name ${funcname} found.`);
				return;
			} else if(functions.length === 1) {
				if(functions[0].scope === SymbolScope.Global) {
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

				if(selected.scope === SymbolScope.Global) {
					url = `disassembly:///${selected.name}.amigaasm`;
				} else {
					url = `disassembly:///${selected.file}::${selected.name}.amigaasm`;
				}
			}

			void vscode.window.showTextDocument(vscode.Uri.parse(url));
		} catch(e) {
			void vscode.window.showErrorMessage('Unable to show disassembly.');
		}
	}
	private initProject() {
		const copyRecursiveSync = (src: string, dest: string) => {
			const exists = fs.existsSync(src);
			const stats = exists && fs.statSync(src);
			const isDirectory = exists && stats.isDirectory();
			if(exists && isDirectory) {
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
				void vscode.window.showErrorMessage(`Failed to init project. Project folder is not empty`);
				return;
			}
			copyRecursiveSync(source, dest);
		} catch(err) {
			void vscode.window.showErrorMessage(`Failed to init project. ${(err as Error).toString()}`);
		}
	}

	private terminal: vscode.Terminal = null;

	private openTerminal() {
		if(this.terminal && this.terminal.exitStatus) {
			this.terminal.dispose();
			this.terminal = null;
		}
		if(!this.terminal) {
			const sep = process.platform === "win32" ? ";" : ":";
			this.terminal = vscode.window.createTerminal({
				name: 'Amiga',
				env: {
					PATH: [
						"${env:PATH}",
						this.binPath,
						path.join(this.binPath, "opt", "bin"),
					].join(sep)
				}
			});
		}
		this.terminal.show();
	}

	private cleanTemp() {
		const regex = /[.]amigaprofile$/;
		const p = os.tmpdir();
		let count = 0, size = 0;
		fs.readdirSync(p)
		.filter(f => regex.test(f))
		.map(f => {
			size += fs.statSync(path.join(p, f)).size;
			count++;
			fs.unlinkSync(path.join(p, f));
		});
		void vscode.window.showInformationMessage(`Cleaned ${(size / 1024. / 1024.)|0}MB in ${count} files`);
	}

	private setForceDisassembly() {
		vscode.window.showQuickPick(
			[
				{ label: 'Auto', description: 'Show disassembly for functions when source cannot be located.' },
				{ label: 'Forced', description: 'Always show disassembly for functions.' }
			],
			{ matchOnDescription: true, ignoreFocusOut: true }
		).then((result) => {
			const force = result.label === 'Forced';
			void vscode.debug.activeDebugSession.customRequest('set-force-disassembly', { force });
		}, (error) => { /**/ });
	}

	private startProfile() {
		void vscode.debug.activeDebugSession.customRequest('start-profile', { numFrames: 1 });
	}

	private startProfileMulti() {
		void vscode.debug.activeDebugSession.customRequest('start-profile', { numFrames: 50 });
	}

	private async profileSize(uri: vscode.Uri) {
		if(uri.scheme !== 'file') {
			void vscode.window.showErrorMessage(`Error during size profiling: Don't know how to open ${uri.toString()}`);
			return;
		}

		try {
			const symbolTable = new SymbolTable(path.join(this.binPath, 'opt/bin/m68k-amiga-elf-objdump'), uri.fsPath);
			const sourceMap = new SourceMap(path.join(this.binPath, 'opt/bin/m68k-amiga-elf-addr2line'), uri.fsPath, symbolTable);
			const profiler = new Profiler(sourceMap, symbolTable);
			const tmp = path.join(os.tmpdir(), `${path.basename(uri.fsPath)}.size.amigaprofile`);
			fs.writeFileSync(tmp, profiler.profileSize(path.join(this.binPath, 'opt/bin/m68k-amiga-elf-objdump'), uri.fsPath));
			await vscode.commands.executeCommand("vscode.open", vscode.Uri.file(tmp), { preview: false } as vscode.TextDocumentShowOptions);
		} catch(error) {
			void vscode.window.showErrorMessage(`Error during size profiling: ${(error as Error).message}`);
		}
	}

	private async disassembleElf(uri: vscode.Uri) {
		if(uri.scheme !== 'file') {
			void vscode.window.showErrorMessage(`Error during disassembly: Don't know how to open ${uri.toString()}`);
			return;
		}
		const uri2 = vscode.Uri.file(uri.fsPath + ".objdump");
		await vscode.commands.executeCommand("vscode.open", uri2, { viewColumn: vscode.ViewColumn.One, preview: false } as vscode.TextDocumentShowOptions);
		await vscode.commands.executeCommand("workbench.action.moveEditorToLeftGroup");
	}

	private async shrinkler(uri: vscode.Uri) {
		const workspaceFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;
		const jsonPath = path.join(workspaceFolder, ".vscode", "amiga.json");
		let config: AmigaConfiguration;
		try {
			config = JSON.parse(fs.readFileSync(jsonPath, 'utf-8')) as AmigaConfiguration;
		} catch(e) { /**/ }
		if(config === undefined || config.shrinkler === undefined || Object.keys(config.shrinkler).length === 0) {
			void vscode.window.showErrorMessage(`No shrinkler configurations found in '.vscode/amiga.json'`);
			return;
		}

		const items: vscode.QuickPickItem[] = [];

		// eslint-disable-next-line guard-for-in
		for(const key in config.shrinkler) {
			items.push({ label: key, description: config.shrinkler[key] });
		}

		const result = await vscode.window.showQuickPick(items, { placeHolder: 'Select shrinkler configuration', matchOnDescription: true, ignoreFocusOut: true });
		if(result === undefined)
			return;
		const output = uri.fsPath + '.' + result.label + '.shrinkled';
		const args = [...result.description.split(' '), uri.fsPath, output];
		const cmd = path.join(this.binPath, 'Shrinkler');
		return this.runExternalCommand(uri, cmd, args, output, () => {
			void vscode.commands.executeCommand("vscode.open", vscode.Uri.file(output + '.shrinklerstats'), { preview: false } as vscode.TextDocumentShowOptions);
		});
	}

	private exe2adf(uri: vscode.Uri) {
		const output = path.join(path.dirname(uri.fsPath), path.basename(uri.fsPath, path.extname(uri.fsPath)) + '.adf');
		const args = [ '-i', uri.fsPath, '-a', output ];
		const cmd = path.join(this.binPath, 'exe2adf');
		return this.runExternalCommand(uri, cmd, args, output, null);
	}

	private externalCommandTerminal: vscode.Terminal;
	private externalCommandFinished = false;

	private runExternalCommand(uri: vscode.Uri, cmd: string, args: string[], output: string, onOutputReady: OnOutputReadyFunction) {
		if(uri.scheme !== 'file') {
			void vscode.window.showErrorMessage(`Error running external command: Don't know how to open ${uri.toString()}`);
			return;
		}
		try {
			const writeEmitter = new vscode.EventEmitter<string>();
			let p: cp.ChildProcess;
			const pty: vscode.Pseudoterminal = {
				onDidWrite: writeEmitter.event,
				open: () => {
					writeEmitter.fire(`\x1b[1m> Executing ${cmd} ${args.join(' ')} <\x1b[0m\r\n`);
					writeEmitter.fire(`\x1b[31mPress CTRL+C to abort\x1b[0m\r\n\r\n`);
					//p = cp.exec(cmd);
					p = cp.spawn(cmd, args);
					p.stderr.on('data', (data: Buffer) => {
						writeEmitter.fire(data.toString().replace(/(\r)?\n/g, "\r\n"));
					});
					p.stdout.on('data', (data: Buffer) => {
						writeEmitter.fire(data.toString().replace(/(\r)?\n/g, "\r\n"));
					});
					p.on('exit', (code: number, signal: string) => {
						if(signal === 'SIGTERM') {
							writeEmitter.fire('\r\nSuccessfully killed process\r\n');
							writeEmitter.fire('-----------------------\r\n');
							writeEmitter.fire('\r\n');
						} else {
							onOutputReady?.(output);
						}
						this.externalCommandFinished = true;
					});
				},
				close: () => { /**/ },
				handleInput: (char: string) => {
					if(char === '\x03') // Ctrl+C
						p.kill('SIGTERM');
				}
			};

			if (this.externalCommandTerminal && this.externalCommandFinished) {
				this.externalCommandTerminal.dispose();
				this.externalCommandTerminal = null;
				this.externalCommandFinished = false;
			}

			this.externalCommandTerminal = vscode.window.createTerminal({
				name: 'Amiga',
				pty
			});
			this.externalCommandTerminal.show();
		} catch(error) {
			void vscode.window.showErrorMessage(`Error running external command: ${error.message}`);
		}
	}

	private async examineVariableMemory(variable: DebugProtocol.Variable, indirection = false) {
		if(!variable.memoryReference) {
			void vscode.window.showErrorMessage('No memory reference for variable');
			return;
		}
		return this.examineMemory(variable.memoryReference, indirection);
	}

	private async examineMemoryInput() {
		async function lookupAddress(input: string) {
			if(/^0x[0-9a-f]{1,8}$/i.test(input)) {
				return input;
			} else if(/^[0-9]+$/i.test(input)) {
				return input;
			} else {
				// Try looking up address from symbol name
				const symbol = input;
				const { address } = await session.customRequest('lookup-symbol', { symbol }) as { address: number | null };
				return address ? hexFormat(address) : null;
			}
		}

		const session = vscode.debug.activeDebugSession;
		if (!session) {
			void vscode.window.showErrorMessage('No debugging session available');
			return;
		}

		const input = await vscode.window.showInputBox({
			placeHolder: 'Prefix with 0x for hexidecimal, & for indirection',
			ignoreFocusOut: true,
			prompt: 'Memory Address or Symbol'
		});

		const indirection = input.startsWith('&');
		const address = await lookupAddress(indirection ? input.substring(1) : input);
		if(!address) {
			void vscode.window.showErrorMessage('Invalid memory address entered');
			return;
		}

		return this.examineMemory(address, indirection);
	}

	private async examineMemory(address: string, indirection: boolean) {
		const session = vscode.debug.activeDebugSession;
		if (!session) {
			void vscode.window.showErrorMessage('No debugging session available');
			return;
		}

		try {
			if(!address) {
				void vscode.window.showErrorMessage('Invalid memory address entered');
				return;
			}

			if (indirection) {
				const args = {
					address: Number(address),
					length: 4,
				};
				const { bytes } = await session.customRequest('read-memory', args) as { bytes?: number[] };
				address = bytes
					? '0x' + bytes.map((v) => hexFormat(v, 2, false)).join('')
					: null;
			}

			await vscode.commands.executeCommand("workbench.debug.viewlet.action.viewMemory", {
				sessionId: vscode.debug.activeDebugSession.id,
				variable: {
					memoryReference: address
				}
			});
		} catch(e) {}
	}

	// Registers
	private registersSelectedNode(node: RBaseNode): void {
		if(node instanceof FieldNode === false) { node.expanded = !node.expanded; }
		this.registerProvider.refresh();
		void this.customRegisterProvider.refresh();
	}

	private registersCopyValue(tn: RTreeNode): void {
		const cv = tn.node.getCopyValue();
		if(cv) {
			void vscode.env.clipboard.writeText(cv);
		}
	}

	private async registersSetFormat(tn: RTreeNode): Promise<void> {
		const result = await vscode.window.showQuickPick([
			{ label: 'Auto', description: 'Automatically choose format (Inherits from parent)', value: NumberFormat.Auto },
			{ label: 'Hex', description: 'Format value in hexidecimal', value: NumberFormat.Hexidecimal },
			{ label: 'Decimal', description: 'Format value in decimal', value: NumberFormat.Decimal },
			{ label: 'Binary', description: 'Format value in binary', value: NumberFormat.Binary }
		]);

		tn.node.setFormat(result ? result.value : NumberFormat.Auto);
		this.registerProvider.refresh();
		void this.customRegisterProvider.refresh();
	}

	// Debug Events
	private debugSessionStarted(session: vscode.DebugSession) {
		if(session.type !== 'amiga') { return; }

		this.functionSymbols = null;

		session.customRequest('get-arguments').then((args) => {
			this.registerProvider.debugSessionStarted();
			this.customRegisterProvider.debugSessionStarted();
		}, (error) => {
			// TODO: Error handling for unable to get arguments
		});
	}

	private debugSessionTerminated(session: vscode.DebugSession) {
		if(session.type !== 'amiga') { return; }

		this.registerProvider.debugSessionTerminated();
		this.customRegisterProvider.debugSessionTerminated();
	}

	private receivedCustomEvent(e: vscode.DebugSessionCustomEvent) {
		if(vscode.debug.activeDebugSession && vscode.debug.activeDebugSession.type !== 'amiga') { return; }
		switch(e.event) {
			case 'custom-output':
				this.receivedOutputEvent(e);
				break;
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
		this.customRegisterProvider.debugStopped();
	}

	private receivedContinuedEvent(e: vscode.DebugSessionCustomEvent) {
		this.registerProvider.debugContinued();
		this.customRegisterProvider.debugContinued();
	}

	private async setPermissions() {
		const version = "12.2.0";
		const exes = [
			"elf2hunk",
			"exe2adf",
			"fs-uae/fs-uae",
			"opt/bin/m68k-amiga-elf-addr2line",
			"opt/bin/m68k-amiga-elf-as",
			"opt/bin/m68k-amiga-elf-gcc",
			"opt/bin/m68k-amiga-elf-gdb",
			"opt/bin/m68k-amiga-elf-ld",
			"opt/bin/m68k-amiga-elf-objdump",
			`opt/libexec/gcc/m68k-amiga-elf/${version}/cc1`,
			`opt/libexec/gcc/m68k-amiga-elf/${version}/cc1plus`,
			`opt/libexec/gcc/m68k-amiga-elf/${version}/collect2`,
			`opt/libexec/gcc/m68k-amiga-elf/${version}/lto-wrapper`,
			`opt/libexec/gcc/m68k-amiga-elf/${version}/lto1`,
			"opt/m68k-amiga-elf/bin/ar",
			"opt/m68k-amiga-elf/bin/as",
			"opt/m68k-amiga-elf/bin/ld",
			"opt/m68k-amiga-elf/bin/ld.bfd",
			"opt/m68k-amiga-elf/bin/nm",
			"opt/m68k-amiga-elf/bin/objcopy",
			"opt/m68k-amiga-elf/bin/objdump",
			"opt/m68k-amiga-elf/bin/ranlib",
			"opt/m68k-amiga-elf/bin/readelf",
			"opt/m68k-amiga-elf/bin/strip",
			"Shrinkler",
			"vasmm68k_mot",
		];
		await Promise.all(
			exes
				.map(f => path.join(this.binPath, f))
				.map(f => chmod(f, 0o755))
		);
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
		if(!config.type && !config.request && !config.name) {
			return vscode.window.showInformationMessage("Cannot find a launch.json config").then((_) => {
				return undefined;	// abort launch
			});
		}

		if(!config.program) {
			return vscode.window.showInformationMessage("Cannot find a program to debug").then((_) => {
				return undefined;	// abort launch
			});
		}

		if(EMBED_DEBUG_ADAPTER) {
			// start port listener on launch of first debug session
			if(!this.server) {
				// start listening on a random port
				this.server = Net.createServer((socket) => {
					const session = new AmigaDebugSession();
					session.setRunAsServer(true);
					session.start(socket as NodeJS.ReadableStream, socket);
				}).listen(0);
			}
			// make VS Code connect to debug server instead of launching debug adapter
			const address: any = this.server.address();
			if(address instanceof Object) {
				config.debugServer = address.port;
			}
		}

		return config;
	}
}
