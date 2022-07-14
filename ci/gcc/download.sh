#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
set -x

wget https://ftp.gwdg.de/pub/misc/gcc/releases/gcc-12.1.0/gcc-12.1.0.tar.xz
tar -xf gcc-12.1.0.tar.xz
