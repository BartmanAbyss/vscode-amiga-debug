# OR - OR logical

## Operation
[destination] ← [source] + [destination]

## Syntax
```assembly
OR <ea>,Dn
OR Dn,<ea>
```

## Attributes
`Size`  byte, word, longword

## Description
OR the source operand to the destination operand, and store the result in the destination location.

## Application
The `OR` instruction is used to set selected bits of the operand. For example, we can set the four most-significant bits of a longword operand in D0 by executing:

```
OR.L #$F0000000,D0
```

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|-|*|*|0|0|

## Source operand addressing modes
|Dn|An|(An)|(An)+|&#x2011;(An)|(d,An)|(d,An,Xi)|ABS.W|ABS.L|(d,PC)|(d,PC,Xn)|imm|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|✓||✓|✓|✓|✓|✓|✓|✓|✓|✓|✓|

## Destination operand addressing modes
|Dn|An|(An)|(An)+|&#x2011;(An)|(d,An)|(d,An,Xi)|ABS.W|ABS.L|(d,PC)|(d,PC,Xn)|imm|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|✓||✓|✓|✓|✓|✓|✓|✓||||

*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*