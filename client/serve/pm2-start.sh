#!/bin/sh
pm2-runtime start -i 0 --interpreter=sh ./serve.sh --name client-primary -- $1
