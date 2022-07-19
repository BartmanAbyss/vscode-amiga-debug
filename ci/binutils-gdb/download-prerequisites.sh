#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
set -x

cd binutils-gdb
bash ./contrib/download_prerequisites
