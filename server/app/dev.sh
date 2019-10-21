#!/usr/bin/env bash
pm2 flush && pm2 kill && pm2 start index.js --watch && pm2 logs
