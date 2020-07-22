import * as vscode from 'vscode';
import * as childProcess from 'child_process';
import * as path from 'path';
import { bundlePage } from './profile_editor_provider';

class ObjdumpDocument implements vscode.CustomDocument {
	constructor(public uri: vscode.Uri) {
	}

	public async load() {
		const elfPath = this.uri.fsPath.substr(0, this.uri.fsPath.length - ".objdump".length);
		const binPath = await vscode.commands.executeCommand("amiga.bin-path") as string;
		const objdumpPath = path.join(binPath, "opt/bin/m68k-amiga-elf-objdump.exe");

		const objdump = childProcess.spawnSync(objdumpPath, ['--disassemble', '-l', elfPath], { maxBuffer: 10*1024*1024 });
		if(objdump.status !== 0)
			throw objdump.error;
		//const outputs = objdump.stdout.toString().replace(/\r/g, '').split('\n');
		//for(const line of outputs) {
		//}
		this.content = objdump.stdout.toString();
	}

	public content: string;

	public dispose() {}
}

export class ObjdumpEditorProvider implements vscode.CustomReadonlyEditorProvider<ObjdumpDocument> {
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
//			PROFILES: [],
//			MODELS: [], 
//			PROFILE_URL: webview.asWebviewUri(document.uri).toString() 
		});
		webview.html = html;
	}

	public async resolveCustomEditor(document: ObjdumpDocument, webviewPanel: vscode.WebviewPanel, token: vscode.CancellationToken): Promise<void> {
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
			//case 'setCodeLenses':
			//	this.lenses.registerLenses(this.createLensCollection(message.lenses));
			//	return;
			}
		});
	}

/*	public async provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): Promise<string> {
	}
*/
	private sourceEditor: vscode.TextEditor;

	public async handleSelection(e: vscode.TextEditorSelectionChangeEvent) {
		const line = e.textEditor.document.lineAt(e.selections[0].start.line);
		const match = line.text.match(/^(\S.+):([0-9]+)$/);
		if(match) {
			console.log(match[1], match[2]);
		}
	}

	public handleEditorChanged(editor: vscode.TextEditor) {
		if(this.sourceEditor) {
			this.sourceEditor.hide();
			this.sourceEditor = undefined;
		}
	}
}
