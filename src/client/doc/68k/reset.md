# RESET - Reset external devices

## Operation
IF [S] = 1 THEN<br/>
&nbsp;&nbsp;Assert RESET* line<br/>
&nbsp;ELSE TRAP

## Syntax
```assembly
RESET
```

## Attributes
Unsized

## Description
The reset line is asserted, causing all external devices connected to the 68000's RESET* output to be reset. The `RESET` instruction is privileged and has no effect on the operation of the 68000 itself. This instruction is used to perform a programmed reset of all peripherals connected to the 68000's RESET* pin.

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|-|-|-|-|-|

*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*