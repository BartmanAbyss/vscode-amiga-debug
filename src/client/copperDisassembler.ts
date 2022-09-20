//import { StringUtils } from "./stringUtils";
import { Custom } from "./custom";

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
		return `$${this.format(this.first)},$${this.format(this.second)}`;
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
		this.label = Custom.ByOffs(this.DA).name;
	}
	public toString(): string {
		let l: string;
		if (this.label) {
			l = this.label;
		} else {
			l = `$${this.format(this.DA)}`;
		}
		const inst = this.getAsmInstruction();
		const value = `$${this.format(this.RD)}`;
		return `${inst}; ${l} = ${value}`;
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
		const inst = this.getAsmInstruction();
		if (this.isEnd()) {
			return `${inst}; End of CopperList`;
		} else {
			const str = `${inst}; Wait for `;
			const wait = [];
			if(this.vertical)
				wait.push(`vpos >= ${this.vertical.toString()}`);
			if(this.horizontal)
			 	wait.push(`hpos >= ${this.horizontal.toString()}`);
			if(this.BFD === 0)
				wait.push(`blitter finished`);
			return str + wait.join(' and ');
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
		const inst = this.getAsmInstruction();
		return `${inst}; Skip if vpos >= $${this.vertical.toString(16)} and hpos >= $${this.horizontal.toString(16)}`;
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
