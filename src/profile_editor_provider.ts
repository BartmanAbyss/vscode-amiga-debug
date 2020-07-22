import * as path from 'path';
import * as vscode from 'vscode';
import { ProfileCodeLensProvider } from './profile_codelens_provider';
import { LensCollection } from './lens_collection';

const decimalFormat = new Intl.NumberFormat(undefined, {
	maximumFractionDigits: 2,
	minimumFractionDigits: 2,
});

const integerFormat = new Intl.NumberFormat(undefined, {
	maximumFractionDigits: 0,
});

import { promises as fs } from 'fs';
import { randomBytes } from 'crypto';
import { ISourceLocation } from './client/location-mapping';
import { Lens, LensData } from './client/types';

export const bundlePage = async (webview: vscode.Webview, bundlePath: string, constants: { [key: string]: unknown }) => {
	try {
		const bundle = await fs.readFile(path.join(bundlePath, 'client.bundle.js'), 'utf-8');
		const nonce = randomBytes(16).toString('hex');
		const constantDecls = Object.keys(constants)
			.map((key) => `let ${key} = ${JSON.stringify(constants[key])};`)
			.join('\n');

		const html = `<!DOCTYPE html>
		<html lang="en">
		<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta http-equiv="Content-Security-Policy" content="default-src 'none'; connect-src ${webview.cspSource}; img-src ${webview.cspSource} https: data:; script-src ${webview.cspSource} 'nonce-${nonce}' 'unsafe-eval'; style-src ${webview.cspSource} 'unsafe-inline';">
		<title>Custom Editor: ${bundlePath}</title>
		<base href="${webview.asWebviewUri(vscode.Uri.file(bundlePath))}/">
		</head>
		<body>
		<script type="text/javascript" nonce="${nonce}">(() => {
			${constantDecls}
			${bundle}
		})();</script>
		</body>
		</html>
		`;

		return html;
	} catch(e) {
		return `<html><body>Failed to open client.bundle.js</body></html>`;
	}
};

const showPosition = async (
	doc: vscode.TextDocument,
	lineNumber: number,
	columnNumber: number,
	viewColumn?: vscode.ViewColumn,
) => {
	const pos = new vscode.Position(Math.max(0, lineNumber - 1), Math.max(0, columnNumber - 1));
	await vscode.window.showTextDocument(doc, { viewColumn, selection: new vscode.Range(pos, pos) });
};

const showPositionInFile = async (
	location: ISourceLocation,
	viewColumn?: vscode.ViewColumn,
) => {
	const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(location.source.path.replace(/\//g, '\\')));
	await showPosition(doc, location.lineNumber, location.columnNumber, viewColumn);
	return true;
};

class ProfileDocument implements vscode.CustomDocument {
	constructor(public uri: vscode.Uri) {
	}

	// we don't need the content of the document, we just pass the URL to the WebView

	public dispose() {}
}

export class ProfileEditorProvider implements vscode.CustomReadonlyEditorProvider<ProfileDocument> {
	constructor(private readonly context: vscode.ExtensionContext, private readonly lenses: ProfileCodeLensProvider) {
	}

	public async openCustomDocument(uri: vscode.Uri, openContext: vscode.CustomDocumentOpenContext, token: vscode.CancellationToken): Promise<ProfileDocument> {
		return new ProfileDocument(uri);
	}

	private async updateWebview(document: ProfileDocument, webview: vscode.Webview) {
		webview.html = await bundlePage(webview, path.join(this.context.extensionPath, 'dist'), { 
			PROFILES: [],
			MODELS: [], 
			PROFILE_URL: webview.asWebviewUri(document.uri).toString() 
		});
	}

	public async resolveCustomEditor(document: ProfileDocument, webviewPanel: vscode.WebviewPanel, token: vscode.CancellationToken): Promise<void> {
		// Setup initial content for the webview
		webviewPanel.webview.options = {
			enableScripts: true,
			localResourceRoots: [ vscode.Uri.file(path.dirname(document.uri.fsPath)) ]
		};
		this.updateWebview(document, webviewPanel.webview);

		// rebuild HTML when document changes (this is usually when file is externally modified, as our editor is read-only)
/*		const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument((e) => {
			if (e.document.uri.toString() === document.uri.toString()) {
				this.updateWebview(e.document, webviewPanel.webview);
			}
		});*/

		webviewPanel.webview.onDidReceiveMessage((message) => {
			switch (message.type) {
			case 'openDocument':
				showPositionInFile(message.location, message.toSide ? vscode.ViewColumn.Beside : vscode.ViewColumn.Active);
				return;
			case 'setCodeLenses':
				this.lenses.registerLenses(this.createLensCollection(message.lenses));
				return;
			}
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
