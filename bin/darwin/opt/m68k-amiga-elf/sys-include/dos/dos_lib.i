	IFND	DOS_DOS_LIB_I
DOS_DOS_LIB_I	SET	1
**
**	$VER: dos_lib.i 36.1 (4.11.1990)
**	Includes Release 45.1
**
**	Library interface offsets for DOS library
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
**

reserve EQU	4
vsize	EQU	6
count	SET	-vsize*(reserve+1)
LIBENT	MACRO
_LVO\1	EQU	count
count	SET	count-vsize
	ENDM
*
*
*
   LIBENT   Open
   LIBENT   Close
   LIBENT   Read
   LIBENT   Write
   LIBENT   Input
   LIBENT   Output
   LIBENT   Seek
   LIBENT   DeleteFile
   LIBENT   Rename
   LIBENT   Lock
   LIBENT   UnLock
   LIBENT   DupLock
   LIBENT   Examine
   LIBENT   ExNext
   LIBENT   Info
   LIBENT   CreateDir
   LIBENT   CurrentDir
   LIBENT   IoErr
   LIBENT   CreateProc
   LIBENT   Exit
   LIBENT   LoadSeg
   LIBENT   UnLoadSeg
   LIBENT   GetPacket
   LIBENT   QueuePacket
   LIBENT   DeviceProc
   LIBENT   SetComment
   LIBENT   SetProtection
   LIBENT   DateStamp
   LIBENT   Delay
   LIBENT   WaitForChar
   LIBENT   ParentDir
   LIBENT   IsInteractive
   LIBENT   Execute

	ENDC	; DOS_DOS_LIB_I
