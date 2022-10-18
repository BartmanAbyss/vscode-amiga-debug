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

#ifndef CLIB_BSDSOCKET_PROTOS_H
#define CLIB_BSDSOCKET_PROTOS_H
#if 0
#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */

#ifndef  EXEC_LISTS_H
#include <exec/lists.h>
#endif
#ifndef  DEVICES_TIMER_H
#include <devices/timer.h>
#endif
#ifndef  UTILITY_TAGITEM_H
#include <utility/tagitem.h>
#endif
#ifndef  UTILITY_HOOKS_H
#include <utility/hooks.h>
#endif
#ifndef  NETINET_IN_H
#include <netinet/in.h>
#endif
#ifndef  SYS_SOCKET_H
#include <sys/socket.h>
#endif
#ifndef  SYS_MBUF_H
#include <sys/mbuf.h>
#endif
#ifndef  NET_ROUTE_H
#include <net/route.h>
#endif
#ifndef  NETDB_H
#include <netdb.h>
#endif
#ifndef  LIBRARIES_BSDSOCKET_H
#include <libraries/bsdsocket.h>
#endif
#ifndef  DOS_DOSEXTENS_H
#include <dos/dosextens.h>
#endif

#ifdef __NEW_TIMEVAL_DEFINITION_USED__
#define __timeval TimeVal
#else
#define __timeval timeval
#endif

__stdargs LONG socket( LONG domain, LONG type, LONG protocol );
__stdargs LONG bind( LONG sock, struct sockaddr *name, socklen_t namelen );
__stdargs LONG listen( LONG sock, LONG backlog );
__stdargs LONG accept( LONG sock, struct sockaddr *addr, socklen_t *addrlen );
__stdargs LONG connect( LONG sock, struct sockaddr *name, socklen_t namelen );
__stdargs LONG sendto( LONG sock, APTR buf, LONG len, LONG flags, struct sockaddr *to, socklen_t tolen );
__stdargs LONG send( LONG sock, APTR buf, LONG len, LONG flags );
__stdargs LONG recvfrom( LONG sock, APTR buf, LONG len, LONG flags, struct sockaddr *addr, socklen_t *addrlen );
__stdargs LONG recv( LONG sock, APTR buf, LONG len, LONG flags );
__stdargs LONG shutdown( LONG sock, LONG how );
__stdargs LONG setsockopt( LONG sock, LONG level, LONG optname, APTR optval, socklen_t optlen );
__stdargs LONG getsockopt( LONG sock, LONG level, LONG optname, APTR optval, socklen_t *optlen );
__stdargs LONG getsockname( LONG sock, struct sockaddr *name, socklen_t *namelen );
__stdargs LONG getpeername( LONG sock, struct sockaddr *name, socklen_t *namelen );
__stdargs LONG IoctlSocket( LONG sock, ULONG req, APTR argp );
__stdargs LONG CloseSocket( LONG sock );
__stdargs LONG WaitSelect( LONG nfds, APTR read_fds, APTR write_fds, APTR except_fds, struct __timeval *_timeout, ULONG *signals );
__stdargs VOID SetSocketSignals( ULONG int_mask, ULONG io_mask, ULONG urgent_mask );
__stdargs int getdtablesize( VOID );
__stdargs LONG ObtainSocket( LONG id, LONG domain, LONG type, LONG protocol );
__stdargs LONG ReleaseSocket( LONG sock, LONG id );
__stdargs LONG ReleaseCopyOfSocket( LONG sock, LONG id );
__stdargs LONG Errno( VOID );
__stdargs VOID SetErrnoPtr( APTR errno_ptr, LONG size );
__stdargs STRPTR Inet_NtoA( in_addr_t ip );
__stdargs in_addr_t inet_addr( STRPTR cp );
__stdargs in_addr_t Inet_LnaOf( in_addr_t in );
__stdargs in_addr_t Inet_NetOf( in_addr_t in );
__stdargs in_addr_t Inet_MakeAddr( in_addr_t net, in_addr_t host );
__stdargs in_addr_t inet_network( STRPTR cp );
__stdargs struct hostent *gethostbyname( STRPTR name );
__stdargs struct hostent *gethostbyaddr( STRPTR addr, LONG len, LONG type );
__stdargs struct netent *getnetbyname( STRPTR name );
__stdargs struct netent *getnetbyaddr( in_addr_t net, LONG type );
__stdargs struct servent *getservbyname( STRPTR name, STRPTR proto );
__stdargs struct servent *getservbyport( LONG port, STRPTR proto );
__stdargs struct protoent *getprotobyname( STRPTR name );
__stdargs struct protoent *getprotobynumber( LONG proto );
__stdargs VOID vsyslog( LONG pri, STRPTR msg, APTR args );
__stdargs VOID syslog( LONG pri, STRPTR msg, LONG first_parameter, ... );
__stdargs LONG Dup2Socket( LONG old_socket, LONG new_socket );
__stdargs LONG sendmsg( LONG sock, struct msghdr *msg, LONG flags );
__stdargs LONG recvmsg( LONG sock, struct msghdr *msg, LONG flags );
__stdargs int gethostname(char* name, size_t namelen );
__stdargs long gethostid( VOID );
__stdargs LONG SocketBaseTagList( struct TagItem *tags );
__stdargs LONG SocketBaseTags( Tag first_tag, ... );
__stdargs LONG GetSocketEvents( ULONG *event_ptr );
/* Ten reserved slots for future expansion */
/* Berkeley Packet Filter (Roadshow extensions start here) */
__stdargs LONG bpf_open( LONG channel );
__stdargs LONG bpf_close( LONG channel );
__stdargs LONG bpf_read( LONG channel, APTR buffer, LONG len );
__stdargs LONG bpf_write( LONG channel, APTR buffer, LONG len );
__stdargs LONG bpf_set_notify_mask( LONG channel, ULONG signal_mask );
__stdargs LONG bpf_set_interrupt_mask( LONG channel, ULONG signal_mask );
__stdargs LONG bpf_ioctl( LONG channel, ULONG command, APTR buffer );
__stdargs LONG bpf_data_waiting( LONG channel );
/* Route management */
__stdargs LONG AddRouteTagList( struct TagItem *tags );
__stdargs LONG AddRouteTags( Tag first_tag, ... );
__stdargs LONG DeleteRouteTagList( struct TagItem *tags );
__stdargs LONG DeleteRouteTags( Tag first_tag, ... );
__stdargs VOID FreeRouteInfo( struct rt_msghdr *buf );
__stdargs struct rt_msghdr *GetRouteInfo( LONG address_family, LONG flags );
/* Interface management */
__stdargs LONG AddInterfaceTagList( STRPTR interface_name, STRPTR device_name, LONG unit, struct TagItem *tags );
__stdargs LONG AddInterfaceTags( STRPTR interface_name, STRPTR device_name, LONG unit, Tag first_tag, ... );
__stdargs LONG ConfigureInterfaceTagList( STRPTR interface_name, struct TagItem *tags );
__stdargs LONG ConfigureInterfaceTags( STRPTR interface_name, Tag first_tag, ... );
__stdargs VOID ReleaseInterfaceList( struct List *list );
__stdargs struct List *ObtainInterfaceList( VOID );
__stdargs LONG QueryInterfaceTagList( STRPTR interface_name, struct TagItem *tags );
__stdargs LONG QueryInterfaceTags( STRPTR interface_name, Tag first_tag, ... );
__stdargs LONG CreateAddrAllocMessageA( LONG version, LONG protocol, STRPTR interface_name, struct AddressAllocationMessage **result_ptr, struct TagItem *tags );
__stdargs LONG CreateAddrAllocMessage( LONG version, LONG protocol, STRPTR interface_name, struct AddressAllocationMessage **result_ptr, Tag first_tag, ... );
__stdargs VOID DeleteAddrAllocMessage( struct AddressAllocationMessage *aam );
__stdargs VOID BeginInterfaceConfig( struct AddressAllocationMessage *message );
__stdargs VOID AbortInterfaceConfig( struct AddressAllocationMessage *message );
/* Monitor management */
__stdargs LONG AddNetMonitorHookTagList( LONG type, struct Hook *hook, struct TagItem *tags );
__stdargs LONG AddNetMonitorHookTags( LONG type, struct Hook *hook, Tag first_tag, ... );
__stdargs VOID RemoveNetMonitorHook( struct Hook *hook );
/* Status query */
__stdargs LONG GetNetworkStatistics( LONG type, LONG version, APTR destination, LONG size );
/* Domain name server management */
__stdargs LONG AddDomainNameServer( STRPTR address );
__stdargs LONG RemoveDomainNameServer( STRPTR address );
__stdargs VOID ReleaseDomainNameServerList( struct List *list );
__stdargs struct List *ObtainDomainNameServerList( VOID );
/* Local database access */
__stdargs VOID setnetent( LONG stay_open );
__stdargs VOID endnetent( VOID );
__stdargs struct netent *getnetent( VOID );
__stdargs VOID setprotoent( LONG stay_open );
__stdargs VOID endprotoent( VOID );
__stdargs struct protoent *getprotoent( VOID );
__stdargs VOID setservent( LONG stay_open );
__stdargs VOID endservent( VOID );
__stdargs struct servent *getservent( VOID );
/* Address conversion */
__stdargs LONG inet_aton( STRPTR cp, struct in_addr *addr );
__stdargs STRPTR inet_ntop( LONG af, APTR src, STRPTR dst, LONG size );
__stdargs LONG inet_pton( LONG af, STRPTR src, APTR dst );
__stdargs LONG In_LocalAddr( in_addr_t address );
__stdargs LONG In_CanForward( in_addr_t address );
/* Kernel memory management */
__stdargs struct mbuf *mbuf_copym( struct mbuf *m, LONG off, LONG len );
__stdargs LONG mbuf_copyback( struct mbuf *m, LONG off, LONG len, APTR cp );
__stdargs LONG mbuf_copydata( struct mbuf *m, LONG off, LONG len, APTR cp );
__stdargs struct mbuf *mbuf_free( struct mbuf *m );
__stdargs VOID mbuf_freem( struct mbuf *m );
__stdargs struct mbuf *mbuf_get( VOID );
__stdargs struct mbuf *mbuf_gethdr( VOID );
__stdargs struct mbuf *mbuf_prepend( struct mbuf *m, LONG len );
__stdargs LONG mbuf_cat( struct mbuf *m, struct mbuf *n );
__stdargs LONG mbuf_adj( struct mbuf *mp, LONG req_len );
__stdargs struct mbuf *mbuf_pullup( struct mbuf *m, LONG len );
/* Internet servers */
__stdargs BOOL ProcessIsServer( struct Process *pr );
__stdargs LONG ObtainServerSocket( VOID );
/* Default domain name */
__stdargs BOOL GetDefaultDomainName( STRPTR buffer, LONG buffer_size );
__stdargs VOID SetDefaultDomainName( STRPTR buffer );
/* Global data access */
__stdargs struct List *ObtainRoadshowData( LONG access );
__stdargs VOID ReleaseRoadshowData( struct List *list );
__stdargs BOOL ChangeRoadshowData( struct List *list, STRPTR name, ULONG length, APTR data );
/* The counterpart to AddInterfaceTagList */
__stdargs LONG RemoveInterface( STRPTR interface_name, LONG force );
/* Reentrant versions of the gethostbyname/gethostbyaddr functions, BSD-style */
__stdargs struct hostent *gethostbyname_r( STRPTR name, struct hostent *hp, APTR buf, ULONG buflen, LONG *he );
__stdargs struct hostent *gethostbyaddr_r( STRPTR addr, LONG len, LONG type, struct hostent *hp, APTR buf, ULONG buflen, LONG *he );
/* Two reserved slots for future expansion */
/* Node and service name translation (rfc3493) */
__stdargs VOID freeaddrinfo( struct addrinfo *ai );
__stdargs LONG getaddrinfo( STRPTR hostname, STRPTR servname, struct addrinfo *hints, struct addrinfo **res );
__stdargs STRPTR gai_strerror( LONG errnum );
__stdargs LONG getnameinfo( struct sockaddr *sa, ULONG salen, STRPTR host, ULONG hostlen, STRPTR serv, ULONG servlen, ULONG flags );
/* Six reserved slots for future expansion */

#undef __timeval

#ifdef __cplusplus
}
#endif /* __cplusplus */
#endif
#endif /* CLIB_BSDSOCKET_PROTOS_H */
