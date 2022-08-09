#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
set -x

export LDFLAGS="-static -static-libgcc -static-libstdc++"
export PREFIX="`pwd`/output"

rm -rf build-binutils-gdb
mkdir build-binutils-gdb
cd build-binutils-gdb

../binutils-gdb/configure \
    --disable-interprocess-agent \
    --disable-libcc \
    --disable-shared \
    --disable-werror \
    --enable-static \
    --prefix="$PREFIX" \
    --target=m68k-amiga-elf
