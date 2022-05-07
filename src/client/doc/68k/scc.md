# Scc - Set according to condition cc

## Operation
IF cc = 1 THEN [destination] ← 11111111<sub>2</sub><br/>
&nbsp;&nbsp;ELSE [destination] ← 00000000<sub>2</sub>

## Syntax
```assembly
Scc <ea>
```

## Attributes
`Size` byte

## Description
The specified condition code is tested. If the condition is true, the bits at the effective address are all set to one (i.e., $FF). Otherwise, the bits at the effective address are set to zeros (i.e., $00).

|Mnemonic|Description|Condition|
|--|--|--|
|`SCC` | set on carry clear | C̅ |
|`SCS` | set on carry set | C |
|`SEQ` | set on equal | Z |
|`SGE` | set on greater than or equal | N.V + N̅.V̅ |
|`SGT` | set on greater than | N.V.Z̅ + N̅.V̅.Z̅ |
|`SHI` | set on higher than | C̅.Z̅ |
|`SLE` | set on less than or equal | Z + N.V̅ + N̅.V |
|`SLS` | set on lower than or same | C + Z |
|`SLT` | set on less than | N.V̅ + N̅.V |
|`SMI` | set on minus (i.e., negative) | N |
|`SNE` | set on not equal | Z̅ |
|`SPL` | set on plus (i.e., positive) | N̅ |
|`SVC` | set on overflow clear | V̅ |
|`SVS` | set on overflow set | V |
|`SF`  | set on false (i.e., set never) | 0 |
|`ST`  | set on true (i.e., set always) | 1 |


## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|-|-|-|-|-|

## Destination operand addressing modes
|Dn|An|(An)|(An)+|&#x2011;(An)|(d,An)|(d,An,Xi)|ABS.W|ABS.L|(d,PC)|(d,PC,Xn)|imm|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|✓||✓|✓|✓|✓|✓|✓|✓||||

*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*