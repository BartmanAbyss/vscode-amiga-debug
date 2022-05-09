# ADDX - Add extended

## Operation
[destination] ← [source] + [destination] + [X]

## Syntax
```assembly
ADDX Dy,Dx
ADDX -(Ay),-(Ax)
```

## Attributes
`Size` byte, word, longword

## Description
Add the source operand to the destination operand along with the extend bit, and store the result in the destination location. The only legal addressing modes are data register direct and memory to memory with address register indirect using pre-decrementing.

## Application
The `ADDX` instruction is used in chain arithmetic to add together strings of bytes (words or longwords). Consider the addition of two 128-bit numbers, each of which is stored as four consecutive longwords.

```assembly
        LEA  Number1,A0  ;A0 points at first number
        LEA  Number2,A1  ;A1 points at second number
        MOVE #3,D0       ;Four longwords to add
        MOVE #$00,CCR    ;Clear X-bit and Z-bit of the CCR
LOOP    ADDX -(A0),-(A1) ;Add pair of numbers
        DBRA D0,LOOP     ;Repeat until all added
```

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|*|*|*|*|*|

The Z-bit is cleared if the result is non-zero, and left unchanged otherwise. The Z-bit can be used to test for zero after a chain of multiple precision operations.

*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*