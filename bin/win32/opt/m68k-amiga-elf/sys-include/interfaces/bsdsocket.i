/*
 * $Id$
 *
 * :ts=8
 *
 * 'Roadshow' -- Amiga TCP/IP stack; "usergroup.library" API
 * Copyright © 2001-2016 by Olaf Barthel.
 * All Rights Reserved.
 *
 * Amiga specific TCP/IP 'C' header files;
 * Freely Distributable
 */

#ifndef BSDSOCKET_INTERFACE_DEF_H
#define BSDSOCKET_INTERFACE_DEF_H
/*
** This file is machine generated from idltool
** Do not edit
*/ 

#include <exec/types.i>
#include <exec/exec.i>
#include <exec/interfaces.i>

STRUCTURE SocketIFace, InterfaceData_SIZE
	    FPTR ISocket_Obtain
	    FPTR ISocket_Release
	    FPTR ISocket_Expunge
	    FPTR ISocket_Clone
	    FPTR ISocket_socket
	    FPTR ISocket_bind
	    FPTR ISocket_listen
	    FPTR ISocket_accept
	    FPTR ISocket_connect
	    FPTR ISocket_sendto
	    FPTR ISocket_send
	    FPTR ISocket_recvfrom
	    FPTR ISocket_recv
	    FPTR ISocket_shutdown
	    FPTR ISocket_setsockopt
	    FPTR ISocket_getsockopt
	    FPTR ISocket_getsockname
	    FPTR ISocket_getpeername
	    FPTR ISocket_IoctlSocket
	    FPTR ISocket_CloseSocket
	    FPTR ISocket_WaitSelect
	    FPTR ISocket_SetSocketSignals
	    FPTR ISocket_getdtablesize
	    FPTR ISocket_ObtainSocket
	    FPTR ISocket_ReleaseSocket
	    FPTR ISocket_ReleaseCopyOfSocket
	    FPTR ISocket_Errno
	    FPTR ISocket_SetErrnoPtr
	    FPTR ISocket_Inet_NtoA
	    FPTR ISocket_inet_addr
	    FPTR ISocket_Inet_LnaOf
	    FPTR ISocket_Inet_NetOf
	    FPTR ISocket_Inet_MakeAddr
	    FPTR ISocket_inet_network
	    FPTR ISocket_gethostbyname
	    FPTR ISocket_gethostbyaddr
	    FPTR ISocket_getnetbyname
	    FPTR ISocket_getnetbyaddr
	    FPTR ISocket_getservbyname
	    FPTR ISocket_getservbyport
	    FPTR ISocket_getprotobyname
	    FPTR ISocket_getprotobynumber
	    FPTR ISocket_vsyslog
	    FPTR ISocket_syslog
	    FPTR ISocket_Dup2Socket
	    FPTR ISocket_sendmsg
	    FPTR ISocket_recvmsg
	    FPTR ISocket_gethostname
	    FPTR ISocket_gethostid
	    FPTR ISocket_SocketBaseTagList
	    FPTR ISocket_SocketBaseTags
	    FPTR ISocket_GetSocketEvents
	    FPTR ISocket_Reserved1
	    FPTR ISocket_Reserved2
	    FPTR ISocket_Reserved3
	    FPTR ISocket_Reserved4
	    FPTR ISocket_Reserved5
	    FPTR ISocket_Reserved6
	    FPTR ISocket_Reserved7
	    FPTR ISocket_Reserved8
	    FPTR ISocket_Reserved9
	    FPTR ISocket_Reserved10
	    FPTR ISocket_bpf_open
	    FPTR ISocket_bpf_close
	    FPTR ISocket_bpf_read
	    FPTR ISocket_bpf_write
	    FPTR ISocket_bpf_set_notify_mask
	    FPTR ISocket_bpf_set_interrupt_mask
	    FPTR ISocket_bpf_ioctl
	    FPTR ISocket_bpf_data_waiting
	    FPTR ISocket_AddRouteTagList
	    FPTR ISocket_AddRouteTags
	    FPTR ISocket_DeleteRouteTagList
	    FPTR ISocket_DeleteRouteTags
	    FPTR ISocket_ChangeRouteTagList
	    FPTR ISocket_ChangeRouteTags
	    FPTR ISocket_FreeRouteInfo
	    FPTR ISocket_GetRouteInfo
	    FPTR ISocket_AddInterfaceTagList
	    FPTR ISocket_AddInterfaceTags
	    FPTR ISocket_ConfigureInterfaceTagList
	    FPTR ISocket_ConfigureInterfaceTags
	    FPTR ISocket_ReleaseInterfaceList
	    FPTR ISocket_ObtainInterfaceList
	    FPTR ISocket_QueryInterfaceTagList
	    FPTR ISocket_QueryInterfaceTags
	    FPTR ISocket_CreateAddrAllocMessageA
	    FPTR ISocket_CreateAddrAllocMessage
	    FPTR ISocket_DeleteAddrAllocMessage
	    FPTR ISocket_BeginInterfaceConfig
	    FPTR ISocket_AbortInterfaceConfig
	    FPTR ISocket_AddNetMonitorHookTagList
	    FPTR ISocket_AddNetMonitorHookTags
	    FPTR ISocket_RemoveNetMonitorHook
	    FPTR ISocket_GetNetworkStatistics
	    FPTR ISocket_AddDomainNameServer
	    FPTR ISocket_RemoveDomainNameServer
	    FPTR ISocket_ReleaseDomainNameServerList
	    FPTR ISocket_ObtainDomainNameServerList
	    FPTR ISocket_setnetent
	    FPTR ISocket_endnetent
	    FPTR ISocket_getnetent
	    FPTR ISocket_setprotoent
	    FPTR ISocket_endprotoent
	    FPTR ISocket_getprotoent
	    FPTR ISocket_setservent
	    FPTR ISocket_endservent
	    FPTR ISocket_getservent
	    FPTR ISocket_inet_aton
	    FPTR ISocket_inet_ntop
	    FPTR ISocket_inet_pton
	    FPTR ISocket_In_LocalAddr
	    FPTR ISocket_In_CanForward
	    FPTR ISocket_mbuf_copym
	    FPTR ISocket_mbuf_copyback
	    FPTR ISocket_mbuf_copydata
	    FPTR ISocket_mbuf_free
	    FPTR ISocket_mbuf_freem
	    FPTR ISocket_mbuf_get
	    FPTR ISocket_mbuf_gethdr
	    FPTR ISocket_mbuf_prepend
	    FPTR ISocket_mbuf_cat
	    FPTR ISocket_mbuf_adj
	    FPTR ISocket_mbuf_pullup
	    FPTR ISocket_ProcessIsServer
	    FPTR ISocket_ObtainServerSocket
	    FPTR ISocket_GetDefaultDomainName
	    FPTR ISocket_SetDefaultDomainName
	    FPTR ISocket_ObtainRoadshowData
	    FPTR ISocket_ReleaseRoadshowData
	    FPTR ISocket_ChangeRoadshowData
	    FPTR ISocket_RemoveInterface
	    FPTR ISocket_gethostbyname_r
	    FPTR ISocket_gethostbyaddr_r
	    FPTR ISocket_Reserved11
	    FPTR ISocket_Reserved12
	    FPTR ISocket_ipf_open
	    FPTR ISocket_ipf_close
	    FPTR ISocket_ipf_ioctl
	    FPTR ISocket_ipf_log_read
	    FPTR ISocket_ipf_log_data_waiting
	    FPTR ISocket_ipf_set_notify_mask
	    FPTR ISocket_ipf_set_interrupt_mask
	    FPTR ISocket_freeaddrinfo
	    FPTR ISocket_getaddrinfo
	    FPTR ISocket_gai_strerror
	    FPTR ISocket_getnameinfo
	LABEL SocketIFace_SIZE

#endif
