	IFND	WORKBENCH_ICON_I
WORKBENCH_ICON_I	SET	1
**
**	$VER: icon.i 45.1 (8.2.2001)
**	Includes Release 45.1
**
**	External declarations for icon.library
**
**	Copyright © 1985-2001 Amiga, Inc.
**	    All Rights Reserved
**

	IFND	GRAPHICS_VIEW_I
	INCLUDE	"graphics/view.i"
	ENDC

	IFND	INTUITION_IMAGECLASS_I
	INCLUDE	"intuition/imageclass.i"
	ENDC

	IFND	UTILITY_TAGITEM_I
	INCLUDE	"utility/tagitem.i"
	ENDC

	IFND	DATATYPES_PICTURECLASS_I
	INCLUDE	"datatypes/pictureclass.i"
	ENDC

	IFND	DOS_DOS_I
	INCLUDE	"dos/dos.i"
	ENDC

;------------------------------------------------------------------------------

ICONNAME	MACRO
		DC.B	'icon.library',0
		ENDM

;------------------------------------------------------------------------------

ICONA_Dummy	equ (TAG_USER+$9000)

;------------------------------------------------------------------------------

; Error reporting (LONG *)
ICONA_ErrorCode 	equ (ICONA_Dummy+1)

; Points to the tag item that caused the error (struct TagItem **).
ICONA_ErrorTagItem	equ (ICONA_Dummy+75)

;------------------------------------------------------------------------------

; Global options for IconControlA()

; Screen to use for remapping Workbench icons to (struct Screen *)
ICONCTRLA_SetGlobalScreen			equ (ICONA_Dummy+2)
ICONCTRLA_GetGlobalScreen			equ (ICONA_Dummy+3)

; Icon color remapping precision; defaults to PRECISION_ICON (LONG)
ICONCTRLA_SetGlobalPrecision			equ (ICONA_Dummy+4)
ICONCTRLA_GetGlobalPrecision			equ (ICONA_Dummy+5)

; Icon border size dimensions (struct Rectangle *)
ICONCTRLA_SetGlobalEmbossRect			equ (ICONA_Dummy+6)
ICONCTRLA_GetGlobalEmbossRect			equ (ICONA_Dummy+7)

; Render image without frame (BOOL)
ICONCTRLA_SetGlobalFrameless			equ (ICONA_Dummy+8)
ICONCTRLA_GetGlobalFrameless			equ (ICONA_Dummy+9)

; Enable NewIcons support (BOOL)
ICONCTRLA_SetGlobalNewIconsSupport		equ (ICONA_Dummy+10)
ICONCTRLA_GetGlobalNewIconsSupport		equ (ICONA_Dummy+11)

; Enable color icon support (BOOL)
ICONCTRLA_SetGlobalColorIconSupport		equ (ICONA_Dummy+77)
ICONCTRLA_GetGlobalColorIconSupport		equ (ICONA_Dummy+78)

; Set/Get the hook to be called when identifying a file (struct Hook *)
ICONCTRLA_SetGlobalIdentifyHook			equ (ICONA_Dummy+12)
ICONCTRLA_GetGlobalIdentifyHook			equ (ICONA_Dummy+13)

; Set/get the maximum length of a file/drawer name supported
; by icon.library (LONG).
ICONCTRLA_SetGlobalMaxNameLength		equ (ICONA_Dummy+67)
ICONCTRLA_GetGlobalMaxNameLength		equ (ICONA_Dummy+68)

;------------------------------------------------------------------------------

; Per icon local options for IconControlA()

; Get the icon rendering masks (PLANEPTR)
ICONCTRLA_GetImageMask1			equ (ICONA_Dummy+14)
ICONCTRLA_GetImageMask2			equ (ICONA_Dummy+15)

; Transparent image color; set to -1 if opaque
ICONCTRLA_SetTransparentColor1		equ (ICONA_Dummy+16)
ICONCTRLA_GetTransparentColor1		equ (ICONA_Dummy+17)
ICONCTRLA_SetTransparentColor2		equ (ICONA_Dummy+18)
ICONCTRLA_GetTransparentColor2		equ (ICONA_Dummy+19)

; Image color palette (struct ColorRegister *)
ICONCTRLA_SetPalette1			equ (ICONA_Dummy+20)
ICONCTRLA_GetPalette1			equ (ICONA_Dummy+21)
ICONCTRLA_SetPalette2			equ (ICONA_Dummy+22)
ICONCTRLA_GetPalette2			equ (ICONA_Dummy+23)

; Size of image color palette (LONG)
ICONCTRLA_SetPaletteSize1		equ (ICONA_Dummy+24)
ICONCTRLA_GetPaletteSize1		equ (ICONA_Dummy+25)
ICONCTRLA_SetPaletteSize2		equ (ICONA_Dummy+26)
ICONCTRLA_GetPaletteSize2		equ (ICONA_Dummy+27)

; Image data; one by per pixel (UBYTE *)
ICONCTRLA_SetImageData1			equ (ICONA_Dummy+28)
ICONCTRLA_GetImageData1			equ (ICONA_Dummy+29)
ICONCTRLA_SetImageData2			equ (ICONA_Dummy+30)
ICONCTRLA_GetImageData2			equ (ICONA_Dummy+31)

; Render image without frame (BOOL)
ICONCTRLA_SetFrameless			equ (ICONA_Dummy+32)
ICONCTRLA_GetFrameless			equ (ICONA_Dummy+33)

; Enable NewIcons support (BOOL)
ICONCTRLA_SetNewIconsSupport		equ (ICONA_Dummy+34)
ICONCTRLA_GetNewIconsSupport		equ (ICONA_Dummy+35)

; Icon aspect ratio (UBYTE *)
ICONCTRLA_SetAspectRatio		equ (ICONA_Dummy+36)
ICONCTRLA_GetAspectRatio		equ (ICONA_Dummy+37)

; Icon dimensions; valid only for palette mapped icon images (LONG)
ICONCTRLA_SetWidth			equ (ICONA_Dummy+38)
ICONCTRLA_GetWidth			equ (ICONA_Dummy+39)
ICONCTRLA_SetHeight			equ (ICONA_Dummy+40)
ICONCTRLA_GetHeight			equ (ICONA_Dummy+41)

; Check whether the icon is palette mapped (LONG *).
ICONCTRLA_IsPaletteMapped		equ (ICONA_Dummy+42)

; Get the screen the icon is attached to (struct Screen **).
ICONCTRLA_GetScreen			equ (ICONA_Dummy+43)

; Check whether the icon has a real select image (LONG *).
ICONCTRLA_HasRealImage2			equ (ICONA_Dummy+44)

; Check whether the icon is of the NewIcon type (LONG *).
ICONCTRLA_IsNewIcon			equ (ICONA_Dummy+79)

; Check whether this icon was allocated by icon.library
; or if consists solely of a statically allocated
; struct DiskObject. (LONG *).
ICONCTRLA_IsNativeIcon			equ (ICONA_Dummy+80)

;------------------------------------------------------------------------------

; Icon aspect ratio is not known.
ICON_ASPECT_RATIO_UNKNOWN equ (0)

;------------------------------------------------------------------------------

; Tags for use with GetIconTagList()

; Default icon type to retrieve (LONG)
ICONGETA_GetDefaultType			equ (ICONA_Dummy+45)

; Retrieve default icon for the given name (STRPTR)
ICONGETA_GetDefaultName			equ (ICONA_Dummy+46)

; Return a default icon if the requested icon
; file cannot be found (BOOL).
ICONGETA_FailIfUnavailable		equ (ICONA_Dummy+47)

; If possible, retrieve a palette mapped icon (BOOL).
ICONGETA_GetPaletteMappedIcon		equ (ICONA_Dummy+48)

; Set if the icon returned is a default icon (BOOL *).
ICONGETA_IsDefaultIcon			equ (ICONA_Dummy+49)

; Remap the icon to the default screen, if possible (BOOL).
ICONGETA_RemapIcon			equ (ICONA_Dummy+50)

; Generate icon image masks (BOOL).
ICONGETA_GenerateImageMasks		equ (ICONA_Dummy+51)

; Label text to be assigned to the icon (STRPTR).
ICONGETA_Label				equ (ICONA_Dummy+52)

; Screen to remap the icon to (struct Screen *).
ICONGETA_Screen				equ (ICONA_Dummy+69)

;------------------------------------------------------------------------------

; Tags for use with PutIconTagList()

; Notify Workbench of the icon being written (BOOL)
ICONPUTA_NotifyWorkbench		equ (ICONA_Dummy+53)

; Store icon as the default for this type (LONG)
ICONPUTA_PutDefaultType			equ (ICONA_Dummy+54)

; Store icon as a default for the given name (STRPTR)
ICONPUTA_PutDefaultName			equ (ICONA_Dummy+55)

; When storing a palette mapped icon, don't save the
; the original planar icon image with the file. Replace
; it with a tiny replacement image.
ICONPUTA_DropPlanarIconImage		equ (ICONA_Dummy+56)

; Don't write the chunky icon image data to disk.
ICONPUTA_DropChunkyIconImage		equ (ICONA_Dummy+57)

; Don't write the NewIcons tool types to disk.
ICONPUTA_DropNewIconToolTypes		equ (ICONA_Dummy+58)

; If this tag is enabled, the writer will examine the
; icon image data to find out whether it can compress
; it more efficiently. This may take extra time and
; is not generally recommended.
ICONPUTA_OptimizeImageSpace		equ (ICONA_Dummy+59)

; Don't write the entire icon file back to disk,
; only change the do->do_CurrentX/do->do_CurrentY
; members.
ICONPUTA_OnlyUpdatePosition		equ (ICONA_Dummy+72)

; Before writing a palette mapped icon back to disk,
; icon.library will make sure that the original
; planar image data is stored in the file. If you
; don't want that to happen, set this option to
; FALSE. This will allow you to change the planar icon
; image data written back to disk.
ICONPUTA_PreserveOldIconImages		equ (ICONA_Dummy+84)

;------------------------------------------------------------------------------

; For use with the file identification hook.

   STRUCTURE IconIdentifyMsg,0
	; Libraries that are already opened for your use.
	APTR	iim_SysBase
	APTR	iim_DOSBase
	APTR	iim_UtilityBase
	APTR	iim_IconBase

	; File context information.
	BPTR	iim_FileLock	; Lock on the object to return an icon for.
	BPTR	iim_ParentLock	; Lock on the object's parent directory, if available.
	APTR	iim_FIB		; Already initialized for you.
	BPTR	iim_FileHandle	; If non-NULL, pointer to the file to examine,
				; positioned right at the first byte, ready
				; for you to use.

	APTR	iim_Tags	; Tags passed to GetIconTagList().
    LABEL IconIdentifyMsg_SIZEOF

;------------------------------------------------------------------------------

; Tags for use with DupDiskObjectA()

; Duplicate do_DrawerData
ICONDUPA_DuplicateDrawerData		equ (ICONA_Dummy+60)

; Duplicate the Image structures.
ICONDUPA_DuplicateImages		equ (ICONA_Dummy+61)

; Duplicate the image data (Image->ImageData) itself.
ICONDUPA_DuplicateImageData		equ (ICONA_Dummy+62)

; Duplicate the default tool.
ICONDUPA_DuplicateDefaultTool		equ (ICONA_Dummy+63)

; Duplicate the tool types list.
ICONDUPA_DuplicateToolTypes		equ (ICONA_Dummy+64)

; Duplicate the tool window.
ICONDUPA_DuplicateToolWindow		equ (ICONA_Dummy+65)

; If the icon to be duplicated is in fact a palette mapped
; icon which has never been set up to be displayed on the
; screen, turn the duplicate into that palette mapped icon.
ICONDUPA_ActivateImageData		equ (ICONA_Dummy+82)

;------------------------------------------------------------------------------

; Tags for use with DrawIconStateA() and GetIconRectangleA().

; Drawing information to use (struct DrawInfo *).
ICONDRAWA_DrawInfo 		equ (ICONA_Dummy+66)

; Draw the icon without the surrounding frame (BOOL).
ICONDRAWA_Frameless		equ (ICONA_Dummy+70)

; Erase the background before drawing a borderless icon (BOOL).
ICONDRAWA_EraseBackground	equ (ICONA_Dummy+71)

; Draw the icon without the surrounding border and frame (BOOL).
ICONDRAWA_Borderless		equ (ICONA_Dummy+83)

; The icon to be drawn refers to a linked object (BOOL).
ICONDRAWA_IsLink		equ (ICONA_Dummy+89)

;------------------------------------------------------------------------------

	ENDC ; WORKBENCH_ICON_I
