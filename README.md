# Tungsten Front

## Getting started

### Initial configuration

```sh
chmod o+rx /home/tungsten

sudo mkdir -p /srv/tungsten-front-app
sudo chown -R tungsten:tungsten /srv/tungsten-front-app

sudo mkdir -p /srv/tungsten-front-repo
sudo chown -R tungsten:tungsten /srv/tungsten-front-repo
```

### Deploy hook

1. Create bare repo

```sh
cd /srv/tungsten-front-repo
git init --bare
```

2. Create `post-receive` hook

```sh
sudo tee /srv/tungsten-front-repo/hooks/post-receive > /dev/null <<'EOF'
#!/usr/bin/env bash
set -e

REPO_DIR="/srv/tungsten-front-repo"  # repo bare
WORK_DIR="/srv/tungsten-front-app"   # checkout dir
DEPLOY_SCRIPT="$WORK_DIR/deploy.sh"  # deploy script

echo "[Post-Receive] Receiving push..."

mkdir -p "$WORK_DIR"
git --work-tree="$WORK_DIR" --git-dir="$REPO_DIR" checkout -f main

chmod +x "$DEPLOY_SCRIPT"

echo "[Post-Receive] Running deploy script..."
cd "$WORK_DIR"
"$DEPLOY_SCRIPT"

echo "[Post-Receive] Deploy Finished."
EOF
```

`chmod +x /srv/tungsten-front-repo/hooks/post-receive`

3. Make a push

```sh
git remote add deploy ssh://<user>@<hostname>/srv/tungsten-front-repo
git push deploy main
```
