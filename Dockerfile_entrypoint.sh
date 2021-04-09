#!/bin/sh

if [ ! -d node_modules ]; then
    echo "No modules found. Running installation."
    yarn install
    test -z "$USER_PERM" || chown -R $USER_PERM node_modules
fi

node $BIN_PATH