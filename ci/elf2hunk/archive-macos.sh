#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
set -x

cd elf2hunk
tar --create --verbose --file ../elf2hunk-macos.tar elf2hunk
