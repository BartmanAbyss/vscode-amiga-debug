/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef PROTO_INPUT_H
#define PROTO_INPUT_H

#include <clib/input_protos.h>

#ifndef _NO_INLINE
# if defined(__GNUC__)
#  ifdef __AROS__
#   include <defines/input.h>
#  else
#   include <inline/input.h>
#  endif
# else
#  include <pragmas/input_pragmas.h>
# endif
#endif /* _NO_INLINE */

#ifdef __amigaos4__
# include <interfaces/input.h>
# ifndef __NOGLOBALIFACE__
   extern struct InputIFace *IInput;
# endif /* __NOGLOBALIFACE__*/
#endif /* !__amigaos4__ */
#ifndef __NOLIBBASE__
  extern struct Device *
# ifdef __CONSTLIBBASEDECL__
   __CONSTLIBBASEDECL__
# endif /* __CONSTLIBBASEDECL__ */
  InputBase;
#endif /* !__NOLIBBASE__ */

#endif /* !PROTO_INPUT_H */
