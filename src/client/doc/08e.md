**Display window start (upper left vertical-horizontal position)**

These registers control the display window size and position, by locating the upper left and lower right corners.

| Bit| 15| 14| 13| 12| 11| 10| 09| 08| 07| 06| 05| 04| 03| 02| 01| 00  |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---  |
|| V7| V6| V5| V4| V3| V2| V1| V0| H9| H8| H7| H6| H5| H4| H3| H2|

DIWSTRT is vertically restricted to the upper 2/3 of the display (V8=0), and horizontally restricted to the left 3/4 of the display (H8=0).See [DIWHIGH](/hardware:diwhigh) for exceptions.See [DIWHIGH](/hardware:diwhigh) for exceptions.

