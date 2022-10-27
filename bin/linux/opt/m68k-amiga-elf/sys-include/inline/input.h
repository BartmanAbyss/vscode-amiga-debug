/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef _INLINE_INPUT_H
#define _INLINE_INPUT_H

#ifndef _SFDC_VARARG_DEFINED
#define _SFDC_VARARG_DEFINED
#ifdef __HAVE_IPTR_ATTR__
typedef APTR _sfdc_vararg __attribute__((iptr));
#else
typedef ULONG _sfdc_vararg;
#endif /* __HAVE_IPTR_ATTR__ */
#endif /* _SFDC_VARARG_DEFINED */

#ifndef __INLINE_MACROS_H
#include <inline/macros.h>
#endif /* !__INLINE_MACROS_H */

#ifndef INPUT_BASE_NAME
#define INPUT_BASE_NAME InputBase
#endif /* !INPUT_BASE_NAME */

#define PeekQualifier() \
      LP0(0x2a, UWORD, PeekQualifier ,\
      , INPUT_BASE_NAME)

#endif /* !_INLINE_INPUT_H */
