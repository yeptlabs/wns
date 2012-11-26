#!/bin/sh
./node_modules/forever/bin/forever stopall
./node_modules/forever/bin/forever start ./index.js