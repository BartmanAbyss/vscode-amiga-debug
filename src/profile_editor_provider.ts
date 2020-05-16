import * as path from 'path';
import * as vscode from 'vscode';
import { buildModel, ILocation, IProfileModel } from './client/model';
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
	constructor(private readonly context: vscode.ExtensionContext, private readonly lenses: ProfileCodeLensProvider) {
	}

	public async resolveCustomTextEditor(document: vscode.TextDocument, webviewPanel: vscode.WebviewPanel, token: vscode.CancellationToken): Promise<void> {
		// Setup initial content for the webview
		webviewPanel.webview.options = {
			enableScripts: true,
		};
		const model = buildModel(JSON.parse(document.getText()));
		webviewPanel.webview.html = await bundlePage(path.join(this.context.extensionPath, 'out', 'client.bundle.js'), {
			MODEL: model,
		});
		this.lenses.registerLenses(this.createLensCollection(model));
	}

	private createLensCollection(model: IProfileModel) {
		interface LensData { self: number; agg: number; ticks: number; }

		const lenses = new LensCollection<LensData>(dto => {
			let title: string;
			if (dto.self > 10 || dto.agg > 10) {
				title =
					`${decimalFormat.format(dto.self / 1000)}ms Self Time, ` +
					`${decimalFormat.format(dto.agg / 1000)}ms Total`;
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
			lenses.set(
				location.callFrame.url,
				new vscode.Position(
					Math.max(0, location.callFrame.lineNumber),
					Math.max(0, location.callFrame.columnNumber),
				),
				mergeFn,
			);

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
