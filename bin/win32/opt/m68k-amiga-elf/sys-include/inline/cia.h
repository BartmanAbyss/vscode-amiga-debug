/* Automatically generated header (sfdc 1.11)! Do not edit! */

#ifndef _INLINE_CIA_H
#define _INLINE_CIA_H

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

#define AddICRVector(___resource, ___iCRBit, ___interrupt) \
      LP3UB(0x6, struct Interrupt *, AddICRVector , struct Library *, ___resource, a6, WORD, ___iCRBit, d0, struct Interrupt *, ___interrupt, a1)

#define RemICRVector(___resource, ___iCRBit, ___interrupt) \
      LP3NRUB(0xc, RemICRVector , struct Library *, ___resource, a6, WORD, ___iCRBit, d0, struct Interrupt *, ___interrupt, a1)

#define AbleICR(___resource, ___mask) \
      LP2UB(0x12, WORD, AbleICR , struct Library *, ___resource, a6, WORD, ___mask, d0)

#define SetICR(___resource, ___mask) \
      LP2UB(0x18, WORD, SetICR , struct Library *, ___resource, a6, WORD, ___mask, d0)

#endif /* !_INLINE_CIA_H */
