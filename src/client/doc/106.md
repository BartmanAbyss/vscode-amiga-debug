**Bit Plane Control Register (enhanced bits)**

|Bit| Function| Description  |
|---|---|---  |
|15-13| BANKx| Selects one of eight color banks, x = 0-2.  |
|12-10| PF2OFx| Determine bit plane color table offset when playfield 2 has priority in dual playfield mode : 000 : none 001 : 2 (plane 2 affected) 010 : 4 (plane 3 affected) 011 : 8 (plane 3 affected) (default) 100 : 16 (plane 5 affected) 101 : 32 (plane 6 affected) 110 : 64 (plane 7 affected) 111 : 128 (plane 8 affected)  |
|09| LOCT=0| Dictates that subsequent color palette values will be written to a second 12-bit color palette, constituting the RGB low minus order bits. Writes to the normal hi minus order color palette automattically copied to the low order for backwards compatibility.  |
|08| x| Don`t care but drive to 0 for upward compatibility  |
|07-06| SPRESx=0| Determine resolution of all 8 sprites (x = 0,1): 00 : ECS defaults (LORES, HIRES=140ns, SHRES=70ns) 01 : LORES (140ns) 10 : HIRES (70ns) 11 : SHRES (35ns)  |
|05| BRDRBLNK=0| "Border area" is blanked instead of color (0). Disabled when ECSENA low.  |
|04| BRDNTRAN=0| "Border area" is non minus transparant (ZD pin is low when border is displayed). Disabled when ECSENA low.  |
|03| x| Don`t care but drive to 0 for upward compatibility  |
|02| ZDCLKEN=0| ZD pin outputs a 14MHz clock whose falling edge coincides with hires (7MHz) video data. this bit when set disables all other ZD functions. Disabled when ESCENA low.  |
|01| BRDSPRT=0| Enables sprites outside the display window. disabled when ESCENA low.  |
|00| EXTBLKEN=0| Causes BLANK output to be programmable instead of reflecting internal fixed decodes. Disabled when ESCENA low.|

