import * as vscode from 'vscode';
import * as childProcess from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { Disassemble } from './backend/profile';
import { GetCycles } from './client/68k';
import { GetCpuDoc, GetCpuInsns, GetCpuName } from './client/docs';

enum TokenTypes {
	function,
}

function split_with_offset(str: string, re: RegExp) {
	if (!re.global) {
		throw new Error("no no no no :(");
	}
	const results = [];
	let m: RegExpExecArray, p: number;
	while (p = re.lastIndex, m = re.exec(str)) {
		results.push([str.substring(p, m.index), p]);
	}
	results.push([str.substring(p), p]);
	return results;
}

export function getEditorForDocument(doc: vscode.TextDocument): vscode.TextEditor {
	for(const textEditor of vscode.window.visibleTextEditors) {
		if(textEditor.document === doc)
			return textEditor;
	}
	return null;
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
	public cycles = new Map<number, string>(); // line -> cycles text
	public tokens: Token[] = [];
	private text: string;

	constructor(public fileName: string, private diagnosticCollection: vscode.DiagnosticCollection) {
	}

	public setText(text: string) {
		this.text = text;
	}

	public parse() {
		const date = new Date();
		const dateString = date.getFullYear().toString() + "." + (date.getMonth()+1).toString().padStart(2, '0') + "." + date.getDate().toString().padStart(2, '0') + "-" +
			date.getHours().toString().padStart(2, '0') + "." + date.getMinutes().toString().padStart(2, '0') + "." + date.getSeconds().toString().padStart(2, '0');
		
		const tmp = path.join(os.tmpdir(), `amiga-as-${dateString}.o.tmp`);
		try {
			fs.unlinkSync(tmp);
		} catch(e) {}
		let cmd : string, cmdParams : string[], spawnParams : object;
		if (this.fileName.endsWith('.s')) {
			//	Spawn the GNU Assembler to validate the file.
			cmd         = path.join(SourceContext.extensionPath, "bin/opt/bin/m68k-amiga-elf-as.exe");
			cmdParams   = [
				'-', // input from stdin
				'-o', tmp, // no object output
				'--register-prefix-optional', 
				'-g', // debug info
				'-asn', // enable listing to stdout; 's' = symbol table, 'n' = turn off forms
				'-L', // include local labels
				'-I', '.', 
				'-I', vscode.workspace.workspaceFolders[0].uri.fsPath,
				'-I', path.join(SourceContext.extensionPath, "bin/opt/m68k-amiga-elf/sys-include"),
				'-D'  // More "compatible" mode (allows using the Amiga SDK definition files without too much problems).			
			];
			spawnParams = {			
				input: this.text,
				maxBuffer: 10*1024*1024 
			};
		}
		else
		if (this.fileName.endsWith('.asm')) {
			//	Spawn VASM to validate the file. VASM does not accept input from the stdin, hence we need to create a temporary file for it.
			const inFile = path.join(os.tmpdir(), `amiga-as-${dateString}.s.tmp`);
			try {
				fs.unlinkSync(inFile);
			} catch(e) {}
			fs.writeFileSync (inFile, this.text);
			cmd         = path.join(SourceContext.extensionPath, "bin/opt/bin/vasmm68k_mot.exe");
			cmdParams   = [
				'-m68000', 
				'-Felf', 
				'-opt-fconst', 
				'-nowarn=62', 
				'-dwarf=3',
				'-I', '.', 
				'-I', vscode.workspace.workspaceFolders[0].uri.fsPath,
				'-I', path.join(SourceContext.extensionPath, "bin/opt/m68k-amiga-elf/sys-include"),
				'-o', tmp, 
				inFile
			];
			spawnParams = {};
		}			
		const as = childProcess.spawnSync(cmd, cmdParams, spawnParams);
		const stdout = as.stdout.toString().replace(/\r/g, '').split('\n');
		const stderr = as.stderr.toString().replace(/\r/g, '').split('\n');

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

		// get cycles from disassembly
		this.cycles.clear();
		if(fs.existsSync(tmp)) {
			const objdumpPath = path.join(SourceContext.extensionPath, "bin/opt/bin/m68k-amiga-elf-objdump.exe");
			try {
				const objdump = Disassemble(objdumpPath, tmp);
				// from objdump.tsx
				const lines = objdump.replace(/\r/g, '').split('\n');
				let lineNum = 0;
				for(const line of lines) {
					const locMatch = line.match(/^(\S.+):([0-9]+)( \(discriminator [0-9]+\))?$/); // C:/Users/Chuck/Documents/Visual_Studio_Code/amiga-debug/template/support/gcc8_c_support.c:62 (discriminator 1)
					if(locMatch) {
						lineNum = parseInt(locMatch[2]);
						continue;
					}
					//                                PC             HEX WORDS           OPCODE REST
					const insnMatch = line.match(/^ *([0-9a-f]+):\t((?:[0-9a-f]{4} )+)\s*(\S+)(?:\s(.*))?$/); //      cce:	0c40 a00e      	cmpi.w #-24562,d0
					if(insnMatch) {
						const pc = parseInt(insnMatch[1], 16);
						const hex = insnMatch[2].split(' ');
						const opcode = insnMatch[3];
						const rest = insnMatch[4] || '';
						const insn = new Uint16Array(hex.length);
						hex.forEach((h, i) => { insn[i] = parseInt(h, 16); });
						if(lineNum !== 0)
							this.cycles.set(lineNum, GetCycles(insn).map((c) => `${c.total}`).join('-') + 'T');
						lineNum = 0;
					}
				}
			} catch(e) {}
			try {
				fs.unlinkSync(tmp);
			} catch(e) {}
		}

		this.tokens = this.getTokens();
	}

	// theoretical 68000 cycle decorations
	private static decoration = vscode.window.createTextEditorDecorationType({
		before: {
			textDecoration: 'none; white-space: pre; border-radius: 6px; padding: 0 10px 0 10px',
			backgroundColor: new vscode.ThemeColor("badge.background"),
			color: new vscode.ThemeColor("badge.foreground"),
			margin: '0 10px 0 10px'
		}
	});
	private static decorationEmpty = vscode.window.createTextEditorDecorationType({
		before: {
			textDecoration: 'none; white-space: pre; padding: 0 10px 0 10px',
			margin: '0 10px 0 10px',
			contentText: '      '
		}
	});

	public setDecorations(textEditor: vscode.TextEditor) {
		if(textEditor === null)
			return;
		
		const optionsArray: vscode.DecorationOptions[] = [];
		const emptyRanges: vscode.Range[] = [];
		for(let line = 1; line < textEditor.document.lineCount; line++) {
			const cyclesStr = this.cycles.get(line);
			const range = new vscode.Range(new vscode.Position(line - 1, 0), new vscode.Position(line - 1, 0));
			if(cyclesStr !== undefined) {
				optionsArray.push({ 
					range, 
					renderOptions: { 
						before: { 
							contentText: cyclesStr.padStart(6, ' ')
						} 
					} 
				});
			} else {
				emptyRanges.push(range);
			}
		}
		textEditor.setDecorations(SourceContext.decoration, optionsArray);
		textEditor.setDecorations(SourceContext.decorationEmpty, emptyRanges);
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

export class AmigaAssemblyLanguageProvider implements vscode.DocumentSymbolProvider, vscode.DefinitionProvider, vscode.DocumentSemanticTokensProvider, vscode.CompletionItemProvider, vscode.HoverProvider {
	private sourceContexts = new Map<string, SourceContext>();
	public diagnosticCollection: vscode.DiagnosticCollection = vscode.languages.createDiagnosticCollection(AmigaAssemblyLanguageProvider.getLanguageId());

	public static getLanguageId() {
		return 'amiga.assembly';
	}

	constructor(extensionPath: string) {
		SourceContext.extensionPath = extensionPath;

		const changeTimers = new Map<string, NodeJS.Timeout>(); // Keyed by file name.

		// parse documents that are already open when extension is activated
		for(const document of vscode.workspace.textDocuments) {
			if(document.languageId === AmigaAssemblyLanguageProvider.getLanguageId()) {
				console.log("initial parse " + document.fileName);
				this.getSourceContext(document.fileName).setText(document.getText());
				this.getSourceContext(document.fileName).parse();
				this.getSourceContext(document.fileName).setDecorations(getEditorForDocument(document));
			}
		}

		// parse documents when they are opened
		vscode.workspace.onDidOpenTextDocument((document: vscode.TextDocument) => {
			if(document.languageId === AmigaAssemblyLanguageProvider.getLanguageId()) {
				console.log("openTextDocument: initial parse " + document.fileName);
				this.getSourceContext(document.fileName).setText(document.getText());
				this.getSourceContext(document.fileName).parse();
				this.getSourceContext(document.fileName).setDecorations(getEditorForDocument(document));
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
					this.getSourceContext(event.document.fileName).setDecorations(getEditorForDocument(event.document));
				}, 300));
			}
		});
	}

	public getSourceContext(fileName: string): SourceContext {
		let context = this.sourceContexts.get(fileName);
		if(context)
			return context;
		context = new SourceContext(fileName, this.diagnosticCollection);
		this.sourceContexts.set(fileName, context);
		return context;
	}

	// CompletionItemProvider
	public provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList<vscode.CompletionItem>> {
		const items: vscode.CompletionItem[] = [];
		for(const opc of GetCpuInsns()) {
			items.push(new vscode.CompletionItem({ label: opc, description: GetCpuName(opc) }, vscode.CompletionItemKind.Keyword));
		}
		const sourceContext = this.getSourceContext(document.fileName);
		sourceContext.labels.forEach((value, key) => {
			items.push(new vscode.CompletionItem({ label: key }, vscode.CompletionItemKind.Function));
		});
		return items;
	}

	public resolveCompletionItem?(item: vscode.CompletionItem, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CompletionItem> {
		return null;
		//throw new Error('Method not implemented.');
	}

	// HoverProvider
	public provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {
		const word = document.getText(document.getWordRangeAtPosition(position));
		console.log(word);
		const doc = GetCpuDoc(word);
		if(doc)
			return new vscode.Hover(new vscode.MarkdownString(doc));
		return null;
	}

	// DocumentSymbolProvider
	public provideDocumentSymbols(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.SymbolInformation[] | vscode.DocumentSymbol[]> {
		const context = this.getSourceContext(document.fileName);
		const symbols: vscode.DocumentSymbol[] = [];
		context.labels.forEach((value, key) => {
			symbols.push(new vscode.DocumentSymbol(key, '*DETAIL*', vscode.SymbolKind.Function, new vscode.Range(value, 0, value, 1000), new vscode.Range(value, 0, value, 1000)));
		});
		return symbols;
	}

	// DefinitionProvider	
	public provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Location | vscode.Location[] | vscode.LocationLink[]> {
		const context = this.getSourceContext(document.fileName);
		const word = document.getText(document.getWordRangeAtPosition(position));
		console.log(word);
		const line = context.labels.get(word);
		if(line === undefined)
			return undefined;
		return new vscode.Location(document.uri, new vscode.Position(line, 0));
	}

	// DocumentSemanticTokensProvider
	public static getSemanticTokensLegend() {
		const tokenTypes = ['function'];
		const tokenModifiers: string[] = [];
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
