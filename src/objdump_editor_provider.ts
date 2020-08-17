import * as vscode from 'vscode';
import * as path from 'path';
import { bundlePage } from './profile_editor_provider';
import { Disassemble } from './backend/profile';
import * as fs from 'fs';

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
export class WebviewCollection {
	private readonly webviews = new Set<{
		readonly resource: string;
		readonly webviewPanel: vscode.WebviewPanel;
	}>();

	public *get(uri: vscode.Uri): Iterable<vscode.WebviewPanel> {
		const key = uri.toString();
		for (const entry of this.webviews) {
			if (entry.resource === key) {
				yield entry.webviewPanel;
			}
		}
	}

	public *all(): Iterable<vscode.WebviewPanel> {
		for (const entry of this.webviews) {
			yield entry.webviewPanel;
		}
	}

	public add(uri: vscode.Uri, webviewPanel: vscode.WebviewPanel): void {
		const entry = { resource: uri.toString(), webviewPanel };
		this.webviews.add(entry);

		webviewPanel.onDidDispose(() => {
			this.webviews.delete(entry);
		});
	}
}

class ObjdumpDocument implements vscode.CustomDocument {
	constructor(public uri: vscode.Uri) {
		this.elfPath = this.uri.fsPath.substr(0, this.uri.fsPath.length - ".objdump".length);
		this.watcher = vscode.workspace.createFileSystemWatcher(this.elfPath, true, false, true);
	}

	public async load() {
		const binPath = await vscode.commands.executeCommand("amiga.bin-path") as string;
		const objdumpPath = path.join(binPath, "opt/bin/m68k-amiga-elf-objdump.exe");
		this.content = Disassemble(objdumpPath, this.elfPath);
	}

	private elfPath: string;

	public content: string;

	public timers: NodeJS.Timeout[] = [];
	public watcher: vscode.FileSystemWatcher;

	public dispose() {
		this.watcher.dispose();
	}
}

export class ObjdumpEditorProvider implements vscode.CustomReadonlyEditorProvider<ObjdumpDocument> {
	private readonly webviews = new WebviewCollection(); 
	private sourceEditor: vscode.TextEditor;
		
	constructor(private readonly context: vscode.ExtensionContext) {
	}

	public async openCustomDocument(uri: vscode.Uri, openContext: vscode.CustomDocumentOpenContext, token: vscode.CancellationToken): Promise<ObjdumpDocument> {
		const doc = new ObjdumpDocument(uri);
		await doc.load();
		return doc;
	}

	private async updateWebview(document: ObjdumpDocument, webview: vscode.Webview) {
		const html = await bundlePage(webview, path.join(this.context.extensionPath, 'dist'), { 
			OBJDUMP: document.content
		});
		webview.html = html;
	}

	public async resolveCustomEditor(document: ObjdumpDocument, webviewPanel: vscode.WebviewPanel, token: vscode.CancellationToken): Promise<void> {
		this.webviews.add(document.uri, webviewPanel); // Add the webview to our internal set of active webviews 

		// Setup initial content for the webview
		webviewPanel.webview.options = {
			enableScripts: true,
			localResourceRoots: [ vscode.Uri.file(path.dirname(document.uri.fsPath)) ]
		};
		this.updateWebview(document, webviewPanel.webview);

		webviewPanel.webview.onDidReceiveMessage(async (message) => {
			switch (message.type) {
			case 'openDocument':
				this.sourceEditor = await vscode.window.showTextDocument(vscode.Uri.file(message.file), {
					viewColumn: vscode.ViewColumn.Beside,
					preserveFocus: true,
					preview: true,
					selection: new vscode.Range(message.line - 1, 0, message.line, 0)
				});
				return;
			}
		});

		document.watcher.onDidChange(async (e) => {
			// wait 2000ms before reloading, linker may not be finished writing .elf file, and if we don't wait, we get crap
			console.log(`ObjdumpEditorProvider: onDidChange(${e.fsPath}) -- wait 2000 msec`);
			webviewPanel.webview.postMessage({
				type: 'fileChanged',
				body: document.content
			});
			document.timers.forEach((t) => clearTimeout(t));
			document.timers = [];
			document.timers.push(setTimeout(async () => {
				document.timers = [];
				console.log(`"ObjdumpEditorProvider: Reload ${e.fsPath}`);
				await document.load();
				webviewPanel.webview.postMessage({
					type: 'reload',
					body: document.content
				});
			}, 2000));
		});
	}

	public async handleSelectionChanged(e: vscode.TextEditorSelectionChangeEvent) {
		for (const webviewPanel of this.webviews.all()) { 
			webviewPanel.webview.postMessage({ 
				type: 'findLocation', 
				body: { 
					file: e.textEditor.document.uri.fsPath, 
					line: e.selections[0].start.line + 1 
				}
			}); 			
		}
	}

	public handleEditorChanged(editor: vscode.TextEditor) {
		if(this.sourceEditor && editor !== this.sourceEditor) {
			this.sourceEditor.hide();
			this.sourceEditor = undefined;
		}
	}
}
