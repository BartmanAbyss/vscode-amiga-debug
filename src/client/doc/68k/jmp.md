# JMP - Jump (unconditionally)

## Operation
[PC] ← destination

## Syntax
```assembly
JMP <ea>
```
## Attributes
Unsized

## Description
Program execution continues at the effective address specified by the instruction.

## Application
Apart from a simple unconditional jump to an address fixed at compile time (i.e., `JMP label`), the `JMP` instruction is useful for the calculation of *dynamic* or *computed* jumps. For example, the instruction `JMP (A0,D0.L)` jumps to the location pointed at by the contents of address register A0, offset by the contents of data register D0. Note that `JMP` provides several addressing modes, while `BRA` provides a single addressing mode (i.e., PC relative).

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|-|-|-|-|-|

## Source operand addressing modes
|Dn|An|(An)|(An)+|-(An)|(d,An)|(d,An,Xi)|ABS.W|ABS.L|(d,PC)|(d,PC,Xn)|imm|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|||✓|||✓|✓|✓|✓|✓|✓||

*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*