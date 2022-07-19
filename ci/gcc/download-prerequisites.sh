#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
set -x

cd gcc
bash ./contrib/download_prerequisites
