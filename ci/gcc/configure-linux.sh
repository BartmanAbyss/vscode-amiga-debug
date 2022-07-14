#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
set -x

mkdir -p build-gcc
cd build-gcc
LDFLAGS="-static -static-libgcc -static-libstdc++" ../gcc/configure \
    --target=m68k-amiga-elf \
    --disable-nls \
    --enable-languages=c,c++ \
    --enable-lto \
    --prefix=$GITHUB_WORKSPACE/output \
    --disable-libssp \
    --disable-gcov \
    --disable-multilib \
    --disable-threads \
    --with-cpu=68000 \
    --disable-libsanitizer \
    --disable-libada \
    --disable-libgomp \
    --disable-libvtv \
    --disable-nls \
    --disable-clocale \
    --enable-static
