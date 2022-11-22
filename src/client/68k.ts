// https://www.nxp.com/docs/en/reference-manual/MC68000UM.pdf
// https://www.nxp.com/docs/en/reference-manual/M68000PRM.pdf

enum AddressingMode {
	DataRegisterDirect,
	AddressRegisterDirect,
	AddressRegisterIndirect,
	AddressRegisterIndirectWithPostincrement,
	AddressRegisterIndirectWithPredecrement,
	AddressRegisterIndirectWithDisplacement,
	AddressRegisterIndirectWithIndex,
	AbsoluteShort,
	AbsoluteLong,
	ProgramCounterIndirectWithDisplacement,
	ProgramCounterIndirectWithIndex,
	Immediate
}

function GetAddressingMode(insn: number, registerBit: number, modeBit: number): AddressingMode {
	switch((insn >> modeBit) & 0b111) {
	case 0b000: return AddressingMode.DataRegisterDirect;
	case 0b001: return AddressingMode.AddressRegisterDirect;
	case 0b010: return AddressingMode.AddressRegisterIndirect;
	case 0b011: return AddressingMode.AddressRegisterIndirectWithPostincrement;
	case 0b100: return AddressingMode.AddressRegisterIndirectWithPredecrement;
	case 0b101: return AddressingMode.AddressRegisterIndirectWithDisplacement;
	case 0b110: return AddressingMode.AddressRegisterIndirectWithIndex;
	case 0b111:
		switch((insn >> registerBit) & 0b111) {
			case 0b000: return AddressingMode.AbsoluteShort;
			case 0b001: return AddressingMode.AbsoluteLong;
			case 0b100: return AddressingMode.Immediate;
			case 0b010: return AddressingMode.ProgramCounterIndirectWithDisplacement;
			case 0b011: return AddressingMode.ProgramCounterIndirectWithIndex;
		}
	}
}

export enum JumpType {
	Branch,
	ConditionalBranch,
	Jsr,
	ConditionalJsr
}

export interface Jump {
	type: JumpType;
	target: number;
}

// Table 3-19
enum Conditional {
	T, // True
	F, // False
	HI, // High
	LS, // Low or Same
	CC, // HI - Carry Clear
	CS, // LO - Carry Set
	NE, // Not Equal
	EQ, // Equal
	VC, // Overflow Clear
	VS, // Overflow Set
	PL, // Plus
	MI, // Minus
	GE, // Greater or Equal
	LT, // Less Than
	GT, // Greater Than
	LE, // Less or Equal
}

// https://stackoverflow.com/a/60227348
function uncomplement(val: number, bitwidth: number) {
	const isnegative = val & (1 << (bitwidth - 1));
	const boundary = (1 << bitwidth);
	const minval = -boundary;
	const mask = boundary - 1;
	return isnegative ? minval + (val & mask) : val;
}

// returns target of jump if we can determine it statically
export function GetJump(pc: number, insn: Uint16Array) {
	if((insn[0] & 0b1111_0000_0000_0000) === 0b0110_0000_0000_0000) { // BRA,BSR,Bcc
		const cc = ((insn[0] >>> 8) & 0b1111) as Conditional;
		const type = cc === Conditional.T ? JumpType.Branch : cc === Conditional.F ? JumpType.Jsr : JumpType.ConditionalBranch;
		const displacement = (insn[0] & 0xff) ? uncomplement(insn[0] & 0xff, 8) : uncomplement(insn[1], 16);
		return { type, target: pc + 2 + displacement };
	}

	if((insn[0] & 0b1111_0000_1111_1000) === 0b0101_0000_1100_1000) // DBcc
		return { type: JumpType.ConditionalBranch, target: pc + 2 + uncomplement(insn[1], 16) };

	if((insn[0] & 0b1111_1111_1000_0000) === 0b0100_1110_1000_0000) { // JMP,JSR
		const effectiveAddress = GetAddressingMode(insn[0], 0, 3);
		const type = insn[0] & (1 << 6) ? JumpType.Branch : JumpType.Jsr;
		if(effectiveAddress === AddressingMode.AbsoluteShort)
			return { type, target: insn[1] };
		else if(effectiveAddress === AddressingMode.AbsoluteLong)
			return { type, target: (insn[1] << 16) | insn[2] };
	}
}