/* Automatically generated header (sfdc 1.12)! Do not edit! */

#ifndef CLIB_TRACKFILE_PROTOS_H
#define CLIB_TRACKFILE_PROTOS_H

/*
**   $VER: trackfile_protos.h $VER: trackfile_lib.sfd 2.3 (10.8.2020) $VER: trackfile_lib.sfd 2.3 (10.8.2020)
**
**   C prototypes. For use with 32 bit integers only.
**
**   Copyright (c) 2001 Amiga, Inc.
**       All Rights Reserved
*/

#include <devices/trackfile.h>

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */

LONG TFStartUnitTagList(LONG which_unit, CONST struct TagItem *tags);
LONG TFStartUnitTags(LONG which_unit, Tag _tag1, ...);
LONG TFStopUnitTagList(LONG which_unit, CONST struct TagItem *tags);
LONG TFStopUnitTags(LONG which_unit, Tag _tag1, ...);
LONG TFInsertMediaTagList(LONG which_unit, CONST struct TagItem *tags);
LONG TFInsertMediaTags(LONG which_unit, Tag _tag1, ...);
LONG TFEjectMediaTagList(LONG which_unit, CONST struct TagItem *tags);
LONG TFEjectMediaTags(LONG which_unit, Tag _tag1, ...);
struct TrackFileUnitData * TFGetUnitData(LONG which_unit);
VOID TFFreeUnitData(struct TrackFileUnitData *tfud);

/*--- functions in V2 or higher ---*/

LONG TFChangeUnitTagList(LONG which_unit, CONST struct TagItem *tags);
LONG TFChangeUnitTags(LONG which_unit, Tag _tag1, ...);
LONG TFExamineFileSize(LONG file_size);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* CLIB_TRACKFILE_PROTOS_H */
