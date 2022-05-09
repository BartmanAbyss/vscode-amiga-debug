# CMPI - Compare immediate

## Operation
[destination] - \<immediate data\>

## Syntax
```assembly
CMPI #<data>,<ea>
```

## Attributes
`Size` byte, word, longword

## Description
Subtract the immediate data from the destination operand and set the condition codes accordingly - the destination is not modified. `CMPI` permits the comparison of a literal with memory.

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|-|*|*|*|*|

## Destination operand addressing modes
|Dn|An|(An)|(An)+|-(An)|(d,An)|(d,An,Xi)|ABS.W|ABS.L|(d,PC)|(d,PC,Xn)|imm|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|✓||✓|✓|✓|✓|✓|✓|✓|✓|✓||

*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*