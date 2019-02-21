#!/usr/bin/env bash
rm -rf .cache public
gatsby build

if [ $? -eq 0 ]; then
    echo OK
else
    exit -1
fi

pushd public
find . -type f -print0 | xargs -0 sed -i 's/images\.ctfassets\.net/f2\.srnd\.org/g'
popd

node deploy.js

echo "Clearing cache."
chmod +x cache-purge.sh
./cache-purge.sh >/dev/null 2>&1

echo "Done!"
