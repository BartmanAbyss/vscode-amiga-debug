#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
set -x

# Universal binary support for both Intel x64 and Apple Silicon arm64
export CFLAGS="-arch x86_64 -arch arm64"
export CXXFLAGS="-arch x86_64 -arch arm64"

cd elf2hunk
make
