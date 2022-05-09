# MULS, MULU - Signed multiply, unsigned multiply

## Operation
[destination] ← [destination] * [source]

## Syntax
```assembly
MULS <ea>,Dn
MULU <ea>,Dn
```

## Attributes
`Size`  word (the product is a longword)

## Description
Multiply the 16-bit destination operand by the 16-bit source
operand and store the result in the destination. Both the source and destination are 16-bit word values and the destination result is a 32-bit longword. The product is therefore a correct product and is not truncated. `MULU` performs multiplication with unsigned values and `MULS` performs multiplication with two's complement values.

## Application
`MULU D1,D2` multiplies the low-order words of data registers D1 and D2 and puts the 32-bit result in D2. `MULU #$1234,D3` multiplies the low-order word of D3 by the 16-bit literal $1234 and puts the 32-bit result in D3.

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|-|*|*|0|0|

## Source operand addressing modes
|Dn|An|(An)|(An)+|-(An)|(d,An)|(d,An,Xi)|ABS.W|ABS.L|(d,PC)|(d,PC,Xn)|imm|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|✓||✓|✓|✓|✓|✓|✓|✓|✓|✓|✓|

*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*