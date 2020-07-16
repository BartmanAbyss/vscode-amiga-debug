**Disk DMA data read (early read dummy address)**

This register is the disk-DMA data buffer.It contains 2 bytes of data that are either sent to (write) or received from (read) the disk. The DMA controller automatically transfers data to or from this register and RAM, and when the DMA data is finished (length=0) it causes a disk block interrupt.

