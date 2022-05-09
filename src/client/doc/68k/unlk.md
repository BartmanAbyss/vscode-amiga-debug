# UNLK - Unlink

## Operation
[SP] ← [An]; [An] ← [M([SP])]; [SP] ← [SP] + 4

## Syntax
```assembly
UNLK An
```

## Attributes
Unsized

## Description
The stack pointer is loaded from the specified address register and the old contents of the stack pointer are lost (this has the effect of collapsing the stack frame). The address register is then loaded with the longword pulled off the stack.

## Application
The `UNLK` instruction is used in conjunction with the `LINK` instruction. The `LINK` creates a stack frame at the start of a procedure, and the `UNLK` collapses the stack frame prior to a return from the procedure.

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|-|-|-|-|-|

*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*