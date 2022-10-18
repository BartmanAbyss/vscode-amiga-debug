/*
 * $Id: inet.h,v 1.4 2006-01-08 12:06:14 obarthel Exp $
 *
 * :ts=4
 *
 * Portable ISO 'C' (1994) runtime library for the Amiga computer
 * Copyright (c) 2002-2015 by Olaf Barthel <obarthel (at) gmx.net>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 *   - Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 *
 *   - Neither the name of Olaf Barthel nor the names of contributors
 *     may be used to endorse or promote products derived from this
 *     software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *
 *****************************************************************************
 *
 * Documentation and source code for this library, and the most recent library
 * build are available from <http://sourceforge.net/projects/clib2>.
 *
 *****************************************************************************
 */

#ifndef	_ARPA_INET_H
#define	_ARPA_INET_H

/****************************************************************************/

#ifndef _NETINET_IN_H
#include <netinet/in.h>
#endif /* _NETINET_IN_H */

/****************************************************************************/

#ifdef __cplusplus
extern __stdargs "C" {
#endif /* __cplusplus */

#ifndef INADDR_LOOPBACK
# define INADDR_LOOPBACK	((unsigned long int) 0x7f000001)
#endif /* INADDR_LOOPBACK */

/****************************************************************************/

/* The following is not part of the ISO 'C' (1994) standard. */

/****************************************************************************/

/*
 * The following prototypes may clash with the bsdsocket.library or
 * usergroup.library API definitions.
 */

#ifndef __NO_NET_API

extern __stdargs in_addr_t inet_addr(const char *cp);
extern __stdargs int inet_aton(const char *cp, struct in_addr *pin);
extern __stdargs in_addr_t inet_lnaof(struct in_addr in);
extern __stdargs struct in_addr inet_makeaddr(in_addr_t net, in_addr_t lna);
extern __stdargs in_addr_t inet_netof(struct in_addr in);
extern __stdargs in_addr_t inet_network(const char *cp);
extern __stdargs char *inet_ntoa(struct in_addr in);

#endif /* __NO_NET_API */

/****************************************************************************/

#ifdef __cplusplus
}
#endif /* __cplusplus */

/****************************************************************************/

#endif /* _ARPA_INET_H */
