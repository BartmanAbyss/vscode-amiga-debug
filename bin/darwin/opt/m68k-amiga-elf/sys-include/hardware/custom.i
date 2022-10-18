	IFND	HARDWARE_CUSTOM_I
HARDWARE_CUSTOM_I	SET	1
**
**	$VER: custom.i 39.1 (18.9.1992)
**	Includes Release 45.1
**
**	Offsets of Amiga custom chip registers
**
**	(C) Copyright 1985-2001 Amiga, Inc.
**	    All Rights Reserved
**

*
* do this to get base of custom registers:
*  XREF _custom;
*

bltddat     EQU   $000
dmaconr     EQU   $002
vposr	    EQU   $004
vhposr	    EQU   $006
dskdatr     EQU   $008
joy0dat     EQU   $00A
joy1dat     EQU   $00C
clxdat	    EQU   $00E

adkconr     EQU   $010
pot0dat     EQU   $012
pot1dat     EQU   $014
potinp	    EQU   $016
serdatr     EQU   $018
dskbytr     EQU   $01A
intenar     EQU   $01C
intreqr     EQU   $01E

dskpt	    EQU   $020
dsklen	    EQU   $024
dskdat	    EQU   $026
refptr	    EQU   $028
vposw	    EQU   $02A
vhposw	    EQU   $02C
copcon	    EQU   $02E
serdat	    EQU   $030
serper	    EQU   $032
potgo	    EQU   $034
joytest     EQU   $036
strequ	    EQU   $038
strvbl	    EQU   $03A
strhor	    EQU   $03C
strlong     EQU   $03E

bltcon0     EQU   $040
bltcon1     EQU   $042
bltafwm     EQU   $044
bltalwm     EQU   $046
bltcpt	    EQU   $048
bltbpt	    EQU   $04C
bltapt	    EQU   $050
bltdpt	    EQU   $054
bltsize     EQU   $058
bltcon0l    EQU   $05B		; note: byte access only
bltsizv     EQU   $05C
bltsizh     EQU   $05E

bltcmod     EQU   $060
bltbmod     EQU   $062
bltamod     EQU   $064
bltdmod     EQU   $066

bltcdat     EQU   $070
bltbdat     EQU   $072
bltadat     EQU   $074

deniseid    EQU   $07C
dsksync     EQU   $07E

cop1lc	    EQU   $080
cop2lc	    EQU   $084
copjmp1     EQU   $088
copjmp2     EQU   $08A
copins	    EQU   $08C
diwstrt     EQU   $08E
diwstop     EQU   $090
ddfstrt     EQU   $092
ddfstop     EQU   $094
dmacon	    EQU   $096
clxcon	    EQU   $098
intena	    EQU   $09A
intreq	    EQU   $09C
adkcon	    EQU   $09E

aud	    EQU   $0A0
aud0	    EQU   $0A0
aud1	    EQU   $0B0
aud2	    EQU   $0C0
aud3	    EQU   $0D0

* AudChannel
ac_ptr	    EQU   $00	; ptr to start of waveform data
ac_len	    EQU   $04	; length of waveform in words
ac_per	    EQU   $06	; sample period
ac_vol	    EQU   $08	; volume
ac_dat	    EQU   $0A	; sample pair
ac_SIZEOF   EQU   $10

bplpt	    EQU   $0E0

bplcon0     EQU   $100
bplcon1     EQU   $102
bplcon2     EQU   $104
bplcon3     EQU   $106
bpl1mod     EQU   $108
bpl2mod     EQU   $10A
bplcon4     EQU   $10C
clxcon2     EQU   $10E

bpldat	    EQU   $110

sprpt	    EQU   $120

spr	    EQU   $140

* SpriteDef
sd_pos	    EQU   $00
sd_ctl	    EQU   $02
sd_dataa    EQU   $04
sd_dataB    EQU   $06
sd_SIZEOF   EQU   $08

color	    EQU   $180

htotal	    EQU   $1c0
hsstop	    EQU   $1c2
hbstrt	    EQU   $1c4
hbstop	    EQU   $1c6
vtotal	    EQU   $1c8
vsstop	    EQU   $1ca
vbstrt	    EQU   $1cc
vbstop	    EQU   $1ce
sprhstrt    EQU   $1d0
sprhstop    EQU   $1d2
bplhstrt    EQU   $1d4
bplhstop    EQU   $1d6
hhposw	    EQU   $1d8
hhposr	    EQU   $1da
beamcon0    EQU   $1dc
hsstrt	    EQU   $1de
vsstrt	    EQU   $1e0
hcenter     EQU   $1e2
diwhigh     EQU   $1e4
fmode	    EQU   $1fc

   ENDC  !HARDWARE_CUSTOM_I
