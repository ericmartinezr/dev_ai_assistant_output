#!/bin/bash

# Environment Setup Script for React Native TypeScript Project

# Exit on any error, undefined variables, and pipe failures
set -euo pipefail

# Colors for output
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
NC='\\033[0m' # No Color

echo -e "${GREEN}Setting up development environment...${NC}"

# Check if node is installed
if ! command -v node &> /dev/null; then
  echo -e "${RED}Node.js is not installed. Please install Node.js v16 or higher.${NC}"
  exit 1
fi

# Check node version (must be 16 or higher)
NODE_VERSION=$(node -v)
NODE_MAJOR_VERSION=$(echo "$NODE_VERSION" | cut -d. -f1 | sed 's/v//')
if [ "$NODE_MAJOR_VERSION" -lt 16 ]; then
  echo -e "${RED}Node.js version ${NODE_VERSION} is not supported. Please upgrade to Node.js v16 or higher.${NC}"
  exit 1
fi
echo -e "${GREEN}Node version: ${NODE_VERSION}${NC}"

# Check if yarn is installed
if ! command -v yarn &> /dev/null; then
  echo -e "${YELLOW}Yarn is not installed. Please install Yarn using corepack (recommended) or npm:${NC}"
  echo -e "${YELLOW}Option 1: corepack enable && corepack prepare yarn@stable --activate${NC}"
  echo -e "${YELLOW}Option 2: npm install -g yarn${NC}"
  echo -e "${YELLOW}After installation, please re-run this script.${NC}"
  exit 1
fi

# Install dependencies
echo -e "${GREEN}Installing project dependencies...${NC}"
yarn install --frozen-lockfile

# Create environment files if they don't exist
if [ ! -f .env ]; then
  echo -e "${YELLOW}Creating .env file...${NC}"
  if [ -f .env.example ]; then
    cp .env.example .env
  else
    echo "# Environment variables" > .env
  fi
fi

# Android specific setup
if [ -d "android" ]; then
  echo -e "${GREEN}Setting up Android environment...${NC}"
  
  # Check if Android SDK is configured
  ANDROID_SDK_CONFIGURED=false
  
  if [ -n "${ANDROID_HOME:-}" ]; then
    echo -e "${GREEN}ANDROID_HOME: $ANDROID_HOME${NC}"
    ANDROID_SDK_CONFIGURED=true
  fi
  
  if [ -n "${ANDROID_SDK_ROOT:-}" ]; then
    echo -e "${GREEN}ANDROID_SDK_ROOT: $ANDROID_SDK_ROOT${NC}"
    ANDROID_SDK_CONFIGURED=true
  fi
  
  if [ "$ANDROID_SDK_CONFIGURED" = false ]; then
    echo -e "${YELLOW}Android SDK not configured. Please set ANDROID_HOME or ANDROID_SDK_ROOT environment variables.${NC}"
    echo -e "${YELLOW}Add the following lines to your ~/.bashrc, ~/.zshrc, or equivalent:${NC}"
    echo -e "${YELLOW}export ANDROID_HOME=$HOME/Android/Sdk${NC}"
    echo -e "${YELLOW}export PATH=$PATH:$ANDROID_HOME/emulator${NC}"
    echo -e "${YELLOW}export PATH=$PATH:$ANDROID_HOME/tools${NC}"
    echo -e "${YELLOW}export PATH=$PATH:$ANDROID_HOME/tools/bin${NC}"
    echo -e "${YELLOW}export PATH=$PATH:$ANDROID_HOME/platform-tools${NC}"
  fi
  
  # Accept Android licenses
  if command -v sdkmanager &> /dev/null; then
    echo -e "${GREEN}Accepting Android licenses...${NC}"
    yes | sdkmanager --licenses >/dev/null 2>&1 || true
  fi
fi

# iOS specific setup (macOS only)
if [[ "$OSTYPE" == "darwin"* ]] && [ -d "ios" ]; then
  echo -e "${GREEN}Setting up iOS environment...${NC}"
  
  # Check if Xcode command line tools are installed
  if ! command -v xcodebuild &> /dev/null; then
    echo -e "${YELLOW}Xcode command line tools not installed. Please install Xcode from the App Store.${NC}"
  fi
  
  # Install CocoaPods dependencies
  if [ -f "ios/Podfile" ]; then
    echo -e "${GREEN}Installing iOS pods...${NC}"
    cd ios && pod install --repo-update && cd ..
  fi
fi

# Create necessary directories
mkdir -p src/screens
mkdir -p src/components
mkdir -p src/navigation
mkdir -p src/contexts
mkdir -p src/hooks
mkdir -p src/services
mkdir -p src/utils
mkdir -p src/types

# Generate TypeScript declarations if needed
echo -e "${GREEN}Generating TypeScript declarations...${NC}"
if [ -f "tsconfig.json" ]; then
  yarn tsc --noEmit false --emitDeclarationOnly || true
else
  echo -e "${YELLOW}tsconfig.json not found. Skipping TypeScript declaration generation.${NC}"
fi

echo -e "${GREEN}Environment setup completed successfully!${NC}"

# Print next steps
echo -e "\\n${YELLOW}Next steps:${NC}"
echo -e "1. Configure your environment variables in .env file"
echo -e "2. Run ${GREEN}yarn start${NC} to start the development server"
echo -e "3. Run ${GREEN}yarn android${NC} or ${GREEN}yarn ios${NC} to launch the app"