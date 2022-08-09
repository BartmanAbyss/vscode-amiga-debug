#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
set -x

cd output
tar --create --verbose --file ../binutils-gdb-gcc-linux.tar .
