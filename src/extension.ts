'use strict';

import { AmigaDebugSession } from './amigaDebug';

import * as fs from 'fs';
import * as Net from 'net';
import * as path from 'path';
import * as vscode from 'vscode';

import { DisassemblyContentProvider } from './disassembly_content_provider';
import { MemoryContentProvider } from './memory_content_provider';
import { BaseNode as RBaseNode, RecordType as RRecordType, RegisterTreeProvider, TreeNode as RTreeNode } from './registers';
import { NumberFormat, SymbolInformation, SymbolScope } from './symbols';

/*
 * Set the following compile time flag to true if the
 * debug adapter should run inside the extension host.
 * Please note: the test suite does not (yet) work in this mode.
 */
const EMBED_DEBUG_ADAPTER = true;

class AmigaDebugExtension {
	private registerProvider: RegisterTreeProvider;
	private memoryProvider: MemoryContentProvider;

	private functionSymbols: SymbolInformation[] | null = null;
	private extensionPath: string = '';

	constructor(context: vscode.ExtensionContext) {
		this.registerProvider = new RegisterTreeProvider();
		this.memoryProvider = new MemoryContentProvider();

		this.extensionPath = context.extensionPath;

		//vscode.workspace.getConfiguration().update("C_Cpp.default.includePath", `${extensionPath}\\bin\\opt\\m68k-amiga-elf\\sys-include`, false);
		vscode.workspace.getConfiguration().update("C_Cpp.default.compilerPath", `${this.extensionPath}\\bin\\opt\\bin\\m68k-amiga-elf-gcc.exe`, false);

		context.subscriptions.push(
			vscode.workspace.registerTextDocumentContentProvider('examinememory', this.memoryProvider),
			vscode.workspace.registerTextDocumentContentProvider('disassembly', new DisassemblyContentProvider()),
			vscode.commands.registerCommand('amiga.registers.selectedNode', this.registersSelectedNode.bind(this)),
			vscode.commands.registerCommand('amiga.registers.copyValue', this.registersCopyValue.bind(this)),
			vscode.commands.registerCommand('amiga.registers.setFormat', this.registersSetFormat.bind(this)),
			vscode.commands.registerCommand('amiga.examineMemory', this.examineMemory.bind(this)),
			vscode.commands.registerCommand('amiga.viewDisassembly', this.showDisassembly.bind(this)),
			vscode.commands.registerCommand('amiga.setForceDisassembly', this.setForceDisassembly.bind(this)),
			vscode.commands.registerCommand('amiga.startProfile', this.startProfile.bind(this)),
			vscode.commands.registerCommand('amiga.bin-path', () => path.join(this.extensionPath, 'bin')),
			vscode.commands.registerCommand('amiga.initProject', this.initProject.bind(this)),

			vscode.window.registerTreeDataProvider('amiga.registers', this.registerProvider),
			vscode.debug.onDidReceiveDebugSessionCustomEvent(this.receivedCustomEvent.bind(this)),
			vscode.debug.onDidStartDebugSession(this.debugSessionStarted.bind(this)),
			vscode.debug.onDidTerminateDebugSession(this.debugSessionTerminated.bind(this)),
			vscode.window.onDidChangeActiveTextEditor(this.activeEditorChanged.bind(this)),
			vscode.window.onDidChangeTextEditorSelection((e: vscode.TextEditorSelectionChangeEvent) => {
				if (e && e.textEditor.document.fileName.endsWith('.amigamem')) { this.memoryProvider.handleSelection(e); }
			}),
			vscode.debug.registerDebugConfigurationProvider('amiga', new AmigaConfigurationProvider())
		);
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
		vscode.debug.activeDebugSession!.customRequest('start-profile', { });
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

	private receivedStopEvent(e) {
		this.registerProvider.debugStopped();
		vscode.workspace.textDocuments.filter((td) => td.fileName.endsWith('.amigamem'))
			.forEach((doc) => { this.memoryProvider.update(doc); });
	}

	private receivedContinuedEvent(e) {
		this.registerProvider.debugContinued();
	}
}

export function activate(context: vscode.ExtensionContext) {
	const extension = new AmigaDebugExtension(context);
}

export function deactivate() { }

class AmigaConfigurationProvider implements vscode.DebugConfigurationProvider {
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
