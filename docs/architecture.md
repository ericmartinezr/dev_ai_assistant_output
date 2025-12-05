# Project Architecture

## Overview

This React Native application follows a modular, scalable architecture designed for security, maintainability, and separation of concerns. The architecture is organized into distinct layers that promote reusability, testability, and clear boundaries between different functionalities.

## High-Level Structure

```
src/
├── components/        # Reusable UI components
├── hooks/             # Custom React hooks
├── navigation/        # App navigation setup
├── screens/           # Screen components
├── services/          # Business logic and API integrations
├── store/             # Redux Toolkit state management
├── utils/             # Helper functions and utilities
└── types/             # Shared TypeScript interfaces and types
```

## Layered Architecture

### 1. Presentation Layer (UI)
- **Components**: Reusable, stateless UI elements (e.g., `AlarmItem`, `AlarmForm`)
- **Screens**: Page-level components that compose UI elements
- **Navigation**: React Navigation stacks and navigators

### 2. Business Logic Layer
- **Hooks**: Custom hooks for encapsulating component logic (`useAuth`, `useAlarms`, `useWhatsApp`)
- **Services**: Encapsulated modules for specific functionalities:
  - Authentication and security
  - Alarm management
  - WhatsApp integration
  - Local notifications
- **Utils**: Helper functions for validation, date/time manipulation, and security operations

### 3. State Management Layer
- **Redux Toolkit Store**: Centralized application state
- **Slices**: Modular state reducers (`authSlice`, `alarmSlice`)
- **Types**: Shared TypeScript interfaces for state and props

### 4. Data & Integration Layer
- Secure storage for authentication tokens and sensitive data
- Local notification scheduling
- WhatsApp API integration
- Alarm persistence logic

## Security Architecture

- **Authentication**: Secure token-based authentication with encrypted storage
- **Data Protection**: AES encryption for sensitive local data
- **Input Validation**: Strict validation at service and component levels
- **Secure Communication**: HTTPS-only API interactions

## Data Flow

1. User interacts with UI component
2. Custom hook handles business logic
3. Service layer processes request and interacts with APIs/storage
4. Redux store updates application state
5. UI re‑renders based on state changes
6. Background services handle alarms and notifications

## Key Design Patterns

- **Separation of Concerns**: Clear boundaries between UI, logic, and data layers
- **Single Responsibility**: Each module has a focused purpose
- **Dependency Injection**: Services and hooks are designed for testability
- **State Management**: Predictable state container with Redux Toolkit

## Testing Strategy

- **Unit Tests**: Service functions and utility functions with Jest
- **Integration Tests**: Navigation flows and hook behaviors
- **Component Tests**: UI component rendering and interactions
- **End‑to‑End Tests**: Critical user flows

## CI/CD Pipeline

- **Linting**: ESLint with TypeScript support
- **Type Checking**: TypeScript compilation
- **Testing**: Automated test execution
- **Building**: Platform‑specific builds for Android/iOS
- **Deployment**: Manual triggers via workflow_dispatch

This architecture ensures maintainability, scalability, and robust security while enabling efficient development and testing processes.
