#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
set -x

export PATH="`brew --prefix bison`/bin:$PATH" # System bison is too old, use homebrew bison

cd build-binutils-gdb
make --jobs 4
