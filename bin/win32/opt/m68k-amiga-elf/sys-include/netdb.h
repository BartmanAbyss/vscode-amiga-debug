/*
 * $Id$
 *
 * :ts=8
 *
 * 'Roadshow' -- Amiga TCP/IP stack
 * Copyright © 2001-2016 by Olaf Barthel.
 * All Rights Reserved.
 *
 * Amiga specific TCP/IP 'C' header files;
 * Freely Distributable
 */

/*
 * ++Copyright++ 1980, 1983, 1988, 1993
 * -
 * Copyright (c) 1980, 1983, 1988, 1993
 *	The Regents of the University of California.  All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. All advertising materials mentioning features or use of this software
 *    must display the following acknowledgement:
 *	This product includes software developed by the University of
 *	California, Berkeley and its contributors.
 * 4. Neither the name of the University nor the names of its contributors
 *    may be used to endorse or promote products derived from this software
 *    without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE REGENTS AND CONTRIBUTORS ``AS IS'' AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED.  IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
 * OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 * SUCH DAMAGE.
 * -
 * Portions Copyright (c) 1993 by Digital Equipment Corporation.
 *
 * Permission to use, copy, modify, and distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies, and that
 * the name of Digital Equipment Corporation not be used in advertising or
 * publicity pertaining to distribution of the document or software without
 * specific, written prior permission.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND DIGITAL EQUIPMENT CORP. DISCLAIMS ALL
 * WARRANTIES WITH REGARD TO THIS SOFTWARE, INCLUDING ALL IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS.   IN NO EVENT SHALL DIGITAL EQUIPMENT
 * CORPORATION BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL
 * DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR
 * PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS
 * ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS
 * SOFTWARE.
 * -
 * --Copyright--
 */

/*
 *      @(#)netdb.h	8.1 (Berkeley) 6/2/93
 *	$NetBSD: netdb.h,v 1.8 1997/10/13 09:26:06 lukem Exp $
 */

#ifndef _NETDB_H
#define _NETDB_H

/****************************************************************************/

#ifndef _SYS_NETINCLUDE_TYPES_H
#include <sys/netinclude_types.h>
#endif /* _SYS_NETINCLUDE_TYPES_H */

#ifndef _SYS_ERRNO_H
#include <sys/errno.h>
#endif /* _SYS_ERRNO_H */

#ifndef _NETINET_IN_H
#include <netinet/in.h>
#endif /* _NETINET_IN_H */

/****************************************************************************/

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */

/****************************************************************************/

#ifdef __GNUC__
 #ifdef __PPC__
  #pragma pack(2)
 #endif
#elif defined(__VBCC__)
 #pragma amiga-align
#endif

/****************************************************************************/

/* This used to be in <sys/param.h> */
#define MAXHOSTNAMELEN 256 /* max hostname size */

/*
 * Structures returned by network data base library.  All addresses are
 * supplied in host order, and returned in network order (suitable for
 * use in system calls).
 */
struct hostent
{
	__STRPTR	h_name;		/* official name of host */
	__STRPTR *	h_aliases;	/* alias list */
	__LONG		h_addrtype;	/* host address type */
	__LONG		h_length;	/* length of address */
	char ** 	h_addr_list;	/* list of addresses from name server */
#define	h_addr		h_addr_list[0]	/* address, for backward compatiblity */
};

/*
 * Assumption here is that a network number
 * fits in an unsigned long -- probably a poor one.
 */
struct netent
{
	__STRPTR	n_name;		/* official name of net */
	__STRPTR *	n_aliases;	/* alias list */
	__LONG		n_addrtype;	/* net address type */
	in_addr_t	n_net;		/* network # */
};

struct servent
{
	__STRPTR	s_name;		/* official service name */
	__STRPTR *	s_aliases;	/* alias list */
	__LONG		s_port;		/* port # */
	__STRPTR	s_proto;	/* protocol to use */
};

struct protoent
{
	__STRPTR	p_name;		/* official protocol name */
	__STRPTR *	p_aliases;	/* alias list */
	__LONG		p_proto;	/* protocol # */
};

/*
 * Error return codes from gethostbyname() and gethostbyaddr()
 * (left in extern int h_errno).
 */
extern int h_errno;
#define	NETDB_INTERNAL	-1		/* see errno */
#define	NETDB_SUCCESS	0		/* no problem */
#define	HOST_NOT_FOUND	1 		/* Authoritative Answer Host not found */
#define	TRY_AGAIN	2 		/* Non-Authoritive Host not found, or SERVERFAIL */
#define	NO_RECOVERY	3 		/* Non recoverable errors, FORMERR, REFUSED, NOTIMP */
#define	NO_DATA		4 		/* Valid name, no data record of requested type */
#define	NO_ADDRESS	NO_DATA		/* no address, look for MX record */

/****************************************************************************/

/* Values for getaddrinfo() and getnameinfo() */
#define AI_PASSIVE	1	/* socket address is intended for bind() */
#define AI_CANONNAME	2	/* request for canonical name */
#define AI_NUMERICHOST	4	/* don't ever try hostname lookup */
#define AI_EXT		8	/* enable non-portable extensions */
#define AI_NUMERICSERV	16	/* don't ever try servname lookup */
/* valid flags for addrinfo */
#define AI_MASK (AI_PASSIVE | AI_CANONNAME | AI_NUMERICHOST | AI_NUMERICSERV)

#define NI_NUMERICHOST	1	/* return the host address, not the name */
#define NI_NUMERICSERV	2	/* return the service address, not the name */
#define NI_NOFQDN	4	/* return a short name if in the local domain */
#define NI_NAMEREQD	8	/* fail if either host or service name is unknown */
#define NI_DGRAM	16	/* look up datagram service instead of stream */
#define NI_WITHSCOPEID	32	/* KAME hack: attach scopeid to host portion */

#define NI_MAXHOST	MAXHOSTNAMELEN	/* max host name returned by getnameinfo */
#define NI_MAXSERV	32	/* max serv. name length returned by getnameinfo */

#define EAI_BADFLAGS	-1	/* invalid value for ai_flags */
#define EAI_NONAME	-2	/* name or service is not known */
#define EAI_AGAIN	-3	/* temporary failure in name resolution */
#define EAI_FAIL	-4	/* non-recoverable failure in name resolution */
#define EAI_NODATA	-5	/* no address associated with name */
#define EAI_FAMILY	-6	/* ai_family not supported */
#define EAI_SOCKTYPE	-7	/* ai_socktype not supported */
#define EAI_SERVICE	-8	/* service not supported for ai_socktype */
#define EAI_ADDRFAMILY	-9	/* address family for name not supported */
#define EAI_MEMORY	-10	/* memory allocation failure */
#define EAI_SYSTEM	-11	/* system error (code indicated in errno) */
#define EAI_BADHINTS	-12	/* invalid value for hints */
#define EAI_PROTOCOL	-13	/* resolved protocol is unknown */

struct addrinfo {
	int ai_flags;		/* input flags */
	int ai_family;		/* protocol family for socket */
	int ai_socktype;	/* socket type */
	int ai_protocol;	/* protocol for socket */
	socklen_t ai_addrlen;	/* length of socket-address */
	struct sockaddr *ai_addr; /* socket-address for socket */
	char *ai_canonname;	/* canonical name for service location (iff req) */
	struct addrinfo *ai_next; /* pointer to next in list */
};

/****************************************************************************/

/*
 * The following prototypes may clash with the bsdsocket.library or
 * usergroup.library API definitions.
 */

#ifndef __NO_NET_API

extern __stdargs struct hostent *gethostbyaddr(const void *addr, socklen_t len, int type);
extern __stdargs struct hostent *gethostbyname(const char *name);
extern __stdargs struct netent *getnetbyaddr(in_addr_t net, int type);
extern __stdargs struct netent *getnetbyname(const char *name);
extern __stdargs struct protoent *getprotobyname(const char *name);
extern __stdargs struct protoent *getprotobynumber(int proto);
extern __stdargs struct servent *getservbyname(const char *name, const char *proto);
extern __stdargs struct servent *getservbyport(int port, const char *proto);
extern __stdargs const char *hstrerror(int err);

#endif /* __NO_NET_API */
 
 
#ifdef __GNUC__
 #ifdef __PPC__
  #pragma pack()
 #endif
#elif defined(__VBCC__)
 #pragma default-align
#endif

/****************************************************************************/

#ifdef __cplusplus
}
#endif /* __cplusplus */

/****************************************************************************/

#endif /* !_NETDB_H */
