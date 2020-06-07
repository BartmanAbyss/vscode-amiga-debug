//import { StringUtils } from "./stringUtils";
import { CustomRegisters } from "../customRegisters";

/** Type of copper instruction */
export enum CopperInstructionType {
	MOVE,
	WAIT,
	SKIP
}

/**
 * Copper instruction
 */
export class CopperInstruction {
	public instructionType: CopperInstructionType;
	public first: number;
	public second: number;
	public constructor(instructionType: CopperInstructionType, first: number, second: number) {
		this.instructionType = instructionType;
		this.first = first;
		this.second = second;
	}
	public static parse(first: number, second: number): CopperInstruction {
		if (first & 0x0001) {
			// This is a wait or skip
			if (second & 0x0001) {
				return new CopperSkip(first, second);
			} else {
				return new CopperWait(first, second);
			}
		} else {
			return new CopperMove(first, second);
		}
	}
	public getAsmInstruction(): string {
		return `dc.w \$${this.format(this.first)},\$${this.format(this.second)}`;
	}
	protected getPaddedAsmInstruction(): string {
		const inst = this.getAsmInstruction();
		const pad = " ".repeat(20 - inst.length);
		return inst + pad;
	}
	protected format(value: number): string {
		return value.toString(16).padStart(4, '0');
	}
}

export class CopperMove extends CopperInstruction {
	/*DA = destination address */
	public DA: number;
	/*  RD = RAM data to be moved to destination register */
	public RD: number;
	/** Understandable label */
	public label: string | undefined;
	constructor(first: number, second: number) {
		super(CopperInstructionType.MOVE, first, second);
		this.DA = first & 0x01fe;
		this.RD = second;
		const register = 0xdff000 + this.DA;
		this.label = CustomRegisters.getCustomName(register);
	}
	public toString(): string {
		let l: string;
		if (this.label) {
			l = this.label;
		} else {
			l = `\$${this.format(this.DA)}`;
		}
		const inst = this.getPaddedAsmInstruction();
		const value = `\$${this.format(this.RD)}`;
		return `${inst}; ${l} := ${value}`;
	}
}
export class CopperCondition extends CopperInstruction {
	/** Vertical beam position unmasked */
	public VP: number;
	/** Horizontal beam position unmasked */
	public HP: number;
	/**  blitter-finished disable */
	public BFD: number;
	/** Vertical enable comparison (mask bit) */
	public VE: number;
	/** Horizontal enable comparison (mask bit) */
	public HE: number;
	/** Vertical beam position */
	public vertical: number;
	/** Horizontal beam position */
	public horizontal: number;
	constructor(instructionType: CopperInstructionType, first: number, second: number) {
		super(instructionType, first, second);
		this.VP = (first >> 8);
		this.HP = first & 0x00fe;
		this.BFD = (second & 0x8000) >> 15;
		this.VE = (second | 0x8000) >> 8;
		this.HE = second & 0x00fe;
		this.vertical = this.VP & this.VE;
		this.horizontal = this.HP & this.HE;
	}
}
export class CopperWait extends CopperCondition {
	constructor(first: number, second: number) {
		super(CopperInstructionType.WAIT, first, second);
	}
	public toString(): string {
		const inst = this.getPaddedAsmInstruction();
		if (this.isEnd()) {
			return `${inst}; End of CopperList`;
		} else {
			return `${inst}; Wait for vpos >= 0x${this.vertical.toString(16)} and hpos >= 0x${this.horizontal.toString(16)}`;
		}
	}
	public isEnd(): boolean {
		return ((this.first === 0xffff) && (this.second === 0xfffe));
	}
}
export class CopperSkip extends CopperCondition {
	constructor(first: number, second: number) {
		super(CopperInstructionType.SKIP, first, second);
	}
	public toString(): string {
		const inst = this.getPaddedAsmInstruction();
		return `${inst}; Skip if vpos >= 0x${this.vertical.toString(16)} and hpos >= 0x${this.horizontal.toString(16)}`;
	}
}

/**
 * Copper list disassembler
 */
export class CopperDisassembler {
	public copperList = new Array<CopperInstruction>();
	constructor(memory: Uint8Array, offset: number) {
		while(offset < memory.length) {
			const first  = (memory[offset + 0] << 8) | memory[offset + 1];
			const second = (memory[offset + 2] << 8) | memory[offset + 3];
			const instruction = CopperInstruction.parse(first, second);
			this.copperList.push(instruction);
			if (instruction instanceof CopperWait && instruction.isEnd())
				break;
			offset += 4;
		}
	}
	public disassemble(): CopperInstruction[] {
		return this.copperList;
	}
	public toString(): string {
		return this.copperList.join('\n');
	}
}
