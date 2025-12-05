# Setup Guide

This guide will help you set up the project locally for development.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- React Native development environment set up (Android Studio/Xcode)
- Firebase project credentials

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <project-name>
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your actual configuration values.

4. Run the prepare environment script:
   ```bash
   ./prepare-env.sh
   ```

## Running the App

### iOS
```bash
npx react-native run-ios
```

### Android
```bash
npx react-native run-android
```

## Development

### Linting
```bash
npm run lint
# or
yarn lint
```

### Type Checking
```bash
npm run type-check
# or
yarn type-check
```

### Testing
```bash
npm run test
# or
yarn test
```

## Security Checklist

- [ ] All sensitive data is stored in encrypted storage
- [ ] Environment variables are properly configured
- [ ] Firebase credentials are secured
- [ ] HTTPS is used for all network requests
- [ ] Input validation is implemented for all user data

## Troubleshooting

If you encounter any issues during setup:

1. Ensure all prerequisites are installed correctly
2. Check that your environment variables are properly configured
3. Run `npm run clean` or `yarn clean` to clear build caches
4. Refer to the React Native documentation for platform-specific setup issues
