**UHRES (VRAM) bit plane pointer (low 15 bits)**

When UHRES is enabled, this pointer comes out on the 2nd 'free' cycle after the start of each horizontal line. It‘s modulo is added every time it comes out. ’free' means priority above the copper and below the fixed stuff (audio,sprites….). [BPLHDAT](/hardware:bplhmod) comes out as an identifier on the RGA lines when the pointer address is valid so that external detectors can use this to do the special cycle for the VRAMs, The [SPRHDAT](/hardware:sprhdat) gets the first and third free cycles.

