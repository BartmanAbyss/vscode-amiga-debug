# MOVEQ - Move quick (copy a small literal to a destination)

## Operation
[destination] ← \<literal\>

## Syntax
```assembly
MOVEQ #<data>,Dn
```

## Attributes
`Size`  longword

## Description
Move the specified literal to a data register. The literal data is an eight-bit field within the `MOVEQ` op-code and specifies a signed value in the range -128 to +127. When the source operand is transferred, it is sign-extended to 32 bits. Consequently, although only 8 bits are moved, the `MOVEQ` instruction is a *longword* operation.

## Application
`MOVEQ` is used to load small integers into a data register. Beware of its sign-extension. The two operations `MOVE.B #12,D0` and `MOVEQ #12,D0` are not equivalent. The former has the effect [D0(0:7)] ← 12, while the latter has the effect [D0(0:31)] ← 12 (with sign-extension).

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|-|*|*|0|0|

*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*