#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
set -x

cd output
rm -r include
rm -r share
find . -type f -exec strip {} \;
