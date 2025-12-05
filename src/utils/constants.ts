// API Constants
/**
 * Base URL for the backend API.
 * Uses environment variable or defaults to production URL.
 */
export const API_BASE_URL = (process.env.API_BASE_URL as string) || 'https://api.alarmnotifier.com';
/**
 * Timeout duration for API requests in milliseconds.
 * Configurable via environment variable.
 */
export const API_TIMEOUT = Number(process.env.API_TIMEOUT) || 10000;

// Firebase Constants
/**
 * Firebase configuration object.
 * Validates presence of all required environment variables.
 */
export const FIREBASE_CONFIG = {
  apiKey: process.env.FIREBASE_API_KEY as string,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN as string,
  projectId: process.env.FIREBASE_PROJECT_ID as string,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID as string,
  appId: process.env.FIREBASE_APP_ID as string,
};

// Storage Keys
/**
 * Keys used for local storage.
 * Immutable via const assertion.
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'userData',
  ALARM_DATA: 'alarmData',
} as const;

// Notification Constants
/**
 * Notification channel identifiers.
 * Immutable via const assertion.
 */
export const NOTIFICATION_CHANNELS = {
  ALARM: 'alarm_channel',
  REMINDER: 'reminder_channel',
} as const;

// WhatsApp Service Constants
/**
 * WhatsApp API URL.
 * Cast to string for type safety.
 */
export const WHATSAPP_API_URL = (process.env.WHATSAPP_API_URL as string) || 'https://api.whatsapp.com/send';
/**
 * Rate limit for WhatsApp API requests.
 * Unit: requests per minute.
 */
export const WHATSAPP_RATE_LIMIT = 5;
/**
 * Number of retry attempts for failed WhatsApp API requests.
 */
export const WHATSAPP_RETRY_ATTEMPTS = 3;
/**
 * Delay between retry attempts in milliseconds.
 */
export const WHATSAPP_RETRY_DELAY = 1000;

// Alarm Constants
/**
 * Options for alarm repeat frequency.
 * Immutable via const assertion.
 */
export const ALARM_REPEAT_OPTIONS = [
  { label: 'Never', value: 'never' },
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
] as const;

/**
 * Default alarm sound identifier.
 */
export const DEFAULT_ALARM_SOUND = 'default';

// Validation Constants
/**
 * Validation rules and regex patterns.
 * Immutable via const assertion.
 */
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ as const,
  PASSWORD_MIN_LENGTH: 8,
  PHONE_REGEX: /^\+?[1-9]\d{1,14}$/ as const,
} as const;

// Date/Time Format Constants
/**
 * Date and time format strings.
 * Immutable via const assertion.
 */
export const DATE_FORMATS = {
  DISPLAY: 'MMM d, yyyy',
  DISPLAY_WITH_TIME: 'MMM d, yyyy h:mm a',
  ISO: 'yyyy-MM-dd',
  TIME: 'HH:mm',
} as const;

// Runtime validation for required environment variables
const requiredEnvVars = [
  'FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_STORAGE_BUCKET',
  'FIREBASE_MESSAGING_SENDER_ID',
  'FIREBASE_APP_ID',
];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});