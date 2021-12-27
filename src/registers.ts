//import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as vscode from 'vscode';

import { NodeSetting, NumberFormat } from './symbols';
import { binaryFormat, createMask, extractBits, hexFormat } from './utils';

interface RegisterValue {
	number: number;
	value: number;
}

export enum RecordType {
	Register,
	Field
}

export class TreeNode extends vscode.TreeItem {
	constructor(
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public contextValue: string, public node: BaseNode|null
	) {
		super(label, collapsibleState);

		this.command = {
			command: 'amiga.registers.selectedNode',
			arguments: [node],
			title: 'Selected Node'
		};
	}
}

export class BaseNode {
	public expanded: boolean;
	protected format: NumberFormat = NumberFormat.Auto;

	constructor(public recordType: RecordType) {
		this.expanded = false;
	}

	public getChildren(): BaseNode[] { return []; }
	public getTreeNode(): TreeNode|null { return null; }
	public getCopyValue(): string|null { return null; }
	public setFormat(format: NumberFormat) {
		this.format = format;
	}
}

export class RegisterNode extends BaseNode {
	private fields: FieldNode[];
	private width = 32; // width in bits
	private currentValue: number|undefined;

	constructor(public name: string, public index: number) {
		super(RecordType.Register);

		if (name.toUpperCase() === 'SR') {
			this.width = 16;
			this.fields = [
				new FieldNode('Carry (C)', 0, 1, this),
				new FieldNode('Overflow (V)', 1, 1, this),
				new FieldNode('Zero (Z)', 2, 1, this),
				new FieldNode('Negative (N)', 3, 1, this),
				new FieldNode('Extend (X)', 4, 1, this),
				new FieldNode('Interrupt Priority Mask', 8, 3, this),
				new FieldNode('Supervisor/User (S)', 13, 1, this),
				new FieldNode('Trace Mode (T)', 15, 1, this)
			];
		}
	}

	public extractBits(offset: number, width: number): number {
		return extractBits(this.currentValue, offset, width);
	}

	public getTreeNode(): TreeNode {
		if(this.currentValue === undefined)
			return null;
		let label = `${this.name} = `;
		switch (this.getFormat()) {
			case NumberFormat.Decimal:
				label += this.currentValue.toString();
				break;
			case NumberFormat.Binary:
				label += binaryFormat(this.currentValue, this.width, false, true);
				break;
			default:
				label += hexFormat(this.currentValue, this.width / 4);
				break;
		}

		if (this.fields && this.fields.length > 0) {
			return new TreeNode(label, vscode.TreeItemCollapsibleState.Collapsed, 'register', this);
		} else {
			return new TreeNode(label, vscode.TreeItemCollapsibleState.None, 'register', this);
		}
	}

	public getChildren(): FieldNode[] {
		return this.fields;
	}

	public setValue(newValue: number) {
		this.currentValue = newValue;
	}

	public getCopyValue(): string {
		switch (this.getFormat()) {
			case NumberFormat.Decimal:
				return this.currentValue.toString();
			case NumberFormat.Binary:
				return binaryFormat(this.currentValue, 32);
			default:
				return hexFormat(this.currentValue, 8);
		}
	}

	public getFormat(): NumberFormat {
		return this.format;
	}
}

export class FieldNode extends BaseNode {
	constructor(public name: string, private offset: number, private size: number, private register: RegisterNode) {
		super(RecordType.Field);
	}

	public getTreeNode(): TreeNode {
		const value = this.register.extractBits(this.offset, this.size);
		let label = `${this.name} = `;
		switch (this.getFormat()) {
			case NumberFormat.Decimal:
				label += value.toString();
				break;
			case NumberFormat.Binary:
				label += binaryFormat(value, this.size, false, true);
				break;
			case NumberFormat.Hexidecimal:
				label += hexFormat(value, Math.ceil(this.size / 4), true);
				break;
			default:
				label += this.size >= 4 ? hexFormat(value, Math.ceil(this.size / 4), true) : binaryFormat(value, this.size, false, true);
				break;
		}

		return new TreeNode(label, vscode.TreeItemCollapsibleState.None, 'field', this);
	}

	public getCopyValue(): string {
		const value = this.register.extractBits(this.offset, this.size);
		switch (this.getFormat()) {
			case NumberFormat.Decimal:
				return value.toString();
			case NumberFormat.Binary:
				return binaryFormat(value, this.size);
			case NumberFormat.Hexidecimal:
				return hexFormat(value, Math.ceil(this.size / 4), true);
			default:
				return this.size >= 4 ? hexFormat(value, Math.ceil(this.size / 4), true) : binaryFormat(value, this.size);
		}
	}

	public getFormat(): NumberFormat {
		if (this.format === NumberFormat.Auto) { return this.register.getFormat(); } else { return this.format; }
	}
}

export class RegisterTreeProvider implements vscode.TreeDataProvider<TreeNode> {
	// eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle,id-denylist,id-match
	public _onDidChangeTreeData: vscode.EventEmitter<TreeNode | undefined> = new vscode.EventEmitter<TreeNode | undefined>();
	public readonly onDidChangeTreeData: vscode.Event<TreeNode | undefined> = this._onDidChangeTreeData.event;

	private registers: RegisterNode[];
	private registerMap: { [index: number]: RegisterNode };
	private loaded = false;

	constructor() {
		this.registers = [];
		this.registerMap = {};
	}

	public refresh(): void {
		if (vscode.debug.activeDebugSession) {
			if (!this.loaded) {
				void vscode.debug.activeDebugSession.customRequest('read-register-list').then((data) => {
					this.createRegisters(data);
					this._refreshRegisterValues();
				});
			} else {
				this._refreshRegisterValues();
			}
		}
	}

	public _refreshRegisterValues() {
		void vscode.debug.activeDebugSession.customRequest('read-registers').then((data) => {
			data.forEach((reg) => {
				const index = parseInt(reg.number, 10);
				if(reg.value === "<unavailable>")
					return;
				const value = parseInt(reg.value, 16);
				const regNode = this.registerMap[index];
				if (regNode) { regNode.setValue(value); }
			});
			this._onDidChangeTreeData.fire(undefined);
		});
	}

	public getTreeItem(element: TreeNode): vscode.TreeItem {
		if(element.node) {
			return element.node.getTreeNode()!;
		} else {
			return null!;
		}
	}

	public createRegisters(regInfo: string[]) {
		this.registerMap = {};
		this.registers = [];

		regInfo.forEach((reg, idx) => {
			if (reg) {
				const rn = new RegisterNode(reg, idx);
				this.registers.push(rn);
				this.registerMap[idx] = rn;
			}
		});

		this.loaded = true;
		this._onDidChangeTreeData.fire(undefined);
	}

	public updateRegisterValues(values: RegisterValue[]) {
		values.forEach((reg) => {
			const node = this.registerMap[reg.number];
			node.setValue(reg.value);
		});

		this._onDidChangeTreeData.fire(undefined);
	}

	public getChildren(element?: TreeNode): vscode.ProviderResult<TreeNode[]> {
		if (this.loaded && this.registers.length > 0) {
			if (element) {
				return element.node.getChildren().map((c) => c.getTreeNode()) ;
			} else {
				return this.registers.map((r) => r.getTreeNode());
			}
		} else if (!this.loaded) {
			return [new TreeNode('Not in active debug session.', vscode.TreeItemCollapsibleState.None, 'message', null)];
		} else {
			return [];
		}
	}

	public debugSessionTerminated() {
		this.loaded = false;
		this.registers = [];
		this.registerMap = {};
		this._onDidChangeTreeData.fire(undefined);
	}

	public debugSessionStarted() {
		this.loaded = false;
		this.registers = [];
		this.registerMap = {};
		this._onDidChangeTreeData.fire(undefined);
	}

	public debugStopped() {
		this.refresh();
	}

	public debugContinued() {
		/**/
	}
}
