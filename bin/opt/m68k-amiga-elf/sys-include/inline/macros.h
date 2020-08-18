#ifndef __INLINE_MACROS_H
#define __INLINE_MACROS_H

/*
   General macros for Amiga function calls. Not all the possibilities have
   been created - only the ones which exist in OS 3.1. Third party libraries
   and future versions of AmigaOS will maybe need some new ones...

   LPX - functions that take X arguments.

   Modifiers (variations are possible):
   NR - no return (void),
   A4, A5 - "a4" or "a5" is used as one of the arguments,
   UB - base will be given explicitly by user (see cia.resource).
   FP - one of the parameters has type "pointer to function".
   FR - the return type is a "pointer to function".

   "bt" arguments are not used - they are provided for backward compatibility
   only.
*/

#ifndef __INLINE_STUB_H
#include <inline/stubs.h>
#endif

#define LP0(offs, rt, name, bt, bn)				\
({								\
   rt _##name##_re2 =						\
   ({								\
      register volatile int _d1 __asm("d1");				\
      register volatile int _a0 __asm("a0");				\
      register volatile int _a1 __asm("a1");				\
               register rt _##name##_re __asm("d0");			\
      register volatile void *const _##name##_bn __asm("a6") = (bn);	\
      __asm volatile ("jsr %%a6@(-"#offs":W)"			\
      : "=r" (_##name##_re), "=r" (_d1), "=r" (_a0), "=r" (_a1)	\
      : "r" (_##name##_bn)					\
      : "fp0", "fp1", "cc", "memory");				\
      _##name##_re;						\
   });								\
   _##name##_re2;						\
})

#define LP0FR(offs, rt, name, bt, bn, fpr)				\
({								\
   typedef fpr;						\
   rt _##name##_re2 =						\
   ({								\
      register volatile int _d1 __asm("d1");				\
      register volatile int _a0 __asm("a0");				\
      register volatile int _a1 __asm("a1");				\
               register rt _##name##_re __asm("d0");			\
      register volatile void *const _##name##_bn __asm("a6") = (bn);	\
      __asm volatile ("jsr %%a6@(-"#offs":W)"			\
      : "=r" (_##name##_re), "=r" (_d1), "=r" (_a0), "=r" (_a1)	\
      : "r" (_##name##_bn)					\
      : "fp0", "fp1", "cc", "memory");				\
      _##name##_re;						\
   });								\
   _##name##_re2;						\
})

#define LP0NR(offs, name, bt, bn)				\
({								\
   {								\
      register volatile int _d0 __asm("d0");				\
      register volatile int _d1 __asm("d1");				\
      register volatile int _a0 __asm("a0");				\
      register volatile int _a1 __asm("a1");				\
      register volatile void *const _##name##_bn __asm("a6") = (bn);	\
      __asm volatile ("jsr %%a6@(-"#offs":W)"			\
      : "=r" (_d0), "=r" (_d1), "=r" (_a0), "=r" (_a1)		\
      : "r" (_##name##_bn)					\
      : "fp0", "fp1", "cc", "memory");				\
   }								\
})

#define LP1(offs, rt, name, t1, v1, r1, bt, bn)			\
({								\
   t1 _##name##_v1 = (v1);					\
   rt _##name##_re2 =						\
   ({								\
      register volatile int _d1 __asm("d1");				\
      register volatile int _a0 __asm("a0");				\
      register volatile int _a1 __asm("a1");				\
               register rt _##name##_re __asm("d0");			\
      register volatile void *const _##name##_bn __asm("a6") = (bn);	\
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;		\
      __asm volatile ("jsr %%a6@(-"#offs":W)"			\
      : "=r" (_##name##_re), "=r" (_d1), "=r" (_a0), "=r" (_a1)	\
      : "r" (_##name##_bn), "rf"(_n1)				\
      : "fp0", "fp1", "cc", "memory");				\
      _##name##_re;						\
   });								\
   _##name##_re2;						\
})

#define LP1FP(offs, rt, name, t1, v1, r1, bt, bn, fpt)		\
({								\
   typedef fpt;							\
   t1 _##name##_v1 = (v1);					\
   rt _##name##_re2 =						\
   ({								\
      register volatile int _d1 __asm("d1");				\
      register volatile int _a0 __asm("a0");				\
      register volatile int _a1 __asm("a1");				\
               register rt _##name##_re __asm("d0");			\
      register volatile void *const _##name##_bn __asm("a6") = (bn);	\
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;		\
      __asm volatile ("jsr %%a6@(-"#offs":W)"			\
      : "=r" (_##name##_re), "=r" (_d1), "=r" (_a0), "=r" (_a1)	\
      : "r" (_##name##_bn), "rf"(_n1)				\
      : "fp0", "fp1", "cc", "memory");				\
      _##name##_re;						\
   });								\
   _##name##_re2;						\
})

#define LP1FR(offs, rt, name, t1, v1, r1, bt, bn, fpr)			\
({								\
   typedef fpr;					\
   t1 _##name##_v1 = (v1);					\
   rt _##name##_re2 =						\
   ({								\
      register volatile int _d1 __asm("d1");				\
      register volatile int _a0 __asm("a0");				\
      register volatile int _a1 __asm("a1");				\
               register rt _##name##_re __asm("d0");			\
      register volatile void *const _##name##_bn __asm("a6") = (bn);	\
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;		\
      __asm volatile ("jsr %%a6@(-"#offs":W)"			\
      : "=r" (_##name##_re), "=r" (_d1), "=r" (_a0), "=r" (_a1)	\
      : "r" (_##name##_bn), "rf"(_n1)				\
      : "fp0", "fp1", "cc", "memory");				\
      _##name##_re;						\
   });								\
   _##name##_re2;						\
})

#define LP1FPFR(offs, rt, name, t1, v1, r1, bt, bn, fpt, fpr)			\
({								\
   typedef fpr;					\
   typedef fpt;					\
   t1 _##name##_v1 = (v1);					\
   rt _##name##_re2 =						\
   ({								\
      register volatile int _d1 __asm("d1");				\
      register volatile int _a0 __asm("a0");				\
      register volatile int _a1 __asm("a1");				\
               register rt _##name##_re __asm("d0");			\
      register volatile void *const _##name##_bn __asm("a6") = (bn);	\
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;		\
      __asm volatile ("jsr %%a6@(-"#offs":W)"			\
      : "=r" (_##name##_re), "=r" (_d1), "=r" (_a0), "=r" (_a1)	\
      : "r" (_##name##_bn), "rf"(_n1)				\
      : "fp0", "fp1", "cc", "memory");				\
      _##name##_re;						\
   });								\
   _##name##_re2;						\
})

#define LP1NR(offs, name, t1, v1, r1, bt, bn)			\
({								\
   t1 _##name##_v1 = (v1);					\
   {								\
      register volatile int _d0 __asm("d0");				\
      register volatile int _d1 __asm("d1");				\
      register volatile int _a0 __asm("a0");				\
      register volatile int _a1 __asm("a1");				\
      register volatile void *const _##name##_bn __asm("a6") = (bn);	\
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;		\
      __asm volatile ("jsr %%a6@(-"#offs":W)"			\
      : "=r" (_d0), "=r" (_d1), "=r" (_a0), "=r" (_a1)		\
      : "r" (_##name##_bn), "rf"(_n1)				\
      : "fp0", "fp1", "cc", "memory");				\
   }								\
})

/* Only graphics.library/AttemptLockLayerRom() */
#define LP1A5(offs, rt, name, t1, v1, r1, bt, bn)		\
({								\
   t1 _##name##_v1 = (v1);					\
   rt _##name##_re2 =						\
   ({								\
      register volatile int _d1 __asm("d1");				\
      register volatile int _a0 __asm("a0");				\
      register volatile int _a1 __asm("a1");				\
               register rt _##name##_re __asm("d0");			\
      register volatile void *const _##name##_bn __asm("a6") = (bn);	\
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;		\
      __asm volatile ("exg %%d7,%%a5\n\tjsr %%a6@(-"#offs":W)\n\texg %%d7,%%a5" \
      : "=r" (_##name##_re), "=r" (_d1), "=r" (_a0), "=r" (_a1)	\
      : "r" (_##name##_bn), "rf"(_n1)				\
      : "fp0", "fp1", "cc", "memory");				\
      _##name##_re;						\
   });								\
   _##name##_re2;						\
})

/* Only graphics.library/LockLayerRom() and graphics.library/UnlockLayerRom() */
#define LP1NRA5(offs, name, t1, v1, r1, bt, bn)			\
({								\
   t1 _##name##_v1 = (v1);					\
   {								\
      register volatile int _d0 __asm("d0");				\
      register volatile int _d1 __asm("d1");				\
      register volatile int _a0 __asm("a0");				\
      register volatile int _a1 __asm("a1");				\
      register volatile void *const _##name##_bn __asm("a6") = (bn);	\
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;		\
      __asm volatile ("\texg %%d7,%%a5\n\tjsr %%a6@(-"#offs":W)\n\texg %%d7,%%a5" \
      : "=r" (_d0), "=r" (_d1), "=r" (_a0), "=r" (_a1)		\
      : "r" (_##name##_bn), "rf"(_n1)				\
      : "fp0", "fp1", "cc", "memory");				\
   }								\
})

/* Only exec.library/Supervisor() */
#define LP1A5FP(offs, rt, name, t1, v1, r1, bt, bn, fpt)	\
({								\
   typedef fpt;							\
   t1 _##name##_v1 = (v1);					\
   rt _##name##_re2 =						\
   ({								\
      register volatile int _d1 __asm("d1");				\
      register volatile int _a0 __asm("a0");				\
      register volatile int _a1 __asm("a1");				\
               register rt _##name##_re __asm("d0");			\
      register volatile void *const _##name##_bn __asm("a6") = (bn);	\
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;		\
      __asm volatile ("\texg %%d7,%%a5\n\tjsr %%a6@(-"#offs":W)\n\texg %%d7,%%a5" \
      : "=r" (_##name##_re), "=r" (_d1), "=r" (_a0), "=r" (_a1)	\
      : "r" (_##name##_bn), "rf"(_n1)				\
      : "fp0", "fp1", "cc", "memory");				\
      _##name##_re;						\
   });								\
   _##name##_re2;						\
})

#define LP1NRFP(offs, name, t1, v1, r1, bt, bn, fpt) \
({                                                              \
   typedef fpt;                                                 \
   t1 _##name##_v1 = (v1);                                      \
   {                                                            \
      register volatile int _d0 __asm("d0");                             \
      register volatile int _d1 __asm("d1");                             \
      register volatile int _a0 __asm("a0");                             \
      register volatile int _a1 __asm("a1");                             \
      register volatile void *const _##name##_bn __asm("a6") = (bn);     \
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;                \
      __asm volatile ("jsr %%a6@(-"#offs":W)"                     \
      : "=r" (_d0), "=r" (_d1), "=r" (_a0), "=r" (_a1)          \
      : "r" (_##name##_bn), "rf"(_n1)                           \
      : "fp0", "fp1", "cc", "memory");                          \
   }                                                            \
})

#define LP2(offs, rt, name, t1, v1, r1, t2, v2, r2, bt, bn)	\
({								\
   t1 _##name##_v1 = (v1);					\
   t2 _##name##_v2 = (v2);					\
   rt _##name##_re2 =						\
   ({								\
      register volatile int _d1 __asm("d1");				\
      register volatile int _a0 __asm("a0");				\
      register volatile int _a1 __asm("a1");				\
               register rt _##name##_re __asm("d0");			\
      register volatile void *const _##name##_bn __asm("a6") = (bn);	\
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;		\
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;		\
      __asm volatile ("jsr %%a6@(-"#offs":W)"			\
      : "=r" (_##name##_re), "=r" (_d1), "=r" (_a0), "=r" (_a1)	\
      : "r" (_##name##_bn), "rf"(_n1), "rf"(_n2)		\
      : "fp0", "fp1", "cc", "memory");				\
      _##name##_re;						\
   });								\
   _##name##_re2;						\
})

#define LP2NR(offs, name, t1, v1, r1, t2, v2, r2, bt, bn)	\
({								\
   t1 _##name##_v1 = (v1);					\
   t2 _##name##_v2 = (v2);					\
   {								\
      register volatile int _d0 __asm("d0");				\
      register volatile int _d1 __asm("d1");				\
      register volatile int _a0 __asm("a0");				\
      register volatile int _a1 __asm("a1");				\
      register volatile void *const _##name##_bn __asm("a6") = (bn);	\
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;		\
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;		\
      __asm volatile ("jsr %%a6@(-"#offs":W)"			\
      : "=r" (_d0), "=r" (_d1), "=r" (_a0), "=r" (_a1)		\
      : "r" (_##name##_bn), "rf"(_n1), "rf"(_n2)		\
      : "fp0", "fp1", "cc", "memory");				\
   }								\
})

/* Only cia.resource/AbleICR() and cia.resource/SetICR() */
#define LP2UB(offs, rt, name, t1, v1, r1, t2, v2, r2)		\
({								\
   t1 _##name##_v1 = (v1);					\
   t2 _##name##_v2 = (v2);					\
   rt _##name##_re2 =						\
   ({								\
      register volatile int _d1 __asm("d1");				\
      register volatile int _a0 __asm("a0");				\
      register volatile int _a1 __asm("a1");				\
               register rt _##name##_re __asm("d0");			\
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;		\
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;		\
      __asm volatile ("jsr %%a6@(-"#offs":W)"			\
      : "=r" (_##name##_re), "=r" (_d1), "=r" (_a0), "=r" (_a1)	\
      : "r"(_n1), "rf"(_n2)					\
      : "fp0", "fp1", "cc", "memory");				\
      _##name##_re;						\
   });								\
   _##name##_re2;						\
})

/* Only dos.library/InternalUnLoadSeg() */
#define LP2FP(offs, rt, name, t1, v1, r1, t2, v2, r2, bt, bn, fpt) \
({								\
   typedef fpt;							\
   t1 _##name##_v1 = (v1);					\
   t2 _##name##_v2 = (v2);					\
   rt _##name##_re2 =						\
   ({								\
      register volatile int _d1 __asm("d1");				\
      register volatile int _a0 __asm("a0");				\
      register volatile int _a1 __asm("a1");				\
               register rt _##name##_re __asm("d0");			\
      register volatile void *const _##name##_bn __asm("a6") = (bn);	\
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;		\
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;		\
      __asm volatile ("jsr %%a6@(-"#offs":W)"			\
      : "=r" (_##name##_re), "=r" (_d1), "=r" (_a0), "=r" (_a1)	\
      : "r" (_##name##_bn), "rf"(_n1), "rf"(_n2)		\
      : "fp0", "fp1", "cc", "memory");				\
      _##name##_re;						\
   });								\
   _##name##_re2;						\
})

#define LP2FPFR(offs, rt, name, t1, v1, r1, t2, v2, r2, bt, bn, fpt, fpr) \
({								\
   typedef fpr;							\
   typedef fpt;							\
   t1 _##name##_v1 = (v1);					\
   t2 _##name##_v2 = (v2);					\
   rt _##name##_re2 =						\
   ({								\
      register volatile int _d1 __asm("d1");				\
      register volatile int _a0 __asm("a0");				\
      register volatile int _a1 __asm("a1");				\
               register rt _##name##_re __asm("d0");			\
      register volatile void *const _##name##_bn __asm("a6") = (bn);	\
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;		\
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;		\
      __asm volatile ("jsr %%a6@(-"#offs":W)"			\
      : "=r" (_##name##_re), "=r" (_d1), "=r" (_a0), "=r" (_a1)	\
      : "r" (_##name##_bn), "rf"(_n1), "rf"(_n2)		\
      : "fp0", "fp1", "cc", "memory");				\
      _##name##_re;						\
   });								\
   _##name##_re2;						\
})

#define LP2NRFP(offs, name, t1, v1, r1, t2, v2, r2, bt, bn, fpt) \
({                                                              \
   typedef fpt;                                                 \
   t1 _##name##_v1 = (v1);                                      \
   t2 _##name##_v2 = (v2);                                      \
   {                                                            \
      register volatile int _d0 __asm("d0");                             \
      register volatile int _d1 __asm("d1");                             \
      register volatile int _a0 __asm("a0");                             \
      register volatile int _a1 __asm("a1");                             \
      register volatile void *const _##name##_bn __asm("a6") = (bn);     \
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;                \
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;                \
      __asm volatile ("jsr %%a6@(-"#offs":W)"                     \
      : "=r" (_d0), "=r" (_d1), "=r" (_a0), "=r" (_a1)          \
      : "r" (_##name##_bn), "rf"(_n1), "rf"(_n2)                \
      : "fp0", "fp1", "cc", "memory");                          \
   }                                                            \
})

#define LP3(offs, rt, name, t1, v1, r1, t2, v2, r2, t3, v3, r3, bt, bn) \
({								\
   t1 _##name##_v1 = (v1);					\
   t2 _##name##_v2 = (v2);					\
   t3 _##name##_v3 = (v3);					\
   rt _##name##_re2 =						\
   ({								\
      register volatile int _d1 __asm("d1");				\
      register volatile int _a0 __asm("a0");				\
      register volatile int _a1 __asm("a1");				\
               register rt _##name##_re __asm("d0");			\
      register volatile void *const _##name##_bn __asm("a6") = (bn);	\
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;		\
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;		\
      register volatile t3 _n3 __asm(#r3) = _##name##_v3;		\
      __asm volatile ("jsr %%a6@(-"#offs":W)"			\
      : "=r" (_##name##_re), "=r" (_d1), "=r" (_a0), "=r" (_a1)	\
      : "r" (_##name##_bn), "rf"(_n1), "rf"(_n2), "rf"(_n3)	\
      : "fp0", "fp1", "cc", "memory");				\
      _##name##_re;						\
   });								\
   _##name##_re2;						\
})

#define LP3NR(offs, name, t1, v1, r1, t2, v2, r2, t3, v3, r3, bt, bn) \
({								\
   t1 _##name##_v1 = (v1);					\
   t2 _##name##_v2 = (v2);					\
   t3 _##name##_v3 = (v3);					\
   {								\
      register volatile int _d0 __asm("d0");				\
      register volatile int _d1 __asm("d1");				\
      register volatile int _a0 __asm("a0");				\
      register volatile int _a1 __asm("a1");				\
      register volatile void *const _##name##_bn __asm("a6") = (bn);	\
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;		\
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;		\
      register volatile t3 _n3 __asm(#r3) = _##name##_v3;		\
      __asm volatile ("jsr %%a6@(-"#offs":W)"			\
      : "=r" (_d0), "=r" (_d1), "=r" (_a0), "=r" (_a1)		\
      : "r" (_##name##_bn), "rf"(_n1), "rf"(_n2), "rf"(_n3)	\
      : "fp0", "fp1", "cc", "memory");				\
   }								\
})

/* Only cia.resource/AddICRVector() */
#define LP3UB(offs, rt, name, t1, v1, r1, t2, v2, r2, t3, v3, r3) \
({								\
   t1 _##name##_v1 = (v1);					\
   t2 _##name##_v2 = (v2);					\
   t3 _##name##_v3 = (v3);					\
   rt _##name##_re2 =						\
   ({								\
      register volatile int _d1 __asm("d1");				\
      register volatile int _a0 __asm("a0");				\
      register volatile int _a1 __asm("a1");				\
               register rt _##name##_re __asm("d0");			\
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;		\
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;		\
      register volatile t3 _n3 __asm(#r3) = _##name##_v3;		\
      __asm volatile ("jsr %%a6@(-"#offs":W)"			\
      : "=r" (_##name##_re), "=r" (_d1), "=r" (_a0), "=r" (_a1)	\
      : "r"(_n1), "rf"(_n2), "rf"(_n3)				\
      : "fp0", "fp1", "cc", "memory");				\
      _##name##_re;						\
   });								\
   _##name##_re2;						\
})

/* Only cia.resource/RemICRVector() */
#define LP3NRUB(offs, name, t1, v1, r1, t2, v2, r2, t3, v3, r3)	\
({								\
   t1 _##name##_v1 = (v1);					\
   t2 _##name##_v2 = (v2);					\
   t3 _##name##_v3 = (v3);					\
   {								\
      register volatile int _d0 __asm("d0");				\
      register volatile int _d1 __asm("d1");				\
      register volatile int _a0 __asm("a0");				\
      register volatile int _a1 __asm("a1");				\
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;		\
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;		\
      register volatile t3 _n3 __asm(#r3) = _##name##_v3;		\
      __asm volatile ("jsr %%a6@(-"#offs":W)"			\
      : "=r" (_d0), "=r" (_d1), "=r" (_a0), "=r" (_a1)		\
      : "r"(_n1), "rf"(_n2), "rf"(_n3)				\
      : "fp0", "fp1", "cc", "memory");				\
   }								\
})

/* Only exec.library/SetFunction() */
#define LP3FP(offs, rt, name, t1, v1, r1, t2, v2, r2, t3, v3, r3, bt, bn, fpt) \
({								\
   typedef fpt;							\
   t1 _##name##_v1 = (v1);					\
   t2 _##name##_v2 = (v2);					\
   t3 _##name##_v3 = (v3);					\
   rt _##name##_re2 =						\
   ({								\
      register volatile int _d1 __asm("d1");				\
      register volatile int _a0 __asm("a0");				\
      register volatile int _a1 __asm("a1");				\
               register rt _##name##_re __asm("d0");			\
      register volatile void *const _##name##_bn __asm("a6") = (bn);	\
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;		\
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;		\
      register volatile t3 _n3 __asm(#r3) = _##name##_v3;		\
      __asm volatile ("jsr %%a6@(-"#offs":W)"			\
      : "=r" (_##name##_re), "=r" (_d1), "=r" (_a0), "=r" (_a1)	\
      : "r" (_##name##_bn), "rf"(_n1), "rf"(_n2), "rf"(_n3)	\
      : "fp0", "fp1", "cc", "memory");				\
      _##name##_re;						\
   });								\
   _##name##_re2;						\
})

#define LP3FP2(offs, rt, name, t1, v1, r1, t2, v2, r2, t3, v3, r3, bt, bn, fpt1, fpt2) \
({								\
   typedef fpt1;							\
   typedef fpt2;							\
   t1 _##name##_v1 = (v1);					\
   t2 _##name##_v2 = (v2);					\
   t3 _##name##_v3 = (v3);					\
   rt _##name##_re2 =						\
   ({								\
      register volatile int _d1 __asm("d1");				\
      register volatile int _a0 __asm("a0");				\
      register volatile int _a1 __asm("a1");				\
               register rt _##name##_re __asm("d0");			\
      register volatile void *const _##name##_bn __asm("a6") = (bn);	\
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;		\
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;		\
      register volatile t3 _n3 __asm(#r3) = _##name##_v3;		\
      __asm volatile ("jsr %%a6@(-"#offs":W)"			\
      : "=r" (_##name##_re), "=r" (_d1), "=r" (_a0), "=r" (_a1)	\
      : "r" (_##name##_bn), "rf"(_n1), "rf"(_n2), "rf"(_n3)	\
      : "fp0", "fp1", "cc", "memory");				\
      _##name##_re;						\
   });								\
   _##name##_re2;						\
})

#define LP3FP3(offs, rt, name, t1, v1, r1, t2, v2, r2, t3, v3, r3, bt, bn, fpt1, fpt2, fpt3) \
({								\
   typedef fpt1;							\
   typedef fpt2;							\
   typedef fpt3;							\
   t1 _##name##_v1 = (v1);					\
   t2 _##name##_v2 = (v2);					\
   t3 _##name##_v3 = (v3);					\
   rt _##name##_re2 =						\
   ({								\
      register volatile int _d1 __asm("d1");				\
      register volatile int _a0 __asm("a0");				\
      register volatile int _a1 __asm("a1");				\
               register rt _##name##_re __asm("d0");			\
      register volatile void *const _##name##_bn __asm("a6") = (bn);	\
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;		\
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;		\
      register volatile t3 _n3 __asm(#r3) = _##name##_v3;		\
      __asm volatile ("jsr %%a6@(-"#offs":W)"			\
      : "=r" (_##name##_re), "=r" (_d1), "=r" (_a0), "=r" (_a1)	\
      : "r" (_##name##_bn), "rf"(_n1), "rf"(_n2), "rf"(_n3)	\
      : "fp0", "fp1", "cc", "memory");				\
      _##name##_re;						\
   });								\
   _##name##_re2;						\
})

/* Only graphics.library/SetCollision() */
#define LP3NRFP(offs, name, t1, v1, r1, t2, v2, r2, t3, v3, r3, bt, bn, fpt) \
({								\
   typedef fpt;							\
   t1 _##name##_v1 = (v1);					\
   t2 _##name##_v2 = (v2);					\
   t3 _##name##_v3 = (v3);					\
   {								\
      register volatile int _d0 __asm("d0");				\
      register volatile int _d1 __asm("d1");				\
      register volatile int _a0 __asm("a0");				\
      register volatile int _a1 __asm("a1");				\
      register volatile void *const _##name##_bn __asm("a6") = (bn);	\
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;		\
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;		\
      register volatile t3 _n3 __asm(#r3) = _##name##_v3;		\
      __asm volatile ("jsr %%a6@(-"#offs":W)"			\
      : "=r" (_d0), "=r" (_d1), "=r" (_a0), "=r" (_a1)		\
      : "r" (_##name##_bn), "rf"(_n1), "rf"(_n2), "rf"(_n3)	\
      : "fp0", "fp1", "cc", "memory");				\
   }								\
})

#define LP3NRFP2(offs, name, t1, v1, r1, t2, v2, r2, t3, v3, r3, bt, bn, fpt1, fpt2) \
({								\
   typedef fpt1;							\
   typedef fpt2;							\
   t1 _##name##_v1 = (v1);					\
   t2 _##name##_v2 = (v2);					\
   t3 _##name##_v3 = (v3);					\
   {								\
      register volatile int _d0 __asm("d0");				\
      register volatile int _d1 __asm("d1");				\
      register volatile int _a0 __asm("a0");				\
      register volatile int _a1 __asm("a1");				\
      register volatile void *const _##name##_bn __asm("a6") = (bn);	\
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;		\
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;		\
      register volatile t3 _n3 __asm(#r3) = _##name##_v3;		\
      __asm volatile ("jsr %%a6@(-"#offs":W)"			\
      : "=r" (_d0), "=r" (_d1), "=r" (_a0), "=r" (_a1)		\
      : "r" (_##name##_bn), "rf"(_n1), "rf"(_n2), "rf"(_n3)	\
      : "fp0", "fp1", "cc", "memory");				\
   }								\
})

#define LP3NRFP3(offs, name, t1, v1, r1, t2, v2, r2, t3, v3, r3, bt, bn, fpt1, fpt2, fpt3) \
({								\
   typedef fpt1;							\
   typedef fpt2;							\
   typedef fpt3;							\
   t1 _##name##_v1 = (v1);					\
   t2 _##name##_v2 = (v2);					\
   t3 _##name##_v3 = (v3);					\
   {								\
      register volatile int _d0 __asm("d0");				\
      register volatile int _d1 __asm("d1");				\
      register volatile int _a0 __asm("a0");				\
      register volatile int _a1 __asm("a1");				\
      register volatile void *const _##name##_bn __asm("a6") = (bn);	\
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;		\
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;		\
      register volatile t3 _n3 __asm(#r3) = _##name##_v3;		\
      __asm volatile ("jsr %%a6@(-"#offs":W)"			\
      : "=r" (_d0), "=r" (_d1), "=r" (_a0), "=r" (_a1)		\
      : "r" (_##name##_bn), "rf"(_n1), "rf"(_n2), "rf"(_n3)	\
      : "fp0", "fp1", "cc", "memory");				\
   }								\
})

#define LP4(offs, rt, name, t1, v1, r1, t2, v2, r2, t3, v3, r3, t4, v4, r4, bt, bn) \
({								\
   t1 _##name##_v1 = (v1);					\
   t2 _##name##_v2 = (v2);					\
   t3 _##name##_v3 = (v3);					\
   t4 _##name##_v4 = (v4);					\
   rt _##name##_re2 =						\
   ({								\
      register volatile int _d1 __asm("d1");				\
      register volatile int _a0 __asm("a0");				\
      register volatile int _a1 __asm("a1");				\
               register rt _##name##_re __asm("d0");			\
      register volatile void *const _##name##_bn __asm("a6") = (bn);	\
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;		\
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;		\
      register volatile t3 _n3 __asm(#r3) = _##name##_v3;		\
      register volatile t4 _n4 __asm(#r4) = _##name##_v4;		\
      __asm volatile ("jsr %%a6@(-"#offs":W)"			\
      : "=r" (_##name##_re), "=r" (_d1), "=r" (_a0), "=r" (_a1)	\
      : "r" (_##name##_bn), "rf"(_n1), "rf"(_n2), "rf"(_n3), "rf"(_n4) \
      : "fp0", "fp1", "cc", "memory");				\
      _##name##_re;						\
   });								\
   _##name##_re2;						\
})

#define LP4NR(offs, name, t1, v1, r1, t2, v2, r2, t3, v3, r3, t4, v4, r4, bt, bn) \
({								\
   t1 _##name##_v1 = (v1);					\
   t2 _##name##_v2 = (v2);					\
   t3 _##name##_v3 = (v3);					\
   t4 _##name##_v4 = (v4);					\
   {								\
      register volatile int _d0 __asm("d0");				\
      register volatile int _d1 __asm("d1");				\
      register volatile int _a0 __asm("a0");				\
      register volatile int _a1 __asm("a1");				\
      register volatile void *const _##name##_bn __asm("a6") = (bn);	\
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;		\
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;		\
      register volatile t3 _n3 __asm(#r3) = _##name##_v3;		\
      register volatile t4 _n4 __asm(#r4) = _##name##_v4;		\
      __asm volatile ("jsr %%a6@(-"#offs":W)"			\
      : "=r" (_d0), "=r" (_d1), "=r" (_a0), "=r" (_a1)		\
      : "r" (_##name##_bn), "rf"(_n1), "rf"(_n2), "rf"(_n3), "rf"(_n4) \
      : "fp0", "fp1", "cc", "memory");				\
   }								\
})

#define LP4NRFP3(offs, name, t1, v1, r1, t2, v2, r2, t3, v3, r3, t4, v4, r4, bt, bn, fpt1, fpt2, fpt3) \
({								\
   typedef fpt1;							\
   typedef fpt2;							\
   typedef fpt3;							\
   t1 _##name##_v1 = (v1);					\
   t2 _##name##_v2 = (v2);					\
   t3 _##name##_v3 = (v3);					\
   t4 _##name##_v4 = (v4);					\
   {								\
      register volatile int _d0 __asm("d0");				\
      register volatile int _d1 __asm("d1");				\
      register volatile int _a0 __asm("a0");				\
      register volatile int _a1 __asm("a1");				\
      register volatile void *const _##name##_bn __asm("a6") = (bn);	\
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;		\
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;		\
      register volatile t3 _n3 __asm(#r3) = _##name##_v3;		\
      register volatile t4 _n4 __asm(#r4) = _##name##_v4;		\
      __asm volatile ("jsr %%a6@(-"#offs":W)"			\
      : "=r" (_d0), "=r" (_d1), "=r" (_a0), "=r" (_a1)		\
      : "r" (_##name##_bn), "rf"(_n1), "rf"(_n2), "rf"(_n3), "rf"(_n4) \
      : "fp0", "fp1", "cc", "memory");				\
   }								\
})

/* Only exec.library/RawDoFmt() */
#define LP4FP(offs, rt, name, t1, v1, r1, t2, v2, r2, t3, v3, r3, t4, v4, r4, bt, bn, fpt) \
({								\
   typedef fpt;							\
   t1 _##name##_v1 = (v1);					\
   t2 _##name##_v2 = (v2);					\
   t3 _##name##_v3 = (v3);					\
   t4 _##name##_v4 = (v4);					\
   rt _##name##_re2 =						\
   ({								\
      register volatile int _d1 __asm("d1");				\
      register volatile int _a0 __asm("a0");				\
      register volatile int _a1 __asm("a1");				\
               register rt _##name##_re __asm("d0");			\
      register volatile void *const _##name##_bn __asm("a6") = (bn);	\
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;		\
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;		\
      register volatile t3 _n3 __asm(#r3) = _##name##_v3;		\
      register volatile t4 _n4 __asm(#r4) = _##name##_v4;		\
      __asm volatile ("jsr %%a6@(-"#offs":W)"			\
      : "=r" (_##name##_re), "=r" (_d1), "=r" (_a0), "=r" (_a1)	\
      : "r" (_##name##_bn), "rf"(_n1), "rf"(_n2), "rf"(_n3), "rf"(_n4) \
      : "fp0", "fp1", "cc", "memory");				\
      _##name##_re;						\
   });								\
   _##name##_re2;						\
})

#define LP4FP4(offs, rt, name, t1, v1, r1, t2, v2, r2, t3, v3, r3, t4, v4, r4, bt, bn, fpt1, fpt2, fpt3, fpt4) \
({								\
   typedef fpt1;							\
   typedef fpt2;							\
   typedef fpt3;							\
   typedef fpt4;							\
   t1 _##name##_v1 = (v1);					\
   t2 _##name##_v2 = (v2);					\
   t3 _##name##_v3 = (v3);					\
   t4 _##name##_v4 = (v4);					\
   rt _##name##_re2 =						\
   ({								\
      register volatile int _d1 __asm("d1");				\
      register volatile int _a0 __asm("a0");				\
      register volatile int _a1 __asm("a1");				\
               register rt _##name##_re __asm("d0");			\
      register volatile void *const _##name##_bn __asm("a6") = (bn);	\
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;		\
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;		\
      register volatile t3 _n3 __asm(#r3) = _##name##_v3;		\
      register volatile t4 _n4 __asm(#r4) = _##name##_v4;		\
      __asm volatile ("jsr %%a6@(-"#offs":W)"			\
      : "=r" (_##name##_re), "=r" (_d1), "=r" (_a0), "=r" (_a1)	\
      : "r" (_##name##_bn), "rf"(_n1), "rf"(_n2), "rf"(_n3), "rf"(_n4) \
      : "fp0", "fp1", "cc", "memory");				\
      _##name##_re;						\
   });								\
   _##name##_re2;						\
})

#define LP5(offs, rt, name, t1, v1, r1, t2, v2, r2, t3, v3, r3, t4, v4, r4, t5, v5, r5, bt, bn) \
({								\
   t1 _##name##_v1 = (v1);					\
   t2 _##name##_v2 = (v2);					\
   t3 _##name##_v3 = (v3);					\
   t4 _##name##_v4 = (v4);					\
   t5 _##name##_v5 = (v5);					\
   rt _##name##_re2 =						\
   ({								\
      register volatile int _d1 __asm("d1");				\
      register volatile int _a0 __asm("a0");				\
      register volatile int _a1 __asm("a1");				\
               register rt _##name##_re __asm("d0");			\
      register volatile void *const _##name##_bn __asm("a6") = (bn);	\
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;		\
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;		\
      register volatile t3 _n3 __asm(#r3) = _##name##_v3;		\
      register volatile t4 _n4 __asm(#r4) = _##name##_v4;		\
      register volatile t5 _n5 __asm(#r5) = _##name##_v5;		\
      __asm volatile ("jsr %%a6@(-"#offs":W)"			\
      : "=r" (_##name##_re), "=r" (_d1), "=r" (_a0), "=r" (_a1)	\
      : "r" (_##name##_bn), "rf"(_n1), "rf"(_n2), "rf"(_n3), "rf"(_n4), "rf"(_n5) \
      : "fp0", "fp1", "cc", "memory");				\
      _##name##_re;						\
   });								\
   _##name##_re2;						\
})

#define LP5NR(offs, name, t1, v1, r1, t2, v2, r2, t3, v3, r3, t4, v4, r4, t5, v5, r5, bt, bn) \
({								\
   t1 _##name##_v1 = (v1);					\
   t2 _##name##_v2 = (v2);					\
   t3 _##name##_v3 = (v3);					\
   t4 _##name##_v4 = (v4);					\
   t5 _##name##_v5 = (v5);					\
   {								\
      register volatile int _d0 __asm("d0");				\
      register volatile int _d1 __asm("d1");				\
      register volatile int _a0 __asm("a0");				\
      register volatile int _a1 __asm("a1");				\
      register volatile void *const _##name##_bn __asm("a6") = (bn);	\
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;		\
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;		\
      register volatile t3 _n3 __asm(#r3) = _##name##_v3;		\
      register volatile t4 _n4 __asm(#r4) = _##name##_v4;		\
      register volatile t5 _n5 __asm(#r5) = _##name##_v5;		\
      __asm volatile ("jsr %%a6@(-"#offs":W)"			\
      : "=r" (_d0), "=r" (_d1), "=r" (_a0), "=r" (_a1)		\
      : "r" (_##name##_bn), "rf"(_n1), "rf"(_n2), "rf"(_n3), "rf"(_n4), "rf"(_n5) \
      : "fp0", "fp1", "cc", "memory");				\
   }								\
})

#define LP5NRA4(offs, name, t1, v1, r1, t2, v2, r2, t3, v3, r3, t4, v4, r4, t5, v5, r5, bt, bn) \
({                                                              \
   t1 _##name##_v1 = (v1);                                      \
   t2 _##name##_v2 = (v2);                                      \
   t3 _##name##_v3 = (v3);                                      \
   t4 _##name##_v4 = (v4);                                      \
   t5 _##name##_v5 = (v5);                                      \
   {                                                            \
      register volatile int _d0 __asm("d0");                             \
      register volatile int _d1 __asm("d1");                             \
      register volatile int _a0 __asm("a0");                             \
      register volatile int _a1 __asm("a1");                             \
      register volatile void *const _##name##_bn __asm("a6") = (bn);     \
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;                \
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;                \
      register volatile t3 _n3 __asm(#r3) = _##name##_v3;                \
      register volatile t4 _n4 __asm(#r4) = _##name##_v4;                \
      register volatile t5 _n5 __asm(#r5) = _##name##_v5;                \
      __asm volatile ("exg %%d7,%%a4\n\tjsr %%a6@(-"#offs":W)\n\texg %%d7,%%a4" \
      : "=r" (_d0), "=r" (_d1), "=r" (_a0), "=r" (_a1)          \
      : "r" (_##name##_bn), "rf"(_n1), "rf"(_n2), "rf"(_n3), "rf"(_n4), "rf"(_n5) \
      : "fp0", "fp1", "cc", "memory");                          \
   };                                                           \
})

#define LP5NRA5(offs, name, t1, v1, r1, t2, v2, r2, t3, v3, r3, t4, v4, r4, t5, v5, r5, bt, bn) \
({								                                \
   t1 _##name##_v1 = (v1);                                      \
   t2 _##name##_v2 = (v2);                                      \
   t3 _##name##_v3 = (v3);                                      \
   t4 _##name##_v4 = (v4);                                      \
   t5 _##name##_v5 = (v5);                                      \
   {								                            \
      register volatile int _d0 __asm("d0");                             \
      register volatile int _d1 __asm("d1");                             \
      register volatile int _a0 __asm("a0");                             \
      register volatile int _a1 __asm("a1");                             \
      register volatile void *const _##name##_bn __asm("a6") = (bn);     \
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;                \
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;                \
      register volatile t3 _n3 __asm(#r3) = _##name##_v3;                \
      register volatile t4 _n4 __asm(#r4) = _##name##_v4;                \
      register volatile t5 _n5 __asm(#r5) = _##name##_v5;                \
      __asm volatile ("exg %%d7,%%a5\n\tjsr %%a6@(-"#offs":W)\n\texg %%d7,%%a5" \
      : "=r" (_d0), "=r" (_d1), "=r" (_a0), "=r" (_a1)          \
      : "r" (_##name##_bn), "rf"(_n1), "rf"(_n2), "rf"(_n3), "rf"(_n4), "rf"(_n5) \
      : "fp0", "fp1", "cc", "memory");                          \
   }								                            \
})

/* Only exec.library/MakeLibrary() */
#define LP5FP(offs, rt, name, t1, v1, r1, t2, v2, r2, t3, v3, r3, t4, v4, r4, t5, v5, r5, bt, bn, fpt) \
({								\
   typedef fpt;							\
   t1 _##name##_v1 = (v1);					\
   t2 _##name##_v2 = (v2);					\
   t3 _##name##_v3 = (v3);					\
   t4 _##name##_v4 = (v4);					\
   t5 _##name##_v5 = (v5);					\
   rt _##name##_re2 =						\
   ({								\
      register volatile int _d1 __asm("d1");				\
      register volatile int _a0 __asm("a0");				\
      register volatile int _a1 __asm("a1");				\
               register rt _##name##_re __asm("d0");			\
      register volatile void *const _##name##_bn __asm("a6") = (bn);	\
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;		\
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;		\
      register volatile t3 _n3 __asm(#r3) = _##name##_v3;		\
      register volatile t4 _n4 __asm(#r4) = _##name##_v4;		\
      register volatile t5 _n5 __asm(#r5) = _##name##_v5;		\
      __asm volatile ("jsr %%a6@(-"#offs":W)"			\
      : "=r" (_##name##_re), "=r" (_d1), "=r" (_a0), "=r" (_a1)	\
      : "r" (_##name##_bn), "rf"(_n1), "rf"(_n2), "rf"(_n3), "rf"(_n4), "rf"(_n5) \
      : "fp0", "fp1", "cc", "memory");				\
      _##name##_re;						\
   });								\
   _##name##_re2;						\
})

/* Only reqtools.library/XXX() */
#define LP5A4(offs, rt, name, t1, v1, r1, t2, v2, r2, t3, v3, r3, t4, v4, r4, t5, v5, r5, bt, bn) \
({								\
   t1 _##name##_v1 = (v1);					\
   t2 _##name##_v2 = (v2);					\
   t3 _##name##_v3 = (v3);					\
   t4 _##name##_v4 = (v4);					\
   t5 _##name##_v5 = (v5);					\
   rt _##name##_re2 =						\
   ({								\
      register volatile int _d1 __asm("d1");				\
      register volatile int _a0 __asm("a0");				\
      register volatile int _a1 __asm("a1");				\
               register rt _##name##_re __asm("d0");			\
      register volatile void *const _##name##_bn __asm("a6") = (bn);	\
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;		\
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;		\
      register volatile t3 _n3 __asm(#r3) = _##name##_v3;		\
      register volatile t4 _n4 __asm(#r4) = _##name##_v4;		\
      register volatile t5 _n5 __asm(#r5) = _##name##_v5;		\
      __asm volatile ("exg %%d7,%%a4\n\tjsr %%a6@(-"#offs":W)\n\texg %%d7,%%a4" \
      : "=r" (_##name##_re), "=r" (_d1), "=r" (_a0), "=r" (_a1)	\
      : "r" (_##name##_bn), "rf"(_n1), "rf"(_n2), "rf"(_n3), "rf"(_n4), "rf"(_n5) \
      : "fp0", "fp1", "cc", "memory");				\
      _##name##_re;						\
   });								\
   _##name##_re2;						\
})

#define LP5A4FP(offs, rt, name, t1, v1, r1, t2, v2, r2, t3, v3, r3, t4, v4, r4, t5, v5, r5, bt, bn, fpt) \
({                                                              \
   typedef fpt;                                                 \
   t1 _##name##_v1 = (v1);                                      \
   t2 _##name##_v2 = (v2);                                      \
   t3 _##name##_v3 = (v3);                                      \
   t4 _##name##_v4 = (v4);                                      \
   t5 _##name##_v5 = (v5);                                      \
   rt _##name##_re2 =                                           \
   ({                                                           \
      register volatile int _d1 __asm("d1");                             \
      register volatile int _a0 __asm("a0");                             \
      register volatile int _a1 __asm("a1");                             \
               register rt _##name##_re __asm("d0");                     \
      register volatile void *const _##name##_bn __asm("a6") = (bn);     \
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;                \
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;                \
      register volatile t3 _n3 __asm(#r3) = _##name##_v3;                \
      register volatile t4 _n4 __asm(#r4) = _##name##_v4;                \
      register volatile t5 _n5 __asm(#r5) = _##name##_v5;                \
      __asm volatile ("exg %%d7,%%a4\n\tjsr %%a6@(-"#offs":W)\n\texg %%d7,%%a4" \
      : "=r" (_##name##_re), "=r" (_d1), "=r" (_a0), "=r" (_a1) \
      : "r" (_##name##_bn), "rf"(_n1), "rf"(_n2), "rf"(_n3), "rf"(_n4), "rf"(_n5) \
      : "fp0", "fp1", "cc", "memory");                          \
      _##name##_re;                                             \
   });                                                          \
   _##name##_re2;                                               \
})

#define LP6(offs, rt, name, t1, v1, r1, t2, v2, r2, t3, v3, r3, t4, v4, r4, t5, v5, r5, t6, v6, r6, bt, bn) \
({								\
   t1 _##name##_v1 = (v1);					\
   t2 _##name##_v2 = (v2);					\
   t3 _##name##_v3 = (v3);					\
   t4 _##name##_v4 = (v4);					\
   t5 _##name##_v5 = (v5);					\
   t6 _##name##_v6 = (v6);					\
   rt _##name##_re2 =						\
   ({								\
      register volatile int _d1 __asm("d1");				\
      register volatile int _a0 __asm("a0");				\
      register volatile int _a1 __asm("a1");				\
               register rt _##name##_re __asm("d0");			\
      register volatile void *const _##name##_bn __asm("a6") = (bn);	\
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;		\
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;		\
      register volatile t3 _n3 __asm(#r3) = _##name##_v3;		\
      register volatile t4 _n4 __asm(#r4) = _##name##_v4;		\
      register volatile t5 _n5 __asm(#r5) = _##name##_v5;		\
      register volatile t6 _n6 __asm(#r6) = _##name##_v6;		\
      __asm volatile ("jsr %%a6@(-"#offs":W)"			\
      : "=r" (_##name##_re), "=r" (_d1), "=r" (_a0), "=r" (_a1)	\
      : "r" (_##name##_bn), "rf"(_n1), "rf"(_n2), "rf"(_n3), "rf"(_n4), "rf"(_n5), "rf"(_n6) \
      : "fp0", "fp1", "cc", "memory");				\
      _##name##_re;						\
   });								\
   _##name##_re2;						\
})

#define LP6NR(offs, name, t1, v1, r1, t2, v2, r2, t3, v3, r3, t4, v4, r4, t5, v5, r5, t6, v6, r6, bt, bn) \
({								\
   t1 _##name##_v1 = (v1);					\
   t2 _##name##_v2 = (v2);					\
   t3 _##name##_v3 = (v3);					\
   t4 _##name##_v4 = (v4);					\
   t5 _##name##_v5 = (v5);					\
   t6 _##name##_v6 = (v6);					\
   {								\
      register volatile int _d0 __asm("d0");				\
      register volatile int _d1 __asm("d1");				\
      register volatile int _a0 __asm("a0");				\
      register volatile int _a1 __asm("a1");				\
      register volatile void *const _##name##_bn __asm("a6") = (bn);	\
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;		\
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;		\
      register volatile t3 _n3 __asm(#r3) = _##name##_v3;		\
      register volatile t4 _n4 __asm(#r4) = _##name##_v4;		\
      register volatile t5 _n5 __asm(#r5) = _##name##_v5;		\
      register volatile t6 _n6 __asm(#r6) = _##name##_v6;		\
      __asm volatile ("jsr %%a6@(-"#offs":W)"			\
      : "=r" (_d0), "=r" (_d1), "=r" (_a0), "=r" (_a1)		\
      : "r" (_##name##_bn), "rf"(_n1), "rf"(_n2), "rf"(_n3), "rf"(_n4), "rf"(_n5), "rf"(_n6) \
      : "fp0", "fp1", "cc", "memory");				\
   }								\
})

#define LP6A4(offs, rt, name, t1, v1, r1, t2, v2, r2, t3, v3, r3, t4, v4, r4, t5, v5, r5, t6, v6, r6, bt, bn) \
({                                                              \
   t1 _##name##_v1 = (v1);                                      \
   t2 _##name##_v2 = (v2);                                      \
   t3 _##name##_v3 = (v3);                                      \
   t4 _##name##_v4 = (v4);                                      \
   t5 _##name##_v5 = (v5);                                      \
   t6 _##name##_v6 = (v6);                                      \
   rt _##name##_re2 =                                           \
   ({                                                           \
      register volatile int _d1 __asm("d1");                             \
      register volatile int _a0 __asm("a0");                             \
      register volatile int _a1 __asm("a1");                             \
               register rt _##name##_re __asm("d0");                     \
      register volatile void *const _##name##_bn __asm("a6") = (bn);     \
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;                \
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;                \
      register volatile t3 _n3 __asm(#r3) = _##name##_v3;                \
      register volatile t4 _n4 __asm(#r4) = _##name##_v4;                \
      register volatile t5 _n5 __asm(#r5) = _##name##_v5;                \
      register volatile t6 _n6 __asm(#r6) = _##name##_v6;                \
      __asm volatile ("exg %%d7,%%a4\n\tjsr %%a6@(-"#offs":W)\n\texg %%d7,%%a4" \
      : "=r" (_##name##_re), "=r" (_d1), "=r" (_a0), "=r" (_a1) \
      : "r" (_##name##_bn), "rf"(_n1), "rf"(_n2), "rf"(_n3), "rf"(_n4), "rf"(_n5), "rf"(_n6) \
      : "fp0", "fp1", "cc", "memory");                          \
      _##name##_re;                                             \
   });                                                          \
   _##name##_re2;                                               \
})

#define LP6NRA4(offs, name, t1, v1, r1, t2, v2, r2, t3, v3, r3, t4, v4, r4, t5, v5, r5, t6, v6, r6, bt, bn) \
({                                                              \
   t1 _##name##_v1 = (v1);                                      \
   t2 _##name##_v2 = (v2);                                      \
   t3 _##name##_v3 = (v3);                                      \
   t4 _##name##_v4 = (v4);                                      \
   t5 _##name##_v5 = (v5);                                      \
   t6 _##name##_v6 = (v6);                                      \
   {                                                            \
      register volatile int _d0 __asm("d0");                             \
      register volatile int _d1 __asm("d1");                             \
      register volatile int _a0 __asm("a0");                             \
      register volatile int _a1 __asm("a1");                             \
      register volatile void *const _##name##_bn __asm("a6") = (bn);     \
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;                \
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;                \
      register volatile t3 _n3 __asm(#r3) = _##name##_v3;                \
      register volatile t4 _n4 __asm(#r4) = _##name##_v4;                \
      register volatile t5 _n5 __asm(#r5) = _##name##_v5;                \
      register volatile t6 _n6 __asm(#r6) = _##name##_v6;                \
      __asm volatile ("exg %%d7,%%a4\n\tjsr %%a6@(-"#offs":W)\n\texg %%d7,%%a4" \
      : "=r" (_d0), "=r" (_d1), "=r" (_a0), "=r" (_a1) \
      : "r" (_##name##_bn), "rf"(_n1), "rf"(_n2), "rf"(_n3), "rf"(_n4), "rf"(_n5), "rf"(_n6) \
      : "fp0", "fp1", "cc", "memory");                          \
   };                                                           \
})

#define LP6FP(offs, rt, name, t1, v1, r1, t2, v2, r2, t3, v3, r3, t4, v4, r4, t5, v5, r5, t6, v6, r6, bt, bn, fpt) \
({								                                \
   typedef fpt;							                        \
   t1 _##name##_v1 = (v1);					                    \
   t2 _##name##_v2 = (v2);					                    \
   t3 _##name##_v3 = (v3);					                    \
   t4 _##name##_v4 = (v4);					                    \
   t5 _##name##_v5 = (v5);					                    \
   t6 _##name##_v6 = (v6);                                      \
   rt _##name##_re2 =						                    \
   ({								                            \
      register volatile int _d1 __asm("d1");				                \
      register volatile int _a0 __asm("a0");				                \
      register volatile int _a1 __asm("a1");				                \
               register rt _##name##_re __asm("d0");			            \
      register volatile void *const _##name##_bn __asm("a6") = (bn);	    \
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;		        \
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;		        \
      register volatile t3 _n3 __asm(#r3) = _##name##_v3;		        \
      register volatile t4 _n4 __asm(#r4) = _##name##_v4;		        \
      register volatile t5 _n5 __asm(#r5) = _##name##_v5;		        \
      register volatile t6 _n6 __asm(#r6) = _##name##_v6;                \
      __asm volatile ("jsr %%a6@(-"#offs":W)"			            \
      : "=r" (_##name##_re), "=r" (_d1), "=r" (_a0), "=r" (_a1)	\
      : "r" (_##name##_bn), "rf"(_n1), "rf"(_n2), "rf"(_n3), "rf"(_n4), "rf"(_n5), "rf"(_n6) \
      : "fp0", "fp1", "cc", "memory");				            \
      _##name##_re;						                        \
   });								                            \
   _##name##_re2;						                        \
})

#define LP6A4FP(offs, rt, name, t1, v1, r1, t2, v2, r2, t3, v3, r3, t4, v4, r4, t5, v5, r5, t6, v6, r6, bt, bn, fpt) \
({                                                              \
   typedef fpt;                                                 \
   t1 _##name##_v1 = (v1);                                      \
   t2 _##name##_v2 = (v2);                                      \
   t3 _##name##_v3 = (v3);                                      \
   t4 _##name##_v4 = (v4);                                      \
   t5 _##name##_v5 = (v5);                                      \
   t6 _##name##_v6 = (v6);                                      \
   rt _##name##_re2 =                                           \
   ({                                                           \
      register volatile int _d1 __asm("d1");                             \
      register volatile int _a0 __asm("a0");                             \
      register volatile int _a1 __asm("a1");                             \
               register rt _##name##_re __asm("d0");                     \
      register volatile void *const _##name##_bn __asm("a6") = (bn);     \
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;                \
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;                \
      register volatile t3 _n3 __asm(#r3) = _##name##_v3;                \
      register volatile t4 _n4 __asm(#r4) = _##name##_v4;                \
      register volatile t5 _n5 __asm(#r5) = _##name##_v5;                \
      register volatile t6 _n6 __asm(#r6) = _##name##_v6;                \
      __asm volatile ("exg %%d7,%%a4\n\tjsr %%a6@(-"#offs":W)\n\texg %%d7,%%a4" \
      : "=r" (_##name##_re), "=r" (_d1), "=r" (_a0), "=r" (_a1) \
      : "r" (_##name##_bn), "rf"(_n1), "rf"(_n2), "rf"(_n3), "rf"(_n4), "rf"(_n5), "rf"(_n6) \
      : "fp0", "fp1", "cc", "memory");                          \
      _##name##_re;                                             \
   });                                                          \
   _##name##_re2;                                               \
})

#define LP7(offs, rt, name, t1, v1, r1, t2, v2, r2, t3, v3, r3, t4, v4, r4, t5, v5, r5, t6, v6, r6, t7, v7, r7, bt, bn) \
({								\
   t1 _##name##_v1 = (v1);					\
   t2 _##name##_v2 = (v2);					\
   t3 _##name##_v3 = (v3);					\
   t4 _##name##_v4 = (v4);					\
   t5 _##name##_v5 = (v5);					\
   t6 _##name##_v6 = (v6);					\
   t7 _##name##_v7 = (v7);					\
   rt _##name##_re2 =						\
   ({								\
      register volatile int _d1 __asm("d1");				\
      register volatile int _a0 __asm("a0");				\
      register volatile int _a1 __asm("a1");				\
               register rt _##name##_re __asm("d0");			\
      register volatile void *const _##name##_bn __asm("a6") = (bn);	\
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;		\
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;		\
      register volatile t3 _n3 __asm(#r3) = _##name##_v3;		\
      register volatile t4 _n4 __asm(#r4) = _##name##_v4;		\
      register volatile t5 _n5 __asm(#r5) = _##name##_v5;		\
      register volatile t6 _n6 __asm(#r6) = _##name##_v6;		\
      register volatile t7 _n7 __asm(#r7) = _##name##_v7;		\
      __asm volatile ("jsr %%a6@(-"#offs":W)"			\
      : "=r" (_##name##_re), "=r" (_d1), "=r" (_a0), "=r" (_a1)	\
      : "r" (_##name##_bn), "rf"(_n1), "rf"(_n2), "rf"(_n3), "rf"(_n4), "rf"(_n5), "rf"(_n6), "rf"(_n7) \
      : "fp0", "fp1", "cc", "memory");				\
      _##name##_re;						\
   });								\
   _##name##_re2;						\
})

#define LP7NR(offs, name, t1, v1, r1, t2, v2, r2, t3, v3, r3, t4, v4, r4, t5, v5, r5, t6, v6, r6, t7, v7, r7, bt, bn) \
({								\
   t1 _##name##_v1 = (v1);					\
   t2 _##name##_v2 = (v2);					\
   t3 _##name##_v3 = (v3);					\
   t4 _##name##_v4 = (v4);					\
   t5 _##name##_v5 = (v5);					\
   t6 _##name##_v6 = (v6);					\
   t7 _##name##_v7 = (v7);					\
   {								\
      register volatile int _d0 __asm("d0");				\
      register volatile int _d1 __asm("d1");				\
      register volatile int _a0 __asm("a0");				\
      register volatile int _a1 __asm("a1");				\
      register volatile void *const _##name##_bn __asm("a6") = (bn);	\
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;		\
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;		\
      register volatile t3 _n3 __asm(#r3) = _##name##_v3;		\
      register volatile t4 _n4 __asm(#r4) = _##name##_v4;		\
      register volatile t5 _n5 __asm(#r5) = _##name##_v5;		\
      register volatile t6 _n6 __asm(#r6) = _##name##_v6;		\
      register volatile t7 _n7 __asm(#r7) = _##name##_v7;		\
      __asm volatile ("jsr %%a6@(-"#offs":W)"			\
      : "=r" (_d0), "=r" (_d1), "=r" (_a0), "=r" (_a1)		\
      : "r" (_##name##_bn), "rf"(_n1), "rf"(_n2), "rf"(_n3), "rf"(_n4), "rf"(_n5), "rf"(_n6), "rf"(_n7) \
      : "fp0", "fp1", "cc", "memory");				\
   }								\
})

#define LP7NRFP6(offs, name, t1, v1, r1, t2, v2, r2, t3, v3, r3, t4, v4, r4, t5, v5, r5, t6, v6, r6, t7, v7, r7, bt, bn, fpt1, fpt2, fpt3, fpt4, fpt5, fpt6) \
({								\
   typedef fpt1;							\
   typedef fpt2;							\
   typedef fpt3;							\
   typedef fpt4;							\
   typedef fpt5;							\
   typedef fpt6;							\
   t1 _##name##_v1 = (v1);					\
   t2 _##name##_v2 = (v2);					\
   t3 _##name##_v3 = (v3);					\
   t4 _##name##_v4 = (v4);					\
   t5 _##name##_v5 = (v5);					\
   t6 _##name##_v6 = (v6);					\
   t7 _##name##_v7 = (v7);					\
   {								\
      register volatile int _d0 __asm("d0");				\
      register volatile int _d1 __asm("d1");				\
      register volatile int _a0 __asm("a0");				\
      register volatile int _a1 __asm("a1");				\
      register volatile void *const _##name##_bn __asm("a6") = (bn);	\
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;		\
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;		\
      register volatile t3 _n3 __asm(#r3) = _##name##_v3;		\
      register volatile t4 _n4 __asm(#r4) = _##name##_v4;		\
      register volatile t5 _n5 __asm(#r5) = _##name##_v5;		\
      register volatile t6 _n6 __asm(#r6) = _##name##_v6;		\
      register volatile t7 _n7 __asm(#r7) = _##name##_v7;		\
      __asm volatile ("jsr %%a6@(-"#offs":W)"			\
      : "=r" (_d0), "=r" (_d1), "=r" (_a0), "=r" (_a1)		\
      : "r" (_##name##_bn), "rf"(_n1), "rf"(_n2), "rf"(_n3), "rf"(_n4), "rf"(_n5), "rf"(_n6), "rf"(_n7) \
      : "fp0", "fp1", "cc", "memory");				\
   }								\
})

/* Only workbench.library/AddAppIconA() */
#define LP7A4(offs, rt, name, t1, v1, r1, t2, v2, r2, t3, v3, r3, t4, v4, r4, t5, v5, r5, t6, v6, r6, t7, v7, r7, bt, bn) \
({								\
   t1 _##name##_v1 = (v1);					\
   t2 _##name##_v2 = (v2);					\
   t3 _##name##_v3 = (v3);					\
   t4 _##name##_v4 = (v4);					\
   t5 _##name##_v5 = (v5);					\
   t6 _##name##_v6 = (v6);					\
   t7 _##name##_v7 = (v7);					\
   rt _##name##_re2 =						\
   ({								\
      register volatile int _d1 __asm("d1");				\
      register volatile int _a0 __asm("a0");				\
      register volatile int _a1 __asm("a1");				\
               register rt _##name##_re __asm("d0");			\
      register volatile void *const _##name##_bn __asm("a6") = (bn);	\
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;		\
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;		\
      register volatile t3 _n3 __asm(#r3) = _##name##_v3;		\
      register volatile t4 _n4 __asm(#r4) = _##name##_v4;		\
      register volatile t5 _n5 __asm(#r5) = _##name##_v5;		\
      register volatile t6 _n6 __asm(#r6) = _##name##_v6;		\
      register volatile t7 _n7 __asm(#r7) = _##name##_v7;		\
      __asm volatile ("exg %%d7,%%a4\n\tjsr %%a6@(-"#offs":W)\n\texg %%d7,%%a4" \
      : "=r" (_##name##_re), "=r" (_d1), "=r" (_a0), "=r" (_a1)	\
      : "r" (_##name##_bn), "rf"(_n1), "rf"(_n2), "rf"(_n3), "rf"(_n4), "rf"(_n5), "rf"(_n6), "rf"(_n7) \
      : "fp0", "fp1", "cc", "memory");				\
      _##name##_re;						\
   });								\
   _##name##_re2;						\
})

#define LP7A4FP(offs, rt, name, t1, v1, r1, t2, v2, r2, t3, v3, r3, t4, v4, r4, t5, v5, r5, t6, v6, r6, t7, v7, r7, bt, bn, fpt) \
({                                                              \
   typedef fpt;                                                 \
   t1 _##name##_v1 = (v1);                                      \
   t2 _##name##_v2 = (v2);                                      \
   t3 _##name##_v3 = (v3);                                      \
   t4 _##name##_v4 = (v4);                                      \
   t5 _##name##_v5 = (v5);                                      \
   t6 _##name##_v6 = (v6);                                      \
   t7 _##name##_v7 = (v7);                                      \
   rt _##name##_re2 =                                           \
   ({                                                           \
      register volatile int _d1 __asm("d1");                             \
      register volatile int _a0 __asm("a0");                             \
      register volatile int _a1 __asm("a1");                             \
               register rt _##name##_re __asm("d0");                     \
      register volatile void *const _##name##_bn __asm("a6") = (bn);     \
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;                \
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;                \
      register volatile t3 _n3 __asm(#r3) = _##name##_v3;                \
      register volatile t4 _n4 __asm(#r4) = _##name##_v4;                \
      register volatile t5 _n5 __asm(#r5) = _##name##_v5;                \
      register volatile t6 _n6 __asm(#r6) = _##name##_v6;                \
      register volatile t7 _n7 __asm(#r7) = _##name##_v7;                \
      __asm volatile ("exg %%d7,%%a4\n\tjsr %%a6@(-"#offs":W)\n\texg %%d7,%%a4" \
      : "=r" (_##name##_re), "=r" (_d1), "=r" (_a0), "=r" (_a1) \
      : "r" (_##name##_bn), "rf"(_n1), "rf"(_n2), "rf"(_n3), "rf"(_n4), "rf"(_n5), "rf"(_n6), "rf"(_n7) \
      : "fp0", "fp1", "cc", "memory");                          \
      _##name##_re;                                             \
   });                                                          \
   _##name##_re2;                                               \
})

#define LP7NRA4(offs, name, t1, v1, r1, t2, v2, r2, t3, v3, r3, t4, v4, r4, t5, v5, r5, t6, v6, r6, t7, v7, r7, bt, bn) \
({                                                              \
   t1 _##name##_v1 = (v1);                                      \
   t2 _##name##_v2 = (v2);                                      \
   t3 _##name##_v3 = (v3);                                      \
   t4 _##name##_v4 = (v4);                                      \
   t5 _##name##_v5 = (v5);                                      \
   t6 _##name##_v6 = (v6);                                      \
   t7 _##name##_v7 = (v7);                                      \
   {                                                            \
      register volatile int _d0 __asm("d0");                             \
      register volatile int _d1 __asm("d1");                             \
      register volatile int _a0 __asm("a0");                             \
      register volatile int _a1 __asm("a1");                             \
      register volatile void *const _##name##_bn __asm("a6") = (bn);     \
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;                \
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;                \
      register volatile t3 _n3 __asm(#r3) = _##name##_v3;                \
      register volatile t4 _n4 __asm(#r4) = _##name##_v4;                \
      register volatile t5 _n5 __asm(#r5) = _##name##_v5;                \
      register volatile t6 _n6 __asm(#r6) = _##name##_v6;                \
      register volatile t7 _n7 __asm(#r7) = _##name##_v7;                \
      __asm volatile ("exg %%d7,%%a4\n\tjsr %%a6@(-"#offs":W)\n\texg %%d7,%%a4" \
      : "=r" (_d0), "=r" (_d1), "=r" (_a0), "=r" (_a1) \
      : "r" (_##name##_bn), "rf"(_n1), "rf"(_n2), "rf"(_n3), "rf"(_n4), "rf"(_n5), "rf"(_n6), "rf"(_n7) \
      : "fp0", "fp1", "cc", "memory");                          \
   };                                                           \
})

/* Would you believe that there really are beasts that need more than 7
   arguments? :-) */

/* For example intuition.library/AutoRequest() */
#define LP8(offs, rt, name, t1, v1, r1, t2, v2, r2, t3, v3, r3, t4, v4, r4, t5, v5, r5, t6, v6, r6, t7, v7, r7, t8, v8, r8, bt, bn) \
({								\
   t1 _##name##_v1 = (v1);					\
   t2 _##name##_v2 = (v2);					\
   t3 _##name##_v3 = (v3);					\
   t4 _##name##_v4 = (v4);					\
   t5 _##name##_v5 = (v5);					\
   t6 _##name##_v6 = (v6);					\
   t7 _##name##_v7 = (v7);					\
   t8 _##name##_v8 = (v8);					\
   rt _##name##_re2 =						\
   ({								\
      register volatile int _d1 __asm("d1");				\
      register volatile int _a0 __asm("a0");				\
      register volatile int _a1 __asm("a1");				\
               register rt _##name##_re __asm("d0");			\
      register volatile void *const _##name##_bn __asm("a6") = (bn);	\
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;		\
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;		\
      register volatile t3 _n3 __asm(#r3) = _##name##_v3;		\
      register volatile t4 _n4 __asm(#r4) = _##name##_v4;		\
      register volatile t5 _n5 __asm(#r5) = _##name##_v5;		\
      register volatile t6 _n6 __asm(#r6) = _##name##_v6;		\
      register volatile t7 _n7 __asm(#r7) = _##name##_v7;		\
      register volatile t8 _n8 __asm(#r8) = _##name##_v8;		\
      __asm volatile ("jsr %%a6@(-"#offs":W)"			\
      : "=r" (_##name##_re), "=r" (_d1), "=r" (_a0), "=r" (_a1)	\
      : "r" (_##name##_bn), "rf"(_n1), "rf"(_n2), "rf"(_n3), "rf"(_n4), "rf"(_n5), "rf"(_n6), "rf"(_n7), "rf"(_n8) \
      : "fp0", "fp1", "cc", "memory");				\
      _##name##_re;						\
   });								\
   _##name##_re2;						\
})

/* For example intuition.library/ModifyProp() */
#define LP8NR(offs, name, t1, v1, r1, t2, v2, r2, t3, v3, r3, t4, v4, r4, t5, v5, r5, t6, v6, r6, t7, v7, r7, t8, v8, r8, bt, bn) \
({								\
   t1 _##name##_v1 = (v1);					\
   t2 _##name##_v2 = (v2);					\
   t3 _##name##_v3 = (v3);					\
   t4 _##name##_v4 = (v4);					\
   t5 _##name##_v5 = (v5);					\
   t6 _##name##_v6 = (v6);					\
   t7 _##name##_v7 = (v7);					\
   t8 _##name##_v8 = (v8);					\
   {								\
      register volatile int _d0 __asm("d0");				\
      register volatile int _d1 __asm("d1");				\
      register volatile int _a0 __asm("a0");				\
      register volatile int _a1 __asm("a1");				\
      register volatile void *const _##name##_bn __asm("a6") = (bn);	\
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;		\
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;		\
      register volatile t3 _n3 __asm(#r3) = _##name##_v3;		\
      register volatile t4 _n4 __asm(#r4) = _##name##_v4;		\
      register volatile t5 _n5 __asm(#r5) = _##name##_v5;		\
      register volatile t6 _n6 __asm(#r6) = _##name##_v6;		\
      register volatile t7 _n7 __asm(#r7) = _##name##_v7;		\
      register volatile t8 _n8 __asm(#r8) = _##name##_v8;		\
      __asm volatile ("jsr %%a6@(-"#offs":W)"			\
      : "=r" (_d0), "=r" (_d1), "=r" (_a0), "=r" (_a1)		\
      : "r" (_##name##_bn), "rf"(_n1), "rf"(_n2), "rf"(_n3), "rf"(_n4), "rf"(_n5), "rf"(_n6), "rf"(_n7), "rf"(_n8) \
      : "fp0", "fp1", "cc", "memory");				\
   }								\
})

#define LP8A4(offs, rt, name, t1, v1, r1, t2, v2, r2, t3, v3, r3, t4, v4, r4, t5, v5, r5, t6, v6, r6, t7, v7, r7, t8, v8, r8, bt, bn) \
({                                                              \
   t1 _##name##_v1 = (v1);                                      \
   t2 _##name##_v2 = (v2);                                      \
   t3 _##name##_v3 = (v3);                                      \
   t4 _##name##_v4 = (v4);                                      \
   t5 _##name##_v5 = (v5);                                      \
   t6 _##name##_v6 = (v6);                                      \
   t7 _##name##_v7 = (v7);                                      \
   t8 _##name##_v8 = (v8);                                      \
   rt _##name##_re2 =                                           \
   ({                                                           \
      register volatile int _d1 __asm("d1");                             \
      register volatile int _a0 __asm("a0");                             \
      register volatile int _a1 __asm("a1");                             \
               register rt _##name##_re __asm("d0");                     \
      register volatile void *const _##name##_bn __asm("a6") = (bn);     \
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;                \
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;                \
      register volatile t3 _n3 __asm(#r3) = _##name##_v3;                \
      register volatile t4 _n4 __asm(#r4) = _##name##_v4;                \
      register volatile t5 _n5 __asm(#r5) = _##name##_v5;                \
      register volatile t6 _n6 __asm(#r6) = _##name##_v6;                \
      register volatile t7 _n7 __asm(#r7) = _##name##_v7;                \
      register volatile t8 _n8 __asm(#r8) = _##name##_v8;                \
      __asm volatile ("exg %%d7,%%a4\n\tjsr %%a6@(-"#offs":W)\n\texg %%d7,%%a4" \
      : "=r" (_##name##_re), "=r" (_d1), "=r" (_a0), "=r" (_a1) \
      : "r" (_##name##_bn), "rf"(_n1), "rf"(_n2), "rf"(_n3), "rf"(_n4), "rf"(_n5), "rf"(_n6), "rf"(_n7), "rf"(_n8) \
      : "fp0", "fp1", "cc", "memory");                          \
      _##name##_re;                                             \
   });                                                          \
   _##name##_re2;                                               \
})

#define LP8NRA4(offs, name, t1, v1, r1, t2, v2, r2, t3, v3, r3, t4, v4, r4, t5, v5, r5, t6, v6, r6, t7, v7, r7, t8, v8, r8, bt, bn) \
({                                                              \
   t1 _##name##_v1 = (v1);                                      \
   t2 _##name##_v2 = (v2);                                      \
   t3 _##name##_v3 = (v3);                                      \
   t4 _##name##_v4 = (v4);                                      \
   t5 _##name##_v5 = (v5);                                      \
   t6 _##name##_v6 = (v6);                                      \
   t7 _##name##_v7 = (v7);                                      \
   t8 _##name##_v8 = (v8);                                      \
   {                                                            \
      register volatile int _d0 __asm("d0");                             \
      register volatile int _d1 __asm("d1");                             \
      register volatile int _a0 __asm("a0");                             \
      register volatile int _a1 __asm("a1");                             \
      register volatile void *const _##name##_bn __asm("a6") = (bn);     \
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;                \
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;                \
      register volatile t3 _n3 __asm(#r3) = _##name##_v3;                \
      register volatile t4 _n4 __asm(#r4) = _##name##_v4;                \
      register volatile t5 _n5 __asm(#r5) = _##name##_v5;                \
      register volatile t6 _n6 __asm(#r6) = _##name##_v6;                \
      register volatile t7 _n7 __asm(#r7) = _##name##_v7;                \
      register volatile t8 _n8 __asm(#r8) = _##name##_v8;                \
      __asm volatile ("exg %%d7,%%a4\n\tjsr %%a6@(-"#offs":W)\n\texg %%d7,%%a4" \
      : "=r" (_d0), "=r" (_d1), "=r" (_a0), "=r" (_a1) \
      : "r" (_##name##_bn), "rf"(_n1), "rf"(_n2), "rf"(_n3), "rf"(_n4), "rf"(_n5), "rf"(_n6), "rf"(_n7), "rf"(_n8) \
      : "fp0", "fp1", "cc", "memory");                          \
   };                                                           \
})

/* For example layers.library/CreateUpfrontHookLayer() */
#define LP9(offs, rt, name, t1, v1, r1, t2, v2, r2, t3, v3, r3, t4, v4, r4, t5, v5, r5, t6, v6, r6, t7, v7, r7, t8, v8, r8, t9, v9, r9, bt, bn) \
({								\
   t1 _##name##_v1 = (v1);					\
   t2 _##name##_v2 = (v2);					\
   t3 _##name##_v3 = (v3);					\
   t4 _##name##_v4 = (v4);					\
   t5 _##name##_v5 = (v5);					\
   t6 _##name##_v6 = (v6);					\
   t7 _##name##_v7 = (v7);					\
   t8 _##name##_v8 = (v8);					\
   t9 _##name##_v9 = (v9);					\
   rt _##name##_re2 =						\
   ({								\
      register volatile int _d1 __asm("d1");				\
      register volatile int _a0 __asm("a0");				\
      register volatile int _a1 __asm("a1");				\
               register rt _##name##_re __asm("d0");			\
      register volatile void *const _##name##_bn __asm("a6") = (bn);	\
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;		\
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;		\
      register volatile t3 _n3 __asm(#r3) = _##name##_v3;		\
      register volatile t4 _n4 __asm(#r4) = _##name##_v4;		\
      register volatile t5 _n5 __asm(#r5) = _##name##_v5;		\
      register volatile t6 _n6 __asm(#r6) = _##name##_v6;		\
      register volatile t7 _n7 __asm(#r7) = _##name##_v7;		\
      register volatile t8 _n8 __asm(#r8) = _##name##_v8;		\
      register volatile t9 _n9 __asm(#r9) = _##name##_v9;		\
      __asm volatile ("jsr %%a6@(-"#offs":W)"			\
      : "=r" (_##name##_re), "=r" (_d1), "=r" (_a0), "=r" (_a1)	\
      : "r" (_##name##_bn), "rf"(_n1), "rf"(_n2), "rf"(_n3), "rf"(_n4), "rf"(_n5), "rf"(_n6), "rf"(_n7), "rf"(_n8), "rf"(_n9) \
      : "fp0", "fp1", "cc", "memory");				\
      _##name##_re;						\
   });								\
   _##name##_re2;						\
})

/* For example intuition.library/NewModifyProp() */
#define LP9NR(offs, name, t1, v1, r1, t2, v2, r2, t3, v3, r3, t4, v4, r4, t5, v5, r5, t6, v6, r6, t7, v7, r7, t8, v8, r8, t9, v9, r9, bt, bn) \
({								\
   t1 _##name##_v1 = (v1);					\
   t2 _##name##_v2 = (v2);					\
   t3 _##name##_v3 = (v3);					\
   t4 _##name##_v4 = (v4);					\
   t5 _##name##_v5 = (v5);					\
   t6 _##name##_v6 = (v6);					\
   t7 _##name##_v7 = (v7);					\
   t8 _##name##_v8 = (v8);					\
   t9 _##name##_v9 = (v9);					\
   {								\
      register volatile int _d0 __asm("d0");				\
      register volatile int _d1 __asm("d1");				\
      register volatile int _a0 __asm("a0");				\
      register volatile int _a1 __asm("a1");				\
      register volatile void *const _##name##_bn __asm("a6") = (bn);	\
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;		\
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;		\
      register volatile t3 _n3 __asm(#r3) = _##name##_v3;		\
      register volatile t4 _n4 __asm(#r4) = _##name##_v4;		\
      register volatile t5 _n5 __asm(#r5) = _##name##_v5;		\
      register volatile t6 _n6 __asm(#r6) = _##name##_v6;		\
      register volatile t7 _n7 __asm(#r7) = _##name##_v7;		\
      register volatile t8 _n8 __asm(#r8) = _##name##_v8;		\
      register volatile t9 _n9 __asm(#r9) = _##name##_v9;		\
      __asm volatile ("jsr %%a6@(-"#offs":W)"			\
      : "=r" (_d0), "=r" (_d1), "=r" (_a0), "=r" (_a1)		\
      : "r" (_##name##_bn), "rf"(_n1), "rf"(_n2), "rf"(_n3), "rf"(_n4), "rf"(_n5), "rf"(_n6), "rf"(_n7), "rf"(_n8), "rf"(_n9) \
      : "fp0", "fp1", "cc", "memory");				\
   }								\
})

#define LP9A4(offs, rt, name, t1, v1, r1, t2, v2, r2, t3, v3, r3, t4, v4, r4, t5, v5, r5, t6, v6, r6, t7, v7, r7, t8, v8, r8, t9, v9, r9, bt, bn) \
({                                                              \
   t1 _##name##_v1 = (v1);                                      \
   t2 _##name##_v2 = (v2);                                      \
   t3 _##name##_v3 = (v3);                                      \
   t4 _##name##_v4 = (v4);                                      \
   t5 _##name##_v5 = (v5);                                      \
   t6 _##name##_v6 = (v6);                                      \
   t7 _##name##_v7 = (v7);                                      \
   t8 _##name##_v8 = (v8);                                      \
   t9 _##name##_v9 = (v9);                                      \
   rt _##name##_re2 =                                           \
   ({                                                           \
      register volatile int _d1 __asm("d1");                             \
      register volatile int _a0 __asm("a0");                             \
      register volatile int _a1 __asm("a1");                             \
               register rt _##name##_re __asm("d0");                     \
      register volatile void *const _##name##_bn __asm("a6") = (bn);     \
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;                \
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;                \
      register volatile t3 _n3 __asm(#r3) = _##name##_v3;                \
      register volatile t4 _n4 __asm(#r4) = _##name##_v4;                \
      register volatile t5 _n5 __asm(#r5) = _##name##_v5;                \
      register volatile t6 _n6 __asm(#r6) = _##name##_v6;                \
      register volatile t7 _n7 __asm(#r7) = _##name##_v7;                \
      register volatile t8 _n8 __asm(#r8) = _##name##_v8;                \
      register volatile t9 _n9 __asm(#r9) = _##name##_v9;                \
      __asm volatile ("exg %%d7,%%a4\n\tjsr %%a6@(-"#offs":W)\n\texg %%d7,%%a4" \
      : "=r" (_##name##_re), "=r" (_d1), "=r" (_a0), "=r" (_a1) \
      : "r" (_##name##_bn), "rf"(_n1), "rf"(_n2), "rf"(_n3), "rf"(_n4), "rf"(_n5), "rf"(_n6), "rf"(_n7), "rf"(_n8), "rf"(_n9) \
      : "fp0", "fp1", "cc", "memory");                          \
      _##name##_re;                                             \
   });                                                          \
   _##name##_re2;                                               \
})

#define LP9NRA4(offs, name, t1, v1, r1, t2, v2, r2, t3, v3, r3, t4, v4, r4, t5, v5, r5, t6, v6, r6, t7, v7, r7, t8, v8, r8, t9, v9, r9, bt, bn) \
({                                                              \
   t1 _##name##_v1 = (v1);                                      \
   t2 _##name##_v2 = (v2);                                      \
   t3 _##name##_v3 = (v3);                                      \
   t4 _##name##_v4 = (v4);                                      \
   t5 _##name##_v5 = (v5);                                      \
   t6 _##name##_v6 = (v6);                                      \
   t7 _##name##_v7 = (v7);                                      \
   t8 _##name##_v8 = (v8);                                      \
   t9 _##name##_v9 = (v9);                                      \
   {                                                            \
      register volatile int _d0 __asm("d0");                             \
      register volatile int _d1 __asm("d1");                             \
      register volatile int _a0 __asm("a0");                             \
      register volatile int _a1 __asm("a1");                             \
      register volatile void *const _##name##_bn __asm("a6") = (bn);     \
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;                \
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;                \
      register volatile t3 _n3 __asm(#r3) = _##name##_v3;                \
      register volatile t4 _n4 __asm(#r4) = _##name##_v4;                \
      register volatile t5 _n5 __asm(#r5) = _##name##_v5;                \
      register volatile t6 _n6 __asm(#r6) = _##name##_v6;                \
      register volatile t7 _n7 __asm(#r7) = _##name##_v7;                \
      register volatile t8 _n8 __asm(#r8) = _##name##_v8;                \
      register volatile t9 _n9 __asm(#r9) = _##name##_v9;                \
      __asm volatile ("exg %%d7,%%a4\n\tjsr %%a6@(-"#offs":W)\n\texg %%d7,%%a4" \
      : "=r" (_d0), "=r" (_d1), "=r" (_a0), "=r" (_a1) \
      : "r" (_##name##_bn), "rf"(_n1), "rf"(_n2), "rf"(_n3), "rf"(_n4), "rf"(_n5), "rf"(_n6), "rf"(_n7), "rf"(_n8), "rf"(_n9) \
      : "fp0", "fp1", "cc", "memory");                          \
   };                                                           \
})

/* Kriton Kyrimis <kyrimis@cti.gr> says CyberGraphics needs the following */
#define LP10(offs, rt, name, t1, v1, r1, t2, v2, r2, t3, v3, r3, t4, v4, r4, t5, v5, r5, t6, v6, r6, t7, v7, r7, t8, v8, r8, t9, v9, r9, t10, v10, r10, bt, bn) \
({								\
   t1 _##name##_v1 = (v1);					\
   t2 _##name##_v2 = (v2);					\
   t3 _##name##_v3 = (v3);					\
   t4 _##name##_v4 = (v4);					\
   t5 _##name##_v5 = (v5);					\
   t6 _##name##_v6 = (v6);					\
   t7 _##name##_v7 = (v7);					\
   t8 _##name##_v8 = (v8);					\
   t9 _##name##_v9 = (v9);					\
   t10 _##name##_v10 = (v10);					\
   rt _##name##_re2 =						\
   ({								\
      register volatile int _d1 __asm("d1");				\
      register volatile int _a0 __asm("a0");				\
      register volatile int _a1 __asm("a1");				\
               register rt _##name##_re __asm("d0");			\
      register volatile void *const _##name##_bn __asm("a6") = (bn);	\
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;		\
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;		\
      register volatile t3 _n3 __asm(#r3) = _##name##_v3;		\
      register volatile t4 _n4 __asm(#r4) = _##name##_v4;		\
      register volatile t5 _n5 __asm(#r5) = _##name##_v5;		\
      register volatile t6 _n6 __asm(#r6) = _##name##_v6;		\
      register volatile t7 _n7 __asm(#r7) = _##name##_v7;		\
      register volatile t8 _n8 __asm(#r8) = _##name##_v8;		\
      register volatile t9 _n9 __asm(#r9) = _##name##_v9;		\
      register volatile t10 _n10 __asm(#r10) = _##name##_v10;		\
      __asm volatile ("jsr %%a6@(-"#offs":W)"			\
      : "=r" (_##name##_re), "=r" (_d1), "=r" (_a0), "=r" (_a1)	\
      : "r" (_##name##_bn), "rf"(_n1), "rf"(_n2), "rf"(_n3), "rf"(_n4), "rf"(_n5), "rf"(_n6), "rf"(_n7), "rf"(_n8), "rf"(_n9), "rf"(_n10) \
      : "fp0", "fp1", "cc", "memory");				\
      _##name##_re;						\
   });								\
   _##name##_re2;						\
})

/* Only graphics.library/BltMaskBitMapRastPort() */
#define LP10NR(offs, name, t1, v1, r1, t2, v2, r2, t3, v3, r3, t4, v4, r4, t5, v5, r5, t6, v6, r6, t7, v7, r7, t8, v8, r8, t9, v9, r9, t10, v10, r10, bt, bn) \
({								\
   t1 _##name##_v1 = (v1);					\
   t2 _##name##_v2 = (v2);					\
   t3 _##name##_v3 = (v3);					\
   t4 _##name##_v4 = (v4);					\
   t5 _##name##_v5 = (v5);					\
   t6 _##name##_v6 = (v6);					\
   t7 _##name##_v7 = (v7);					\
   t8 _##name##_v8 = (v8);					\
   t9 _##name##_v9 = (v9);					\
   t10 _##name##_v10 = (v10);					\
   {								\
      register volatile int _d0 __asm("d0");				\
      register volatile int _d1 __asm("d1");				\
      register volatile int _a0 __asm("a0");				\
      register volatile int _a1 __asm("a1");				\
      register volatile void *const _##name##_bn __asm("a6") = (bn);	\
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;		\
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;		\
      register volatile t3 _n3 __asm(#r3) = _##name##_v3;		\
      register volatile t4 _n4 __asm(#r4) = _##name##_v4;		\
      register volatile t5 _n5 __asm(#r5) = _##name##_v5;		\
      register volatile t6 _n6 __asm(#r6) = _##name##_v6;		\
      register volatile t7 _n7 __asm(#r7) = _##name##_v7;		\
      register volatile t8 _n8 __asm(#r8) = _##name##_v8;		\
      register volatile t9 _n9 __asm(#r9) = _##name##_v9;		\
      register volatile t10 _n10 __asm(#r10) = _##name##_v10;		\
      __asm volatile ("jsr %%a6@(-"#offs":W)"			\
      : "=r" (_d0), "=r" (_d1), "=r" (_a0), "=r" (_a1)		\
      : "r" (_##name##_bn), "rf"(_n1), "rf"(_n2), "rf"(_n3), "rf"(_n4), "rf"(_n5), "rf"(_n6), "rf"(_n7), "rf"(_n8), "rf"(_n9), "rf"(_n10) \
      : "fp0", "fp1", "cc", "memory");				\
   }								\
})

#define LP10A4(offs, rt, name, t1, v1, r1, t2, v2, r2, t3, v3, r3, t4, v4, r4, t5, v5, r5, t6, v6, r6, t7, v7, r7, t8, v8, r8, t9, v9, r9, t10, v10, r10, bt, bn) \
({								\
   t1 _##name##_v1 = (v1);					\
   t2 _##name##_v2 = (v2);					\
   t3 _##name##_v3 = (v3);					\
   t4 _##name##_v4 = (v4);					\
   t5 _##name##_v5 = (v5);					\
   t6 _##name##_v6 = (v6);					\
   t7 _##name##_v7 = (v7);					\
   t8 _##name##_v8 = (v8);					\
   t9 _##name##_v9 = (v9);					\
   t10 _##name##_v10 = (v10);					\
   rt _##name##_re2 =						\
   ({								\
      register volatile int _d1 __asm("d1");				\
      register volatile int _a0 __asm("a0");				\
      register volatile int _a1 __asm("a1");				\
               register rt _##name##_re __asm("d0");			\
      register volatile void *const _##name##_bn __asm("a6") = (bn);	\
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;		\
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;		\
      register volatile t3 _n3 __asm(#r3) = _##name##_v3;		\
      register volatile t4 _n4 __asm(#r4) = _##name##_v4;		\
      register volatile t5 _n5 __asm(#r5) = _##name##_v5;		\
      register volatile t6 _n6 __asm(#r6) = _##name##_v6;		\
      register volatile t7 _n7 __asm(#r7) = _##name##_v7;		\
      register volatile t8 _n8 __asm(#r8) = _##name##_v8;		\
      register volatile t9 _n9 __asm(#r9) = _##name##_v9;		\
      register volatile t10 _n10 __asm(#r10) = _##name##_v10;		\
      __asm volatile ("exg %%d7,%%a4\n\tjsr %%a6@(-"#offs":W)\n\texg %%d7,%%a4" \
      : "=r" (_##name##_re), "=r" (_d1), "=r" (_a0), "=r" (_a1)	\
      : "r" (_##name##_bn), "rf"(_n1), "rf"(_n2), "rf"(_n3), "rf"(_n4), "rf"(_n5), "rf"(_n6), "rf"(_n7), "rf"(_n8), "rf"(_n9), "rf"(_n10) \
      : "fp0", "fp1", "cc", "memory");				\
      _##name##_re;						\
   });								\
   _##name##_re2;						\
})

/* Only graphics.library/BltBitMap() */
#define LP11(offs, rt, name, t1, v1, r1, t2, v2, r2, t3, v3, r3, t4, v4, r4, t5, v5, r5, t6, v6, r6, t7, v7, r7, t8, v8, r8, t9, v9, r9, t10, v10, r10, t11, v11, r11, bt, bn) \
({								\
   t1 _##name##_v1 = (v1);					\
   t2 _##name##_v2 = (v2);					\
   t3 _##name##_v3 = (v3);					\
   t4 _##name##_v4 = (v4);					\
   t5 _##name##_v5 = (v5);					\
   t6 _##name##_v6 = (v6);					\
   t7 _##name##_v7 = (v7);					\
   t8 _##name##_v8 = (v8);					\
   t9 _##name##_v9 = (v9);					\
   t10 _##name##_v10 = (v10);					\
   t11 _##name##_v11 = (v11);					\
   rt _##name##_re2 =						\
   ({								\
      register volatile int _d1 __asm("d1");				\
      register volatile int _a0 __asm("a0");				\
      register volatile int _a1 __asm("a1");				\
               register rt _##name##_re __asm("d0");			\
      register volatile void *const _##name##_bn __asm("a6") = (bn);	\
      register volatile t1 _n1 __asm(#r1) = _##name##_v1;		\
      register volatile t2 _n2 __asm(#r2) = _##name##_v2;		\
      register volatile t3 _n3 __asm(#r3) = _##name##_v3;		\
      register volatile t4 _n4 __asm(#r4) = _##name##_v4;		\
      register volatile t5 _n5 __asm(#r5) = _##name##_v5;		\
      register volatile t6 _n6 __asm(#r6) = _##name##_v6;		\
      register volatile t7 _n7 __asm(#r7) = _##name##_v7;		\
      register volatile t8 _n8 __asm(#r8) = _##name##_v8;		\
      register volatile t9 _n9 __asm(#r9) = _##name##_v9;		\
      register volatile t10 _n10 __asm(#r10) = _##name##_v10;		\
      register volatile t11 _n11 __asm(#r11) = _##name##_v11;		\
      __asm volatile ("jsr %%a6@(-"#offs":W)"			\
      : "=r" (_##name##_re), "=r" (_d1), "=r" (_a0), "=r" (_a1)	\
      : "r" (_##name##_bn), "rf"(_n1), "rf"(_n2), "rf"(_n3), "rf"(_n4), "rf"(_n5), "rf"(_n6), "rf"(_n7), "rf"(_n8), "rf"(_n9), "rf"(_n10), "rf"(_n11) \
      : "fp0", "fp1", "cc", "memory");				\
      _##name##_re;						\
   });								\
   _##name##_re2;						\
})

#endif /* __INLINE_MACROS_H */
