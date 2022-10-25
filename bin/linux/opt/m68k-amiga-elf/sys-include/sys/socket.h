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
 * Copyright (c) 1982, 1985, 1986, 1988, 1993, 1994
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
 *	@(#)socket.h	8.6 (Berkeley) 5/3/95
 */

#ifndef _SYS_SOCKET_H
#define	_SYS_SOCKET_H

/****************************************************************************/

/* NOTE: the 'struct timeval' structure definition differs slightly between
         the AmigaOS usage (as defined in <devices/timer.h>) and the POSIX
         usage (as defined in <sys/time.h>. By default, this header file
         will include <devices/timer.h> under the assumption that there
         will be no problem as a result of that. However, if there are
         compilation issues, you might want to define the 'struct timeval'
         separately and disable the inclusion of <devices/timer.h>,
         which can be achieved by defining the preprocessor symbol
         __NO_NETINCLUDE_TIMEVAL before you include this header file. */

/****************************************************************************/

#ifndef _SYS_NETINCLUDE_TYPES_H
#include <sys/netinclude_types.h>
#endif /* _SYS_NETINCLUDE_TYPES_H */

/****************************************************************************/

/*
 * We might reference memmove() and memset() below, which is why
 * we need to make sure that both are declared somewhere.
 */
#include <string.h>
#include <stdlib.h>
#include <stddef.h>

/****************************************************************************/

/* 'struct iovec', as used in a 'struct msghdr' is defined in <sys/uio.h>. */
#ifndef _SYS_UIO_H
#include <sys/uio.h>
#endif /* _SYS_UIO_H */

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
 * Definitions related to sockets: types, address families, options.
 */

/*
 * Data types.
 */
typedef unsigned char	sa_family_t;
typedef unsigned long	socklen_t;

/*
 * Types
 */
#define	SOCK_STREAM	1		/* stream socket */
#define	SOCK_DGRAM	2		/* datagram socket */
#define	SOCK_RAW	3		/* raw-protocol interface */
#define	SOCK_RDM	4		/* reliably-delivered message */
#define	SOCK_SEQPACKET	5		/* sequenced packet stream */

/*
 * Option flags per-socket.
 */
#define	SO_DEBUG	0x0001		/* turn on debugging info recording */
#define	SO_ACCEPTCONN	0x0002		/* socket has had listen() */
#define	SO_REUSEADDR	0x0004		/* allow local address reuse */
#define	SO_KEEPALIVE	0x0008		/* keep connections alive */
#define	SO_DONTROUTE	0x0010		/* just use interface addresses */
#define	SO_BROADCAST	0x0020		/* permit sending of broadcast msgs */
#define	SO_USELOOPBACK	0x0040		/* bypass hardware when possible */
#define	SO_LINGER	0x0080		/* linger on close if data present */
#define	SO_OOBINLINE	0x0100		/* leave received OOB data in line */
#define	SO_REUSEPORT	0x0200		/* allow local address & port reuse */

/*
 * Additional options, not kept in so_options.
 */
#define SO_SNDBUF	0x1001		/* send buffer size */
#define SO_RCVBUF	0x1002		/* receive buffer size */
#define SO_SNDLOWAT	0x1003		/* send low-water mark */
#define SO_RCVLOWAT	0x1004		/* receive low-water mark */
#define SO_SNDTIMEO	0x1005		/* send timeout */
#define SO_RCVTIMEO	0x1006		/* receive timeout */
#define	SO_ERROR	0x1007		/* get error status and clear */
#define	SO_TYPE		0x1008		/* get socket type */

/* This is a private option which is used exclusively
 * by this Amiga TCP/IP stack implementation and should not
 * be used by user code.
 */
#define SO_EVENTMASK	0x2001

/*
 * Structure used for manipulating linger option.
 */
struct	linger {
	__LONG	l_onoff;		/* option on/off */
	__LONG	l_linger;		/* linger time in seconds */
};

/*
 * Level number for (get/set)sockopt() to apply to socket itself.
 */
#define	SOL_SOCKET	0xffff		/* options for socket level */

/*
 * Address families.
 */
#define	AF_UNSPEC	0		/* unspecified */
#define	AF_LOCAL	1		/* local to host (pipes, portals) */
#define	AF_UNIX		AF_LOCAL	/* backward compatibility */
#define	AF_INET		2		/* internetwork: UDP, TCP, etc. */
#define	AF_IMPLINK	3		/* arpanet imp addresses */
#define	AF_PUP		4		/* pup protocols: e.g. BSP */
#define	AF_CHAOS	5		/* mit CHAOS protocols */
#define	AF_NS		6		/* XEROX NS protocols */
#define	AF_ISO		7		/* ISO protocols */
#define	AF_OSI		AF_ISO
#define	AF_ECMA		8		/* european computer manufacturers */
#define	AF_DATAKIT	9		/* datakit protocols */
#define	AF_CCITT	10		/* CCITT protocols, X.25 etc */
#define	AF_SNA		11		/* IBM SNA */
#define AF_DECnet	12		/* DECnet */
#define AF_DLI		13		/* DEC Direct data link interface */
#define AF_LAT		14		/* LAT */
#define	AF_HYLINK	15		/* NSC Hyperchannel */
#define	AF_APPLETALK	16		/* Apple Talk */
#define	AF_ROUTE	17		/* Internal Routing Protocol */
#define	AF_LINK		18		/* Link layer interface */
#define	pseudo_AF_XTP	19		/* eXpress Transfer Protocol (no AF) */
#define	AF_COIP		20		/* connection-oriented IP, aka ST II */
#define	AF_CNT		21		/* Computer Network Technology */
#define pseudo_AF_RTIP	22		/* Help Identify RTIP packets */
#define	AF_IPX		23		/* Novell Internet Protocol */
#define AF_INET6        23              /* IP version 6 */ 
#define	AF_SIP		24		/* Simple Internet Protocol */
#define pseudo_AF_PIP	25		/* Help Identify PIP packets */
#define	AF_MAX		26

/*
 * Structure used by kernel to store most
 * addresses.
 */
struct sockaddr {
	__UBYTE		sa_len;			/* total length */
	sa_family_t	sa_family;		/* address family */
	__UBYTE		sa_data[14];		/* actually longer; address value */
};

/*
 * Structure used by kernel to pass protocol
 * information in raw sockets.
 */
struct sockproto {
	__UWORD	sp_family;		/* address family */
	__UWORD	sp_protocol;		/* protocol */
};

/*
 * Protocol families, same as address families for now.
 */
#define	PF_UNSPEC	AF_UNSPEC
#define	PF_LOCAL	AF_LOCAL
#define	PF_UNIX		PF_LOCAL	/* backward compatibility */
#define	PF_INET		AF_INET
#define	PF_IMPLINK	AF_IMPLINK
#define	PF_PUP		AF_PUP
#define	PF_CHAOS	AF_CHAOS
#define	PF_NS		AF_NS
#define	PF_ISO		AF_ISO
#define	PF_OSI		AF_ISO
#define	PF_ECMA		AF_ECMA
#define	PF_DATAKIT	AF_DATAKIT
#define	PF_CCITT	AF_CCITT
#define	PF_SNA		AF_SNA
#define PF_DECnet	AF_DECnet
#define PF_DLI		AF_DLI
#define PF_LAT		AF_LAT
#define	PF_HYLINK	AF_HYLINK
#define	PF_APPLETALK	AF_APPLETALK
#define	PF_ROUTE	AF_ROUTE
#define	PF_LINK		AF_LINK
#define	PF_XTP		pseudo_AF_XTP	/* really just proto family, no AF */
#define	PF_COIP		AF_COIP
#define	PF_CNT		AF_CNT
#define	PF_SIP		AF_SIP
#define	PF_IPX		AF_IPX		/* same format as AF_NS */
#define PF_RTIP		pseudo_AF_FTIP	/* same format as AF_INET */
#define PF_PIP		pseudo_AF_PIP

#define	PF_MAX		AF_MAX

/*
 * Definitions for network related sysctl, CTL_NET.
 *
 * Second level is protocol family.
 * Third level is protocol number.
 *
 * Further levels are defined by the individual families below.
 */
#define NET_MAXID	AF_MAX

/*
 * PF_ROUTE - Routing table
 *
 * Three additional levels are defined:
 *	Fourth: address family, 0 is wildcard
 *	Fifth: type of info, defined below
 *	Sixth: flag(s) to mask with for NET_RT_FLAGS
 */
#define NET_RT_DUMP	1		/* dump; may limit to a.f. */
#define NET_RT_FLAGS	2		/* by flags, e.g. RESOLVING */
#define NET_RT_IFLIST	3		/* survey interface list */
#define	NET_RT_MAXID	4

/*
 * Maximum queue length specifiable by listen.
 */
#define	SOMAXCONN	5

/*
 * Message header for recvmsg and sendmsg calls.
 * Used value-result for recvmsg, value only for sendmsg.
 */
struct msghdr {
	__APTR		msg_name;		/* optional address */
	socklen_t	msg_namelen;		/* size of address */
	struct iovec *	msg_iov;		/* scatter/gather array */
	__ULONG		msg_iovlen;		/* # elements in msg_iov */
	__APTR		msg_control;		/* ancillary data, see below */
	socklen_t	msg_controllen;		/* ancillary data buffer len */
	__LONG		msg_flags;		/* flags on received message */
};

#define	MSG_OOB		0x1		/* process out-of-band data */
#define	MSG_PEEK	0x2		/* peek at incoming message */
#define	MSG_DONTROUTE	0x4		/* send without using routing tables */
#define	MSG_EOR		0x8		/* data completes record */
#define	MSG_TRUNC	0x10		/* data discarded before delivery */
#define	MSG_CTRUNC	0x20		/* control data lost before delivery */
#define	MSG_WAITALL	0x40		/* wait for full request or error */
#define	MSG_DONTWAIT	0x80		/* this message should be nonblocking */

/*
 * Header for ancillary data objects in msg_control buffer.
 * Used for additional information with/about a datagram
 * not expressible by flags.  The format is a sequence
 * of message elements headed by cmsghdr structures.
 */
struct cmsghdr {
	socklen_t	cmsg_len;		/* data byte count, including hdr */
	__LONG		cmsg_level;		/* originating protocol */
	__LONG		cmsg_type;		/* protocol-specific type */
/* followed by	__UBYTE  cmsg_data[]; */
};

/* given pointer to struct cmsghdr, return pointer to data */
#define	CMSG_DATA(cmsg)		((__UBYTE *)((cmsg) + 1))

/* given pointer to struct cmsghdr, return pointer to next cmsghdr */
#define	CMSG_NXTHDR(mhdr, cmsg)	\
	(((__APTR)(cmsg) + (cmsg)->cmsg_len + sizeof(struct cmsghdr) > \
	    (mhdr)->msg_control + (mhdr)->msg_controllen) ? \
	    (struct cmsghdr *)NULL : \
	    (struct cmsghdr *)((__APTR)(cmsg) + ALIGN((cmsg)->cmsg_len)))

#define	CMSG_FIRSTHDR(mhdr)	((struct cmsghdr *)(mhdr)->msg_control)

/* "Socket"-level control message types: */
#define	SCM_RIGHTS	0x01		/* access rights (array of __LONG) */

/*
 * The following comes from the original <sys/types.h> header file,
 * which has been retired in favour of the <sys/netinclude_types.h>
 * type definitions. What remains are the macros in support of the
 * "select()" call and those for endian-neutral operations.
 */

/****************************************************************************/

/*
 * In case the select() data structures and macros are already
 * defined by somebody else...
 */

#ifndef FD_SET

#define	NBBY 8	/* number of bits in a byte */

/*
 * Select uses bit masks of file descriptors in longs.  These macros
 * manipulate such bit fields (the filesystem macros use chars).
 * FD_SETSIZE may be defined by the user, but the default here should
 * be enough for most uses.
 */
#ifndef	FD_SETSIZE
#define	FD_SETSIZE 256
#endif

typedef unsigned long fd_mask;
#define NFDBITS	(sizeof(fd_mask) * NBBY) /* bits per mask */

#ifndef howmany
#define	howmany(x, y)	(((x) + ((y) - 1)) / (y))
#endif

typedef	struct fd_set {
	fd_mask	fds_bits[howmany(FD_SETSIZE, NFDBITS)];
} fd_set;

#define	FD_SET(n, p)	((void)(((unsigned long)n) < FD_SETSIZE ? (p)->fds_bits[((unsigned long)n)/NFDBITS] |=  (1 << (((unsigned long)n) % NFDBITS)) : 0))
#define	FD_CLR(n, p)	((void)(((unsigned long)n) < FD_SETSIZE ? (p)->fds_bits[((unsigned long)n)/NFDBITS] &= ~(1 << (((unsigned long)n) % NFDBITS)) : 0))
#define	FD_ISSET(n, p)	(((unsigned long)n) < FD_SETSIZE && ((p)->fds_bits[((unsigned long)n)/NFDBITS] & (1 << (((unsigned long)n) % NFDBITS))))
#define	FD_COPY(f, t)	((void)memmove((t), (f), sizeof(*(f))))
#define	FD_ZERO(p)	((void)memset((p), 0, sizeof(*(p))))

#endif /* FD_SET */

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

#ifndef __NO_NETINCLUDE_TIMEVAL

/*
 * This is for compatibility with POSIX-like 'timeval' structures
 * which are remarkably similar to the Amiga 'timeval' except for
 * the structure member names...
 */
#ifndef DEVICES_TIMER_H
#include <devices/timer.h>
#endif /* DEVICES_TIMER_H */

#endif /* __NO_NETINCLUDE_TIMEVAL */

/****************************************************************************/

#ifndef __NO_NET_API

extern int accept(int sockfd,struct sockaddr *cliaddr,socklen_t *addrlen);
extern int bind(int socket, const struct sockaddr *address, socklen_t address_len);
extern int connect(int socket, const struct sockaddr *address, socklen_t address_len);
extern int getpeername(int socket, struct sockaddr *address, socklen_t *address_len);
extern int getsockname(int socket, struct sockaddr *address, socklen_t *address_len);
extern int getsockopt(int socket, int level, int option_name, void *option_value, socklen_t *option_len);
extern int listen(int socket, int backlog);
extern ssize_t recv(int socket, void *buffer, size_t length, int flags);
extern ssize_t recvfrom(int socket, void *buffer, size_t length,int flags, struct sockaddr *address,socklen_t *address_len);
extern ssize_t recvmsg(int socket, struct msghdr *message, int flags);
extern ssize_t send(int socket, const void *buffer, size_t length, int flags);
extern ssize_t sendmsg(int socket, const struct msghdr *message, int flags);
extern ssize_t sendto(int socket, const void *message, size_t length,int flags, const struct sockaddr *dest_addr,socklen_t dest_len);
extern int setsockopt(int socket, int level, int option_name, const void *option_value, socklen_t option_len);
extern int shutdown(int socket, int how);
extern int socket(int domain, int type, int protocol);

#endif /* __NO_NET_API */ 

/* SUS symbolic values for the second parm to shutdown(2) */
#define SHUT_RD   0		/* == Win32 SD_RECEIVE */
#define SHUT_WR   1		/* == Win32 SD_SEND    */
#define SHUT_RDWR 2		/* == Win32 SD_BOTH    */ 

#endif /* !_SYS_SOCKET_H_ */
