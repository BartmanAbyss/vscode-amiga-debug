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
 * Copyright (c) 1989 Stephen Deering.
 * Copyright (c) 1992, 1993
 *	The Regents of the University of California.  All rights reserved.
 *
 * This code is derived from software contributed to Berkeley by
 * Stephen Deering of Stanford University.
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
 *	@(#)ip_mroute.h	8.2 (Berkeley) 4/28/95
 */

#ifndef _NETINET_IP_MROUTE_H
#define _NETINET_IP_MROUTE_H

/****************************************************************************/

#ifndef _SYS_NETINCLUDE_TYPES_H
#include <sys/netinclude_types.h>
#endif /* _SYS_NETINCLUDE_TYPES_H */

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

/*
 * Definitions for the kernel part of DVMRP,
 * a Distance-Vector Multicast Routing Protocol.
 * (See RFC-1075.)
 *
 * Written by David Waitzman, BBN Labs, August 1988.
 * Modified by Steve Deering, Stanford, February 1989.
 *
 * MROUTING 1.0
 */


/*
 * DVMRP-specific setsockopt commands.
 */
#define	DVMRP_INIT	100
#define	DVMRP_DONE	101
#define	DVMRP_ADD_VIF	102
#define	DVMRP_DEL_VIF	103
#define	DVMRP_ADD_LGRP	104
#define	DVMRP_DEL_LGRP	105
#define	DVMRP_ADD_MRT	106
#define	DVMRP_DEL_MRT	107


/*
 * Types and macros for handling bitmaps with one bit per virtual interface.
 */
#define	MAXVIFS 32
typedef __ULONG vifbitmap_t;
typedef __UWORD vifi_t;		/* type of a vif index */

#define	VIFM_SET(n, m)		((m) |= (1 << (n)))
#define	VIFM_CLR(n, m)		((m) &= ~(1 << (n)))
#define	VIFM_ISSET(n, m)	((m) & (1 << (n)))
#define	VIFM_CLRALL(m)		((m) = 0x00000000)
#define	VIFM_COPY(mfrom, mto)	((mto) = (mfrom))
#define	VIFM_SAME(m1, m2)	((m1) == (m2))


/*
 * Agument structure for DVMRP_ADD_VIF.
 * (DVMRP_DEL_VIF takes a single vifi_t argument.)
 */
struct vifctl {
	vifi_t	    vifc_vifi;	    	/* the index of the vif to be added */
	__UBYTE	    vifc_flags;     	/* VIFF_ flags defined below */
	__UBYTE	    vifc_threshold; 	/* min ttl required to forward on vif */
	struct	in_addr vifc_lcl_addr;	/* local interface address */
	struct	in_addr vifc_rmt_addr;	/* remote address (tunnels only) */
};

#define	VIFF_TUNNEL	0x1		/* vif represents a tunnel end-point */


/*
 * Argument structure for DVMRP_ADD_LGRP and DVMRP_DEL_LGRP.
 */
struct lgrplctl {
	vifi_t	lgc_vifi;
	struct	in_addr lgc_gaddr;
};


/*
 * Argument structure for DVMRP_ADD_MRT.
 * (DVMRP_DEL_MRT takes a single struct in_addr argument, containing origin.)
 */
struct mrtctl {
	struct	in_addr mrtc_origin;	/* subnet origin of multicasts */
	struct	in_addr mrtc_originmask; /* subnet mask for origin */
	vifi_t	mrtc_parent;    	/* incoming vif */
	vifbitmap_t mrtc_children;	/* outgoing children vifs */
	vifbitmap_t mrtc_leaves;	/* subset of outgoing children vifs */
};

/*
 * The kernel's multicast routing statistics.
 */
struct mrtstat {
	__ULONG	mrts_mrt_lookups;	/* # multicast route lookups */
	__ULONG	mrts_mrt_misses;	/* # multicast route cache misses */
	__ULONG	mrts_grp_lookups;	/* # group address lookups */
	__ULONG	mrts_grp_misses;	/* # group address cache misses */
	__ULONG	mrts_no_route;		/* no route for packet's origin */
	__ULONG	mrts_bad_tunnel;	/* malformed tunnel options */
	__ULONG	mrts_cant_tunnel;	/* no room for tunnel options */
	__ULONG	mrts_wrong_if;		/* arrived on the wrong interface */
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

#endif /* _NETINET_IP_MROUTE_H */
