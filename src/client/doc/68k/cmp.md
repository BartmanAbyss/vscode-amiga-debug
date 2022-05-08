# CMP - Compare

## Operation
[destination] - [source]

## Syntax
```assembly
CMP <ea>,Dn
```
## Sample syntax
```assembly
CMP (Test,A6,D3.W),D2
```

## Attributes
`Size` byte, word, longword

## Description
Subtract the source operand from the destination operand and set the condition codes accordingly. The destination must be a data register. The destination is not modified by this instruction.

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|-|*|*|*|*|

## Source operand addressing modes
|Dn|An|(An)|(An)+|-(An)|(d,An)|(d,An,Xi)|ABS.W|ABS.L|(d,PC)|(d,PC,Xn)|imm|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|✓|✓|✓|✓|✓|✓|✓|✓|✓|✓|✓|✓|

*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*