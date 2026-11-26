#!/usr/bin/env bash
# Builds a Release APK (JS bundled inside, no Metro needed) and copies it to ../e2e/app/android/.
set -euo pipefail
cd "$(dirname "$0")/.."

export ANDROID_HOME="${ANDROID_HOME:-$HOME/Library/Android/sdk}"
npx expo prebuild --platform android --no-install
(cd android && ./gradlew assembleRelease --quiet)

mkdir -p ../e2e/app/android
cp android/app/build/outputs/apk/release/app-release.apk ../e2e/app/android/demo-shop.apk
echo "Copied to native/e2e/app/android/demo-shop.apk"
