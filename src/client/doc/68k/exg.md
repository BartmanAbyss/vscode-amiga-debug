# EXG - Exchange registers

## Operation
[Rx] ← [Ry]; [Ry] ← [Rx]

## Syntax
```assembly
EXG Rx,Ry
```
## Sample syntax
```assembly
EXG D3,D4
EXG D2,A0
EXG A7,D5
```

## Attributes
`Size` longword

## Description
Exchange the contents of two registers. The size of the instruction is a longword because the entire 32-bit contents of two registers are exchanged. The instruction permits the exchange of address registers, data registers, and address and data registers.

## Application
One application of `EXG` is to load an address into a data register and then process it using instructions that act on data registers. Then the reverse operation can be used to return the result to the address register. Doing this preserves the original contents of the data register.

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|-|-|-|-|-|

*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*