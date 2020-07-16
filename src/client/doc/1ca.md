**Vertical position for VSYNC stop**

It`s the line number to reset the counter, so there`s this many + 1 in a field. The exception is if the LACE bit is set ([BPLCON0](/hardware:bplcon0)), in which case every other field is this many + 2 and the short field is this many + 1.

