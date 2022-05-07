# RTR - Return and restore condition codes

## Operation
[CCR] ← [M([SP])]; [SP] ← [SP] + 2<br/>
[PC] ← [M([SP])]; [SP] ← [SP] + 4

## Syntax
```assembly
RTR
```

## Attributes
Unsized

## Description
The condition code and program counter are pulled from the stack. The previous condition code and program counter are lost. The supervisor portion of the status register is not affected.

## Application
If you wish to preserve the CCR after entering a procedure, you can push it on the stack and then retrieve it with `RTR`.

```assembly
      BSR     Proc1       ;Call the procedure
      .
      .
Proc1 MOVE.W  SR,-(SP)    ;Save old CCR on stack
      .
      .                   ;Body of procedure
      .
      RTR                 ;Return and restore CCR (not SR!)
```

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|*|*|*|*|*|

The CCR is restored to its pre-exception state.

*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*