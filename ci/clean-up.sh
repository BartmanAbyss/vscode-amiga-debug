#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
set -x

cd output
rm -rf include
rm -rf share
rm -f bin/m68k-amiga-elf-ar
rm -f bin/m68k-amiga-elf-c++
rm -f bin/m68k-amiga-elf-c++filt
rm -f bin/m68k-amiga-elf-cpp
rm -f bin/m68k-amiga-elf-elfedit
rm -f bin/m68k-amiga-elf-g++
rm -f bin/m68k-amiga-elf-gcc-12.1.0
rm -f bin/m68k-amiga-elf-gcc-ar
rm -f bin/m68k-amiga-elf-gcc-nm
rm -f bin/m68k-amiga-elf-gcc-ranlib
rm -f bin/m68k-amiga-elf-gdb-add-index
rm -f bin/m68k-amiga-elf-gprof
rm -f bin/m68k-amiga-elf-ld.bfd
rm -f bin/m68k-amiga-elf-lto-dump
rm -f bin/m68k-amiga-elf-nm
rm -f bin/m68k-amiga-elf-objcopy
rm -f bin/m68k-amiga-elf-ranlib
rm -f bin/m68k-amiga-elf-readelf
rm -f bin/m68k-amiga-elf-size
rm -f bin/m68k-amiga-elf-strings
rm -f bin/m68k-amiga-elf-strip
rm -rf lib/bfd-plugins/
rm -rf lib/gcc/m68k-amiga-elf/12.1.0/install-tools/
rm -rf lib/gcc/m68k-amiga-elf/12.1.0/plugin/
rm -rf libexec/gcc/m68k-amiga-elf/12.1.0/install-tools/
rm -rf libexec/gcc/m68k-amiga-elf/12.1.0/plugin/
