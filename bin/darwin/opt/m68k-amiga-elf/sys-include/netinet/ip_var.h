/*
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
 * Copyright (c) 1982, 1986, 1993
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
 *
 *	@(#)ip_var.h	8.2 (Berkeley) 1/9/95
 */

#ifndef _NETINET_IP_VAR_H
#define _NETINET_IP_VAR_H

/****************************************************************************/

#ifndef _SYS_NETINCLUDE_TYPES_H
#include <sys/netinclude_types.h>
#endif /* _SYS_NETINCLUDE_TYPES_H */

#ifndef _NETINET_IN_H
#include <netinet/in.h>
#endif /* _NETINET_IN_H */

#ifndef _NETINET_IN_VAR_H
#include <netinet/in_var.h>
#endif /* _NETINET_IN_VAR_H */

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

/*
 * Overlay for ip header used by other protocols (tcp, udp).
 */
struct ipovly {
	__APTR	ih_next, ih_prev;	/* for protocol sequence q's */
	__UBYTE	ih_x1;			/* (unused) */
	__UBYTE	ih_pr;			/* protocol */
	__WORD	ih_len;			/* protocol length */
	struct	in_addr ih_src;		/* source internet address */
	struct	in_addr ih_dst;		/* destination internet address */
};

/*
 * Structure stored in mbuf in inpcb.ip_options
 * and passed to ip_output when ip options are in use.
 * The actual length of the options (including ipopt_dst)
 * is in m_len.
 */
#define MAX_IPOPTLEN	40

struct ipoption {
	struct	in_addr ipopt_dst;		/* first-hop dst if source routed */
	__BYTE	ipopt_list[MAX_IPOPTLEN];	/* options proper */
};

struct	ipstat {
	__ULONG	ips_total;		/* total packets received */
	__ULONG	ips_badsum;		/* checksum bad */
	__ULONG	ips_tooshort;		/* packet too short */
	__ULONG	ips_toosmall;		/* not enough data */
	__ULONG	ips_badhlen;		/* ip header length < data size */
	__ULONG	ips_badlen;		/* ip length < ip header length */
	__ULONG	ips_fragments;		/* fragments received */
	__ULONG	ips_fragdropped;	/* frags dropped (dups, out of space) */
	__ULONG	ips_fragtimeout;	/* fragments timed out */
	__ULONG	ips_forward;		/* packets forwarded */
	__ULONG	ips_cantforward;	/* packets rcvd for unreachable dest */
	__ULONG	ips_redirectsent;	/* packets forwarded on same net */
	__ULONG	ips_noproto;		/* unknown or unsupported protocol */
	__ULONG	ips_delivered;		/* datagrams delivered to upper level*/
	__ULONG	ips_localout;		/* total ip packets generated here */
	__ULONG	ips_odropped;		/* lost packets due to nobufs, etc. */
	__ULONG	ips_reassembled;	/* total packets reassembled ok */
	__ULONG	ips_fragmented;		/* datagrams sucessfully fragmented */
	__ULONG	ips_ofragments;		/* output fragments created */
	__ULONG	ips_cantfrag;		/* don't fragment flag was set, etc. */
	__ULONG	ips_badoptions;		/* error in option processing */
	__ULONG	ips_noroute;		/* packets discarded due to no route */
	__ULONG	ips_badvers;		/* ip version != 4 */
	__ULONG	ips_rawout;		/* total raw ip packets generated */
};

/****************************************************************************/

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

#endif /* _NETINET_IP_VAR_H */
