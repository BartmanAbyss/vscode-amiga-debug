	IFND	DEVICES_CD_I
DEVICES_CD_I SET	1
**
**	$VER: cd.i 40.12 (12.8.1993)
**	Includes Release 45.1
**
**	cd.device include file
**
**	(C) Copyright 1992-2001 Amiga, Inc.
**	    All Rights Reserved
**

	INCLUDE "exec/types.i"
	INCLUDE "exec/nodes.i"

************************************************************************
*								       *
*   CD Commands						       *
*								       *
************************************************************************

CD_RESET	    equ  1
CD_READ	    equ  2
CD_WRITE	    equ  3
CD_UPDATE	    equ  4
CD_CLEAR	    equ  5
CD_STOP	    equ  6
CD_START	    equ  7
CD_FLUSH	    equ  8
CD_MOTOR	    equ  9
CD_SEEK	    equ 10
CD_FORMAT	    equ 11
CD_REMOVE	    equ 12
CD_CHANGENUM	    equ 13
CD_CHANGESTATE	    equ 14
CD_PROTSTATUS	    equ 15

CD_GETDRIVETYPE     equ 18
CD_GETNUMTRACKS     equ 19
CD_ADDCHANGEINT     equ 20
CD_REMCHANGEINT     equ 21
CD_GETGEOMETRY	    equ 22
CD_EJECT	    equ 23


CD_INFO	    equ 32
CD_CONFIG	    equ 33
CD_TOCMSF	    equ 34
CD_TOCLSN	    equ 35

CD_READXL	    equ 36

CD_PLAYTRACK	    equ 37
CD_PLAYMSF	    equ 38
CD_PLAYLSN	    equ 39
CD_PAUSE	    equ 40
CD_SEARCH	    equ 41

CD_QCODEMSF	    equ 42
CD_QCODELSN	    equ 43
CD_ATTENUATE	    equ 44

CD_ADDFRAMEINT	    equ 45
CD_REMFRAMEINT	    equ 46

************************************************************************
*								       *
*   Device Driver Error Codes					       *
*								       *
************************************************************************

CDERR_OPENFAIL		equ -1	    ; device/unit failed to open
CDERR_ABORTED		equ -2	    ; request terminated early
CDERR_NOCMD		equ -3	    ; command not supported by device
CDERR_BADLENGTH	equ -4	    ; invalid length (IO_LENGTH/IO_OFFSET)
CDERR_BADADDRESS	equ -5	    ; invalid address (IO_DATA misaligned)
CDERR_UNITBUSY		equ -6	    ; device opens ok, but unit is busy
CDERR_SELFTEST		equ -7	    ; hardware failed self-test

CDERR_NotSpecified	equ 20	    ; general catchall
CDERR_NoSecHdr		equ 21	    ; couldn't even find a sector         
CDERR_BadSecPreamble    equ 22      ; sector looked wrong                 
CDERR_BadSecID          equ 23      ; ditto                               
CDERR_BadHdrSum         equ 24      ; header had incorrect checksum       
CDERR_BadSecSum         equ 25      ; data had incorrect checksum         
CDERR_TooFewSecs        equ 26      ; couldn't find enough sectors
CDERR_BadSecHdr	equ 27	    ; another "sector looked wrong"
CDERR_WriteProt	equ 28	    ; can't write to a protected disk     
CDERR_NoDisk            equ 29      ; no disk in the drive                
CDERR_SeekError         equ 30      ; couldn't find track 0
CDERR_NoMem		equ 31	    ; ran out of memory
CDERR_BadUnitNum	equ 32	    ; asked for a unit > NUMUNITS
CDERR_BadDriveType	equ 33	    ; not a drive cd.device understands
CDERR_DriveInUse	equ 34	    ; someone else allocated the drive
CDERR_PostReset	equ 35	    ; user hit reset; awaiting doom
CDERR_BadDataType	equ 36	    ; data on disk is wrong type
CDERR_InvalidState	equ 37	    ; invalid cmd under current conditions

CDERR_Phase		equ 42	    ; illegal or unexpected SCSI phase
CDERR_NoBoard		equ 50	    ; open failed for non-existant board



************************************************************************
*								       *
* Configuration						       *
*								       *
*	The drive is configured by TagList items defined as follows:   *
*								       *
************************************************************************

TAGCD_PLAYSPEED	equ	$0001
TAGCD_READSPEED	equ	$0002
TAGCD_READXLSPEED	equ	$0003
TAGCD_SECTORSIZE	equ	$0004
TAGCD_XLECC		equ	$0005
TAGCD_EJECTRESET	equ	$0006

************************************************************************
*								       *
* Information							       *
*								       *
*      Information/Status structure describes current speed settings   *
*      for read and play commands, sector size, audio attenuation      *
*      precision, and drive status.				       *
*								       *
************************************************************************

 STRUCTURE CDINFO,0
				 ;				  Default
    UWORD  CDINFO_PlaySpeed	 ; Audio play speed		  (75)
    UWORD  CDINFO_ReadSpeed	 ; Data-rate of CD_READ command   (Max)
    UWORD  CDINFO_ReadXLSpeed	 ; Data-rate of CD_READXL command (75)
    UWORD  CDINFO_SectorSize	 ; Number of bytes per sector	  (2048)
    UWORD  CDINFO_XLECC	 ; CDXL ECC enabled/disabled
    UWORD  CDINFO_EjectReset	 ; Reset on eject enabled/disabled
    STRUCT CDINFO_Reserved1,8	 ; Reserved for future expansion

    UWORD  CDINFO_MaxSpeed	 ; Maximum speed drive can handle (75, 150)
    UWORD  CDINFO_AudioPrecision ; 0 = no attenuator, 1 = mute only,
				 ; other = (# levels - 1)
    UWORD  CDINFO_Status	 ; See flags below
    STRUCT CDINFO_Reserved2,8	 ; Reserved for future expansion

    LABEL  CDINFO_SIZE


; Flags for Status

CDSTSB_CLOSED	    equ 0	 ; Drive door is closed
CDSTSB_DISK	    equ 1	 ; A disk has been detected
CDSTSB_SPIN	    equ 2	 ; Disk is spinning (motor is on)
CDSTSB_TOC	    equ 3	 ; Table of contents read.  Disk is valid.
CDSTSB_CDROM	    equ 4	 ; Track 1 contains CD-ROM data
CDSTSB_PLAYING	    equ 5	 ; Audio is playing
CDSTSB_PAUSED	    equ 6	 ; Pause mode (pauses on play command)
CDSTSB_SEARCH	    equ 7	 ; Search mode (Fast Forward/Fast Reverse)
CDSTSB_DIRECTION    equ 8	 ; Search direction (0 = Forward, 1 = Reverse)

CDSTSF_CLOSED	    equ $0001
CDSTSF_DISK	    equ $0002
CDSTSF_SPIN	    equ $0004
CDSTSF_TOC	    equ $0008
CDSTSF_CDROM	    equ $0010
CDSTSF_PLAYING	    equ $0020
CDSTSF_PAUSED	    equ $0040
CDSTSF_SEARCH	    equ $0080
CDSTSF_DIRECTION    equ $0100

; Modes for CD_SEARCH

CDMODE_NORMAL	equ 0	    ; Normal play at current play speed
CDMODE_FFWD	equ 1	    ; Fast forward play (skip-play forward
CDMODE_FREV	equ 2	    ; Fast reverse play (skip-play reverse


************************************************************************
*								       *
* Position Information						       *
*								       *
*      Position information can be described in two forms: MSF and LSN *
*      form.  MSF (Minutes, Seconds, Frames) form is a time encoding.  *
*      LSN (Logical Sector Number) form is frame (sector) count.       *
*      The desired form is selected using the io_Flags field of the    *
*      IOStdReq structure.  The flags and the union are described      *
*      below.							       *
*								       *
************************************************************************

 STRUCTURE RMSF,0

    UBYTE   Reserved	    ; Reserved (always zero)
    UBYTE   Minute	    ; Minutes (0-72ish)
    UBYTE   Second	    ; Seconds (0-59)
    UBYTE   Frame	    ; Frame   (0-74)
    LABEL   RMSF_SIZE

;UNION

LSNMSF_SIZE	equ RMSF_SIZE


************************************************************************
*								       *
* CD Transfer Lists						       *
*								       *
*      A CDXL node is a double link node; however only single linkage  *
*      is used by the device driver.  If you wish to construct a       *
*      transfer list manually, it is only neccessary to define the     *
*      mln_Succ pointer of the MinNode.  You may also use the Exec     *
*      list functions by defining a List or MinList structure and by   *
*      using the AddHead/AddTail functions to create the list.	This   *
*      will create a double-linked list.  Although a double-linked     *
*      list is not required by the device driver, you may wish use it  *
*      for your own purposes.  Don't forget to initialize the          *
*      the List/MinList before using it!                               *
*                                                                      *
************************************************************************

 STRUCTURE CDXL,0

    STRUCT  CDXL_Node,MLN_SIZE      ; double linkage      
    APTR    CDXL_Buffer             ; data destination (word aligned) 
    LONG    CDXL_Length             ; must be even # bytes
    LONG    CDXL_Actual             ; bytes transferred   
    APTR    CDXL_IntData            ; interrupt server data segment
    APTR    CDXL_IntCode            ; interrupt server code entry
    LABEL   CDXL_SIZE


************************************************************************
*                                                                      *
* CD Table of Contents                                                 *
*                                                                      *
*      The CD_TOC command returns an array of CDTOC entries.           *
*      Entry zero contains summary information describing how many     *
*      tracks the disk has and the play-time of the disk.              *
*      Entries 1 through N (N = Number of tracks on disk) contain      *
*      information about the track.                                    *
*                                                                      *
************************************************************************

 STRUCTURE TOCSummary,0

    UBYTE   TOCS_FirstTrack          ; First track on disk (always 1)         
    UBYTE   TOCS_LastTrack           ; Last track on disk                     
    STRUCT  TOCS_LeadOut,LSNMSF_SIZE ; Beginning of lead-out (end of disk)
    LABEL   TOCSummary_SIZE


 STRUCTURE TOCEntry,0

    UBYTE   TOCE_CtlAdr                 ; Q-Code info                 
    UBYTE   TOCE_Track                  ; Track number                
    STRUCT  TOCE_Position,LSNMSF_SIZE   ; Start position of this track
    LABEL   TOCEntry_SIZE


;UNION

CDTOC_SIZE      equ TOCEntry_SIZE


************************************************************************
*                                                                      *
* Q-Code Packets                                                       *
*                                                                      *
*      Q-Code packets are only returned when audio is playing.         *
*      Currently, only position packets are returned (ADR_POSITION)    *
*      The other ADR_ types are almost never encoded on the disk       *
*      and are of little use anyway.  To avoid making the QCode        *
*      structure a union, these other ADR_ structures are not defined. *
*                                                                      *
************************************************************************

 STRUCTURE QCODE,0

    UBYTE   QCODE_CtlAdr                    ; Data type / QCode type          
    UBYTE   QCODE_Track                     ; Track number                    
    UBYTE   QCODE_Index                     ; Track subindex number           
    UBYTE   QCODE_Zero                      ; The "Zero" byte of Q-Code packet
    STRUCT  QCODE_TrackPosition,LSNMSF_SIZE ; Position from start of track    
    STRUCT  QCODE_DiskPosition,LSNMSF_SIZE  ; Position from start of disk     
    LABEL   QCODE_SIZE


CTLADR_CTLMASK  equ $F0     ; Control field

CTL_CTLMASK     equ $D0     ; To be ANDed with CtlAdr before compared

CTL_2AUD        equ $00     ; 2 audio channels without preemphasis            
CTL_2AUDEMPH    equ $10     ; 2 audio channels with preemphasis               
CTL_4AUD        equ $80     ; 4 audio channels without preemphasis            
CTL_4AUDEMPH    equ $90     ; 4 audio channels with preemphasis               
CTL_DATA        equ $40     ; CD-ROM Data                                     

CTL_COPYMASK    equ $20     ; To be ANDed with CtlAdr before compared

CTL_COPY        equ $20     ; When true, this audio/data can be copied        

CTLADR_ADRMASK  equ $0F     ; Address field

ADR_POSITION    equ $01     ; Q-Code is position information                  
ADR_UPC         equ $02     ; Q-Code is UPC information (not used)   
ADR_ISRC        equ $03     ; Q-Code is ISRC (not used)
ADR_HYBRID      equ $05     ; This disk is a hybrid disk


        ENDC
