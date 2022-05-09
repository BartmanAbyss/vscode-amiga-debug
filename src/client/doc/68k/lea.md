# LEA - Load effective address

## Operation
[An] ← \<ea\>

## Syntax
```assembly
LEA <ea>,An
```

## Sample syntax
```assembly
LEA Table,A0
LEA (Table,PC),A0
LEA (-6,A0,D0.L),A6
LEA (Table,PC,D0),A6
```

## Attributes
`Size` longword

## Description
The effective address is computed and loaded into the specified address register. For example, `LEA (-6,A0,D0.W),A1` calculates the sum of address register A0 plus data register D0.W sign-extended to 32 bits minus 6, and deposits the result in address register A1. The difference between the `LEA` and `PEA` instructions is that `LEA` calculates an effective address and puts it in an address register, while `PEA` calculates an effective address in the same way but pushes it on the stack.

## Application
`LEA` is a very powerful instruction used to calculate an effective address. In particular, the use of `LEA` facilitates the writing of position independent code. For example, `LEA (TABLE,PC),A0` calculates the effective address of 'TABLE' with respect to the PC and deposits it in A0.

```assembly
      LEA  (Table,PC),A0 ;Compute address of Table with respect to PC
      MOVE (A0),D1       ;Pick up the first item in the table
      .                  ;Do something with this item
      MOVE D1,(A0)       ;Put it back in the table
      .
      .
Table DS.B 100
```

## Source operand addressing modes
|Dn|An|(An)|(An)+|-(An)|(d,An)|(d,An,Xi)|ABS.W|ABS.L|(d,PC)|(d,PC,Xn)|imm|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|||✓|||✓|✓|✓|✓|✓|✓||

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|-|-|-|-|-|

*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*