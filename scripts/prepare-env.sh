#!/usr/bin/env bash
set -euo pipefail

# Script to prepare environment variables for the React Native app

# Check if .env file already exists
if [ -f .env ]; then
  echo "Warning: .env file already exists. Please remove it if you want to regenerate."
  exit 1
fi

# Create .env file from .env.example
if [ ! -f .env.example ]; then
  echo "Error: .env.example file not found!"
  exit 1
fi

# Copy example file to .env with error handling
if ! cp .env.example .env; then
  echo "Error: Failed to create .env file from .env.example"
  exit 1
fi

echo "Environment file (.env) created successfully from .env.example"
echo "Please update the values in .env with your actual configuration"

# Check if .env is in .gitignore for security
if [ -f .gitignore ]; then
  if ! grep -q ".env" .gitignore; then
    echo "Warning: .env is not found in .gitignore. This is a security risk."
  fi
else
  echo "Warning: .gitignore file not found. Please ensure .env is not tracked by git."
fi

echo
echo "Next steps:"
echo "1. Open .env file and replace placeholder values with real ones"
echo "2. Verify that .env is properly ignored by git"
echo "3. Rebuild the app to apply changes"