# ILLEGAL - Illegal instruction

## Operation
[SSP] ← [SSP] - 4; [M([SSP])] ← [PC];<br/>
[SSP] ← [SSP] - 2; [M([SSP])] ← [SR];<br/>
[PC] ← Illegal instruction vector

## Syntax
```assembly
ILLEGAL
```
## Attributes
None

## Description
The bit pattern of the illegal instruction, 4AFC<sub>16</sub> causes the illegal instruction trap to be taken. As in all exceptions, the contents of the program counter and the processor status word are pushed onto the supervisor stack at the start of exception processing.


## Application
Any *unknown* pattern of bits read by the 68000 during an instruction read phase will cause an illegal instruction trap. The `ILLEGAL` instruction can be thought of as an *official* illegal instruction. It can be used to test the illegal instruction trap and will always be an illegal instruction in any future enhancement of the 68000.

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|-|-|-|-|-|

*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*