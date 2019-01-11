#!/bin/bash

npm install
npm run build

rm -rf node_modules

npm uninstall aws-sdk --save
npm install --production

du -sh node_modules

sls package --package /tmp/package
ls /tmp/package
