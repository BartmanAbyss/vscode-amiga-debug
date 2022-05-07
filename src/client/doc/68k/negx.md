# NEGX - Negate with extend

## Operation
[destination] ← 0 - [destination] - [X]

## Syntax
```assembly
NEGX <ea>
```

## Attributes
`Size`  byte, word, longword

## Description
The operand addressed as the destination and the extend bit are subtracted from zero. `NEGX` is the same as `NEG` except that the X-bit is also subtracted from zero.

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|*|*|*|*|*|

The Z-bit is cleared if the result is non-zero and is unchanged otherwise. The X-bit is set to the same value as the C-bit.

## Destination operand addressing modes
|Dn|An|(An)|(An)+|&#x2011;(An)|(d,An)|(d,An,Xi)|ABS.W|ABS.L|(d,PC)|(d,PC,Xn)|imm|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|✓||✓|✓|✓|✓|✓|✓|✓||||

*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*