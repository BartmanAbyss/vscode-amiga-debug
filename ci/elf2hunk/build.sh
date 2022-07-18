#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
set -x

cd elf2hunk
make
