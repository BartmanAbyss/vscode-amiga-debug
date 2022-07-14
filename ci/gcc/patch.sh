#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
set -x

cd gcc-12.1.0
patch -p1 < ../bin/gcc-barto.patch
