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

#ifndef	_NETINET_IP_FIL_H
#define	_NETINET_IP_FIL_H

/****************************************************************************/

#ifndef _SYS_NETINCLUDE_TYPES_H
#include <sys/netinclude_types.h>
#endif /* _SYS_NETINCLUDE_TYPES_H */

#ifndef _SYS_IOCCOM_H
#include <sys/ioccom.h>
#endif /* _SYS_IOCCOM_H */

#ifndef _NET_IF_H
#include <net/if.h>
#endif /* _NET_IF_H */

#ifndef _NETINET_IN_H
#include <netinet/in.h>
#endif /* _NETINET_IN_H */

/****************************************************************************/

#include <stddef.h>

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

#define	SIOCADAFR	_IOW('r', 60, struct frentry *)
#define	SIOCRMAFR	_IOW('r', 61, struct frentry *)
#define	SIOCSETFF	_IOW('r', 62, __ULONG)
#define	SIOCGETFF	_IOR('r', 63, __ULONG)
#define	SIOCGETFS	_IOWR('r', 64, struct friostat *)
#define	SIOCIPFFL	_IOWR('r', 65, __LONG)
#define	SIOCIPFFB	_IOR('r', 66, __LONG)
#define	SIOCADIFR	_IOW('r', 67, struct frentry *)
#define	SIOCRMIFR	_IOW('r', 68, struct frentry *)
#define	SIOCSWAPA	_IOR('r', 69, __ULONG)
#define	SIOCINAFR	_IOW('r', 70, struct frentry *)
#define	SIOCINIFR	_IOW('r', 71, struct frentry *)
#define	SIOCFRENB	_IOW('r', 72, __ULONG)
#define	SIOCFRSYN	_IOW('r', 73, __ULONG)
#define	SIOCFRZST	_IOWR('r', 74, struct friostat *)
#define	SIOCZRLST	_IOWR('r', 75, struct frentry *)
#define	SIOCAUTHW	_IOWR('r', 76, struct frauth_t *)
#define	SIOCAUTHR	_IOWR('r', 77, struct frauth_t *)
#define	SIOCATHST	_IOWR('r', 78, struct fr_authstat *)
#define	SIOCSTLCK	_IOWR('r', 79, __ULONG)
#define	SIOCSTPUT	_IOWR('r', 80, struct ipstate_save *)
#define	SIOCSTGET	_IOWR('r', 81, struct ipstate_save *)
#define	SIOCSTGSZ	_IOWR('r', 82, struct natget)
#define	SIOCGFRST	_IOWR('r', 83, struct ipfrstat *)

#define	SIOCADDFR	SIOCADAFR
#define	SIOCDELFR	SIOCRMAFR
#define	SIOCINSFR	SIOCINAFR

union i6addr {
	__ULONG	i6[4];
	struct	in_addr	in4;
};

typedef	struct	fr_ip	{
	unsigned int
		fi_v:4;		/* IP version */
	unsigned int
		fi_fl:4;	/* packet flags */
	unsigned int
		fi_tos:8;	/* IP packet TOS */
	unsigned int
		fi_ttl:8;	/* IP packet TTL */
	unsigned int
		fi_p:8;		/* IP packet protocol */
	union	i6addr fi_src;	/* source address from packet */
	union	i6addr fi_dst;	/* destination address from packet */
	__ULONG	fi_optmsk;	/* bitmask composed from IP options */
	__UWORD	fi_secmsk;	/* bitmask composed from IP security options */
	__UWORD	fi_auth;	/* authentication code from IP sec. options */
} fr_ip_t;

#define	FI_OPTIONS	(FF_OPTIONS >> 24)
#define	FI_TCPUDP	(FF_TCPUDP >> 24)	/* TCP/UCP implied comparison*/
#define	FI_FRAG		(FF_FRAG >> 24)
#define	FI_SHORT	(FF_SHORT >> 24)
#define	FI_CMP		(FI_OPTIONS|FI_TCPUDP|FI_SHORT)

#define	fi_saddr	fi_src.in4.s_addr
#define	fi_daddr	fi_dst.in4.s_addr

/*
 * These are both used by the state and NAT code to indicate that one port or
 * the other should be treated as a wildcard.
 */
#define	FI_W_SPORT	0x00000100
#define	FI_W_DPORT	0x00000200
#define	FI_WILDP	(FI_W_SPORT|FI_W_DPORT)
#define	FI_W_SADDR	0x00000400
#define	FI_W_DADDR	0x00000800
#define	FI_WILDA	(FI_W_SADDR|FI_W_DADDR)
#define	FI_NEWFR	0x00001000

typedef	struct	fr_info	{
	__APTR	fin_ifp;		/* interface packet is `on' */
	struct	fr_ip	fin_fi;		/* IP Packet summary */
	__UWORD	fin_data[2];		/* TCP/UDP ports, ICMP code/type */
	__UBYTE	fin_out;		/* in or out ? 1 == out, 0 == in */
	__UBYTE	fin_rev;		/* state only: 1 = reverse */
	__UWORD	fin_hlen;		/* length of IP header in bytes */
	__UBYTE	fin_tcpf;		/* TCP header flags (SYN, ACK, etc) */
	/* From here on is packet specific */
	__UBYTE	fin_icode;		/* ICMP error to return */
	__UWORD	fin_rule;		/* rule # last matched */
	__ULONG	fin_group;		/* group number, -1 for none */
	struct	frentry *fin_fr;	/* last matching rule */
	__STRPTR	fin_dp;			/* start of data past IP header */
	__UWORD	fin_dlen;		/* length of data portion of packet */
	__UWORD	fin_id;			/* IP packet id field */
	__APTR	fin_mp;			/* pointer to pointer to mbuf */
	__UWORD	fin_plen;
	__UWORD	fin_off;
} fr_info_t;

#define	fin_v		fin_fi.fi_v
#define	fin_saddr	fin_fi.fi_saddr
#define	fin_daddr	fin_fi.fi_daddr
#define	fin_fl		fin_fi.fi_fl

/*
 * Size for compares on fr_info structures
 */
#define	FI_CSIZE	offsetof(fr_info_t, fin_icode)

/*
 * Size for copying cache fr_info structure
 */
#define	FI_COPYSIZE	offsetof(fr_info_t, fin_dp)

typedef	struct	frdest	{
	__APTR	fd_ifp;
	struct	in_addr	fd_ip;
	__TEXT	fd_ifname[IFNAMSIZ];
} frdest_t;

typedef	struct	frpcmp	{
	__LONG	frp_cmp;	/* data for port comparisons */
	__UWORD	frp_port;	/* top port for <> and >< */
	__UWORD	frp_top;	/* top port for <> and >< */
} frpcmp_t;

typedef	struct	frtuc	{
	__UBYTE		ftu_tcpfm;	/* tcp flags mask */
	__UBYTE		ftu_tcpf;	/* tcp flags */
	frpcmp_t	ftu_src;
	frpcmp_t	ftu_dst;
} frtuc_t;

#define	ftu_scmp	ftu_src.frp_cmp
#define	ftu_dcmp	ftu_dst.frp_cmp
#define	ftu_sport	ftu_src.frp_port
#define	ftu_dport	ftu_dst.frp_port
#define	ftu_stop	ftu_src.frp_top
#define	ftu_dtop	ftu_dst.frp_top

typedef	struct	frentry {
	struct	frentry	*fr_next;
	struct	frentry	*fr_grp;
	__LONG	fr_ref;		/* reference count - for grouping */
	__APTR	fr_ifa;
	__APTR	fr_oifa;
	/*
	 * These are only incremented when a packet  matches this rule and
	 * it is the last match
	 */
	__ULONG	fr_hits;
	__ULONG	fr_bytes;
	/*
	 * Fields after this may not change whilst in the kernel.
	 */
	struct	fr_ip	fr_ip;
	struct	fr_ip	fr_mip;	/* mask structure */


	__UWORD	fr_icmpm;	/* data for ICMP packets (mask) */
	__UWORD	fr_icmp;

	frtuc_t	fr_tuc;
	__ULONG	fr_group;	/* group to which this rule belongs */
	__ULONG	fr_grhead;	/* group # which this rule starts */
	__ULONG	fr_flags;	/* per-rule flags && options (see below) */
	__ULONG	fr_skip;	/* # of rules to skip */
	__ULONG	fr_loglevel;	/* syslog log facility + priority */
	__APTR	fr_func;	/* call this function */
	__LONG	fr_sap;
	__UBYTE	fr_icode;	/* return ICMP code */
	__TEXT	fr_ifname[IFNAMSIZ];
	__TEXT	fr_oifname[IFNAMSIZ];
	struct	frdest	fr_tif;	/* "to" interface */
	struct	frdest	fr_dif;	/* duplicate packet interfaces */
	__ULONG	fr_cksum;	/* checksum on filter rules for performance */
} frentry_t;

#define	fr_v		fr_ip.fi_v
#define	fr_proto	fr_ip.fi_p
#define	fr_ttl		fr_ip.fi_ttl
#define	fr_tos		fr_ip.fi_tos
#define	fr_tcpfm	fr_tuc.ftu_tcpfm
#define	fr_tcpf		fr_tuc.ftu_tcpf
#define	fr_scmp		fr_tuc.ftu_scmp
#define	fr_dcmp		fr_tuc.ftu_dcmp
#define	fr_dport	fr_tuc.ftu_dport
#define	fr_sport	fr_tuc.ftu_sport
#define	fr_stop		fr_tuc.ftu_stop
#define	fr_dtop		fr_tuc.ftu_dtop
#define	fr_dst		fr_ip.fi_dst.in4
#define	fr_src		fr_ip.fi_src.in4
#define	fr_dmsk		fr_mip.fi_dst.in4
#define	fr_smsk		fr_mip.fi_src.in4

#ifndef	offsetof
#define	offsetof(t,m)	(__LONG)((&((t *)0L)->m))
#endif

#define	FR_CMPSIZ	(sizeof(struct frentry) - offsetof(frentry_t, fr_ip))

/*
 * fr_flags
 */
#define	FR_BLOCK	0x00001	/* do not allow packet to pass */
#define	FR_PASS		0x00002	/* allow packet to pass */
#define	FR_OUTQUE	0x00004	/* outgoing packets */
#define	FR_INQUE	0x00008	/* ingoing packets */
#define	FR_LOG		0x00010	/* Log */
#define	FR_LOGB		0x00011	/* Log-fail */
#define	FR_LOGP		0x00012	/* Log-pass */
#define	FR_LOGBODY	0x00020	/* Log the body */
#define	FR_LOGFIRST	0x00040	/* Log the first byte if state held */
#define	FR_RETRST	0x00080	/* Return TCP RST packet - reset connection */
#define	FR_RETICMP	0x00100	/* Return ICMP unreachable packet */
#define	FR_FAKEICMP	0x00180	/* Return ICMP unreachable with fake source */
#define	FR_NOMATCH	0x00200	/* no match occured */
#define	FR_ACCOUNT	0x00400	/* count packet bytes */
#define	FR_KEEPFRAG	0x00800	/* keep fragment information */
#define	FR_KEEPSTATE	0x01000	/* keep `connection' state information */
#define	FR_INACTIVE	0x02000
#define	FR_QUICK	0x04000	/* match & stop processing list */
#define	FR_FASTROUTE	0x08000	/* bypass normal routing */
#define	FR_CALLNOW	0x10000	/* call another function (fr_func) if matches */
#define	FR_DUP		0x20000	/* duplicate packet */
#define	FR_LOGORBLOCK	0x40000	/* block the packet if it can't be logged */
#define	FR_NOTSRCIP	0x80000	/* not the src IP# */
#define	FR_NOTDSTIP	0x100000	/* not the dst IP# */
#define	FR_AUTH		0x200000	/* use authentication */
#define	FR_PREAUTH	0x400000	/* require preauthentication */
#define	FR_DONTCACHE	0x800000	/* don't cache the result */

#define	FR_LOGMASK	(FR_LOG|FR_LOGP|FR_LOGB)
#define	FR_RETMASK	(FR_RETICMP|FR_RETRST|FR_FAKEICMP)

/*
 * These correspond to #define's for FI_* and are stored in fr_flags
 */
#define	FF_OPTIONS	0x01000000
#define	FF_TCPUDP	0x02000000
#define	FF_FRAG		0x04000000
#define	FF_SHORT	0x08000000
/*
 * recognized flags for SIOCGETFF and SIOCSETFF, and get put in fr_flags
 */
#define	FF_LOGPASS	0x10000000
#define	FF_LOGBLOCK	0x20000000
#define	FF_LOGNOMATCH	0x40000000
#define	FF_LOGGING	(FF_LOGPASS|FF_LOGBLOCK|FF_LOGNOMATCH)

#define	FR_NONE 0
#define	FR_EQUAL 1
#define	FR_NEQUAL 2
#define FR_LESST 3
#define FR_GREATERT 4
#define FR_LESSTE 5
#define FR_GREATERTE 6
#define	FR_OUTRANGE 7
#define	FR_INRANGE 8

typedef	struct	filterstats {
	__ULONG	fr_pass;	/* packets allowed */
	__ULONG	fr_block;	/* packets denied */
	__ULONG	fr_nom;		/* packets which don't match any rule */
	__ULONG	fr_short;	/* packets which are short */
	__ULONG	fr_ppkl;	/* packets allowed and logged */
	__ULONG	fr_bpkl;	/* packets denied and logged */
	__ULONG	fr_npkl;	/* packets unmatched and logged */
	__ULONG	fr_pkl;		/* packets logged */
	__ULONG	fr_skip;	/* packets to be logged but buffer full */
	__ULONG	fr_ret;		/* packets for which a return is sent */
	__ULONG	fr_acct;	/* packets for which counting was performed */
	__ULONG	fr_bnfr;	/* bad attempts to allocate fragment state */
	__ULONG	fr_nfr;		/* new fragment state kept */
	__ULONG	fr_cfr;		/* add new fragment state but complete pkt */
	__ULONG	fr_bads;	/* bad attempts to allocate packet state */
	__ULONG	fr_ads;		/* new packet state kept */
	__ULONG	fr_chit;	/* cached hit */
	__ULONG	fr_tcpbad;	/* TCP checksum check failures */
	__ULONG	fr_pull[2];	/* good and bad pullup attempts */
	__ULONG	fr_badsrc;	/* source received doesn't match route */
	__ULONG	fr_badttl;	/* TTL in packet doesn't reach minimum */
	__ULONG	fr_ipv6[2];	/* IPv6 packets in/out */
} filterstats_t;

/*
 * For SIOCGETFS
 */
typedef	struct	friostat	{
	struct	filterstats	f_st[2];
	struct	frentry		*f_fin[2];
	struct	frentry		*f_fout[2];
	struct	frentry		*f_acctin[2];
	struct	frentry		*f_acctout[2];
	struct	frentry		*f_fin6[2];
	struct	frentry		*f_fout6[2];
	struct	frentry		*f_acctin6[2];
	struct	frentry		*f_acctout6[2];
	struct	frentry		*f_auth;
	struct	frgroup		*f_groups[3][2];
	__ULONG	f_froute[2];
	__LONG	f_defpass;	/* default pass - from fr_pass */
	__BYTE	f_active;	/* 1 or 0 - active rule set */
	__BYTE	f_running;	/* 1 if running, else 0 */
	__BYTE	f_logging;	/* 1 if enabled, else 0 */
	__UBYTE	f_version[32];	/* version string */
	__LONG	f_locks[4];
} friostat_t;

typedef struct	optlist {
	__UWORD	ol_val;
	__LONG	ol_bit;
} optlist_t;


/*
 * Group list structure.
 */
typedef	struct frgroup {
	__ULONG	fg_num;
	struct	frgroup	*fg_next;
	struct	frentry	*fg_head;
	struct	frentry	**fg_start;
} frgroup_t;


/*
 * Log structure.  Each packet header logged is prepended by one of these.
 * Following this in the log records read from the device will be an ipflog
 * structure which is then followed by any packet data.
 */
typedef	struct	iplog	{
	__ULONG	ipl_magic;
	__ULONG	ipl_count;
	__ULONG	ipl_sec;
	__ULONG	ipl_usec;
	size_t	ipl_dsize;
	struct	iplog	*ipl_next;
} iplog_t;

#define IPL_MAGIC 0x49504c4d /* 'IPLM' */

typedef	struct	ipflog	{
	__TEXT	fl_ifname[IFNAMSIZ];
	__UBYTE	fl_plen;	/* extra data after hlen */
	__UBYTE	fl_hlen;	/* length of IP headers saved */
	__UWORD	fl_loglevel;	/* syslog log level */
	__ULONG	fl_rule;
	__ULONG	fl_group;
	__ULONG	fl_flags;
	__ULONG	fl_lflags;
} ipflog_t;

#ifndef	ICMP_UNREACH_FILTER
# define ICMP_UNREACH_FILTER 13
#endif

#ifndef	IPF_DEFAULT_PASS
# define IPF_DEFAULT_PASS FR_PASS
#endif

#define	IPMINLEN(i, h)	((i)->ip_len >= ((i)->ip_hl * 4 + sizeof(struct h)))
#define	IPLLOGSIZE	8192

#define	IPF_OPTCOPY	0x07ff00	/* bit mask of copied options */

#define	IPL_LOGIPF	0	/* Minor device #'s for accessing logs */
#define	IPL_LOGNAT	1
#define	IPL_LOGSTATE	2
#define	IPL_LOGAUTH	3
#define	IPL_LOGMAX	3

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

#endif	/* _NETINET_IP_FIL_H */
