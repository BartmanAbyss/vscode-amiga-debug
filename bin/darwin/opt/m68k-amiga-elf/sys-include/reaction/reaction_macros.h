#ifndef REACTION_REACTION_MACROS_H
#define REACTION_REACTION_MACROS_H
/*
**	$VER: reaction_macros.h 44.1 (19.10.1999)
**	Includes Release 45.1
**
**	Reaction macros
**
**	(C) Copyright 1987-2001 Amiga, Inc.
**	    All Rights Reserved
*/

/****************************************************************************
 *  The following macro defines allow easy object creation.
 *
 *  You can do things such as:
 *
 *   layoutgadget = LayoutObject,
 *                      LAYOUT_BevelStyle, GroupFrame,
 *                      LAYOUT_AddChild,
 *                          ButtonObject,
 *                              GA_ID, 1L,
 *                              GA_Text, "_Hamburgers",
 *                          EndButton,
 *                      LAYOUT_AddChild,
 *                          ButtonObject,
 *                              GA_ID, 2L,
 *                              GA_Text, "Hot _Dogs",
 *                          EndButton,
 *                  EndLayout;
 *
 *   Be careful with your commas and colons; only the FIRST object gets
 *   an "End;", objects that are embedded should get a comma ("End,"), so
 *   that the TagList continues.
 */

/****************************************************************************
 * Gadget Objects Creation Macros
 */

#define ButtonObject        NewObject( NULL, "button.gadget"

#define ToggleObject        NewObject( NULL, "button.gadget",\
                                       GA_ToggleSelect, TRUE

#define CheckBoxObject      NewObject( CHECKBOX_GetClass(), NULL

#define ChooserObject       NewObject( CHOOSER_GetClass(), NULL

#define ClickTabObject		NewObject( CLICKTAB_GetClass(), NULL
#define ClickTabsObject		ClickTabObject

#define PopUpObject         NewObject( CHOOSER_GetClass(), NULL,\
                                       CHOOSER_PopUp, TRUE
#define DropDownObject      NewObject( CHOOSER_GetClass(), NULL,\
                                       CHOOSER_DropDown, TRUE
#define FuelGaugeObject     NewObject( FUELGAUGE_GetClass(), NULL
#define FuelObject          FuelGaugeObject

#ifndef GetFileObject
#define GetFileObject       NewObject( GETFILE_GetClass(), NULL
#endif

#ifndef GetFontObject
#define GetFontObject       NewObject( GETFONT_GetClass(), NULL
#endif

#ifndef GetScreenModeObject
#define GetScreenModeObject NewObject( GETSCREENMODE_GetClass(), NULL
#endif

#define IntegerObject       NewObject( INTEGER_GetClass(), NULL

#define PaletteObject       NewObject( PALETTE_GetClass(), NULL

#define PageObject          NewObject( PAGE_GetClass(), NULL

#define PenMapObject NewObject( PENMAP_GetClass(), NULL

#define LayoutObject        NewObject( LAYOUT_GetClass(), NULL

#define VLayoutObject		NewObject( LAYOUT_GetClass(), NULL, LAYOUT_Orientation, LAYOUT_ORIENT_VERT

#define HLayoutObject		NewObject( LAYOUT_GetClass(), NULL
#define VGroupObject		VLayoutObject
#define HGroupObject		HLayoutObject

#define ListBrowserObject   NewObject( LISTBROWSER_GetClass(), NULL

#define RadioButtonObject   NewObject( RADIOBUTTON_GetClass(), NULL
#define MxObject            RadioButtonObject

#define ScrollerObject      NewObject( SCROLLER_GetClass(), NULL

#define SpeedBarObject      NewObject( SPEEDBAR_GetClass(), NULL

#define SliderObject        NewObject( SLIDER_GetClass(), NULL

#define StatusObject        NewObject( STATUSBAR_GetClass(), NULL

#define StringObject        NewObject( STRING_GetClass(), NULL

#define SpaceObject         NewObject( SPACE_GetClass(), NULL

#define TextFieldObject     NewObject( TEXTFIELD_GetClass(), NULL

/****************************************************************************
 * Image Object Creation Macros
 */
#define BevelObject         NewObject( BEVEL_GetClass(), NULL

#define BitMapObject        NewObject( BITMAP_GetClass(), NULL

#define DrawListObject      NewObject( DRAWLIST_GetClass(), NULL

#define GlyphObject         NewObject( GLYPH_GetClass(), NULL

#define LabelObject         NewObject( LABEL_GetClass(), NULL

/****************************************************************************
 * Class Object Creation Macros
 */
#define WindowObject        NewObject( WINDOW_GetClass(), NULL

#define ARexxObject         NewObject( AREXX_GetClass(), NULL

/****************************************************************************
 * Window class method macros
 */
#define RA_OpenWindow(win)       (struct Window *)DoMethod(win, WM_OPEN, NULL)
#define RA_CloseWindow(win)      DoMethod(win, WM_CLOSE, NULL)
#define RA_HandleInput(win,code) DoMethod(win, WM_HANDLEINPUT, code)
#define RA_Iconify(win)          (BOOL)DoMethod(win, WM_ICONIFY, NULL)
#define RA_Uniconify(win)		 RA_OpenWindow(win)

/****************************************************************************
 * ARexx class method macros
 */
#define RA_HandleRexx(obj)       DoMethod(obj, AM_HANDLEEVENT )
#define RA_FlushRexx(obj)        DoMethod(obj, AM_FLUSH )

/* Easy macro to set up a Hook for a string gadget, etc
 */
#ifdef _DCC
#define RA_SetUpHook(apphook,func,data)	{                     \
										apphook.h_Entry = (HOOKFUNC)func; \
										apphook.h_SubEntry = NULL;        \
										apphook.h_Data = (APTR)data; }
#else
#define RA_SetUpHook(apphook,func,data)	{                     \
										apphook.h_Entry = (HOOKFUNC)func; \
										apphook.h_SubEntry = NULL;        \
										apphook.h_Data = (APTR)data; }
#endif

/****************************************************************************
 * Additional BOOPSI Classes.
 */
#define ColorWheelObject    NewObject( NULL, "colorwheel.gadget"
#define GradientObject      NewObject( NULL, "gradientslider.gadget"
#define LedObject           NewObject( NULL, "led.image"

/****************************************************************************
 * Reaction synomyms for End which can make layout
 * groups easier to follow.
 */
#define WindowEnd           End

#define BitMapEnd           End
#define ButtonEnd           End
#define CheckBoxEnd         End
#define ChooserEnd          End
#define ClickTabEnd			End
#define ClickTabsEnd		End
#define FuelGaugeEnd        End
#define IntegerEnd          End
#define PaletteEnd          End
#define LayoutEnd           End
#define ListBrowserEnd      End
#define PageEnd             End
#define RadioButtonEnd      End
#define ScrollerEnd         End
#define SpeedBarEnd         End
#define SliderEnd           End
#define StatusEnd           End
#define StringEnd           End
#define SpaceEnd            End
#define StatusbarEnd        End
#define TextFieldEnd        End

#define ARexxEnd            End

#define BevelEnd            End
#define DrawListEnd         End
#define GlyphEnd            End
#define LabelEnd            End

#define ColorWheelEnd       End
#define GradientSliderEnd   End
#define LedEnd              End

/****************************************************************************
 * Vector Glyph Images.
 */
#define GetPath             GLYPH_POPDRAWER
#define GetFile             GLYPH_POPFILE
#define GetScreen           GLYPH_POPSCREENMODE
#define GetTime             GLYPH_POPTIME
#define CheckMark           GLYPH_CHECKMARK
#define PopUp               GLYPH_POPUP
#define DropDown            GLYPH_DROPDOWN
#define ArrowUp             GLYPH_ARROWUP
#define ArrowDown           GLYPH_ARROWDOWN
#define ArrowLeft           GLYPH_ARROWLEFT
#define ArrowRight          GLYPH_ARROWRIGHT

/****************************************************************************
 * Bevel Frame Types.
 */
#define ThinFrame           BVS_THIN
#define ButtonFrame         BVS_BUTTON
#define StandardFrame       BVS_STANDARD
#define RidgeFrame          BVS_FIELD
#define StringFrame         BVS_FIELD
#define GroupFrame          BVS_GROUP
#define DropBoxFrame        BVS_DROPBOX
#define HBarFrame           BVS_SBAR_HORIZ
#define VBarFrame           BVS_SBAR_VERT
#define RadioFrame          BVS_RADIOBUTTON
#define MxFrame             BVS_RADIOBUTTON

/****************************************************************************
 * Often used simple gadgets
 */
#define Label(text)		   CHILD_Label, LabelObject, LABEL_Text, text, End

#define Button(text,id)		ButtonObject, GA_Text, text, GA_ID, id, GA_RelVerify, TRUE, End
#define PushButton(text,id)	ButtonObject, GA_Text, text, GA_ID, id, GA_RelVerify, TRUE, BUTTON_PushButton, TRUE, End

#define TextLine(text)		ButtonObject, GA_Text, text, GA_ReadOnly, TRUE, End
#define LabelTextLine(text,label)	TextLine(text), Label(label)

#define String(text,id,maxchars)	StringObject, STRINGA_TextVal, text, STRINGA_MaxChars, maxchars, GA_ID, id, GA_RelVerify, TRUE, GA_TabCycle, TRUE, End
#define LabelString(text,id,maxchars,label)		String(text,id,maxchars), Label(label)
#define PopString(text,id,maxchars,image)	LAYOUT_AddChild, HLayoutObject, String(text,0,maxchars), ButtonObject, BAG_AutoButton, image, GA_RelVerify, TRUE, GA_ID, id, End, End

/****************************************************************************
 * BGUI style Window/Layout Group Macros.
 */
#define StartMember         LAYOUT_AddChild
#define StartImage          LAYOUT_AddImage
#define StartHLayout        LAYOUT_AddChild, HLayoutObject
#define StartVLayout        LAYOUT_AddChild, VLayoutObject
#define StartHGroup         StartHLayout
#define StartVGroup         StartVLayout
#ifndef End
#define End                 TAG_END)
#endif
#define EndWindow           End
#define EndMember           End
#define EndImage            End
#define EndObject           End
#define EndHGroup           End
#define EndVGroup           End
#define EndGroup			End

/****************************************************************************
 * Lazy typist BGUI inspired macros (BGUI is Copyright Jan van den Baard.)
 */
#define HAlign(p)           LAYOUT_HorizAlignment, p
#define VAlign(p)           LAYOUT_VertAlignment, p
#define Spacing(p)			LAYOUT_InnerSpacing, p
#define LOffset(p)          LAYOUT_LeftSpacing, p
#define ROffset(p)          LAYOUT_RightSpacing, p
#define TOffset(p)          LAYOUT_TopSpacing, p
#define BOffset(p)          LAYOUT_BottomSpacing, p

/****************************************************************************
 * And for even lazier typists....
 */
#define VCentered           LAYOUT_VertAlignment, LALIGN_CENTER
#define TAligned            LAYOUT_VertAlignment, LALIGN_TOP
#define BAligned            LAYOUT_VertAlignment, LALIGN_BOTTOM
#define HCentered           LAYOUT_HorizAlignment, LALIGN_CENTER
#define LAligned            LAYOUT_HorizAlignment, LALIGN_LEFT
#define RAligned            LAYOUT_HorizAlignment, LALIGN_RIGHT
#define Offset(x1,y1,x2,y2) LAYOUT_LeftSpacing, x1, LAYOUT_TopSpacing, y1, LAYOUT_RightSpacing, x2, LAYOUT_BottomSpacing, y2
#define EvenSized			LAYOUT_EvenSize, TRUE
#define MemberLabel(a)		CHILD_Label, LabelObject, LABEL_Text, a, LabelEnd

/****************************************************************************
 * Easy Menu Macros.
 */
#define Title(t)\
		{ NM_TITLE, t, NULL, 0, 0, NULL }
#define Item(t,s,i)\
		{ NM_ITEM, t, s, 0, 0, (APTR)i }
#define ItemBar\
		{ NM_ITEM, NM_BARLABEL, NULL, 0, 0, NULL }
#define SubItem(t,s,i)\
		{ NM_SUB, t, s, 0, 0, (APTR)i }
#define SubBar\
		{ NM_SUB, NM_BARLABEL, NULL, 0, 0, NULL }
#define EndMenu\
		{ NM_END, NULL, NULL, 0, 0, NULL }

#endif /* REACTION_REACTION_MACROS_H */
