# ADDA - Add address

## Operation
[destination] ← [source] + [destination]

## Syntax
```assembly
ADDA <ea>,An
```

## Attributes
`Size` word, longword

## Description
Add the source operand to the destination address register and store the result in the destination address register. The source is sign-extended before it is added to the destination. For example, if we execute `ADDA.W D3,A4` where A4 = 00000100<sub>16</sub> and D3.W = 8002<sub>16</sub>, the contents of D3 are sign-extended to FFFF8002<sub>16</sub> and added to 00000100<sub>16</sub> to give FFFF8102<sub>16</sub>, which is stored in A4.


## Application
To add to the contents of an address register and not update the CCR. Note that `ADDA.W D0,A0` is the same as `LEA (A0,D0.W),A0`.

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|-|-|-|-|-|

An `ADDA` operation does not affect the state of the CCR.

### Source operand addressing modes
|Dn|An|(An)|(An)+|&#x2011;(An)|(d,An)|(d,An,Xi)|ABS.W|ABS.L|(d,PC)|(d,PC,Xn)|imm|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|✓|✓|✓|✓|✓|✓|✓|✓|✓|✓|✓|✓|

*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*