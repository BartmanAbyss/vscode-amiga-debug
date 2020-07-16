**Serial port period and control**

This register contains the control bit LONG referred to above, and a 15 bit number defining the serial port Baud rate. If this number is N,then the baud rate is 1 bit every (N+1)*.2794 microseconds.

| Bit| Function| Description  |
|---|---|---  |
|15| LONG| Defines serial receive as 9 bit word.  |
|14-00| RATE| Defines baud rate=1/((N+1)*.2794 microseconds)|

