#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
set -x

cd output
rm -r include
rm -r share
rm bin/m68k-amiga-elf-ar
rm bin/m68k-amiga-elf-c++
rm bin/m68k-amiga-elf-c++filt
rm bin/m68k-amiga-elf-cpp
rm bin/m68k-amiga-elf-elfedit
rm bin/m68k-amiga-elf-g++
rm bin/m68k-amiga-elf-gcc-12.1.0
rm bin/m68k-amiga-elf-gcc-ar
rm bin/m68k-amiga-elf-gcc-nm
rm bin/m68k-amiga-elf-gcc-ranlib
rm bin/m68k-amiga-elf-gdb-add-index
rm bin/m68k-amiga-elf-gprof
rm bin/m68k-amiga-elf-ld.bfd
rm bin/m68k-amiga-elf-lto-dump
rm bin/m68k-amiga-elf-nm
rm bin/m68k-amiga-elf-objcopy
rm bin/m68k-amiga-elf-ranlib
rm bin/m68k-amiga-elf-readelf
rm bin/m68k-amiga-elf-size
rm bin/m68k-amiga-elf-strings
rm bin/m68k-amiga-elf-strip
rm -r lib/bfd-plugins/
rm -r lib/gcc/m68k-amiga-elf/12.1.0/install-tools/
rm -r lib/gcc/m68k-amiga-elf/12.1.0/plugin/
rm -r libexec/gcc/m68k-amiga-elf/12.1.0/install-tools/
rm -r libexec/gcc/m68k-amiga-elf/12.1.0/plugin/
