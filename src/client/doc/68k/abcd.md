# ABCD - Add decimal with extend

## Operation
[destination]<sub>10</sub> ← [source]<sub>10</sub> + [destination]<sub>10</sub> + [X]

## Syntax
```assembly
ABCD Dy,Dx
ABCD -(Ay),-(Ax)
```

## Attributes
`Size` byte

## Description
Add the source operand to the destination operand along with the extend bit, and store the result in the destination location. The addition is performed using `BCD` arithmetic. The only legal addressing modes are data register direct and memory to memory with address register indirect using pre-decrementing.

## Application
The `ABCD` instruction is used in chain arithmetic to add together strings of `BCD` digits. Consider the addition of two nine-digit numbers. Note that the strings are stored so that the least-significant digit is at the high address.

```assembly
        LEA Number1,A0      ;A0 points at first string
        LEA Number2,A1      ;A1 points at second string
        MOVE #8,D0          ;Nine digits to add
        MOVE #$04,CCR       ;Clear X-bit and Z-bit of the CCR
LOOP    ABCD -(A0),-(A1)    ;Add a pair of digits
        DBRA D0,LOOP        ;Repeat until 9 digits added
```

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|*|U|*|U|*|

The Z-bit is cleared if the result is non-zero, and left unchanged otherwise. The Z-bit is normally set by the programmer before the BCD operation, and can be used to test for zero after a chain of multiple-precision operations. The C-bit is set if a decimal carry is generated.

*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*