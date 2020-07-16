**Strobe for horiz sync with VB (vert blank) and EQU**

One of the first 3 strobe addresses above, it is placed on the RGA bus during the first refresh time slot of every other line, to identify lines with long counts (228- NTSC, HTOTAL+2- VARBEAMEN=1 hires chips only).There are 4 refresh time slots and any not used for strobes will leave a null (1FE) address on the RGA bus.

