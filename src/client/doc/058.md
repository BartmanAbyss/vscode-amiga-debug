**Blitter start and size (width, height)**

This register contains the width and height of the blitter operation (in line mode width must = 2, height = line length). Writing to this register will start the Blitter, and should be done last, after all pointers and control registers have been initialized.

| Bit| 15| 14| 13| 12| 11| 10| 09| 08| 07| 06| 05| 04| 03| 02| 01| 00  |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---  |
|| H9| H8| H7| H6| H5| H4| H3| H2| H1| H0| W5| W4| W3| W2| W1| W0|

H = Height = Vertical lines (10 bits = 1024 lines max) W = Width = Horiz pixels (6 bits = 64 words = 1024 pixels max)

