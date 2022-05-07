# SBCD - Subtract decimal with extend

## Operation
[destination]<sub>10</sub> ← [destination]<sub>10</sub> - [source]<sub>10</sub> - [X]

## Syntax
```assembly
SBCD Dy,Dx
SBCD -(Ay),-(Ax)
```

## Attributes
`Size` byte

## Description
Subtract the source operand from the destination operand together with the X-bit, and store the result in the destination. Subtraction is performed using BCD arithmetic. The only legal addressing modes are data register direct and memory to memory with address register indirect using auto-decrementing.

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|*|U|*|U|*|

Z: Cleared if result is non-zero. Unchanged otherwise. The Z-bit can be used to test for zero after a chain of multiple precision operations.

*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*