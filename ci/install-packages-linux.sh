#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
set -x

sudo apt install build-essential flex bison expect dejagnu texinfo
