**DMA Control write (clear or set)**

This register controls all of the DMA channels, and contains blitter DMA status bits.

| Bit| Function| Description  |
|---|---|---  |
|15| SET/CLR| Set/Clear control bit. Determines if bits written with a 1 get set or cleared Bits written with a zero are unchanged  |
|14| BBUSY| Blitter busy status bit (read only)  |
|13| BZERO| Blitter logic zero status bit (read only)  |
|12| X|   |
|11| X|   |
|10| BLTPRI| Blitter DMA priority (over CPU micro) (also called "blitter nasty") (disables /BLS pin, preventing micro from stealing any bus cycles while blitter DMA is running)  |
|09| DMAEN| Enable all DMA below (also UHRES DMA)  |
|08| BPLEN| Bit plane DMA enable  |
|07| COPEN| Coprocessor DMA enable  |
|06| BLTEN| Blitter DMA enable  |
|05| SPREN| Sprite DMA enable  |
|04| DSKEN| Disk DMA enable  |
|03| AUD3EN| Audio channel 3 DMA enable  |
|02| AUD2EN| Audio channel 2 DMA enable  |
|01| AUD1EN| Audio channel 1 DMA enable  |
|00| AUD0EN| Audio channel 0 DMA enable|

