# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly by emailing [security@example.com](mailto:security@example.com) with the following information:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested fixes

We will acknowledge your report within 48 hours and work on a resolution promptly.

## Security Measures

- All sensitive data is stored securely using `react-native-keychain`
- Input validation and sanitization are enforced throughout the application
- CSRF-like nonces are implemented for secure state transitions
- Content Security Policy (CSP) is enforced for any WebView components
- Firebase authentication tokens are handled securely
- SQLite databases are encrypted where necessary
- All network communications use HTTPS/TLS

## Dependencies

We regularly audit our dependencies for known vulnerabilities and update them accordingly. Automated security scanning is part of our CI pipeline.

## Code Signing

All releases are code-signed to ensure integrity and authenticity.