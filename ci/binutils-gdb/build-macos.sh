#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
set -x

export PATH="`brew --prefix bison`/bin:$PATH" # System bison is too old, use homebrew bison

# Temporarily rename libintl dynamic lib to force use of static version
mv /usr/local/opt/gettext/lib/libintl.8.dylib /usr/local/opt/gettext/lib/libintl.8.dylib.bk

# bfd docs fail to build
# we don't need them anyway - create a fake file with a future date so that make skips it
mkdir -p ./build-binutils-gdb/bfd/doc/
touch -t 203601010000 ./build-binutils-gdb/bfd/doc/bfd.info

cd build-binutils-gdb
make --jobs 4

# Restore dylib
mv /usr/local/opt/gettext/lib/libintl.8.dylib.bk /usr/local/opt/gettext/lib/libintl.8.dylib
