**Pot pin data read**

This register controls a 4 bit bi-direction I/O port that shares the same 4 pins as the 4 pot counters above.

| Bit| Function| Description  |
|---|---|---  |
|15| OUTRY| Output enable for Paula pin 33  |
|14| DATRY| I/O data Paula pin 33  |
|13| OUTRX| Output enable for Paula pin 32  |
|12| DATRX| I/O data Paula pin 32  |
|11| OUTLY| Out put enable for Paula pin 36  |
|10| DATLY| I/O data Paula pin 36  |
|09| OUTLX| Output enable for Paula pin 35  |
|08| DATLX| I/O data Paula pin 35  |
|07-01| X| Not used  |
|00| START| Start pots (dump capacitors,start counters)|

