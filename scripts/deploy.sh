#!/bin/sh
yarn workspaces run build
pm2 del all
pm2 start "yarn workspace @ridge-rover/ui preview --host" --name "ui"
pm2 start "yarn workspace @ridge-rover/api start" --name "api"
pm2 start "bash ./scripts/stream-start.sh" --name "cam"
pm2 save