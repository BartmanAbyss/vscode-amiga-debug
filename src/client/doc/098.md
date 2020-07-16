**Collision control**

This register controls which bitplanes are included (enabled) in collision detection, and their required state if included. It also controls the individual inclusion of odd numbered sprites in the collision detection, by logically ORing them with their correspond- ing even numbered sprite. Writing to this register resets the bits in [CLXCON2](/hardware:clxcon2).

| Bit| Function| Description  |
|---|---|---  |
|15| ENSP7| Enable Sprite 7 (ORed with Sprite 6)  |
|14| ENSP5| Enable Sprite 5 (ORed with Sprite 4)  |
|13| ENSP3| Enable Sprite 3 (ORed with Sprite 2)  |
|12| ENSP1| Enable Sprite 1 (ORed with Sprite 0)  |
|11| ENSP6| Enable bit plane 6 (match reqd. for collision)  |
|10| ENSP5| Enable bit plane 5 (match reqd. for collision)  |
|09| ENSP4| Enable bit plane 4 (match reqd. for collision)  |
|08| ENSP3| Enable bit plane 3 (match reqd. for collision)  |
|07| ENSP2| Enable bit plane 2 (match reqd. for collision)  |
|06| ENSP1| Enable bit plane 1 (match reqd. for collision)  |
|05| ENSP6| Match value for bit plane 6 collision  |
|04| ENSP5| Match value for bit plane 5 collision  |
|03| ENSP4| Match value for bit plane 4 collision  |
|02| ENSP3| Match value for bit plane 3 collision  |
|01| ENSP2| Match value for bit plane 2 collision  |
|00| ENSP1| Match value for bit plane 1 collision|

