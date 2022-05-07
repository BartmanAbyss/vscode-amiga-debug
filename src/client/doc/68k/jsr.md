# JSR - Jump to subroutine

## Operation
[SP] ← [SP] - 4; [M([SP])] ← [PC]<br/>
[PC] ← destination

## Syntax
```assembly
JSR <ea>
```

## Attributes
Unsized

## Description
`JSR` pushes the longword address of the instruction immediately following the `JSR` onto the system stack. Program execution then continues at the address specified in the instruction.

## Application
`JSR (Ai)` calls the procedure pointed at by address register Ai. The instruction `JSR (Ai,Dj)` calls the procedure at the location [Ai] + [Dj] which permits dynamically computed addresses.

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|-|-|-|-|-|

## Source operand addressing modes
|Dn|An|(An)|(An)+|&#x2011;(An)|(d,An)|(d,An,Xi)|ABS.W|ABS.L|(d,PC)|(d,PC,Xn)|imm|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|||✓|||✓|✓|✓|✓|✓|✓||

*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*