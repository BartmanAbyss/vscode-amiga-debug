#ifndef REXX_ERRORS_H
#define REXX_ERRORS_H
/*
**	$VER: errors.h 1.4 (8.11.1991)
**	Includes Release 45.1
**
**	Definitions for ARexx error codes
**
**	(C) Copyright 1987,1988,1989,1990 William S. Hawes
**	(C) Copyright 1990-2001 Amiga, Inc.
**		All Rights Reserved
*/

#define ERRC_MSG  0		       /*  error code offset	       */
#define ERR10_001 (ERRC_MSG+1)	       /*  program not found	       */
#define ERR10_002 (ERRC_MSG+2)	       /*  execution halted	       */
#define ERR10_003 (ERRC_MSG+3)	       /*  no memory available	       */
#define ERR10_004 (ERRC_MSG+4)	       /*  invalid character in program*/
#define ERR10_005 (ERRC_MSG+5)	       /*  unmatched quote	       */
#define ERR10_006 (ERRC_MSG+6)	       /*  unterminated comment        */
#define ERR10_007 (ERRC_MSG+7)	       /*  clause too long	       */
#define ERR10_008 (ERRC_MSG+8)	       /*  unrecognized token	       */
#define ERR10_009 (ERRC_MSG+9)	       /*  symbol or string too long   */

#define ERR10_010 (ERRC_MSG+10)        /*  invalid message packet      */
#define ERR10_011 (ERRC_MSG+11)        /*  command string error        */
#define ERR10_012 (ERRC_MSG+12)        /*  error return from function  */
#define ERR10_013 (ERRC_MSG+13)        /*  host environment not found  */
#define ERR10_014 (ERRC_MSG+14)        /*  required library not found  */
#define ERR10_015 (ERRC_MSG+15)        /*  function not found	       */
#define ERR10_016 (ERRC_MSG+16)        /*  no return value	       */
#define ERR10_017 (ERRC_MSG+17)        /*  wrong number of arguments   */
#define ERR10_018 (ERRC_MSG+18)        /*  invalid argument to function*/
#define ERR10_019 (ERRC_MSG+19)        /*  invalid PROCEDURE	       */

#define ERR10_020 (ERRC_MSG+20)        /*  unexpected THEN/ELSE        */
#define ERR10_021 (ERRC_MSG+21)        /*  unexpected WHEN/OTHERWISE   */
#define ERR10_022 (ERRC_MSG+22)        /*  unexpected LEAVE or ITERATE */
#define ERR10_023 (ERRC_MSG+23)        /*  invalid statement in SELECT */
#define ERR10_024 (ERRC_MSG+24)        /*  missing THEN clauses        */
#define ERR10_025 (ERRC_MSG+25)        /*  missing OTHERWISE	       */
#define ERR10_026 (ERRC_MSG+26)        /*  missing or unexpected END   */
#define ERR10_027 (ERRC_MSG+27)        /*  symbol mismatch on END      */
#define ERR10_028 (ERRC_MSG+28)        /*  invalid DO syntax	       */
#define ERR10_029 (ERRC_MSG+29)        /*  incomplete DO/IF/SELECT     */

#define ERR10_030 (ERRC_MSG+30)        /*  label not found	       */
#define ERR10_031 (ERRC_MSG+31)        /*  symbol expected	       */
#define ERR10_032 (ERRC_MSG+32)        /*  string or symbol expected   */
#define ERR10_033 (ERRC_MSG+33)        /*  invalid sub-keyword	       */
#define ERR10_034 (ERRC_MSG+34)        /*  required keyword missing    */
#define ERR10_035 (ERRC_MSG+35)        /*  extraneous characters       */
#define ERR10_036 (ERRC_MSG+36)        /*  sub-keyword conflict        */
#define ERR10_037 (ERRC_MSG+37)        /*  invalid template	       */
#define ERR10_038 (ERRC_MSG+38)        /*  invalid TRACE request       */
#define ERR10_039 (ERRC_MSG+39)        /*  uninitialized variable      */

#define ERR10_040 (ERRC_MSG+40)        /*  invalid variable name       */
#define ERR10_041 (ERRC_MSG+41)        /*  invalid expression	       */
#define ERR10_042 (ERRC_MSG+42)        /*  unbalanced parentheses      */
#define ERR10_043 (ERRC_MSG+43)        /*  nesting level exceeded      */
#define ERR10_044 (ERRC_MSG+44)        /*  invalid expression result   */
#define ERR10_045 (ERRC_MSG+45)        /*  expression required	       */
#define ERR10_046 (ERRC_MSG+46)        /*  boolean value not 0 or 1    */
#define ERR10_047 (ERRC_MSG+47)        /*  arithmetic conversion error */
#define ERR10_048 (ERRC_MSG+48)        /*  invalid operand	       */

/*
 * Return Codes for general use
 */
#define RC_OK	  0L		       /*  success		       */
#define RC_WARN   5L		       /*  warning only	       */
#define RC_ERROR  10L		       /*  something's wrong	       */
#define RC_FATAL  20L		       /*  complete or severe failure  */

#endif
