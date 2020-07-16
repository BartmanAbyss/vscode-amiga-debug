**Audio Channel 2 data**

This reg is the audio channel x (x=0,1,2,3) DMA data buffer. It contains 2 bytes of data (each byte is a twos complement signed integer) that are outputted sequentially (with digital to analog conversion)to the audio output pins. With maximum volume, each byte can drive the audio outputs with 0.8 volts (peak to peak,type). The audio DMA channel controller automatically transfers data to this reg from RAM. The processor can also write directly to this reg. When the DMA data is finished (words outputted = length) and the data in this reg has been used, an audio channel interrupt request is set.

