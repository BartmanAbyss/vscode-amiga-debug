# STOP - Load status register and stop

## Operation
IF [S] = 1 THEN<br/>
&nbsp;&nbsp;&nbsp;&nbsp;[SR] ← \<data\><br/>
&nbsp;&nbsp;&nbsp;&nbsp;STOP<br/>
&nbsp;&nbsp;ELSE TRAP

## Syntax
```assembly
STOP #<data>
```

## Sample syntax
```assembly
STOP #$2700
STOP #SetUp
```

## Attributes
Unsized

## Description
The immediate operand is copied into the entire status register (i.e., both status byte and *CCR* are modified), and the program counter advanced to point to the next instruction to be executed. The processor then suspends all further processing and halts. That is, the privileged `STOP` instruction stops the 68000.

The execution of instructions resumes when a trace, an interrupt, or a reset exception occurs. A trace exception will occur if the trace bit is set when the `STOP` instruction is encountered. If an interrupt request arrives whose priority is higher than the current processor priority, an interrupt exception occurs, otherwise the interrupt request has no effect. If the bit of the immediate data corresponding to the S-bit is clear (i.e., user mode selected), execution of the `STOP` instruction will cause a privilege violation. An external reset will always initiate reset exception processing.

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|*|*|*|*|*|

Set according to the literal.

*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*