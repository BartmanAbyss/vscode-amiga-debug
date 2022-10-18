/*
 * Copyright (C) 1993-2001 by Darren Reed.
 *
 * The author accepts no responsibility for the use of this software and
 * provides it on an ``as is'' basis without express or implied warranty.
 *
 * Redistribution and use, with or without modification, in source and binary
 * forms, are permitted provided that this notice is preserved in its entirety
 * and due credit is given to the original author and the contributors.
 *
 * The licence and distribution terms for any publically available version or
 * derivative of this code cannot be changed. i.e. this code cannot simply be
 * copied, in part or in whole, and put under another distribution licence
 * [including the GNU Public Licence.]
 *
 * THIS SOFTWARE IS PROVIDED BY THE AUTHOR AND CONTRIBUTORS ``AS IS'' AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
 * OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 * SUCH DAMAGE.
 */

#ifndef	_NETINET_IP_NAT_H
#define	_NETINET_IP_NAT_H

/****************************************************************************/

#ifndef _SYS_NETINCLUDE_TYPES_H
#include <sys/netinclude_types.h>
#endif /* _SYS_NETINCLUDE_TYPES_H */

#ifndef _NETINET_IP_FIL_H
#include <netinet/ip_fil.h>
#endif /* _NETINET_IP_FIL_H */

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

#define	SIOCADNAT	_IOW('r', 60, struct ipnat *)
#define	SIOCRMNAT	_IOW('r', 61, struct ipnat *)
#define	SIOCGNATS	_IOWR('r', 62, struct natstat *)
#define	SIOCGNATL	_IOWR('r', 63, struct natlookup *)

#define	APR_LABELLEN	16

struct ap_session;

typedef	struct	nat	{
	__ULONG	nat_age;
	__LONG	nat_flags;
	__ULONG	nat_sumd[2];
	__ULONG	nat_ipsumd;
	__APTR	nat_data;
	struct	ap_session	*nat_aps;		/* proxy session */
	struct	frentry	*nat_fr;	/* filter rule ptr if appropriate */
	struct	in_addr	nat_inip;
	struct	in_addr	nat_outip;
	struct	in_addr	nat_oip;	/* other ip */
	__ULONG	nat_pkts;
	__ULONG	nat_bytes;
	__UWORD	nat_oport;		/* other port */
	__UWORD	nat_inport;
	__UWORD	nat_outport;
	__UWORD	nat_use;
	__UBYTE	nat_tcpstate[2];
	__UBYTE	nat_p;			/* protocol for NAT */
	struct	ipnat	*nat_ptr;	/* pointer back to the rule */
	struct	hostmap	*nat_hm;
	struct	nat	*nat_next;
	struct	nat	*nat_hnext[2];
	struct	nat	**nat_phnext[2];
	__APTR	nat_ifp;
	__LONG	nat_dir;
	__TEXT	nat_ifname[IFNAMSIZ];
} nat_t;

typedef	struct	ipnat	{
	struct	ipnat	*in_next;
	struct	ipnat	*in_rnext;
	struct	ipnat	**in_prnext;
	struct	ipnat	*in_mnext;
	struct	ipnat	**in_pmnext;
	__APTR	in_ifp;
	__APTR	in_apr;
	__ULONG	in_space;
	__ULONG	in_use;
	__ULONG	in_hits;
	struct	in_addr	in_nextip;
	__UWORD	in_pnext;
	__UWORD	in_ippip;	/* IP #'s per IP# */
	__ULONG	in_flags;	/* From here to in_dport must be reflected */
	__UWORD	in_spare;
	__UWORD	in_ppip;	/* ports per IP */
	__UWORD	in_port[2];	/* correctly in IPN_CMPSIZ */
	struct	in_addr	in_in[2];
	struct	in_addr	in_out[2];
	struct	in_addr	in_src[2];
	struct	frtuc	in_tuc;
	__LONG	in_redir; /* 0 if it's a mapping, 1 if it's a hard redir */
	__TEXT	in_ifname[IFNAMSIZ];
	__TEXT	in_plabel[APR_LABELLEN];	/* proxy label */
	__UBYTE	in_p;	/* protocol */
} ipnat_t;

#define	in_pmin		in_port[0]	/* Also holds static redir port */
#define	in_pmax		in_port[1]
#define	in_nip		in_nextip.s_addr
#define	in_inip		in_in[0].s_addr
#define	in_inmsk	in_in[1].s_addr
#define	in_outip	in_out[0].s_addr
#define	in_outmsk	in_out[1].s_addr
#define	in_srcip	in_src[0].s_addr
#define	in_srcmsk	in_src[1].s_addr
#define	in_scmp		in_tuc.ftu_scmp
#define	in_dcmp		in_tuc.ftu_dcmp
#define	in_stop		in_tuc.ftu_stop
#define	in_dtop		in_tuc.ftu_dtop
#define	in_sport	in_tuc.ftu_sport
#define	in_dport	in_tuc.ftu_dport

#define	NAT_OUTBOUND	0
#define	NAT_INBOUND	1

#define	NAT_MAP		0x01
#define	NAT_REDIRECT	0x02
#define	NAT_BIMAP	(NAT_MAP|NAT_REDIRECT)
#define	NAT_MAPBLK	0x04
/* 0x100 reserved for FI_W_SPORT */
/* 0x200 reserved for FI_W_DPORT */
/* 0x400 reserved for FI_W_SADDR */
/* 0x800 reserved for FI_W_DADDR */
/* 0x1000 reserved for FI_W_NEWFR */

#define	MAPBLK_MINPORT	1024	/* don't use reserved ports for src port */
#define	USABLE_PORTS	(65536 - MAPBLK_MINPORT)

#define	IPN_CMPSIZ	(sizeof(ipnat_t) - offsetof(ipnat_t, in_flags))

typedef	struct	natlookup {
	struct	in_addr	nl_inip;
	struct	in_addr	nl_outip;
	struct	in_addr	nl_realip;
	__LONG	nl_flags;
	__UWORD	nl_inport;
	__UWORD	nl_outport;
	__UWORD	nl_realport;
} natlookup_t;


typedef struct  nat_save    {
	__APTR		ipn_next;
	struct	nat	ipn_nat;
	struct	ipnat	ipn_ipnat;
	struct	frentry ipn_fr;
	__LONG	ipn_dsize;
	__UBYTE	ipn_data[4];
} nat_save_t;

#define	ipn_rule	ipn_nat.nat_fr

typedef	struct	natget	{
	__APTR	ng_ptr;
	__LONG	ng_sz;
} natget_t;


typedef	struct	hostmap	{
	struct	hostmap	*hm_next;
	struct	hostmap	**hm_pnext;
	struct	ipnat	*hm_ipnat;
	struct	in_addr	hm_realip;
	struct	in_addr	hm_mapip;
	__LONG	hm_ref;
} hostmap_t;


typedef	struct	natstat	{
	__ULONG	ns_mapped[2];
	__ULONG	ns_rules;
	__ULONG	ns_added;
	__ULONG	ns_expire;
	__ULONG	ns_inuse;
	__ULONG	ns_logged;
	__ULONG	ns_logfail;
	__ULONG	ns_memfail;
	__ULONG	ns_badnat;
	nat_t	**ns_table[2];
	hostmap_t **ns_maptable;
	ipnat_t	*ns_list;
	__APTR	ns_apslist;
	__ULONG	ns_nattab_sz;
	__ULONG	ns_rultab_sz;
	__ULONG	ns_rdrtab_sz;
	__ULONG	ns_hostmap_sz;
	nat_t	*ns_instances;
	__ULONG	ns_wilds;
} natstat_t;

#define	IPN_ANY		0x000
#define	IPN_TCP		0x001
#define	IPN_UDP		0x002
#define	IPN_TCPUDP	(IPN_TCP|IPN_UDP)
#define	IPN_DELETE	0x004
#define	IPN_ICMPERR	0x008
#define	IPN_RF		(IPN_TCPUDP|IPN_DELETE|IPN_ICMPERR)
#define	IPN_AUTOPORTMAP	0x010
#define	IPN_IPRANGE	0x020
#define	IPN_USERFLAGS	(IPN_TCPUDP|IPN_AUTOPORTMAP|IPN_IPRANGE|IPN_SPLIT|\
			 IPN_ROUNDR|IPN_FILTER|IPN_NOTSRC|IPN_NOTDST|IPN_FRAG)
#define	IPN_FILTER	0x040
#define	IPN_SPLIT	0x080
#define	IPN_ROUNDR	0x100
#define	IPN_NOTSRC	0x080000
#define	IPN_NOTDST	0x100000
#define	IPN_FRAG	0x200000


typedef	struct	natlog {
	struct	in_addr	nl_origip;
	struct	in_addr	nl_outip;
	struct	in_addr	nl_inip;
	__UWORD	nl_origport;
	__UWORD	nl_outport;
	__UWORD	nl_inport;
	__UWORD	nl_type;
	__LONG	nl_rule;
	__ULONG	nl_pkts;
	__ULONG	nl_bytes;
	__UBYTE	nl_p;
} natlog_t;


#define	NL_NEWMAP	NAT_MAP
#define	NL_NEWRDR	NAT_REDIRECT
#define	NL_NEWBIMAP	NAT_BIMAP
#define	NL_NEWBLOCK	NAT_MAPBLK
#define	NL_FLUSH	0xfffe
#define	NL_EXPIRE	0xffff

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

#endif /* _NETINET_IP_NAT_H */
