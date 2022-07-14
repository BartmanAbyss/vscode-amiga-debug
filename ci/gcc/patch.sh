#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
set -x

cd gcc
patch -p1 < ../bin/gcc-barto.patch
