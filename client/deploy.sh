#!/bin/bash
DIST=./dist
REMOTE=maka@10.25.10.70
TARGET=/home/ez-rbt/web

# Sync with fixed permissions
rsync -avz --delete \
  --chmod=Du=rwx,Dgo=rx,Fu=rw,Fgo=r \
  $DIST/ $REMOTE:$TARGET/

# Reload nginx inside the container remotely
ssh $REMOTE "docker exec ezrbt-nginx nginx -s reload"

echo "✅ Deployment finished and nginx reloaded inside react-nginx"