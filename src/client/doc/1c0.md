**Highest colour clock count in horizontal line**

|Bit| 15| 14| 13| 12| 11| 10| 09| 08| 07| 06| 05| 04| 03| 02| 01| 00  |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---  |
|| 0| 0| 0| 0| 0| 0| 0| 0| H8| H7| H6| H5| H4| H3| H2| H1|

Horizontal line has these many + 1 280nS increments. If the pal bit & LOLDIS are not high, long line/short line toggle will occur, and there will be this many +2 every other line. Active if VARBEAMEN=1 or DUAL+1.

