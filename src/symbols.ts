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
    address: number;
    length: number;
    name: string;
    section: string;
    type: SymbolType;
    scope: SymbolScope;
    file: string | null;
    instructions: DisassemblyInstruction[] | null;
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