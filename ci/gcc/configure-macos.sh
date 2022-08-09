#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
set -x

export LDFLAGS="-static-libstdc++" # -static is not supported
export PREFIX="`pwd`/output"

rm -rf build-gcc
mkdir build-gcc
cd build-gcc

../gcc/configure \
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
    --prefix="$PREFIX" \
    --target=m68k-amiga-elf \
    --with-cpu=68000
