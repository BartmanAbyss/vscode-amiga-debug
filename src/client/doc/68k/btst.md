# BTST - Test a bit

## Operation
[Z] ← ¬(\<bit number\> OF [destination])

## Syntax
```assembly
BTST Dn,<ea>
BTST #<data>,<ea>
```

## Attributes
`Size` byte, longword

## Description
A bit in the destination operand is tested and the state of the specified bit is reflected in the condition of the Z-bit in the CCR. The destination is not modified by a `BTST` instruction. If a data register is the destination, then the bit numbering is modulo 32, allowing bit manipulation of all bits in a data register. If a memory location is the destination, a byte is read from that location, the bit operation performed. Bit 0 refers to the least-significant bit. The bit number for this operation may be specified either statically by an immediate value or dynamically by the contents of a data register.

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|-|-|*|-|-|

Z: set if the bit tested is zero, cleared otherwise.

### Destination operand addressing modes
|Dn|An|(An)|(An)+|&#x2011;(An)|(d,An)|(d,An,Xi)|ABS.W|ABS.L|(d,PC)|(d,PC,Xn)|imm|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|✓||✓|✓|✓|✓|✓|✓|✓|✓|✓||

Note that data register direct (i.e., Dn) addressing uses a longword operand, while all other modes use a byte operand.

*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*