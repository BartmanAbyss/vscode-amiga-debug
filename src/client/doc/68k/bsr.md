# BSR - Branch to subroutine

## Operation
[SP] ← [SP] - 4; [M([SP])] ← [PC]; [PC] ← [PC] + d


## Syntax
```assembly
BSR <label>
BSR <literal>
```

## Attributes
`Size` byte, word

## Description
The longword address of the instruction immediately following the `BSR` instruction is pushed onto the system stack pointed at by A7. Program execution then continues at location [PC] + displacement. The displacement is an 8-bit two's complement value for a short branch, or a 16-bit two's complement value for a long branch. The value in the PC corresponds to the current location plus two. Note that a short branch to the next instruction is impossible, since the branch code 0 is used to indicate a long branch with a 16-bit offset.

## Application
`BSR` is used to call a procedure or a subroutine. Since it provides relative addressing (and therefore position independent code), its use is preferable to `JSR`.

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|-|-|-|-|-|

*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*