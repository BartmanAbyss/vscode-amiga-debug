**Joystick-mouse 1 data (right vert, horiz)**

These addresses each read a 16 bit register. These in turn are loaded from the MDAT serial stream and are clocked in on the rising edge of SCLK. MLD output is used to parallel load the external parallel-to- serial converter.This in turn is loaded with the 4 quadrature inputs from each of two game controller ports (8 total) plus 8 miscellaneous control bits which are new for LISA and can be read in upper 8 bits of LISAID.Register bits are as follows:Register bits are as follows:Mouse counter usage (pins 1,3 = Yclock, pins 2,4 = Xclock)Mouse counter usage (pins 1,3 = Yclock, pins 2,4 = Xclock)

| Bit| 15| 14| 13| 12| 11| 10| 09| 08| 07| 06| 05| 04| 03| 02| 01| 00  |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---  |
|JOY0DAT| Y7| Y6| Y5| Y4| Y3| Y2| Y1| Y0| X7| X6| X5| X4| X3| X2| X1| X0  |
|JOY1DAT| Y7| Y6| Y5| Y4| Y3| Y2| Y1| Y0| X7| X6| X5| X4| X3| X2| X1| X0|

0 = LEFT CONTROLLER PAIR, 1 = RIGHT CONTROLLER PAIR. (4 counters total).The bit usage for both left and right addresses is shown below. Each 6 bit counter (Y7-Y2,X7-X2) is clocked by 2 of the signals input from the mouse serial stream.Starting with first bit received:Starting with first bit received:

| Serial| Bit name| Description  |
|---|---|---  |
|0| M0H| JOY0DAT Horizontal Clock  |
|1| M0HQ| JOY0DAT Horizontal Clock (quadrature)  |
|2| M0V| JOY0DAT Vertical Clock  |
|3| M0VQ| JOY0DAT Vertical Clock (quadrature)  |
|4| M1V| JOY1DAT Horizontall Clock  |
|5| M1VQ| JOY1DAT Horizontall Clock (quadrature)  |
|6| M1V| JOY1DAT Vertical Clock  |
|7| M1VQ| JOY1DAT Vertical Clock (quadrature)|

Bits 1 and 0 of each counter (Y1-Y0,X1-X0) may be read to determine the state of the related input signal pair. This allows these pins to double as joystick switch inputs. Joystick switch closures can be deciphered as follows:

| Direction| Pin| Counter bits  |
|---|---|---  |
|Forward| 1| Y1 xor Y0 (BIT#09 xor BIT#08)  |
|Left| 3| Y1  |
|Back| 2| X1 xor X0 (BIT#01 xor BIT#00)  |
|Right| 4| X1|

