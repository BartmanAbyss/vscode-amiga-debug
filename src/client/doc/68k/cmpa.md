# CMPA - Compare address

## Operation
[destination] - [source]

## Syntax
```assembly
CMPA <ea>,An
```
## Sample syntax
```assembly
CMPA.L #$1000,A4
CMPA.W (A2)+,A6
CMPA.L D5,A2
```

## Attributes
`Size` word, longword

## Description
Subtract the source operand from the destination address register and set the condition codes accordingly. The address register is not modified. The size of the operation may be specified as word or longword. Word length operands are sign-extended to 32 bits before the comparison is carried out.

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|-|*|*|*|*|

## Source operand addressing modes
|Dn|An|(An)|(An)+|-(An)|(d,An)|(d,An,Xi)|ABS.W|ABS.L|(d,PC)|(d,PC,Xn)|imm|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|✓|✓|✓|✓|✓|✓|✓|✓|✓|✓|✓|✓|

*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*