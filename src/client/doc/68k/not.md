# NOT - Logical complement

## Operation
[destination] ← [destination]

## Syntax
```assembly
NOT <ea>
```

## Attributes
`Size`  byte, word, longword

## Description
Calculate the logical complement of the destination and store the result in the destination. The difference between `NOT` and `NEG` is that `NOT` performs a bit-by-bit logical complementation, while a `NEG` performs a two's complement arithmetic subtraction. Moreover, `NEG` updates all bits of the CCR, while `NOT` clears the V- and C-bits, updates the N- and Z-bits, and doesn't affect the X-bit.

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|-|*|*|0|0|

## Source operand addressing modes
|Dn|An|(An)|(An)+|&#x2011;(An)|(d,An)|(d,An,Xi)|ABS.W|ABS.L|(d,PC)|(d,PC,Xn)|imm|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|✓||✓|✓|✓|✓|✓|✓|✓||||

*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*