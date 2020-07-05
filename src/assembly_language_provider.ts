import * as vscode from 'vscode';

enum TokenTypes {
	function,
}

function split_with_offset(str: string, re: RegExp) {
	if (!re.global) {
		throw "no no no no :(";
	}
	const results = [];
	let m, p;
	while (p = re.lastIndex, m = re.exec(str)) {
		results.push([str.substring(p, m.index), p]);
	}
	results.push([str.substring(p), p]);
	return results;
}

export class AmigaAssemblyLanguageProvider implements vscode.DocumentSymbolProvider, vscode.DefinitionProvider, vscode.DocumentSymbolProvider {
	private getLabels(document: vscode.TextDocument): Map<string, number> {
		const map = new Map<string, number>();

		for(let l = 0; l < document.lineCount; l++) {
			const line = document.lineAt(l);
			const match = line.text.match(/(?:^|\\s+)([a-zA-Z0-9_]+):/);
			if(match) {
				// TODO: filter comments
				// TODO: filter out local labels
				map.set(match[1], l);
				//console.log(match[1]);
			}
		}
		return map;
	}

	public provideDocumentSymbols(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.SymbolInformation[] | vscode.DocumentSymbol[]> {
		const lines = document.getText().split(/\r\n|\r|\n/);
		const symbols: vscode.DocumentSymbol[] = [];
		// get all labels
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			const match = line.match(/(?:^|\\s+)([a-zA-Z0-9_]+):/);
			if(match) {
				// TODO: filter comments
				// TODO: filter out local labels
				symbols.push(new vscode.DocumentSymbol(match[1], '*DETAIL*', vscode.SymbolKind.Function, new vscode.Range(i, 0, i, 1000), new vscode.Range(i, 0, i, 1000)));
				//console.log(match[1]);
			}
		}
		return symbols;
	}

	public provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Location | vscode.Location[] | vscode.LocationLink[]> {
		const labels = this.getLabels(document);
		const word = document.getText(document.getWordRangeAtPosition(position));
		console.log(word);
		const line = labels.get(word);
		if(line === undefined)
			return undefined;
		return new vscode.Location(document.uri, new vscode.Position(line, 0));
	}

	public static getSemanticTokensLegend() {
		const tokenTypes = ['function'];
		const tokenModifiers = [];
		return new vscode.SemanticTokensLegend(tokenTypes, tokenModifiers);
	}

	public async provideDocumentSemanticTokens(document: vscode.TextDocument, token: vscode.CancellationToken): Promise<vscode.SemanticTokens> {
		const builder = new vscode.SemanticTokensBuilder();

		const lines = document.getText().split(/\r\n|\r|\n/);

		const labels = new Set<string>();

		// first get all labels
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			const match = line.match(/(?:^|\\s+)([a-zA-Z0-9_]+):/);
			if(match) {
				// TODO: filter comments
				// TODO: filter out local labels
				labels.add(match[1]);
				//console.log(match[1]);
			}
		}
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			const words = split_with_offset(line, /[ \t,+-]+/g);
			for(const word of words) {
				if(labels.has(word[0])) {
					builder.push(i, word[1], word[0].length, TokenTypes.function);
				}
			}
		}
		return builder.build();
	}
}
