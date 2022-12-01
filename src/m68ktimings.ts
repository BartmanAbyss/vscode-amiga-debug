import { Instruction } from "m68kdecode";

/**
 * Timing vector:
 * cycles, reads, writes
 */
export type Timing = [number, number, number];

/**
 * Result of timing lookup for an instruction
 */
export interface InstructionTiming {
	values: Timing[];
	labels: string[];
	calculation?: Calculation;
}

/**
 * Describes how the timings are calculated
 */
export interface Calculation {
	base: Timing[];
	ea?: Timing;
	multiplier?: Timing;
	/** Known number or range */
	n?: number | [number, number];
}

// Internal data structure for table. Includes groups to avoid repetition for ease of editing
type TimingTable = [
	// Operation
	string[],
	// Sizes
	(string | null)[],
	// Operand types / groups
	(string | string[])[],
	// Main timings
	Timing[],
	// Multipliers
	Timing?
][];

// Flattened view of table with groups expanded for quick lookup. This is created on first usage.
type CalculationMap = Map<string, Calculation>;

/**
 * Look up timing information for a parsed instruction
 */
 export function instructionTimings(
	inst: Instruction
): InstructionTiming | null {
	const timingMap = getCalculationMap();
	const key = buildKey(inst);
	if (!key || !timingMap.has(key)) {
		return null;
	}

	const { operation, operands } = inst;
	const [source, dest]  = operands;
	const calculation = { ...timingMap.get(key) };

	// Special case for immediate < 16 o bit ops
	if (["BCHG", "BSET", "BCLR"].includes(operation) && source.kind === "IMM16" && dest.kind === "DR" && source.value < 16) {
		const [c, r, w] = calculation.base[0];
		calculation.base = [[c - 2, r, w]];
	}

	const timings: Timing[] = [...calculation.base];

	// Calculate n multiplier:
	if (calculation.multiplier) {
		// Shift
		if (SHIFT.includes(operation)) {
			if (source.kind === "IMM8") {
				calculation.n = source.value;
			} else if (source.kind === "Implied") {
				calculation.n = 1;
			} else {
				// Range for register
				calculation.n = [0, 63];
			}
		}
		// MULU
		else if (operation === "MULU") {
			// n = the number of ones in the <ea>
			if (source.kind === "IMM32" || source.kind === "IMM16") {
				calculation.n = popCount(source.value);
			} else {
				calculation.n = [0, 16];
			}
		}
		// MULS
		else if (operation === "MULS") {
			// n = concatenate the <ea> with a zero as the LSB;
			// n is the resultant number of 10 or 01 patterns in the 17-bit source;
			// i.e. worst case happens when the source is $5555
			if (source.kind === "IMM32" || source.kind === "IMM16") {
				calculation.n = popCount((source.value ^ (source.value << 1)) & 0xffff);
			} else {
				calculation.n = [0, 16];
			}
		}
		// MOVEM
		else if (operation === "MOVEM") {
			for (const op of operands) {
				if (op.kind === "REGLIST") {
					calculation.n = bitCount(op.bitmask);
				}
			}
		}

		// Apply multiplier:
		if (calculation.n) {
			// Range
			if (Array.isArray(calculation.n)) {
				for (let i = 0; i < calculation.n.length; i++) {
					const m = multiplyTiming(calculation.multiplier, calculation.n[i]);
					timings[i] = addTimings(calculation.base[0], m);
				}
			}
			// Single value
			else {
				const m = multiplyTiming(calculation.multiplier, calculation.n);
				for (let i = 0; i < timings.length; i++) {
					timings[i] = addTimings(timings[i], m);
				}
			}
		}
	}

	// Add effective address lookup
	if (calculation.ea) {
		for (let i = 0; i < timings.length; i++) {
			timings[i] = addTimings(timings[i], calculation.ea);
		}
	}

	// Add labels for multiple values
	const labels = timings.length > 1 ? timingLabels(operation) : [];

	return { values: timings, labels, calculation };
}

/**
 * Convert timing to string per the 68000 documentation
 *
 * clock(read/write)
 */
export const formatTiming = (timing: Timing): string =>
	`${timing[0]}(${timing[1]}/${timing[2]})`;

/**
 * Add two timing vectors
 */
export const addTimings = (a: Timing, b: Timing): Timing =>
	[a[0] + b[0], a[1] + b[1], a[2] + b[2]];

/**
 * Multiply a timing vector by a scalar value
 */
export const multiplyTiming = (t: Timing, scalar: number): Timing =>
	[t[0] * scalar, t[1] * scalar, t[2] * scalar];

/**
 * Calculation used for multiplications
 * @param m Multiplier
 * @returns
 */
 export function popCount(m: number): number {
	m -= (m >> 1) & 0x55555555;
	m = (m & 0x33333333) + ((m >> 2) & 0x33333333);
	m = (m + (m >> 4)) & 0x0f0f0f0f;
	m += m >> 8;
	m += m >> 16;
	return m & 0x7f;
}

let timingMap: CalculationMap;

/**
 * Get flattened table for simple key/value lookup by instruction string
 * e.g. "MOVE.L DR,DR": [4, 1, 0]
 * @returns Map
 */
function getCalculationMap(): CalculationMap {
	// Already generated?
	if (timingMap) return timingMap;

	// Generate map on first usage:
	timingMap = new Map<string, Calculation>();
	for (const row of baseTimes) {
		const [mnemonics, qualifiers, operands, base, multiplier] = row;
		for (const mnemonic of mnemonics) {
			for (const qualifier of qualifiers) {
				let key = String(mnemonic);
				if (qualifier) {
					key += "." + qualifier;
				}
				const eaSize = qualifier === "L" ? 1 : 0;
				let o: string;

				if (Array.isArray(operands[0])) {
					// EA lookup in source
					for (o of operands[0]) {
						let ea = lookupTimes[o][eaSize];
						// Special cases:
						if (mnemonic === "TAS" && o === "ABS16") {
							ea = [8, 1, 0];
						}
						if (
							(mnemonic === "TAS" ||
								mnemonic === "CHK" ||
								mnemonic === "MULS" ||
								mnemonic === "MULU") &&
							o === "ABS32"
						) {
							ea = [12, 2, 0];
						}
						let k = key + " " + o;
						if (operands[1]) {
							k += "," + (operands[1] as string);
						}
						timingMap.set(k, { base, ea, multiplier });
					}
				} else if (Array.isArray(operands[1])) {
					// EA lookup in dest
					for (o of operands[1]) {
						const ea = lookupTimes[o][eaSize];
						const k = key + " " + operands[0] + "," + o;
						timingMap.set(k, { base, ea, multiplier });
					}
				} else {
					// Regular operands
					if (operands.length) {
						key += " " + operands.join(",");
					}
					timingMap.set(key, { base, multiplier });
				}
			}
		}
	}
	return timingMap;
}

function bitCount (n: number) {
	n = n - ((n >> 1) & 0x55555555);
	n = (n & 0x33333333) + ((n >> 2) & 0x33333333);
	return ((n + (n >> 4) & 0xF0F0F0F) * 0x1010101) >> 24;
}

function timingLabels(op: string): string[] {
	if (op === "SCC" || op === "BCC") {
		return ["Taken", "Not taken"];
	}
	if (op === "DBCC") {
		return ["Taken", "Not taken", "Expired"];
	}
	if (op === "CHK") {
		return ["No trap", "Trap >", "Trap <"];
	}
	if (op === "TRAPV") {
		return ["No trap", "Trap"];
	}
	// Default
	return ["Min", "Max"];
}

/**
 * Build string key for map lookup
 */
function buildKey(inst: Instruction): string | null {
	let key = inst.operation;
	const sizes = {
		1: ".B",
		2: ".W",
		4: ".L",
	};
	if (inst.size && sizes[inst.size]) {
		key += sizes[inst.size];
	}
	const ops = inst.operands.filter(Boolean).filter(o => o.kind !== "Implied").map((o) => {
		// Don't need size of immediate e.g. IMM8
		// combine to a single type
		if (o.kind.startsWith("IMM")) {
			return "IMM";
		}
		// Add 'IX' sufffix to displacement types that have an indexer register e.g. 1(a0,d1)
		// This affects timings so is treated as a separate operand type in the table
		if (o.kind === "ARDISP" || o.kind === "PCDISP") {
			return o.disp.indexer ?  o.kind + "IX" : o.kind;
		}
		// Use operand type as-is
		return o.kind;
	});
	if (ops.length) {
		key += " " + ops.join(",");
	}
	return key;
}

// Common groupings used in table:

// Operand groups:
const EA = [
	"DR",
	"AR",
	"ARIND",
	"ARINC",
	"ARDEC",
	"ARDISP",
	"ARDISPIX",
	"PCDISP",
	"PCDISPIX",
	"ABS16",
	"ABS32",
	"IMM",
];
const DI = ["DR", "AR", "IMM"];
const M = [
	"ARIND",
	"ARINC",
	"ARDEC",
	"ARDISP",
	"ARDISPIX",
	"PCDISP",
	"PCDISPIX",
	"ABS16",
	"ABS32",
];
// Operation groups:
const SHIFT = [
	"LSL",
	"LSR",
	"ASL",
	"ASR",
	"ROL",
	"ROR",
	"ROXL",
	"ROXR",
];
const LOGICAL_TO_SPECIAL = [
	"ANDITOCCR",
	"ANDITOSR",
	"EORITOCCR",
	"EORITOSR",
	"ORITOCCR",
	"ORITOSR",
];

// The main timing table:
// prettier-ignore
export const baseTimes: TimingTable = [
	//----------------------------------------------------------------------------------------------------------------
	// MOVE INSTRUCTION EXECUTION TIMES:
	// Move Byte and Word Instruction Execution Times:
	//----------------------------------------------------------------------------------------------------------------
	[["MOVE"], ["B", "W"], ["DR", "DR"],                        [[4, 1, 0]]],
	[["MOVE", "MOVEA"], ["B", "W"], ["DR", "AR"],               [[4, 1, 0]]],
	[["MOVE"], ["B", "W"], ["DR", "ARIND"],                     [[8, 1, 1]]],
	[["MOVE"], ["B", "W"], ["DR", "ARINC"],                     [[8, 1, 1]]],
	[["MOVE"], ["B", "W"], ["DR", "ARDEC"],                     [[8, 1, 1]]],
	[["MOVE"], ["B", "W"], ["DR", "ARDISP"],                    [[12, 2, 1]]],
	[["MOVE"], ["B", "W"], ["DR", "ARDISPIX"],                  [[14, 2, 1]]],
	[["MOVE"], ["B", "W"], ["DR", "ABS16"],                     [[12, 2, 1]]],
	[["MOVE"], ["B", "W"], ["DR", "ABS32"],                     [[16, 3, 1]]],
	//----------------------------------------------------------------------------------------------------------------
	[["MOVE"], ["B", "W"], ["AR", "DR"],                        [[4, 1, 0]]],
	[["MOVE", "MOVEA"], ["B", "W"], ["AR", "AR"],               [[4, 1, 0]]],
	[["MOVE"], ["B", "W"], ["AR", "ARIND"],                     [[8, 1, 1]]],
	[["MOVE"], ["B", "W"], ["AR", "ARINC"],                     [[8, 1, 1]]],
	[["MOVE"], ["B", "W"], ["AR", "ARDEC"],                     [[8, 1, 1]]],
	[["MOVE"], ["B", "W"], ["AR", "ARDISP"],                    [[12, 2, 1]]],
	[["MOVE"], ["B", "W"], ["AR", "ARDISPIX"],                  [[14, 2, 1]]],
	[["MOVE"], ["B", "W"], ["AR", "ABS16"],                     [[12, 2, 1]]],
	[["MOVE"], ["B", "W"], ["AR", "ABS32"],                     [[16, 3, 1]]],
	//----------------------------------------------------------------------------------------------------------------
	[["MOVE"], ["B", "W"], ["ARIND", "DR"],                     [[8, 2, 0]]],
	[["MOVE", "MOVEA"], ["B", "W"], ["ARIND", "AR"],            [[8, 2, 0]]],
	[["MOVE"], ["B", "W"], ["ARIND", "ARIND"],                  [[12, 2, 1]]],
	[["MOVE"], ["B", "W"], ["ARIND", "ARINC"],                  [[12, 2, 1]]],
	[["MOVE"], ["B", "W"], ["ARIND", "ARDEC"],                  [[12, 2, 1]]],
	[["MOVE"], ["B", "W"], ["ARIND", "ARDISP"],                 [[16, 3, 1]]],
	[["MOVE"], ["B", "W"], ["ARIND", "ARDISPIX"],               [[18, 3, 1]]],
	[["MOVE"], ["B", "W"], ["ARIND", "ABS16"],                  [[16, 3, 1]]],
	[["MOVE"], ["B", "W"], ["ARIND", "ABS32"],                  [[20, 4, 1]]],
	//----------------------------------------------------------------------------------------------------------------
	[["MOVE"], ["B", "W"], ["ARINC", "DR"],                     [[8, 2, 0]]],
	[["MOVE", "MOVEA"], ["B", "W"], ["ARINC", "AR"],            [[8, 2, 0]]],
	[["MOVE"], ["B", "W"], ["ARINC", "ARIND"],                  [[12, 2, 1]]],
	[["MOVE"], ["B", "W"], ["ARINC", "ARINC"],                  [[12, 2, 1]]],
	[["MOVE"], ["B", "W"], ["ARINC", "ARDEC"],                  [[12, 2, 1]]],
	[["MOVE"], ["B", "W"], ["ARINC", "ARDISP"],                 [[16, 3, 1]]],
	[["MOVE"], ["B", "W"], ["ARINC", "ARDISPIX"],               [[18, 3, 1]]],
	[["MOVE"], ["B", "W"], ["ARINC", "ABS16"],                  [[16, 3, 1]]],
	[["MOVE"], ["B", "W"], ["ARINC", "ABS32"],                  [[20, 4, 1]]],
	//----------------------------------------------------------------------------------------------------------------
	[["MOVE"], ["B", "W"], ["ARDEC", "DR"],                     [[10, 2, 0]]],
	[["MOVE", "MOVEA"], ["B", "W"], ["ARDEC", "AR"],            [[10, 2, 0]]],
	[["MOVE"], ["B", "W"], ["ARDEC", "ARIND"],                  [[14, 2, 1]]],
	[["MOVE"], ["B", "W"], ["ARDEC", "ARINC"],                  [[14, 2, 1]]],
	[["MOVE"], ["B", "W"], ["ARDEC", "ARDEC"],                  [[14, 2, 1]]],
	[["MOVE"], ["B", "W"], ["ARDEC", "ARDISP"],                 [[18, 3, 1]]],
	[["MOVE"], ["B", "W"], ["ARDEC", "ARDISPIX"],               [[20, 3, 1]]],
	[["MOVE"], ["B", "W"], ["ARDEC", "ABS16"],                  [[18, 3, 1]]],
	[["MOVE"], ["B", "W"], ["ARDEC", "ABS32"],                  [[22, 4, 1]]],
	//----------------------------------------------------------------------------------------------------------------
	[["MOVE"], ["B", "W"], ["ARDISP", "DR"],                    [[12, 3, 0]]],
	[["MOVE", "MOVEA"], ["B", "W"], ["ARDISP", "AR"],           [[12, 3, 0]]],
	[["MOVE"], ["B", "W"], ["ARDISP", "ARIND"],                 [[16, 3, 1]]],
	[["MOVE"], ["B", "W"], ["ARDISP", "ARINC"],                 [[16, 3, 1]]],
	[["MOVE"], ["B", "W"], ["ARDISP", "ARDEC"],                 [[16, 3, 1]]],
	[["MOVE"], ["B", "W"], ["ARDISP", "ARDISP"],                [[20, 4, 1]]],
	[["MOVE"], ["B", "W"], ["ARDISP", "ARDISPIX"],              [[22, 4, 1]]],
	[["MOVE"], ["B", "W"], ["ARDISP", "ABS16"],                 [[20, 4, 1]]],
	[["MOVE"], ["B", "W"], ["ARDISP", "ABS32"],                 [[24, 5, 1]]],
	//----------------------------------------------------------------------------------------------------------------
	[["MOVE"], ["B", "W"], ["ARDISPIX", "DR"],                  [[14, 3, 0]]],
	[["MOVE", "MOVEA"], ["B", "W"], ["ARDISPIX", "AR"],         [[14, 3, 0]]],
	[["MOVE"], ["B", "W"], ["ARDISPIX", "ARIND"],               [[18, 3, 1]]],
	[["MOVE"], ["B", "W"], ["ARDISPIX", "ARINC"],               [[18, 3, 1]]],
	[["MOVE"], ["B", "W"], ["ARDISPIX", "ARDEC"],               [[18, 3, 1]]],
	[["MOVE"], ["B", "W"], ["ARDISPIX", "ARDISP"],              [[22, 4, 1]]],
	[["MOVE"], ["B", "W"], ["ARDISPIX", "ARDISPIX"],            [[24, 4, 1]]],
	[["MOVE"], ["B", "W"], ["ARDISPIX", "ABS16"],               [[22, 4, 1]]],
	[["MOVE"], ["B", "W"], ["ARDISPIX", "ABS32"],               [[26, 5, 1]]],
	//----------------------------------------------------------------------------------------------------------------
	[["MOVE"], ["B", "W"], ["ABS16", "DR"],                     [[12, 3, 0]]],
	[["MOVE", "MOVEA"], ["B", "W"], ["ABS16", "AR"],            [[12, 3, 0]]],
	[["MOVE"], ["B", "W"], ["ABS16", "ARIND"],                  [[16, 3, 1]]],
	[["MOVE"], ["B", "W"], ["ABS16", "ARINC"],                  [[16, 3, 1]]],
	[["MOVE"], ["B", "W"], ["ABS16", "ARDEC"],                  [[16, 3, 1]]],
	[["MOVE"], ["B", "W"], ["ABS16", "ARDISP"],                 [[20, 4, 1]]],
	[["MOVE"], ["B", "W"], ["ABS16", "ARDISPIX"],               [[22, 4, 1]]],
	[["MOVE"], ["B", "W"], ["ABS16", "ABS16"],                  [[20, 4, 1]]],
	[["MOVE"], ["B", "W"], ["ABS16", "ABS32"],                  [[24, 5, 1]]],
	//----------------------------------------------------------------------------------------------------------------
	[["MOVE"], ["B", "W"], ["ABS32", "DR"],                     [[16, 4, 0]]],
	[["MOVE", "MOVEA"], ["B", "W"], ["ABS32", "AR"],            [[16, 4, 0]]],
	[["MOVE"], ["B", "W"], ["ABS32", "ARIND"],                  [[20, 4, 1]]],
	[["MOVE"], ["B", "W"], ["ABS32", "ARINC"],                  [[20, 4, 1]]],
	[["MOVE"], ["B", "W"], ["ABS32", "ARDEC"],                  [[20, 4, 1]]],
	[["MOVE"], ["B", "W"], ["ABS32", "ARDISP"],                 [[24, 5, 1]]],
	[["MOVE"], ["B", "W"], ["ABS32", "ARDISPIX"],               [[26, 5, 1]]],
	[["MOVE"], ["B", "W"], ["ABS32", "ABS16"],                  [[24, 5, 1]]],
	[["MOVE"], ["B", "W"], ["ABS32", "ABS32"],                  [[28, 6, 1]]],
	//----------------------------------------------------------------------------------------------------------------
	[["MOVE"], ["B", "W"], ["PCDISP", "DR"],                    [[12, 3, 0]]],
	[["MOVE", "MOVEA"], ["B", "W"], ["PCDISP", "AR"],           [[12, 3, 0]]],
	[["MOVE"], ["B", "W"], ["PCDISP", "ARIND"],                 [[16, 3, 1]]],
	[["MOVE"], ["B", "W"], ["PCDISP", "ARINC"],                 [[16, 3, 1]]],
	[["MOVE"], ["B", "W"], ["PCDISP", "ARDEC"],                 [[16, 3, 1]]],
	[["MOVE"], ["B", "W"], ["PCDISP", "ARDISP"],                [[20, 4, 1]]],
	[["MOVE"], ["B", "W"], ["PCDISP", "ARDISPIX"],              [[22, 4, 1]]],
	[["MOVE"], ["B", "W"], ["PCDISP", "ABS16"],                 [[20, 4, 1]]],
	[["MOVE"], ["B", "W"], ["PCDISP", "ABS32"],                 [[24, 5, 1]]],
	//----------------------------------------------------------------------------------------------------------------
	[["MOVE"], ["B", "W"], ["PCDISPIX", "DR"],                  [[14, 3, 0]]],
	[["MOVE", "MOVEA"], ["B", "W"], ["PCDISPIX", "AR"],         [[14, 3, 0]]],
	[["MOVE"], ["B", "W"], ["PCDISPIX", "ARIND"],               [[18, 3, 1]]],
	[["MOVE"], ["B", "W"], ["PCDISPIX", "ARINC"],               [[18, 3, 1]]],
	[["MOVE"], ["B", "W"], ["PCDISPIX", "ARDEC"],               [[18, 3, 1]]],
	[["MOVE"], ["B", "W"], ["PCDISPIX", "ARDISP"],              [[22, 4, 1]]],
	[["MOVE"], ["B", "W"], ["PCDISPIX", "ARDISPIX"],            [[24, 4, 1]]],
	[["MOVE"], ["B", "W"], ["PCDISPIX", "ABS16"],               [[22, 4, 1]]],
	[["MOVE"], ["B", "W"], ["PCDISPIX", "ABS32"],               [[26, 5, 1]]],
	//----------------------------------------------------------------------------------------------------------------
	[["MOVE"], ["B", "W"], ["IMM", "DR"],                       [[8, 2, 0]]],
	[["MOVE", "MOVEA"], ["B", "W"], ["IMM", "AR"],              [[8, 2, 0]]],
	[["MOVE"], ["B", "W"], ["IMM", "ARIND"],                    [[12, 2, 1]]],
	[["MOVE"], ["B", "W"], ["IMM", "ARINC"],                    [[12, 2, 1]]],
	[["MOVE"], ["B", "W"], ["IMM", "ARDEC"],                    [[12, 2, 1]]],
	[["MOVE"], ["B", "W"], ["IMM", "ARDISP"],                   [[16, 3, 1]]],
	[["MOVE"], ["B", "W"], ["IMM", "ARDISPIX"],                 [[18, 3, 1]]],
	[["MOVE"], ["B", "W"], ["IMM", "ABS16"],                    [[16, 3, 1]]],
	[["MOVE"], ["B", "W"], ["IMM", "ABS32"],                    [[20, 4, 1]]],
	//----------------------------------------------------------------------------------------------------------------
	// Move Long Instruction Execution Times:
	//----------------------------------------------------------------------------------------------------------------
	[["MOVE"], ["L"], ["DR", "DR"],                             [[4, 1, 0]]],
	[["MOVE", "MOVEA"], ["L"], ["DR", "AR"],                    [[4, 1, 0]]],
	[["MOVE"], ["L"], ["DR", "ARIND"],                          [[12, 1, 2]]],
	[["MOVE"], ["L"], ["DR", "ARINC"],                          [[12, 1, 2]]],
	[["MOVE"], ["L"], ["DR", "ARDEC"],                          [[12, 1, 2]]],
	[["MOVE"], ["L"], ["DR", "ARDISP"],                         [[16, 2, 2]]],
	[["MOVE"], ["L"], ["DR", "ARDISPIX"],                       [[18, 2, 2]]],
	[["MOVE"], ["L"], ["DR", "ABS16"],                          [[16, 2, 2]]],
	[["MOVE"], ["L"], ["DR", "ABS32"],                          [[20, 3, 2]]],
	//----------------------------------------------------------------------------------------------------------------
	[["MOVE"], ["L"], ["AR", "DR"],                             [[4, 1, 0]]],
	[["MOVE", "MOVEA"], ["L"], ["AR", "AR"],                    [[4, 1, 0]]],
	[["MOVE"], ["L"], ["AR", "ARIND"],                          [[12, 1, 2]]],
	[["MOVE"], ["L"], ["AR", "ARINC"],                          [[12, 1, 2]]],
	[["MOVE"], ["L"], ["AR", "ARDEC"],                          [[12, 1, 2]]],
	[["MOVE"], ["L"], ["AR", "ARDISP"],                         [[16, 2, 2]]],
	[["MOVE"], ["L"], ["AR", "ARDISPIX"],                       [[18, 2, 2]]],
	[["MOVE"], ["L"], ["AR", "ABS16"],                          [[16, 2, 2]]],
	[["MOVE"], ["L"], ["AR", "ABS32"],                          [[20, 3, 2]]],
	//----------------------------------------------------------------------------------------------------------------
	[["MOVE"], ["L"], ["ARIND", "DR"],                          [[12, 3, 0]]],
	[["MOVE", "MOVEA"], ["L"], ["ARIND", "AR"],                 [[12, 3, 0]]],
	[["MOVE"], ["L"], ["ARIND", "ARIND"],                       [[20, 3, 2]]],
	[["MOVE"], ["L"], ["ARIND", "ARINC"],                       [[20, 3, 2]]],
	[["MOVE"], ["L"], ["ARIND", "ARDEC"],                       [[20, 3, 2]]],
	[["MOVE"], ["L"], ["ARIND", "ARDISP"],                      [[24, 4, 2]]],
	[["MOVE"], ["L"], ["ARIND", "ARDISPIX"],                    [[26, 4, 2]]],
	[["MOVE"], ["L"], ["ARIND", "ABS16"],                       [[24, 4, 2]]],
	[["MOVE"], ["L"], ["ARIND", "ABS32"],                       [[28, 5, 2]]],
	//----------------------------------------------------------------------------------------------------------------
	[["MOVE"], ["L"], ["ARINC", "DR"],                          [[12, 3, 0]]],
	[["MOVE", "MOVEA"], ["L"], ["ARINC", "AR"],                 [[12, 3, 0]]],
	[["MOVE"], ["L"], ["ARINC", "ARIND"],                       [[20, 3, 2]]],
	[["MOVE"], ["L"], ["ARINC", "ARINC"],                       [[20, 3, 2]]],
	[["MOVE"], ["L"], ["ARINC", "ARDEC"],                       [[20, 3, 2]]],
	[["MOVE"], ["L"], ["ARINC", "ARDISP"],                      [[24, 4, 2]]],
	[["MOVE"], ["L"], ["ARINC", "ARDISPIX"],                    [[26, 4, 2]]],
	[["MOVE"], ["L"], ["ARINC", "ABS16"],                       [[24, 4, 2]]],
	[["MOVE"], ["L"], ["ARINC", "ABS32"],                       [[28, 5, 2]]],
	//----------------------------------------------------------------------------------------------------------------
	[["MOVE"], ["L"], ["ARDEC", "DR"],                          [[14, 3, 0]]],
	[["MOVE", "MOVEA"], ["L"], ["ARDEC", "AR"],                 [[14, 3, 0]]],
	[["MOVE"], ["L"], ["ARDEC", "ARIND"],                       [[22, 3, 2]]],
	[["MOVE"], ["L"], ["ARDEC", "ARINC"],                       [[22, 3, 2]]],
	[["MOVE"], ["L"], ["ARDEC", "ARDEC"],                       [[22, 3, 2]]],
	[["MOVE"], ["L"], ["ARDEC", "ARDISP"],                      [[26, 4, 2]]],
	[["MOVE"], ["L"], ["ARDEC", "ARDISPIX"],                    [[28, 4, 2]]],
	[["MOVE"], ["L"], ["ARDEC", "ABS16"],                       [[26, 4, 2]]],
	[["MOVE"], ["L"], ["ARDEC", "ABS32"],                       [[30, 5, 2]]],
	//----------------------------------------------------------------------------------------------------------------
	[["MOVE"], ["L"], ["ARDISP", "DR"],                         [[16, 4, 0]]],
	[["MOVE", "MOVEA"], ["L"], ["ARDISP", "AR"],                [[16, 4, 0]]],
	[["MOVE"], ["L"], ["ARDISP", "ARIND"],                      [[24, 4, 2]]],
	[["MOVE"], ["L"], ["ARDISP", "ARINC"],                      [[24, 4, 2]]],
	[["MOVE"], ["L"], ["ARDISP", "ARDEC"],                      [[24, 4, 2]]],
	[["MOVE"], ["L"], ["ARDISP", "ARDISP"],                     [[28, 5, 2]]],
	[["MOVE"], ["L"], ["ARDISP", "ARDISPIX"],                   [[30, 5, 2]]],
	[["MOVE"], ["L"], ["ARDISP", "ABS16"],                      [[28, 5, 2]]],
	[["MOVE"], ["L"], ["ARDISP", "ABS32"],                      [[32, 6, 2]]],
	//----------------------------------------------------------------------------------------------------------------
	[["MOVE"], ["L"], ["ARDISPIX", "DR"],                       [[18, 4, 0]]],
	[["MOVE", "MOVEA"], ["L"], ["ARDISPIX", "AR"],              [[18, 4, 0]]],
	[["MOVE"], ["L"], ["ARDISPIX", "ARIND"],                    [[26, 4, 2]]],
	[["MOVE"], ["L"], ["ARDISPIX", "ARINC"],                    [[26, 4, 2]]],
	[["MOVE"], ["L"], ["ARDISPIX", "ARDEC"],                    [[26, 4, 2]]],
	[["MOVE"], ["L"], ["ARDISPIX", "ARDISP"],                   [[30, 5, 2]]],
	[["MOVE"], ["L"], ["ARDISPIX", "ARDISPIX"],                 [[32, 5, 2]]],
	[["MOVE"], ["L"], ["ARDISPIX", "ABS16"],                    [[30, 5, 2]]],
	[["MOVE"], ["L"], ["ARDISPIX", "ABS32"],                    [[34, 6, 2]]],
	//----------------------------------------------------------------------------------------------------------------
	[["MOVE"], ["L"], ["ABS16", "DR"],                          [[16, 4, 0]]],
	[["MOVE", "MOVEA"], ["L"], ["ABS16", "AR"],                 [[16, 4, 0]]],
	[["MOVE"], ["L"], ["ABS16", "ARIND"],                       [[24, 4, 2]]],
	[["MOVE"], ["L"], ["ABS16", "ARINC"],                       [[24, 4, 2]]],
	[["MOVE"], ["L"], ["ABS16", "ARDEC"],                       [[24, 4, 2]]],
	[["MOVE"], ["L"], ["ABS16", "ARDISP"],                      [[28, 5, 2]]],
	[["MOVE"], ["L"], ["ABS16", "ARDISPIX"],                    [[30, 5, 2]]],
	[["MOVE"], ["L"], ["ABS16", "ABS16"],                       [[28, 5, 2]]],
	[["MOVE"], ["L"], ["ABS16", "ABS32"],                       [[32, 6, 2]]],
	//----------------------------------------------------------------------------------------------------------------
	[["MOVE"], ["L"], ["ABS32", "DR"],                          [[20, 5, 0]]],
	[["MOVE", "MOVEA"], ["L"], ["ABS32", "AR"],                 [[20, 5, 0]]],
	[["MOVE"], ["L"], ["ABS32", "ARIND"],                       [[28, 5, 2]]],
	[["MOVE"], ["L"], ["ABS32", "ARINC"],                       [[28, 5, 2]]],
	[["MOVE"], ["L"], ["ABS32", "ARDEC"],                       [[28, 5, 2]]],
	[["MOVE"], ["L"], ["ABS32", "ARDISP"],                      [[32, 6, 2]]],
	[["MOVE"], ["L"], ["ABS32", "ARDISPIX"],                    [[34, 6, 2]]],
	[["MOVE"], ["L"], ["ABS32", "ABS16"],                       [[32, 6, 2]]],
	[["MOVE"], ["L"], ["ABS32", "ABS32"],                       [[36, 7, 2]]],
	//----------------------------------------------------------------------------------------------------------------
	[["MOVE"], ["L"], ["PCDISP", "DR"],                         [[16, 4, 0]]],
	[["MOVE", "MOVEA"], ["L"], ["PCDISP", "AR"],                [[16, 4, 0]]],
	[["MOVE"], ["L"], ["PCDISP", "ARIND"],                      [[24, 4, 2]]],
	[["MOVE"], ["L"], ["PCDISP", "ARINC"],                      [[24, 4, 2]]],
	[["MOVE"], ["L"], ["PCDISP", "ARDEC"],                      [[24, 4, 2]]],
	[["MOVE"], ["L"], ["PCDISP", "ARDISP"],                     [[28, 5, 2]]],
	[["MOVE"], ["L"], ["PCDISP", "ARDISPIX"],                   [[30, 5, 2]]],
	[["MOVE"], ["L"], ["PCDISP", "ABS16"],                      [[28, 5, 2]]],
	[["MOVE"], ["L"], ["PCDISP", "ABS32"],                      [[32, 6, 2]]],
	//----------------------------------------------------------------------------------------------------------------
	[["MOVE"], ["L"], ["PCDISPIX", "DR"],                       [[18, 4, 0]]],
	[["MOVE", "MOVEA"], ["L"], ["PCDISPIX", "AR"],              [[18, 4, 0]]],
	[["MOVE"], ["L"], ["PCDISPIX", "ARIND"],                    [[26, 4, 2]]],
	[["MOVE"], ["L"], ["PCDISPIX", "ARINC"],                    [[26, 4, 2]]],
	[["MOVE"], ["L"], ["PCDISPIX", "ARDEC"],                    [[26, 4, 2]]],
	[["MOVE"], ["L"], ["PCDISPIX", "ARDISP"],                   [[30, 5, 2]]],
	[["MOVE"], ["L"], ["PCDISPIX", "ARDISPIX"],                 [[32, 5, 2]]],
	[["MOVE"], ["L"], ["PCDISPIX", "ABS16"],                    [[30, 5, 2]]],
	[["MOVE"], ["L"], ["PCDISPIX", "ABS32"],                    [[34, 6, 2]]],
	//----------------------------------------------------------------------------------------------------------------
	[["MOVE"], ["L"], ["IMM", "DR"],                            [[12, 3, 0]]],
	[["MOVE", "MOVEA"], ["L"], ["IMM", "AR"],                   [[12, 3, 0]]],
	[["MOVE"], ["L"], ["IMM", "ARIND"],                         [[20, 3, 2]]],
	[["MOVE"], ["L"], ["IMM", "ARINC"],                         [[20, 3, 2]]],
	[["MOVE"], ["L"], ["IMM", "ARDEC"],                         [[20, 3, 2]]],
	[["MOVE"], ["L"], ["IMM", "ARDISP"],                        [[24, 4, 2]]],
	[["MOVE"], ["L"], ["IMM", "ARDISPIX"],                      [[26, 4, 2]]],
	[["MOVE"], ["L"], ["IMM", "ABS16"],                         [[24, 4, 2]]],
	[["MOVE"], ["L"], ["IMM", "ABS32"],                         [[28, 5, 2]]],

	//----------------------------------------------------------------------------------------------------------------
	// STANDARD INSTRUCTION EXECUTION TIMES:
	//----------------------------------------------------------------------------------------------------------------
	[["ADD", "SUB"], ["B", "W"], [EA, "AR"],                    [[8, 1, 0]]],
	[["ADDA", "SUBA"], ["W"], [EA, "AR"],                       [[8, 1, 0]]],
	[["ADD", "SUB"], ["B", "W"], [EA, "DR"],                    [[4, 1, 0]]],
	[["ADD", "SUB"], ["B", "W"], ["DR", M],                     [[8, 1, 1]]],
	[["ADD", "ADDA", "SUB", "SUBA"], ["L"], [M, "AR"],          [[6, 1, 0]]],
	[["ADD", "SUB"], ["L"], [M, "DR"],                          [[6, 1, 0]]],
	[["ADD", "ADDA", "SUB", "SUBA"], ["L"], [DI, "AR"],         [[8, 1, 0]]],
	[["ADD", "SUB"], ["L"], [DI, "DR"],                         [[8, 1, 0]]],
	[["ADD", "SUB"], ["L"], ["DR", M],                          [[12, 1, 2]]],
	//----------------------------------------------------------------------------------------------------------------
	[["AND", "OR"], ["B", "W"], [EA, "DR"],                     [[4, 1, 0]]],
	[["AND", "OR"], ["B", "W"], ["DR", M],                      [[8, 1, 1]]],
	[["AND", "OR"], ["L"], [M, "DR"],                           [[6, 1, 0]]],
	[["AND", "OR"], ["L"], [DI, "DR"],                          [[8, 1, 0]]],
	[["AND", "OR"], ["L"], ["DR", M],                           [[12, 1, 2]]],
	//----------------------------------------------------------------------------------------------------------------
	[["EOR"], ["B", "W"], ["DR", "DR"],                         [[4, 1, 0]]],
	[["EOR"], ["B", "W"], ["DR", M],                            [[8, 1, 1]]],
	[["EOR"], ["L"], ["DR", "DR"],                              [[8, 1, 0]]],
	[["EOR"], ["L"], ["DR", M],                                 [[12, 1, 2]]],
	//----------------------------------------------------------------------------------------------------------------
	[["CMP"], ["B", "W"], [EA, "AR"],                           [[6, 1, 0]]],
	[["CMPA"], ["W"], [EA, "AR"],                               [[6, 1, 0]]],
	[["CMP", "CMPA"], ["L"], [EA, "AR"],                        [[6, 1, 0]]],
	[["CMP"], ["L"], [EA, "DR"],                                [[6, 1, 0]]],
	[["CMP"], ["B", "W"], [EA, "DR"],                           [[4, 1, 0]]],
	//----------------------------------------------------------------------------------------------------------------
	[["DIVS"], ["W"], [EA, "DR"],                               [[120, 1, 0], [158, 1, 0]]],
	[["DIVU"], ["W"], [EA, "DR"],                               [[76, 1, 0], [140, 1, 0]]],
	[["MULS", "MULU"], ["W"], [EA, "DR"],                       [[38, 1, 0]], [2, 0, 0]],
	//----------------------------------------------------------------------------------------------------------------
	// Immediate Instruction Execution Times:
	//----------------------------------------------------------------------------------------------------------------
	[["ADD", "ADDI", "SUB", "SUBI"], ["B", "W"], ["IMM", "DR"], [[8, 2, 0]]],
	[["ADD", "ADDI", "SUB", "SUBI"], ["B", "W"], ["IMM", M],    [[12, 2, 1]]],
	[["ADD", "ADDI", "SUB", "SUBI"], ["L"], ["IMM", "DR"],      [[16, 3, 0]]],
	[["ADD", "ADDI", "SUB", "SUBI"], ["L"], ["IMM", M],         [[20, 3, 2]]],
	//----------------------------------------------------------------------------------------------------------------
	[["ADDQ", "SUBQ"], ["B", "W"], ["IMM", "DR"],               [[4, 1, 0]]],
	[["ADDQ", "SUBQ"], ["B", "W"], ["IMM", "AR"],               [[8, 1, 0]]],
	[["ADDQ", "SUBQ"], ["B", "W"], ["IMM", M],                  [[8, 1, 1]]],
	[["ADDQ", "SUBQ"], ["L"], ["IMM", "DR"],                    [[8, 1, 0]]],
	[["ADDQ", "SUBQ"], ["L"], ["IMM", "AR"],                    [[8, 1, 0]]],
	[["ADDQ", "SUBQ"], ["L"], ["IMM", M],                       [[12, 1, 2]]],
	//----------------------------------------------------------------------------------------------------------------
	[["AND", "ANDI", "OR", "ORI"], ["B", "W"], ["IMM", "DR"],   [[8, 2, 0]]],
	[["AND", "ANDI", "OR", "ORI"], ["B", "W"], ["IMM", M],      [[12, 2, 1]]],
	[["AND", "ANDI", "OR", "ORI"], ["L"], ["IMM", "DR"],        [[16, 3, 0]]],
	[["AND", "ANDI", "OR", "ORI"], ["L"], ["IMM", M],           [[20, 3, 2]]],
	//----------------------------------------------------------------------------------------------------------------
	[["CMP", "CMPI"], ["B", "W"], ["IMM", "DR"],                [[8, 2, 0]]],
	[["CMP", "CMPI"], ["B", "W"], ["IMM", M],                   [[8, 2, 0]]],
	[["CMP", "CMPI"], ["L"], ["IMM", "DR"],                     [[14, 3, 0]]],
	[["CMP", "CMPI"], ["L"], ["IMM", M],                        [[12, 3, 0]]],
	//----------------------------------------------------------------------------------------------------------------
	[["EOR", "EORI"], ["B", "W"], ["IMM", "DR"],                [[8, 2, 0]]],
	[["EOR", "EORI"], ["B", "W"], ["IMM", M],                   [[12, 2, 1]]],
	[["EOR", "EORI"], ["L"], ["IMM", "DR"],                     [[16, 3, 0]]],
	[["EOR", "EORI"], ["L"], ["IMM", M],                        [[20, 3, 2]]],
	//----------------------------------------------------------------------------------------------------------------
	[["MOVEQ"], ["L"], ["IMM", "DR"],                           [[4, 1, 0]]],

	//----------------------------------------------------------------------------------------------------------------
	// SINGLE OPERAND INSTRUCTION EXECUTION TIMES:               Taken      Not taken:
	//----------------------------------------------------------------------------------------------------------------
	[["CLR", "NOT", "NEG"], ["B", "W"], ["DR"],                 [[4, 1, 0]]],
	[["CLR", "NOT", "NEG"], ["B", "W"], [M],                    [[8, 1, 1]]],
	[["CLR", "NOT", "NEG"], ["L"], ["DR"],                      [[6, 1, 0]]],
	[["CLR", "NOT", "NEG"], ["L"], [M],                         [[12, 1, 2]]],
	//----------------------------------------------------------------------------------------------------------------
	[["NBCD"], ["B"], ["DR"],                                   [[6, 1, 0]]],
	[["NBCD"], ["B"], [M],                                      [[8, 1, 1]]],
	//----------------------------------------------------------------------------------------------------------------
	[["NEGX"], ["B", "W"], ["DR"],                              [[4, 1, 0]]],
	[["NEGX"], ["B", "W"], [M],                                 [[8, 1, 1]]],
	[["NEGX"], ["L"], ["DR"],                                   [[6, 1, 0]]],
	[["NEGX"], ["L"], [M],                                      [[12, 1, 2]]],
	//----------------------------------------------------------------------------------------------------------------
	[["SCC"], ["B"], ["DR"],                                    [[4, 1, 0], [6, 1, 0]]],
	[["SCC"], ["B"], [M],                                       [[8, 1, 1], [8, 1, 1]]],
	//----------------------------------------------------------------------------------------------------------------
	[["TAS"], ["B"], ["DR"],                                    [[4, 1, 0]]],
	[["TAS"], ["B"], [M],                                       [[10, 1, 1]]],
	//----------------------------------------------------------------------------------------------------------------
	[["TST"], ["B", "W", "L"], ["DR"],                          [[4, 1, 0]]],
	[["TST"], ["B", "W", "L"], [M],                             [[4, 1, 0]]],

	//----------------------------------------------------------------------------------------------------------------
	// SHIFT/ROTATE INSTRUCTION EXECUTION TIMES:
	//----------------------------------------------------------------------------------------------------------------
	[SHIFT, ["B", "W"], ["IMM", "DR"],                          [[6, 1, 0]], [2, 0, 0]],
	[SHIFT, ["B", "W"], ["IMM", M],                             [[8, 1, 1]], [2, 0, 0]],
	[SHIFT, ["B", "W"], ["DR", "DR"],                           [[6, 1, 0]], [2, 0, 0]],
	[SHIFT, ["B", "W"], ["DR", M],                              [[8, 1, 1]], [2, 0, 0]],
	[SHIFT, ["B", "W"], ["DR"],                                 [[8, 1, 0]]],
	[SHIFT, ["B", "W"], [M],                                    [[8, 1, 1]]],
	[SHIFT, ["L"], ["IMM", "DR"],                               [[8, 1, 0]], [2, 0, 0]],
	[SHIFT, ["L"], ["DR"],                                      [[10, 1, 0]],],
	[SHIFT, ["L"], ["DR", "DR"],                                [[8, 1, 0]], [2, 0, 0]],

	//----------------------------------------------------------------------------------------------------------------
	// BIT MANIPULATION INSTRUCTION EXECUTION TIMES:
	//----------------------------------------------------------------------------------------------------------------
	[["BCHG", "BSET", "BCLR"], ["B"], ["DR", M],           [[8, 1, 1]]],
	[["BCHG", "BSET", "BCLR"], ["B"], ["IMM", M],          [[12, 2, 1]]],
	[["BCHG", "BSET"], ["L"], ["DR", "DR"],                [[6, 1, 0], [8, 1, 0]]],
	[["BCHG", "BSET"], ["L"], ["IMM", "DR"],               [[12, 2, 0]]],
	[["BCLR"], ["L"], ["DR", "DR"],                        [[8, 1, 0], [10, 1, 0]]],
	[["BCLR"], ["L"], ["IMM", "DR"],                       [[14, 2, 0]]],
	//----------------------------------------------------------------------------------------------------------------
	[["BTST"], ["B"], ["DR", M],                           [[4, 1, 0]]],
	[["BTST"], ["B"], ["IMM", M],                          [[8, 2, 0]]],
	[["BTST"], ["B"], ["DR", "IMM"],                       [[10, 2, 0]]],
	[["BTST"], ["L"], ["DR", "DR"],                        [[6, 1, 0]]],
	[["BTST"], ["L"], ["IMM", "DR"],                       [[10, 2, 0]]],

	//----------------------------------------------------------------------------------------------------------------
	// CONDITIONAL INSTRUCTION EXECUTION TIMES:                  Taken:      Not taken:  Expired:
	//----------------------------------------------------------------------------------------------------------------
	[["BCC"], ["B"], ["PCDISP"],                                [[10, 2, 0], [8, 1, 0]]],
	[["BCC"], ["W"], ["PCDISP"],                                [[10, 2, 0], [12, 2, 0]]],
	//----------------------------------------------------------------------------------------------------------------
	[["BRA"], ["B", "W"], ["PCDISP"],                           [[10, 2, 0]]],
	[["BSR"], ["B", "W"], ["PCDISP"],                           [[18, 2, 2]]],
	//----------------------------------------------------------------------------------------------------------------
	[["DBCC"], ["W"], ["DR", "PCDISP"],                         [[10, 2, 0], [12, 2, 0], [14, 3, 0]]],

	//----------------------------------------------------------------------------------------------------------------
	// JMP, JSR, LEA, PEA, AND MOVEM INSTRUCTION EXECUTION TIMES:
	//----------------------------------------------------------------------------------------------------------------
	[["JMP"], [null], ["ARIND"],                                [[8, 2, 0]]],
	[["JMP"], [null], ["ARDISP"],                               [[10, 2, 0]]],
	[["JMP"], [null], ["ARDISPIX"],                             [[14, 2, 0]]],
	[["JMP"], [null], ["ABS16"],                                [[10, 2, 0]]],
	[["JMP"], [null], ["ABS32"],                                [[12, 3, 0]]],
	[["JMP"], [null], ["PCDISP"],                               [[10, 2, 0]]],
	[["JMP"], [null], ["PCDISPIX"],                             [[14, 2, 0]]],
	//----------------------------------------------------------------------------------------------------------------
	[["JSR"], [null], ["ARIND"],                                [[16, 2, 2]]],
	[["JSR"], [null], ["ARDISP"],                               [[18, 2, 2]]],
	[["JSR"], [null], ["ARDISPIX"],                             [[22, 2, 2]]],
	[["JSR"], [null], ["ABS16"],                                [[18, 2, 2]]],
	[["JSR"], [null], ["ABS32"],                                [[20, 3, 2]]],
	[["JSR"], [null], ["PCDISP"],                               [[18, 2, 2]]],
	[["JSR"], [null], ["PCDISPIX"],                             [[22, 2, 2]]],
	//----------------------------------------------------------------------------------------------------------------
	[["LEA"], ["L"], ["ARIND", "AR"],                           [[4, 1, 0]]],
	[["LEA"], ["L"], ["ARDISP", "AR"],                          [[8, 2, 0]]],
	[["LEA"], ["L"], ["ARDISPIX", "AR"],                        [[12, 2, 0]]],
	[["LEA"], ["L"], ["ABS16", "AR"],                           [[8, 2, 0]]],
	[["LEA"], ["L"], ["ABS32", "AR"],                           [[12, 3, 0]]],
	[["LEA"], ["L"], ["PCDISP", "AR"],                          [[8, 2, 0]]],
	[["LEA"], ["L"], ["PCDISPIX", "AR"],                        [[12, 2, 0]]],
	//----------------------------------------------------------------------------------------------------------------
	[["PEA"], ["L"], ["ARIND"],                                 [[12, 1, 2]]],
	[["PEA"], ["L"], ["ARDISP"],                                [[16, 2, 2]]],
	[["PEA"], ["L"], ["ARDISPIX"],                              [[20, 2, 2]]],
	[["PEA"], ["L"], ["ABS16"],                                 [[16, 2, 2]]],
	[["PEA"], ["L"], ["ABS32"],                                 [[20, 3, 2]]],
	[["PEA"], ["L"], ["PCDISP"],                                [[16, 2, 2]]],
	[["PEA"], ["L"], ["PCDISPIX"],                              [[20, 2, 2]]],
	// M => R --------------------------------------------------------------------------------------------------------
	[["MOVEM"], ["W"], ["ARIND", "REGLIST"],                    [[12, 3, 0]], [4, 1, 0]],
	[["MOVEM"], ["W"], ["ARINC", "REGLIST"],                    [[12, 3, 0]], [4, 1, 0]],
	[["MOVEM"], ["W"], ["ARDISP", "REGLIST"],                   [[16, 4, 0]], [4, 1, 0]],
	[["MOVEM"], ["W"], ["ARDISPIX", "REGLIST"],                 [[18, 4, 0]], [4, 1, 0]],
	[["MOVEM"], ["W"], ["ABS16", "REGLIST"],                    [[16, 4, 0]], [4, 1, 0]],
	[["MOVEM"], ["W"], ["ABS32", "REGLIST"],                    [[20, 5, 0]], [4, 1, 0]],
	[["MOVEM"], ["W"], ["PCDISP", "REGLIST"],                   [[16, 4, 0]], [4, 1, 0]],
	[["MOVEM"], ["W"], ["PCDISPIX", "REGLIST"],                 [[18, 4, 0]], [4, 1, 0]],
	[["MOVEM"], ["L"], ["ARIND", "REGLIST"],                    [[12, 3, 0]], [8, 2, 0]],
	[["MOVEM"], ["L"], ["ARINC", "REGLIST"],                    [[12, 3, 0]], [8, 2, 0]],
	[["MOVEM"], ["L"], ["ARDISP", "REGLIST"],                   [[16, 4, 0]], [8, 2, 0]],
	[["MOVEM"], ["L"], ["ARDISPIX", "REGLIST"],                 [[18, 4, 0]], [8, 2, 0]],
	[["MOVEM"], ["L"], ["ABS16", "REGLIST"],                    [[16, 4, 0]], [8, 2, 0]],
	[["MOVEM"], ["L"], ["ABS32", "REGLIST"],                    [[20, 5, 0]], [8, 2, 0]],
	[["MOVEM"], ["L"], ["PCDISP", "REGLIST"],                   [[16, 4, 0]], [8, 2, 0]],
	[["MOVEM"], ["L"], ["PCDISPIX", "REGLIST"],                 [[18, 4, 0]], [8, 2, 0]],
	// R => M --------------------------------------------------------------------------------------------------------
	[["MOVEM"], ["W"], ["REGLIST", "ARIND"],                    [[8, 2, 0]],  [4, 0, 1]],
	[["MOVEM"], ["W"], ["REGLIST", "ARDEC"],                    [[8, 2, 0]],  [4, 0, 1]],
	[["MOVEM"], ["W"], ["REGLIST", "ARDISP"],                   [[12, 3, 0]], [4, 0, 1]],
	[["MOVEM"], ["W"], ["REGLIST", "ARDISPIX"],                 [[14, 3, 0]], [4, 0, 1]],
	[["MOVEM"], ["W"], ["REGLIST", "ABS16"],                    [[12, 3, 0]], [4, 0, 1]],
	[["MOVEM"], ["W"], ["REGLIST", "ABS32"],                    [[16, 4, 0]], [4, 0, 1]],
	[["MOVEM"], ["L"], ["REGLIST", "ARIND"],                    [[8, 2, 0]],  [8, 0, 2]],
	[["MOVEM"], ["L"], ["REGLIST", "ARDEC"],                    [[8, 2, 0]],  [8, 0, 2]],
	[["MOVEM"], ["L"], ["REGLIST", "ARDISP"],                   [[12, 3, 0]], [8, 0, 2]],
	[["MOVEM"], ["L"], ["REGLIST", "ARDISPIX"],                 [[14, 3, 0]], [8, 0, 2]],
	[["MOVEM"], ["L"], ["REGLIST", "ABS16"],                    [[12, 3, 0]], [8, 0, 2]],
	[["MOVEM"], ["L"], ["REGLIST", "ABS32"],                    [[16, 4, 0]], [8, 0, 2]],

	//----------------------------------------------------------------------------------------------------------------
	// MULTIPRECISION INSTRUCTION EXECUTION TIMES:
	//----------------------------------------------------------------------------------------------------------------
	[["ADDX", "SUBX"], ["B", "W"], ["DR", "DR"],                [[4, 1, 0]]],
	[["ADDX", "SUBX"], ["B", "W"], ["ARDEC", "ARDEC"],          [[18, 3, 1]]],
	[["ADDX", "SUBX"], ["L"], ["DR", "DR"],                     [[8, 1, 0]]],
	[["ADDX", "SUBX"], ["L"], ["ARDEC", "ARDEC"],               [[30, 5, 2]]],
	//----------------------------------------------------------------------------------------------------------------
	[["CMPM"], ["B", "W"], ["ARINC", "ARINC"],                  [[12, 3, 0]]],
	[["CMPM"], ["L"], ["ARINC", "ARINC"],                       [[20, 5, 0]]],
	//----------------------------------------------------------------------------------------------------------------
	[["ABCD", "SBCD"], ["B"], ["DR", "DR"],                     [[6, 1, 0]]],
	[["ABCD", "SBCD"], ["B"], ["ARDEC", "ARDEC"],               [[18, 3, 1]]],

	//----------------------------------------------------------------------------------------------------------------
	// MISCELLANEOUS INSTRUCTION EXECUTION TIMES:                No trap:     Trap >:     Trap <:
	//----------------------------------------------------------------------------------------------------------------
	[["CHK"], ["W", "L"], [EA, "DR"],                           [[10, 1, 0], [38, 5, 3], [40, 5, 3]]],

	[["EXG"], ["L"], ["DR", "DR"],                              [[6, 1, 0]]],
	[["EXG"], ["L"], ["DR", "AR"],                              [[6, 1, 0]]],
	[["EXG"], ["L"], ["AR", "DR"],                              [[6, 1, 0]]],
	[["EXG"], ["L"], ["AR", "AR"],                              [[6, 1, 0]]],
	[["EXTW"], ["W"], ["DR"],                                   [[4, 1, 0]]],
	[["EXTL"], ["L"], ["DR"],                                   [[4, 1, 0]]],
	[["LINK"], ["W", "L"], ["AR", "IMM"],                       [[16, 2, 2]]],
	[["NOP"], [null], [],                                       [[4, 1, 0]]],
	[["RESET"], [null], [],                                     [[132, 1, 0]]],
	[["RTE"], [null], [],                                       [[20, 5, 0]]],
	[["RTR"], [null], [],                                       [[20, 5, 0]]],
	[["RTS"], [null], [],                                       [[16, 4, 0]]],
	[["STOP"], [null], ["IMM"],                                 [[4, 1, 0]]],
	[["SWAP"], [null], ["DR"],                                  [[4, 1, 0]]],
	[["TRAP"], [null], ["IMM"],                                 [[34, 4, 3]]],
	[["TRAPV"], [null], [],                                     [[4, 1, 0], [34, 5, 3]]],
	[["UNLK"], [null], ["AR"],                                  [[12, 3, 0]]],
	[["ILLEGAL"], [null], [],                                   [[34, 4, 3]]],

	//----------------------------------------------------------------------------------------------------------------
	// Special registers
	//----------------------------------------------------------------------------------------------------------------
	[LOGICAL_TO_SPECIAL, ["B", "W"], ["IMM"],                   [[20, 3, 0]]],
	[["MOVEFROMSR"], ["W"], [EA],                               [[6, 1, 0]]],
	[["MOVETOSR", "MOVETOCCR"], ["W"], [EA],                    [[12, 1, 0]]],
	[["MOVEFROMUSP", "MOVETOUSP"], ["L"], ["AR"],               [[4, 1, 0]]],

	//----------------------------------------------------------------------------------------------------------------
	// Move Peripheral Instruction Execution Times
	//----------------------------------------------------------------------------------------------------------------
	[["MOVEP"], ["W"], ["DR", "ARDISP"],                        [[16, 2, 2]]],
	[["MOVEP"], ["W"], ["ARDISP", "DR"],                        [[16, 4, 0]]],
	[["MOVEP"], ["L"], ["DR", "ARDISP"],                        [[24, 2, 4]]],
	[["MOVEP"], ["L"], ["ARDISP", "DR"],                        [[24, 6, 0]]],
];

// Additional timings for effective Address Calculation Times:
// prettier-ignore
export const lookupTimes: Record<string, [Timing, Timing]> = {
	//             B/W         L
	// Register:
	["DR"]:       [[0, 0, 0],  [0, 0, 0]],
	["AR"]:       [[0, 0, 0],  [0, 0, 0]],
	// Memory:
	["ARIND"]:    [[4, 1, 0],  [8, 2, 0]],
	["ARINC"]:    [[4, 1, 0],  [8, 2, 0]],
	["ARDEC"]:    [[6, 1, 0],  [10, 2, 0]],
	["ARDISP"]:   [[8, 2, 0],  [12, 3, 0]],
	["ARDISPIX"]: [[10, 2, 0], [14, 3, 0]],
	["ABS16"]:    [[8, 2, 0],  [12, 3, 0]],
	["ABS32"]:    [[12, 3, 0], [16, 4, 0]],
	["PCDISP"]:   [[8, 2, 0],  [12, 3, 0]],
	["PCDISPIX"]: [[10, 2, 0], [14, 3, 0]],
	// Immediate:
	["IMM"]:      [[4, 1, 0],  [8, 2, 0]],
};

export function formatTimingTable(timings: InstructionTiming): string {
	let markdown = "";
	if (timings.labels.length) {
		markdown += "| | Clock | Read | Write |\n";
		markdown += "|-|:-----:|:----:|:-----:|\n";
		for (let i = 0; i < timings.labels.length; i++) {
			const label = timings.labels[i];
			const [c, r, w] = timings.values[i];
			markdown += `|**${label}**| ${c} | ${r} | ${w} |\n`;
		}
	} else {
		const [c, r, w] = timings.values[0];
		markdown += "| Clock | Read | Write |\n";
		markdown += "|:-----:|:----:|:-----:|\n";
		markdown += `| ${c} | ${r} | ${w} |\n`;
	}
	return markdown;
}