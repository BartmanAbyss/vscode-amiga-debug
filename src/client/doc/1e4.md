**Display window upper bits for start, stop**

This is an added register for Hires chips, and allows larger start & stop ranges. If it is not written, ([DIWSTRT](/hardware:diwstrt), [DIWSTOP](/hardware:diwstrt)) description holds. If this register is written, direct start & stop positions anywhere on the screen. It doesn't affect the UHRES pointers.

| Bit| 15| 14| 13| 12| 11| 10| 09| 08| 07| 06| 05| 04| 03| 02| 01| 00  |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---  |
|| 0| 0| H10| H1| H0| V10| V9| V8| 0| 0| H10| H1| H0| V10| V9| V8  |
|| (stop)| (start)|

H1 and H0 values define 70ns and 35ns increments respectively, and new LISA bits.  
  
> Note: In all 3 display window registers, horizontal bit positions have been renamed to reflect HIRES pixel increments, e.g. what used to be called H0 is now referred to as H2.

