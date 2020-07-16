**Sprite 1 position and control data**

|Bit| Function| Description  |
|---|---|---  |
|15-08| EV7-EV0| End (stop) vertical value. Low 8 bits  |
|07| ATT| Sprite attach control bit (odd sprites only)  |
|06| SV9| Start vertical value 10th bit  |
|05| EV9| End (stop) vertical value 10th bit  |
|04| SH1=0| Start horizontal value, 70nS increment  |
|03| SH0=0| Start horizontal value 35nS increment  |
|02| SV8| Start vertical value 9th bit  |
|01| EV8| End (stop) vertical value 9th bit  |
|00| SH2| Start horizontal value, 140nS increment|

These registers work together as position, size and feature sprite control registers. They are usually loaded by the sprite DMA channel, during horizontal blank, however they may be loaded by either processor any time. Writing to SPRxCTL disables the corresponding sprite.

