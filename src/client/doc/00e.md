**Collision detection register (read and clear)**

This address reads (and clears) the collision detection reg. The bit assignments are :  
  
*Note: Playfield 1 is all odd numbered enabled bit planes. Playfield 2 is all even numbered enabled bit planes.*

| Bit| Collision registered  |
| ---|---  |
| 15| Not used  |
| 14| Sprite 4 (or 5) to Sprite 6 (or 7)  |
| 13| Sprite 2 (or 3) to Sprite 6 (or 7)  |
| 12| Sprite 2 (or 3) to Sprite 4 (or 5)  |
| 11| Sprite 0 (or 1) to Sprite 6 (or 7)  |
| 10| Sprite 0 (or 1) to Sprite 4 (or 5)  |
| 09| Sprite 0 (or 1) to Sprite 2 (or 3)  |
| 08| Playfield 2 to Sprite 6 (or 7)  |
| 07| Playfield 2 to Sprite 4 (or 5)  |
| 06| Playfield 2 to Sprite 2 (or 3)  |
| 05| Playfield 2 to Sprite 0 (or 1)  |
| 04| Playfield 1 to Sprite 6 (or 7)  |
| 03| Playfield 1 to Sprite 4 (or 5)  |
| 02| Playfield 1 to Sprite 2 (or 3)  |
| 01| Playfield 1 to Sprite 0 (or 1)  |
| 00| Playfield 1 to Playfield 2|

