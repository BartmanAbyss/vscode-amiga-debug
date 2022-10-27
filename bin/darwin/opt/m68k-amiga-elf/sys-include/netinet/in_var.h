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
 * Copyright (c) 1985, 1986, 1993
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
 *	@(#)in_var.h	8.2 (Berkeley) 1/9/95
 */

#ifndef _NETINET_IN_VAR_H
#define _NETINET_IN_VAR_H

/****************************************************************************/

#ifndef _SYS_NETINCLUDE_TYPES_H
#include <sys/netinclude_types.h>
#endif /* _SYS_NETINCLUDE_TYPES_H */

#ifndef _NETINET_IN_H
#include <netinet/in.h>
#endif /* _NETINET_IN_H */

#ifndef _NET_IF_H
#include <net/if.h>
#endif /* _NET_IF_H */

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
 * Interface address, Internet version.  One of these structures
 * is allocated for each interface with an Internet address.
 * The ifaddr structure contains the protocol-independent part
 * of the structure and is assumed to be first.
 */
struct in_ifaddr {
	struct	ifaddr ia_ifa;		/* protocol-independent info */
#define	ia_ifp		ia_ifa.ifa_ifp
#define ia_flags	ia_ifa.ifa_flags
					/* ia_{,sub}net{,mask} in host order */
	__ULONG	ia_net;			/* network number of interface */
	__ULONG	ia_netmask;		/* mask of net part */
	__ULONG	ia_subnet;		/* subnet number, including net */
	__ULONG	ia_subnetmask;		/* mask of subnet part */
	struct	in_addr ia_netbroadcast; /* to recognize net broadcasts */
	struct	in_ifaddr *ia_next;	/* next in list of internet addresses */
	struct	sockaddr_in ia_addr;	/* reserve space for interface name */
	struct	sockaddr_in ia_dstaddr; /* reserve space for broadcast addr */
#define	ia_broadaddr	ia_dstaddr
	struct	sockaddr_in ia_sockmask; /* reserve space for general netmask */
	struct	in_multi *ia_multiaddrs; /* list of multicast addresses */
};

struct	in_aliasreq {
	__TEXT	ifra_name[IFNAMSIZ];		/* if name, e.g. "en0" */
	struct	sockaddr_in ifra_addr;
	struct	sockaddr_in ifra_broadaddr;
#define ifra_dstaddr ifra_broadaddr
	struct	sockaddr_in ifra_mask;
};
/*
 * Given a pointer to an in_ifaddr (ifaddr),
 * return a pointer to the addr as a sockaddr_in.
 */
#define	IA_SIN(ia) (&(((struct in_ifaddr *)(ia))->ia_addr))

#define IN_LNAOF(in, ifa) \
	((ntohl((in).s_addr) & ~((struct in_ifaddr *)(ifa)->ia_subnetmask))
			

/*
 * Internet multicast address structure.  There is one of these for each IP
 * multicast group to which this host belongs on a given network interface.
 * They are kept in a linked list, rooted in the interface's in_ifaddr
 * structure.
 */
struct in_multi {
	struct	in_addr inm_addr;	/* IP multicast address */
	struct	ifnet *inm_ifp;		/* back pointer to ifnet */
	struct	in_ifaddr *inm_ia;	/* back pointer to in_ifaddr */
	__ULONG	inm_refcount;		/* no. membership claims by sockets */
	__ULONG	inm_timer;		/* IGMP membership report timer */
	struct	in_multi *inm_next;	/* ptr to next multicast address */
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

#endif /* _NETINET_IN_VAR_H */
