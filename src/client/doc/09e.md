**Audio, Disk, UART Control Write**

|Bit| Function| Description  |
|---|---|---  |
|15| SET/CLEAR| Set/clear control bit.determines if bits written with a 1 get set or cleared.bits written with a zero are always unchanged.  |
|14-13| PRECOMP 1-0| 00 : none 01 : 140 ns 10 : 280 ns 11 : 560 ns  |
|12| MFMPREC| (1 = MFM precomp / 0 = GCR precomp)  |
|11| UARTBRK| Forces a UART break (clears TXD) if true  |
|10| WORDSYNC| Enables disk read synchronizing on a word equal to DISK SYNC CODE, Located in address DSKSYNC (7E).  |
|09| MSBSYNC| Enables disk read synchronizing on the MSB (most significant bit) appl type GCR  |
|08| FAST| Disk data clock rate control : 1 : fast(2us) 0 : slow(4us) (Fast for MFM or 2us,slow for 4us GCR)  |
|07| USE3PN| Use audio channel 3 to modulate nothing  |
|06| USE2P3| Use audio channel 2 to modulate period of channel 3  |
|05| USE1P2| Use audio channel 1 to modulate period of channel 2  |
|04| USE0P1| Use audio channel 0 to modulate period of channel 1  |
|03| USE3VN| Use audio channel 3 to modulate nothing  |
|02| USE2V3| Use audio channel 2 to modulate volume of channel 3  |
|01| USE1V2| Use audio channel 1 to modulate volume of channel 2  |
|00| USE0V1| Use audio channel 0 to modulate volume of channel 1|

> Note: If both period and volume are modulated on the same channel, the period and volume will be alternated. First AUDxDAT word is used for V6-V0 of UDxVOL. Second AUDxDAT word is used for P15-P0 of AUDxPER. This alternating sequence is repeated.

