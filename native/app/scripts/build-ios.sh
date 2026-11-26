#!/usr/bin/env bash
# Builds a Release simulator app (JS bundled inside, no Metro needed) and copies it to ../e2e/app/ios/.
set -euo pipefail
cd "$(dirname "$0")/.."

npx expo prebuild --platform ios --no-install
(cd ios && pod install)
xcodebuild \
  -workspace ios/DemoShop.xcworkspace \
  -scheme DemoShop \
  -configuration Release \
  -sdk iphonesimulator \
  -destination 'generic/platform=iOS Simulator' \
  -derivedDataPath ios/build \
  build | tail -n 3

mkdir -p ../e2e/app/ios && rm -rf ../e2e/app/ios/DemoShop.app
cp -R ios/build/Build/Products/Release-iphonesimulator/DemoShop.app ../e2e/app/ios/
echo "Copied to native/e2e/app/ios/DemoShop.app"
