**Coprocessor control register**

This is a-1 bit register that when set true, allows the coprocessor to access the blitter hardware. This bit is cleared power on reset, so that the coprocessor cannot access the blitter hardware.

| BIT#| NAME| FUNCTION  |
|---|---|---  |
|01| CDANG| Coprocessor danger mode. Allows coprocessor access to all RGA registers if true. (if 0, access to RGA>DFF07E) (On old chips access to only RGA>DFF03E if CDANG=1) (see VPOSR)|

