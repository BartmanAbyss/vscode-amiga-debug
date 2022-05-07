# SUBQ - Subtract quick

## Operation
[destination] ← [destination] - \<literal\>

## Syntax
```assembly
SUBQ #<data>,<ea>
```

## Attributes
`Size`  byte, word, longword

## Description
Subtract the immediate data from the destination operand. The immediate data must be in the range 1 to 8. Word and longword operations on address registers do not affect condition codes. A word operation on an address register affects the entire 32-bit address.

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|*|*|*|*|*|

## Destination operand addressing modes
|Dn|An|(An)|(An)+|&#x2011;(An)|(d,An)|(d,An,Xi)|ABS.W|ABS.L|(d,PC)|(d,PC,Xn)|imm|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|✓|✓|✓|✓|✓|✓|✓|✓|✓||||

*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*