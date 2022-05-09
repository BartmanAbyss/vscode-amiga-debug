# LINK - Link and allocate

## Operation
[SP] ← [SP] - 4; [M([SP])] ← [An];<br/>
[An] ← [SP]; [SP] ← [SP] + d

## Syntax
```assembly
LINK An,#<displacement>
```

## Sample syntax
```assembly
LINK A6,#-12
```

## Attributes
`Size` word

## Description
The contents of the specified address register are first pushed onto the stack. Then, the address register is loaded with the updated stack pointer. Finally, the 16-bit sign-extended displacement is added to the stack pointer. The contents of the address register occupy two words on the stack. A *negative displacement* must be used to allocate stack area to a procedure. At the end of a `LINK` instruction, the old value of address register An has been pushed on the stack and the new An is pointing at the base of the stack frame. The stack pointer itself has been moved up by d bytes and is pointing at the top of the stack frame. Address register An is called the *frame pointer* because it is used to reference data on the stack frame. By convention, programmers often use A6 as a frame pointer.

## Application
The `LINK` and `UNLK` pair are used to create local workspace on the top of a procedure's stack. Consider the code:

```
Subrtn LINK  A6,#-12    ;Create a 12-byte workspace
       .
       MOVE  D3,(-8,A6) ;Access the stack frame via A6
       .
       .
       UNLK  A6         ;Collapse the workspace
       RTS              ;Return from subroutine
```

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|-|-|-|-|-|

The LINK instruction does not affect the CCR.

*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*