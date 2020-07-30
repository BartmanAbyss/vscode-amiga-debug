// https://www.nxp.com/docs/en/reference-manual/MC68000UM.pdf

import { randomBytes } from "crypto";

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

// bits are always the lowest bit from https://www.nxp.com/docs/en/reference-manual/M68000PRM.pdf
function GetSize(insn: number, bit: number): Size {
	switch((insn >> bit) & 0b11) {
	case 0b01: return Size.Byte;
	case 0b11: return Size.Word;
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

function GetCyclesStandard(insn: Uint16Array): Cycles {
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
		// TODO
	} else {
		if(opmode.opmode === Opxxx.DestinationDataRegister || opmode.opmode === Opxxx.DestinationAddressRegister) {
			const exs = opmode.size !== Size.Long && opmode.opmode === Opxxx.DestinationAddressRegister ? 4 : 0;
			const exl = opmode.size === Size.Long && (effectiveAddress === AddressingMode.AddressRegisterDirect || effectiveAddress === AddressingMode.Immediate) ? 2 : 0;
			const cy  = opmode.size !== Size.Long ? { total: 4 + exs, read: 1, write: 0 } : { total: 6 + exl, read: 1, write: 0 };
			return {
				total: ea.total + cy.total,
				read: ea.read + cy.read,
				write: ea.read + cy.read
			};
		} else {
			// all opcodes
			const cy = opmode.size !== Size.Long ? { total: 8, read: 1, write: 1 } : { total: 12, read: 1, write: 2 };
			return {
				total: ea.total + cy.total,
				read: ea.read + cy.read,
				write: ea.read + cy.read
			};
		}
	}
}

function GetCyclesImmediate(insn: Uint16Array): Cycles {
	const size = GetSize(insn[0], 6);
	const effectiveAddress = GetAddressingMode(insn[0], 0, 3);
	const op = ((insn[0] >> 8) & 0b1111);
	if(effectiveAddress === AddressingMode.DataRegisterDirect) {
		const extra = (op === 0b0010 || op === 0b1100) ? 2 : 0; // ANDI, CMPI are 2 cycles faster for LONG
		return size !== Size.Long ? { total: 8, read: 2, write: 0 } : { total: 16 - extra, read: 3, write: 0 };
	} else {
		const ea = size !== Size.Long ? EffectiveAddressCalculationTimes[effectiveAddress].short : EffectiveAddressCalculationTimes[effectiveAddress].long;
		const cy = size !== Size.Long ? { total: 12, read: 2, write: 1 } : { total: 20, read: 3, write: 2 };
		return {
			total: ea.total + cy.total,
			read: ea.read + cy.read,
			write: ea.read + cy.read
		};
	}
}

function GetCyclesAddqSubq(insn: Uint16Array): Cycles {
	const size = GetSize(insn[0], 6);
	const effectiveAddress = GetAddressingMode(insn[0], 0, 3);
	if(effectiveAddress === AddressingMode.DataRegisterDirect || effectiveAddress === AddressingMode.AddressRegisterDirect) {
		return size !== Size.Long ? { total: 4, read: 1, write: 0 } : { total: 8, read: 1, write: 0 };
	} else {
		const ea = size !== Size.Long ? EffectiveAddressCalculationTimes[effectiveAddress].short : EffectiveAddressCalculationTimes[effectiveAddress].long;
		const cy = size !== Size.Long ? { total: 8, read: 1, write: 1 } : { total: 12, read: 1, write: 2 };
		return {
			total: ea.total + cy.total,
			read: ea.read + cy.read,
			write: ea.read + cy.read
		};
	}
}

function GetCyclesMove(insn: Uint16Array): Cycles {
	const size = GetSize(insn[0], 12);
	const destination = GetAddressingMode(insn[0], 9, 6);
	const source = GetAddressingMode(insn[0], 0, 3);
	if(size !== undefined && destination !== undefined && source !== undefined) {
		if(size === Size.Long)
			return MoveExecutionTimes[source][destination].long;
		else
			return MoveExecutionTimes[source][destination].short;
	}
}

function GetCyclesMovem(insn: Uint16Array): Cycles {
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
			return size === Size.Word ? { total: 12 + 4 * n, read: 3 + n, write: 0 } : { total: 12 + 8 * n, read: 3 + 2 * n, write: 0 };
		case AddressingMode.AddressRegisterIndirectWithDisplacement:
		case AddressingMode.AbsoluteShort:
		case AddressingMode.ProgramCounterIndirectWithDisplacement:
			return size === Size.Word ? { total: 16 + 4 * n, read: 4 + n, write: 0 } : { total: 16 + 8 * n, read: 4 + 2 * n, write: 0 };
		case AddressingMode.AddressRegisterIndirectWithIndex:
		case AddressingMode.ProgramCounterIndirectWithIndex:
			return size === Size.Word ? { total: 18 + 4 * n, read: 4 + n, write: 0 } : { total: 18 + 8 * n, read: 4 + 2 * n, write: 0 };
		case AddressingMode.AbsoluteLong:
			return size === Size.Word ? { total: 20 + 4 * n, read: 5 + n, write: 0 } : { total: 20 + 8 * n, read: 5 + 2 * n, write: 0 };
		}
	} else {
		// Register to memory
		switch(effectiveAddress) {
		case AddressingMode.AddressRegisterIndirect:
		case AddressingMode.AddressRegisterIndirectWithPredecrement:
			return size === Size.Word ? { total: 8 + 4 * n, read: 2, write: n } : { total: 8 + 8 * n, read: 2, write: 2 * n };
		case AddressingMode.AddressRegisterIndirectWithDisplacement:
		case AddressingMode.AbsoluteShort:
			return size === Size.Word ? { total: 12 + 4 * n, read: 3, write: n } : { total: 12 + 8 * n, read: 3, write: 2 * n };
		case AddressingMode.AddressRegisterIndirectWithIndex:
			return size === Size.Word ? { total: 14 + 4 * n, read: 3, write: n } : { total: 14 + 8 * n, read: 3, write: 2 * n };
		case AddressingMode.AbsoluteLong:
			return size === Size.Word ? { total: 16 + 4 * n, read: 4, write: n } : { total: 16 + 8 * n, read: 4, write: 2 * n };
		}
	}
}

export function GetCycles(insn: Uint16Array): Cycles {
	// Immediate
	if((insn[0] & 0b1111_1111_0000_0000) === 0b0000_0110_0000_0000 // ADDI
	|| (insn[0] & 0b1111_1111_0000_0000) === 0b0000_0010_0000_0000 // ANDI
	|| (insn[0] & 0b1111_1111_0000_0000) === 0b0000_1100_0000_0000 // CMPI
	|| (insn[0] & 0b1111_1111_0000_0000) === 0b0000_1010_0000_0000 // EORI
	|| (insn[0] & 0b1111_1111_0000_0000) === 0b0000_0000_0000_0000 // ORI
	|| (insn[0] & 0b1111_1111_0000_0000) === 0b0000_0100_0000_0000) // SUBI
		return GetCyclesImmediate(insn);
	if((insn[0] & 0b1111_0000_0000_0000) === 0b0101_0000_0000_0000) // ADDQ/SUBQ
		return GetCyclesAddqSubq(insn);
	if((insn[0] & 0b1111_0001_0000_0000) === 0b0111_0000_0000_0000) // MOVEQ
		return { total: 4, read: 1, write: 0 };
	
	if((insn[0] & 0b1111_0000_0000_0000) === 0b1101_0000_0000_0000 // ADD
	|| (insn[0] & 0b1111_0000_0000_0000) === 0b1100_0000_0000_0000 // AND
	|| (insn[0] & 0b1111_0000_0000_0000) === 0b1011_0000_0000_0000 // CMP/EOR
	|| (insn[0] & 0b1111_0000_0000_0000) === 0b1000_0000_0000_0000 // OR
	|| (insn[0] & 0b1111_0000_0000_0000) === 0b1001_0000_0000_0000) // SUB
		return GetCyclesStandard(insn);

	// Move
	if((insn[0] & 0b1111_1011_1000_0000) === 0b0100_1000_1000_0000) // MOVEM
		return GetCyclesMovem(insn);
	if((insn[0] & 0b1100_0000_0000_0000) === 0b0000_0000_0000_0000) // MOVE
		return GetCyclesMove(insn);
	//else if((insn[0] & 0b1111_1111_1100_0000) === 0b0100_0100_1100_0000) // MOVE to CCR
		// TODO
	//else if((insn[0] & 0b1111_1111_1100_0000) === 0b0100_0000_1100_0000) // MOVE from SR
		// TODO
	//else if((insn[0] & 0b1111_0001_0000_0000) === 0b0111_0000_0000_0000) // MOVEQ
		// TODO
	if(insn[0] === 0x4e73) // RTE
		return { total: 20, read: 5, write: 0 };
	if(insn[0] === 0x4e75) // RTS
		return { total: 16, read: 4, write: 0 };
	console.log(`Unknown opcode ${insn[0].toString(16)}`);
}
