   IFND  GRAPHICS_COPPER_I
GRAPHICS_COPPER_I SET	1
**
**	$VER: copper.i 39.14 (11.8.1993)
**	Includes Release 45.1
**
**	graphics copper list intruction definitions
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
**

    IFND    EXEC_TYPES_I
    include 'exec/types.i'
    ENDC

COPPER_MOVE equ 0	* pseude opcode for move #XXXX,dir
COPPER_WAIT equ 1	* pseudo opcode for wait y,x
CPRNXTBUF   equ 2	* continue processing with next buffer
CPR_NT_LOF  equ $8000	* copper instruction only for short frames
CPR_NT_SHT  equ $4000	* copper instruction only for long frames
CPR_NT_SYS  equ $2000	* copper user instruction only

   STRUCTURE   CopIns,0
      WORD  ci_OpCode	      * 0 = move, 1 = wait
      STRUCT   ci_nxtlist,0   * UNION
      STRUCT   ci_VWaitPos,0
      STRUCT   ci_DestAddr,2

      STRUCT   ci_HWaitPos,0
      STRUCT   ci_DestData,2

   LABEL ci_SIZEOF

* structure of cprlist that points to list that hardware actually executes
   STRUCTURE   cprlist,0
      APTR  crl_Next
      APTR  crl_start
      WORD  crl_MaxCount
   LABEL crl_SIZEOF

   STRUCTURE   CopList,0
      APTR  cl_Next	   * next block for this copper list
      APTR  cl__CopList    * system use
      APTR  cl__ViewPort   * system use
      APTR  cl_CopIns	   * start of this block
      APTR  cl_CopPtr	   * intermediate ptr
      APTR  cl_CopLStart   * mrgcop fills this in for Long Frame
      APTR  cl_CopSStart   * mrgcop fills this in for Short Frame
      WORD  cl_Count	   * intermediate counter
      WORD  cl_MaxCount    * max # of copins for this block
      WORD  cl_DyOffset    * offset this copper list vertical waits
	IFD	V1_3
	  APTR	 cl_Cop2Start
      APTR   cl_Cop3Start
      APTR   cl_Cop4Start
      APTR   cl_Cop5Start
	ENDC
      WORD  cl_SLRepeat
      WORD  cl_PrivateFlags	; NB - this was cl_Flags, but has been
				; changed to avoid conflict with intuition's
      				; IClass structure. This field is private
      				; anyway, and no one should be affected.
   LABEL cl_SIZEOF

EXACT_LINE	EQU	1
HALF_LINE	EQU	2

   STRUCTURE   UCopList,0
      APTR     ucl_Next
      APTR     ucl_FirstCopList * head node of this copper list
      APTR     ucl_CopList      * node in use
   LABEL ucl_SIZEOF

*  private graphics data structure
*  hands off!
   STRUCTURE   copinit,0
	STRUCT	copinit_vsync_hblank,4
	STRUCT	copinit_diagstrt,24
	STRUCT  copinit_fm0,4
	STRUCT	copinit_diwstart,20
	STRUCT	copinit_bplcon2,4
	STRUCT	copinit_sprfix,8*2*2
	STRUCT	copinit_sprstrtup,2*(2*8*2)
	STRUCT	copinit_wait14,2*2
	STRUCT	copinit_norm_hblank,2*2
	STRUCT  copinit_jump,2*2
	STRUCT copinit_wait_forever,6*2
	STRUCT	copinit_sprstop,8*2
   LABEL copinit_SIZEOF

   ENDC	; GRAPHICS_COPPER_I
