**Display data fetch start (horizontal position)**

These registers control the horizontal timing of the beginning and end of the bit plane DMA timing display data fetch. The vertical bit plane DMA timing is identical to the display windows described above. The bit plane Modulos are dependent on the bit plane horizontal size, and on this data fetch window size.Register bit assignment :Register bit assignment :

| Bit| 15| 14| 13| 12| 11| 10| 09| 08| 07| 06| 05| 04| 03| 02| 01| 00  |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---  |
|| 0| 0| 0| 0| 0| 0| 0| 0| H8| H7| H6| H5| H4| H3| H2| 0|

The tables below show the start and stop timing for different register contentsDDFSTRT (Left edge of display data fetch) :DDFSTRT (Left edge of display data fetch) :

| PURPOSE| H8| H7| H6| H5| H4  |
|---|---|---|---|---|---  |
|Extra wide (max)| 0| 0| 1| 0| 1  |
|wide| 0| 0| 1| 1| 0  |
|normal| 0| 0| 1| 1| 1  |
|narrow| 0| 1| 0| 0| 0|

DDFSTOP (Right edge of display data fetch) :

| PURPOSE| H8| H7| H6| H5| H4  |
|---|---|---|---|---|---  |
|narrow| 1| 1| 0| 0| 1  |
|normal| 1| 1| 0| 1| 0  |
|wide (max)| 1| 1| 0| 1| 1|

Note that these numbers will vary with variable beam counter mode set: (The maxes and mins, that is).

