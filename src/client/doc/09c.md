**Interrupt request bits (clear or set)**

This register contains interrupt request bits (or flags). These bits may be polled by the processor, and if enabled by the bits listed in the next register, they may cause processor interrupts. Both a set and clear operation are required to load arbitrary data into this register.

| Bit| Function| Level| Description  |
|---|---|---|---  |
|15| SET/CLR| | Set/clear control bit. Determines if bits written with a 1 get set or cleared. Bits written with a zero are always unchanged.  |
|14| INTEN| | Master interrupt (enable only, no request)  |
|13| EXTER| 6| External interrupt  |
|12| DSKSYN| 5| Disk sync register (DSKSYNC) matches disk  |
|11| RBF| 5| Serial port receive buffer full  |
|10| AUD3| 4| Audio channel 3 block finished  |
|09| AUD2| 4| Audio channel 2 block finished  |
|08| AUD1| 4| Audio channel 1 block finished  |
|07| AUD0| 4| Audio channel 0 block finished  |
|06| BLIT| 3| Blitter has finished  |
|05| VERTB| 3| Start of vertical blank  |
|04| COPER| 3| Coprocessor  |
|03| PORTS| 2| I/O Ports and timers  |
|02| SOFT| 1| Reserved for software initiated interrupt.  |
|01| DSKBLK| 1| Disk block finished  |
|00| TBE| 1| Serial port transmit buffer empty|

