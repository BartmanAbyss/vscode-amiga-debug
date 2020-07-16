**Bit Plane Control Register (new control bits)**

|Bit| Function| Description  |
|---|---|---  |
|15| X | *[Not in reference manual]* don`t care- but drive to 0 for upward compatibility  |
|14| X ZDBPSEL2| *[Not in reference manual]* 3 bit field which selects which bitplane is to be used for ZD when ZDBBPEN is set- 000 selects BB1 and 111 selects BP8.  |
|13| X ZDBPSEL1| *[Not in reference manual]*  |
|12| X ZDBPSEL0| *[Not in reference manual]*  |
|11| X ZDBPEN| *[Not in reference manual]* Causes ZD pin to mirror bitplane selected by ZDBPSELx bits. This does not disable the ZD mode defined by ZDCTEN, but rather is "ored" with it.  |
|10| X ZDCTEN| *[Not in reference manual]* Causes ZD pin to mirror bit #15 of the active entry in high color table. When ZDCTEN is reset ZD reverts to mirroring color (0).  |
|09| X KILLEHB| *[Not in reference manual]* Disables extra halfbrite mode.  |
|08| X RDRAM=0| *[Not in reference manual]* Causes color table address to read the color table instead of writing to it.  |
|07| X SOGEN=0| *[Not in reference manual]* When set causes SOG output pin to go high  |
|06| PF2PRI| Gives playfield 2 priority over playfield 1.  |
|05| PF2P2| Playfield 2 priority code (with resp. to sprites).  |
|04| PF2P1|   |
|03| PF2P0|   |
|02| PF1P2| Playfield 1 priority code (with resp. to sprites).  |
|01| PF1P1|   |
|00| PF1P0||

