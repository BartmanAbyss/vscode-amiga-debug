	IFND GADGETS_COLORWHEEL_I
GADGETS_COLORWHEEL_I	SET	1

**	$VER: colorwheel.i 44.1 (19.10.1999)
**	Includes Release 45.1
**
**	Definitions for the colorwheel BOOPSI class
**
**	(C) Copyright 1987-2001 Amiga, Inc.
**	    All Rights Reserved

;---------------------------------------------------------------------------

    IFND UTILITY_TAGITEM_I
    INCLUDE "utility/tagitem.i"
    ENDC

;---------------------------------------------------------------------------

; For use with the WHEEL_HSB tag
   STRUCTURE ColorWheelHSB,0
	ULONG cw_Hue
	ULONG cw_Saturation
	ULONG cw_Brightness
   LABEL ColorWheelHSB_SIZEOF

; For use with the WHEEL_RGB tag
   STRUCTURE ColorWheelRGB,0
	ULONG cw_Red
	ULONG cw_Green
	ULONG cw_Blue
   LABEL ColorWheelRGB_SIZEOF

;---------------------------------------------------------------------------

WHEEL_Dummy	     equ (TAG_USER+$04000000)
WHEEL_Hue	     equ (WHEEL_Dummy+1)      ; set/get Hue
WHEEL_Saturation     equ (WHEEL_Dummy+2)      ; set/get Saturation
WHEEL_Brightness     equ (WHEEL_Dummy+3)      ; set/get Brightness
WHEEL_HSB	     equ (WHEEL_Dummy+4)      ; set/get ColorWheelHSB
WHEEL_Red	     equ (WHEEL_Dummy+5)      ; set/get Red
WHEEL_Green	     equ (WHEEL_Dummy+6)      ; set/get Green
WHEEL_Blue	     equ (WHEEL_Dummy+7)      ; set/get Blue
WHEEL_RGB	     equ (WHEEL_Dummy+8)      ; set/get ColorWheelRGB
WHEEL_Screen	     equ (WHEEL_Dummy+9)      ; init screen/enviroment
WHEEL_Abbrv	     equ (WHEEL_Dummy+10)     ; "GCBMRY" if English
WHEEL_Donation	     equ (WHEEL_Dummy+11)     ; colors donated by app
WHEEL_BevelBox	     equ (WHEEL_Dummy+12)     ; inside a bevel box
WHEEL_GradientSlider equ (WHEEL_Dummy+13)     ; attached gradient slider
WHEEL_MaxPens	     equ (WHEEL_Dummy+14)     ; max # of pens to allocate

;---------------------------------------------------------------------------

	ENDC	; GADGETS_COLORWHEEL_I
