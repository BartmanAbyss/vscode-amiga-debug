#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
set -x

cd elf2hunk
tar --create --verbose --file ../elf2hunk-linux.tar elf2hunk
