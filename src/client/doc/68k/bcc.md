# Bcc - Branch on condition cc
## Operation
If cc = 1 THEN [PC] ← [PC] + d
## Syntax
```assembly
Bcc <label>
```

## Sample syntax
```assembly
BEQ Loop_4
BVC *+8
```

## Attributes
`BEQ` takes an 8-bit or a 16-bit offset (i.e., displacement).
## Description
If the specified logical condition is met, program execution continues at location [PC] + displacement, d. The displacement is a two's complement value. The value in the PC corresponds to the current location plus two. The range of the branch is -126 to +128 bytes with an 8-bit offset, and -32K to +32K bytes with a 16-bit offset. A short branch to the next instruction is impossible, since the branch code 0 indicates a long branch with a 16-bit offset. The assembly language form `BCC *+8` means branch to the point eight bytes from the current PC if the carry bit is clear.

|Mnemonic|Description|Logic|
|--|--|--|
|BCC| branch on carry clear|C̅|
|BCS|branch on carry set|C|
|BEQ| branch on equal|Z|
|BGE|branch on greater than or equal|N.V + N̅.V̅|
|BGT| branch on greater than|N.V.Z̅ + N̅.V̅.Z̅|
|BHI| branch on higher than|C̅.Z̅|
|BLE| branch on less than or equal|Z + N.V̅ + N̅.V|
|BLS| branch on lower than or same|C+Z|
|BLT| branch on less than|N.V̅ + N̅.V|
|BMI| branch on minus (i.e., negative)|N|
|BNE| branch on not equal|Z̅|
|BPL| branch on plus (i.e., positive)|N̅|
|BVC| branch on overflow clear|V̅|
|BVS| branch on overflow set|V|

Note that there are two types of conditional branch instruction: those that branch on an unsigned condition and those that branch on a signed condition. For example, $FF is greater than $10 when the numbers are regarded as unsigned (i.e., 255 is greater than 16). However, if the numbers are signed, $FF is less than $10 (i.e., -1 is less than 16).

The signed comparisons are:

|Mnemonic|Alias|Description|
|--|--|--|
|BGE||branch on greater than or equal
|BGT||branch on greater than|
|BLE||branch on lower than or equal|
|BLT||branch on less than|

The unsigned comparisons are:

|Mnemonic|Alias|Description|
|--|--|--|
|BHS|BCC|branch on higher than or same|
|BHI| |branch on higher than|
|BLS| |branch on lower than or same|
|BLO|BCS| branch on less than|

The official mnemonics `BCC` (branch on carry clear) and `BCS` (branch on carry set) can be renamed as `BHS` (branch on higher than or same) and `BLO` (branch on less than), respectively. Many 68000 assemblers support these alternative mnemonics.

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|-|-|-|-|-|

*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*