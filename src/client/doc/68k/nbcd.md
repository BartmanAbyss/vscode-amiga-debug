# NBCD - Negate decimal with sign extend

## Operation
[destination]<sub>10</sub> ← 0 − [destination]<sub>10</sub> - [X]

## Syntax
```assembly
NBCD <ea>
```

## Attributes
`Size`  byte

## Description
The operand addressed as the destination and the extend bit in the CCR are subtracted from zero. The subtraction is performed using binary coded decimal (BCD) arithmetic. This instruction calculates the ten's complement of the destination if the X-bit is clear, and the nine's complement if X = 1. This is a byte-only operation. Negating a BCD number (with X = 0) has the effect of subtracting it from 100<sub>10</sub>.

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|*|U|*|U|*|

The Z-bit is cleared if the result is non-zero and is unchanged otherwise. The C-bit is set if a decimal borrow occurs. The X-bit is set to the same value as the C-bit.

## Destination operand addressing modes
|Dn|An|(An)|(An)+|&#x2011;(An)|(d,An)|(d,An,Xi)|ABS.W|ABS.L|(d,PC)|(d,PC,Xn)|imm|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|✓||✓|✓|✓|✓|✓|✓|✓||||

*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*