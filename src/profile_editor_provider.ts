//import { Protocol as Cdp } from 'devtools-protocol';
import * as path from 'path';
import * as vscode from 'vscode';
import { buildModel, ILocation, IProfileModel } from './client/model';
import { ProfileCodeLensProvider } from './profile_codelens_provider';
import { LensCollection } from './lens_collection';
import { profileShrinkler } from './backend/shrinkler';

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

export const bundlePage = async (webview: vscode.Webview, bundlePath: string, constants: { [key: string]: unknown }) => {
	const bundle = await fs.readFile(path.join(bundlePath, 'client.bundle.js'), 'utf-8');
	const nonce = randomBytes(16).toString('hex');
	const constantDecls = Object.keys(constants)
		.map((key) => `const ${key} = ${JSON.stringify(constants[key])};`)
		.join('\n');

	const html = `<!DOCTYPE html>
	<html lang="en">
	<head>
	  <meta charset="UTF-8">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} https: data:; script-src ${webview.cspSource} 'nonce-${nonce}' 'unsafe-eval'; style-src ${webview.cspSource} 'unsafe-inline';">
	  <title>Custom Editor: ${bundlePath}</title>
	  <base href="${webview.asWebviewUri(vscode.Uri.file(bundlePath))}/">
	</head>
	<body style="overflow: hidden">
	  <script type="text/javascript" nonce="${nonce}">(() => {
	  	${constantDecls}
	  	${bundle}
	  })();</script>
	</body>
	</html>
  	`;

	return html;
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

export class ProfileEditorProvider implements vscode.CustomTextEditorProvider {
	constructor(private readonly context: vscode.ExtensionContext, private readonly lenses: ProfileCodeLensProvider) {
	}

	private async updateWebview(document: vscode.TextDocument, webview: vscode.Webview) {
		let profiles = JSON.parse(document.getText());
		if(profiles.hunks)
			profiles = [profileShrinkler(profiles)];
		const models: IProfileModel[] = [];
		for(const p of profiles)
			models.push(buildModel(p));
		webview.html = await bundlePage(webview, path.join(this.context.extensionPath, 'dist'), { MODELS: models });
		if(profiles[0].$amiga)
			this.lenses.registerLenses(this.createLensCollection(models[0]));
	}

	public async resolveCustomTextEditor(document: vscode.TextDocument, webviewPanel: vscode.WebviewPanel, token: vscode.CancellationToken): Promise<void> {
		// Setup initial content for the webview
		webviewPanel.webview.options = {
			enableScripts: true,
		};
		this.updateWebview(document, webviewPanel.webview);

		// rebuild HTML when document changes (this is usually when file is externally modified, as our editor is read-only)
		const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument((e) => {
			if (e.document.uri.toString() === document.uri.toString()) {
				this.updateWebview(e.document, webviewPanel.webview);
			}
		});

		webviewPanel.webview.onDidReceiveMessage((message) => {
			switch (message.type) {
			case 'openDocument':
				showPositionInFile(message.location, message.toSide ? vscode.ViewColumn.Beside : vscode.ViewColumn.Active);
				return;
			}
		});
	}

	private createLensCollection(model: IProfileModel) {
		interface LensData { self: number; agg: number; ticks: number; }

		const lenses = new LensCollection<LensData>((dto) => {
			let title: string;
			if (dto.self > 0 || dto.agg > 0) {
				title = `${decimalFormat.format(dto.self / 200)}% Self Time, ${decimalFormat.format(dto.agg / 200)}% Total`;
			} else if (dto.ticks) {
				title = `${integerFormat.format(dto.ticks)} Ticks`;
			} else {
				return;
			}

			return { command: '', title };
		});

		const merge = (location: ILocation) => (existing?: LensData) => ({
			ticks: (existing?.ticks || 0) + location.ticks,
			self: (existing?.self || 0) + location.selfTime,
			agg: (existing?.agg || 0) + location.aggregateTime,
		});

		for (const location of model.locations || []) {
			const mergeFn = merge(location);
/*			lenses.set(
				location.callFrame.url,
				new vscode.Position(
					Math.max(0, location.callFrame.lineNumber),
					Math.max(0, location.callFrame.columnNumber),
				),
				mergeFn,
			);*/

			const src = location.src;
			if (!src || src.source.sourceReference !== 0 || !src.source.path) {
				continue;
			}

			lenses.set(
				src.source.path.toLowerCase().replace(/\\/g, '/'),
				new vscode.Position(Math.max(0, src.lineNumber - 1), Math.max(0, src.columnNumber - 1)),
				mergeFn,
			);
		}

		return lenses;
	}
}
