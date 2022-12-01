import * as vscode from 'vscode';
import * as childProcess from 'child_process';
import * as path from 'path';
import * as fsp from 'fs/promises';
import * as os from 'os';
import { Disassemble } from './backend/profile';
import { GetCpuDoc, GetCpuInsns, GetCpuName, GetCustomRegDocByName } from './client/docs';
import { decodeInstruction, instructionToString } from 'm68kdecode';
import { formatTimingTable, instructionTimings, Timing } from './m68ktimings';

enum TokenTypes {
	function,
}

function split_with_offset(str: string, re: RegExp) {
	if (!re.global) {
		throw new Error("no no no no :(");
	}
	const results: [string, number][] = [];
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

const spawnAsync = (cmd: string, args?: string[], options?: childProcess.SpawnSyncOptions) =>
	new Promise<{ stdout: Buffer; stderr: Buffer }>((res, rej) => {
		const proc = childProcess.spawn(cmd, args, options);
		if (options.input) {
			proc.stdin.write(options.input);
			proc.stdin.end();
		}
		const stdout = [];
		const stderr = [];
		proc.stdout.on('data', (data) => stdout.push(data));
		proc.stderr.on('data', (data) => stderr.push(data));
		proc.on('close', () => res({
			stdout: Buffer.concat(stdout),
			stderr: Buffer.concat(stderr),
		}));
		proc.on('error', rej);
	});

interface Token {
	line: number;
	char: number;
	length: number;
	type: TokenTypes;
}

export class SourceContext {
	public static extensionPath: string;
	public labels = new Map<string, number>(); // label -> line
	public cycles = new Map<number, string>(); // line -> cycles text
	public hoverText = new Map<number, string>(); // line -> hover text
	public tokens: Token[] = [];
	private text: string;

	constructor(public fileName: string, private diagnosticCollection: vscode.DiagnosticCollection) {
	}

	public setText(text: string) {
		this.text = text;
	}

	public async parse() {
		const date = new Date();
		const dateString = date.getFullYear().toString() + "." + (date.getMonth()+1).toString().padStart(2, '0') + "." + date.getDate().toString().padStart(2, '0') + "-" +
			date.getHours().toString().padStart(2, '0') + "." + date.getMinutes().toString().padStart(2, '0') + "." + date.getSeconds().toString().padStart(2, '0');

		const tmp = path.join(os.tmpdir(), `amiga-as-${dateString}.o.tmp`);
		try {
			await fsp.unlink(tmp);
		} catch(e) {}
		let cmd: string, cmdParams: string[], spawnParams: object;
		let inFile: string;
		if (this.fileName.endsWith('.s')) {
			//	Spawn the GNU Assembler to validate the file.
			cmd = path.join(SourceContext.extensionPath, "bin", process.platform, "opt/bin/m68k-amiga-elf-as");
			cmdParams = [
				'-', // input from stdin
				'-o', tmp, // no object output
				'--register-prefix-optional',
				'-g', // debug info
				'-asn', // enable listing to stdout; 's' = symbol table, 'n' = turn off forms
				'-L', // include local labels
				'-I', '.',
				'-I', vscode.workspace.workspaceFolders[0].uri.fsPath,
				'-I', path.join(SourceContext.extensionPath, "bin", process.platform, "opt/m68k-amiga-elf/sys-include"),
				'-D'  // More "compatible" mode (allows using the Amiga SDK definition files without too much problems).
			];
			spawnParams = {
				input: this.text,
				maxBuffer: 10*1024*1024
			};
			const as = await spawnAsync(cmd, cmdParams, spawnParams);
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
		}
		else if (this.fileName.endsWith('.asm')) {
			//	Spawn VASM to validate the file. VASM does not accept input from the stdin, hence we need to create a temporary file for it.
			inFile = path.join(os.tmpdir(), `amiga-as-${dateString}.s.tmp`);
			const symTmp = path.join(os.tmpdir(), `amiga-as-${dateString}.l.tmp`);
			await fsp.writeFile(inFile, this.text);
			cmd = path.join(SourceContext.extensionPath, "bin", process.platform, "vasmm68k_mot");
			cmdParams = [
				'-m68000',
				'-Felf',
				'-opt-fconst',
				'-nowarn=62',
				'-dwarf=3',
				'-Llo', // Show only program labels in the sorted symbol listing.
				'-Lni', // Do not show included source files in the listing file.
				'-L', symTmp,
				'-x',
				'-I', '.',
				'-I', vscode.workspace.workspaceFolders[0].uri.fsPath,
				'-I', path.join(SourceContext.extensionPath, "bin", process.platform, "opt/m68k-amiga-elf/sys-include"),
				'-o', tmp,
				inFile
			];
			spawnParams = {
				cwd: vscode.workspace.workspaceFolders[0].uri.fsPath,
			};
			const as = await spawnAsync(cmd, cmdParams, spawnParams);
			const stderr = as.stderr.toString().replace(/\r/g, '').split('\n');
			const textLines = this.text.replace(/\r/g, '').split('\n');
			try {
				const stdout = (await fsp.readFile(symTmp)).toString().replace(/\r/g, '').split('\n');

				// get labels
				this.labels.clear();
				let readingSymbols = false;
				const symbolNames : string[] = [];
				for(const line of stdout) {
					if (readingSymbols) {
						if (line === '')
							break;
						const match = line.match(/([^\s]+)\s+([0-9]+:[0-9]+)/);
						if (match) {
							symbolNames.push(match[1]);
						}
					}
					else
					if (line === 'Symbols by name:') {
						readingSymbols = true;
					}
				}

				const symRegExp = new RegExp('^\\s*(' + symbolNames.join('|') + ')[:\\s]{1}');
				let lineCount = 0;
				for(const line of textLines)
				{
					const match = line.match(symRegExp);
					if (match) {
						this.labels.set(match[1], lineCount);
					}
					++lineCount;
				}
			} catch(e) {}

			// get error/warning messages
			const errors: vscode.Diagnostic[] = [];
			for(const line of stderr) {
				if ('' === line)
					continue;

				const match = line.match(/in line ([0-9]+)[^"]+"[^"]+":\s*(.*)+/);
				if(match) {
					errors.push(new vscode.Diagnostic(new vscode.Range(parseInt(match[1]) - 1, 0, parseInt(match[1]) - 1, 10000), match[2], line.startsWith('warning') ? vscode.DiagnosticSeverity.Warning : vscode.DiagnosticSeverity.Error));
				}
				else {
					const match = line.match(/(undefined symbol <([^>]+)>)/);
					if (match) {
						let lineNo = 0;
						for(const srcLine of textLines) { // Error message comes without the corresponding line, search the source code for it.
							if (srcLine.match('[\\,\\s(.-]' + match[2] + '[\\,\\s;\\*).-]?')) {
								errors.push(new vscode.Diagnostic(new vscode.Range(lineNo, 0, lineNo, 10000), match[1]));
							}
							++lineNo;
						}
					}
					else {
						const match = line.match(/from line ([0-9]+)/);
						if(match) { // Fix back-referencing errors.
							errors[errors.length - 1].range = new vscode.Range(parseInt(match[1]) - 1, 0, parseInt(match[1]) - 1, 10000);

							//	Remove duplicates (multiple back-references to the same macro store duplicates).
							const lastError = errors[errors.length - 1];
							for (let i = errors.length - 2; i >= 0; --i)
							{
								if ((errors[i].range.start.line === lastError.range.start.line) && (errors[i].range.end.line === lastError.range.end.line) && (errors[i].message === lastError.message)) {
									errors.pop();
									break;
								}
							}
						} else {
							const match = line.match(/(error|warning)\s+[0-9]+:\s*(.*)+/);
							if (match) { // Line-less errors, will show in line 1.
								errors.push(new vscode.Diagnostic(new vscode.Range(0, 0, 0, 10000), match[2], line.startsWith('warning') ? vscode.DiagnosticSeverity.Warning : vscode.DiagnosticSeverity.Error));
							}
						}
					}
				}
			}
			this.diagnosticCollection.set(vscode.Uri.file(this.fileName), errors);

			try {
				await fsp.unlink(inFile);
			} catch(e) {}
			try {
				await fsp.unlink(symTmp);
			} catch(e) {}
		}

		// get cycles from disassembly
		this.cycles.clear();
		this.hoverText.clear();
		const tmpExists = await fsp.access(tmp).then(() => true, () => false);
		if (tmpExists) {
			const objdumpPath = path.join(SourceContext.extensionPath, "bin", process.platform, "opt/bin/m68k-amiga-elf-objdump");
			try {
				const objdump = Disassemble(objdumpPath, tmp);
				// from objdump.tsx
				const lines = objdump.replace(/\r/g, '').split('\n');
				let lineNum = 0;
				let sourceFile = '';
				for(const line of lines) {
					const locMatch = line.match(/^(\S.+):([0-9]+)( \(discriminator [0-9]+\))?$/); // C:/Users/Chuck/Documents/Visual_Studio_Code/amiga-debug/template/support/gcc8_c_support.c:62 (discriminator 1)
					if(locMatch) {
						sourceFile = path.normalize(locMatch[1]);
						lineNum = parseInt(locMatch[2]);
						continue;
					}
					if (lineNum === 0) {
						continue;
					}
					// Only process source lines from current file, ignore includes
					if (!sourceFile.includes('{standard input}') && sourceFile !== inFile) {
						continue;
					}
					//                                PC             HEX WORDS           OPCODE REST
					const insnMatch: RegExpMatchArray = line.match(/^ *([0-9a-f]+):\t((?:[0-9a-f]{4} )+)\s*(\S+)(?:\s(.*))?$/); //      cce:	0c40 a00e      	cmpi.w #-24562,d0
					if (!insnMatch) {
						continue;
					}

					// Get bytes from hex
					const hex = insnMatch[2].replace(/\s/g, '');
					const bytes: number[] = [];
					for (let i = 0; i < hex.length; i += 2) {
						bytes.push(parseInt(hex.substring(i, i + 2), 16));
					}
					const code = Uint8Array.from(bytes);

					try {
						const inst = decodeInstruction(code);
						const timings = instructionTimings(inst.instruction);

						if (timings?.values) {
							const cycles = timings.values.map((v) => v[0]);
							const min = Math.min(...cycles);
							const max = Math.max(...cycles);
							const cycleText =  min !== max ? `${min}-${max}`: min.toString();
							this.cycles.set(lineNum, cycleText + "T");

							let detail = "```m68k\n" + instructionToString(inst.instruction) + "\n```\n---\n";
							detail += formatTimingTable(timings);
							detail += `---\n${bytes.length} bytes`;
							this.hoverText.set(lineNum, detail);
						}
					} catch (err) {}

					lineNum = 0;
				}
			} catch(e) {}
			try {
				await fsp.unlink(tmp);
			} catch(e) {}
		}

		this.tokens = this.getTokens();
	}

	// theoretical 68000 cycle decorations
	private static decoration = vscode.window.createTextEditorDecorationType({
		before: {
			textDecoration: 'none; white-space: pre; border-radius: 6px; padding: 0 10px 0 10px; position: absolute; line-height: 1rem;',
			backgroundColor: new vscode.ThemeColor("badge.background"),
			color: new vscode.ThemeColor("badge.foreground"),
			margin: '2px 10px 2px 0',
		}
	});
	private static decorationEmpty = vscode.window.createTextEditorDecorationType({
		before: {
			textDecoration: 'none; white-space: pre; padding: 0 10px 0 10px',
			margin: '0 10px 0 0',
			contentText: '        '
		}
	});

	public setDecorations(textEditor: vscode.TextEditor) {
		if(textEditor === null)
			return;

		const optionsArray: vscode.DecorationOptions[] = [];
		for(let line = 0; line < textEditor.document.lineCount; line++) {
			const cyclesStr = this.cycles.get(line + 1);
			const range = new vscode.Range(new vscode.Position(line, 0), new vscode.Position(line, 0));
			if(cyclesStr !== undefined) {
				optionsArray.push({
					range,
					renderOptions: {
						before: {
							contentText: cyclesStr.padStart(8, ' ')
						}
					}
				});
			}
		}
		textEditor.setDecorations(SourceContext.decoration, optionsArray);
	}

	public setEmptyDecorations(textEditor: vscode.TextEditor) {
		if(textEditor === null)
			return;
		const emptyRanges: vscode.Range[] = [];
		for(let line = 0; line < textEditor.document.lineCount; line++) {
			const range = new vscode.Range(new vscode.Position(line, 0), new vscode.Position(line, 0));
			emptyRanges.push(range);
		}
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


export class AmigaAssemblyDocumentMananger {
	private sourceContexts = new Map<string, SourceContext>();
	public diagnosticCollection = vscode.languages.createDiagnosticCollection("amiga-assembly");

	constructor(extensionPath: string, selector: vscode.DocumentSelector) {
		SourceContext.extensionPath = extensionPath;

		const changeTimers = new Map<string, NodeJS.Timeout>(); // Keyed by file name.

		// parse documents that are already open when extension is activated
		for(const document of vscode.workspace.textDocuments) {
			if (vscode.languages.match(selector, document)) {
				console.log("initial parse " + document.fileName);
				this.getSourceContext(document.fileName).setText(document.getText());
				this.getSourceContext(document.fileName).setEmptyDecorations(getEditorForDocument(document));
				void this.getSourceContext(document.fileName).parse().then(() => {
					this.getSourceContext(document.fileName).setDecorations(getEditorForDocument(document));
				});
			}
		}

		// parse documents when they are opened
		vscode.workspace.onDidOpenTextDocument((document: vscode.TextDocument) => {
			if (vscode.languages.match(selector, document)) {
				console.log("openTextDocument: initial parse " + document.fileName);
				this.getSourceContext(document.fileName).setEmptyDecorations(getEditorForDocument(document));
				this.getSourceContext(document.fileName).setText(document.getText());
				void this.getSourceContext(document.fileName).parse().then(() => {
					this.getSourceContext(document.fileName).setDecorations(getEditorForDocument(document));
				});
			}
		});

		// reparse documents in the background when they are modified
		vscode.workspace.onDidChangeTextDocument((event: vscode.TextDocumentChangeEvent) => {
			if (vscode.languages.match(selector, event.document)) {
				const fileName = event.document.fileName;
				this.getSourceContext(event.document.fileName).setEmptyDecorations(getEditorForDocument(event.document));
				this.getSourceContext(event.document.fileName).setText(event.document.getText());
				if (changeTimers.has(fileName)) {
					clearTimeout(changeTimers.get(fileName));
				}
				changeTimers.set(fileName, setTimeout(() => {
					changeTimers.delete(fileName);
					console.log("reparse " + event.document.fileName);
					void this.getSourceContext(event.document.fileName).parse().then(() => {
						this.getSourceContext(event.document.fileName).setDecorations(getEditorForDocument(event.document));
					});
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

	public dispose() {
		this.diagnosticCollection.dispose();
	}
}

export class AmigaAssemblyLanguageProvider implements vscode.DocumentSymbolProvider, vscode.DefinitionProvider, vscode.DocumentSemanticTokensProvider, vscode.CompletionItemProvider, vscode.HoverProvider {
	constructor(protected documentManager: AmigaAssemblyDocumentMananger, private cpuDocs = true) {
	}

	// CompletionItemProvider
	public provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList<vscode.CompletionItem>> {
		const items: vscode.CompletionItem[] = [];
		for(const opc of GetCpuInsns()) {
			items.push(new vscode.CompletionItem({ label: opc, description: GetCpuName(opc) }, vscode.CompletionItemKind.Keyword));
		}
		const sourceContext = this.documentManager.getSourceContext(document.fileName);
		sourceContext.labels.forEach((value, key) => {
			items.push(new vscode.CompletionItem({ label: key }, vscode.CompletionItemKind.Function));
		});
		return items;
	}

	public resolveCompletionItem?(item: vscode.CompletionItem, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CompletionItem> {
		return null;
		//throw new Error('Method not implemented.');
	}

	// DocumentSymbolProvider
	public provideDocumentSymbols(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.SymbolInformation[] | vscode.DocumentSymbol[]> {
		const context = this.documentManager.getSourceContext(document.fileName);
		const symbols: vscode.DocumentSymbol[] = [];
		context.labels.forEach((value, key) => {
			symbols.push(new vscode.DocumentSymbol(key, '*DETAIL*', vscode.SymbolKind.Function, new vscode.Range(value, 0, value, 1000), new vscode.Range(value, 0, value, 1000)));
		});
		return symbols;
	}

	// DefinitionProvider
	public provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Location | vscode.Location[] | vscode.LocationLink[]> {
		const context = this.documentManager.getSourceContext(document.fileName);
		const word = document.getText(document.getWordRangeAtPosition(position));
		//console.log(word);
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

	// HoverProvider
	public provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {
		if (position.character === 0) {
			const context = this.documentManager.getSourceContext(document.fileName);
			const code = context.hoverText.get(position.line + 1);
			if (code)
				return new vscode.Hover(new vscode.MarkdownString(code));
		}

		const word = document.getText(document.getWordRangeAtPosition(position));
		//console.log(word);
		const doc = this.cpuDocs
			? GetCpuDoc(word) || GetCustomRegDocByName(word)
			: GetCustomRegDocByName(word);
		if(doc)
			return new vscode.Hover(new vscode.MarkdownString(doc));
		return null;
	}

	public provideDocumentSemanticTokens(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.SemanticTokens {
		const context = this.documentManager.getSourceContext(document.fileName);
		const builder = new vscode.SemanticTokensBuilder();
		context.tokens.forEach((token) => {
			builder.push(token.line, token.char, token.length, token.type);
		});
		return builder.build();
	}
}
