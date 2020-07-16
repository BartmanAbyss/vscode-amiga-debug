**Pot pin data read**

SERDATR - Serial port data and status read.  
  
# Overview

This address reads data from a recive data buffer. Data in this This address reads data from a recive data buffer. Data in this buffer is loaded from a receiving shift register whenever it is full. Several interrupt request bits are also read at this address, along with the data as shown below.

| Bit| Function| Description  |
|---|---|---  |
|15| OVRUN| Serial port receiver overun  |
|14| RBF| Serial port receive buffer full (mirror)  |
|13| TBE| Serial port transmit buffer empty (mirror)  |
|12| TSRE| Serial port transmit shift reg. empty  |
|11| RXD| RXD pin receives UART serial data for direct bit test by the micro.  |
|10| X| Not used.  |
|09| STP| Stop bit  |
|08| STP-DB8| Stop bit if LONG, data bit if not.  |
|07| DB7| Data bit.  |
|06| DB6| Data bit.  |
|05| DB5| Data bit.  |
|04| DB4| Data bit.  |
|03| DB3| Data bit.  |
|02| DB2| Data bit.  |
|01| DB1| Data bit.  |
|00| DB0| Data bit.|

