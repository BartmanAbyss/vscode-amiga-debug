# EOR - Exclusive-OR logical

## Operation
[destination] ← [source] ⊕ [destination]

## Syntax
```assembly
EOR Dn,<ea>
```
## Sample syntax
```assembly
EOR D3,-(A3)
```

## Attributes
`Size` byte, word, longword.

## Description
EOR (exclusive or) the source operand with the destination operand and store the result in the destination location Note that the source operand must be a data register and that the operation `EOR <ea>,Dn` is not permitted.

## Application
The EOR instruction is used to *toggle* (i.e., change the state of) selected bits in the operand. For example, if [D0] = 00001111, and [D1] = 10101010, the operation `EOR.B D0,D1` toggles bits 0 to 3 of D1 and results in [D1] = 10100101.

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|-|*|*|0|0|

## Destination operand addressing modes
|Dn|An|(An)|(An)+|&#x2011;(An)|(d,An)|(d,An,Xi)|ABS.W|ABS.L|(d,PC)|(d,PC,Xn)|imm|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|✓||✓|✓|✓|✓|✓|✓|✓||||

*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*