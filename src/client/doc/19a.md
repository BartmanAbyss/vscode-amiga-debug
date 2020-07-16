**Color 13**

There are 32 of these registers (xx = 00-31) and together with the banking bits they address the 256 locations in the color palette. There are actually two sets of color regs, selection of which is controlled by the LOCT reg bit. When LOCT = 0 the 4 MSB of red, green and blue video data are selected along with the T bit for genlocks the low order set of registers is also selected as well, so that the 4 bits- values are automatically extended to 8 bits.This provides compatibility with old software. If the full range of palette values are desired, then LOCT can be set high and independent values for the 4 LSB of red, green and blue can be written. The low order color registers do not contain a transparency (T) bit.The table below shows the color register bit usage.The table below shows the color register bit usage.

| Bit| 15| 14| 13| 12| 11| 10| 09| 08| 07| 06| 05| 04| 03| 02| 01| 00  |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---  |
|LOCT=0| T| 0| 0| 0| R7| R6| R5| R4| G7| G6| G5| G4| B7| B6| B5| B4  |
|LOCT=1| 0| 0| 0| 0| R3| R2| R1| R0| G3| G2| G1| G0| B3| B2| B1| B0|

T = TRANSPARENCY, R = RED, G = GREEN, B = BLUET bit of COLOR00 thru COLOR31 sets ZD_pin HI, When that color is T bit of COLOR00 thru COLOR31 sets ZD_pin HI, When that color is selected in all video modes.

