# ORI - OR immediate

## Operation
[destination] ← \<literal\> + [destination]

## Syntax
```assembly
ORI #<data>,<ea>
```

## Attributes
`Size`  byte, word, longword

## Description
OR the immediate data with the destination operand. Store the result in the destination operand.

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|-|*|*|0|0|

## Application
`ORI` forms the logical OR of the immediate source with the effective address, which may be a memory location. For example,

```
ORI.B #%00000011,(A0)+
```

## Destination operand addressing modes
|Dn|An|(An)|(An)+|&#x2011;(An)|(d,An)|(d,An,Xi)|ABS.W|ABS.L|(d,PC)|(d,PC,Xn)|imm|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|✓||✓|✓|✓|✓|✓|✓|✓||||

# ORI to CCR - Inclusive OR immediate to CCR

## Operation
[CCR] ← \<literal\> + [CCR]

## Syntax
```assembly
ORI #<data>,CCR
```

## Attributes
`Size`  byte

## Description
OR the immediate data with the condition code register (i.e., the least-significant byte of the status register). For example, the Z flag of the CCR can be set by `ORI #$04,CCR`.

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|*|*|*|*|*|

X is set if bit 4 of data = 1; unchanged otherwise</br>
N is set if bit 3 of data = 1; unchanged otherwise</br>
Z is set if bit 2 of data = 1; unchanged otherwise</br>
V is set if bit 1 of data = 1; unchanged otherwise</br>
C is set if bit 0 of data = 1; unchanged otherwise</br>

# ORI to SR - Inclusive OR immediate to status register

## Operation
IF [S] = 1<br/>
&nbsp;&nbsp;THEN<br/>
&nbsp;&nbsp;&nbsp;&nbsp;[SR] ← \<literal\> + [SR]<br/>
&nbsp;&nbsp;ELSE TRAP

## Syntax
```assembly
ORI #<data>,SR
```

## Attributes
`Size`  word

## Description
OR the immediate data to the status register and store the result in the status register. All bits of the status register are affected.


## Application
Used to set bits in the SR (i.e., the S, T, and interrupt mask bits). For example, `ORI #$8000,SR` sets bit 15 of the SR (i.e., the trace bit).

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|*|*|*|*|*|

X is set if bit 4 of data = 1; unchanged otherwise<br/>
N is set if bit 3 of data = 1; unchanged otherwise<br/>
Z is set if bit 2 of data = 1; unchanged otherwise<br/>
V is set if bit 1 of data = 1; unchanged otherwise<br/>
C is set if bit 0 of data = 1; unchanged otherwise

*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*