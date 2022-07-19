#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
set -x

cd build-gcc
make all-gcc --jobs 4
