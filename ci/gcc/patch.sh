#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
set -x

cd gcc
patch -p1 < ../gcc-barto.patch
