**Memory Fetch Mode**

This register controls the fetch mechanism for different types of Chip RAM accesses:

| Bit| Function| Description  |
|---|---|---  |
|15| SSCAN2| Global enable for sprite scan-doubling.  |
|14| BSCAN2| Enables the use of 2nd P/F modulus on an alternate line basis to support bitplane scan-doubling.  |
|13-04| Unused|   |
|03| SPAGEM| Sprite page mode (double CAS)  |
|02| SPR32| Sprite 32 bit wide mode  |
|01| BPAGEM| Bitplane Page Mode (double CAS)  |
|00| BLP32| Bitplane 32 bit wide mode|

|BPAGEM| BPL32| Bitplane Fetch| Increment| Memory Cycle| Bus Width  |
|---|---|---|---|---|---  |
|0| 0| By 2 bytes| (as before)| normal CAS| 16  |
|0| 1| By 4 bytes| | normal CAS| 32  |
|1| 0| By 4 bytes| | double CAS| 16  |
|1| 1| By 8 bytes| | double CAS| 32|

|SPAGEM| SPR32| Sprite Fetch| Increment| Memory Cycle| Bus Width  |
|---|---|---|---|---|---  |
|0| 0| By 2 bytes| (as before)| normal CAS| 16  |
|0| 1| By 4 bytes| | normal CAS| 32  |
|1| 0| By 4 bytes| | double CAS| 16  |
|1| 1| By 8 bytes| | double CAS| 32|

