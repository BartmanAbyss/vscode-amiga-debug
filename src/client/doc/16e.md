**Sprite 5 image data register B**

These registers buffer the sprite image data. They are usually loaded by the sprite DMA channel but may be loaded by either processor at any time. When a horizontal coincidence occurs the buffers are dumped into shift registers and serially outputted to the display, MSB first on the left.  
  
> > Note: Note: Writing to the A buffer enables (arms) the sprite. Writing to the [SPRxCTL](/hardware:sprxctl) registers disables the sprite. If enabled, data in the A and B buffers will be output whenever the beam counter equals the sprite horizontal position value in the [SPRxPOS](/hardware:sprxpos) register. In lowres mode, 1 sprite pixel is 1 bitplane pixel wide.In HRES and SHRES mode, 1 sprite pixel is 2 bitplane pixels. The DATB bits are the 2SBs (worth 2) for the color registers, and MSB for SHRES. DATA bits are LSBs of the pixels.

