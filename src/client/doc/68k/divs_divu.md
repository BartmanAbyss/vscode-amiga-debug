# DIVS, DIVU - Signed divide, unsigned divide

## Operation
[destination] ← [destination]/[source]

## Syntax
```assembly
DIVS <ea>,Dn
DIVU <ea>,Dn
```

## Attributes
`Size` longword/word = longword result

## Description
Divide the destination operand by the source operand and store the result in the destination. The destination is a longword and the source is a 16-bit value. The result (i.e., destination register) is a 32-bit value arranged so that the quotient is the lower-order word and the remainder is the upper-order word. `DIVU` performs division on unsigned values, and `DIVS` performs division on two's complement values. An attempt to divide by zero causes an exception. For `DIVS`, the sign of the remainder is always the same as the sign of the dividend (unless the remainder is zero).

Attempting to divide a number by zero results in a divide-by-zero exception. If overflow is detected during division, the operands are unaffected. Overflow is checked for at the start of the operation and occurs if the quotient is larger than a 16-bit signed integer. If the upper word of the dividend is greater than or equal to the divisor, the V-bit is set and the instruction terminated.

## Application
Consider the division of D0 by D1, `DIVU D1,D0`, which results in:

```
[D0(0:15)] ← [D0(0:31)]/[D1(0:15)]
[D0(16:31)] ← remainder
```

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|-|*|*|*|0|

The X-bit is not affected by a division. The N-bit is set if the quotient is negative. The Z-bit is set if the quotient is zero. The V-bit is set if division overflow occurs (in which case the Z- and N-bits are undefined). The C-bit is always cleared.

## Source operand addressing modes
|Dn|An|(An)|(An)+|&#x2011;(An)|(d,An)|(d,An,Xi)|ABS.W|ABS.L|(d,PC)|(d,PC,Xn)|imm|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|✓||✓|✓|✓|✓|✓|✓|✓|✓|✓|✓|

*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*