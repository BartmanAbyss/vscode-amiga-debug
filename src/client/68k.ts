// https://www.nxp.com/docs/en/reference-manual/MC68000UM.pdf
// https://www.nxp.com/docs/en/reference-manual/M68000PRM.pdf

export interface Cycles {
	total: number;
	read: number;
	write: number;
}

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

interface AddressCycles {
	short: Cycles;
	long: Cycles;
}

// Table 8-1
const EffectiveAddressCalculationTimes: AddressCycles[] = [
	{ short: { total:  0, read: 0, write: 0 }, long: { total:  0, read: 0, write: 0 } }, // DataRegisterDirect,
	{ short: { total:  0, read: 0, write: 0 }, long: { total:  0, read: 0, write: 0 } }, // AddressRegisterDirect,
	{ short: { total:  4, read: 1, write: 0 }, long: { total:  8, read: 2, write: 0 } }, // AddressRegisterIndirect,
	{ short: { total:  4, read: 1, write: 0 }, long: { total:  8, read: 2, write: 0 } }, // AddressRegisterIndirectWithPostincrement,
	{ short: { total:  6, read: 1, write: 0 }, long: { total: 10, read: 2, write: 0 } }, // AddressRegisterIndirectWithPredecrement,
	{ short: { total:  8, read: 2, write: 0 }, long: { total: 12, read: 3, write: 0 } }, // AddressRegisterIndirectWithDisplacement,
	{ short: { total: 10, read: 2, write: 0 }, long: { total: 14, read: 3, write: 0 } }, // AddressRegisterIndirectWithIndex,
	{ short: { total:  8, read: 2, write: 0 }, long: { total: 12, read: 3, write: 0 } }, // AbsoluteShort,
	{ short: { total: 12, read: 3, write: 0 }, long: { total: 16, read: 4, write: 0 } }, // AbsoluteLong,
	{ short: { total:  8, read: 2, write: 0 }, long: { total: 12, read: 3, write: 0 } }, // ProgramCounterIndirectWithDisplacement,
	{ short: { total: 10, read: 2, write: 0 }, long: { total: 14, read: 3, write: 0 } }, // ProgramCounterIndirectWithIndex,
	{ short: { total:  4, read: 1, write: 0 }, long: { total:  8, read: 2, write: 0 } }, // Immediate
];

// Table 8-2, 8-3
const MoveExecutionTimes: AddressCycles[][] = [
	[ // DataRegisterDirect,
		{ short: { total:  4, read: 1, write: 0 }, long: { total:  4, read: 1, write: 0 } }, // DataRegisterDirect,
		{ short: { total:  4, read: 1, write: 0 }, long: { total:  4, read: 1, write: 0 } }, // AddressRegisterDirect,
		{ short: { total:  8, read: 1, write: 1 }, long: { total: 12, read: 1, write: 2 } }, // AddressRegisterIndirect,
		{ short: { total:  8, read: 1, write: 1 }, long: { total: 12, read: 1, write: 2 } }, // AddressRegisterIndirectWithPostincrement,
		{ short: { total:  8, read: 1, write: 1 }, long: { total: 12, read: 1, write: 2 } }, // AddressRegisterIndirectWithPredecrement,
		{ short: { total: 12, read: 2, write: 1 }, long: { total: 16, read: 2, write: 2 } }, // AddressRegisterIndirectWithDisplacement,
		{ short: { total: 14, read: 2, write: 1 }, long: { total: 18, read: 2, write: 2 } }, // AddressRegisterIndirectWithIndex,
		{ short: { total: 12, read: 2, write: 1 }, long: { total: 16, read: 2, write: 2 } }, // AbsoluteShort,
		{ short: { total: 16, read: 3, write: 1 }, long: { total: 20, read: 3, write: 2 } }, // AbsoluteLong,
	],
	[ // AddressRegisterDirect - same as DataRegisterDirect
		{ short: { total:  4, read: 1, write: 0 }, long: { total:  4, read: 1, write: 0 } }, // DataRegisterDirect,
		{ short: { total:  4, read: 1, write: 0 }, long: { total:  4, read: 1, write: 0 } }, // AddressRegisterDirect,
		{ short: { total:  8, read: 1, write: 1 }, long: { total: 12, read: 1, write: 2 } }, // AddressRegisterIndirect,
		{ short: { total:  8, read: 1, write: 1 }, long: { total: 12, read: 1, write: 2 } }, // AddressRegisterIndirectWithPostincrement,
		{ short: { total:  8, read: 1, write: 1 }, long: { total: 12, read: 1, write: 2 } }, // AddressRegisterIndirectWithPredecrement,
		{ short: { total: 12, read: 2, write: 1 }, long: { total: 16, read: 2, write: 2 } }, // AddressRegisterIndirectWithDisplacement,
		{ short: { total: 14, read: 2, write: 1 }, long: { total: 18, read: 2, write: 2 } }, // AddressRegisterIndirectWithIndex,
		{ short: { total: 12, read: 2, write: 1 }, long: { total: 16, read: 2, write: 2 } }, // AbsoluteShort,
		{ short: { total: 16, read: 3, write: 1 }, long: { total: 20, read: 3, write: 2 } }, // AbsoluteLong,
	],
	[ // AddressRegisterIndirect
		{ short: { total:  8, read: 2, write: 0 }, long: { total: 12, read: 3, write: 0 } }, // DataRegisterDirect,
		{ short: { total:  8, read: 2, write: 0 }, long: { total: 12, read: 3, write: 0 } }, // AddressRegisterDirect,
		{ short: { total: 12, read: 2, write: 1 }, long: { total: 20, read: 3, write: 2 } }, // AddressRegisterIndirect,
		{ short: { total: 12, read: 2, write: 1 }, long: { total: 20, read: 3, write: 2 } }, // AddressRegisterIndirectWithPostincrement,
		{ short: { total: 12, read: 2, write: 1 }, long: { total: 20, read: 3, write: 2 } }, // AddressRegisterIndirectWithPredecrement,
		{ short: { total: 16, read: 3, write: 1 }, long: { total: 24, read: 4, write: 2 } }, // AddressRegisterIndirectWithDisplacement,
		{ short: { total: 18, read: 3, write: 1 }, long: { total: 26, read: 4, write: 2 } }, // AddressRegisterIndirectWithIndex,
		{ short: { total: 16, read: 3, write: 1 }, long: { total: 24, read: 4, write: 2 } }, // AbsoluteShort,
		{ short: { total: 20, read: 4, write: 1 }, long: { total: 28, read: 5, write: 2 } }, // AbsoluteLong,
	],
	[ // AddressRegisterIndirectWithPostincrement - same as AddressRegisterIndirect
		{ short: { total:  8, read: 2, write: 0 }, long: { total: 12, read: 3, write: 0 } }, // DataRegisterDirect,
		{ short: { total:  8, read: 2, write: 0 }, long: { total: 12, read: 3, write: 0 } }, // AddressRegisterDirect,
		{ short: { total: 12, read: 2, write: 1 }, long: { total: 20, read: 3, write: 2 } }, // AddressRegisterIndirect,
		{ short: { total: 12, read: 2, write: 1 }, long: { total: 20, read: 3, write: 2 } }, // AddressRegisterIndirectWithPostincrement,
		{ short: { total: 12, read: 2, write: 1 }, long: { total: 20, read: 3, write: 2 } }, // AddressRegisterIndirectWithPredecrement,
		{ short: { total: 16, read: 3, write: 1 }, long: { total: 24, read: 4, write: 2 } }, // AddressRegisterIndirectWithDisplacement,
		{ short: { total: 18, read: 3, write: 1 }, long: { total: 26, read: 4, write: 2 } }, // AddressRegisterIndirectWithIndex,
		{ short: { total: 16, read: 3, write: 1 }, long: { total: 24, read: 4, write: 2 } }, // AbsoluteShort,
		{ short: { total: 20, read: 4, write: 1 }, long: { total: 28, read: 5, write: 2 } }, // AbsoluteLong,
	],
	[ // AddressRegisterIndirectWithPredecrement
		{ short: { total: 10, read: 2, write: 0 }, long: { total: 14, read: 3, write: 0 } }, // DataRegisterDirect,
		{ short: { total: 10, read: 2, write: 0 }, long: { total: 14, read: 3, write: 0 } }, // AddressRegisterDirect,
		{ short: { total: 14, read: 2, write: 1 }, long: { total: 22, read: 3, write: 2 } }, // AddressRegisterIndirect,
		{ short: { total: 14, read: 2, write: 1 }, long: { total: 22, read: 3, write: 2 } }, // AddressRegisterIndirectWithPostincrement,
		{ short: { total: 14, read: 2, write: 1 }, long: { total: 22, read: 3, write: 2 } }, // AddressRegisterIndirectWithPredecrement,
		{ short: { total: 18, read: 3, write: 1 }, long: { total: 26, read: 4, write: 2 } }, // AddressRegisterIndirectWithDisplacement,
		{ short: { total: 20, read: 3, write: 1 }, long: { total: 28, read: 4, write: 2 } }, // AddressRegisterIndirectWithIndex,
		{ short: { total: 18, read: 3, write: 1 }, long: { total: 26, read: 4, write: 2 } }, // AbsoluteShort,
		{ short: { total: 22, read: 4, write: 1 }, long: { total: 30, read: 5, write: 2 } }, // AbsoluteLong,
	],
	[ // AddressRegisterIndirectWithDisplacement
		{ short: { total: 12, read: 3, write: 0 }, long: { total: 16, read: 4, write: 0 } }, // DataRegisterDirect,
		{ short: { total: 12, read: 3, write: 0 }, long: { total: 16, read: 4, write: 0 } }, // AddressRegisterDirect,
		{ short: { total: 16, read: 3, write: 1 }, long: { total: 24, read: 4, write: 2 } }, // AddressRegisterIndirect,
		{ short: { total: 16, read: 3, write: 1 }, long: { total: 24, read: 4, write: 2 } }, // AddressRegisterIndirectWithPostincrement,
		{ short: { total: 16, read: 3, write: 1 }, long: { total: 24, read: 4, write: 2 } }, // AddressRegisterIndirectWithPredecrement,
		{ short: { total: 20, read: 4, write: 1 }, long: { total: 28, read: 5, write: 2 } }, // AddressRegisterIndirectWithDisplacement,
		{ short: { total: 22, read: 4, write: 1 }, long: { total: 30, read: 5, write: 2 } }, // AddressRegisterIndirectWithIndex,
		{ short: { total: 20, read: 4, write: 1 }, long: { total: 28, read: 5, write: 2 } }, // AbsoluteShort,
		{ short: { total: 24, read: 5, write: 1 }, long: { total: 32, read: 6, write: 2 } }, // AbsoluteLong,
	],
	[ // AddressRegisterIndirectWithIndex
		{ short: { total: 14, read: 3, write: 0 }, long: { total: 18, read: 4, write: 0 } }, // DataRegisterDirect,
		{ short: { total: 14, read: 3, write: 0 }, long: { total: 18, read: 4, write: 0 } }, // AddressRegisterDirect,
		{ short: { total: 18, read: 3, write: 1 }, long: { total: 26, read: 4, write: 2 } }, // AddressRegisterIndirect,
		{ short: { total: 18, read: 3, write: 1 }, long: { total: 26, read: 4, write: 2 } }, // AddressRegisterIndirectWithPostincrement,
		{ short: { total: 18, read: 3, write: 1 }, long: { total: 26, read: 4, write: 2 } }, // AddressRegisterIndirectWithPredecrement,
		{ short: { total: 22, read: 4, write: 1 }, long: { total: 30, read: 5, write: 2 } }, // AddressRegisterIndirectWithDisplacement,
		{ short: { total: 24, read: 4, write: 1 }, long: { total: 32, read: 5, write: 2 } }, // AddressRegisterIndirectWithIndex,
		{ short: { total: 22, read: 4, write: 1 }, long: { total: 30, read: 5, write: 2 } }, // AbsoluteShort,
		{ short: { total: 26, read: 5, write: 1 }, long: { total: 34, read: 6, write: 2 } }, // AbsoluteLong,
	],
	[ // AbsoluteShort
		{ short: { total: 12, read: 3, write: 0 }, long: { total: 16, read: 4, write: 0 } }, // DataRegisterDirect,
		{ short: { total: 12, read: 3, write: 0 }, long: { total: 16, read: 4, write: 0 } }, // AddressRegisterDirect,
		{ short: { total: 16, read: 3, write: 1 }, long: { total: 24, read: 4, write: 2 } }, // AddressRegisterIndirect,
		{ short: { total: 16, read: 3, write: 1 }, long: { total: 24, read: 4, write: 2 } }, // AddressRegisterIndirectWithPostincrement,
		{ short: { total: 16, read: 3, write: 1 }, long: { total: 24, read: 4, write: 2 } }, // AddressRegisterIndirectWithPredecrement,
		{ short: { total: 20, read: 4, write: 1 }, long: { total: 28, read: 5, write: 2 } }, // AddressRegisterIndirectWithDisplacement,
		{ short: { total: 22, read: 4, write: 1 }, long: { total: 30, read: 5, write: 2 } }, // AddressRegisterIndirectWithIndex,
		{ short: { total: 20, read: 4, write: 1 }, long: { total: 28, read: 5, write: 2 } }, // AbsoluteShort,
		{ short: { total: 24, read: 5, write: 1 }, long: { total: 32, read: 6, write: 2 } }, // AbsoluteLong,
	],
	[ // AbsoluteLong
		{ short: { total: 16, read: 4, write: 0 }, long: { total: 20, read: 5, write: 0 } }, // DataRegisterDirect,
		{ short: { total: 16, read: 4, write: 0 }, long: { total: 20, read: 5, write: 0 } }, // AddressRegisterDirect,
		{ short: { total: 20, read: 4, write: 1 }, long: { total: 28, read: 5, write: 2 } }, // AddressRegisterIndirect,
		{ short: { total: 20, read: 4, write: 1 }, long: { total: 28, read: 5, write: 2 } }, // AddressRegisterIndirectWithPostincrement,
		{ short: { total: 20, read: 4, write: 1 }, long: { total: 28, read: 5, write: 2 } }, // AddressRegisterIndirectWithPredecrement,
		{ short: { total: 24, read: 5, write: 1 }, long: { total: 32, read: 6, write: 2 } }, // AddressRegisterIndirectWithDisplacement,
		{ short: { total: 26, read: 5, write: 1 }, long: { total: 34, read: 6, write: 2 } }, // AddressRegisterIndirectWithIndex,
		{ short: { total: 24, read: 5, write: 1 }, long: { total: 32, read: 6, write: 2 } }, // AbsoluteShort,
		{ short: { total: 28, read: 6, write: 1 }, long: { total: 36, read: 7, write: 2 } }, // AbsoluteLong,
	],
	[ // ProgramCounterIndirectWithDisplacement - same as AddressRegisterIndirectWithDisplacement
		{ short: { total: 12, read: 3, write: 0 }, long: { total: 16, read: 4, write: 0 } }, // DataRegisterDirect,
		{ short: { total: 12, read: 3, write: 0 }, long: { total: 16, read: 4, write: 0 } }, // AddressRegisterDirect,
		{ short: { total: 16, read: 3, write: 1 }, long: { total: 24, read: 4, write: 2 } }, // AddressRegisterIndirect,
		{ short: { total: 16, read: 3, write: 1 }, long: { total: 24, read: 4, write: 2 } }, // AddressRegisterIndirectWithPostincrement,
		{ short: { total: 16, read: 3, write: 1 }, long: { total: 24, read: 4, write: 2 } }, // AddressRegisterIndirectWithPredecrement,
		{ short: { total: 20, read: 4, write: 1 }, long: { total: 28, read: 5, write: 2 } }, // AddressRegisterIndirectWithDisplacement,
		{ short: { total: 22, read: 4, write: 1 }, long: { total: 30, read: 5, write: 2 } }, // AddressRegisterIndirectWithIndex,
		{ short: { total: 20, read: 4, write: 1 }, long: { total: 28, read: 5, write: 2 } }, // AbsoluteShort,
		{ short: { total: 24, read: 5, write: 1 }, long: { total: 32, read: 6, write: 2 } }, // AbsoluteLong,
	],
	[ // ProgramCounterIndirectWithIndex - same as AddressRegisterIndirectWithIndex
		{ short: { total: 14, read: 3, write: 0 }, long: { total: 18, read: 4, write: 0 } }, // DataRegisterDirect,
		{ short: { total: 14, read: 3, write: 0 }, long: { total: 18, read: 4, write: 0 } }, // AddressRegisterDirect,
		{ short: { total: 18, read: 3, write: 1 }, long: { total: 26, read: 4, write: 2 } }, // AddressRegisterIndirect,
		{ short: { total: 18, read: 3, write: 1 }, long: { total: 26, read: 4, write: 2 } }, // AddressRegisterIndirectWithPostincrement,
		{ short: { total: 18, read: 3, write: 1 }, long: { total: 26, read: 4, write: 2 } }, // AddressRegisterIndirectWithPredecrement,
		{ short: { total: 22, read: 4, write: 1 }, long: { total: 30, read: 5, write: 2 } }, // AddressRegisterIndirectWithDisplacement,
		{ short: { total: 24, read: 4, write: 1 }, long: { total: 32, read: 5, write: 2 } }, // AddressRegisterIndirectWithIndex,
		{ short: { total: 22, read: 4, write: 1 }, long: { total: 30, read: 5, write: 2 } }, // AbsoluteShort,
		{ short: { total: 26, read: 5, write: 1 }, long: { total: 34, read: 6, write: 2 } }, // AbsoluteLong,
	],
	[ // Immediate - same as AddressRegisterIndirect
		{ short: { total:  8, read: 2, write: 0 }, long: { total: 12, read: 3, write: 0 } }, // DataRegisterDirect,
		{ short: { total:  8, read: 2, write: 0 }, long: { total: 12, read: 3, write: 0 } }, // AddressRegisterDirect,
		{ short: { total: 12, read: 2, write: 1 }, long: { total: 20, read: 3, write: 2 } }, // AddressRegisterIndirect,
		{ short: { total: 12, read: 2, write: 1 }, long: { total: 20, read: 3, write: 2 } }, // AddressRegisterIndirectWithPostincrement,
		{ short: { total: 12, read: 2, write: 1 }, long: { total: 20, read: 3, write: 2 } }, // AddressRegisterIndirectWithPredecrement,
		{ short: { total: 16, read: 3, write: 1 }, long: { total: 24, read: 4, write: 2 } }, // AddressRegisterIndirectWithDisplacement,
		{ short: { total: 18, read: 3, write: 1 }, long: { total: 26, read: 4, write: 2 } }, // AddressRegisterIndirectWithIndex,
		{ short: { total: 16, read: 3, write: 1 }, long: { total: 24, read: 4, write: 2 } }, // AbsoluteShort,
		{ short: { total: 20, read: 4, write: 1 }, long: { total: 28, read: 5, write: 2 } }, // AbsoluteLong,
	],
];

enum Size {
	Byte,
	Word,
	Long
}

// bits are always the lowest bit
function GetSize(insn: number, bit: number): Size {
	switch((insn >> bit) & 0b11) {
	case 0b01: return Size.Byte;
	case 0b11: return Size.Word;
	case 0b10: return Size.Long;
	}
}

function GetSize2(insn: number, bit: number): Size {
	switch((insn >> bit) & 0b11) {
	case 0b00: return Size.Byte;
	case 0b01: return Size.Word;
	case 0b10: return Size.Long;
	}
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

function AddCycles(ea: Cycles, cy: Cycles): Cycles {
	return {
		total: ea.total + cy.total,
		read: ea.read + cy.read,
		write: ea.write + cy.write
	};
}

function GetCyclesStandard(insn: Uint16Array): Cycles[] {
	enum Opxxx {
		DestinationAddressRegister,
		DestinationDataRegister,
		DestinationEffectiveAddress,
	}
	interface Opmode {
		opmode: Opxxx;
		size: Size;
	}
	function GetOpmode(insn: number, bit: number): Opmode {
		switch((insn >> bit) & 0b111) {
		case 0b000: return { opmode: Opxxx.DestinationDataRegister, size: Size.Byte };
		case 0b001: return { opmode: Opxxx.DestinationDataRegister, size: Size.Word };
		case 0b010: return { opmode: Opxxx.DestinationDataRegister, size: Size.Long };
		case 0b100: return { opmode: Opxxx.DestinationEffectiveAddress, size: Size.Byte };
		case 0b101: return { opmode: Opxxx.DestinationEffectiveAddress, size: Size.Word };
		case 0b110: return { opmode: Opxxx.DestinationEffectiveAddress, size: Size.Long };
		case 0b011: return { opmode: Opxxx.DestinationAddressRegister, size: Size.Word };
		case 0b111: return { opmode: Opxxx.DestinationAddressRegister, size: Size.Long };
		}
	}
	const opmode = GetOpmode(insn[0], 6);
	const effectiveAddress = GetAddressingMode(insn[0], 0, 3);
	const op = ((insn[0] >> 12) & 0b1111);
	const ea  = opmode.size !== Size.Long ? EffectiveAddressCalculationTimes[effectiveAddress].short : EffectiveAddressCalculationTimes[effectiveAddress].long;
	if(op === 0b1011) { // CMP/EOR
		if(opmode.opmode === Opxxx.DestinationEffectiveAddress) { // EOR
			if(effectiveAddress === AddressingMode.DataRegisterDirect)
				return [ opmode.size !== Size.Long ? { total: 8, read: 2, write: 0 } : { total: 12, read: 2, write: 0 } ];
			const cy = opmode.size === Size.Byte ? { total: 12, read: 2, write: 1 } : opmode.size === Size.Word ? { total: 16, read: 2, write: 2 } : { total: 24, read: 2, write: 4 };
			return [ AddCycles(ea, cy) ];
		} else if(opmode.opmode === Opxxx.DestinationDataRegister) { // CMP
			const cy = opmode.size !== Size.Long ? { total: 8, read: 2, write: 0 } : { total: 10, read: 2, write: 0 };
			return [ AddCycles(ea, cy) ];
		} else if(opmode.opmode === Opxxx.DestinationAddressRegister) { // CMPA
			const cy = { total: 10, read: 2, write: 0 };
			return [ AddCycles(ea, cy) ];
		}
	} else {
		if(opmode.opmode === Opxxx.DestinationDataRegister || opmode.opmode === Opxxx.DestinationAddressRegister) {
			const exs = opmode.size !== Size.Long && opmode.opmode === Opxxx.DestinationAddressRegister ? 4 : 0; // extra for short
			const exl = opmode.size === Size.Long && (effectiveAddress === AddressingMode.AddressRegisterDirect || effectiveAddress === AddressingMode.Immediate) ? 2 : 0; // extra for long
			const cy  = opmode.size !== Size.Long ? { total: 4 + exs, read: 1, write: 0 } : { total: 6 + exl, read: 1, write: 0 };
			return [ AddCycles(ea, cy) ];
		} else {
			// all opcodes
			const cy = opmode.size !== Size.Long ? { total: 8, read: 1, write: 1 } : { total: 12, read: 1, write: 2 };
			return [ AddCycles(ea, cy) ];
		}
	}
}

function GetCyclesImmediate(insn: Uint16Array): Cycles[] {
	const size = GetSize(insn[0], 6);
	const effectiveAddress = GetAddressingMode(insn[0], 0, 3);
	const op = ((insn[0] >> 8) & 0b1111);
	if(effectiveAddress === AddressingMode.DataRegisterDirect) {
		const extra = (op === 0b0010 || op === 0b1100) ? 2 : 0; // ANDI, CMPI are 2 cycles faster for LONG
		return [ size !== Size.Long ? { total: 8, read: 2, write: 0 } : { total: 16 - extra, read: 3, write: 0 } ];
	} else {
		const ea = size !== Size.Long ? EffectiveAddressCalculationTimes[effectiveAddress].short : EffectiveAddressCalculationTimes[effectiveAddress].long;
		const cy = size !== Size.Long ? { total: 12, read: 2, write: 1 } : { total: 20, read: 3, write: 2 };
		return [ AddCycles(ea, cy) ];
	}
}

function GetCyclesAddqSubq(insn: Uint16Array): Cycles[] {
	const size = GetSize(insn[0], 6);
	const effectiveAddress = GetAddressingMode(insn[0], 0, 3);
	if(effectiveAddress === AddressingMode.DataRegisterDirect || effectiveAddress === AddressingMode.AddressRegisterDirect) {
		return [ size !== Size.Long ? { total: 4, read: 1, write: 0 } : { total: 8, read: 1, write: 0 } ];
	} else {
		const ea = size !== Size.Long ? EffectiveAddressCalculationTimes[effectiveAddress].short : EffectiveAddressCalculationTimes[effectiveAddress].long;
		const cy = size !== Size.Long ? { total: 8, read: 1, write: 1 } : { total: 12, read: 1, write: 2 };
		return [ AddCycles(ea, cy) ];
	}
}

function GetCyclesMove(insn: Uint16Array): Cycles[] {
	const size = GetSize(insn[0], 12);
	const destination = GetAddressingMode(insn[0], 9, 6);
	const source = GetAddressingMode(insn[0], 0, 3);
	if(size !== undefined && destination !== undefined && source !== undefined) {
		return [ size !== Size.Long ? MoveExecutionTimes[source][destination].short : MoveExecutionTimes[source][destination].long ];
	}
}

function GetCyclesAddxSubx(insn: Uint16Array): Cycles[] {
	const size = GetSize2(insn[0], 6);
	if(insn[0] & (1 <<3)) // Memory to memory
		return [ size !== Size.Long ? { total: 18, read: 3, write: 1 } : { total: 30, read: 5, write: 2 } ];
	else // Data register to data register
		return [ size !== Size.Long ? {  total: 4, read: 1, write: 0 } : { total: 8, read: 1, write: 0} ];
}

function GetCyclesMovem(insn: Uint16Array): Cycles[] {
	const size = (insn[0] & (1 << 6)) ? Size.Long : Size.Word;
	const effectiveAddress = GetAddressingMode(insn[0], 0, 3);
	const n = (() => {
		let count = 0;
		for(let i = 0; i < 16; i++)
			if(insn[1] & (1 << i))
				count++;
		return count;
	})();
	if(insn[0] & (1 << 10)) {
		// Memory to register
		switch(effectiveAddress) {
		case AddressingMode.AddressRegisterIndirect:
		case AddressingMode.AddressRegisterIndirectWithPostincrement:
			return [ size === Size.Word ? { total: 12 + 4 * n, read: 3 + n, write: 0 } : { total: 12 + 8 * n, read: 3 + 2 * n, write: 0 } ];
		case AddressingMode.AddressRegisterIndirectWithDisplacement:
		case AddressingMode.AbsoluteShort:
		case AddressingMode.ProgramCounterIndirectWithDisplacement:
			return [ size === Size.Word ? { total: 16 + 4 * n, read: 4 + n, write: 0 } : { total: 16 + 8 * n, read: 4 + 2 * n, write: 0 } ];
		case AddressingMode.AddressRegisterIndirectWithIndex:
		case AddressingMode.ProgramCounterIndirectWithIndex:
			return [ size === Size.Word ? { total: 18 + 4 * n, read: 4 + n, write: 0 } : { total: 18 + 8 * n, read: 4 + 2 * n, write: 0 } ];
		case AddressingMode.AbsoluteLong:
			return [ size === Size.Word ? { total: 20 + 4 * n, read: 5 + n, write: 0 } : { total: 20 + 8 * n, read: 5 + 2 * n, write: 0 } ];
		}
	} else {
		// Register to memory
		switch(effectiveAddress) {
		case AddressingMode.AddressRegisterIndirect:
		case AddressingMode.AddressRegisterIndirectWithPredecrement:
			return [ size === Size.Word ? { total: 8 + 4 * n, read: 2, write: n } : { total: 8 + 8 * n, read: 2, write: 2 * n } ];
		case AddressingMode.AddressRegisterIndirectWithDisplacement:
		case AddressingMode.AbsoluteShort:
			return [ size === Size.Word ? { total: 12 + 4 * n, read: 3, write: n } : { total: 12 + 8 * n, read: 3, write: 2 * n } ];
		case AddressingMode.AddressRegisterIndirectWithIndex:
			return [ size === Size.Word ? { total: 14 + 4 * n, read: 3, write: n } : { total: 14 + 8 * n, read: 3, write: 2 * n } ];
		case AddressingMode.AbsoluteLong:
			return [ size === Size.Word ? { total: 16 + 4 * n, read: 4, write: n } : { total: 16 + 8 * n, read: 4, write: 2 * n } ];
		}
	}
}

function GetCyclesDiv(insn: Uint16Array): Cycles[] {
	const signed = ((insn[0] >> 8) & 1) ? true : false;
	const effectiveAddress = GetAddressingMode(insn[0], 0, 3);
	const ea = EffectiveAddressCalculationTimes[effectiveAddress].long;
	const cy = { total: signed ? 158 : 140, read: 2, write: 0 };
	return [ AddCycles(ea, cy) ];
}

function GetCyclesMul(insn: Uint16Array): Cycles[] {
	const effectiveAddress = GetAddressingMode(insn[0], 0, 3);
	const ea = EffectiveAddressCalculationTimes[effectiveAddress].long;
	const cy = [ { total: 42, read: 2, write: 0 }, { total: 74, read: 2, write: 0 } ];
	return cy.map((c) => AddCycles(ea, c));
}

function GetCyclesSingleOperand(insn: Uint16Array): Cycles[] {
	const effectiveAddress = GetAddressingMode(insn[0], 0, 3);
	const isTST  = ((insn[0] >> 8) & 0b1111) === 0b1010;
	const isTAS  = ((insn[0] >> 6) & 0b111111) === 0b101111;
	const isNBCD = ((insn[0] >> 6) & 0b111111) === 0b100000;
	const size = (isTAS || isNBCD) ? Size.Byte : GetSize2(insn[0], 6); // NBCD, TAS = byte only
	if(effectiveAddress === AddressingMode.DataRegisterDirect || effectiveAddress === AddressingMode.AddressRegisterDirect) {
		if(isNBCD)
			return [ { total: 6, read: 1, write: 0 } ];
		if(isTST)
			return [ { total: 4, read: 1, write: 0 } ];
		return [ size !== Size.Long ? { total: 4, read: 1, write: 0 } : { total: 6, read: 1, write: 0 } ];
	}
	const ea = size !== Size.Long ? EffectiveAddressCalculationTimes[effectiveAddress].short : EffectiveAddressCalculationTimes[effectiveAddress].long;
	const cy = (() => {
		if(isTST)
			return { total: 4, read: 1, write: 0 };
		if(isTAS)
			return { total: 14, read: 2, write: 1 };
		return size !== Size.Long ? { total: 8, read: 1, write: 1 } : { total: 12, read: 1, write: 2 };
	})();
	return [ AddCycles(ea, cy) ];
}

function GetCyclesShiftRotate(insn: Uint16Array): Cycles[] {
	const isMemory = (((insn[0] >> 6) & 0b11) === 0b11) ? true : false;
	if(isMemory) {
		const effectiveAddress = GetAddressingMode(insn[0], 0, 3);
		const ea = EffectiveAddressCalculationTimes[effectiveAddress].short; // memory always short
		const cy = { total: 8, read: 1, write: 1 };
		return [ AddCycles(ea, cy) ];
	}
	const size = GetSize2(insn[0], 6);
	const counts = (() => {
		if((insn[0] & (1 << 5)) === 0) { // immediate rotate count
			let n = (insn[0] >>> 9) & 0b111;
			if(n === 0)
				n = 8;
			return [ n ];
		} else {
			return [ 1, 8 ];
		}
	})();
	return counts.map((n) => size !== Size.Long ? { total: 6 + 2 * n, read: 1, write: 0 } : { total: 8 + 2 * n, read: 1, write: 0 });
}

function GetCyclesJmp(insn: Uint16Array): Cycles[] {
	const effectiveAddress = GetAddressingMode(insn[0], 0, 3);
	switch(effectiveAddress) {
	case AddressingMode.AddressRegisterIndirect:
	case AddressingMode.AbsoluteShort: 
		return [ { total: 8, read: 2, write: 0 } ];
	case AddressingMode.AddressRegisterIndirectWithDisplacement:
	case AddressingMode.ProgramCounterIndirectWithIndex: 
		return [ { total: 10, read: 2, write: 0 } ];
	case AddressingMode.AddressRegisterIndirectWithIndex:
	case AddressingMode.ProgramCounterIndirectWithIndex:
		return [ { total: 14, read: 3, write: 0 } ];
	case AddressingMode.AbsoluteLong: 
		return [ { total: 12, read: 3, write: 0 } ];
	}
}

function GetCyclesJsr(insn: Uint16Array): Cycles[] {
	const effectiveAddress = GetAddressingMode(insn[0], 0, 3);
	switch(effectiveAddress) {
	case AddressingMode.AddressRegisterIndirect: 
		return [ { total: 16, read: 2, write: 2 } ];
	case AddressingMode.AddressRegisterIndirectWithDisplacement:
	case AddressingMode.ProgramCounterIndirectWithIndex:
	case AddressingMode.AbsoluteShort: 
		return [ { total: 18, read: 2, write: 2 } ];
	case AddressingMode.AddressRegisterIndirectWithIndex:
	case AddressingMode.ProgramCounterIndirectWithIndex: 
		return [ { total: 22, read: 2, write: 2 } ];
	case AddressingMode.AbsoluteLong: 
		return [ { total: 20, read: 3, write: 2 } ];
	}
}

function GetCyclesLea(insn: Uint16Array): Cycles[] {
	const effectiveAddress = GetAddressingMode(insn[0], 0, 3);
	switch(effectiveAddress) {
	case AddressingMode.AddressRegisterIndirect: 
		return [ { total: 4, read: 1, write: 0 } ];
	case AddressingMode.AddressRegisterIndirectWithDisplacement:
	case AddressingMode.ProgramCounterIndirectWithIndex: 
	case AddressingMode.AbsoluteShort:	
		return [ { total: 8, read: 2, write: 0 } ];
	case AddressingMode.AddressRegisterIndirectWithIndex:
	case AddressingMode.ProgramCounterIndirectWithIndex: 
		return [ { total: 12, read: 2, write: 0 } ];
	case AddressingMode.AbsoluteLong: 
		return [ { total: 12, read: 3, write: 0 } ];
	}
}

function GetCyclesPea(insn: Uint16Array): Cycles[] {
	const effectiveAddress = GetAddressingMode(insn[0], 0, 3);
	switch(effectiveAddress) {
	case AddressingMode.AddressRegisterIndirect: 
		return [ { total: 12, read: 1, write: 2 } ];
	case AddressingMode.AddressRegisterIndirectWithDisplacement:
	case AddressingMode.ProgramCounterIndirectWithIndex: 
	case AddressingMode.AbsoluteShort: 
		return [ { total: 16, read: 2, write: 2 } ];
	case AddressingMode.AddressRegisterIndirectWithIndex:
	case AddressingMode.ProgramCounterIndirectWithIndex: 
		return [ { total: 20, read: 2, write: 2 } ];
	case AddressingMode.AbsoluteLong: 
		return [ { total: 20, read: 3, write: 2 } ];
	}
}

function GetCyclesScc(insn: Uint16Array): Cycles[] {
	const effectiveAddress = GetAddressingMode(insn[0], 0, 3);
	if(effectiveAddress === AddressingMode.DataRegisterDirect)
		return [ { total: 8, read: 2, write: 0 }, { total: 10, read: 2, write: 0 } ];
	const cy = { total: 12, read: 2, write: 1 };
	return [ AddCycles(EffectiveAddressCalculationTimes[effectiveAddress].short, cy) ];
}

function GetCyclesBitManipulation(insn: Uint16Array): Cycles[] {
	const isBTST = ((insn[0] >>> 6) & 0b11) === 0b00 ? true : false;
	const isBCLR = ((insn[0] >>> 6) & 0b11) === 0b10 ? true : false;
	const isDynamic = (insn[0] & (1 << 8)) ? true : false;
	const effectiveAddress = GetAddressingMode(insn[0], 0, 3);
	if(effectiveAddress === AddressingMode.DataRegisterDirect) {
		if(isBCLR)
			return [ isDynamic ? { total: 10, read: 1, write: 0 } : { total: 14, read: 2, write: 0 } ];
		if(isBTST)
			return [ isDynamic ? { total: 6, read: 1, write: 0 } : { total: 10, read: 2, write: 0 } ];
		return [ isDynamic ? { total: 8, read: 1, write: 0 } : { total: 12, read: 2, write: 0 } ];
	} else {
		const cy = (() => {
			if(isBCLR)
				return isDynamic ? { total: 8, read: 1, write: 1 } : { total: 14, read: 2, write: 0 };
			if(isBTST)
				return isDynamic ? { total: 4, read: 1, write: 0 } : { total: 8, read: 2, write: 0 };
			return isDynamic ? { total: 8, read: 1, write: 1 } : { total: 12, read: 2, write: 1 };
		})();
		const ea = EffectiveAddressCalculationTimes[effectiveAddress].short;
		return [ AddCycles(ea, cy) ];
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

// get min/max cycles of instruction for MC68000
export function GetCycles(insn: Uint16Array): Cycles[] {
	try {
		// Immediate (Table 8-5)
		if((insn[0] & 0b1111_1111_0000_0000) === 0b0000_0110_0000_0000 // ADDI
		|| (insn[0] & 0b1111_1111_0000_0000) === 0b0000_0010_0000_0000 // ANDI
		|| (insn[0] & 0b1111_1111_0000_0000) === 0b0000_1100_0000_0000 // CMPI
		|| (insn[0] & 0b1111_1111_0000_0000) === 0b0000_1010_0000_0000 // EORI
		|| (insn[0] & 0b1111_1111_0000_0000) === 0b0000_0000_0000_0000 // ORI
		|| (insn[0] & 0b1111_1111_0000_0000) === 0b0000_0100_0000_0000) // SUBI
			return GetCyclesImmediate(insn);
		if((insn[0] & 0b1111_0000_0000_0000) === 0b0101_0000_0000_0000 && ((insn[0] >>> 6) & 0b11) !== 0b11) // ADDQ/SUBQ
			return GetCyclesAddqSubq(insn);
		if((insn[0] & 0b1111_0001_0000_0000) === 0b0111_0000_0000_0000) // MOVEQ
			return [ { total: 4, read: 1, write: 0 } ];

		// Multiprecision (Table 8-11)
		if((insn[0] & 0b1111_0001_1111_0000) === 0b1100_0001_0000_0000 // ABCD
		|| (insn[0] & 0b1111_0001_1111_0000) === 0b1000_0001_0000_0000) // SBCD
			return [ (insn[0] & (1 << 3)) ? { total: 18, read: 3, write: 1} : { total: 6, read: 1, write: 0 } ];
		if(((insn[0] & 0b1111_0001_0011_0000) === 0b1101_0001_0000_0000 // ADDX, needs to come before ADD
		 || (insn[0] & 0b1111_0001_0011_0000) === 0b1001_0001_0000_0000) // SUBX
		&& ((insn[0] >>> 6) & 0b11) !== 0b11)
			return GetCyclesAddxSubx(insn);
		if((insn[0] & 0b1111_0001_0011_1000) === 0b1011_0001_0000_1000) // CMPM
			return [ GetSize2(insn[0], 6) !== Size.Long ? { total: 12, read: 3, write: 0 } : { total: 20, read: 5, write: 0 } ];

		// Miscellaneous (Table 8-12)
		if(((insn[0] & 0b1111_0001_0011_0000) === 0b1100_0001_0000_0000) && ((insn[0] >>> 6) & 0b11) !== 0b11) // EXG, needs to come before AND
			return [ { total: 6, read: 1, write: 0 } ];
		if((insn[0] & 0b1111_1111_1111_1000) === 0b0100_1110_0101_0000 // LINK.w
		|| (insn[0] & 0b1111_1111_1111_1000) === 0b0100_1000_0000_1000) // LINK.l
			return [ { total: 32, read: 4, write: 4 } ];
		//else if((insn[0] & 0b1111_1111_1100_0000) === 0b0100_0100_1100_0000) // MOVE to CCR
			// TODO
		// TODO: MOVE to SR
		//else if((insn[0] & 0b1111_1111_1100_0000) === 0b0100_0000_1100_0000) // MOVE from SR
			// TODO
		// TODO: MOVE to USP
		// TODO: MOVE from USP
		if(insn[0] === 0b0100_1110_0111_0001) // NOP
			return [ { total: 8, read: 2, write: 0 } ];
		// TODO: ORI to CCR
		// TODO: ORI to SR
		if(insn[0] === 0b0100_1110_0111_0000) // RESET
			return [ { total: 136, read: 2, write: 0 } ];
		if(insn[0] === 0x4e73 // RTE
		|| insn[0] === 0b0100_1110_0111_0111) // RTR
			return [ { total: 40, read: 10, write: 0 } ];
		if(insn[0] === 0x4e75) // RTS
			return [ { total: 16, read: 4, write: 0 } ];
		if(insn[0] === 0b0100_1110_0111_0010) // STOP
			return [ { total: 4, read: 0, write: 0 } ];
		if((insn[0] & 0b1111_1111_1111_1000) === 0b0100_1000_0100_0000) // SWAP
			return [ { total: 8, read: 2, write: 0 } ];
		if((insn[0] & 0b1111_1111_1111_1000) === 0b0100_1110_0101_1000) // UNLK
			return [ { total: 24, read: 6, write: 0 } ];
			
		// Standard (Table 8-4)
		if((insn[0] & 0b1111_0000_1100_0000) === 0b1000_0000_1100_0000) // DIVS/DIVU, before OR
			return GetCyclesDiv(insn);
		if((insn[0] & 0b1111_0000_1100_0000) === 0b1100_0000_1100_0000) // MULS/MULU, before AND
			return GetCyclesMul(insn);
		if((insn[0] & 0b1111_0000_0000_0000) === 0b1101_0000_0000_0000 // ADD
		|| (insn[0] & 0b1111_0000_0000_0000) === 0b1100_0000_0000_0000 // AND
		|| (insn[0] & 0b1111_0000_0000_0000) === 0b1011_0000_0000_0000 // CMP/EOR
		|| (insn[0] & 0b1111_0000_0000_0000) === 0b1000_0000_0000_0000 // OR
		|| (insn[0] & 0b1111_0000_0000_0000) === 0b1001_0000_0000_0000) // SUB
			return GetCyclesStandard(insn);

		// Single Operand (Table 8-6)
		if((insn[0] & 0b1111_1111_0000_0000) === 0b0100_0010_0000_0000 // CLR
		|| (insn[0] & 0b1111_1111_1100_0000) === 0b0100_1000_0000_0000 // NBCD
		|| (insn[0] & 0b1111_1111_0000_0000) === 0b0100_0100_0000_0000 // NEG
		|| (insn[0] & 0b1111_1111_0000_0000) === 0b0100_0000_0000_0000 // NEGX
		|| (insn[0] & 0b1111_1111_0000_0000) === 0b0100_0110_0000_0000 // NOT
		|| (insn[0] & 0b1111_1111_1100_0000) === 0b0100_1011_1100_0000 // TAS
		|| (insn[0] & 0b1111_1111_0000_0000) === 0b0100_1010_0000_0000) // TST
			return GetCyclesSingleOperand(insn);
		if((insn[0] & 0b1111_0000_1100_0000) === 0b0101_0000_1100_0000 && ((insn[0] >>> 3) & 0b111) !== 0b001) // Scc
			return GetCyclesScc(insn);

		// Shift/Rotate (Table 8-7)
		if((insn[0] & 0b1111_0000_0000_0000) === 0b1110_0000_0000_0000) // ASR,ASL,LSR,LSL,ROR,ROL,ROXR,ROXL
			return GetCyclesShiftRotate(insn);

		// Bit Manipulation (Table 8-8)
		if((insn[0] & 0b1111_0000_1100_0000) === 0b0000_0000_0100_0000 // BCHG
		|| (insn[0] & 0b1111_0000_1100_0000) === 0b0000_0000_1000_0000 // BCLR
		|| (insn[0] & 0b1111_0000_1100_0000) === 0b0000_0000_1100_0000 // BSET
		|| (insn[0] & 0b1111_0000_1100_0000) === 0b0000_0000_0000_0000) // BTST
			return GetCyclesBitManipulation(insn);

		// Conditional (Table 8-9); Conditional Codes (Table 3-19)
		if((insn[0] & 0b1111_1111_0000_0000) === 0b0110_0000_0000_0000) // BRA (encoding BT)
			return [ { total: 10, read: 2, write: 0 } ];
		if((insn[0] & 0b1111_1111_0000_0000) === 0b0110_0001_0000_0000) // BSR (encoding BF)
			return [ { total: 18, read: 2, write: 2 } ];
		if((insn[0] & 0b1111_0000_0000_0000) === 0b0110_0000_0000_0000) // Bcc, after BRA/BSR
			return (insn[0] & 0xff) !== 0 
			? [ { total: 12, read: 2, write: 0 }, { total: 18, read: 4, write: 0 } ] // .b
			: [ { total: 18, read: 4, write: 0 }, { total: 20, read: 4, write: 0 } ]; // .s
		if((insn[0] & 0b1111_0000_1111_1000) === 0b0101_0000_1100_1000) // DBcc
			return ((insn[0] >>> 8) & 0b1111) !== 0b0001 
			? [ { total: 20, read: 4, write: 0 } ] // CC True
			: [ { total: 18, read: 4, write: 0 }, { total: 26, read: 6, write: 0 } ]; // CC False
		if((insn[0] & 0b1111_1111_1111_0000) === 0b0100_1110_0100_0000) // TRAP
			return [ { total: 62, read: 8, write: 6 } ];
		if(insn[0] === 0b0100_1110_0111_0110) // TRAPV
			return [ { total: 8, read: 2, write: 0 }, { total: 66, read: 10, write: 6 } ];

		// JMP, JSR, LEA, PEA, and MOVEM (Table 8-10)
		if((insn[0] & 0b1111_1111_1100_0000) === 0b0100_1110_1100_0000) // JMP
			return GetCyclesJmp(insn);
		if((insn[0] & 0b1111_1111_1100_0000) === 0b0100_1110_1000_0000) // JSR
			return GetCyclesJsr(insn);
		if((insn[0] & 0b1111_0001_1100_0000) === 0b0100_0001_1100_0000) // LEA
			return GetCyclesLea(insn);
		if((insn[0] & 0b1111_1111_1100_0000) === 0b0100_1000_0100_0000) // PEA
			return GetCyclesPea(insn);
		if((insn[0] & 0b1111_1011_1000_0000) === 0b0100_1000_1000_0000) // MOVEM
			return GetCyclesMovem(insn);

		// Move
		if((insn[0] & 0b1100_0000_0000_0000) === 0b0000_0000_0000_0000) // MOVE
			return GetCyclesMove(insn);
	} catch(e) {
		console.log(`Error decoding opcode ${insn[0].toString(16).padStart(4, '0')}`);
		return;
	}
	console.log(`Unknown opcode ${insn[0].toString(16)}.padStart(4, '0')`);
}
