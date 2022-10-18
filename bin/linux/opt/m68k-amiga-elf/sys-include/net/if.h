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
 * Copyright (c) 1982, 1986, 1989, 1993
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
 *	@(#)if.h	8.3 (Berkeley) 2/9/95
 */

#ifndef _NET_IF_H
#define _NET_IF_H

/****************************************************************************/

/*
 * Structures defining a network interface, providing a packet
 * transport mechanism (ala level 0 of the PUP protocols).
 *
 * Each interface accepts output datagrams of a specified maximum
 * length, and provides higher level routines with input datagrams
 * received from its medium.
 *
 * Output occurs when the routine if_output is called, with three parameters:
 *	(*ifp->if_output)(ifp, m, dst, rt)
 * Here m is the mbuf chain to be sent and dst is the destination address.
 * The output routine encapsulates the supplied datagram if necessary,
 * and then transmits it on its medium.
 *
 * On input, each interface unwraps the data received by it, and either
 * places it on the input queue of a internetwork datagram routine
 * and posts the associated software interrupt, or passes the datagram to a raw
 * packet input routine.
 *
 * Routines exist for locating interfaces by their addresses
 * or for locating a interface on a certain network, as well as more general
 * routing and gateway routines maintaining information used to locate
 * interfaces.  These routines live in the files if.c and route.c
 */

/****************************************************************************/

#ifndef _SYS_NETINCLUDE_TYPES_H
#include <sys/netinclude_types.h>
#endif /* _SYS_NETINCLUDE_TYPES_H */

#ifndef _SYS_SOCKET_H
#include <sys/socket.h>
#endif /* _SYS_SOCKET_H */

/****************************************************************************/

#ifndef __timeval
#ifdef __NEW_TIMEVAL_DEFINITION_USED__
#define __timeval TimeVal
#else
#define __timeval timeval
#endif /*  __NEW_TIMEVAL_DEFINITION_USED__ */
#endif /* __timeval */

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
 * Structure describing information about an interface
 * which may be of interest to management entities.
 */
/*
 * Structure defining a queue for a network interface.
 *
 * (Would like to call this struct ``if'', but C isn't PL/1.)
 */

/* 'struct if_data' and 'struct ifqueue' used to be defined within
 * 'struct ifnet', which is problematic for use with C++.
 */
struct if_data {
	/* generic interface information */
	__UBYTE	ifi_type;	/* ethernet, tokenring, etc */
	__UBYTE	ifi_addrlen;	/* media address length */
	__UBYTE	ifi_hdrlen;	/* media header length */
	__ULONG	ifi_mtu;	/* maximum transmission unit */
	__ULONG	ifi_metric;	/* routing metric (external only) */
	__ULONG	ifi_baudrate;	/* linespeed */
	/* volatile statistics */
	__ULONG	ifi_ipackets;	/* packets received on interface */
	__ULONG	ifi_ierrors;	/* input errors on interface */
	__ULONG	ifi_opackets;	/* packets sent on interface */
	__ULONG	ifi_oerrors;	/* output errors on interface */
	__ULONG	ifi_collisions;	/* collisions on csma interfaces */
	__ULONG	ifi_ibytes;	/* total number of octets received */
	__ULONG	ifi_obytes;	/* total number of octets sent */
	__ULONG	ifi_imcasts;	/* packets received via multicast */
	__ULONG	ifi_omcasts;	/* packets sent via multicast */
	__ULONG	ifi_iqdrops;	/* dropped on input, this interface */
	__ULONG	ifi_noproto;	/* destined for unsupported protocol */
	struct	__timeval ifi_lastchange;/* last updated */
};

struct ifqueue {
	__APTR	ifq_head;
	__APTR	ifq_tail;
	__LONG	ifq_len;
	__LONG	ifq_maxlen;
	__LONG	ifq_drops;
};

struct ifnet {
	__STRPTR	if_name;	/* name, e.g. ``en'' or ``lo'' */
	struct ifnet *	if_next;	/* all struct ifnets are chained */
	struct ifaddr *	if_addrlist;	/* linked list of addresses per if */
        __LONG		if_pcount;	/* number of promiscuous listeners */
	__APTR		if_bpf;		/* packet filter structure */
	__UWORD		if_index;	/* numeric abbreviation for this if  */
	__WORD		if_unit;	/* sub-unit for lower level driver */
	__WORD		if_timer;	/* time 'til if_watchdog called */
	__UWORD		if_flags;	/* up/down, broadcast, etc. */
	struct if_data	if_data;	/* generic interface information */
/* procedure handles */
	__APTR		if_init;	/* init routine */
	__APTR		if_output;	/* output routine (enqueue) */
	__APTR		if_start;	/* initiate output routine */
	__APTR		if_done;	/* output complete routine */
	__APTR		if_ioctl;	/* ioctl routine */
	__APTR		if_reset;	
	__APTR		if_watchdog;	/* timer routine */
	struct ifqueue	if_snd;		/* output queue */
};
#define	if_mtu		if_data.ifi_mtu
#define	if_type		if_data.ifi_type
#define	if_addrlen	if_data.ifi_addrlen
#define	if_hdrlen	if_data.ifi_hdrlen
#define	if_metric	if_data.ifi_metric
#define	if_baudrate	if_data.ifi_baudrate
#define	if_ipackets	if_data.ifi_ipackets
#define	if_ierrors	if_data.ifi_ierrors
#define	if_opackets	if_data.ifi_opackets
#define	if_oerrors	if_data.ifi_oerrors
#define	if_collisions	if_data.ifi_collisions
#define	if_ibytes	if_data.ifi_ibytes
#define	if_obytes	if_data.ifi_obytes
#define	if_imcasts	if_data.ifi_imcasts
#define	if_omcasts	if_data.ifi_omcasts
#define	if_iqdrops	if_data.ifi_iqdrops
#define	if_noproto	if_data.ifi_noproto
#define	if_lastchange	if_data.ifi_lastchange

#define	IFF_UP		0x1		/* interface is up */
#define	IFF_BROADCAST	0x2		/* broadcast address valid */
#define	IFF_DEBUG	0x4		/* turn on debugging */
#define	IFF_LOOPBACK	0x8		/* is a loopback net */
#define	IFF_POINTOPOINT	0x10		/* interface is point-to-point link */
#define	IFF_NOTRAILERS	0x20		/* avoid use of trailers */
#define	IFF_RUNNING	0x40		/* resources allocated */
#define	IFF_NOARP	0x80		/* no address resolution protocol */
#define	IFF_PROMISC	0x100		/* receive all packets */
#define	IFF_ALLMULTI	0x200		/* receive all multicast packets */
#define	IFF_OACTIVE	0x400		/* transmission in progress */
#define	IFF_SIMPLEX	0x800		/* can't hear own transmissions */
#define	IFF_LINK0	0x1000		/* per link layer defined bit */
#define	IFF_LINK1	0x2000		/* per link layer defined bit */
#define	IFF_LINK2	0x4000		/* per link layer defined bit */
#define	IFF_MULTICAST	0x8000		/* supports multicast */

/* flags set internally only: */
#define	IFF_CANTCHANGE \
	(IFF_BROADCAST|IFF_POINTOPOINT|IFF_RUNNING|IFF_OACTIVE|\
	    IFF_SIMPLEX|IFF_MULTICAST|IFF_ALLMULTI)

/*
 * The ifaddr structure contains information about one address
 * of an interface.  They are maintained by the different address families,
 * are allocated and attached when an address is set, and are linked
 * together so all addresses for an interface can be located.
 */
struct ifaddr {
	struct	sockaddr *ifa_addr;	/* address of interface */
	struct	sockaddr *ifa_dstaddr;	/* other end of p-to-p link */
#define	ifa_broadaddr	ifa_dstaddr	/* broadcast address interface */
	struct	sockaddr *ifa_netmask;	/* used to determine subnet */
	struct	ifnet *ifa_ifp;		/* back-pointer to interface */
	struct	ifaddr *ifa_next;	/* next address for interface */
	__APTR	ifa_rtrequest;		/* check or clean routes (+ or -)'d */
	__UWORD	ifa_flags;		/* mostly rt_flags for cloning */
	__WORD	ifa_refcnt;		/* extra to malloc for link info */
	__LONG	ifa_metric;		/* cost of going out this interface */
};
#define	IFA_ROUTE	RTF_UP		/* route installed */

/*
 * Message format for use in obtaining information about interfaces
 * from getkerninfo and the routing socket
 */
struct if_msghdr {
	__UWORD	ifm_msglen;	/* to skip over non-understood messages */
	__UBYTE	ifm_version;	/* future binary compatability */
	__UBYTE	ifm_type;	/* message type */
	__LONG	ifm_addrs;	/* like rtm_addrs */
	__LONG	ifm_flags;	/* value of if_flags */
	__UWORD	ifm_index;	/* index for associated ifp */
	struct	if_data ifm_data;/* statistics and other data about if */
};

/*
 * Message format for use in obtaining information about interface addresses
 * from getkerninfo and the routing socket
 */
struct ifa_msghdr {
	__UWORD	ifam_msglen;	/* to skip over non-understood messages */
	__UBYTE	ifam_version;	/* future binary compatability */
	__UBYTE	ifam_type;	/* message type */
	__LONG	ifam_addrs;	/* like rtm_addrs */
	__LONG	ifam_flags;	/* value of ifa_flags */
	__UWORD	ifam_index;	/* index for associated ifp */
	__LONG	ifam_metric;	/* value of ifa_metric */
};

/*
 * Interface request structure used for socket
 * ioctl's.  All interface ioctl's must have parameter
 * definitions which begin with ifr_name.  The
 * remainder may be interface specific.
 */
struct ifreq {
#define	IFNAMSIZ	16
	__TEXT	ifr_name[IFNAMSIZ];		/* if name, e.g. "en0" */
	union {
		struct	sockaddr ifru_addr;
		struct	sockaddr ifru_dstaddr;
		struct	sockaddr ifru_broadaddr;
		__WORD	ifru_flags;
		__LONG	ifru_metric;
		__APTR	ifru_data;
	} ifr_ifru;
#define	ifr_addr	ifr_ifru.ifru_addr	/* address */
#define	ifr_dstaddr	ifr_ifru.ifru_dstaddr	/* other end of p-to-p link */
#define	ifr_broadaddr	ifr_ifru.ifru_broadaddr	/* broadcast address */
#define	ifr_flags	ifr_ifru.ifru_flags	/* flags */
#define	ifr_metric	ifr_ifru.ifru_metric	/* metric */
#define	ifr_data	ifr_ifru.ifru_data	/* for use by interface */
};

struct ifaliasreq {
	__TEXT	ifra_name[IFNAMSIZ];		/* if name, e.g. "en0" */
	struct	sockaddr ifra_addr;
	struct	sockaddr ifra_broadaddr;
	struct	sockaddr ifra_mask;
};

/*
 * Structure used in SIOCGIFCONF request.
 * Used to retrieve interface configuration
 * for machine (useful for programs which
 * must know all networks accessible).
 */
struct	ifconf {
	__LONG	ifc_len;		/* size of associated buffer */
	union {
		__APTR	ifcu_buf;
		struct	ifreq *ifcu_req;
	} ifc_ifcu;
#define	ifc_buf	ifc_ifcu.ifcu_buf	/* buffer address */
#define	ifc_req	ifc_ifcu.ifcu_req	/* array of structures returned */
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

#ifndef _NET_IF_ARP_H
#include <net/if_arp.h>
#endif /* _NET_IF_ARP_H */

/****************************************************************************/

#endif /* _NET_IF_H */
