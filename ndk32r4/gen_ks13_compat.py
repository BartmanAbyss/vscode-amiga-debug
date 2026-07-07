#!/usr/bin/env python3
"""
gen_ks13_compat.py  (v3)

Generates ks13_compat.h from the NDK 3.2R4 SFD files: a header that
poisons (via #pragma GCC poison) every public library function
introduced in Kickstart 2.0 (version 36) or later, so code targeting
Kickstart 1.3 gets a compile-time error if it calls one.

History / fixes:
  v2: the function-matching regex required whitespace between the return
      type and the function name, so "TYPE *Name(" (asterisk against the
      name) silently failed to match -> every V36+ pointer-returning
      function was omitted (346 of 756). Fixed here.
  v3: restore the per-name "#undef" that the committed header had but the
      script had lost. The NDK proto/inline headers define many of these
      names as function-like macros; poisoning a live macro triggers a
      "poisoning existing macro" warning for each. #undef removes the
      macro first so the poison applies cleanly to the bare identifier
      (which is what actually catches a call) with no warning. Also emit
      the summary to stderr only, and always end the file with a newline.

Usage:
  python3 gen_ks13_compat.py /path/to/NDK_3.2/SFD/ > ks13_compat.h
  python3 gen_ks13_compat.py --audit /path/to/NDK_3.2/SFD/
  python3 gen_ks13_compat.py --check ks13_compat.h /path/to/NDK_3.2/SFD/
"""

import sys
import os
import re

# Matches "ReturnType Name(", "ReturnType *Name(", "ReturnType * Name(",
# "struct Foo *Name(" etc.  Rejects bare callback exprs like "(*fn)()".
FUNC_RE = re.compile(r'^\s*[A-Za-z_][\w\s]*?[\s\*]\**\s*([A-Za-z_]\w*)\s*\(')


def parse_sfd(filepath):
    functions = []
    current_version = 0
    in_public = True  # SFD bodies start public until told otherwise
    with open(filepath, 'r', errors='replace') as f:
        for raw in f:
            line = raw.rstrip()
            stripped = line.strip()
            if stripped.startswith('=='):
                if stripped.startswith('==public'):
                    in_public = True
                elif stripped.startswith('==private'):
                    in_public = False
                elif stripped.startswith('==version'):
                    parts = stripped.split()
                    if len(parts) >= 2:
                        try:
                            current_version = int(float(parts[1]))
                        except ValueError:
                            pass
                continue
            if not line or stripped.startswith('*'):
                continue
            if not in_public:
                continue
            m = FUNC_RE.match(line)
            if m:
                name = m.group(1)
                if name and not name.startswith('_'):
                    functions.append((name, current_version))
    return functions


def collect(sfd_dir):
    by_lib = {}
    allfuncs = []
    sfd_files = sorted(f for f in os.listdir(sfd_dir) if f.endswith('_lib.sfd'))
    for sfd_file in sfd_files:
        libname = sfd_file.replace('_lib.sfd', '')
        for name, ver in parse_sfd(os.path.join(sfd_dir, sfd_file)):
            allfuncs.append((name, ver, libname))
            if ver >= 36:
                by_lib.setdefault(libname, []).append((name, ver))
    return by_lib, allfuncs, sfd_files


def gen_header(by_lib):
    lines = []
    lines.append("/* ks13_compat.h")
    lines.append(" *")
    lines.append(" * Automatically generated compile-time compatibility guard for AmigaOS")
    lines.append(" * functions not available on Kickstart 1.3 (exec/dos version 33).")
    lines.append(" *")
    lines.append(" * Include this header when building software that must run on KS 1.3:")
    lines.append(" *")
    lines.append(" *   #include <ks13_compat.h>")
    lines.append(" *")
    lines.append(" * Any call to a function introduced in Kickstart 2.0 (version 36) or")
    lines.append(" * later becomes a hard compile error via #pragma GCC poison.")
    lines.append(" *")
    lines.append(" * Each name is #undef'd immediately before it is poisoned. The NDK proto/")
    lines.append(" * inline headers define many of these as function-like macros; poisoning a")
    lines.append(" * name that is currently a macro otherwise emits a 'poisoning existing macro'")
    lines.append(" * warning for every such name. #undef removes the macro first, so the poison")
    lines.append(" * applies cleanly to the bare identifier (which is what catches a call) with")
    lines.append(" * no warning.")
    lines.append(" *")
    lines.append(" * Generated from the NDK 3.2R4 SFD files by gen_ks13_compat.py.")
    lines.append(" */")
    lines.append("")
    lines.append("#ifndef KS13_COMPAT_H")
    lines.append("#define KS13_COMPAT_H")
    lines.append("")
    lines.append("#ifdef __GNUC__")
    lines.append("")

    total = 0
    for libname in sorted(by_lib):
        lines.append(f"/* {libname}.library \u2014 functions requiring KS 2.0+ */")
        seen = set()
        for name, _ver in sorted(by_lib[libname]):
            if name in seen:
                continue
            seen.add(name)
            lines.append(f"#undef {name}")
            lines.append(f"#pragma GCC poison {name}")
            total += 1
        lines.append("")

    lines.append("#endif /* __GNUC__ */")
    lines.append("#endif /* KS13_COMPAT_H */")
    lines.append("")  # guarantee trailing newline
    return "\n".join(lines), total


def main():
    args = sys.argv[1:]
    if not args:
        print(__doc__)
        sys.exit(1)

    mode = "generate"
    check_header = None
    if args[0] == "--audit":
        mode = "audit"; args = args[1:]
    elif args[0] == "--check":
        mode = "check"; check_header = args[1]; args = args[2:]

    if not args:
        print("error: missing SFD directory", file=sys.stderr)
        sys.exit(1)
    sfd_dir = args[0]

    by_lib, allfuncs, sfd_files = collect(sfd_dir)
    poisoned = sorted({(n, l) for l, lst in by_lib.items() for (n, _v) in lst})

    if mode == "generate":
        header, total = gen_header(by_lib)
        sys.stdout.write(header)
        # summary strictly to stderr so it never contaminates the header
        print(f"{total} functions poisoned across {len(by_lib)} libraries",
              file=sys.stderr)
        return

    if mode == "audit":
        v36 = [(n, v, l) for (n, v, l) in allfuncs if v >= 36]
        print(f"SFD files scanned: {len(sfd_files)}")
        print(f"Total public functions parsed: {len(allfuncs)}")
        print(f"V36+ occurrences: {len(v36)}")
        print(f"Unique poisoned names: {len(poisoned)}")
        print()
        for libname in sorted(by_lib):
            names = sorted({n for n, _ in by_lib[libname]})
            print(f"{libname}.library: {len(names)}")
            for n in names:
                print(f"    {n}")
        return

    if mode == "check":
        with open(check_header, 'r', errors='replace') as f:
            existing = set(re.findall(r'#pragma\s+GCC\s+poison\s+(\w+)', f.read()))
        expected = {n for (n, _l) in poisoned}
        missing = sorted(expected - existing)
        extra = sorted(existing - expected)
        print(f"Expected poisoned (V36+): {len(expected)}")
        print(f"Present in {os.path.basename(check_header)}: {len(existing)}")
        print(f"MISSING from header: {len(missing)}")
        for n in missing:
            libs = sorted({l for (nn, l) in poisoned if nn == n})
            print(f"    {n}  ({', '.join(libs)})")
        if extra:
            print(f"Present but not expected V36+: {len(extra)}")
            for n in extra:
                print(f"    {n}")
        sys.exit(1 if missing else 0)


if __name__ == '__main__':
    main()
