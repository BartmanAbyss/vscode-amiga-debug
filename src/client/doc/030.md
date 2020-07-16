**Serial port data and stop bits write**

This address writes data to a transmit data buffer. Data from this buffer is moved into a serial shift register for output transmission whenever it is empty. This sets the interrupt request TBE (transmit buffer empty).A stop bit must be provided as part of the data word. A stop bit must be provided as part of the data word. The length of the data word is set by the position of the stop bit.

| Bit| 15| 14| 13| 12| 11| 10| 09| 08| 07| 06| 05| 04| 03| 02| 01| 00  |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---  |
|| 0| 0| 0| 0| 0| 0| S| D8| D7| D6| D5| D4| D3| D2| D1| D0|

