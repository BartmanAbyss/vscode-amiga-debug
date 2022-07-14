#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
set -x

mkdir build-binutils-gdb
cd build-binutils-gdb
LDFLAGS="-static -static-libgcc -static-libstdc++" ../binutils-gdb/configure \
    --prefix=$GITHUB_WORKSPACE/output \
    --target=m68k-amiga-elf \
    --disable-werror \
    -enable-static \
    --disable-shared \
    --disable-interprocess-agent \
    --disable-libcc
