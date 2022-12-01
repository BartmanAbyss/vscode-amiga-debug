//import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as vscode from 'vscode';

import { NodeSetting, NumberFormat, SymbolInformation } from './symbols';
import { binaryFormat, createMask, extractBits, hexFormat } from './utils';
import { Custom, CustomData, CustomSpecial } from './client/custom';
import { GetCustomRegDoc } from './client/docs';
import { DebugProtocol } from 'vscode-debugprotocol';

interface RegisterValue {
	// eslint-disable-next-line id-denylist
	number: string;
	value: string;
}

interface SymbolAddress {
	name: string;
	address: number;
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

export abstract class BaseNode {
	public expanded = false;
	protected format = NumberFormat.Auto;
	protected width = 32; // width in bits
	protected value: number|undefined;
	protected label: string|undefined;
	protected children: BaseNode[] = [];

	public getChildren(): BaseNode[] {
		return this.children;
	}

	public setFormat(format: NumberFormat) {
		this.format = format;
	}
	public getFormat(): NumberFormat {
		return this.format;
	}

	public getValue(): number|undefined {
		return this.value;
	}

	public setValue(newValue: number) {
		this.value = newValue;
	}

	public getLabel(): string|undefined {
		return this.label;
	}

	public setLabel(newLabel: string|undefined) {
		this.label = newLabel;
	}

	public getBytes(): number|undefined {
		return Math.ceil(this.width / 8);
	}

	public getCopyValue(): string {
		const value = this.getValue();
		const nibbles = Math.ceil(this.width / 4);
		switch (this.getFormat()) {
			case NumberFormat.Decimal:
				return value.toString();
			case NumberFormat.Binary:
				return binaryFormat(value, this.width);
			case NumberFormat.Hexidecimal:
				return hexFormat(value, nibbles, true);
			default:
				return this.width >= 4
					? hexFormat(value, nibbles, true)
					: binaryFormat(value, this.width);
		}
	}

	public getDisplayValue(): string {
		let value = this.getDisplayNumber();
		if (this.label) {
			value += " <" + this.label + ">";
		}
		return value;
	}

	protected getDisplayNumber(): string {
		const value = this.getValue();
		const nibbles = Math.ceil(this.width / 4);
		switch (this.getFormat()) {
			case NumberFormat.Decimal:
				return value.toString();
			case NumberFormat.Binary:
				return binaryFormat(value, this.width, false, true);
			case NumberFormat.Hexidecimal:
				return hexFormat(value, nibbles, true);
			default:
				return this.width >= 4
					? hexFormat(value, nibbles, true)
					: binaryFormat(value, this.width, false, true);
		}
	}

	public abstract getTreeNode(): TreeNode;
}

export class RegisterNode extends BaseNode {
	constructor(public name: string, public index: number) {
		super();

		if (name.toUpperCase() === 'SR') {
			this.width = 16;
			this.children = [
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
		return extractBits(this.value, offset, width);
	}

	public getTreeNode(): TreeNode {
		if(this.value === undefined)
			return null;
		const label = `${this.name} = ${this.getDisplayValue()}`;
		const collapsibleState = this.children?.length > 0
			? vscode.TreeItemCollapsibleState.Collapsed
			: vscode.TreeItemCollapsibleState.None;

		return new TreeNode(label, collapsibleState, 'register', this);
	}
}

export class FieldNode extends BaseNode {
	constructor(public name: string, private offset: number, protected width: number, private register: RegisterNode) {
		super();
	}

	public getValue() {
		return this.register.extractBits(this.offset, this.width);
	}

	public getTreeNode(): TreeNode {
		const label = `${this.name} = ${this.getDisplayValue()}`;
		return new TreeNode(label, vscode.TreeItemCollapsibleState.None, 'field', this);
	}

	public getFormat(): NumberFormat {
		return this.format === NumberFormat.Auto
			? this.register.getFormat()
			: this.format;
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
		void Promise.all([
			vscode.debug.activeDebugSession.customRequest('read-registers'),
			getSymbolAddresses(),
		]).then(([data, addresses]) => {
			(data as RegisterValue[]).forEach((reg) => {
				const index = parseInt(reg.number, 10);
				const regNode = this.registerMap[index];
				if(reg.value === "<unavailable>")
					return;
				const value = parseInt(reg.value, 16);
				if (regNode) {
					regNode.setValue(value);
					regNode.setLabel(offsetLabel(addresses, value));
				}
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

export class CustomRegisterTreeProvider implements vscode.TreeDataProvider<TreeNode> {
	// eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle,id-denylist,id-match
	public _onDidChangeTreeData: vscode.EventEmitter<TreeNode | undefined> = new vscode.EventEmitter<TreeNode | undefined>();
	public readonly onDidChangeTreeData: vscode.Event<TreeNode | undefined> = this._onDidChangeTreeData.event;

	private nodes: CustomRegisterNode[] = [];

	constructor() {
		let offs = 0;
		while (offs < 0x1fe) {
			const customReg = Custom.ByOffs(offs);
			const excluded = ["-", "RESERVED"];
			if (customReg && !excluded.includes(customReg.name)) {
				const node = new CustomRegisterNode(customReg);
				this.nodes.push(node);
				offs += node.getBytes();
			} else {
				offs += 2;
			}
		}
	}

	public async refresh(): Promise<void> {
		if (vscode.debug.activeDebugSession) {
			const args = { address: 0xdff000, length: 0x1fe };
			const { bytes } = await vscode.debug.activeDebugSession.customRequest('read-memory', args) as { bytes: number[]};
			const addresses = await getSymbolAddresses();
			this.nodes.forEach((rn) => {
				let value = 0;
				for (let i = 0; i < rn.getBytes(); i++) {
					value = (value << 8) | bytes[rn.offset + i];
				}
				rn.setValue(value);
				if (rn.getBytes() === 4) {
					rn.setLabel(offsetLabel(addresses, value));
				}
			});
			this._onDidChangeTreeData.fire(undefined);
		}
	}

	public getTreeItem(element: TreeNode) {
		return element.node?.getTreeNode() ?? null;
	}

	public getChildren(element?: TreeNode): vscode.ProviderResult<TreeNode[]> {
		if (element) {
			return element.node.getChildren().map((c) => c.getTreeNode()) ;
		} else {
			return this.nodes.map((r) => r.getTreeNode());
		}
	}

	public debugSessionTerminated() {
		this._onDidChangeTreeData.fire(undefined);
	}

	public debugSessionStarted() {
		this._onDidChangeTreeData.fire(undefined);
	}

	public debugStopped() {
		void this.refresh();
	}

	public debugContinued() {
		/**/
	}
}

export class CustomRegisterNode extends BaseNode {
	private name: string;
	private doc: string;
	public readonly offset: number;

	constructor(customData: CustomData) {
		super();
		this.offset = customData.adr - 0xdff000;
		this.doc = GetCustomRegDoc(this.offset);
		if (customData.special & CustomSpecial.pth) {
			this.width = 32;
			this.name = customData.name.substring(0, customData.name.length - 1);
		} else {
			this.width = 16;
			this.name = customData.name;
		}
	}

	public getTreeNode(): TreeNode {
		if(this.value === undefined)
			return null;

		const hexOffset = hexFormat(this.offset, 3);
		const label = `${this.name} (${hexOffset}) = ${this.getDisplayValue()}`;

		const node = new TreeNode(label, vscode.TreeItemCollapsibleState.None, 'register', this);
		node.tooltip = new vscode.MarkdownString(this.doc);
		return node;
	}
}

async function getSymbolAddresses(): Promise<SymbolAddress[]> {
	const session = vscode.debug.activeDebugSession;
	const symbols = await session.customRequest('get-symbols') as SymbolInformation[];
	const { variables } = await session.customRequest('get-global-variables') as DebugProtocol.VariablesResponse["body"];
	const symbolAddresses = symbols
		.filter((s) => s.name !== "" && s.base > 0)
		.map((s) => ({
			name: s.name,
			address: s.base + s.address,
		}));
	const variableAddresses = variables
		.filter((v) => v.memoryReference)
		.map((v) => ({
			name: v.name,
			address: parseInt(v.memoryReference, 16),
		}));
	return [...symbolAddresses, ...variableAddresses]
		.sort((a, b) => a.address - b.address);
}

function offsetLabel(addresses: SymbolAddress[], registerValue: number): string | undefined {
	const symbol = addresses.find(s => s.address >= registerValue);
	if (symbol) {
		const offset = symbol.address - registerValue;
		const maxOffset = 256;
		if (offset < maxOffset) {
			let label = symbol.name;
			if (offset) {
				label += "+" + offset.toString();
			}
			return label;
		}
	}
}