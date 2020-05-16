import * as path from 'path';
import * as vscode from 'vscode';
import { buildModel } from './client/model';

/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { promises as fs } from 'fs';
import { randomBytes } from 'crypto';

export const bundlePage = async (bundleFile: string, constants: { [key: string]: unknown }) => {
	const bundle = await fs.readFile(bundleFile, 'utf-8');
	const nonce = randomBytes(16).toString('hex');
	const constantDecls = Object.keys(constants)
		.map((key) => `const ${key} = ${JSON.stringify(constants[key])};`)
		.join('\n');

	const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  <meta http-equiv="Content-Security-Policy" content="script-src 'nonce-${nonce}' 'unsafe-eval'">
      <title>Custom Editor: ${bundleFile}</title>
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
};

export class ProfileEditorProvider implements vscode.CustomTextEditorProvider {

	public static register(context: vscode.ExtensionContext): vscode.Disposable {
		const provider = new ProfileEditorProvider(context);
		const providerRegistration = vscode.window.registerCustomEditorProvider(ProfileEditorProvider.viewType, provider);
		return providerRegistration;
	}

	private static readonly viewType = 'amiga.profile.table';

	private static readonly scratchCharacters = ['😸', '😹', '😺', '😻', '😼', '😽', '😾', '🙀', '😿', '🐱'];

	constructor(private readonly context: vscode.ExtensionContext) { }

	/**
	 * Called when our custom editor is opened.
	 *
	 *
	 */
	public async resolveCustomTextEditor(document: vscode.TextDocument, webviewPanel: vscode.WebviewPanel, token: vscode.CancellationToken): Promise<void> {
		// Setup initial content for the webview
		webviewPanel.webview.options = {
			enableScripts: true,
		};
		webviewPanel.webview.html = await this.getHtmlForWebview(document);

		function updateWebview() {
			webviewPanel.webview.postMessage({
				type: 'update',
				text: document.getText(),
			});
		}

		// Hook up event handlers so that we can synchronize the webview with the text document.
		//
		// The text document acts as our model, so we have to sync change in the document to our
		// editor and sync changes in the editor back to the document.
		// 
		// Remember that a single text document can also be shared between multiple custom
		// editors (this happens for example when you split a custom editor)

		const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument((e) => {
			if (e.document.uri.toString() === document.uri.toString()) {
				updateWebview();
			}
		});

		// Make sure we get rid of the listener when our editor is closed.
		webviewPanel.onDidDispose(() => {
			changeDocumentSubscription.dispose();
		});

		// Receive message from the webview.
		webviewPanel.webview.onDidReceiveMessage((e) => {
			switch (e.type) {
				case 'add':
					//this.addNewScratch(document);
					return;

				case 'delete':
					//this.deleteScratch(document, e.id);
					return;
			}
		});

		updateWebview();
	}

	/**
	 * Get the static html used for the editor webviews.
	 */
	private async getHtmlForWebview(document: vscode.TextDocument): Promise<string> {
		return bundlePage(path.join(this.context.extensionPath, 'out', 'client.bundle.js'), {
			MODEL: buildModel(JSON.parse(document.getText())),
		  });
	}


	/**
	 * Try to get a current document as json text.
	 */
	private getDocumentAsJson(document: vscode.TextDocument): any {
		const text = document.getText();
		if (text.trim().length === 0) {
			return {};
		}

		try {
			return JSON.parse(text);
		} catch {
			throw new Error('Could not get document as json. Content is not valid json');
		}
	}

	/**
	 * Write out the json to a given document.
	 */
	private updateTextDocument(document: vscode.TextDocument, json: any) {
		const edit = new vscode.WorkspaceEdit();

		// Just replace the entire document every time for this example extension.
		// A more complete extension should compute minimal edits instead.
		edit.replace(
			document.uri,
			new vscode.Range(0, 0, document.lineCount, 0),
			JSON.stringify(json, null, 2));

		return vscode.workspace.applyEdit(edit);
	}
}
