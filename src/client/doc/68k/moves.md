# MOVES - Move Address Space

## Operation
If Supervisor State<br/>
&nbsp;&nbsp;Then Rn → Destination [DFC] or Source [SFC] → Rn<br/>
Else TRAP

## Syntax
```assembly
MOVES < ea > ,Rn
MOVES Rn, < ea >
```

## Attributes
`Size` byte, word, longword

## Description
This instruction moves the byte, word, or long operand from the specified general register to a location within the
address space specified by the destination function code (DFC) register, or it moves the byte, word, or long operand
from a location within the address space specified by the source function code (SFC) register to the specified general
register. If the destination is a data register, the source operand replaces the corresponding low-order bits of that
data register, depending on the size of the operation. If the destination is an address register, the source operand is
sign-extended to 32 bits and then loaded into that address register.

## Condition Codes
Not affected.
                  
*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*