# MOVEA - Move address

## Operation
[An] ← [source]

## Syntax
```assembly
MOVEA <ea>,An
```

## Attributes
`Size` word, longword

## Description
Move the contents of the source to the destination location. The destination is an address register. The source must be a word or longword. If it is a word, it is sign-extended to a longword. The condition codes are not affected.

## Application
The `MOVEA` instruction is used to load an address register (some assemblers simply employ the `MOVE` mnemonic for both `MOVE` and `MOVEA`). Note that the instruction `LEA` can often be used to perform the same operation (e.g., `MOVEA.L #$1234,A0` is the same as `LEA $1234,A0`).

Take care because the `MOVEA.W #$8000,A0` instruction sign-extends the source operand to $FFFF8000 before loading it into A0, whereas `LEA $8000,A0` loads A0 with $00008000.

You should appreciate that the `MOVEA` and `LEA` instructions are not interchangeable. The operation `MOVEA (Ai),An` cannot be implemented by an `LEA` instruction, since `MOVEA (Ai),An` performs a memory access to obtain the source operand, as the following RTL demonstrates.

```
LEA (Ai),An = [An] ← [Ai]
MOVEA (Ai),An = [An] ← [M([Ai])]
```

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|-|-|-|-|-|

## Source operand addressing modes
|Dn|An|(An)|(An)+|&#x2011;(An)|(d,An)|(d,An,Xi)|ABS.W|ABS.L|(d,PC)|(d,PC,Xn)|imm|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|✓|✓|✓|✓|✓|✓|✓|✓|✓|✓|✓|✓|

*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*