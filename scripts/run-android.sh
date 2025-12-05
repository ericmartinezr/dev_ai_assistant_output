#!/usr/bin/env bash

# Script to run the React Native app on Android emulator or device

# Exit on any error and enable robust error handling
set -euo pipefail

# Function to check if a port is in use
is_port_in_use() {
  local port=$1
  if command -v nc >/dev/null 2>&1; then
    echo -n "" | nc -w1 localhost "$port" >/dev/null 2>&1
    return $?
  elif command -v telnet >/dev/null 2>&1; then
    echo "QUIT" | telnet localhost "$port" >/dev/null 2>&1
    return $?
  else
    # Fallback to ss or netstat
    if command -v ss >/dev/null 2>&1; then
      ss -tuln | grep -q ":$port "
      return $?
    elif command -v netstat >/dev/null 2>&1; then
      netstat -an | grep -q ":$port "
      return $?
    else
      # If no tools available, return false (port not in use)
      return 1
    fi
  fi
}

# Function to wait for port to be ready
wait_for_port() {
  local port=$1
  local timeout=${2:-30}
  local count=0
  
  printf "Waiting for port %s to be ready..." "$port"
  
  while ! is_port_in_use "$port"; do
    sleep 1
    count=$((count + 1))
    if [ $count -gt $timeout ]; then
      printf "\nTimeout waiting for port %s\n" "$port"
      return 1
    fi
    printf "."
  done
  
  printf "\nPort %s is ready!\n" "$port"
  return 0
}

# Initialize variables
METRO_PID=""

# Function to cleanup Metro server
cleanup() {
  if [ -n "$METRO_PID" ]; then
    printf "Killing Metro server (PID: %s)...\n" "$METRO_PID"
    kill "$METRO_PID" 2>/dev/null || true
    wait "$METRO_PID" 2>/dev/null || true
    METRO_PID=""
  fi
}

# Set trap to ensure cleanup happens on exit
trap cleanup EXIT INT TERM

# Check if Metro server is already running
if ! is_port_in_use 8081; then
  printf "Starting Metro server...\n"
  npx react-native start --reset-cache &
  METRO_PID=$!
  
  # Wait for Metro to be ready
  if ! wait_for_port 8081 60; then
    printf "Failed to start Metro server\n"
    exit 1
  fi
else
  printf "Metro server is already running.\n"
fi

# Build and run the app on Android
printf "Building and running app on Android...\n"
if ! npx react-native run-android; then
  printf "Failed to build and run Android app\n"
  exit 1
fi

printf "Android app started successfully!\n"