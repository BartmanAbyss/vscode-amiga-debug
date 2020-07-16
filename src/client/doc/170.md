**Sprite 6 vertical & horizontal start positions data**

|Bit| Function| Description  |
|---|---|---  |
|15-08| SV7-SV0| Start vertical value.High bit (SV8) is in [SPRxCTL](/hardware:sprxctl) registers.  |
|07-00| SH10-SH3| Sprite horizontal start value. Low order 3 bits are in [SPRxCTL](/hardware:sprxctl) registers. If SSCAN2 bit in FMODE is set, then disable SH10 horizontal coincidence detect.This bit is then free to be used by ALICE as an individual scan double enable.|

