#!/usr/bin/env bash
set -eux

APP_NAME="tungsten-front"
FRONT_DIR="$HOME/$APP_NAME"

echo "[Deploy] Installing deps..."
npm install

echo "[Deploy] Building..."
GIT_HASH="${1:-unknown}" npm run build

echo "[Deploy] Moving dist..."
rm -rf "$FRONT_DIR/dist"
mv dist "$FRONT_DIR/dist"

echo "[Deploy] Building storybook..."
npm run build-storybook

echo "[Deploy] Moving storybook-static..."
rm -rf "$FRONT_DIR/storybook-static"
mv storybook-static "$FRONT_DIR/storybook-static"

echo "[Deploy] Done."
