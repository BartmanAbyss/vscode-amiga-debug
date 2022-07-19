#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
set -x

cd build-binutils-gdb
make install
