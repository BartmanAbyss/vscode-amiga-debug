**Denise/Lisa (video out chip) revision level**

The original Denise (8362) does not have this register, so whatever value is left over on the bus from the last cycle will be there. ECS Denise (8373) returns hex (fc) in the lower 8 bits.Lisa returns hex (f8). The upper 8 bits of this Register are loaded from the serial mouse bus, and are reserved for future hardware implentation.The 8 low-order bits are encoded as follows :The 8 low-order bits are encoded as follows :

| Bit| Description  |
|---|---  |
|7-4| Lisa/Denise/ECS Denise Revision level(decrement to bump revision level, hex F represents 0th rev. level).  |
|3| Maintain as a 1 for future generation  |
|2| When low indicates AA feature set (LISA)  |
|1| When low indicates ECS feature set (LISA or ECS DENISE)  |
|0| Maintain as a 1 for future generation|

A proposed way to detect chip's revision through hardware poking :  
      
    
    is_AGA:    move.w 0xdff07c,d0        moveq  #31-1,d2    and.w  #0xff,d0check_loop:    move.w 0xdff07C,d1    and.w  #0xff,d1    cmp.b  d0,d1    bne.b  not_AGA    dbf    d2,check_loop    or.b   #0xf0,d0    cmp.b  #0xf8,d0    bne.b  not_AGA    moveq  #1,d0    rtsnot_AGA:    moveq  #0,d0    rts  
  
---

