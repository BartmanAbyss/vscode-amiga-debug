**Disk data byte and status read**

This register is the Disk-Microprocessor data buffer. Data from the disk (in read mode) is loaded into this register one byte at a time, and bit 15 (DSKBYT) is set true.

| Bit| Function| Description  |
|---|---|---  |
|15| DSKBYT| Disk byte ready (reset on read)  |
|14| DMAON| DMAEN (DSKLEN) & DMAEN (DMACON) & DSKEN (DMACON)  |
|13| DISKWRITE| Mirror of bit 14 (WRITE) in DSKLEN  |
|12| WORDEQUAL| This bit true only while DSKSYNC register equals the data from disk  |
|11-08| 0| Not used  |
|07-00| DATA| Disk byte data|

