#!/bin/bash

# Prepare Release Script
# This script handles release preparation tasks for the React Native app.

set -e  # Exit immediately if a command exits with a non-zero status

echo "Preparing release build..."

# Create release directory if it doesn't exist
mkdir -p release

# Clean previous builds
rm -rf release/*

# Copy necessary files for release
cp -r android/app/build/outputs/apk/release/app-release.apk release/ 2>/dev/null || echo "APK not found, continuing..."

# For iOS, we would copy the IPA file when available
# cp -r ios/build/Build/Products/Release-iphoneos/*.ipa release/ 2>/dev/null || echo "IPA not found, continuing..."

# Copy documentation
cp README.md release/ 2>/dev/null || echo "README.md not found"

echo "Release preparation completed successfully!"
