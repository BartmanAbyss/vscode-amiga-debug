# PEA - Push effective address

## Operation
[SP] ← [SP] - 4; [M([SP])] ← \<ea\>

## Syntax
```assembly
PEA <ea>
```

## Attributes
`Size`  longword

## Description
The longword effective address specified by the instruction is computed and pushed onto the stack. The difference between `PEA` and `LEA` is that `LEA` calculates an effective address and puts it in an address register, while `PEA` calculates an effective address in the same way but pushes it on the stack.

## Application
`PEA` calculates an effective address to be used later in address register indirect addressing. In particular, it facilitates the writing of position independent code. For example, `PEA (TABLE,PC)` calculates the address of `TABLE` with respect to the PC and pushes it on the stack. This address can be read by a procedure and then used to access the data to which it points. Consider the example:

```assembly
           PEA Wednesday       ;Push the parameter address on the stack
           BSR Subroutine      ;Call the procedure
           LEA (4,SP),SP       ;Remove space occupied by the parameter
           .
Subroutine MOVEA.L (4,SP),A0   ;A0 points to parameter under return address
           MOVE.W (A0),D2      ;Access the actual parameter - Wednesday
           .
           RTS
```

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|-|-|-|-|-|

## Source operand addressing modes
|Dn|An|(An)|(An)+|&#x2011;(An)|(d,An)|(d,An,Xi)|ABS.W|ABS.L|(d,PC)|(d,PC,Xn)|imm|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|||✓|||✓|✓|✓|✓|✓|✓||

*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*