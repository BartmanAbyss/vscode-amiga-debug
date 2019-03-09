import * as vscode from 'vscode';
import { DisassemblyInstruction } from './symbols';

export class DisassemblyContentProvider implements vscode.TextDocumentContentProvider {
	public provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): Thenable<string> {
		return new Promise((resolve, reject) => {
			const path = uri.path;
			const pathParts = path.substring(1, path.length - 9 /* ".amigaasm" */).split('::');

			let args;
			// disassemble address
			if(pathParts.length === 1 && pathParts[0].startsWith('0x')) {
				args = { startAddress: parseInt(pathParts[0]) };
			} else if (pathParts.length === 1) {
				args = { function: pathParts[0] };
			} else {
				args = { file: pathParts[0], function: pathParts[1] };
			}

			vscode.debug.activeDebugSession!.customRequest('disassemble', args).then((data) => {
				const instructions: DisassemblyInstruction[] = data.instructions;

				let output = '';
				instructions.forEach((i) => {
					output += `${i.address}: ${this.padEnd(15, i.opcodes)} \t${i.instruction}\n`;
				});

				resolve(output);
			}, (error) => {
				vscode.window.showErrorMessage(error.message);
				reject(error.message);
			});
		});
	}

	private padEnd(len: number, value: string): string {
		for (let i = value.length; i < len; i++) { value += ' '; }
		return value;
	}
}
