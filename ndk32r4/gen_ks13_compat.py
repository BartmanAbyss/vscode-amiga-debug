#!/usr/bin/env python3
"""
gen_ks13_compat.py

Parses NDK 3.2R4 SFD files and generates a ks13_compat.h header that
issues compile-time warnings when functions not available in KS 1.3
(version < 36) are used.

Usage:
  python3 gen_ks13_compat.py /path/to/NDK_3.2/SFD/ > ks13_compat.h
"""

import sys
import os
import re

def parse_sfd(filepath):
    """
    Returns a list of (funcname, min_version) tuples.
    min_version is the ==version tag that immediately precedes the function,
    or 0 if no version tag (meaning original KS 1.2 function).
    """
    functions = []
    current_version = 0
    in_public = False

    with open(filepath, 'r', errors='replace') as f:
        for line in f:
            line = line.rstrip()

            if line.startswith('==public'):
                in_public = True
                continue
            elif line.startswith('==private'):
                in_public = False
                current_version = 0
                continue
            elif line.startswith('==version'):
                parts = line.split()
                if len(parts) >= 2:
                    try:
                        current_version = int(parts[1])
                    except ValueError:
                        pass
                continue
            elif line.startswith('=='):
                continue
            elif line.startswith('*'):
                continue  # comment

            if not in_public:
                continue

            # Try to match a function declaration
            # Format: ReturnType FuncName( args ) (regs)
            # May span multiple lines but name is always on first line
            m = re.match(r'^[\w\s\*]+?\s+(\w+)\s*\(', line)
            if m:
                funcname = m.group(1)
                if funcname and not funcname.startswith('_'):
                    functions.append((funcname, current_version))

    return functions

def main():
    if len(sys.argv) < 2:
        print(f"Usage: {sys.argv[0]} /path/to/SFD/", file=sys.stderr)
        sys.exit(1)

    sfd_dir = sys.argv[1]
    sfd_files = sorted(f for f in os.listdir(sfd_dir) if f.endswith('_lib.sfd'))

    # Collect all functions that require version > 33 (KS 1.3)
    # version 0 = original (safe), version 33 = KS 1.3 (safe),
    # version 36+ = KS 2.0+ (warn)
    post_13 = []  # (funcname, version, libname)

    for sfd_file in sfd_files:
        libname = sfd_file.replace('_lib.sfd', '')
        funcs = parse_sfd(os.path.join(sfd_dir, sfd_file))
        for funcname, version in funcs:
            if version >= 36:
                post_13.append((funcname, version, libname))

    # Generate the header
    print("""/* ks13_compat.h
 *
 * Automatically generated compile-time compatibility warnings for
 * AmigaOS functions not available on Kickstart 1.3 (version 33).
 *
 * Include this header when building software that must run on KS 1.3:
 *
 *   #include <ks13_compat.h>
 *
 * Any call to a KS 2.0+ function will generate a compiler warning.
 * Generated from NDK 3.2R4 SFD files by gen_ks13_compat.py
 */

#ifndef KS13_COMPAT_H
#define KS13_COMPAT_H

#ifdef __GNUC__
""")

    # Group by library for readability
    by_lib = {}
    for funcname, version, libname in sorted(post_13, key=lambda x: (x[2], x[0])):
        by_lib.setdefault(libname, []).append((funcname, version))

    for libname in sorted(by_lib.keys()):
        print(f"/* {libname}.library — functions requiring KS 2.0+ */")
        for funcname, version in sorted(by_lib[libname]):
            os_ver = f"{version // 10}.{version % 10}" if version >= 36 else str(version)
            print(f'#pragma GCC poison {funcname}')
        print()

    print("""#endif /* __GNUC__ */
#endif /* KS13_COMPAT_H */""")

if __name__ == '__main__':
    main()
