**UHRES sprite vertical display stop**

|Bit| 15| 14| 13| 12| 11| 10| 09| 08| 07| 06| 05| 04| 03| 02| 01| 00  |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---  |
||SPRHWRM| 0| 0| 0| 0| 0| V10| V9| V8| V7| V6| V5| V4| V3| V2| V1| V0|

SPRHWRM = Swaps the polarity of ARW* when the SPRHDAT comes out so that external devices can detect the RGA and put things into memory. (ECS and later chips only)

