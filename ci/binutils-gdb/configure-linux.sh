#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
set -x

mkdir build-binutils-gdb
cd build-binutils-gdb
LDFLAGS="-static -static-libgcc -static-libstdc++" ../binutils-gdb/configure \
    --disable-interprocess-agent \
    --disable-libcc \
    --disable-shared \
    --disable-werror \
    --enable-static \
    --prefix=$GITHUB_WORKSPACE/output \
    --target=m68k-amiga-elf
