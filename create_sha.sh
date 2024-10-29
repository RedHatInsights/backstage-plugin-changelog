#!/usr/bin/env sh

fsha=$(sha256sum *.tgz | awk '{print $1}' | xxd -r -p | base64)

echo "sha256-${fsha}"
