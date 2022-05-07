# SUBX - Subtract extended

## Operation
[destination] ← [destination] - [source] - [X]

## Syntax
```assembly
SUBX Dx,Dy
SUBX -(Ax),-(Ay)
```

## Attributes
`Size` byte, word, longword

## Description
Subtract the source operand from the destination operand along with the extend bit, and store the result in the destination location. The only legal addressing modes are data register direct and memory to memory with address register indirect using auto-decrementing.

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|*|*|*|*|*|

Z: Cleared if the result is non-zero, unchanged otherwise. The Z-bit can be used to test for zero after a chain of multiple precision operations.

*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*