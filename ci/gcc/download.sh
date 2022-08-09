#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
set -x

export GCC_VERSION="gcc-12.1.0"

wget --no-verbose https://ftp.gwdg.de/pub/misc/gcc/releases/$GCC_VERSION/$GCC_VERSION.tar.xz
tar -xf $GCC_VERSION.tar.xz
rm $GCC_VERSION.tar.xz
mv $GCC_VERSION gcc
