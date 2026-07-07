/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef PROTO_LISTVIEW_H
#define PROTO_LISTVIEW_H

#include <clib/listview_protos.h>

#ifndef _NO_INLINE
# if defined(__GNUC__)
#  ifdef __AROS__
#   include <defines/listview.h>
#  else
#   include <inline/listview.h>
#  endif
# else
#  include <pragmas/listview_pragmas.h>
# endif
#endif /* _NO_INLINE */

#ifdef __amigaos4__
# include <interfaces/listview.h>
# ifndef __NOGLOBALIFACE__
   extern struct ListViewIFace *IListView;
# endif /* __NOGLOBALIFACE__*/
#endif /* !__amigaos4__ */
#ifndef __NOLIBBASE__
  extern struct Library *
# ifdef __CONSTLIBBASEDECL__
   __CONSTLIBBASEDECL__
# endif /* __CONSTLIBBASEDECL__ */
  ListViewBase;
#endif /* !__NOLIBBASE__ */

#endif /* !PROTO_LISTVIEW_H */
