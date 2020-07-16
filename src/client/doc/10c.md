**Bit Plane Control Register (display masks)**

|Bit| Function| Description  |
|---|---|---  |
|15-08| BPLAMx=0| This 8 bit field is XOR`ed with the 8 bit plane color address, thereby altering the color address sent to the color table. Default value is 00000000 binary. (x=0-7)  |
|07-04| ESPRMx=1| 4 Bit field provides the 4 high order color table address bits for even sprites: SPR0,SPR2,SPR4,SPR6. Default value is 0001 binary. (x=7-4)  |
|03-00| OSPRM7=1| 4 Bit field provides the 4 high order color table address bits for odd sprites: SPR1,SPR3,SPR5,SPR7. Default value is 0001 binary. (x=7-4)|

