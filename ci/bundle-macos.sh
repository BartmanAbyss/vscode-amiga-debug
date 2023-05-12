#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
set -x

VERSION=13.1.0

cd output
find bin -type f -perm +111 -exec ../ci/make_portable.sh {} ../lib \;
find libexec/gcc/m68k-amiga-elf -type f -exec ../ci/make_portable.sh {} ../../../../lib \;
find m68k-amiga-elf/bin -type f -perm +111 -exec ../ci/make_portable.sh {} ../../lib \;
