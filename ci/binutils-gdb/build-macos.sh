#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
set -x

export PATH="`brew --prefix bison`/bin:$PATH" # System bison is too old, use homebrew bison

# Temporarily rename libintl dynamic lib to force use of static version
mv /usr/local/opt/gettext/lib/libintl.8.dylib /usr/local/opt/gettext/lib/libintl.8.dylib.bk

cd build-binutils-gdb
make --jobs 4

# Restore dylib
mv /usr/local/opt/gettext/lib/libintl.8.dylib.bk /usr/local/opt/gettext/lib/libintl.8.dylib
