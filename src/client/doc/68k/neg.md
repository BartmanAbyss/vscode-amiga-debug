# NEG - Negate

## Operation
[destination] ← 0 - [destination]

## Syntax
```assembly
NEG <ea>
```

## Attributes
`Size`  byte, word, longword

## Description
Subtract the destination operand from 0 and store the result in the destination location. The difference between `NOT` and `NEG` instructions is that NOT performs a bit-by-bit logical complementation, while a `NEG` performs a two's complement arithmetic subtraction. All bits of the condition code register are modified by a `NEG` operation. For example, if D3.B = 11100111<sub>2</sub>, the logical operation `NEG.B D3` results in D3 = 00011001<sub>2</sub> (XNZVC=10001) and `NOT.B D3`= 00011000<sub>2</sub> (XNZVC=-0000).

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|*|*|*|*|*|

Note that the X-bit is set to the value of the C-bit.

## Destination operand addressing modes
|Dn|An|(An)|(An)+|&#x2011;(An)|(d,An)|(d,An,Xi)|ABS.W|ABS.L|(d,PC)|(d,PC,Xn)|imm|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|✓||✓|✓|✓|✓|✓|✓|✓||||

*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*