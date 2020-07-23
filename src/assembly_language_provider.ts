import * as vscode from 'vscode';
import * as childProcess from 'child_process';
import * as path from 'path';

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

interface Token {
	line: number;
	char: number;
	length: number;
	type: TokenTypes;
}

class SourceContext {
	public static extensionPath: string;
	public labels = new Map<string, number>(); // label -> line
	public tokens: Token[] = [];
	private text: string;

	constructor(public fileName: string, private diagnosticCollection: vscode.DiagnosticCollection) {
	}

	public setText(text: string) {
		this.text = text;
	}

	public parse() {
		const objdump = childProcess.spawnSync(
			path.join(SourceContext.extensionPath, "bin/opt/bin/m68k-amiga-elf-as.exe"), 
			[
				'-', // input from stdin
				'-o', 'nul', // no object output
				'--register-prefix-optional', 
				'-asn', // enable listing to stdout; 's' = symbol table, 'n' = turn off forms
				'-L' // include local labels
			], 
			{
				input: this.text,
				maxBuffer: 10*1024*1024 
			});

		const stdout = objdump.stdout.toString().replace(/\r/g, '').split('\n');
		const stderr = objdump.stderr.toString().replace(/\r/g, '').split('\n');

		// get labels
		this.labels.clear();
		for(const line of stdout) {
			const match = line.match(/{standard input}:([0-9]+).*:[0-9a-fA-F]+\s+(.*)$/);
			if(match) {
				this.labels.set(match[2], parseInt(match[1]) - 1);
			}
		}

		// get error/warning messages
		const errors: vscode.Diagnostic[] = [];
		for(const line of stderr) {
			const match = line.match(/{standard input}:([0-9]+): (.*)$/);
			if(match) {
				console.log("stderr", match[1], match[2]);
				errors.push(new vscode.Diagnostic(new vscode.Range(parseInt(match[1]) - 1, 0, parseInt(match[1]) - 1, 10000), match[2]));
			}
		}
		this.diagnosticCollection.set(vscode.Uri.file(this.fileName), errors);

		this.tokens = this.getTokens();
	}

	private getTokens(): Token[] {
		const tokens: Token[] = [];

		const lines = this.text.split(/\r\n|\r|\n/);
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			const words = split_with_offset(line, /[ \t,+-]+/g);
			for(const word of words) {
				if(this.labels.has(word[0])) {
					tokens.push({ line: i, char: word[1], length: word[0].length, type: TokenTypes.function });
				}
			}
		}
		return tokens;
	}
}

export class AmigaAssemblyLanguageProvider implements vscode.DocumentSymbolProvider, vscode.DefinitionProvider, vscode.DocumentSymbolProvider {
	private sourceContexts = new Map<string, SourceContext>();
	public diagnosticCollection: vscode.DiagnosticCollection = vscode.languages.createDiagnosticCollection(AmigaAssemblyLanguageProvider.getLanguageId());

	public static getLanguageId() {
		return 'amiga.assembly';
	}

	constructor(extensionPath: string) {
		SourceContext.extensionPath = extensionPath;

		const changeTimers = new Map<string, any>(); // Keyed by file name.

		// parse documents that are already open when extension is activated
		for(const document of vscode.workspace.textDocuments) {
			if(document.languageId === AmigaAssemblyLanguageProvider.getLanguageId()) {
				console.log("initial parse " + document.fileName);
				this.getSourceContext(document.fileName).setText(document.getText());
				this.getSourceContext(document.fileName).parse();
			}
		}

		// parse documents when they are opened
		vscode.workspace.onDidOpenTextDocument((document: vscode.TextDocument) => {
			if(document.languageId === AmigaAssemblyLanguageProvider.getLanguageId()) {
				console.log("openTextDocument: initial parse " + document.fileName);
				this.getSourceContext(document.fileName).setText(document.getText());
				this.getSourceContext(document.fileName).parse();
			}
		});

		// reparse documents in the background when they are modified
		vscode.workspace.onDidChangeTextDocument((event: vscode.TextDocumentChangeEvent) => {
			if(event.contentChanges.length > 0 && event.document.languageId === AmigaAssemblyLanguageProvider.getLanguageId()) {
				const fileName = event.document.fileName;
				this.getSourceContext(event.document.fileName).setText(event.document.getText());
				if (changeTimers.has(fileName)) {
					clearTimeout(changeTimers.get(fileName));
				}
				changeTimers.set(fileName, setTimeout(() => {
					changeTimers.delete(fileName);
					console.log("reparse " + event.document.fileName);
					this.getSourceContext(event.document.fileName).parse();
				}, 300));
			}
		});
	}

	private getSourceContext(fileName: string): SourceContext {
		let context = this.sourceContexts.get(fileName);
		if(context)
			return context;
		context = new SourceContext(fileName, this.diagnosticCollection);
		this.sourceContexts.set(fileName, context);
		return context;
	}

	public provideDocumentSymbols(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.SymbolInformation[] | vscode.DocumentSymbol[]> {
		const context = this.getSourceContext(document.fileName);
		const symbols: vscode.DocumentSymbol[] = [];
		context.labels.forEach((value, key) => {
			symbols.push(new vscode.DocumentSymbol(key, '*DETAIL*', vscode.SymbolKind.Function, new vscode.Range(value, 0, value, 1000), new vscode.Range(value, 0, value, 1000)));

		});
		return symbols;
	}

	public provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Location | vscode.Location[] | vscode.LocationLink[]> {
		const context = this.getSourceContext(document.fileName);
		const word = document.getText(document.getWordRangeAtPosition(position));
		console.log(word);
		const line = context.labels.get(word);
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
		const context = this.getSourceContext(document.fileName);
		const builder = new vscode.SemanticTokensBuilder();
		context.tokens.forEach((token) => {
			builder.push(token.line, token.char, token.length, token.type);
		});
		return builder.build();
	}
}
