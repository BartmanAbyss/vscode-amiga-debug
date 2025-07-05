#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
set -x

# Universal binary support for both Intel x64 and Apple Silicon arm64
export CFLAGS="-arch x86_64 -arch arm64"
export CXXFLAGS="-arch x86_64 -arch arm64"
export PATH="`brew --prefix bison`/bin:$PATH" # System bison is too old, use homebrew bison

# Temporarily rename libintl dynamic lib to force use of static version
mv $(brew --prefix gettext)/lib/libintl.8.dylib $(brew --prefix gettext)/lib/libintl.8.dylib.bk

# bfd docs fail to build
# we don't need them anyway - create a fake file with a future date so that make skips it
mkdir -p ./build-binutils-gdb/bfd/doc/
touch -t 203601010000 ./build-binutils-gdb/bfd/doc/bfd.info

cd build-binutils-gdb
make --jobs 4

# Restore dylib
mv $(brew --prefix gettext)/lib/libintl.8.dylib.bk $(brew --prefix gettext)/lib/libintl.8.dylib
