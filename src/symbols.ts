export interface SourceLineWithDisassembly {
	source?: string;
	line?: number;
	file?: string;
	fullname?: string;
	instructions: DisassemblyInstruction[];
}

export interface DisassemblyInstruction {
	address: string;
	functionName: string;
	offset: number;
	instruction: string;
	opcodes: string;
}

export enum SymbolType {
	Function,
	File,
	Object,
	Normal
}

export enum SymbolScope {
	Local,
	Global,
	Neither,
	Both
}

export interface SymbolInformation {
	address: number; // relative to start of section
	base: number; // comes from relocation, is address of section
	size: number;
	name: string;
	section: string;
	type: SymbolType;
	scope: SymbolScope;
	file: string | null;
	lines: SourceLineWithDisassembly[] | null;
	hidden: boolean;
}

export enum NumberFormat {
	Auto = 0,
	Hexidecimal,
	Decimal,
	Binary
}

export interface NodeSetting {
	node: string;
	expanded?: boolean;
	format?: NumberFormat;
}

export interface Section {
	name: string;
	address: number;
	size: number;
	vma?: number;
	lma?: number;
	fileOffset?: number;
	align?: number;
	flags?: string[];
}
