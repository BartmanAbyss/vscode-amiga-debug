# TRAP - Trap

## Operation
S ← 1;</br>
[SSP] ← [SSP] - 4;[M([SSP])] ← [PC];</br>
[SSP] ← [SSP] - 2;[M([SSP])] ← [SR];</br>
[PC] ← vector

## Syntax
```assembly
TRAP #<vector>
```

## Attributes
Unsized

## Description
This instruction forces the processor to initiate exception processing. The vector number used by the `TRAP` instruction is in the range 0 to 15 and therefore, supports 16 traps (i.e., `TRAP #0` to `TRAP #15`).

## Application
The `TRAP` instruction is used to perform operating system calls and is system independent. That is, the effect of the call depends on the particular operating environment. For example, the University of Teesside 68000 simulator uses `TRAP #15` to perform I/O. The ASCII character in D1.B is displayed by the following sequence.

```assembly
MOVE.B  #6,D0  ;Set up the display a character parameter in D0
TRAP    #15    ;Now call the operating system
```

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|-|-|-|-|-|

*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*