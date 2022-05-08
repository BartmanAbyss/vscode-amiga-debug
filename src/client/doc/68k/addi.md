# ADDI - Add immediate

## Operation
[destination] ← \<literal\> + [destination]

## Syntax
```assembly
ADDI #<data>,<ea>
```

## Attributes
`Size` byte, word, longword

## Description
Add immediate data to the destination operand. Store the result in the destination operand. `ADDI` can be used to add a literal directly to a memory location. For example, `ADDI.W #$1234,$2000` has the effect [M(2000<sub>16</sub>)]←[M(2000<sub>16</sub>)]+1234<sub>16</sub>.

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|*|*|*|*|*|

### Destination operand addressing modes
|Dn|An|(An)|(An)+|-(An)|(d,An)|(d,An,Xi)|ABS.W|ABS.L|(d,PC)|(d,PC,Xn)|imm|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|✓||✓|✓|✓|✓|✓|✓|✓||||

*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*