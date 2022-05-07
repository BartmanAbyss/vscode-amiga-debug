# DBcc - Test condition, decrement, and branch

## Operation
IF(condition false)<br/>
&nbsp;&nbsp;THEN [Dn] ← [Dn] - 1 {decrement loop counter}<br/>
&nbsp;&nbsp;&nbsp;&nbsp;IF [Dn] = -1<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;THEN [PC] ← [PC] + 2 {fall through to next instruction}<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ELSE [PC] ← [PC] + d {take branch}<br/>
&nbsp;&nbsp;ELSE [PC] ← [PC] + 2 {fall through to next instruction}<br/>

## Syntax
```assembly
DBcc Dn,<label>
```
## Attributes
`Size` word

## Description
The `DBcc` instruction provides an automatic looping facility and replaces the usual decrement counter, test, and branch instructions. Three parameters are required by the `DBcc` instruction: a branch condition (specified by 'cc'), a data register that serves as the loop down-counter, and a label that indicates the start of the loop. The `DBcc` first tests the condition 'cc', and if 'cc' is true the loop is terminated and the branch back to \<label\> not taken. The 14 branch conditions supported by Bcc are also supported by `DBcc`, as well as `DBF` and `DBT` (F = false, and T = true). Note that many assemblers permit the mnemonic `DBF` to be expressed as `DBRA` (i.e., decrement and branch back).

It is important to appreciate that the condition tested by the `DBcc` instruction works in the *opposite* sense to a `Bcc`, conditional branch, instruction. For example, `BCC` means branch on carry clear, whereas `DBcc` means continue (i.e., exit the loop) on carry clear. That is, the `DBcc` condition is a loop terminator. If the termination condition is not true, the low-order 16 bits of the specified data register are decremented. If the result is -1, the loop is not taken and the next instruction is executed. If the result is not -1, a branch is made to 'label'. Note that the label represents a 16-bit signed value, permitting a branch range of -32K to +32K bytes. Since the value in Dn decremented is 16 bits, the loop may be executed up to 64K times.

We can use the instruction `DBEQ`, decrement and branch on zero, to mechanize the high-level language construct `REPEAT`...`UNTIL`.

```
LOOP ...            REPEAT
     ...
     ...              [D0] := [D0] - 1
     ...
     DBEQ D0,REPEAT UNTIL [D0] = - 1 OR [Z] = 1
```

## Application
Suppose we wish to input a block of 512 bytes of data (the data is returned in register D1). If the input routine returns a value zero in D1, an error has occurred and the loop must be exited.

```assembly
      LEA     Dest,A0   ;Set up pointer to destination
      MOVE.W  #511,D0   ;512 bytes to be input
AGAIN BSR     INPUT     ;Get the data in D1
      MOVE.B  D1,(A0)+  ;Store it
      DBEQ    D0,AGAIN  ;REPEAT until D1 = 0 OR 512 times
```

## Condition codes
|X|N|Z|V|C|
|--|--|--|--|--|
|-|-|-|-|-|

Not affected

*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*