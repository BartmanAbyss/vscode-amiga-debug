	IFND DATATYPES_PICTURECLASS_I
DATATYPES_PICTURECLASS_I	SET	1
**
**  $VER: pictureclass.i 45.1 (23.10.2000)
**  Includes Release 45.1
**
**  Interface definitions for DataType picture objects.
**
**  Copyright © 1992-2001 Amiga, Inc.
**	All Rights Reserved
**

    IFND UTILITY_TAGITEM_I
    INCLUDE 'utility/tagitem.i'
    ENDC

    IFND DATATYPES_DATATYPESCLASS_I
    INCLUDE 'datatypes/datatypesclass.i'
    ENDC

    IFND LIBRARIES_IFFPARSE_I
    INCLUDE 'libraries/iffparse.i'
    ENDC

;------------------------------------------------------------------------------

PICTUREDTCLASS MACRO
	dc.b 'picture.datatype',0
	ENDM

;------------------------------------------------------------------------------

; Picture attributes

; Mode ID of the picture (ULONG)
PDTA_ModeID			equ (DTA_Dummy + 200)

; Bitmap header information (struct BitMapHeader *)
PDTA_BitMapHeader		equ (DTA_Dummy + 201)

; Pointer to a class-allocated bitmap, that will end
; up being freed by picture.class when DisposeDTObject()
; is called (struct BitMap *).
PDTA_BitMap			equ (DTA_Dummy + 202)

; Picture colour table (struct ColorRegister *)
PDTA_ColorRegisters		equ (DTA_Dummy + 203)

; Color table to use with SetRGB32CM() (ULONG *)
PDTA_CRegs			equ (DTA_Dummy + 204)

; Color table; this table is initialized during the layout
; process and will contain the colours the picture will use
; after remapping. If no remapping takes place, these colours
; will match those in the PDTA_CRegs table (ULONG *).
PDTA_GRegs			equ (DTA_Dummy + 205)

; Shared pen table; this table is initialized during the layout
; process while the picture is being remapped (UBYTE *).
PDTA_ColorTable			equ (DTA_Dummy + 206)

; Shared pen table; in most places this table will be identical to
; the PDTA_ColorTable table. Some of the colours in this table might
; match the original colour palette a little better than the colours
; picked for the other table. The picture.datatype uses the two tables
; during remapping, alternating for each pixel (UBYTE *).
PDTA_ColorTable2		equ (DTA_Dummy + 207)

; OBSOLETE; DO NOT USE
PDTA_Allocated			equ (DTA_Dummy + 208)

; Number of colors used by the picture. (UWORD)
PDTA_NumColors			equ (DTA_Dummy + 209)

; Number of colors allocated by the picture (UWORD)
PDTA_NumAlloc			equ (DTA_Dummy + 210)

; Remap the picture (BOOL); defaults to TRUE
PDTA_Remap			equ (DTA_Dummy + 211)

; Screen to remap to (struct Screen *)
PDTA_Screen			equ (DTA_Dummy + 212)

; Free the source bitmap after remapping (BOOL)
PDTA_FreeSourceBitMap		equ (DTA_Dummy + 213)

; Pointer to a Point structure
PDTA_Grab			equ (DTA_Dummy + 214)

; Pointer to the destination (remapped) bitmap
PDTA_DestBitMap			equ (DTA_Dummy + 215)

; Pointer to class-allocated bitmap, that will end
; up being freed by the class after DisposeDTObject()
; is called (struct BitMap *)
PDTA_ClassBitMap		equ (DTA_Dummy + 216)

; Number of colors used for sparse remapping (UWORD)
PDTA_NumSparse			equ (DTA_Dummy + 217)

; Pointer to a table of pen numbers indicating
; which colors should be used when remapping the image.
; This array must contain as many entries as there
; are colors specified with PDTA_NumSparse (UBYTE *).
PDTA_SparseTable		equ (DTA_Dummy + 218)

; Index number of the picture to load (ULONG). (V44)
PDTA_WhichPicture		equ (DTA_Dummy + 219)

; Get the number of pictures stored in the file (ULONG *). (V44)
PDTA_GetNumPictures		equ (DTA_Dummy + 220)

; Maximum number of colours to use for dithering (ULONG). (V44)
PDTA_MaxDitherPens		equ (DTA_Dummy + 221)

; Quality of the dithering algorithm to be used during colour
; quantization (ULONG). (V44)
PDTA_DitherQuality		equ (DTA_Dummy + 222)

; Pointer to the allocated pen table (UBYTE *). (V44)
PDTA_AllocatedPens		equ (DTA_Dummy + 223)

; Quality for scaling. (V45)
PDTA_ScaleQuality		equ (DTA_Dummy + 224)

;------------------------------------------------------------------------------

; When querying the number of pictures stored in a file, the
; following value denotes "the number of pictures is unknown".

PDTANUMPICTURES_Unknown equ 0

;------------------------------------------------------------------------------

; V43 extensions (attributes)

; Set the sub datatype interface mode (LONG); see "Interface modes" below
PDTA_SourceMode			equ (DTA_Dummy + 250)

; Set the app datatype interface mode (LONG); see "Interface modes" below
PDTA_DestMode			equ (DTA_Dummy + 251)	

; Allocates the resulting bitmap as a friend bitmap (BOOL)
PDTA_UseFriendBitMap		equ (DTA_Dummy + 255)	

; NULL or mask plane for use with BltMaskBitMapRastPort() (PLANEPTR)
PDTA_MaskPlane			equ (DTA_Dummy + 258)

;------------------------------------------------------------------------------

; Interface modes
PMODE_V42 	equ (0)	; Compatibility mode
PMODE_V43 	equ (1)	; Extended mode

;------------------------------------------------------------------------------

; V43 extensions (methods)

PDTM_Dummy 		equ (DTM_Dummy + $60)

; Transfer pixel data to the picture object in the specified format
PDTM_WRITEPIXELARRAY 	equ (PDTM_Dummy + 0)

; Transfer pixel data from the picture object in the specified format
PDTM_READPIXELARRAY 	equ (PDTM_Dummy + 1)

; PDTM_WRITEPIXELARRAY, PDTM_READPIXELARRAY
    STRUCTURE pdtBlitPixelArray,0
    	ULONG	MethodID
	APTR	pbpa_PixelData		; The pixel data to transfer to/from
	ULONG	pbpa_PixelFormat	; Format of the pixel data (see "Pixel Formats" below)
	ULONG	pbpa_PixelArrayMod	; Number of bytes per row
	ULONG	pbpa_Left		; Left edge of the rectangle to transfer pixels to/from
	ULONG	pbpa_Top		; Top edge of the rectangle to transfer pixels to/from
	ULONG	pbpa_Width		; Width of the rectangle to transfer pixels to/from
	ULONG	pbpa_Height		; Height of the rectangle to transfer pixels to/from
    LABEL pdtBlitPixelArray_SIZEOF

; Pixel formats
PBPAFMT_RGB	equ 0	; 3 bytes per pixel (red, green, blue)
PBPAFMT_RGBA	equ 1	; 4 bytes per pixel (red, green, blue, alpha channel)
PBPAFMT_ARGB	equ 2	; 4 bytes per pixel (alpha channel, red, green, blue)
PBPAFMT_LUT8	equ 3	; 1 byte per pixel (using a separate colour map)
PBPAFMT_GREY8	equ 4	; 1 byte per pixel (0==black, 255==white)

;------------------------------------------------------------------------------

; V45 extensions (methods)

; Scale pixel data to the specified size
PDTM_SCALE		equ (PDTM_Dummy + 2)

; PDTM_SCALE
    STRUCTURE pdtScale,0
	ULONG MethodID
	ULONG ps_NewWidth	; The new width the pixel data should have 
	ULONG ps_NewHeight	; The new height the pixel data should have
	ULONG ps_Flags		; should be 0 for now 
    LABEL pdtScale_SIZEOF

;------------------------------------------------------------------------------

; Masking techniques
mskNone			equ 0
mskHasMask		equ 1
mskHasTransparentColor	equ 2
mskLasso		equ 3
mskHasAlpha		equ 4

; Compression techniques
cmpNone			equ 0
cmpByteRun1		equ 1
cmpByteRun2		equ 2	; NOTE: unused (V44)

; Bitmap header (BMHD) structure
    STRUCTURE BitMapHeader,0
	UWORD	 bmh_Width		; Width in pixels
	UWORD	 bmh_Height		; Height in pixels
	WORD	 bmh_Left		; Left position
	WORD	 bmh_Top		; Top position
	UBYTE	 bmh_Depth		; Number of planes
	UBYTE	 bmh_Masking		; Masking type
	UBYTE	 bmh_Compression	; Compression type
	UBYTE	 bmh_Pad
	UWORD	 bmh_Transparent	; Transparent color
	UBYTE	 bmh_XAspect
	UBYTE	 bmh_YAspect
	WORD	 bmh_PageWidth
	WORD	 bmh_PageHeight
    LABEL BitMapHeader_SIZEOF

;------------------------------------------------------------------------------

;  Color register structure
    STRUCTURE ColorRegister,0
	UBYTE	red
	UBYTE	green
	UBYTE	blue
    LABEL ColorRegister_SIZEOF

;------------------------------------------------------------------------------

; IFF types that may be in pictures
ID_ILBM	equ 'ILBM'
ID_BMHD	equ 'BMHD'
ID_CMAP	equ 'CMAP'
ID_CRNG	equ 'CRNG'
ID_GRAB	equ 'GRAB'
ID_SPRT	equ 'SPRT'
ID_DEST	equ 'DEST'
ID_CAMG	equ 'CAMG'

	IFND	ID_BODY
ID_BODY	equ	'BODY'
	ENDC

;------------------------------------------------------------------------------

    ENDC	; DATATYPES_PICTURECLASS_I
