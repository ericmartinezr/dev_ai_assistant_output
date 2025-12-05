# React Native Alarm App

A TypeScript-based React Native application for managing alarms with Firebase authentication, local notifications, and secure data storage.

## Features

- User authentication (Login/SignUp) with Firebase
- Alarm management (Create, Edit, Delete, List)
- Local notifications with Notifee
- Secure credential storage with Keychain
- Local data persistence with SQLite

## Prerequisites

- Node.js >= 16
- npm or yarn
- Android Studio or Xcode for mobile development
- Firebase project credentials

## Setup

1. Clone the repository
2. Run `npm install` to install dependencies
3. Configure environment variables:
   ```
   cp .env.example .env
   # Edit .env with your Firebase credentials
   ```

## Development

```bash
# Start Metro bundler
npm start

# Run on Android
npx react-native run-android

# Run on iOS
npx react-native run-ios
```

## Testing

```bash
# Run tests
npm test

# Run TypeScript type checking (if configured)
npm run tsc

# Run linting (if configured)
npm run eslint
```

## Building

```bash
# Prepare release build
npx react-native bundle

# Build for Android
npx react-native build-android
```

## Security

- Credentials stored securely using react-native-keychain
- Input validation and sanitization

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React context providers
├── hooks/          # Custom hooks
├── navigation/     # Navigation setup
├── screens/        # Screen components
├── services/       # Business logic services
├── types/          # TypeScript definitions
└── utils/          # Utility functions
```

## CI/CD

Automated workflows are configured for:
- Code quality checks
- Testing
- Building

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License.