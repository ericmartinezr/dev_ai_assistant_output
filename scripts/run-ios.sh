#!/bin/bash

# Script to run the React Native app on iOS simulator
# Usage: ./scripts/run-ios.sh [simulator-name]

set -euo pipefail

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "Error: node_modules not found. Please run 'npm install' first."
  exit 1
fi

# Function to check if a port is in use
port_in_use() {
  if command -v netstat >/dev/null 2>&1; then
    netstat -an | grep LISTEN | grep ":$1 " >/dev/null 2>&1
  elif command -v ss >/dev/null 2>&1; then
    ss -lnt | grep ":$1 " >/dev/null 2>&1
  else
    # Fallback: try to connect to the port
    if command -v nc >/dev/null 2>&1; then
      nc -z localhost "$1" >/dev/null 2>&1
    elif command -v telnet >/dev/null 2>&1; then
      timeout 1 telnet localhost "$1" 2>&1 | grep "Connected" >/dev/null 2>&1
    else
      return 1
    fi
  fi
}

# Function to check if simulator exists
simulator_exists() {
  xcrun simctl list devices available | grep -q "$1"
}

# Function to wait for Metro to be ready
wait_for_metro() {
  local max_attempts=30
  local attempt=1
  local url="http://localhost:8081/status"
  
  echo "Waiting for Metro to start..."
  
  while [ $attempt -le $max_attempts ]; do
    if curl -s "$url" | grep -q "packager-status:running"; then
      echo "Metro is ready!"
      return 0
    fi
    echo "Waiting for Metro... ($attempt/$max_attempts)"
    attempt=$((attempt + 1))
    sleep 2
  done
  
  echo "Error: Metro did not start in time"
  return 1
}

# Default simulator if none provided
SIMULATOR="iPhone 14"

if [ $# -gt 0 ]; then
  SIMULATOR="$1"
fi

# Validate simulator
if ! simulator_exists "$SIMULATOR"; then
  echo "Warning: Simulator '$SIMULATOR' not found. Available simulators:"
  xcrun simctl list devices available | grep -E 'iPhone|iPad' | cut -d'(' -f1 | sed 's/ *$//g' | sort -u
  echo "Please specify a valid simulator name."
  exit 1
fi

# Variables for Metro process management
METRO_PID=""
KILL_METRO=false

# Cleanup function
cleanup() {
  if [ "$KILL_METRO" = true ] && [ -n "$METRO_PID" ]; then
    echo "Stopping Metro bundler..."
    kill "$METRO_PID" 2>/dev/null || true
    wait "$METRO_PID" 2>/dev/null || true
  fi
}

# Set trap for cleanup
trap cleanup EXIT INT TERM

# Check if Metro is already running
if port_in_use 8081; then
  echo "Metro bundler is already running."
else
  echo "Starting Metro bundler..."
  npx react-native start --reset-cache >/dev/null 2>&1 &
  METRO_PID=$!
  KILL_METRO=true
  
  # Wait for Metro to be ready
  if ! wait_for_metro; then
    echo "Failed to start Metro. Exiting."
    exit 1
  fi
fi

# Build and run iOS app
echo "Building and running app on ${SIMULATOR}..."
# Using --no-packager to prevent run-ios from starting its own Metro instance
npx react-native run-ios --simulator="${SIMULATOR}" --no-packager

# The trap will handle killing Metro if we started it