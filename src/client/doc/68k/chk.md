# CHK - Check register against bounds

## Operation
IF [Dn] < 0 OR [Dn] > [\<ea\>] THEN TRAP

## Syntax
```assembly
CHK <ea>,Dn
```
## Attributes
`Size` word

## Description
The contents of the low-order word in the data register specified in the instruction are examined and compared with the upper bound at the effective address. The upper bound is a two's complement integer. If the data register value is less than zero or greater than the upper bound contained in the operand word, then the processor initiates exception processing.

## Application
The `CHK` instruction can be used to test the bounds of an array element before it is used. By performing this test, you can make certain that you do not access an element outside an array. Consider the following fragment of code:

```assembly
MOVE.W subscript,D0    ;Get subscript to test
CHK    #max_bound,D0   ;Test subscript against 0 and upper bound
*                      ;TRAP on error ELSE continue if ok
```

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|-|*|U|U|U|

N: set if [Dn] < 0 ; cleared if [Dn] > [\<ea\>]; undefined otherwise.

### Source operand addressing modes
|Dn|An|(An)|(An)+|&#x2011;(An)|(d,An)|(d,An,Xi)|ABS.W|ABS.L|(d,PC)|(d,PC,Xn)|imm|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|✓||✓|✓|✓|✓|✓|✓|✓||||

*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*