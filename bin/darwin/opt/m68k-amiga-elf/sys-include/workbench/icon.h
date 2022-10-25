#ifndef WORKBENCH_ICON_H
#define WORKBENCH_ICON_H
/*
**	$VER: icon.h 45.1 (2.8.2001)
**	Includes Release 45.1
**
**	External declarations for icon.library
**
**	Copyright © 1985-2001 Amiga, Inc.
**	    All Rights Reserved
*/

#ifndef GRAPHICS_VIEW_H
#include <graphics/view.h>
#endif /* !GRAPHICS_VIEW_H */

#ifndef INTUITION_IMAGECLASS_H
#include <intuition/imageclass.h>
#endif /* !INTUITION_IMAGECLASS_H */

#ifndef UTILITY_TAGITEM_H
#include <utility/tagitem.h>
#endif /* !UTILITY_TAGITEM_H */

#ifndef DATATYPES_PICTURECLASS_H
#include <datatypes/pictureclass.h>
#endif /* !DATATYPES_PICTURECLASS_H */

#ifndef DOS_DOS_H
#include <dos/dos.h>
#endif /* !DOS_DOS_H */

/****************************************************************************/

#define ICONNAME "icon.library"

/****************************************************************************/

#define ICONA_Dummy (TAG_USER+0x9000)

/****************************************************************************/

/* Error reporting (LONG *) */
#define ICONA_ErrorCode 	(ICONA_Dummy+1)

/* Points to the tag item that caused the error (struct TagItem **). */
#define ICONA_ErrorTagItem	(ICONA_Dummy+75)

/****************************************************************************/

/* Global options for IconControlA() */

/* Screen to use for remapping Workbench icons to (struct Screen *) */
#define ICONCTRLA_SetGlobalScreen		(ICONA_Dummy+2)
#define ICONCTRLA_GetGlobalScreen		(ICONA_Dummy+3)

/* Icon color remapping precision; defaults to PRECISION_ICON (LONG) */
#define ICONCTRLA_SetGlobalPrecision		(ICONA_Dummy+4)
#define ICONCTRLA_GetGlobalPrecision		(ICONA_Dummy+5)

/* Icon frame size dimensions (struct Rectangle *) */
#define ICONCTRLA_SetGlobalEmbossRect		(ICONA_Dummy+6)
#define ICONCTRLA_GetGlobalEmbossRect		(ICONA_Dummy+7)

/* Render image without frame (BOOL) */
#define ICONCTRLA_SetGlobalFrameless		(ICONA_Dummy+8)
#define ICONCTRLA_GetGlobalFrameless		(ICONA_Dummy+9)

/* Enable NewIcons support (BOOL) */
#define ICONCTRLA_SetGlobalNewIconsSupport	(ICONA_Dummy+10)
#define ICONCTRLA_GetGlobalNewIconsSupport	(ICONA_Dummy+11)

/* Enable color icon support (BOOL) */
#define ICONCTRLA_SetGlobalColorIconSupport	(ICONA_Dummy+77)
#define ICONCTRLA_GetGlobalColorIconSupport	(ICONA_Dummy+78)

/* Set/Get the hook to be called when identifying a file (struct Hook *) */
#define ICONCTRLA_SetGlobalIdentifyHook		(ICONA_Dummy+12)
#define ICONCTRLA_GetGlobalIdentifyHook		(ICONA_Dummy+13)

/* Set/get the maximum length of a file/drawer name supported
 * by icon.library (LONG).
 */
#define ICONCTRLA_SetGlobalMaxNameLength	(ICONA_Dummy+67)
#define ICONCTRLA_GetGlobalMaxNameLength	(ICONA_Dummy+68)

/****************************************************************************/

/* Per icon local options for IconControlA() */

/* Get the icon rendering masks (PLANEPTR) */
#define ICONCTRLA_GetImageMask1		(ICONA_Dummy+14)
#define ICONCTRLA_GetImageMask2		(ICONA_Dummy+15)

/* Transparent image color; set to -1 if opaque */
#define ICONCTRLA_SetTransparentColor1	(ICONA_Dummy+16)
#define ICONCTRLA_GetTransparentColor1	(ICONA_Dummy+17)
#define ICONCTRLA_SetTransparentColor2	(ICONA_Dummy+18)
#define ICONCTRLA_GetTransparentColor2	(ICONA_Dummy+19)

/* Image color palette (struct ColorRegister *) */
#define ICONCTRLA_SetPalette1		(ICONA_Dummy+20)
#define ICONCTRLA_GetPalette1		(ICONA_Dummy+21)
#define ICONCTRLA_SetPalette2		(ICONA_Dummy+22)
#define ICONCTRLA_GetPalette2		(ICONA_Dummy+23)

/* Size of image color palette (LONG) */
#define ICONCTRLA_SetPaletteSize1	(ICONA_Dummy+24)
#define ICONCTRLA_GetPaletteSize1	(ICONA_Dummy+25)
#define ICONCTRLA_SetPaletteSize2	(ICONA_Dummy+26)
#define ICONCTRLA_GetPaletteSize2	(ICONA_Dummy+27)

/* Image data; one by per pixel (UBYTE *) */
#define ICONCTRLA_SetImageData1		(ICONA_Dummy+28)
#define ICONCTRLA_GetImageData1		(ICONA_Dummy+29)
#define ICONCTRLA_SetImageData2		(ICONA_Dummy+30)
#define ICONCTRLA_GetImageData2		(ICONA_Dummy+31)

/* Render image without frame (BOOL) */
#define ICONCTRLA_SetFrameless		(ICONA_Dummy+32)
#define ICONCTRLA_GetFrameless		(ICONA_Dummy+33)

/* Enable NewIcons support (BOOL) */
#define ICONCTRLA_SetNewIconsSupport	(ICONA_Dummy+34)
#define ICONCTRLA_GetNewIconsSupport	(ICONA_Dummy+35)

/* Icon aspect ratio (UBYTE *) */
#define ICONCTRLA_SetAspectRatio	(ICONA_Dummy+36)
#define ICONCTRLA_GetAspectRatio	(ICONA_Dummy+37)

/* Icon dimensions; valid only for palette mapped icon images (LONG) */
#define ICONCTRLA_SetWidth		(ICONA_Dummy+38)
#define ICONCTRLA_GetWidth		(ICONA_Dummy+39)
#define ICONCTRLA_SetHeight		(ICONA_Dummy+40)
#define ICONCTRLA_GetHeight		(ICONA_Dummy+41)

/* Check whether the icon is palette mapped (LONG *). */
#define ICONCTRLA_IsPaletteMapped	(ICONA_Dummy+42)

/* Get the screen the icon is attached to (struct Screen **). */
#define ICONCTRLA_GetScreen		(ICONA_Dummy+43)

/* Check whether the icon has a real select image (LONG *). */
#define ICONCTRLA_HasRealImage2		(ICONA_Dummy+44)

/* Check whether the icon is of the NewIcon type (LONG *). */
#define ICONCTRLA_IsNewIcon		(ICONA_Dummy+79)

/* Check whether this icon was allocated by icon.library
 * or if consists solely of a statically allocated
 * struct DiskObject. (LONG *).
 */
#define ICONCTRLA_IsNativeIcon		(ICONA_Dummy+80)

/****************************************************************************/

/* Icon aspect ratio is not known. */
#define ICON_ASPECT_RATIO_UNKNOWN (0)

/* Pack the aspect ratio into a single byte. */
#define PACK_ICON_ASPECT_RATIO(num,den) (((num) << 4) | (den))

/* Unpack the aspect ratio stored in a single byte. */
#define UNPACK_ICON_ASPECT_RATIO(v,num,den)	\
	do					\
	{					\
		num	= (((v) >> 4) & 15);	\
		den	= ( (v)       & 15);	\
	}					\
	while(0)

/****************************************************************************/

/* Tags for use with GetIconTagList() */

/* Default icon type to retrieve (LONG) */
#define ICONGETA_GetDefaultType		(ICONA_Dummy+45)

/* Retrieve default icon for the given name (STRPTR) */
#define ICONGETA_GetDefaultName		(ICONA_Dummy+46)

/* Return a default icon if the requested icon
 * file cannot be found (BOOL).
 */
#define ICONGETA_FailIfUnavailable	(ICONA_Dummy+47)

/* If possible, retrieve a palette mapped icon (BOOL). */
#define ICONGETA_GetPaletteMappedIcon	(ICONA_Dummy+48)

/* Set if the icon returned is a default icon (BOOL *). */
#define ICONGETA_IsDefaultIcon		(ICONA_Dummy+49)

/* Remap the icon to the default screen, if possible (BOOL). */
#define ICONGETA_RemapIcon		(ICONA_Dummy+50)

/* Generate icon image masks (BOOL). */
#define ICONGETA_GenerateImageMasks	(ICONA_Dummy+51)

/* Label text to be assigned to the icon (STRPTR). */
#define ICONGETA_Label			(ICONA_Dummy+52)

/* Screen to remap the icon to (struct Screen *). */
#define ICONGETA_Screen			(ICONA_Dummy+69)

/****************************************************************************/

/* Tags for use with PutIconTagList() */

/* Notify Workbench of the icon being written (BOOL) */
#define ICONPUTA_NotifyWorkbench	(ICONA_Dummy+53)

/* Store icon as the default for this type (LONG) */
#define ICONPUTA_PutDefaultType		(ICONA_Dummy+54)

/* Store icon as a default for the given name (STRPTR) */
#define ICONPUTA_PutDefaultName		(ICONA_Dummy+55)

/* When storing a palette mapped icon, don't save the
 * the original planar icon image with the file. Replace
 * it with a tiny replacement image.
 */
#define ICONPUTA_DropPlanarIconImage	(ICONA_Dummy+56)

/* Don't write the chunky icon image data to disk. */
#define ICONPUTA_DropChunkyIconImage	(ICONA_Dummy+57)

/* Don't write the NewIcons tool types to disk. */
#define ICONPUTA_DropNewIconToolTypes	(ICONA_Dummy+58)

/* If this tag is enabled, the writer will examine the
 * icon image data to find out whether it can compress
 * it more efficiently. This may take extra time and
 * is not generally recommended.
 */
#define ICONPUTA_OptimizeImageSpace	(ICONA_Dummy+59)

/* Don't write the entire icon file back to disk,
 * only change the do->do_CurrentX/do->do_CurrentY
 * members.
 */
#define ICONPUTA_OnlyUpdatePosition	(ICONA_Dummy+72)

/* Before writing a palette mapped icon back to disk,
 * icon.library will make sure that the original
 * planar image data is stored in the file. If you
 * don't want that to happen, set this option to
 * FALSE. This will allow you to change the planar icon
 * image data written back to disk.
 */
#define ICONPUTA_PreserveOldIconImages	(ICONA_Dummy+84)

/****************************************************************************/

/* For use with the file identification hook. */

struct IconIdentifyMsg
{
	/* Libraries that are already opened for your use. */
	struct Library *	iim_SysBase;
	struct Library *	iim_DOSBase;
	struct Library *	iim_UtilityBase;
	struct Library *	iim_IconBase;

	/* File context information. */
	BPTR			iim_FileLock;	/* Lock on the object to return an icon for. */
	BPTR			iim_ParentLock;	/* Lock on the object's parent directory, if available. */
	struct FileInfoBlock *	iim_FIB;	/* Already initialized for you. */
	BPTR			iim_FileHandle;	/* If non-NULL, pointer to the file to examine,
						 * positioned right at the first byte, ready
						 * for you to use.
						 */
	struct TagItem *	iim_Tags;	/* Tags passed to GetIconTagList(). */
};

/****************************************************************************/

/* Tags for use with DupDiskObjectA() */

/* Duplicate do_DrawerData */
#define ICONDUPA_DuplicateDrawerData	(ICONA_Dummy+60)

/* Duplicate the Image structures. */
#define ICONDUPA_DuplicateImages	(ICONA_Dummy+61)

/* Duplicate the image data (Image->ImageData) itself. */
#define ICONDUPA_DuplicateImageData	(ICONA_Dummy+62)

/* Duplicate the default tool. */
#define ICONDUPA_DuplicateDefaultTool	(ICONA_Dummy+63)

/* Duplicate the tool types list. */
#define ICONDUPA_DuplicateToolTypes	(ICONA_Dummy+64)

/* Duplicate the tool window. */
#define ICONDUPA_DuplicateToolWindow	(ICONA_Dummy+65)

/* If the icon to be duplicated is in fact a palette mapped
 * icon which has never been set up to be displayed on the
 * screen, turn the duplicate into that palette mapped icon.
 */
#define ICONDUPA_ActivateImageData	(ICONA_Dummy+82)

/****************************************************************************/

/* Tags for use with DrawIconStateA() and GetIconRectangleA(). */

/* Drawing information to use (struct DrawInfo *). */
#define ICONDRAWA_DrawInfo		(ICONA_Dummy+66)

/* Draw the icon without the surrounding frame (BOOL). */
#define ICONDRAWA_Frameless		(ICONA_Dummy+70)

/* Erase the background before drawing a frameless icon (BOOL). */
#define ICONDRAWA_EraseBackground	(ICONA_Dummy+71)

/* Draw the icon without the surrounding border and frame (BOOL). */
#define ICONDRAWA_Borderless		(ICONA_Dummy+83)

/* The icon to be drawn refers to a linked object (BOOL). */
#define ICONDRAWA_IsLink		(ICONA_Dummy+89)

/****************************************************************************/

/* Reserved tags; don't use! */
#define ICONA_Reserved1	(ICONA_Dummy+73)
#define ICONA_Reserved2	(ICONA_Dummy+74)
#define ICONA_Reserved3 (ICONA_Dummy+76)
#define ICONA_Reserved4 (ICONA_Dummy+81)
#define ICONA_Reserved5 (ICONA_Dummy+85)
#define ICONA_Reserved6 (ICONA_Dummy+86)
#define ICONA_Reserved7 (ICONA_Dummy+87)
#define ICONA_Reserved8 (ICONA_Dummy+88)

/****************************************************************************/

#define ICONA_LAST_TAG (ICONA_Dummy+89)

/****************************************************************************/

#endif  /* !WORKBENCH_ICON_H */
