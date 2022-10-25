	 IFND	  REXX_ERRORS_I
REXX_ERRORS_I SET      1
**
**	$VER: errors.i 36.6 (8.11.1991)
**	Includes Release 45.1
**
**	Definitions for ARexx error codes
**
**	(C) Copyright 1986,1987,1988,1989,1990 William S. Hawes.
**	(C) Copyright 1990-2001 Amiga, Inc.
**		All Rights Reserved
**

ERRC_MSG    EQU   0		    ; error code offset
ERR10_001   EQU   (ERRC_MSG+1)	    ; program not found
ERR10_002   EQU   (ERRC_MSG+2)	    ; execution halted
ERR10_003   EQU   (ERRC_MSG+3)	    ; no memory available
				    ; unassigned
ERR10_005   EQU   (ERRC_MSG+5)	    ; unmatched quote
ERR10_006   EQU   (ERRC_MSG+6)	    ; unterminated comment
				    ; unassigned
ERR10_008   EQU   (ERRC_MSG+8)	    ; unrecognized token
ERR10_009   EQU   (ERRC_MSG+9)	    ; symbol or string too long

ERR10_010   EQU   (ERRC_MSG+10)     ; invalid message packet
ERR10_011   EQU   (ERRC_MSG+11)     ; command string error
ERR10_012   EQU   (ERRC_MSG+12)     ; error return from function
ERR10_013   EQU   (ERRC_MSG+13)     ; host environment not found
ERR10_014   EQU   (ERRC_MSG+14)     ; required library not available
ERR10_015   EQU   (ERRC_MSG+15)     ; function not found
ERR10_016   EQU   (ERRC_MSG+16)     ; function did not return value
ERR10_017   EQU   (ERRC_MSG+17)     ; wrong number of arguments
ERR10_018   EQU   (ERRC_MSG+18)     ; invalid argument to function
ERR10_019   EQU   (ERRC_MSG+19)     ; invalid PROCEDURE instruction

ERR10_020   EQU   (ERRC_MSG+20)     ; unexpected THEN/ELSE
ERR10_021   EQU   (ERRC_MSG+21)     ; unexpected WHEN/OTHERWISE
ERR10_022   EQU   (ERRC_MSG+22)     ; unexpected BREAK, LEAVE or ITERATE
ERR10_023   EQU   (ERRC_MSG+23)     ; invalid statement in SELECT
ERR10_024   EQU   (ERRC_MSG+24)     ; missing or multiple THEN clauses
ERR10_025   EQU   (ERRC_MSG+25)     ; missing OTHERWISE
ERR10_026   EQU   (ERRC_MSG+26)     ; missing or unexpected END
ERR10_027   EQU   (ERRC_MSG+27)     ; symbol mismatch on END/LEAVE/ITERATE
ERR10_028   EQU   (ERRC_MSG+28)     ; invalid 'DO' syntax
ERR10_029   EQU   (ERRC_MSG+29)     ; incomplete DO/IF/SELECT

ERR10_030   EQU   (ERRC_MSG+30)     ; label not found
ERR10_031   EQU   (ERRC_MSG+31)     ; symbol expected
ERR10_032   EQU   (ERRC_MSG+32)     ; string or symbol expected
ERR10_033   EQU   (ERRC_MSG+33)     ; invalid sub-keyword
ERR10_034   EQU   (ERRC_MSG+34)     ; required keyword missing
ERR10_035   EQU   (ERRC_MSG+35)     ; extraneous characters in clause
ERR10_036   EQU   (ERRC_MSG+36)     ; sub-keyword conflict
ERR10_037   EQU   (ERRC_MSG+37)     ; invalid template
				    ; unassigned
ERR10_039   EQU   (ERRC_MSG+39)     ; uninitialized variable

ERR10_040   EQU   (ERRC_MSG+40)     ; invalid variable name
ERR10_041   EQU   (ERRC_MSG+41)     ; invalid expression
ERR10_042   EQU   (ERRC_MSG+42)     ; unbalanced parentheses
ERR10_043   EQU   (ERRC_MSG+43)     ; nesting level exceeded
ERR10_044   EQU   (ERRC_MSG+44)     ; invalid expression result
ERR10_045   EQU   (ERRC_MSG+45)     ; expression required
ERR10_046   EQU   (ERRC_MSG+46)     ; boolean value not 0 or 1
ERR10_047   EQU   (ERRC_MSG+47)     ; arithmetic conversion error
ERR10_048   EQU   (ERRC_MSG+48)     ; invalid operand

* Return Codes for general use ...
RC_FAIL     EQU   -1		    ; something's wrong
RC_OK       EQU   0                 ; success
RC_WARN     EQU   5                 ; A warning only
RC_ERROR    EQU   10                ; Something wrong
RC_FATAL    EQU   20                ; Complete or severe failure

         ENDC
