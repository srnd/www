#!/usr/bin/env bash
rm -rf .cache public
gatsby build && node deploy.js

chmod +x cache-purge.sh
./cache-purge.sh
