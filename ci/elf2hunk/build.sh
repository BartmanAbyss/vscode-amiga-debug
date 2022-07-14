#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
set -x

cd elf2hunk
gcc -o elf2hunk -O2 cp-demangle.c elf2hunk.c
