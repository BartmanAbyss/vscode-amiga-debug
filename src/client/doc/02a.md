**Write most sig. bits (and frame flop)**

|Bit| 15| 14| 13| 12| 11| 10| 09| 08| 07| 06| 05| 04| 03| 02| 01| 00  |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---  |
|| LOF| I6| I5| I4| I3| I2| I1| I0| LOL| xx| xx| xx| xx| V10| V9| V8|

LOF = Long frame(auto toggle control bit in BPLCON0)I0-I6 Chip identification:I0-I6 Chip identification:  
  
  * 8361 (Regular) or 8370 (Fat) (Agnus-NTSC) = 10
  * 8367 (Pal) or 8371 (Fat-Pal) (Agnus-PAL) = 00
  * 8372 (Fat-hr) (agnushr),thru rev4 = 20 PAL, 30 NTSC
  * 8372 (Fat-hr) (agnushr),rev 5 = 22 PAL, 31 NTSC
  * 8374 (Alice) thru rev 2 = 22 PAL, 32 NTSC
  * 8374 (Alice) rev 3 thru rev 4 = 23 PAL, 33 NTSC

LOL = Long line bit. When low, it indicates short raster line.LOL = Long line bit. When low, it indicates short raster line.V9,10 xx Hires chips only (20,30 identifiers)V9,10 xx Hires chips only (20,30 identifiers)

