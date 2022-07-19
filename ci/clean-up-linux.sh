#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
set -x

cd output
rm -r include
rm -r share
find bin -type f -and -not -name m68k-amiga-elf-gdb-add-index | xargs strip
