#!/usr/bin/env bash
set -eux

APP_NAME="tungsten-front"
FRONT_DIR="$HOME/$APP_NAME"

echo "[Deploy] Installing deps..."
npm install

echo "[Deploy] Building..."
npm run build

echo "[Deploy] Moving dist..."
rm -rf "$FRONT_DIR/dist"
# mkdir -p "$FRONT_DIR"
# cp -r dist "$FRONT_DIR/dist"

echo "[Deploy] Done."
