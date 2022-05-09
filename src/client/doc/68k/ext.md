# EXT - Sign-extend a data register

## Operation
[destination] ← sign-extended[destination]

## Syntax
```assembly
EXT.W Dn
EXT.L Dn
```

## Attributes
`Size` word, longword

## Description
Extend the least-significant byte in a data register to a word, or extend the least-significant word in a data register to a longword. If the operation is word sized, bit 7 of the designated data register is copied to bits (8:15). If the operation is longword sized, bit 15 is copied to bits (16:31).

## Application
If `[D0] = $12345678, EXT.W D0` results in 12340078<sub>16</sub><br/>
If `[D0] = $12345678, EXT.L D0` results in 00005678<sub>16</sub>

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|-|*|*|0|0|

*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*