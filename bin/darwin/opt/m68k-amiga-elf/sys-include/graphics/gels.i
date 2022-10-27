	IFND	GRAPHICS_GELS_I
GRAPHICS_GELS_I	SET	1
**
**	$VER: gels.i 39.0 (21.8.1991)
**	Includes Release 45.1
**
**	include file for AMIGA GELS (Graphics Elements)
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
**

    IFND    EXEC_TYPES_I
    include 'exec/types.i'
    ENDC

*------ VS_vSflags ---------------------------------------------------

*   ;-- user-set vSprite flags --
SUSERFLAGS  EQU $00FF	      ; mask of all user-settable vSprite-flags
    BITDEF  VS,VSPRITE,0      ; set if vSprite, clear if bob
    BITDEF  VS,SAVEBACK,1     ; set if background is to be saved/restored
    BITDEF  VS,OVERLAY,2      ; set to mask image of bob onto background
    BITDEF  VS,MUSTDRAW,3     ; set if vSprite absolutely must be drawn
*   ;-- system-set vSprite flags --
    BITDEF  VS,BACKSAVED,8    ; this bob's background has been saved
    BITDEF  VS,BOBUPDATE,9    ; temporary flag, useless to outside world
    BITDEF  VS,GELGONE,10     ; set if gel is completely clipped (offscreen)
    BITDEF  VS,VSOVERFLOW,11  ; vSprite overflow (if MUSTDRAW set we draw!)


*------ B_flags ------------------------------------------------------
*   ;-- these are the user flag bits --
BUSERFLAGS  EQU $00FF         ; mask of all user-settable bob-flags
    BITDEF  B,SAVEBOB,0       ; set to not erase bob
    BITDEF  B,BOBISCOMP,1     ; set to identify bob as animComp
*   ;-- these are the system flag bits --
    BITDEF  B,BWAITING,8      ; set while bob is waiting on 'after'
    BITDEF  B,BDRAWN,9        ; set when bob is drawn this DrawG pass
    BITDEF  B,BOBSAWAY,10     ; set to initiate removal of bob
    BITDEF  B,BOBNIX,11       ; set when bob is completely removed
    BITDEF  B,SAVEPRESERVE,12 ; for back-restore during double-buffer
    BITDEF  B,OUTSTEP,13      ; for double-clearing if double-buffer


*------ defines for the animation procedures -------------------------

ANFRACSIZE  EQU 6
ANIMHALF    EQU $0020
RINGTRIGGER EQU $0001

*------ macros --------------------------------------------------------
* these are GEL functions that are currently simple enough to exist as a
* definition.  It should not be assumed that this will always be the case

InitAnimate MACRO   * &animKey
       CLR.L   \1
       ENDM


RemBob      MACRO   * &b
       OR.W    #BF_BOBSAWAY,b_BobFlags+\1
       ENDM

*------ VS : vSprite -------------------------------------------------
 STRUCTURE  VS,0    ; vSprite
*   -- SYSTEM VARIABLES --
*   GEL linked list forward/backward pointers sorted by y,x value
    APTR    vs_NextVSprite    ; struct *vSprite
    APTR    vs_PrevVSprite    ; struct *vSprite
*   GEL draw list constructed in the order the bobs are actually drawn, then
*   list is copied to clear list
*   must be here in vSprite for system boundary detection
    APTR    vs_DrawPath       ; struct *vSprite: pointer of overlay drawing
    APTR    vs_ClearPath      ; struct *vSprite: pointer for overlay clearing
*   the vSprite positions are defined in (y,x) order to make sorting
*   sorting easier, since (y,x) as a long integer
    WORD    vs_Oldy           ; previous position
    WORD    vs_Oldx           ;
*   -- COMMON VARIABLES --
    WORD    vs_VSFlags        ; vSprite flags
*   -- USER VARIABLES --
*    the vSprite positions are defined in (y,x) order to make sorting
*    easier, since (y,x) as a long integer
    WORD    vs_Y              ; screen position
    WORD    vs_X
    WORD    vs_Height
    WORD    vs_Width          ; number of words per row of image data
    WORD    vs_Depth          ; number of planes of data
    WORD    vs_MeMask         ; which types can collide with this vSprite
    WORD    vs_HitMask        ; which types this vSprite can collide with
    APTR    vs_ImageData      ; *WORD pointer to vSprite image
*    borderLine is the one-dimensional logical OR of all
*    the vSprite bits, used for fast collision detection of edge
    APTR    vs_BorderLine     ; *WORD: logical OR of all vSprite bits
    APTR    vs_CollMask       ; *WORD: similar to above except this is a 
*    matrix pointer to this vSprite's color definitions (not used by bobs)
    APTR    vs_SprColors      ; *WORD
    APTR    vs_VSBob	      ; struct *bob: points home if this vSprite is
			      ;  part of a bob
*    planePick flag:  set bit selects a plane from image, clear bit selects
*	  use of shadow mask for that plane
*    OnOff flag: if using shadow mask to fill plane, this bit (corresponding
*	  to bit in planePick) describes whether to fill with 0's or 1's
*    There are two uses for these flags:
*	       - if this is the vSprite of a bob, these flags describe how
*		 the bob is to be drawn into memory
*	       - if this is a simple vSprite and the user intends on setting
*		 the MUSTDRAW flag of the vSprite, these flags must be set
*		 too to describe which color registers the user wants for
*		 the image
    BYTE    vs_PlanePick
    BYTE    vs_PlaneOnOff
    LABEL   vs_SUserExt       ; user definable
    LABEL   vs_SIZEOF


*------ BOB : bob ------------------------------------------------------

 STRUCTURE  BOB,0     ; bob: blitter object
*   -- COMMON VARIABLES --
    WORD    bob_BobFlags      ; general purpose flags (see definitions below)
*   -- USER VARIABLES --
    APTR    bob_SaveBuffer    ; *WORD pointer to the buffer for background
*    save used by bobs for "cookie-cutting" and multi-plane masking
    APTR    bob_ImageShadow   ; *WORD
*    pointer to BOBs for sequenced drawing of bobs
*      for correct overlaying of multiple component animations
    APTR    bob_Before	      ; struct *bob: draw this bob before bob pointed
			      ; to by before
    APTR    bob_After	      ; struct *bob: draw this bob after bob pointed
			      ; to by after
    APTR    bob_BobVSprite    ; struct *vSprite: this bob's vSprite definition
    APTR    bob_BobComp       ; struct *animComp: pointer to this bob's
			      ; animComp def
    APTR    bob_DBuffer       ; struct dBufPacket: pointer to this bob's 
                              ; dBuf packet
    LABEL   bob_BUserExt      ; bob user extension
    LABEL   bob_SIZEOF

*------ AC : animComp ------------------------------------------------

 STRUCTURE  AC,0    ; animComp
*   -- COMMON VARIABLES --
    WORD    ac_CompFlags      ; animComp flags for system & user
*    timer defines how long to keep this component active:
*      if set non-zero, timer decrements to zero then switches to nextSeq
*      if set to zero, animComp never switches
    WORD    ac_Timer
*   -- USER VARIABLES --
*    initial value for timer when the animComp is activated by the system
    WORD    ac_TimeSet
*    pointer to next and previous components of animation object
    APTR    ac_NextComp       ; struct *animComp
    APTR    ac_PrevComp       ; struct *animComp
*    pointer to component component definition of next image in sequence
    APTR    ac_NextSeq        ; struct *animComp
    APTR    ac_PrevSeq        ; struct *animComp
    APTR    ac_AnimCRoutine   ; address of special animation procedure
    WORD    ac_YTrans         ; initial y translation (if this is a component)
    WORD    ac_XTrans         ; initial x translation (if this is a component)
    APTR    ac_HeadOb         ; struct *animOb
    APTR    ac_AnimBob        ; struct *bob
    LABEL   ac_SIZE

*------ AO : animOb --------------------------------------------------

 STRUCTURE  AO,0    ; animOb
*   -- SYSTEM VARIABLES --
    APTR    ao_NextOb         ; struct *animOb
    APTR    ao_PrevOb         ; struct *animOb
*    number of calls to Animate this animOb has endured
    LONG    ao_Clock
    WORD    ao_AnOldY         ; old y,x coordinates
    WORD    ao_AnOldX         ;
*   -- COMMON VARIABLES --
    WORD    ao_AnY            ; y,x coordinates of the animOb
    WORD    ao_AnX            ;
*   -- USER VARIABLES --
    WORD    ao_YVel           ; velocities of this object
    WORD    ao_XVel           ;
    WORD    ao_XAccel         ; accelerations of this object
    WORD    ao_YAccel         ;   !!! backwards !!!
    WORD    ao_RingYTrans     ; ring translation values
    WORD    ao_RingXTrans     ;
    APTR    ao_AnimORoutine   ; address of special animation procedure
    APTR    ao_HeadComp       ; struct *animComp: pointer to first component
    LABEL   ao_AUserExt       ; animOb user extension
    LABEL   ao_SIZEOF


*------ DBP : dBufPacket ---------------------------------------------
* dBufPacket defines the values needed to be saved across buffer to buffer
*   when in double-buffer mode

 STRUCTURE  DBP,0             ; dBufPacket
    WORD    dbp_BufY          ; save the other buffers screen coordinates
    WORD    dbp_BufX          ;
    APTR    dbp_BufPath       ; struct *vSprite: carry the draw path over
                              ; the gap
*    these pointers must be filled in by the user
*    pointer to other buffer's background save buffer
    APTR    dbp_BufBuffer     ; *WORD
*    pointer to other buffer's background plane pointers
    APTR    dbp_BufPlanes     ; **WORD
    LABEL   dbp_SIZEOF

	ENDC	; GRAPHICS_GELS_I
