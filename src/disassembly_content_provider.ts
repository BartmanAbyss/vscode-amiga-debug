import * as vscode from 'vscode';
import { DisassemblyInstruction, SourceLineWithDisassembly } from './symbols';

export class DisassemblyContentProvider implements vscode.TextDocumentContentProvider {
	public provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): Thenable<string> {
		return new Promise((resolve, reject) => {
			const path = uri.path;
			const parts = path.substring(1, path.length - 9 /* ".amigaasm" */).split('::');

			let args: any;
			// disassemble address
			if(parts.length === 1 && parts[0].startsWith('0x')) {
				args = { startAddress: parseInt(parts[0]) };
			} else if (parts.length === 1) {
				args = { function: parts[0] };
			} else {
				args = { file: parts[0], function: parts[1] };
			}

			vscode.debug.activeDebugSession.customRequest('amiga-disassemble', args).then((data) => {
				const lines: SourceLineWithDisassembly[] = data.lines;

				let output = '';
				lines.forEach((line) => {
					if(line.source !== undefined)
						output += line.source;
					line.instructions.forEach((i) => {
						output += `${i.address}: ${this.padEnd(15, i.opcodes)} \t${i.instruction}\n`;
					});
				});

				resolve(output);
			}, (error: Error) => {
				void vscode.window.showErrorMessage(error.message);
				reject(error.message);
			});
		});
	}

	private padEnd(len: number, value: string): string {
		for (let i = value.length; i < len; i++) { value += ' '; }
		return value;
	}
}
