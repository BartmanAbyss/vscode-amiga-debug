	IFND	EXEC_MEMORY_I
EXEC_MEMORY_I	SET	1
**
**	$VER: memory.i 39.3 (20.5.1992)
**	Includes Release 45.1
**
**	Definitions and structures used by the memory allocation system
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
**

    IFND EXEC_NODES_I
    INCLUDE "exec/nodes.i"
    ENDC	; EXEC_NODES_I


*---------------------------------------------------------------------
*
*   Memory List Structures
*
*---------------------------------------------------------------------
*
*   A memory list appears in two forms:  One is a requirements list
*   the other is a list of already allocated memory.  The format is
*   the same, with the reqirements/address field occupying the same
*   position.
*
*   The format is a linked list of ML structures each of which has
*   an array of ME entries.
*
*---------------------------------------------------------------------

 STRUCTURE ML,LN_SIZE
    UWORD   ML_NUMENTRIES	    ; The number of ME structures that follow
    LABEL   ML_ME		    ; where the ME structures begin
    LABEL   ML_SIZE	;Note: does NOT include any "ME" structures.


 STRUCTURE ME,0
    LABEL   ME_REQS		    ; the AllocMem requirements
    APTR    ME_ADDR		    ; the address of this block (an alias
				    ;	for the same location as ME_REQS)
    ULONG   ME_LENGTH		    ; the length of this region
    LABEL   ME_SIZE


*------ memory options:
*------ see the AllocMem() documentation for details------*

MEMF_ANY	EQU 0		;Any type of memory will do
    BITDEF  MEM,PUBLIC,0
    BITDEF  MEM,CHIP,1
    BITDEF  MEM,FAST,2
    BITDEF  MEM,LOCAL,8		;Memory that does not go away at RESET
    BITDEF  MEM,24BITDMA,9	;DMAable memory within 24 bits of address
    BITDEF  MEM,KICK,10		;Memory that can be used for KickTag stuff

    BITDEF  MEM,CLEAR,16	;AllocMem: NULL out area before return
    BITDEF  MEM,LARGEST,17	;AvailMem: return the largest chunk size
    BITDEF  MEM,REVERSE,18	;AllocMem: allocate from the top down
    BITDEF  MEM,TOTAL,19	;AvailMem: return total size of memory

    BITDEF  MEM,NO_EXPUNGE,31	;AllocMem: Do not cause expunge on failure

*----- Current alignment rules for memory blocks (may increase) -----
MEM_BLOCKSIZE	EQU 8
MEM_BLOCKMASK	EQU (MEM_BLOCKSIZE-1)


*---------------------------------------------------------------------
*
*   Low memory handler data structure
*
* Note:  This structure is *READ ONLY* and only EXEC can create it!
*---------------------------------------------------------------------
 STRUCTURE MemHandlerData,0
    ULONG   memh_RequestSize	; Requested allocation size
    ULONG   memh_RequestFlags	; Requested allocation flags
    ULONG   memh_Flags		; Flags (see blow)
    LABEL   memh_SIZEOF

* Flag definitions:
    BITDEF  MEMH,RECYCLE,0	; 0==First time, 1==recycle

*------ Low Memory handler return values
MEM_DID_NOTHING	EQU	0	; Nothing we could do...
MEM_ALL_DONE	EQU	-1	; We did all we could do
MEM_TRY_AGAIN	EQU	1	; We did some, try the allocation again

*---------------------------------------------------------------------
*
*   Memory Region Header
*
*---------------------------------------------------------------------

 STRUCTURE  MH,LN_SIZE		    ; (LN_TYPE will be set to NT_MEMORY)
    UWORD   MH_ATTRIBUTES	    ; characteristics of this region
    APTR    MH_FIRST		    ; first free region
    APTR    MH_LOWER		    ; lower memory bound
    APTR    MH_UPPER		    ; upper memory bound+1
    ULONG   MH_FREE		    ; number of free bytes
    LABEL   MH_SIZE


*---------------------------------------------------------------------
*
*   Memory Chunk
*
*---------------------------------------------------------------------

 STRUCTURE  MC,0
    APTR    MC_NEXT		    ; ptr to next chunk
    ULONG   MC_BYTES		    ; chunk byte size
    APTR    MC_SIZE

	ENDC	; EXEC_MEMORY_I
