/*
 * :ts=8
 *
 * 'Roadshow' -- Amiga TCP/IP stack
 * Copyright @ 2001-2017 by Olaf Barthel.
 * All Rights Reserved.
 *
 * Amiga specific TCP/IP 'C' header files;
 * Freely Distributable
 */

/*
 * This file was created with fd2pragma V2.164 using the following options:
 *
 * fd2pragma bsdsocket_lib.sfd to RAM:inline-46 special 46
 *
 * The 'struct timeval' was replaced by 'struct __timeval'.
 */

#ifndef _INLINE_BSDSOCKET_H
#define _INLINE_BSDSOCKET_H

#ifndef CLIB_BSDSOCKET_PROTOS_H
#define CLIB_BSDSOCKET_PROTOS_H
#endif

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

#ifndef BSDSOCKET_BASE_NAME
#define BSDSOCKET_BASE_NAME SocketBase
#endif

#define socket(domain, type, protocol) ({ \
  LONG _socket_domain = (domain); \
  LONG _socket_type = (type); \
  LONG _socket_protocol = (protocol); \
  LONG _socket__re = \
  ({ \
  register struct Library * const __socket__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __socket__re __asm("d0"); \
  register LONG __socket_domain __asm("d0") = (_socket_domain); \
  register LONG __socket_type __asm("d1") = (_socket_type); \
  register LONG __socket_protocol __asm("d2") = (_socket_protocol); \
  __asm volatile ("jsr a6@(-30:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__socket__re) \
  : "r"(__socket__bn), "r"(__socket_domain), "r"(__socket_type), "r"(__socket_protocol) \
  : "fp0", "fp1", "cc", "memory"); \
  __socket__re; \
  }); \
  _socket__re; \
})

#define bind(sock, name, namelen) ({ \
  LONG _bind_sock = (sock); \
  struct sockaddr * _bind_name = (name); \
  LONG _bind_namelen = (namelen); \
  LONG _bind__re = \
  ({ \
  register struct Library * const __bind__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __bind__re __asm("d0"); \
  register LONG __bind_sock __asm("d0") = (_bind_sock); \
  register struct sockaddr * __bind_name __asm("a0") = (_bind_name); \
  register LONG __bind_namelen __asm("d1") = (_bind_namelen); \
  __asm volatile ("jsr a6@(-36:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__bind__re) \
  : "r"(__bind__bn), "r"(__bind_sock), "r"(__bind_name), "r"(__bind_namelen) \
  : "fp0", "fp1", "cc", "memory"); \
  __bind__re; \
  }); \
  _bind__re; \
})

#define listen(sock, backlog) ({ \
  LONG _listen_sock = (sock); \
  LONG _listen_backlog = (backlog); \
  LONG _listen__re = \
  ({ \
  register struct Library * const __listen__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __listen__re __asm("d0"); \
  register LONG __listen_sock __asm("d0") = (_listen_sock); \
  register LONG __listen_backlog __asm("d1") = (_listen_backlog); \
  __asm volatile ("jsr a6@(-42:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__listen__re) \
  : "r"(__listen__bn), "r"(__listen_sock), "r"(__listen_backlog) \
  : "fp0", "fp1", "cc", "memory"); \
  __listen__re; \
  }); \
  _listen__re; \
})

#define accept(sock, addr, addrlen) ({ \
  LONG _accept_sock = (sock); \
  struct sockaddr * _accept_addr = (addr); \
  socklen_t * _accept_addrlen = (addrlen); \
  LONG _accept__re = \
  ({ \
  register struct Library * const __accept__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __accept__re __asm("d0"); \
  register LONG __accept_sock __asm("d0") = (_accept_sock); \
  register struct sockaddr * __accept_addr __asm("a0") = (_accept_addr); \
  register socklen_t * __accept_addrlen __asm("a1") = (_accept_addrlen); \
  __asm volatile ("jsr a6@(-48:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__accept__re) \
  : "r"(__accept__bn), "r"(__accept_sock), "r"(__accept_addr), "r"(__accept_addrlen) \
  : "fp0", "fp1", "cc", "memory"); \
  __accept__re; \
  }); \
  _accept__re; \
})

#define connect(sock, name, namelen) ({ \
  LONG _connect_sock = (sock); \
  struct sockaddr * _connect_name = (name); \
  LONG _connect_namelen = (namelen); \
  LONG _connect__re = \
  ({ \
  register struct Library * const __connect__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __connect__re __asm("d0"); \
  register LONG __connect_sock __asm("d0") = (_connect_sock); \
  register struct sockaddr * __connect_name __asm("a0") = (_connect_name); \
  register LONG __connect_namelen __asm("d1") = (_connect_namelen); \
  __asm volatile ("jsr a6@(-54:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__connect__re) \
  : "r"(__connect__bn), "r"(__connect_sock), "r"(__connect_name), "r"(__connect_namelen) \
  : "fp0", "fp1", "cc", "memory"); \
  __connect__re; \
  }); \
  _connect__re; \
})

#define sendto(sock, buf, len, flags, to, tolen) ({ \
  LONG _sendto_sock = (sock); \
  APTR _sendto_buf = (buf); \
  LONG _sendto_len = (len); \
  LONG _sendto_flags = (flags); \
  struct sockaddr * _sendto_to = (to); \
  LONG _sendto_tolen = (tolen); \
  LONG _sendto__re = \
  ({ \
  register struct Library * const __sendto__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __sendto__re __asm("d0"); \
  register LONG __sendto_sock __asm("d0") = (_sendto_sock); \
  register APTR __sendto_buf __asm("a0") = (_sendto_buf); \
  register LONG __sendto_len __asm("d1") = (_sendto_len); \
  register LONG __sendto_flags __asm("d2") = (_sendto_flags); \
  register struct sockaddr * __sendto_to __asm("a1") = (_sendto_to); \
  register LONG __sendto_tolen __asm("d3") = (_sendto_tolen); \
  __asm volatile ("jsr a6@(-60:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__sendto__re) \
  : "r"(__sendto__bn), "r"(__sendto_sock), "r"(__sendto_buf), "r"(__sendto_len), "r"(__sendto_flags), "r"(__sendto_to), "r"(__sendto_tolen) \
  : "fp0", "fp1", "cc", "memory"); \
  __sendto__re; \
  }); \
  _sendto__re; \
})

#define send(sock, buf, len, flags) ({ \
  LONG _send_sock = (sock); \
  APTR _send_buf = (buf); \
  LONG _send_len = (len); \
  LONG _send_flags = (flags); \
  LONG _send__re = \
  ({ \
  register struct Library * const __send__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __send__re __asm("d0"); \
  register LONG __send_sock __asm("d0") = (_send_sock); \
  register APTR __send_buf __asm("a0") = (_send_buf); \
  register LONG __send_len __asm("d1") = (_send_len); \
  register LONG __send_flags __asm("d2") = (_send_flags); \
  __asm volatile ("jsr a6@(-66:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__send__re) \
  : "r"(__send__bn), "r"(__send_sock), "r"(__send_buf), "r"(__send_len), "r"(__send_flags) \
  : "fp0", "fp1", "cc", "memory"); \
  __send__re; \
  }); \
  _send__re; \
})

#define recvfrom(sock, buf, len, flags, addr, addrlen) ({ \
  LONG _recvfrom_sock = (sock); \
  APTR _recvfrom_buf = (buf); \
  LONG _recvfrom_len = (len); \
  LONG _recvfrom_flags = (flags); \
  struct sockaddr * _recvfrom_addr = (addr); \
  socklen_t * _recvfrom_addrlen = (addrlen); \
  LONG _recvfrom__re = \
  ({ \
  register struct Library * const __recvfrom__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __recvfrom__re __asm("d0"); \
  register LONG __recvfrom_sock __asm("d0") = (_recvfrom_sock); \
  register APTR __recvfrom_buf __asm("a0") = (_recvfrom_buf); \
  register LONG __recvfrom_len __asm("d1") = (_recvfrom_len); \
  register LONG __recvfrom_flags __asm("d2") = (_recvfrom_flags); \
  register struct sockaddr * __recvfrom_addr __asm("a1") = (_recvfrom_addr); \
  register socklen_t * __recvfrom_addrlen __asm("a2") = (_recvfrom_addrlen); \
  __asm volatile ("jsr a6@(-72:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__recvfrom__re) \
  : "r"(__recvfrom__bn), "r"(__recvfrom_sock), "r"(__recvfrom_buf), "r"(__recvfrom_len), "r"(__recvfrom_flags), "r"(__recvfrom_addr), "r"(__recvfrom_addrlen) \
  : "fp0", "fp1", "cc", "memory"); \
  __recvfrom__re; \
  }); \
  _recvfrom__re; \
})

#define recv(sock, buf, len, flags) ({ \
  LONG _recv_sock = (sock); \
  APTR _recv_buf = (buf); \
  LONG _recv_len = (len); \
  LONG _recv_flags = (flags); \
  LONG _recv__re = \
  ({ \
  register struct Library * const __recv__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __recv__re __asm("d0"); \
  register LONG __recv_sock __asm("d0") = (_recv_sock); \
  register APTR __recv_buf __asm("a0") = (_recv_buf); \
  register LONG __recv_len __asm("d1") = (_recv_len); \
  register LONG __recv_flags __asm("d2") = (_recv_flags); \
  __asm volatile ("jsr a6@(-78:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__recv__re) \
  : "r"(__recv__bn), "r"(__recv_sock), "r"(__recv_buf), "r"(__recv_len), "r"(__recv_flags) \
  : "fp0", "fp1", "cc", "memory"); \
  __recv__re; \
  }); \
  _recv__re; \
})

#define shutdown(sock, how) ({ \
  LONG _shutdown_sock = (sock); \
  LONG _shutdown_how = (how); \
  LONG _shutdown__re = \
  ({ \
  register struct Library * const __shutdown__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __shutdown__re __asm("d0"); \
  register LONG __shutdown_sock __asm("d0") = (_shutdown_sock); \
  register LONG __shutdown_how __asm("d1") = (_shutdown_how); \
  __asm volatile ("jsr a6@(-84:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__shutdown__re) \
  : "r"(__shutdown__bn), "r"(__shutdown_sock), "r"(__shutdown_how) \
  : "fp0", "fp1", "cc", "memory"); \
  __shutdown__re; \
  }); \
  _shutdown__re; \
})

#define setsockopt(sock, level, optname, optval, optlen) ({ \
  LONG _setsockopt_sock = (sock); \
  LONG _setsockopt_level = (level); \
  LONG _setsockopt_optname = (optname); \
  APTR _setsockopt_optval = (optval); \
  LONG _setsockopt_optlen = (optlen); \
  LONG _setsockopt__re = \
  ({ \
  register struct Library * const __setsockopt__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __setsockopt__re __asm("d0"); \
  register LONG __setsockopt_sock __asm("d0") = (_setsockopt_sock); \
  register LONG __setsockopt_level __asm("d1") = (_setsockopt_level); \
  register LONG __setsockopt_optname __asm("d2") = (_setsockopt_optname); \
  register APTR __setsockopt_optval __asm("a0") = (_setsockopt_optval); \
  register LONG __setsockopt_optlen __asm("d3") = (_setsockopt_optlen); \
  __asm volatile ("jsr a6@(-90:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__setsockopt__re) \
  : "r"(__setsockopt__bn), "r"(__setsockopt_sock), "r"(__setsockopt_level), "r"(__setsockopt_optname), "r"(__setsockopt_optval), "r"(__setsockopt_optlen) \
  : "fp0", "fp1", "cc", "memory"); \
  __setsockopt__re; \
  }); \
  _setsockopt__re; \
})

#define getsockopt(sock, level, optname, optval, optlen) ({ \
  LONG _getsockopt_sock = (sock); \
  LONG _getsockopt_level = (level); \
  LONG _getsockopt_optname = (optname); \
  APTR _getsockopt_optval = (optval); \
  socklen_t * _getsockopt_optlen = (optlen); \
  LONG _getsockopt__re = \
  ({ \
  register struct Library * const __getsockopt__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __getsockopt__re __asm("d0"); \
  register LONG __getsockopt_sock __asm("d0") = (_getsockopt_sock); \
  register LONG __getsockopt_level __asm("d1") = (_getsockopt_level); \
  register LONG __getsockopt_optname __asm("d2") = (_getsockopt_optname); \
  register APTR __getsockopt_optval __asm("a0") = (_getsockopt_optval); \
  register socklen_t * __getsockopt_optlen __asm("a1") = (_getsockopt_optlen); \
  __asm volatile ("jsr a6@(-96:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__getsockopt__re) \
  : "r"(__getsockopt__bn), "r"(__getsockopt_sock), "r"(__getsockopt_level), "r"(__getsockopt_optname), "r"(__getsockopt_optval), "r"(__getsockopt_optlen) \
  : "fp0", "fp1", "cc", "memory"); \
  __getsockopt__re; \
  }); \
  _getsockopt__re; \
})

#define getsockname(sock, name, namelen) ({ \
  LONG _getsockname_sock = (sock); \
  struct sockaddr * _getsockname_name = (name); \
  socklen_t * _getsockname_namelen = (namelen); \
  LONG _getsockname__re = \
  ({ \
  register struct Library * const __getsockname__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __getsockname__re __asm("d0"); \
  register LONG __getsockname_sock __asm("d0") = (_getsockname_sock); \
  register struct sockaddr * __getsockname_name __asm("a0") = (_getsockname_name); \
  register socklen_t * __getsockname_namelen __asm("a1") = (_getsockname_namelen); \
  __asm volatile ("jsr a6@(-102:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__getsockname__re) \
  : "r"(__getsockname__bn), "r"(__getsockname_sock), "r"(__getsockname_name), "r"(__getsockname_namelen) \
  : "fp0", "fp1", "cc", "memory"); \
  __getsockname__re; \
  }); \
  _getsockname__re; \
})

#define getpeername(sock, name, namelen) ({ \
  LONG _getpeername_sock = (sock); \
  struct sockaddr * _getpeername_name = (name); \
  socklen_t * _getpeername_namelen = (namelen); \
  LONG _getpeername__re = \
  ({ \
  register struct Library * const __getpeername__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __getpeername__re __asm("d0"); \
  register LONG __getpeername_sock __asm("d0") = (_getpeername_sock); \
  register struct sockaddr * __getpeername_name __asm("a0") = (_getpeername_name); \
  register socklen_t * __getpeername_namelen __asm("a1") = (_getpeername_namelen); \
  __asm volatile ("jsr a6@(-108:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__getpeername__re) \
  : "r"(__getpeername__bn), "r"(__getpeername_sock), "r"(__getpeername_name), "r"(__getpeername_namelen) \
  : "fp0", "fp1", "cc", "memory"); \
  __getpeername__re; \
  }); \
  _getpeername__re; \
})

#define IoctlSocket(sock, req, argp) ({ \
  LONG _IoctlSocket_sock = (sock); \
  ULONG _IoctlSocket_req = (req); \
  APTR _IoctlSocket_argp = (argp); \
  LONG _IoctlSocket__re = \
  ({ \
  register struct Library * const __IoctlSocket__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __IoctlSocket__re __asm("d0"); \
  register LONG __IoctlSocket_sock __asm("d0") = (_IoctlSocket_sock); \
  register ULONG __IoctlSocket_req __asm("d1") = (_IoctlSocket_req); \
  register APTR __IoctlSocket_argp __asm("a0") = (_IoctlSocket_argp); \
  __asm volatile ("jsr a6@(-114:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__IoctlSocket__re) \
  : "r"(__IoctlSocket__bn), "r"(__IoctlSocket_sock), "r"(__IoctlSocket_req), "r"(__IoctlSocket_argp) \
  : "fp0", "fp1", "cc", "memory"); \
  __IoctlSocket__re; \
  }); \
  _IoctlSocket__re; \
})

#define CloseSocket(sock) ({ \
  LONG _CloseSocket_sock = (sock); \
  LONG _CloseSocket__re = \
  ({ \
  register struct Library * const __CloseSocket__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __CloseSocket__re __asm("d0"); \
  register LONG __CloseSocket_sock __asm("d0") = (_CloseSocket_sock); \
  __asm volatile ("jsr a6@(-120:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__CloseSocket__re) \
  : "r"(__CloseSocket__bn), "r"(__CloseSocket_sock) \
  : "fp0", "fp1", "cc", "memory"); \
  __CloseSocket__re; \
  }); \
  _CloseSocket__re; \
})

#define WaitSelect(nfds, read_fds, write_fds, except_fds, _timeout, signals) ({ \
  LONG _WaitSelect_nfds = (nfds); \
  APTR _WaitSelect_read_fds = (read_fds); \
  APTR _WaitSelect_write_fds = (write_fds); \
  APTR _WaitSelect_except_fds = (except_fds); \
  struct __timeval * _WaitSelect__timeout = (_timeout); \
  ULONG * _WaitSelect_signals = (signals); \
  LONG _WaitSelect__re = \
  ({ \
  register struct Library * const __WaitSelect__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __WaitSelect__re __asm("d0"); \
  register LONG __WaitSelect_nfds __asm("d0") = (_WaitSelect_nfds); \
  register APTR __WaitSelect_read_fds __asm("a0") = (_WaitSelect_read_fds); \
  register APTR __WaitSelect_write_fds __asm("a1") = (_WaitSelect_write_fds); \
  register APTR __WaitSelect_except_fds __asm("a2") = (_WaitSelect_except_fds); \
  register struct __timeval * __WaitSelect__timeout __asm("a3") = (_WaitSelect__timeout); \
  register ULONG * __WaitSelect_signals __asm("d1") = (_WaitSelect_signals); \
  __asm volatile ("jsr a6@(-126:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__WaitSelect__re) \
  : "r"(__WaitSelect__bn), "r"(__WaitSelect_nfds), "r"(__WaitSelect_read_fds), "r"(__WaitSelect_write_fds), "r"(__WaitSelect_except_fds), "r"(__WaitSelect__timeout), "r"(__WaitSelect_signals) \
  : "fp0", "fp1", "cc", "memory"); \
  __WaitSelect__re; \
  }); \
  _WaitSelect__re; \
})

#define SetSocketSignals(int_mask, io_mask, urgent_mask) ({ \
  ULONG _SetSocketSignals_int_mask = (int_mask); \
  ULONG _SetSocketSignals_io_mask = (io_mask); \
  ULONG _SetSocketSignals_urgent_mask = (urgent_mask); \
  { \
  register struct Library * const __SetSocketSignals__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register ULONG __SetSocketSignals_int_mask __asm("d0") = (_SetSocketSignals_int_mask); \
  register ULONG __SetSocketSignals_io_mask __asm("d1") = (_SetSocketSignals_io_mask); \
  register ULONG __SetSocketSignals_urgent_mask __asm("d2") = (_SetSocketSignals_urgent_mask); \
  __asm volatile ("jsr a6@(-132:W)" \
  : \
  : "r"(__SetSocketSignals__bn), "r"(__SetSocketSignals_int_mask), "r"(__SetSocketSignals_io_mask), "r"(__SetSocketSignals_urgent_mask) \
  : "d0", "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
  } \
})

#define getdtablesize() ({ \
  LONG _getdtablesize__re = \
  ({ \
  register struct Library * const __getdtablesize__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __getdtablesize__re __asm("d0"); \
  __asm volatile ("jsr a6@(-138:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__getdtablesize__re) \
  : "r"(__getdtablesize__bn) \
  : "fp0", "fp1", "cc", "memory"); \
  __getdtablesize__re; \
  }); \
  _getdtablesize__re; \
})

#define ObtainSocket(id, domain, type, protocol) ({ \
  LONG _ObtainSocket_id = (id); \
  LONG _ObtainSocket_domain = (domain); \
  LONG _ObtainSocket_type = (type); \
  LONG _ObtainSocket_protocol = (protocol); \
  LONG _ObtainSocket__re = \
  ({ \
  register struct Library * const __ObtainSocket__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __ObtainSocket__re __asm("d0"); \
  register LONG __ObtainSocket_id __asm("d0") = (_ObtainSocket_id); \
  register LONG __ObtainSocket_domain __asm("d1") = (_ObtainSocket_domain); \
  register LONG __ObtainSocket_type __asm("d2") = (_ObtainSocket_type); \
  register LONG __ObtainSocket_protocol __asm("d3") = (_ObtainSocket_protocol); \
  __asm volatile ("jsr a6@(-144:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__ObtainSocket__re) \
  : "r"(__ObtainSocket__bn), "r"(__ObtainSocket_id), "r"(__ObtainSocket_domain), "r"(__ObtainSocket_type), "r"(__ObtainSocket_protocol) \
  : "fp0", "fp1", "cc", "memory"); \
  __ObtainSocket__re; \
  }); \
  _ObtainSocket__re; \
})

#define ReleaseSocket(sock, id) ({ \
  LONG _ReleaseSocket_sock = (sock); \
  LONG _ReleaseSocket_id = (id); \
  LONG _ReleaseSocket__re = \
  ({ \
  register struct Library * const __ReleaseSocket__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __ReleaseSocket__re __asm("d0"); \
  register LONG __ReleaseSocket_sock __asm("d0") = (_ReleaseSocket_sock); \
  register LONG __ReleaseSocket_id __asm("d1") = (_ReleaseSocket_id); \
  __asm volatile ("jsr a6@(-150:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__ReleaseSocket__re) \
  : "r"(__ReleaseSocket__bn), "r"(__ReleaseSocket_sock), "r"(__ReleaseSocket_id) \
  : "fp0", "fp1", "cc", "memory"); \
  __ReleaseSocket__re; \
  }); \
  _ReleaseSocket__re; \
})

#define ReleaseCopyOfSocket(sock, id) ({ \
  LONG _ReleaseCopyOfSocket_sock = (sock); \
  LONG _ReleaseCopyOfSocket_id = (id); \
  LONG _ReleaseCopyOfSocket__re = \
  ({ \
  register struct Library * const __ReleaseCopyOfSocket__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __ReleaseCopyOfSocket__re __asm("d0"); \
  register LONG __ReleaseCopyOfSocket_sock __asm("d0") = (_ReleaseCopyOfSocket_sock); \
  register LONG __ReleaseCopyOfSocket_id __asm("d1") = (_ReleaseCopyOfSocket_id); \
  __asm volatile ("jsr a6@(-156:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__ReleaseCopyOfSocket__re) \
  : "r"(__ReleaseCopyOfSocket__bn), "r"(__ReleaseCopyOfSocket_sock), "r"(__ReleaseCopyOfSocket_id) \
  : "fp0", "fp1", "cc", "memory"); \
  __ReleaseCopyOfSocket__re; \
  }); \
  _ReleaseCopyOfSocket__re; \
})

#define Errno() ({ \
  LONG _Errno__re = \
  ({ \
  register struct Library * const __Errno__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __Errno__re __asm("d0"); \
  __asm volatile ("jsr a6@(-162:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__Errno__re) \
  : "r"(__Errno__bn) \
  : "fp0", "fp1", "cc", "memory"); \
  __Errno__re; \
  }); \
  _Errno__re; \
})

#define SetErrnoPtr(errno_ptr, size) ({ \
  APTR _SetErrnoPtr_errno_ptr = (errno_ptr); \
  LONG _SetErrnoPtr_size = (size); \
  { \
  register struct Library * const __SetErrnoPtr__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register APTR __SetErrnoPtr_errno_ptr __asm("a0") = (_SetErrnoPtr_errno_ptr); \
  register LONG __SetErrnoPtr_size __asm("d0") = (_SetErrnoPtr_size); \
  __asm volatile ("jsr a6@(-168:W)" \
  : \
  : "r"(__SetErrnoPtr__bn), "r"(__SetErrnoPtr_errno_ptr), "r"(__SetErrnoPtr_size) \
  : "d0", "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
  } \
})

#define Inet_NtoA(ip) ({ \
  LONG _Inet_NtoA_ip = (ip); \
  STRPTR _Inet_NtoA__re = \
  ({ \
  register struct Library * const __Inet_NtoA__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register STRPTR __Inet_NtoA__re __asm("d0"); \
  register LONG __Inet_NtoA_ip __asm("d0") = (_Inet_NtoA_ip); \
  __asm volatile ("jsr a6@(-174:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__Inet_NtoA__re) \
  : "r"(__Inet_NtoA__bn), "r"(__Inet_NtoA_ip) \
  : "fp0", "fp1", "cc", "memory"); \
  __Inet_NtoA__re; \
  }); \
  _Inet_NtoA__re; \
})

#define inet_addr(cp) ({ \
  STRPTR _inet_addr_cp = (cp); \
  in_addr_t _inet_addr__re = \
  ({ \
  register struct Library * const __inet_addr__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register in_addr_t __inet_addr__re __asm("d0"); \
  register STRPTR __inet_addr_cp __asm("a0") = (_inet_addr_cp); \
  __asm volatile ("jsr a6@(-180:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__inet_addr__re) \
  : "r"(__inet_addr__bn), "r"(__inet_addr_cp) \
  : "fp0", "fp1", "cc", "memory"); \
  __inet_addr__re; \
  }); \
  _inet_addr__re; \
})

#define Inet_LnaOf(in) ({ \
  LONG _Inet_LnaOf_in = (in); \
  in_addr_t _Inet_LnaOf__re = \
  ({ \
  register struct Library * const __Inet_LnaOf__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register in_addr_t __Inet_LnaOf__re __asm("d0"); \
  register LONG __Inet_LnaOf_in __asm("d0") = (_Inet_LnaOf_in); \
  __asm volatile ("jsr a6@(-186:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__Inet_LnaOf__re) \
  : "r"(__Inet_LnaOf__bn), "r"(__Inet_LnaOf_in) \
  : "fp0", "fp1", "cc", "memory"); \
  __Inet_LnaOf__re; \
  }); \
  _Inet_LnaOf__re; \
})

#define Inet_NetOf(in) ({ \
  LONG _Inet_NetOf_in = (in); \
  in_addr_t _Inet_NetOf__re = \
  ({ \
  register struct Library * const __Inet_NetOf__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register in_addr_t __Inet_NetOf__re __asm("d0"); \
  register LONG __Inet_NetOf_in __asm("d0") = (_Inet_NetOf_in); \
  __asm volatile ("jsr a6@(-192:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__Inet_NetOf__re) \
  : "r"(__Inet_NetOf__bn), "r"(__Inet_NetOf_in) \
  : "fp0", "fp1", "cc", "memory"); \
  __Inet_NetOf__re; \
  }); \
  _Inet_NetOf__re; \
})

#define Inet_MakeAddr(net, host) ({ \
  LONG _Inet_MakeAddr_net = (net); \
  LONG _Inet_MakeAddr_host = (host); \
  in_addr_t _Inet_MakeAddr__re = \
  ({ \
  register struct Library * const __Inet_MakeAddr__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register in_addr_t __Inet_MakeAddr__re __asm("d0"); \
  register LONG __Inet_MakeAddr_net __asm("d0") = (_Inet_MakeAddr_net); \
  register LONG __Inet_MakeAddr_host __asm("d1") = (_Inet_MakeAddr_host); \
  __asm volatile ("jsr a6@(-198:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__Inet_MakeAddr__re) \
  : "r"(__Inet_MakeAddr__bn), "r"(__Inet_MakeAddr_net), "r"(__Inet_MakeAddr_host) \
  : "fp0", "fp1", "cc", "memory"); \
  __Inet_MakeAddr__re; \
  }); \
  _Inet_MakeAddr__re; \
})

#define inet_network(cp) ({ \
  STRPTR _inet_network_cp = (cp); \
  in_addr_t _inet_network__re = \
  ({ \
  register struct Library * const __inet_network__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register in_addr_t __inet_network__re __asm("d0"); \
  register STRPTR __inet_network_cp __asm("a0") = (_inet_network_cp); \
  __asm volatile ("jsr a6@(-204:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__inet_network__re) \
  : "r"(__inet_network__bn), "r"(__inet_network_cp) \
  : "fp0", "fp1", "cc", "memory"); \
  __inet_network__re; \
  }); \
  _inet_network__re; \
})

#define gethostbyname(name) ({ \
  STRPTR _gethostbyname_name = (name); \
  struct hostent * _gethostbyname__re = \
  ({ \
  register struct Library * const __gethostbyname__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register struct hostent * __gethostbyname__re __asm("d0"); \
  register STRPTR __gethostbyname_name __asm("a0") = (_gethostbyname_name); \
  __asm volatile ("jsr a6@(-210:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__gethostbyname__re) \
  : "r"(__gethostbyname__bn), "r"(__gethostbyname_name) \
  : "fp0", "fp1", "cc", "memory"); \
  __gethostbyname__re; \
  }); \
  _gethostbyname__re; \
})

#define gethostbyaddr(addr, len, type) ({ \
  STRPTR _gethostbyaddr_addr = (addr); \
  LONG _gethostbyaddr_len = (len); \
  LONG _gethostbyaddr_type = (type); \
  struct hostent * _gethostbyaddr__re = \
  ({ \
  register struct Library * const __gethostbyaddr__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register struct hostent * __gethostbyaddr__re __asm("d0"); \
  register STRPTR __gethostbyaddr_addr __asm("a0") = (_gethostbyaddr_addr); \
  register LONG __gethostbyaddr_len __asm("d0") = (_gethostbyaddr_len); \
  register LONG __gethostbyaddr_type __asm("d1") = (_gethostbyaddr_type); \
  __asm volatile ("jsr a6@(-216:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__gethostbyaddr__re) \
  : "r"(__gethostbyaddr__bn), "r"(__gethostbyaddr_addr), "r"(__gethostbyaddr_len), "r"(__gethostbyaddr_type) \
  : "fp0", "fp1", "cc", "memory"); \
  __gethostbyaddr__re; \
  }); \
  _gethostbyaddr__re; \
})

#define getnetbyname(name) ({ \
  STRPTR _getnetbyname_name = (name); \
  struct netent * _getnetbyname__re = \
  ({ \
  register struct Library * const __getnetbyname__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register struct netent * __getnetbyname__re __asm("d0"); \
  register STRPTR __getnetbyname_name __asm("a0") = (_getnetbyname_name); \
  __asm volatile ("jsr a6@(-222:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__getnetbyname__re) \
  : "r"(__getnetbyname__bn), "r"(__getnetbyname_name) \
  : "fp0", "fp1", "cc", "memory"); \
  __getnetbyname__re; \
  }); \
  _getnetbyname__re; \
})

#define getnetbyaddr(net, type) ({ \
  LONG _getnetbyaddr_net = (net); \
  LONG _getnetbyaddr_type = (type); \
  struct netent * _getnetbyaddr__re = \
  ({ \
  register struct Library * const __getnetbyaddr__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register struct netent * __getnetbyaddr__re __asm("d0"); \
  register LONG __getnetbyaddr_net __asm("d0") = (_getnetbyaddr_net); \
  register LONG __getnetbyaddr_type __asm("d1") = (_getnetbyaddr_type); \
  __asm volatile ("jsr a6@(-228:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__getnetbyaddr__re) \
  : "r"(__getnetbyaddr__bn), "r"(__getnetbyaddr_net), "r"(__getnetbyaddr_type) \
  : "fp0", "fp1", "cc", "memory"); \
  __getnetbyaddr__re; \
  }); \
  _getnetbyaddr__re; \
})

#define getservbyname(name, proto) ({ \
  STRPTR _getservbyname_name = (name); \
  STRPTR _getservbyname_proto = (proto); \
  struct servent * _getservbyname__re = \
  ({ \
  register struct Library * const __getservbyname__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register struct servent * __getservbyname__re __asm("d0"); \
  register STRPTR __getservbyname_name __asm("a0") = (_getservbyname_name); \
  register STRPTR __getservbyname_proto __asm("a1") = (_getservbyname_proto); \
  __asm volatile ("jsr a6@(-234:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__getservbyname__re) \
  : "r"(__getservbyname__bn), "r"(__getservbyname_name), "r"(__getservbyname_proto) \
  : "fp0", "fp1", "cc", "memory"); \
  __getservbyname__re; \
  }); \
  _getservbyname__re; \
})

#define getservbyport(port, proto) ({ \
  LONG _getservbyport_port = (port); \
  STRPTR _getservbyport_proto = (proto); \
  struct servent * _getservbyport__re = \
  ({ \
  register struct Library * const __getservbyport__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register struct servent * __getservbyport__re __asm("d0"); \
  register LONG __getservbyport_port __asm("d0") = (_getservbyport_port); \
  register STRPTR __getservbyport_proto __asm("a0") = (_getservbyport_proto); \
  __asm volatile ("jsr a6@(-240:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__getservbyport__re) \
  : "r"(__getservbyport__bn), "r"(__getservbyport_port), "r"(__getservbyport_proto) \
  : "fp0", "fp1", "cc", "memory"); \
  __getservbyport__re; \
  }); \
  _getservbyport__re; \
})

#define getprotobyname(name) ({ \
  STRPTR _getprotobyname_name = (name); \
  struct protoent * _getprotobyname__re = \
  ({ \
  register struct Library * const __getprotobyname__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register struct protoent * __getprotobyname__re __asm("d0"); \
  register STRPTR __getprotobyname_name __asm("a0") = (_getprotobyname_name); \
  __asm volatile ("jsr a6@(-246:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__getprotobyname__re) \
  : "r"(__getprotobyname__bn), "r"(__getprotobyname_name) \
  : "fp0", "fp1", "cc", "memory"); \
  __getprotobyname__re; \
  }); \
  _getprotobyname__re; \
})

#define getprotobynumber(proto) ({ \
  LONG _getprotobynumber_proto = (proto); \
  struct protoent * _getprotobynumber__re = \
  ({ \
  register struct Library * const __getprotobynumber__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register struct protoent * __getprotobynumber__re __asm("d0"); \
  register LONG __getprotobynumber_proto __asm("d0") = (_getprotobynumber_proto); \
  __asm volatile ("jsr a6@(-252:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__getprotobynumber__re) \
  : "r"(__getprotobynumber__bn), "r"(__getprotobynumber_proto) \
  : "fp0", "fp1", "cc", "memory"); \
  __getprotobynumber__re; \
  }); \
  _getprotobynumber__re; \
})

#define vsyslog(pri, msg, args) ({ \
  LONG _vsyslog_pri = (pri); \
  STRPTR _vsyslog_msg = (msg); \
  APTR _vsyslog_args = (args); \
  { \
  register struct Library * const __vsyslog__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __vsyslog_pri __asm("d0") = (_vsyslog_pri); \
  register STRPTR __vsyslog_msg __asm("a0") = (_vsyslog_msg); \
  register APTR __vsyslog_args __asm("a1") = (_vsyslog_args); \
  __asm volatile ("jsr a6@(-258:W)" \
  : \
  : "r"(__vsyslog__bn), "r"(__vsyslog_pri), "r"(__vsyslog_msg), "r"(__vsyslog_args) \
  : "d0", "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
  } \
})

#ifndef NO_INLINE_VARARGS
#define syslog(pri, msg, ...) \
     ({_sfdc_vararg _args[] = { __VA_ARGS__ }; vsyslog((pri), (msg), (const APTR) _args); })
#endif /* !NO_INLINE_VARARGS */


#define Dup2Socket(old_socket, new_socket) ({ \
  LONG _Dup2Socket_old_socket = (old_socket); \
  LONG _Dup2Socket_new_socket = (new_socket); \
  LONG _Dup2Socket__re = \
  ({ \
  register struct Library * const __Dup2Socket__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __Dup2Socket__re __asm("d0"); \
  register LONG __Dup2Socket_old_socket __asm("d0") = (_Dup2Socket_old_socket); \
  register LONG __Dup2Socket_new_socket __asm("d1") = (_Dup2Socket_new_socket); \
  __asm volatile ("jsr a6@(-264:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__Dup2Socket__re) \
  : "r"(__Dup2Socket__bn), "r"(__Dup2Socket_old_socket), "r"(__Dup2Socket_new_socket) \
  : "fp0", "fp1", "cc", "memory"); \
  __Dup2Socket__re; \
  }); \
  _Dup2Socket__re; \
})

#define sendmsg(sock, msg, flags) ({ \
  LONG _sendmsg_sock = (sock); \
  struct msghdr * _sendmsg_msg = (msg); \
  LONG _sendmsg_flags = (flags); \
  LONG _sendmsg__re = \
  ({ \
  register struct Library * const __sendmsg__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __sendmsg__re __asm("d0"); \
  register LONG __sendmsg_sock __asm("d0") = (_sendmsg_sock); \
  register struct msghdr * __sendmsg_msg __asm("a0") = (_sendmsg_msg); \
  register LONG __sendmsg_flags __asm("d1") = (_sendmsg_flags); \
  __asm volatile ("jsr a6@(-270:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__sendmsg__re) \
  : "r"(__sendmsg__bn), "r"(__sendmsg_sock), "r"(__sendmsg_msg), "r"(__sendmsg_flags) \
  : "fp0", "fp1", "cc", "memory"); \
  __sendmsg__re; \
  }); \
  _sendmsg__re; \
})

#define recvmsg(sock, msg, flags) ({ \
  LONG _recvmsg_sock = (sock); \
  struct msghdr * _recvmsg_msg = (msg); \
  LONG _recvmsg_flags = (flags); \
  LONG _recvmsg__re = \
  ({ \
  register struct Library * const __recvmsg__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __recvmsg__re __asm("d0"); \
  register LONG __recvmsg_sock __asm("d0") = (_recvmsg_sock); \
  register struct msghdr * __recvmsg_msg __asm("a0") = (_recvmsg_msg); \
  register LONG __recvmsg_flags __asm("d1") = (_recvmsg_flags); \
  __asm volatile ("jsr a6@(-276:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__recvmsg__re) \
  : "r"(__recvmsg__bn), "r"(__recvmsg_sock), "r"(__recvmsg_msg), "r"(__recvmsg_flags) \
  : "fp0", "fp1", "cc", "memory"); \
  __recvmsg__re; \
  }); \
  _recvmsg__re; \
})

#define gethostname(name, namelen) ({ \
  STRPTR _gethostname_name = (name); \
  LONG _gethostname_namelen = (namelen); \
  LONG _gethostname__re = \
  ({ \
  register struct Library * const __gethostname__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __gethostname__re __asm("d0"); \
  register STRPTR __gethostname_name __asm("a0") = (_gethostname_name); \
  register LONG __gethostname_namelen __asm("d0") = (_gethostname_namelen); \
  __asm volatile ("jsr a6@(-282:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__gethostname__re) \
  : "r"(__gethostname__bn), "r"(__gethostname_name), "r"(__gethostname_namelen) \
  : "fp0", "fp1", "cc", "memory"); \
  __gethostname__re; \
  }); \
  _gethostname__re; \
})

#define gethostid() ({ \
  in_addr_t _gethostid__re = \
  ({ \
  register struct Library * const __gethostid__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register in_addr_t __gethostid__re __asm("d0"); \
  __asm volatile ("jsr a6@(-288:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__gethostid__re) \
  : "r"(__gethostid__bn) \
  : "fp0", "fp1", "cc", "memory"); \
  __gethostid__re; \
  }); \
  _gethostid__re; \
})

#define SocketBaseTagList(tags) ({ \
  struct TagItem * _SocketBaseTagList_tags = (tags); \
  LONG _SocketBaseTagList__re = \
  ({ \
  register struct Library * const __SocketBaseTagList__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __SocketBaseTagList__re __asm("d0"); \
  register struct TagItem * __SocketBaseTagList_tags __asm("a0") = (_SocketBaseTagList_tags); \
  __asm volatile ("jsr a6@(-294:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__SocketBaseTagList__re) \
  : "r"(__SocketBaseTagList__bn), "r"(__SocketBaseTagList_tags) \
  : "fp0", "fp1", "cc", "memory"); \
  __SocketBaseTagList__re; \
  }); \
  _SocketBaseTagList__re; \
})

#ifndef NO_INLINE_VARARGS
#define SocketBaseTags(tag0, ...) \
     ({_sfdc_vararg _args[] = {tag0, __VA_ARGS__ }; SocketBaseTagList((struct TagItem *) _args); })
#endif /* !NO_INLINE_VARARGS */

#define GetSocketEvents(event_ptr) ({ \
  ULONG * _GetSocketEvents_event_ptr = (event_ptr); \
  LONG _GetSocketEvents__re = \
  ({ \
  register struct Library * const __GetSocketEvents__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __GetSocketEvents__re __asm("d0"); \
  register ULONG * __GetSocketEvents_event_ptr __asm("a0") = (_GetSocketEvents_event_ptr); \
  __asm volatile ("jsr a6@(-300:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__GetSocketEvents__re) \
  : "r"(__GetSocketEvents__bn), "r"(__GetSocketEvents_event_ptr) \
  : "fp0", "fp1", "cc", "memory"); \
  __GetSocketEvents__re; \
  }); \
  _GetSocketEvents__re; \
})

#define bpf_open(channel) ({ \
  LONG _bpf_open_channel = (channel); \
  LONG _bpf_open__re = \
  ({ \
  register struct Library * const __bpf_open__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __bpf_open__re __asm("d0"); \
  register LONG __bpf_open_channel __asm("d0") = (_bpf_open_channel); \
  __asm volatile ("jsr a6@(-366:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__bpf_open__re) \
  : "r"(__bpf_open__bn), "r"(__bpf_open_channel) \
  : "fp0", "fp1", "cc", "memory"); \
  __bpf_open__re; \
  }); \
  _bpf_open__re; \
})

#define bpf_close(channel) ({ \
  LONG _bpf_close_channel = (channel); \
  LONG _bpf_close__re = \
  ({ \
  register struct Library * const __bpf_close__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __bpf_close__re __asm("d0"); \
  register LONG __bpf_close_channel __asm("d0") = (_bpf_close_channel); \
  __asm volatile ("jsr a6@(-372:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__bpf_close__re) \
  : "r"(__bpf_close__bn), "r"(__bpf_close_channel) \
  : "fp0", "fp1", "cc", "memory"); \
  __bpf_close__re; \
  }); \
  _bpf_close__re; \
})

#define bpf_read(channel, buffer, len) ({ \
  LONG _bpf_read_channel = (channel); \
  APTR _bpf_read_buffer = (buffer); \
  LONG _bpf_read_len = (len); \
  LONG _bpf_read__re = \
  ({ \
  register struct Library * const __bpf_read__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __bpf_read__re __asm("d0"); \
  register LONG __bpf_read_channel __asm("d0") = (_bpf_read_channel); \
  register APTR __bpf_read_buffer __asm("a0") = (_bpf_read_buffer); \
  register LONG __bpf_read_len __asm("d1") = (_bpf_read_len); \
  __asm volatile ("jsr a6@(-378:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__bpf_read__re) \
  : "r"(__bpf_read__bn), "r"(__bpf_read_channel), "r"(__bpf_read_buffer), "r"(__bpf_read_len) \
  : "fp0", "fp1", "cc", "memory"); \
  __bpf_read__re; \
  }); \
  _bpf_read__re; \
})

#define bpf_write(channel, buffer, len) ({ \
  LONG _bpf_write_channel = (channel); \
  APTR _bpf_write_buffer = (buffer); \
  LONG _bpf_write_len = (len); \
  LONG _bpf_write__re = \
  ({ \
  register struct Library * const __bpf_write__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __bpf_write__re __asm("d0"); \
  register LONG __bpf_write_channel __asm("d0") = (_bpf_write_channel); \
  register APTR __bpf_write_buffer __asm("a0") = (_bpf_write_buffer); \
  register LONG __bpf_write_len __asm("d1") = (_bpf_write_len); \
  __asm volatile ("jsr a6@(-384:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__bpf_write__re) \
  : "r"(__bpf_write__bn), "r"(__bpf_write_channel), "r"(__bpf_write_buffer), "r"(__bpf_write_len) \
  : "fp0", "fp1", "cc", "memory"); \
  __bpf_write__re; \
  }); \
  _bpf_write__re; \
})

#define bpf_set_notify_mask(channel, signal_mask) ({ \
  LONG _bpf_set_notify_mask_channel = (channel); \
  ULONG _bpf_set_notify_mask_signal_mask = (signal_mask); \
  LONG _bpf_set_notify_mask__re = \
  ({ \
  register struct Library * const __bpf_set_notify_mask__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __bpf_set_notify_mask__re __asm("d0"); \
  register LONG __bpf_set_notify_mask_channel __asm("d1") = (_bpf_set_notify_mask_channel); \
  register ULONG __bpf_set_notify_mask_signal_mask __asm("d0") = (_bpf_set_notify_mask_signal_mask); \
  __asm volatile ("jsr a6@(-390:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__bpf_set_notify_mask__re) \
  : "r"(__bpf_set_notify_mask__bn), "r"(__bpf_set_notify_mask_channel), "r"(__bpf_set_notify_mask_signal_mask) \
  : "fp0", "fp1", "cc", "memory"); \
  __bpf_set_notify_mask__re; \
  }); \
  _bpf_set_notify_mask__re; \
})

#define bpf_set_interrupt_mask(channel, signal_mask) ({ \
  LONG _bpf_set_interrupt_mask_channel = (channel); \
  ULONG _bpf_set_interrupt_mask_signal_mask = (signal_mask); \
  LONG _bpf_set_interrupt_mask__re = \
  ({ \
  register struct Library * const __bpf_set_interrupt_mask__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __bpf_set_interrupt_mask__re __asm("d0"); \
  register LONG __bpf_set_interrupt_mask_channel __asm("d0") = (_bpf_set_interrupt_mask_channel); \
  register ULONG __bpf_set_interrupt_mask_signal_mask __asm("d1") = (_bpf_set_interrupt_mask_signal_mask); \
  __asm volatile ("jsr a6@(-396:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__bpf_set_interrupt_mask__re) \
  : "r"(__bpf_set_interrupt_mask__bn), "r"(__bpf_set_interrupt_mask_channel), "r"(__bpf_set_interrupt_mask_signal_mask) \
  : "fp0", "fp1", "cc", "memory"); \
  __bpf_set_interrupt_mask__re; \
  }); \
  _bpf_set_interrupt_mask__re; \
})

#define bpf_ioctl(channel, command, buffer) ({ \
  LONG _bpf_ioctl_channel = (channel); \
  ULONG _bpf_ioctl_command = (command); \
  APTR _bpf_ioctl_buffer = (buffer); \
  LONG _bpf_ioctl__re = \
  ({ \
  register struct Library * const __bpf_ioctl__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __bpf_ioctl__re __asm("d0"); \
  register LONG __bpf_ioctl_channel __asm("d0") = (_bpf_ioctl_channel); \
  register ULONG __bpf_ioctl_command __asm("d1") = (_bpf_ioctl_command); \
  register APTR __bpf_ioctl_buffer __asm("a0") = (_bpf_ioctl_buffer); \
  __asm volatile ("jsr a6@(-402:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__bpf_ioctl__re) \
  : "r"(__bpf_ioctl__bn), "r"(__bpf_ioctl_channel), "r"(__bpf_ioctl_command), "r"(__bpf_ioctl_buffer) \
  : "fp0", "fp1", "cc", "memory"); \
  __bpf_ioctl__re; \
  }); \
  _bpf_ioctl__re; \
})

#define bpf_data_waiting(channel) ({ \
  LONG _bpf_data_waiting_channel = (channel); \
  LONG _bpf_data_waiting__re = \
  ({ \
  register struct Library * const __bpf_data_waiting__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __bpf_data_waiting__re __asm("d0"); \
  register LONG __bpf_data_waiting_channel __asm("d0") = (_bpf_data_waiting_channel); \
  __asm volatile ("jsr a6@(-408:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__bpf_data_waiting__re) \
  : "r"(__bpf_data_waiting__bn), "r"(__bpf_data_waiting_channel) \
  : "fp0", "fp1", "cc", "memory"); \
  __bpf_data_waiting__re; \
  }); \
  _bpf_data_waiting__re; \
})

#define AddRouteTagList(tags) ({ \
  struct TagItem * _AddRouteTagList_tags = (tags); \
  LONG _AddRouteTagList__re = \
  ({ \
  register struct Library * const __AddRouteTagList__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __AddRouteTagList__re __asm("d0"); \
  register struct TagItem * __AddRouteTagList_tags __asm("a0") = (_AddRouteTagList_tags); \
  __asm volatile ("jsr a6@(-414:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__AddRouteTagList__re) \
  : "r"(__AddRouteTagList__bn), "r"(__AddRouteTagList_tags) \
  : "fp0", "fp1", "cc", "memory"); \
  __AddRouteTagList__re; \
  }); \
  _AddRouteTagList__re; \
})

#ifndef NO_INLINE_VARARGS
#define AddRouteTags(tag0, ...) \
     ({_sfdc_vararg _args[] = {tag0, __VA_ARGS__ }; AddRouteTagList((struct TagItem *) _args); })
#endif /* !NO_INLINE_VARARGS */

#define DeleteRouteTagList(tags) ({ \
  struct TagItem * _DeleteRouteTagList_tags = (tags); \
  LONG _DeleteRouteTagList__re = \
  ({ \
  register struct Library * const __DeleteRouteTagList__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __DeleteRouteTagList__re __asm("d0"); \
  register struct TagItem * __DeleteRouteTagList_tags __asm("a0") = (_DeleteRouteTagList_tags); \
  __asm volatile ("jsr a6@(-420:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__DeleteRouteTagList__re) \
  : "r"(__DeleteRouteTagList__bn), "r"(__DeleteRouteTagList_tags) \
  : "fp0", "fp1", "cc", "memory"); \
  __DeleteRouteTagList__re; \
  }); \
  _DeleteRouteTagList__re; \
})

#ifndef NO_INLINE_VARARGS
#define DeleteRouteTags(tag0, ...) \
     ({_sfdc_vararg _args[] = {tag0, __VA_ARGS__ }; DeleteRouteTagList((struct TagItem *) _args); })
#endif /* !NO_INLINE_VARARGS */

#define FreeRouteInfo(buf) ({ \
  struct rt_msghdr * _FreeRouteInfo_buf = (buf); \
  { \
  register struct Library * const __FreeRouteInfo__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register struct rt_msghdr * __FreeRouteInfo_buf __asm("a0") = (_FreeRouteInfo_buf); \
  __asm volatile ("jsr a6@(-432:W)" \
  : \
  : "r"(__FreeRouteInfo__bn), "r"(__FreeRouteInfo_buf) \
  : "d0", "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
  } \
})

#define GetRouteInfo(address_family, flags) ({ \
  LONG _GetRouteInfo_address_family = (address_family); \
  LONG _GetRouteInfo_flags = (flags); \
  struct rt_msghdr * _GetRouteInfo__re = \
  ({ \
  register struct Library * const __GetRouteInfo__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register struct rt_msghdr * __GetRouteInfo__re __asm("d0"); \
  register LONG __GetRouteInfo_address_family __asm("d0") = (_GetRouteInfo_address_family); \
  register LONG __GetRouteInfo_flags __asm("d1") = (_GetRouteInfo_flags); \
  __asm volatile ("jsr a6@(-438:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__GetRouteInfo__re) \
  : "r"(__GetRouteInfo__bn), "r"(__GetRouteInfo_address_family), "r"(__GetRouteInfo_flags) \
  : "fp0", "fp1", "cc", "memory"); \
  __GetRouteInfo__re; \
  }); \
  _GetRouteInfo__re; \
})

#define AddInterfaceTagList(interface_name, device_name, unit, tags) ({ \
  STRPTR _AddInterfaceTagList_interface_name = (interface_name); \
  STRPTR _AddInterfaceTagList_device_name = (device_name); \
  LONG _AddInterfaceTagList_unit = (unit); \
  struct TagItem * _AddInterfaceTagList_tags = (tags); \
  LONG _AddInterfaceTagList__re = \
  ({ \
  register struct Library * const __AddInterfaceTagList__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __AddInterfaceTagList__re __asm("d0"); \
  register STRPTR __AddInterfaceTagList_interface_name __asm("a0") = (_AddInterfaceTagList_interface_name); \
  register STRPTR __AddInterfaceTagList_device_name __asm("a1") = (_AddInterfaceTagList_device_name); \
  register LONG __AddInterfaceTagList_unit __asm("d0") = (_AddInterfaceTagList_unit); \
  register struct TagItem * __AddInterfaceTagList_tags __asm("a2") = (_AddInterfaceTagList_tags); \
  __asm volatile ("jsr a6@(-444:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__AddInterfaceTagList__re) \
  : "r"(__AddInterfaceTagList__bn), "r"(__AddInterfaceTagList_interface_name), "r"(__AddInterfaceTagList_device_name), "r"(__AddInterfaceTagList_unit), "r"(__AddInterfaceTagList_tags) \
  : "fp0", "fp1", "cc", "memory"); \
  __AddInterfaceTagList__re; \
  }); \
  _AddInterfaceTagList__re; \
})

#ifndef NO_INLINE_VARARGS
#define AddInterfaceTags(interface_name, device_name, unit, ...) \
     ({_sfdc_vararg _args[] = { __VA_ARGS__ }; AddInterfaceTagList(interface_name, device_name, unit, (struct TagItem *) _args); })
#endif /* !NO_INLINE_VARARGS */

#define ConfigureInterfaceTagList(interface_name, tags) ({ \
  STRPTR _ConfigureInterfaceTagList_interface_name = (interface_name); \
  struct TagItem * _ConfigureInterfaceTagList_tags = (tags); \
  LONG _ConfigureInterfaceTagList__re = \
  ({ \
  register struct Library * const __ConfigureInterfaceTagList__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __ConfigureInterfaceTagList__re __asm("d0"); \
  register STRPTR __ConfigureInterfaceTagList_interface_name __asm("a0") = (_ConfigureInterfaceTagList_interface_name); \
  register struct TagItem * __ConfigureInterfaceTagList_tags __asm("a1") = (_ConfigureInterfaceTagList_tags); \
  __asm volatile ("jsr a6@(-450:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__ConfigureInterfaceTagList__re) \
  : "r"(__ConfigureInterfaceTagList__bn), "r"(__ConfigureInterfaceTagList_interface_name), "r"(__ConfigureInterfaceTagList_tags) \
  : "fp0", "fp1", "cc", "memory"); \
  __ConfigureInterfaceTagList__re; \
  }); \
  _ConfigureInterfaceTagList__re; \
})

#ifndef NO_INLINE_VARARGS
#define ConfigureInterfaceTags(interface_name,...) \
     ({_sfdc_vararg _args[] = { __VA_ARGS__ }; ConfigureInterfaceTagList(interface_name, (struct TagItem *) _args); })
#endif /* !NO_INLINE_VARARGS */

#define ReleaseInterfaceList(list) ({ \
  struct List * _ReleaseInterfaceList_list = (list); \
  { \
  register struct Library * const __ReleaseInterfaceList__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register struct List * __ReleaseInterfaceList_list __asm("a0") = (_ReleaseInterfaceList_list); \
  __asm volatile ("jsr a6@(-456:W)" \
  : \
  : "r"(__ReleaseInterfaceList__bn), "r"(__ReleaseInterfaceList_list) \
  : "d0", "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
  } \
})

#define ObtainInterfaceList() ({ \
  struct List * _ObtainInterfaceList__re = \
  ({ \
  register struct Library * const __ObtainInterfaceList__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register struct List * __ObtainInterfaceList__re __asm("d0"); \
  __asm volatile ("jsr a6@(-462:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__ObtainInterfaceList__re) \
  : "r"(__ObtainInterfaceList__bn) \
  : "fp0", "fp1", "cc", "memory"); \
  __ObtainInterfaceList__re; \
  }); \
  _ObtainInterfaceList__re; \
})

#define QueryInterfaceTagList(interface_name, tags) ({ \
  STRPTR _QueryInterfaceTagList_interface_name = (interface_name); \
  struct TagItem * _QueryInterfaceTagList_tags = (tags); \
  LONG _QueryInterfaceTagList__re = \
  ({ \
  register struct Library * const __QueryInterfaceTagList__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __QueryInterfaceTagList__re __asm("d0"); \
  register STRPTR __QueryInterfaceTagList_interface_name __asm("a0") = (_QueryInterfaceTagList_interface_name); \
  register struct TagItem * __QueryInterfaceTagList_tags __asm("a1") = (_QueryInterfaceTagList_tags); \
  __asm volatile ("jsr a6@(-468:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__QueryInterfaceTagList__re) \
  : "r"(__QueryInterfaceTagList__bn), "r"(__QueryInterfaceTagList_interface_name), "r"(__QueryInterfaceTagList_tags) \
  : "fp0", "fp1", "cc", "memory"); \
  __QueryInterfaceTagList__re; \
  }); \
  _QueryInterfaceTagList__re; \
})

#ifndef NO_INLINE_VARARGS
#define QueryInterfaceTags(interface_name,...) \
     ({_sfdc_vararg _args[] = { __VA_ARGS__ }; QueryInterfaceTagList(interface_name, (struct TagItem *) _args); })
#endif /* !NO_INLINE_VARARGS */

#define CreateAddrAllocMessageA(version, protocol, interface_name, result_ptr, tags) ({ \
  LONG _CreateAddrAllocMessageA_version = (version); \
  LONG _CreateAddrAllocMessageA_protocol = (protocol); \
  STRPTR _CreateAddrAllocMessageA_interface_name = (interface_name); \
  struct AddressAllocationMessage ** _CreateAddrAllocMessageA_result_ptr = (result_ptr); \
  struct TagItem * _CreateAddrAllocMessageA_tags = (tags); \
  LONG _CreateAddrAllocMessageA__re = \
  ({ \
  register struct Library * const __CreateAddrAllocMessageA__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __CreateAddrAllocMessageA__re __asm("d0"); \
  register LONG __CreateAddrAllocMessageA_version __asm("d0") = (_CreateAddrAllocMessageA_version); \
  register LONG __CreateAddrAllocMessageA_protocol __asm("d1") = (_CreateAddrAllocMessageA_protocol); \
  register STRPTR __CreateAddrAllocMessageA_interface_name __asm("a0") = (_CreateAddrAllocMessageA_interface_name); \
  register struct AddressAllocationMessage ** __CreateAddrAllocMessageA_result_ptr __asm("a1") = (_CreateAddrAllocMessageA_result_ptr); \
  register struct TagItem * __CreateAddrAllocMessageA_tags __asm("a2") = (_CreateAddrAllocMessageA_tags); \
  __asm volatile ("jsr a6@(-474:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__CreateAddrAllocMessageA__re) \
  : "r"(__CreateAddrAllocMessageA__bn), "r"(__CreateAddrAllocMessageA_version), "r"(__CreateAddrAllocMessageA_protocol), "r"(__CreateAddrAllocMessageA_interface_name), "r"(__CreateAddrAllocMessageA_result_ptr), "r"(__CreateAddrAllocMessageA_tags) \
  : "fp0", "fp1", "cc", "memory"); \
  __CreateAddrAllocMessageA__re; \
  }); \
  _CreateAddrAllocMessageA__re; \
})

#ifndef NO_INLINE_VARARGS
#define CreateAddrAllocMessage(version, protocol, interface_name, result_ptr, ...) \
     ({_sfdc_vararg _args[] = {__VA_ARGS__ }; CreateAddrAllocMessageA(version, protocol, interface_name, result_ptr, (struct TagItem *) _args); })
#endif /* !NO_INLINE_VARARGS */

#define DeleteAddrAllocMessage(aam) ({ \
  struct AddressAllocationMessage * _DeleteAddrAllocMessage_aam = (aam); \
  { \
  register struct Library * const __DeleteAddrAllocMessage__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register struct AddressAllocationMessage * __DeleteAddrAllocMessage_aam __asm("a0") = (_DeleteAddrAllocMessage_aam); \
  __asm volatile ("jsr a6@(-480:W)" \
  : \
  : "r"(__DeleteAddrAllocMessage__bn), "r"(__DeleteAddrAllocMessage_aam) \
  : "d0", "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
  } \
})

#define BeginInterfaceConfig(message) ({ \
  struct AddressAllocationMessage * _BeginInterfaceConfig_message = (message); \
  { \
  register struct Library * const __BeginInterfaceConfig__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register struct AddressAllocationMessage * __BeginInterfaceConfig_message __asm("a0") = (_BeginInterfaceConfig_message); \
  __asm volatile ("jsr a6@(-486:W)" \
  : \
  : "r"(__BeginInterfaceConfig__bn), "r"(__BeginInterfaceConfig_message) \
  : "d0", "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
  } \
})

#define AbortInterfaceConfig(message) ({ \
  struct AddressAllocationMessage * _AbortInterfaceConfig_message = (message); \
  { \
  register struct Library * const __AbortInterfaceConfig__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register struct AddressAllocationMessage * __AbortInterfaceConfig_message __asm("a0") = (_AbortInterfaceConfig_message); \
  __asm volatile ("jsr a6@(-492:W)" \
  : \
  : "r"(__AbortInterfaceConfig__bn), "r"(__AbortInterfaceConfig_message) \
  : "d0", "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
  } \
})

#define AddNetMonitorHookTagList(type, hook, tags) ({ \
  LONG _AddNetMonitorHookTagList_type = (type); \
  struct Hook * _AddNetMonitorHookTagList_hook = (hook); \
  struct TagItem * _AddNetMonitorHookTagList_tags = (tags); \
  LONG _AddNetMonitorHookTagList__re = \
  ({ \
  register struct Library * const __AddNetMonitorHookTagList__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __AddNetMonitorHookTagList__re __asm("d0"); \
  register LONG __AddNetMonitorHookTagList_type __asm("d0") = (_AddNetMonitorHookTagList_type); \
  register struct Hook * __AddNetMonitorHookTagList_hook __asm("a0") = (_AddNetMonitorHookTagList_hook); \
  register struct TagItem * __AddNetMonitorHookTagList_tags __asm("a1") = (_AddNetMonitorHookTagList_tags); \
  __asm volatile ("jsr a6@(-498:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__AddNetMonitorHookTagList__re) \
  : "r"(__AddNetMonitorHookTagList__bn), "r"(__AddNetMonitorHookTagList_type), "r"(__AddNetMonitorHookTagList_hook), "r"(__AddNetMonitorHookTagList_tags) \
  : "fp0", "fp1", "cc", "memory"); \
  __AddNetMonitorHookTagList__re; \
  }); \
  _AddNetMonitorHookTagList__re; \
})

#ifndef NO_INLINE_VARARGS
#define AddNetMonitorHookTags(type, hook,...) \
     ({_sfdc_vararg _args[] = { __VA_ARGS__ }; AddNetMonitorHookTagList(type, hook, (struct TagItem *) _args); })
#endif /* !NO_INLINE_VARARGS */

#define RemoveNetMonitorHook(hook) ({ \
  struct Hook * _RemoveNetMonitorHook_hook = (hook); \
  { \
  register struct Library * const __RemoveNetMonitorHook__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register struct Hook * __RemoveNetMonitorHook_hook __asm("a0") = (_RemoveNetMonitorHook_hook); \
  __asm volatile ("jsr a6@(-504:W)" \
  : \
  : "r"(__RemoveNetMonitorHook__bn), "r"(__RemoveNetMonitorHook_hook) \
  : "d0", "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
  } \
})

#define GetNetworkStatistics(type, version, destination, size) ({ \
  LONG _GetNetworkStatistics_type = (type); \
  LONG _GetNetworkStatistics_version = (version); \
  APTR _GetNetworkStatistics_destination = (destination); \
  LONG _GetNetworkStatistics_size = (size); \
  LONG _GetNetworkStatistics__re = \
  ({ \
  register struct Library * const __GetNetworkStatistics__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __GetNetworkStatistics__re __asm("d0"); \
  register LONG __GetNetworkStatistics_type __asm("d0") = (_GetNetworkStatistics_type); \
  register LONG __GetNetworkStatistics_version __asm("d1") = (_GetNetworkStatistics_version); \
  register APTR __GetNetworkStatistics_destination __asm("a0") = (_GetNetworkStatistics_destination); \
  register LONG __GetNetworkStatistics_size __asm("d2") = (_GetNetworkStatistics_size); \
  __asm volatile ("jsr a6@(-510:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__GetNetworkStatistics__re) \
  : "r"(__GetNetworkStatistics__bn), "r"(__GetNetworkStatistics_type), "r"(__GetNetworkStatistics_version), "r"(__GetNetworkStatistics_destination), "r"(__GetNetworkStatistics_size) \
  : "fp0", "fp1", "cc", "memory"); \
  __GetNetworkStatistics__re; \
  }); \
  _GetNetworkStatistics__re; \
})

#define AddDomainNameServer(address) ({ \
  STRPTR _AddDomainNameServer_address = (address); \
  LONG _AddDomainNameServer__re = \
  ({ \
  register struct Library * const __AddDomainNameServer__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __AddDomainNameServer__re __asm("d0"); \
  register STRPTR __AddDomainNameServer_address __asm("a0") = (_AddDomainNameServer_address); \
  __asm volatile ("jsr a6@(-516:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__AddDomainNameServer__re) \
  : "r"(__AddDomainNameServer__bn), "r"(__AddDomainNameServer_address) \
  : "fp0", "fp1", "cc", "memory"); \
  __AddDomainNameServer__re; \
  }); \
  _AddDomainNameServer__re; \
})

#define RemoveDomainNameServer(address) ({ \
  STRPTR _RemoveDomainNameServer_address = (address); \
  LONG _RemoveDomainNameServer__re = \
  ({ \
  register struct Library * const __RemoveDomainNameServer__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __RemoveDomainNameServer__re __asm("d0"); \
  register STRPTR __RemoveDomainNameServer_address __asm("a0") = (_RemoveDomainNameServer_address); \
  __asm volatile ("jsr a6@(-522:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__RemoveDomainNameServer__re) \
  : "r"(__RemoveDomainNameServer__bn), "r"(__RemoveDomainNameServer_address) \
  : "fp0", "fp1", "cc", "memory"); \
  __RemoveDomainNameServer__re; \
  }); \
  _RemoveDomainNameServer__re; \
})

#define ReleaseDomainNameServerList(list) ({ \
  struct List * _ReleaseDomainNameServerList_list = (list); \
  { \
  register struct Library * const __ReleaseDomainNameServerList__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register struct List * __ReleaseDomainNameServerList_list __asm("a0") = (_ReleaseDomainNameServerList_list); \
  __asm volatile ("jsr a6@(-528:W)" \
  : \
  : "r"(__ReleaseDomainNameServerList__bn), "r"(__ReleaseDomainNameServerList_list) \
  : "d0", "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
  } \
})

#define ObtainDomainNameServerList() ({ \
  struct List * _ObtainDomainNameServerList__re = \
  ({ \
  register struct Library * const __ObtainDomainNameServerList__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register struct List * __ObtainDomainNameServerList__re __asm("d0"); \
  __asm volatile ("jsr a6@(-534:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__ObtainDomainNameServerList__re) \
  : "r"(__ObtainDomainNameServerList__bn) \
  : "fp0", "fp1", "cc", "memory"); \
  __ObtainDomainNameServerList__re; \
  }); \
  _ObtainDomainNameServerList__re; \
})

#define setnetent(stay_open) ({ \
  LONG _setnetent_stay_open = (stay_open); \
  { \
  register struct Library * const __setnetent__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __setnetent_stay_open __asm("d0") = (_setnetent_stay_open); \
  __asm volatile ("jsr a6@(-540:W)" \
  : \
  : "r"(__setnetent__bn), "r"(__setnetent_stay_open) \
  : "d0", "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
  } \
})

#define endnetent() ({ \
  register struct Library * const __endnetent__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  __asm volatile ("jsr a6@(-546:W)" \
  : \
  : "r"(__endnetent__bn) \
  : "d0", "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
})

#define getnetent() ({ \
  struct netent * _getnetent__re = \
  ({ \
  register struct Library * const __getnetent__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register struct netent * __getnetent__re __asm("d0"); \
  __asm volatile ("jsr a6@(-552:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__getnetent__re) \
  : "r"(__getnetent__bn) \
  : "fp0", "fp1", "cc", "memory"); \
  __getnetent__re; \
  }); \
  _getnetent__re; \
})

#define setprotoent(stay_open) ({ \
  LONG _setprotoent_stay_open = (stay_open); \
  { \
  register struct Library * const __setprotoent__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __setprotoent_stay_open __asm("d0") = (_setprotoent_stay_open); \
  __asm volatile ("jsr a6@(-558:W)" \
  : \
  : "r"(__setprotoent__bn), "r"(__setprotoent_stay_open) \
  : "d0", "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
  } \
})

#define endprotoent() ({ \
  register struct Library * const __endprotoent__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  __asm volatile ("jsr a6@(-564:W)" \
  : \
  : "r"(__endprotoent__bn) \
  : "d0", "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
})

#define getprotoent() ({ \
  struct protoent * _getprotoent__re = \
  ({ \
  register struct Library * const __getprotoent__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register struct protoent * __getprotoent__re __asm("d0"); \
  __asm volatile ("jsr a6@(-570:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__getprotoent__re) \
  : "r"(__getprotoent__bn) \
  : "fp0", "fp1", "cc", "memory"); \
  __getprotoent__re; \
  }); \
  _getprotoent__re; \
})

#define setservent(stay_open) ({ \
  LONG _setservent_stay_open = (stay_open); \
  { \
  register struct Library * const __setservent__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __setservent_stay_open __asm("d0") = (_setservent_stay_open); \
  __asm volatile ("jsr a6@(-576:W)" \
  : \
  : "r"(__setservent__bn), "r"(__setservent_stay_open) \
  : "d0", "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
  } \
})

#define endservent() ({ \
  register struct Library * const __endservent__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  __asm volatile ("jsr a6@(-582:W)" \
  : \
  : "r"(__endservent__bn) \
  : "d0", "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
})

#define getservent() ({ \
  struct servent * _getservent__re = \
  ({ \
  register struct Library * const __getservent__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register struct servent * __getservent__re __asm("d0"); \
  __asm volatile ("jsr a6@(-588:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__getservent__re) \
  : "r"(__getservent__bn) \
  : "fp0", "fp1", "cc", "memory"); \
  __getservent__re; \
  }); \
  _getservent__re; \
})

#define inet_aton(cp, addr) ({ \
  STRPTR _inet_aton_cp = (cp); \
  struct in_addr * _inet_aton_addr = (addr); \
  LONG _inet_aton__re = \
  ({ \
  register struct Library * const __inet_aton__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __inet_aton__re __asm("d0"); \
  register STRPTR __inet_aton_cp __asm("a0") = (_inet_aton_cp); \
  register struct in_addr * __inet_aton_addr __asm("a1") = (_inet_aton_addr); \
  __asm volatile ("jsr a6@(-594:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__inet_aton__re) \
  : "r"(__inet_aton__bn), "r"(__inet_aton_cp), "r"(__inet_aton_addr) \
  : "fp0", "fp1", "cc", "memory"); \
  __inet_aton__re; \
  }); \
  _inet_aton__re; \
})

#define inet_ntop(af, src, dst, size) ({ \
  LONG _inet_ntop_af = (af); \
  APTR _inet_ntop_src = (src); \
  STRPTR _inet_ntop_dst = (dst); \
  LONG _inet_ntop_size = (size); \
  STRPTR _inet_ntop__re = \
  ({ \
  register struct Library * const __inet_ntop__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register STRPTR __inet_ntop__re __asm("d0"); \
  register LONG __inet_ntop_af __asm("d0") = (_inet_ntop_af); \
  register APTR __inet_ntop_src __asm("a0") = (_inet_ntop_src); \
  register STRPTR __inet_ntop_dst __asm("a1") = (_inet_ntop_dst); \
  register LONG __inet_ntop_size __asm("d1") = (_inet_ntop_size); \
  __asm volatile ("jsr a6@(-600:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__inet_ntop__re) \
  : "r"(__inet_ntop__bn), "r"(__inet_ntop_af), "r"(__inet_ntop_src), "r"(__inet_ntop_dst), "r"(__inet_ntop_size) \
  : "fp0", "fp1", "cc", "memory"); \
  __inet_ntop__re; \
  }); \
  _inet_ntop__re; \
})

#define inet_pton(af, src, dst) ({ \
  LONG _inet_pton_af = (af); \
  STRPTR _inet_pton_src = (src); \
  APTR _inet_pton_dst = (dst); \
  LONG _inet_pton__re = \
  ({ \
  register struct Library * const __inet_pton__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __inet_pton__re __asm("d0"); \
  register LONG __inet_pton_af __asm("d0") = (_inet_pton_af); \
  register STRPTR __inet_pton_src __asm("a0") = (_inet_pton_src); \
  register APTR __inet_pton_dst __asm("a1") = (_inet_pton_dst); \
  __asm volatile ("jsr a6@(-606:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__inet_pton__re) \
  : "r"(__inet_pton__bn), "r"(__inet_pton_af), "r"(__inet_pton_src), "r"(__inet_pton_dst) \
  : "fp0", "fp1", "cc", "memory"); \
  __inet_pton__re; \
  }); \
  _inet_pton__re; \
})

#define In_LocalAddr(address) ({ \
  LONG _In_LocalAddr_address = (address); \
  LONG _In_LocalAddr__re = \
  ({ \
  register struct Library * const __In_LocalAddr__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __In_LocalAddr__re __asm("d0"); \
  register LONG __In_LocalAddr_address __asm("d0") = (_In_LocalAddr_address); \
  __asm volatile ("jsr a6@(-612:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__In_LocalAddr__re) \
  : "r"(__In_LocalAddr__bn), "r"(__In_LocalAddr_address) \
  : "fp0", "fp1", "cc", "memory"); \
  __In_LocalAddr__re; \
  }); \
  _In_LocalAddr__re; \
})

#define In_CanForward(address) ({ \
  LONG _In_CanForward_address = (address); \
  LONG _In_CanForward__re = \
  ({ \
  register struct Library * const __In_CanForward__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __In_CanForward__re __asm("d0"); \
  register LONG __In_CanForward_address __asm("d0") = (_In_CanForward_address); \
  __asm volatile ("jsr a6@(-618:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__In_CanForward__re) \
  : "r"(__In_CanForward__bn), "r"(__In_CanForward_address) \
  : "fp0", "fp1", "cc", "memory"); \
  __In_CanForward__re; \
  }); \
  _In_CanForward__re; \
})

#define mbuf_copym(m, off, len) ({ \
  struct mbuf * _mbuf_copym_m = (m); \
  LONG _mbuf_copym_off = (off); \
  LONG _mbuf_copym_len = (len); \
  struct mbuf * _mbuf_copym__re = \
  ({ \
  register struct Library * const __mbuf_copym__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register struct mbuf * __mbuf_copym__re __asm("d0"); \
  register struct mbuf * __mbuf_copym_m __asm("a0") = (_mbuf_copym_m); \
  register LONG __mbuf_copym_off __asm("d0") = (_mbuf_copym_off); \
  register LONG __mbuf_copym_len __asm("d1") = (_mbuf_copym_len); \
  __asm volatile ("jsr a6@(-624:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__mbuf_copym__re) \
  : "r"(__mbuf_copym__bn), "r"(__mbuf_copym_m), "r"(__mbuf_copym_off), "r"(__mbuf_copym_len) \
  : "fp0", "fp1", "cc", "memory"); \
  __mbuf_copym__re; \
  }); \
  _mbuf_copym__re; \
})

#define mbuf_copyback(m, off, len, cp) ({ \
  struct mbuf * _mbuf_copyback_m = (m); \
  LONG _mbuf_copyback_off = (off); \
  LONG _mbuf_copyback_len = (len); \
  APTR _mbuf_copyback_cp = (cp); \
  LONG _mbuf_copyback__re = \
  ({ \
  register struct Library * const __mbuf_copyback__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __mbuf_copyback__re __asm("d0"); \
  register struct mbuf * __mbuf_copyback_m __asm("a0") = (_mbuf_copyback_m); \
  register LONG __mbuf_copyback_off __asm("d0") = (_mbuf_copyback_off); \
  register LONG __mbuf_copyback_len __asm("d1") = (_mbuf_copyback_len); \
  register APTR __mbuf_copyback_cp __asm("a1") = (_mbuf_copyback_cp); \
  __asm volatile ("jsr a6@(-630:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__mbuf_copyback__re) \
  : "r"(__mbuf_copyback__bn), "r"(__mbuf_copyback_m), "r"(__mbuf_copyback_off), "r"(__mbuf_copyback_len), "r"(__mbuf_copyback_cp) \
  : "fp0", "fp1", "cc", "memory"); \
  __mbuf_copyback__re; \
  }); \
  _mbuf_copyback__re; \
})

#define mbuf_copydata(m, off, len, cp) ({ \
  struct mbuf * _mbuf_copydata_m = (m); \
  LONG _mbuf_copydata_off = (off); \
  LONG _mbuf_copydata_len = (len); \
  APTR _mbuf_copydata_cp = (cp); \
  LONG _mbuf_copydata__re = \
  ({ \
  register struct Library * const __mbuf_copydata__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __mbuf_copydata__re __asm("d0"); \
  register struct mbuf * __mbuf_copydata_m __asm("a0") = (_mbuf_copydata_m); \
  register LONG __mbuf_copydata_off __asm("d0") = (_mbuf_copydata_off); \
  register LONG __mbuf_copydata_len __asm("d1") = (_mbuf_copydata_len); \
  register APTR __mbuf_copydata_cp __asm("a1") = (_mbuf_copydata_cp); \
  __asm volatile ("jsr a6@(-636:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__mbuf_copydata__re) \
  : "r"(__mbuf_copydata__bn), "r"(__mbuf_copydata_m), "r"(__mbuf_copydata_off), "r"(__mbuf_copydata_len), "r"(__mbuf_copydata_cp) \
  : "fp0", "fp1", "cc", "memory"); \
  __mbuf_copydata__re; \
  }); \
  _mbuf_copydata__re; \
})

#define mbuf_free(m) ({ \
  struct mbuf * _mbuf_free_m = (m); \
  struct mbuf * _mbuf_free__re = \
  ({ \
  register struct Library * const __mbuf_free__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register struct mbuf * __mbuf_free__re __asm("d0"); \
  register struct mbuf * __mbuf_free_m __asm("a0") = (_mbuf_free_m); \
  __asm volatile ("jsr a6@(-642:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__mbuf_free__re) \
  : "r"(__mbuf_free__bn), "r"(__mbuf_free_m) \
  : "fp0", "fp1", "cc", "memory"); \
  __mbuf_free__re; \
  }); \
  _mbuf_free__re; \
})

#define mbuf_freem(m) ({ \
  struct mbuf * _mbuf_freem_m = (m); \
  { \
  register struct Library * const __mbuf_freem__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register struct mbuf * __mbuf_freem_m __asm("a0") = (_mbuf_freem_m); \
  __asm volatile ("jsr a6@(-648:W)" \
  : \
  : "r"(__mbuf_freem__bn), "r"(__mbuf_freem_m) \
  : "d0", "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
  } \
})

#define mbuf_get() ({ \
  struct mbuf * _mbuf_get__re = \
  ({ \
  register struct Library * const __mbuf_get__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register struct mbuf * __mbuf_get__re __asm("d0"); \
  __asm volatile ("jsr a6@(-654:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__mbuf_get__re) \
  : "r"(__mbuf_get__bn) \
  : "fp0", "fp1", "cc", "memory"); \
  __mbuf_get__re; \
  }); \
  _mbuf_get__re; \
})

#define mbuf_gethdr() ({ \
  struct mbuf * _mbuf_gethdr__re = \
  ({ \
  register struct Library * const __mbuf_gethdr__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register struct mbuf * __mbuf_gethdr__re __asm("d0"); \
  __asm volatile ("jsr a6@(-660:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__mbuf_gethdr__re) \
  : "r"(__mbuf_gethdr__bn) \
  : "fp0", "fp1", "cc", "memory"); \
  __mbuf_gethdr__re; \
  }); \
  _mbuf_gethdr__re; \
})

#define mbuf_prepend(m, len) ({ \
  struct mbuf * _mbuf_prepend_m = (m); \
  LONG _mbuf_prepend_len = (len); \
  struct mbuf * _mbuf_prepend__re = \
  ({ \
  register struct Library * const __mbuf_prepend__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register struct mbuf * __mbuf_prepend__re __asm("d0"); \
  register struct mbuf * __mbuf_prepend_m __asm("a0") = (_mbuf_prepend_m); \
  register LONG __mbuf_prepend_len __asm("d0") = (_mbuf_prepend_len); \
  __asm volatile ("jsr a6@(-666:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__mbuf_prepend__re) \
  : "r"(__mbuf_prepend__bn), "r"(__mbuf_prepend_m), "r"(__mbuf_prepend_len) \
  : "fp0", "fp1", "cc", "memory"); \
  __mbuf_prepend__re; \
  }); \
  _mbuf_prepend__re; \
})

#define mbuf_cat(m, n) ({ \
  struct mbuf * _mbuf_cat_m = (m); \
  struct mbuf * _mbuf_cat_n = (n); \
  LONG _mbuf_cat__re = \
  ({ \
  register struct Library * const __mbuf_cat__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __mbuf_cat__re __asm("d0"); \
  register struct mbuf * __mbuf_cat_m __asm("a0") = (_mbuf_cat_m); \
  register struct mbuf * __mbuf_cat_n __asm("a1") = (_mbuf_cat_n); \
  __asm volatile ("jsr a6@(-672:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__mbuf_cat__re) \
  : "r"(__mbuf_cat__bn), "r"(__mbuf_cat_m), "r"(__mbuf_cat_n) \
  : "fp0", "fp1", "cc", "memory"); \
  __mbuf_cat__re; \
  }); \
  _mbuf_cat__re; \
})

#define mbuf_adj(mp, req_len) ({ \
  struct mbuf * _mbuf_adj_mp = (mp); \
  LONG _mbuf_adj_req_len = (req_len); \
  LONG _mbuf_adj__re = \
  ({ \
  register struct Library * const __mbuf_adj__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __mbuf_adj__re __asm("d0"); \
  register struct mbuf * __mbuf_adj_mp __asm("a0") = (_mbuf_adj_mp); \
  register LONG __mbuf_adj_req_len __asm("d0") = (_mbuf_adj_req_len); \
  __asm volatile ("jsr a6@(-678:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__mbuf_adj__re) \
  : "r"(__mbuf_adj__bn), "r"(__mbuf_adj_mp), "r"(__mbuf_adj_req_len) \
  : "fp0", "fp1", "cc", "memory"); \
  __mbuf_adj__re; \
  }); \
  _mbuf_adj__re; \
})

#define mbuf_pullup(m, len) ({ \
  struct mbuf * _mbuf_pullup_m = (m); \
  LONG _mbuf_pullup_len = (len); \
  struct mbuf * _mbuf_pullup__re = \
  ({ \
  register struct Library * const __mbuf_pullup__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register struct mbuf * __mbuf_pullup__re __asm("d0"); \
  register struct mbuf * __mbuf_pullup_m __asm("a0") = (_mbuf_pullup_m); \
  register LONG __mbuf_pullup_len __asm("d0") = (_mbuf_pullup_len); \
  __asm volatile ("jsr a6@(-684:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__mbuf_pullup__re) \
  : "r"(__mbuf_pullup__bn), "r"(__mbuf_pullup_m), "r"(__mbuf_pullup_len) \
  : "fp0", "fp1", "cc", "memory"); \
  __mbuf_pullup__re; \
  }); \
  _mbuf_pullup__re; \
})

#define ProcessIsServer(pr) ({ \
  struct Process * _ProcessIsServer_pr = (pr); \
  BOOL _ProcessIsServer__re = \
  ({ \
  register struct Library * const __ProcessIsServer__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register BOOL __ProcessIsServer__re __asm("d0"); \
  register struct Process * __ProcessIsServer_pr __asm("a0") = (_ProcessIsServer_pr); \
  __asm volatile ("jsr a6@(-690:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__ProcessIsServer__re) \
  : "r"(__ProcessIsServer__bn), "r"(__ProcessIsServer_pr) \
  : "fp0", "fp1", "cc", "memory"); \
  __ProcessIsServer__re; \
  }); \
  _ProcessIsServer__re; \
})

#define ObtainServerSocket() ({ \
  LONG _ObtainServerSocket__re = \
  ({ \
  register struct Library * const __ObtainServerSocket__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __ObtainServerSocket__re __asm("d0"); \
  __asm volatile ("jsr a6@(-696:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__ObtainServerSocket__re) \
  : "r"(__ObtainServerSocket__bn) \
  : "fp0", "fp1", "cc", "memory"); \
  __ObtainServerSocket__re; \
  }); \
  _ObtainServerSocket__re; \
})

#define GetDefaultDomainName(buffer, buffer_size) ({ \
  STRPTR _GetDefaultDomainName_buffer = (buffer); \
  LONG _GetDefaultDomainName_buffer_size = (buffer_size); \
  BOOL _GetDefaultDomainName__re = \
  ({ \
  register struct Library * const __GetDefaultDomainName__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register BOOL __GetDefaultDomainName__re __asm("d0"); \
  register STRPTR __GetDefaultDomainName_buffer __asm("a0") = (_GetDefaultDomainName_buffer); \
  register LONG __GetDefaultDomainName_buffer_size __asm("d0") = (_GetDefaultDomainName_buffer_size); \
  __asm volatile ("jsr a6@(-702:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__GetDefaultDomainName__re) \
  : "r"(__GetDefaultDomainName__bn), "r"(__GetDefaultDomainName_buffer), "r"(__GetDefaultDomainName_buffer_size) \
  : "fp0", "fp1", "cc", "memory"); \
  __GetDefaultDomainName__re; \
  }); \
  _GetDefaultDomainName__re; \
})

#define SetDefaultDomainName(buffer) ({ \
  STRPTR _SetDefaultDomainName_buffer = (buffer); \
  { \
  register struct Library * const __SetDefaultDomainName__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register STRPTR __SetDefaultDomainName_buffer __asm("a0") = (_SetDefaultDomainName_buffer); \
  __asm volatile ("jsr a6@(-708:W)" \
  : \
  : "r"(__SetDefaultDomainName__bn), "r"(__SetDefaultDomainName_buffer) \
  : "d0", "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
  } \
})

#define ObtainRoadshowData(access) ({ \
  LONG _ObtainRoadshowData_access = (access); \
  struct List * _ObtainRoadshowData__re = \
  ({ \
  register struct Library * const __ObtainRoadshowData__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register struct List * __ObtainRoadshowData__re __asm("d0"); \
  register LONG __ObtainRoadshowData_access __asm("d0") = (_ObtainRoadshowData_access); \
  __asm volatile ("jsr a6@(-714:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__ObtainRoadshowData__re) \
  : "r"(__ObtainRoadshowData__bn), "r"(__ObtainRoadshowData_access) \
  : "fp0", "fp1", "cc", "memory"); \
  __ObtainRoadshowData__re; \
  }); \
  _ObtainRoadshowData__re; \
})

#define ReleaseRoadshowData(list) ({ \
  struct List * _ReleaseRoadshowData_list = (list); \
  { \
  register struct Library * const __ReleaseRoadshowData__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register struct List * __ReleaseRoadshowData_list __asm("a0") = (_ReleaseRoadshowData_list); \
  __asm volatile ("jsr a6@(-720:W)" \
  : \
  : "r"(__ReleaseRoadshowData__bn), "r"(__ReleaseRoadshowData_list) \
  : "d0", "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
  } \
})

#define ChangeRoadshowData(list, name, length, data) ({ \
  struct List * _ChangeRoadshowData_list = (list); \
  STRPTR _ChangeRoadshowData_name = (name); \
  ULONG _ChangeRoadshowData_length = (length); \
  APTR _ChangeRoadshowData_data = (data); \
  BOOL _ChangeRoadshowData__re = \
  ({ \
  register struct Library * const __ChangeRoadshowData__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register BOOL __ChangeRoadshowData__re __asm("d0"); \
  register struct List * __ChangeRoadshowData_list __asm("a0") = (_ChangeRoadshowData_list); \
  register STRPTR __ChangeRoadshowData_name __asm("a1") = (_ChangeRoadshowData_name); \
  register ULONG __ChangeRoadshowData_length __asm("d0") = (_ChangeRoadshowData_length); \
  register APTR __ChangeRoadshowData_data __asm("a2") = (_ChangeRoadshowData_data); \
  __asm volatile ("jsr a6@(-726:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__ChangeRoadshowData__re) \
  : "r"(__ChangeRoadshowData__bn), "r"(__ChangeRoadshowData_list), "r"(__ChangeRoadshowData_name), "r"(__ChangeRoadshowData_length), "r"(__ChangeRoadshowData_data) \
  : "fp0", "fp1", "cc", "memory"); \
  __ChangeRoadshowData__re; \
  }); \
  _ChangeRoadshowData__re; \
})

#define RemoveInterface(interface_name, force) ({ \
  STRPTR _RemoveInterface_interface_name = (interface_name); \
  LONG _RemoveInterface_force = (force); \
  LONG _RemoveInterface__re = \
  ({ \
  register struct Library * const __RemoveInterface__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __RemoveInterface__re __asm("d0"); \
  register STRPTR __RemoveInterface_interface_name __asm("a0") = (_RemoveInterface_interface_name); \
  register LONG __RemoveInterface_force __asm("d0") = (_RemoveInterface_force); \
  __asm volatile ("jsr a6@(-732:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__RemoveInterface__re) \
  : "r"(__RemoveInterface__bn), "r"(__RemoveInterface_interface_name), "r"(__RemoveInterface_force) \
  : "fp0", "fp1", "cc", "memory"); \
  __RemoveInterface__re; \
  }); \
  _RemoveInterface__re; \
})

#define gethostbyname_r(name, hp, buf, buflen, he) ({ \
  STRPTR _gethostbyname_r_name = (name); \
  struct hostent * _gethostbyname_r_hp = (hp); \
  APTR _gethostbyname_r_buf = (buf); \
  ULONG _gethostbyname_r_buflen = (buflen); \
  LONG * _gethostbyname_r_he = (he); \
  struct hostent * _gethostbyname_r__re = \
  ({ \
  register struct Library * const __gethostbyname_r__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register struct hostent * __gethostbyname_r__re __asm("d0"); \
  register STRPTR __gethostbyname_r_name __asm("a0") = (_gethostbyname_r_name); \
  register struct hostent * __gethostbyname_r_hp __asm("a1") = (_gethostbyname_r_hp); \
  register APTR __gethostbyname_r_buf __asm("a2") = (_gethostbyname_r_buf); \
  register ULONG __gethostbyname_r_buflen __asm("d0") = (_gethostbyname_r_buflen); \
  register LONG * __gethostbyname_r_he __asm("a3") = (_gethostbyname_r_he); \
  __asm volatile ("jsr a6@(-738:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__gethostbyname_r__re) \
  : "r"(__gethostbyname_r__bn), "r"(__gethostbyname_r_name), "r"(__gethostbyname_r_hp), "r"(__gethostbyname_r_buf), "r"(__gethostbyname_r_buflen), "r"(__gethostbyname_r_he) \
  : "fp0", "fp1", "cc", "memory"); \
  __gethostbyname_r__re; \
  }); \
  _gethostbyname_r__re; \
})

#define gethostbyaddr_r(addr, len, type, hp, buf, buflen, he) ({ \
  STRPTR _gethostbyaddr_r_addr = (addr); \
  LONG _gethostbyaddr_r_len = (len); \
  LONG _gethostbyaddr_r_type = (type); \
  struct hostent * _gethostbyaddr_r_hp = (hp); \
  APTR _gethostbyaddr_r_buf = (buf); \
  ULONG _gethostbyaddr_r_buflen = (buflen); \
  LONG * _gethostbyaddr_r_he = (he); \
  struct hostent * _gethostbyaddr_r__re = \
  ({ \
  register struct Library * const __gethostbyaddr_r__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register struct hostent * __gethostbyaddr_r__re __asm("d0"); \
  register STRPTR __gethostbyaddr_r_addr __asm("a0") = (_gethostbyaddr_r_addr); \
  register LONG __gethostbyaddr_r_len __asm("d0") = (_gethostbyaddr_r_len); \
  register LONG __gethostbyaddr_r_type __asm("d1") = (_gethostbyaddr_r_type); \
  register struct hostent * __gethostbyaddr_r_hp __asm("a1") = (_gethostbyaddr_r_hp); \
  register APTR __gethostbyaddr_r_buf __asm("a2") = (_gethostbyaddr_r_buf); \
  register ULONG __gethostbyaddr_r_buflen __asm("d2") = (_gethostbyaddr_r_buflen); \
  register LONG * __gethostbyaddr_r_he __asm("a3") = (_gethostbyaddr_r_he); \
  __asm volatile ("jsr a6@(-744:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__gethostbyaddr_r__re) \
  : "r"(__gethostbyaddr_r__bn), "r"(__gethostbyaddr_r_addr), "r"(__gethostbyaddr_r_len), "r"(__gethostbyaddr_r_type), "r"(__gethostbyaddr_r_hp), "r"(__gethostbyaddr_r_buf), "r"(__gethostbyaddr_r_buflen), "r"(__gethostbyaddr_r_he) \
  : "fp0", "fp1", "cc", "memory"); \
  __gethostbyaddr_r__re; \
  }); \
  _gethostbyaddr_r__re; \
})

#define freeaddrinfo(ai) ({ \
  struct addrinfo * _freeaddrinfo_ai = (ai); \
  { \
  register struct Library * const __freeaddrinfo__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register struct addrinfo * __freeaddrinfo_ai __asm("a0") = (_freeaddrinfo_ai); \
  __asm volatile ("jsr a6@(-804:W)" \
  : \
  : "r"(__freeaddrinfo__bn), "r"(__freeaddrinfo_ai) \
  : "d0", "d1", "a0", "a1", "fp0", "fp1", "cc", "memory"); \
  } \
})

#define getaddrinfo(hostname, servname, hints, res) ({ \
  CONST_STRPTR _getaddrinfo_hostname = (hostname); \
  CONST_STRPTR _getaddrinfo_servname = (servname); \
  const struct addrinfo * _getaddrinfo_hints = (hints); \
  struct addrinfo ** _getaddrinfo_res = (res); \
  LONG _getaddrinfo__re = \
  ({ \
  register struct Library * const __getaddrinfo__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __getaddrinfo__re __asm("d0"); \
  register CONST_STRPTR __getaddrinfo_hostname __asm("a0") = (_getaddrinfo_hostname); \
  register CONST_STRPTR __getaddrinfo_servname __asm("a1") = (_getaddrinfo_servname); \
  register const struct addrinfo * __getaddrinfo_hints __asm("a2") = (_getaddrinfo_hints); \
  register struct addrinfo ** __getaddrinfo_res __asm("a3") = (_getaddrinfo_res); \
  __asm volatile ("jsr a6@(-810:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__getaddrinfo__re) \
  : "r"(__getaddrinfo__bn), "r"(__getaddrinfo_hostname), "r"(__getaddrinfo_servname), "r"(__getaddrinfo_hints), "r"(__getaddrinfo_res) \
  : "fp0", "fp1", "cc", "memory"); \
  __getaddrinfo__re; \
  }); \
  _getaddrinfo__re; \
})

#define gai_strerror(errnum) ({ \
  LONG _gai_strerror_errnum = (errnum); \
  STRPTR _gai_strerror__re = \
  ({ \
  register struct Library * const __gai_strerror__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register STRPTR __gai_strerror__re __asm("d0"); \
  register LONG __gai_strerror_errnum __asm("a0") = (_gai_strerror_errnum); \
  __asm volatile ("jsr a6@(-816:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__gai_strerror__re) \
  : "r"(__gai_strerror__bn), "r"(__gai_strerror_errnum) \
  : "fp0", "fp1", "cc", "memory"); \
  __gai_strerror__re; \
  }); \
  _gai_strerror__re; \
})

#define getnameinfo(sa, salen, host, hostlen, serv, servlen, flags) ({ \
  const struct sockaddr * _getnameinfo_sa = (sa); \
  ULONG _getnameinfo_salen = (salen); \
  STRPTR _getnameinfo_host = (host); \
  ULONG _getnameinfo_hostlen = (hostlen); \
  STRPTR _getnameinfo_serv = (serv); \
  ULONG _getnameinfo_servlen = (servlen); \
  ULONG _getnameinfo_flags = (flags); \
  LONG _getnameinfo__re = \
  ({ \
  register struct Library * const __getnameinfo__bn __asm("a6") = (struct Library *) (BSDSOCKET_BASE_NAME); register int _d1 __asm("d1"); register int _a0 __asm("a0"); register int _a1 __asm("a1");\
  register LONG __getnameinfo__re __asm("d0"); \
  register const struct sockaddr * __getnameinfo_sa __asm("a0") = (_getnameinfo_sa); \
  register ULONG __getnameinfo_salen __asm("d0") = (_getnameinfo_salen); \
  register STRPTR __getnameinfo_host __asm("a1") = (_getnameinfo_host); \
  register ULONG __getnameinfo_hostlen __asm("d1") = (_getnameinfo_hostlen); \
  register STRPTR __getnameinfo_serv __asm("a2") = (_getnameinfo_serv); \
  register ULONG __getnameinfo_servlen __asm("d2") = (_getnameinfo_servlen); \
  register ULONG __getnameinfo_flags __asm("d3") = (_getnameinfo_flags); \
  __asm volatile ("jsr a6@(-822:W)" \
  : "=r" (_d1), "=r" (_a0), "=r" (_a1),  "=r"(__getnameinfo__re) \
  : "r"(__getnameinfo__bn), "r"(__getnameinfo_sa), "r"(__getnameinfo_salen), "r"(__getnameinfo_host), "r"(__getnameinfo_hostlen), "r"(__getnameinfo_serv), "r"(__getnameinfo_servlen), "r"(__getnameinfo_flags) \
  : "fp0", "fp1", "cc", "memory"); \
  __getnameinfo__re; \
  }); \
  _getnameinfo__re; \
})

#endif /*  _INLINE_BSDSOCKET_H  */
