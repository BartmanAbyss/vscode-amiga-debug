# MOVEC - Move Control Register

## Operation
If Supervisor State<br/>
&nbsp;&nbsp;Then Rc → Rn or Rn → Rc<br/>
Else TRAP

## Syntax 
```assembly
MOVEC Rc,Rn
MOVEC Rn,Rc
```

## Attributes
`Size` longword

## Description
Moves the contents of the specified control register (Rc) to the specified general register (Rn) or copies the contents
of the specified general register to the specified control register. This is always a 32-bit transfer, even though the
control register may be implemented with fewer bits. Unimplemented bits are read as zeros.

## Condition Codes
Not affected.

*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*