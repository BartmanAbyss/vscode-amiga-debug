**Pot counter data right pair (vert, horiz)**

These addresses each read a pair of 8 bit pot counters. (4 counters total). The bit assignment for both addresses is shown below. The counters are stopped by signals from 2 controller connectors (left-right) with 2 pins each.

| Bit| 15| 14| 13| 12| 11| 10| 09| 08| 07| 06| 05| 04| 03| 02| 01| 00  |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---  |
|RIGHT| Y7| Y6| Y5| Y4| Y3| Y2| Y1| Y0| X7| X6| X5| X4| X3| X2| X1| X0  |
|LEFT| Y7| Y6| Y5| Y4| Y3| Y2| Y1| Y0| X7| X6| X5| X4| X3| X2| X1| X0|

|Connector| Paula  |
|---|---  |
|Loc.| Dir.| Sym.| Pin| Pin  |
|RIGHT| Y| RX| 9| 33  |
|RIGHT| X| RX| 5| 32  |
|LEFT| Y| LY| 9| 36  |
|LEFT| X| LX| 5| 35|

With normal (NTSC or PAL) horiz. line rate, the pots will give a full scale (FF) reading with about 500kohms in one frame time. With proportionally faster horiz line times, the counters will count proportionally faster. This should be noted when doing variable beam displays.

