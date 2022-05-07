# AND - AND logical

## Operation
[destination] ← [source] . [destination]

## Syntax
```assembly
AND <ea>,Dn
AND Dn,<ea>
```

## Attributes
`Size` byte, word, longword

## Description
`AND` the source operand to the destination operand and store the result in the destination location.

## Application
`AND` is used to mask bits. If we wish to clear bits 3 to 6 of data register *D7*, we can execute `AND #%10000111,D7`. Unfortunately, the `AND` operation cannot be used with an address register as either a source or a destination operand. If you wish to perform a logical operation on an address register, you have to copy the address to a data register and then perform the operation there.

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|-|*|*|0|0|

### Source operand addressing modes
|Dn|An|(An)|(An)+|&#x2011;(An)|(d,An)|(d,An,Xi)|ABS.W|ABS.L|(d,PC)|(d,PC,Xn)|imm|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|✓||✓|✓|✓|✓|✓|✓|✓|✓|✓|✓|

### Destination operand addressing modes
|Dn|An|(An)|(An)+|&#x2011;(An)|(d,An)|(d,An,Xi)|ABS.W|ABS.L|(d,PC)|(d,PC,Xn)|imm|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|✓||✓|✓|✓|✓|✓|✓|✓||||

*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*