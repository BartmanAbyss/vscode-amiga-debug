import { CodeLens, CodeLensProvider, Range, Command } from 'vscode';

export class CountCodeLensProvider implements CodeLensProvider {
	provideCodeLenses(): CodeLens[] {
		const topOfDocument = new Range(1, 0, 0, 0);

		const c: Command = {
			command: "amiga.toggleCounts",
			title: "Toggle theoretical counts",
		};
		const codeLens = new CodeLens(topOfDocument, c);

		return [codeLens];
	}
}