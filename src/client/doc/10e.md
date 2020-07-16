**Extended Collision Control**

This reg controls when bit planes 7 and 8 are included in collision detection, and there required state if included. Contents of this register are reset by a write to [CLXCON](/hardware:clxcon). ***BITS INITIALIZED BY RESET** * ***BITS INITIALIZED BY RESET** *

| Bit| Function| Description  |
|---|---|---  |
|15-08| | Unused  |
|07| ENBP8| Enable bit plane 8 (match reqd. for collision)  |
|06| ENBP7| Enable bit plane 7 (match reqd. for collision)  |
|05-02| | Unused  |
|01| MVBP8| Match value for bit plane 8 collision  |
|00| MVBP7| Match value for bit plane 7 collision|

> Note: Disable bit planes cannot prevent collisions. Therefore if all bitplanes are disabled, collision will be continuous, regardless of the match values.

