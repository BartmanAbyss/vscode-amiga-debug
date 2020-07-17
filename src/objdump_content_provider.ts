import * as vscode from 'vscode';
import * as childProcess from 'child_process';
import * as path from 'path';

export class ObjdumpContentProvider implements vscode.TextDocumentContentProvider {
	public async provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): Promise<string> {
		const elfPath = uri.path.substr(1);
		const binPath = await vscode.commands.executeCommand("amiga.bin-path") as string;
		const objdumpPath = path.join(binPath, "opt/bin/m68k-amiga-elf-objdump.exe");

		const objdump = childProcess.spawnSync(objdumpPath, ['--disassemble', '-l', elfPath], { maxBuffer: 10*1024*1024 });
		if(objdump.status !== 0)
			throw objdump.error;
		//const outputs = objdump.stdout.toString().replace(/\r/g, '').split('\n');
		//for(const line of outputs) {
		//}
		return objdump.stdout.toString();
	}

	private sourceEditor: vscode.TextEditor;

	public async handleSelection(e: vscode.TextEditorSelectionChangeEvent) {
		const line = e.textEditor.document.lineAt(e.selections[0].start.line);
		const match = line.text.match(/^(\S.+):([0-9]+)$/);
		if(match) {
			console.log(match[1], match[2]);
			this.sourceEditor = await vscode.window.showTextDocument(vscode.Uri.file(match[1]), {
				viewColumn: vscode.ViewColumn.Beside,
				preserveFocus: true,
				preview: true,
				selection: new vscode.Range(parseInt(match[2]) - 1, 0, parseInt(match[2]), 0)
			});
		}
	}

	public handleEditorChanged(editor: vscode.TextEditor) {
		if(this.sourceEditor) {
			this.sourceEditor.hide();
			this.sourceEditor = undefined;
		}
	}
}
