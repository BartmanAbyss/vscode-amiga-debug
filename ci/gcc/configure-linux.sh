#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
set -x

mkdir -p build-gcc
cd build-gcc
LDFLAGS="-static -static-libgcc -static-libstdc++" ../gcc/configure \
    --disable-clocale \
    --disable-gcov \
    --disable-libada \
    --disable-libgomp \
    --disable-libsanitizer \
    --disable-libssp \
    --disable-libvtv \
    --disable-multilib \
    --disable-nls \
    --disable-threads \
    --enable-languages=c,c++ \
    --enable-lto \
    --enable-static \
    --prefix=$GITHUB_WORKSPACE/output \
    --target=m68k-amiga-elf \
    --with-cpu=68000
