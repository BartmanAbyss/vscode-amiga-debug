# TAS - Test and set an operand

## Operation
[CCR] ← tested([operand]); [destination(7)] ← 1

## Syntax
```assembly
TAS <ea>
```

## Attributes
`Size` byte

## Description
Test and set the byte operand addressed by the effective address field. The N- and Z-bits of the *CCR* are updated accordingly. The high-order bit of the operand (i.e., bit 7) is set. This operation is *indivisible* and uses a read-modify-write cycle. Its principal application is in multiprocessor systems.

## Application
The `TAS` instruction permits one processor in a multiprocessor system to test a resource (e.g., shared memory) and claim the resource if it is free. The most-significant bit of the byte at the effective address is used as a semaphore to indicate whether the shared resource is free. The `TAS` instruction reads the semaphore bit to find the state of the resource, and then sets the semaphore to claim the resource (if it was free). Because the operation is indivisible, no other processor can access the memory between the testing of the bit and its subsequent setting.

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|-|*|*|0|0|

## Source operand addressing modes
|Dn|An|(An)|(An)+|&#x2011;(An)|(d,An)|(d,An,Xi)|ABS.W|ABS.L|(d,PC)|(d,PC,Xn)|imm|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|✓||✓|✓|✓|✓|✓|✓|✓||||

*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*