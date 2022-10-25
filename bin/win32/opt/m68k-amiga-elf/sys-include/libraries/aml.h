#ifndef LIBRARIES_AML_H
#define LIBRARIES_AML_H
/*
**	$VER: aml.h 44.1 (19.10.1999)
**	Includes Release 45.1
**
**	AML library structures and constants
**
**	(C) Copyright 2001 Amiga, Inc.
**	    All Rights Reserved
*/

/*****************************************************************************/


#ifndef	EXEC_TYPES_H
#include <exec/types.h>
#endif

#ifndef	EXEC_NODES_H
#include <exec/nodes.h>
#endif

#ifndef UTILITY_TAGITEM_H
#include <utility/tagitem.h>
#endif

/*****************************************************************************/

#define	AmlName "aml.library"
#define AML_TB	(TAG_USER+0x80000)

/*****************************************************************************/

/* Server Attribute Tags
 */
#define SERVERA_Dummy 		(TAG_USER+0x100)
#define SERVERA_HostName	(SERVERA_Dummy+0)
#define SERVERA_HostPort	(SERVERA_Dummy+1)
#define SERVERA_Directory	(SERVERA_Dummy+2)
#define SERVERA_UserName	(SERVERA_Dummy+3)
#define SERVERA_PassWord	(SERVERA_Dummy+4)
#define SERVERA_Type		(SERVERA_Dummy+5)
#define SERVERA_Flags		(SERVERA_Dummy+6)
#define SERVERA_Socket		(SERVERA_Dummy+7)
#define SERVERA_UserData	(SERVERA_Dummy+8)
#define SERVERA_ProgressHook	(SERVERA_Dummy+9)
#define SERVERA_SpoolFile	(SERVERA_Dummy+10)
#define SERVERA_NewsGroup	(SERVERA_Dummy+11)
#define SERVERA_LogFile		(SERVERA_Dummy+12)
#define SERVERA_MaxSize		(SERVERA_Dummy+13)
#define SERVERA_MaxLines	(SERVERA_Dummy+14)
#define SERVERA_MaxWarning	(SERVERA_Dummy+15)

/* Values for SERVERA_Type
 */
#define SVRTYPE_SMTP	(0)	/* sending data via smtp */
#define SVRTYPE_POP3	(1)	/* pop retrieval and local folders */
#define SVRTYPE_IMAP	(2)	/* unsupported */
#define SVRTYPE_NNTP	(3)	/* unsupported */
#define SVRTYPE_LDAP	(4)	/* unsupported */
#define SVRTYPE_FILE	(5)	/* For address/file "servers" */

/* Structure used for progress callbacks.
 */
struct ServerProgressData
{
	ULONG spd_Type;
	ULONG spd_Action;
	ULONG spd_Flags;

	/* X of Y progress */
	ULONG spd_Current;
	ULONG spd_Total;

	/* (sub) progress on each of X thru Y */
	ULONG spd_CSize;
	ULONG spd_TSize;
};

/* Values for spd_Type
 */
#define SPDT_SERVER	(0)
#define SPDT_FOLDER	(1)
#define SPDT_ARTICLE	(2)
#define SPDT_PART	(3)
#define SPDT_ADDRESS	(4)
#define SPDT_DECODER	(5)

/* Values for spd_Action
 */
#define SPDA_ERROR	(~0)
#define SPDA_NONE	(0)
#define SPDA_SCANINDEX	(1)
#define SPDA_EDITINDEX	(2)
#define SPDA_DELETE	(3)
#define SPDA_PARSING	(4)
#define SPDA_POPGET	(5)
#define SPDA_SMTPSEND	(6)
#define SPDA_DECODING	(7)
#define SPDA_CONNECT	(8)
#define SPDA_DISCONNECT	(9)
#define SPDA_SENDPASS	(10)
#define SPDA_SENDUSER	(11)

/* Flags for spd_Flags
 */
#define SPDF_INITIAL	(1 << 0)
#define SPDF_UPDATE	(1 << 1)
#define SPDF_END	(1 << 2)
#define SPDF_STATUS	(1 << 3)


/* Structure for article retrieval folder routing callback.
 */
struct ArticleDisposition
{
	APTR  ad_Article;
	APTR  ad_Folder;
	ULONG ad_MsgSize;
	ULONG ad_MsgNumber;
	ULONG ad_MsgTotal;
};


/* Flags for GetServerArticles()
 */
#define GSAF_DELETE	(1)
#define GSAF_SPOOL	(2)
#define GSAF_STATUS	(4)

/*****************************************************************************/

/* Folder Attribute Tags
 */
#define FOLDERA_Dummy 		(TAG_USER+0x200)
#define FOLDERA_Path		(FOLDERA_Dummy+0)
#define FOLDERA_Name		(FOLDERA_Dummy+1)
#define FOLDERA_DefaultName	(FOLDERA_Dummy+2)
#define FOLDERA_SpoolFile	(FOLDERA_Dummy+3)
#define FOLDERA_MsgCount	(FOLDERA_Dummy+4)
#define FOLDERA_Flags		(FOLDERA_Dummy+5)
#define FOLDERA_Accessed	(FOLDERA_Dummy+6)
#define FOLDERA_Created		(FOLDERA_Dummy+7)
#define FOLDERA_UserData	(FOLDERA_Dummy+8)
#define FOLDERA_FirstMsgID	(FOLDERA_Dummy+9)
#define FOLDERA_LastMsgID	(FOLDERA_Dummy+10)
#define FOLDERA_LastRead	(FOLDERA_Dummy+11)
#define FOLDERA_NumRead		(FOLDERA_Dummy+12)

/* Values for FOLDERA_DefaultName
 */
#define FOLDER_DEF_INBOX	(0)
#define FOLDER_DEF_OUTBOX	(1)
#define FOLDER_DEF_TRASH	(2)
#define FOLDER_DEF_DRAFTS	(3)
#define FOLDER_DEF_SAVED	(4)
#define FOLDER_DEF_SPOOL	(5)

/* Folder indexing public data structure.
 */
struct FolderIndex
{
	ULONG fi_Number;
	ULONG fi_Status;
	ULONG fi_Size;
	ULONG fi_Date;
	UBYTE fi_From[64];
	UBYTE fi_To[64];
	UBYTE fi_Subject[128];
};

/* Flags for FolderIndex.fi_Status and ARTICLEA_Status
 */
#define STATUS_UNREAD	(1L << 1)
#define STATUS_REPLIED	(1L << 2)
#define STATUS_EDITED	(1L << 3)
#define STATUS_FORWARD	(1L << 4)
#define STATUS_DELETED	(1L << 5)
#define STATUS_SAVED	(1L << 6)
#define STATUS_NEW	(1L << 7)
#define STATUS_MARKED	(1L << 8)
#define STATUS_MUNREAD	(1L << 9)
#define STATUS_UUCODE	(1L << 10)
#define STATUS_SECURE	(1L << 11)
#define STATUS_AUTH	(1L << 12)
#define STATUS_BOUNCED	(1L << 13)

/* Field Identifiers for SortFolderIndex()
 */
#define FIELD_NUMBER    0
#define FIELD_TO        1
#define FIELD_SUBJECT   2
#define FIELD_FROM      3
#define FIELD_SIZE      4
#define FIELD_DATE      5
#define FIELD_THREAD    6

/*****************************************************************************/

/* Article Attribute Tags
 */
#define ARTICLEA_Dummy 			(TAG_USER+0x300)
#define ARTICLEA_To			(ARTICLEA_Dummy+0)
#define ARTICLEA_Cc			(ARTICLEA_Dummy+1)
#define ARTICLEA_Bcc			(ARTICLEA_Dummy+2)
#define ARTICLEA_From			(ARTICLEA_Dummy+3)
#define ARTICLEA_ReplyTo		(ARTICLEA_Dummy+4)
#define ARTICLEA_Date			(ARTICLEA_Dummy+5)
#define ARTICLEA_DateVal		(ARTICLEA_Dummy+6)
#define ARTICLEA_Subject		(ARTICLEA_Dummy+7)
#define ARTICLEA_ContentEncoding	(ARTICLEA_Dummy+8)
#define ARTICLEA_ContentType		(ARTICLEA_Dummy+9)
#define ARTICLEA_ContentSubType		(ARTICLEA_Dummy+10)
#define ARTICLEA_ContentTypeParams	(ARTICLEA_Dummy+11)
#define ARTICLEA_Flags			(ARTICLEA_Dummy+12)
#define ARTICLEA_Status			ARTICLEA_Flags
#define ARTICLEA_XFace			(ARTICLEA_Dummy+13)
#define ARTICLEA_MessageID		(ARTICLEA_Dummy+14)
#define ARTICLEA_Reference		(ARTICLEA_Dummy+15)
#define ARTICLEA_Groups			(ARTICLEA_Dummy+16) /* NNTP NEWS ONLY */
#define ARTICLEA_UserData		(ARTICLEA_Dummy+17)
#define ARTICLEA_ReturnReceipt		(ARTICLEA_Dummy+18)
#define ARTICLEA_SigFile		(ARTICLEA_Dummy+19)
#define ARTICLEA_CustomHeaders		(ARTICLEA_Dummy+20)
#define ARTICLEA_NumParts		(ARTICLEA_Dummy+21)
#define ARTICLEA_Organization		(ARTICLEA_Dummy+22)
#define ARTICLEA_Number			(ARTICLEA_Dummy+23)

#define PARTA_Name			(ARTICLEA_Dummy+50)
#define PARTA_ContentType		(ARTICLEA_Dummy+51)
#define PARTA_ContentSubType		(ARTICLEA_Dummy+52)
#define PARTA_ContentTypeParams		(ARTICLEA_Dummy+53)
#define PARTA_Flags			(ARTICLEA_Dummy+54)
#define PARTA_ContentEncoding		(ARTICLEA_Dummy+55)
#define PARTA_DataFilename		(ARTICLEA_Dummy+56)
#define PARTA_DataFile			(ARTICLEA_Dummy+57)
#define PARTA_DataString		(ARTICLEA_Dummy+58)
#define PARTA_DataBuffer		(ARTICLEA_Dummy+59)
#define PARTA_DataLength		(ARTICLEA_Dummy+60)
#define PARTA_ContentDesc		(ARTICLEA_Dummy+61)

/* Values for AddFolderArticle(..., type, ...);
 */
#define ARTICLE_TYPE_FILE	(0)
#define ARTICLE_TYPE_ARTICLE	(1)
#define ARTICLE_TYPE_BUFFER	(2)

/*****************************************************************************/

/* Address Attribute Tags
 */
#define ADDRESSA_Dummy 			(TAG_USER+0x400)
#define ADDRESSA_Name			(ADDRESSA_Dummy+0)
#define ADDRESSA_Address		(ADDRESSA_Dummy+1)
#define ADDRESSA_City			(ADDRESSA_Dummy+2)
#define ADDRESSA_State			(ADDRESSA_Dummy+3)
#define ADDRESSA_Zip			(ADDRESSA_Dummy+4)
#define ADDRESSA_Country		(ADDRESSA_Dummy+5)
#define ADDRESSA_Phone			(ADDRESSA_Dummy+6)
#define ADDRESSA_Fax			(ADDRESSA_Dummy+7)
#define ADDRESSA_Comments		(ADDRESSA_Dummy+8)
#define ADDRESSA_Group			(ADDRESSA_Dummy+9)
#define ADDRESSA_Flags			(ADDRESSA_Dummy+10)
#define ADDRESSA_URL			(ADDRESSA_Dummy+11)
#define ADDRESSA_EMail			(ADDRESSA_Dummy+12)
#define ADDRESSA_UserData		(ADDRESSA_Dummy+13)
#define ADDRESSA_PartialMatch		(ADDRESSA_Dummy+14)
#define ADDRESSA_ICQ			(ADDRESSA_Dummy+15)
#define ADDRESSA_FTP			(ADDRESSA_Dummy+16)
#define ADDRESSA_Company		(ADDRESSA_Dummy+17)
#define ADDRESSA_JobTitle		(ADDRESSA_Dummy+18)
#define ADDRESSA_MobilePhone		(ADDRESSA_Dummy+19)
#define ADDRESSA_ImageFile		(ADDRESSA_Dummy+20)
#define ADDRESSA_EntryType		(ADDRESSA_Dummy+21)
#define ADDRESSA_EntryID		(ADDRESSA_Dummy+22)
#define ADDRESSA_EntryGeneration	(ADDRESSA_Dummy+23)

/* ADDRESSA_EntryType (defaults to ENTRY_USER)
 */
#define ENTRY_USER	(1)
#define ENTRY_WWW	(2)
#define ENTRY_FTP	(3)
#define ENTRY_CHAT	(4)
#define ENTRY_GROUP	(5)

/*****************************************************************************/

/* Decoder tags
 */
#define DECODERA_Dummy		(TAG_USER+0x500)
#define DECODERA_SourceFile	(DECODERA_Dummy+1)
#define DECODERA_SourceHandle	(DECODERA_Dummy+3)
#define DECODERA_SourceBuffer	(DECODERA_Dummy+5)
#define DECODERA_SourceLen	(DECODERA_Dummy+7)
#define DECODERA_DestFile	(DECODERA_Dummy+2)
#define DECODERA_DestHandle	(DECODERA_Dummy+4)
#define DECODERA_DestBuffer	(DECODERA_Dummy+6)
#define DECODERA_DestLen	(DECODERA_Dummy+8)
#define DECODERA_Lines		(DECODERA_Dummy+9)
#define DECODERA_Flags		(DECODERA_Dummy+10)
#define DECODERA_Boundary	(DECODERA_Dummy+11)

/* Values for DECODERA_Flags
 */
#define DECF_USEBOUNDARY	(1L << 0)

/* En/decoding type values.
 */
#define DECODE_ERROR	(-1)
#define DECODE_COPY	(0)
#define DECODE_QP	(1)
#define DECODE_B64	(2)
#define DECODE_UU	(3)
#define DECODE_HEX	(6)
#define DECODE_ROT	(7)

#define ENCODE_ERROR	(-1)
#define ENCODE_COPY	(0)
#define ENCODE_QP	(1)
#define ENCODE_B64	(2)
#define ENCODE_UU	(3)
#define ENCODE_8BIT	(4)
#define ENCODE_7BIT	(5)
#define ENCODE_HEX	(6)
#define ENCODE_ROT	(7)

/*****************************************************************************/

#endif /* LIBRARIES_AML_H */
