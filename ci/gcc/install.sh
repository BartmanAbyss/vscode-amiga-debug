#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
set -x

cd build-gcc-12.1.0
make install-gcc
