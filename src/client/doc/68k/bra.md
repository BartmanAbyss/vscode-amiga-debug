# BRA - Branch always

## Operation
[PC] ← [PC] + d

## Syntax
```assembly
BRA <label>
BRA <literal>
```

## Attributes
`Size` byte, word

## Description
Program execution continues at location [PC] + d. The displacement, d, is a two's complement value (8 bits for a short branch and 16 bits for a long branch). The value in the PC corresponds to the current location plus two. Note that a short branch to the next instruction is impossible, since the branch code 0 is used to indicate a long branch with a 16-bit offset.

## Application
A `BRA` is an unconditional relative jump (or goto). You use a `BRA` instruction to write position independent code, because the destination address (*branch target address*) is specified with respect to the current value of the PC. A `JMP` instruction does not produce position independent code.


## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|-|-|-|-|-|

*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*