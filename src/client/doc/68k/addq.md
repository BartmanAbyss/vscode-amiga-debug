# ADDQ - Add quick

## Operation
[destination] ← \<literal\> + [destination]

## Syntax
```assembly
ADDQ #<data>,<ea>
```

## Sample syntax
```assembly
ADDQ #6,D3
```

## Attributes
`Size` byte, word, longword

## Description
Add the immediate data to the contents of the destination operand. The immediate data must be in the range 1 to 8. Word and longword operations on address registers do not affect condition codes. Note that a word operation on an address register affects all bits of the register.

## Application
`ADDQ` is used to add a small constant to the operand at the effective address. Some assemblers permit you to write `ADD` and then choose `ADDQ` *automatically* if the constant is in the range 1 to 8.

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|*|*|*|*|*|

Note that the CCR is not updated if the destination operand is an address register.

### Destination operand addressing modes
|Dn|An|(An)|(An)+|-(An)|(d,An)|(d,An,Xi)|ABS.W|ABS.L|(d,PC)|(d,PC,Xn)|imm|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|✓|✓|✓|✓|✓|✓|✓|✓|✓||||

*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*