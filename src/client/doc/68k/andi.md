# ANDI - AND immediate

## Operation
[destination] ← \<literal\>.[destination]

## Syntax
```assembly
ANDI #<data>,<ea>
```

## Attributes
`Size` byte, word, longword

## Description
*AND* the immediate data to the destination operand. The `ANDI` permits a literal operand to be ANDed with a destination other than a data register. For example, `ANDI #$FE00,$1234` or `ANDI.B #$F0,(A2)+`.

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|-|*|*|0|0|

### Destination operand addressing modes
|Dn|An|(An)|(An)+|-(An)|(d,An)|(d,An,Xi)|ABS.W|ABS.L|(d,PC)|(d,PC,Xn)|imm|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|✓||✓|✓|✓|✓|✓|✓|✓||||

# ANDI to CCR - AND immediate to condition code register

## Operation
[CCR] ← \<data\>.[CCR]

## Syntax
```assembly
ANDI #<data>,CCR
```

## Attributes
`Size` byte

## Description
*AND* the immediate data to the condition code register (i.e., the least-significant byte of the status register).

## Application
`ANDI` is used to clear selected bits of the `CCR`. For example, `ANDI #$FA,CCR` clears the Z- and C-bits, i.e., XNZVC = X N 0 V 0.

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|*|*|*|*|*|

- X: cleared if bit 4 of data is zero
- N: cleared if bit 3 of data is zero
- Z: cleared if bit 2 of data is zero
- V: cleared if bit 1 of data is zero
- C: cleared if bit 0 of data is zero

# ANDI to SR - AND immediate to status register

## Operation
```
IF [S] = 1
  THEN
    [SR] ← <literal>.[SR]
  ELSE TRAP
```

## Syntax
```assembly
ANDI #<data>,SR
```

## Attributes
`Size` word

## Description
*AND* the immediate data to the status register and store the result in the status register. All bits of the SR are affected.

## Application
This instruction is used to clear the interrupt mask, the S-bit, and the T-bit of the *SR*. `ANDI #<data>,SR` affects both the status byte of the *SR* and the *CCR*. For example, `ANDI #$7FFF,SR` clears the trace bit of the status register, while `ANDI #$7FFE,SR` clears the trace bit and also clears the carry bit of the *CCR*.

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|*|*|*|*|*|

*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*