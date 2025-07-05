#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
set -x

# Universal binary support for both Intel x64 and Apple Silicon arm64
export CFLAGS="-arch x86_64 -arch arm64"
export CXXFLAGS="-arch x86_64 -arch arm64"
export LDFLAGS="-static-libstdc++ -arch x86_64 -arch arm64" # -static is not supported
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
