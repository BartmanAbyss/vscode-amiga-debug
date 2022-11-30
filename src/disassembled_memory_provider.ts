import * as vscode from 'vscode';
import { DisassemblyInstruction, SourceLineWithDisassembly } from './symbols';

export class DisassembledMemoryProvider implements vscode.TreeDataProvider<InstructionNode> {
    private _onDidChangeTreeData: vscode.EventEmitter<InstructionNode | undefined> = new vscode.EventEmitter<InstructionNode | undefined>();
    readonly onDidChangeTreeData: vscode.Event<InstructionNode | undefined> = this._onDidChangeTreeData.event;
    private nodes?: InstructionNode[];

    refresh(): void {
        this._onDidChangeTreeData.fire(undefined);
    }

    getTreeItem(element: InstructionNode): vscode.TreeItem {
        return element;
    }

    getChildren(element?: InstructionNode): InstructionNode[] {
        if (!element && this.nodes) {
            return this.nodes;
        } else {
            return [];
        }
    }

    setDisassembledMemory(lines: SourceLineWithDisassembly[]): void {
        this.nodes = [];
        for (const dl of lines) {
            const insts = dl.instructions.map(inst => new InstructionNode(inst));
            this.nodes.push(...insts);
        }
        this.refresh();
    }
}

export class InstructionNode extends vscode.TreeItem {
    constructor(inst: DisassemblyInstruction) {
        const label = `${inst.address}: ${inst.instruction}`;
        super(label, vscode.TreeItemCollapsibleState.None);
        this.description = inst.opcodes;
    }
}