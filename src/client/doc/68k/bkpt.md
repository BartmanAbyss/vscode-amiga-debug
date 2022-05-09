# BKPT - Breakpoint

## Operation 
Run Breakpoint Acknowledge Cycle; TRAP As Illegal Instruction

## Syntax
```assembly
BKPT #<data>
```

## Attributes
Unsized

## Description
For the MC68010, a breakpoint acknowledge bus cycle is run with function codes driven high and zeros on all address
lines. Whether the breakpoint acknowledge bus cycle is terminated with DTACK, BERR, or VPA, the processor always takes
an illegal instruction exception. During exception processing, a debug monitor can distinguish different software
breakpoints by decoding the field in the BKPT instruction.

For the MC68000 and MC68008, the breakpoint cycle is not run, but an illegal instruction exception is taken.

For the MC68020, MC68030, and CPU32, a breakpoint acknowledge bus cycle is executed with the immediate data
(value 0 –7) on bits 2 – 4 of the address bus and zeros on bits 0 and 1 of the address bus. The breakpoint acknowledge
bus cycle accesses the CPU space, addressing type 0, and provides the breakpoint number specified by the instruction on
address lines A2 – A4. If the external hardware terminates the cycle with DSACKx or STERM, the data on the bus (an
instruction word) is inserted into the instruction pipe and is executed after the breakpoint instruction. The breakpoint
instruction requires a word to be transferred so, if the first bus cycle accesses an 8- bit port, a second bus cycle is
required. If the external logic terminates the breakpoint acknowl- edge bus cycle with BERR (i.e., no instruction word
available), the processor takes an illegal instruction exception.

For the MC68040, this instruction executes a breakpoint acknowledge bus cycle. Regardless of the cycle termination, the
MC68040 takes an illegal instruction exception.

For more information on the breakpoint instruction refer to the appropriate user’s manual on bus operation.

This instruction supports breakpoints for debug monitors and real-time hardware emulators.

## Condition Codes
Not affected.

*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*