# TST - Test an operand

## Operation
[CCR] ← tested([operand])<br/>
***i.e.,*** [operand] - 0; update CCR

## Syntax
```assembly
TST <ea>
```

## Attributes
`Size` byte, word, longword

## Description
The operand is compared with zero. No result is saved, but the contents of the *CCR* are set according to the result. The effect of `TST <ea>` is the same as `CMPI #0,<ea>` except that the `CMPI` instruction also sets/clears the V- and C-bits of the *CCR*.


## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|-|*|*|0|0|

## Source operand addressing modes
|Dn|An|(An)|(An)+|&#x2011;(An)|(d,An)|(d,An,Xi)|ABS.W|ABS.L|(d,PC)|(d,PC,Xn)|imm|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|✓||✓|✓|✓|✓|✓|✓|✓|✓|✓||

*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*