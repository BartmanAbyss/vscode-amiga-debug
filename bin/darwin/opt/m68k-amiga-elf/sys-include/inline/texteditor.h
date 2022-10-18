/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef _INLINE_TEXTEDITOR_H
#define _INLINE_TEXTEDITOR_H

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

#ifndef TEXTEDITOR_BASE_NAME
#define TEXTEDITOR_BASE_NAME TextFieldBase
#endif /* !TEXTEDITOR_BASE_NAME */

#define TEXTEDITOR_GetClass() \
      LP0(0x1e, Class *, TEXTEDITOR_GetClass ,\
      , TEXTEDITOR_BASE_NAME)

#endif /* !_INLINE_TEXTEDITOR_H */
