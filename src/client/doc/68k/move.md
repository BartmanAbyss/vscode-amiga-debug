# MOVE - Copy data from source to destination

## Operation
[destination] ← [source]

## Syntax
```assembly
MOVE <ea>,<e>
```

## Sample syntax
```assembly
MOVE (A5),-(A2)
MOVE -(A5),(A2)+
MOVE #$123,(A6)+
MOVE Temp1,Temp2
```

## Attributes
`Size` byte, word, longword

## Description
Move the contents of the source to the destination location. The data is examined as it is moved and the condition codes set accordingly. Note that this is actually a *copy* command because the source is not affected by the move. The move instruction has the widest range of addressing modes of all the 68000's instructions.

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|-|*|*|0|0|

## Source operand addressing modes
|Dn|An|(An)|(An)+|-(An)|(d,An)|(d,An,Xi)|ABS.W|ABS.L|(d,PC)|(d,PC,Xn)|imm|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|✓|✓|✓|✓|✓|✓|✓|✓|✓|✓|✓|✓|

## Destination operand addressing modes
|Dn|An|(An)|(An)+|-(An)|(d,An)|(d,An,Xi)|ABS.W|ABS.L|(d,PC)|(d,PC,Xn)|imm|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|✓||✓|✓|✓|✓|✓|✓|✓||||

# MOVE to CCR - Copy data to CCR from source

## Operation
[CCR] ← [source]

## Syntax
```assembly
MOVE <ea>,CCR
```

## Attributes
`Size` word

## Description
Move the contents of the source operand to the condition code register. The source operand is a *word*, but only the low-order *byte* contains the condition codes. The upper byte is neglected. Note that `MOVE <ea>,CCR` is a word operation, but `ANDI`, `ORI`, and `EORI` to `CCR` are all byte operations.

## Application
The move to CCR instruction permits the programmer to preset the CCR. For example, `MOVE #0,CCR` clears all the CCR's bits.

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|*|*|*|*|*|

## Source operand addressing modes
|Dn|An|(An)|(An)+|-(An)|(d,An)|(d,An,Xi)|ABS.W|ABS.L|(d,PC)|(d,PC,Xn)|imm|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|✓||✓|✓|✓|✓|✓|✓|✓|✓|✓|✓|

# MOVE from SR - Copy data from SR to destination

## Operation
[destination] ← [SR]

## Syntax
```assembly
MOVE SR,<ea>
```

## Attributes
`Size` word

## Description
Move the contents of the status register to the destination location. The source operand, the status register, is a word. This instruction is not privileged in the 68000, but is privileged in the 68010, 68020, and 68030. Executing a `MOVE SR,<ea>` while in the user mode on these processors results in a privilege violation trap.

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|-|-|-|-|-|

## Destination operand addressing modes
|Dn|An|(An)|(An)+|-(An)|(d,An)|(d,An,Xi)|ABS.W|ABS.L|(d,PC)|(d,PC,Xn)|imm|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|✓||✓|✓|✓|✓|✓|✓|✓||||


# MOVE to SR - Copy data to SR from source

## Operation
IF [S] = 1<br/>
&nbsp;&nbsp;THEN [SR] ← [source]<br/>
ELSE TRAP

## Syntax
```assembly
MOVE <ea>,SR
```

## Attributes
`Size` word


## Description
Move the contents of the source operand to the status register. The source operand is a word and all bits of the status register are affected.

## Application
The `MOVE to SR` instruction allows the programmer to preset the contents of the status register. This instruction permits the trace mode, interrupt mask, and status bits to be modified. For example, `MOVE #$2700,SR` moves 00100111 00000000 to the status register which clears all bits of the CCR, sets the S-bit, clears the T-bit, and sets the interrupt mask level to 7.

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|*|*|*|*|*|

## Source operand addressing modes
|Dn|An|(An)|(An)+|-(An)|(d,An)|(d,An,Xi)|ABS.W|ABS.L|(d,PC)|(d,PC,Xn)|imm|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|✓||✓|✓|✓|✓|✓|✓|✓|✓|✓|✓|

# MOVE USP - Copy data to or from USP

## Operation 1
IF [S] = 1&nbsp;&nbsp;&nbsp;&nbsp;{MOVE USP,An form}<br/>
&nbsp;&nbsp;THEN [USP] ← [An]<br/>
ELSE TRAP

## Operation 2
IF [S] = 1&nbsp;&nbsp;&nbsp;&nbsp;{MOVE An,USP form}<br/>
&nbsp;&nbsp;THEN [An] ← [USP]<br/>
ELSE TRAP

## Syntax 1
```assembly
MOVE USP,An
```

## Syntax 2
```assembly
MOVE An,USP
```

## Attributes
`Size` longword

## Description
Move the contents of the user stack pointer to an address register or vice versa. This is a privileged instruction and allows the operating system running in the supervisor state either to read the contents of the user stack pointer or to set up the user stack pointer.

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|-|-|-|-|-|

*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*