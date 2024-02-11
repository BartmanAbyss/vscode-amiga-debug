import * as path from 'path';
import * as vscode from 'vscode';
import { ProfileCodeLensProvider } from './profile_codelens_provider';
import { LensCollection } from './lens_collection';

// global debug switch for preact-devtools
const DEBUG = false;

const decimalFormat = new Intl.NumberFormat(undefined, {
	maximumFractionDigits: 2,
	minimumFractionDigits: 2,
});

const integerFormat = new Intl.NumberFormat(undefined, {
	maximumFractionDigits: 0,
});

import { randomBytes } from 'crypto';
import { ISourceLocation } from './client/location-mapping';
import { Lens, LensData } from './client/types';
import { normalize } from 'path';

export const bundlePage = (webview: vscode.Webview, title: string, extensionPath: vscode.Uri, constants: { [key: string]: unknown }) => {
	const nonce = randomBytes(16).toString('hex');
	const constantDecls = Object.keys(constants)
		.map((key) => `let ${key} = ${JSON.stringify(constants[key])};`)
		.join('\n');

	const debugHead = DEBUG ? `<link rel="stylesheet" href="preact-devtools/installHook.css"><link rel="stylesheet" href="preact-devtools/setup.css">` : '';
	const debugBody = DEBUG ? `<script type="text/javascript" src="preact-devtools/installHook.js"></script><script type="text/javascript" src="preact-devtools/setup.js"></script>` : '';

	const html = `<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta http-equiv="Content-Security-Policy" content="default-src 'none'; connect-src ${webview.cspSource}; img-src ${webview.cspSource} https: data:; script-src ${webview.cspSource} 'nonce-${nonce}' 'unsafe-eval'; style-src ${webview.cspSource} 'unsafe-inline';">
		<title>Custom Editor: ${title}</title>
		<base href="${webview.asWebviewUri(extensionPath).toString()}/">
		${debugHead}
	</head>
	<body>
		${debugBody}
		<script type="text/javascript" nonce="${nonce}">${constantDecls}</script>
		<script type="text/javascript" src="dist/client.js"></script>
	</body>
</html>`;
	return html;
};

let openDoc: vscode.TextDocument;

async function showPositionInFile(location: ISourceLocation, viewColumn?: vscode.ViewColumn) {
	const path = normalize(location.source.path);
	openDoc = await vscode.workspace.openTextDocument(vscode.Uri.file(path));
	await vscode.window.showTextDocument(openDoc, {
		viewColumn,
		preserveFocus: true,
		selection: new vscode.Range(location.lineNumber - 1, 0, location.lineNumber, 0)
	});
	return true;
}

async function closeDocument(viewColumn?: vscode.ViewColumn) {
	if (openDoc) {
		await vscode.window.showTextDocument(openDoc, { viewColumn });
		await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
	}
}

class ProfileDocument implements vscode.CustomDocument {
	constructor(public uri: vscode.Uri) {
		const fsPath = this.uri.fsPath;
		this.watcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(path.dirname(fsPath), path.basename(fsPath)), true, false, true);
	}

	// we don't need the content of the document, we just pass the URL to the WebView
	public timers: NodeJS.Timeout[] = [];
	public watcher: vscode.FileSystemWatcher;

	public dispose() {
		this.watcher.dispose();
	}
}

export class ProfileEditorProvider implements vscode.CustomReadonlyEditorProvider<ProfileDocument> {
	constructor(private readonly context: vscode.ExtensionContext, private readonly lenses: ProfileCodeLensProvider) {
	}

	public openCustomDocument(uri: vscode.Uri, openContext: vscode.CustomDocumentOpenContext, token: vscode.CancellationToken): ProfileDocument {
		return new ProfileDocument(uri);
	}

	private updateWebview(document: ProfileDocument, webview: vscode.Webview) {
		webview.html = bundlePage(webview, document.uri.fsPath, vscode.Uri.file(this.context.extensionPath), { 
			PROFILES: [],
			MODELS: [], 
			PROFILE_URL: webview.asWebviewUri(document.uri).toString() 
		});
	}

	public resolveCustomEditor(document: ProfileDocument, webviewPanel: vscode.WebviewPanel, token: vscode.CancellationToken) {
		// Setup initial content for the webview
		webviewPanel.webview.options = {
			enableScripts: true,
			localResourceRoots: [ vscode.Uri.file(path.dirname(document.uri.fsPath)), vscode.Uri.file(this.context.extensionPath) ]
		};
		this.updateWebview(document, webviewPanel.webview);

		webviewPanel.webview.onDidReceiveMessage((message) => {
			switch (message.type) {
			case 'openDocument':
				void showPositionInFile(message.location, message.toSide ? webviewPanel.viewColumn + 1 : webviewPanel.viewColumn);
				return;
			case 'closeDocument':
				void closeDocument(webviewPanel.viewColumn + 1);
				return;
			case 'setCodeLenses':
				this.lenses.registerLenses(this.createLensCollection(message.lenses));
				return;
			case 'error':
				void vscode.window.showErrorMessage(message.text, { modal: true });
				return;
			}
		});

		document.watcher.onDidChange(async (e) => {
			// wait 500ms before reloading, file may not be written completely
			console.log(`ProfileEditorProvider: onDidChange(${e.fsPath}) -- wait 500 msec`);
			document.timers.forEach((t) => clearTimeout(t));
			document.timers = [];
			document.timers.push(setTimeout(() => {
				document.timers = [];
				this.updateWebview(document, webviewPanel.webview);
			}, 500));
		});
	}

	private createLensCollection(lenses: Lens[]) {
		const lensCollection = new LensCollection<LensData>((dto) => {
			let title: string;
			if (dto.self > 0 || dto.agg > 0) {
				title = `${decimalFormat.format(dto.self)}% Self Time, ${decimalFormat.format(dto.agg)}% Total`;
			} else if (dto.ticks) {
				title = `${integerFormat.format(dto.ticks)} Ticks`;
			} else {
				return;
			}

			return { command: '', title };
		});

		const merge = (data: LensData) => (existing?: LensData) => ({
			ticks: (existing?.ticks || 0) + data.ticks,
			self: (existing?.self || 0) + data.self,
			agg: (existing?.agg || 0) + data.agg,
		});

		for (const lens of lenses) {
			const mergeFn = merge(lens.data);
			lensCollection.set(
				lens.file,
				new vscode.Position(lens.line, 0),
				mergeFn,
			);
		}

		return lensCollection;
	}
}
