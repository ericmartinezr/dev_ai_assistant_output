import Config from 'react-native-config';

// Environment configuration with type safety
interface EnvConfig {
  // API Configuration
  API_URL: string;
  API_TIMEOUT: number;
  
  // Authentication - NOTE: These should be handled server-side in production
  JWT_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
  
  // Firebase
  FIREBASE_API_KEY: string;
  FIREBASE_AUTH_DOMAIN: string;
  FIREBASE_PROJECT_ID: string;
  FIREBASE_STORAGE_BUCKET: string;
  FIREBASE_MESSAGING_SENDER_ID: string;
  FIREBASE_APP_ID: string;
  
  // WhatsApp Integration - NOTE: Access tokens should be handled server-side in production
  WHATSAPP_BUSINESS_ID: string;
  WHATSAPP_API_URL: string;
  WHATSAPP_ACCESS_TOKEN: string;
  
  // Security - NOTE: Keys should be generated at runtime or stored securely
  SECURE_STORAGE_KEY: string;
  ENCRYPTION_KEY: string;
  
  // Analytics
  SENTRY_DSN: string;
  
  // Environment
  NODE_ENV: 'development' | 'production' | 'test';
  DEBUG: boolean;
}

// Validate required environment variables
const validateEnv = (config: Partial<EnvConfig>): config is EnvConfig => {
  const requiredVars: (keyof EnvConfig)[] = [
    'API_URL',
    'API_TIMEOUT',
    'JWT_SECRET',
    'REFRESH_TOKEN_SECRET',
    'FIREBASE_API_KEY',
    'FIREBASE_AUTH_DOMAIN',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_STORAGE_BUCKET',
    'FIREBASE_MESSAGING_SENDER_ID',
    'FIREBASE_APP_ID',
    'WHATSAPP_BUSINESS_ID',
    'WHATSAPP_API_URL',
    'WHATSAPP_ACCESS_TOKEN',
    'SECURE_STORAGE_KEY',
    'ENCRYPTION_KEY',
    'NODE_ENV',
  ];

  const missingVars = requiredVars.filter(varName => {
    const value = config[varName];
    return value === undefined || value === '';
  });
  
  if (missingVars.length > 0) {
    throw new Error(`Missing environment variables: ${missingVars.join(', ')}`);
  }

  return true;
};

// Environment configuration
const envConfig: Partial<EnvConfig> = {
  // API Configuration
  API_URL: Config.API_URL,
  API_TIMEOUT: Config.API_TIMEOUT !== undefined ? Number(Config.API_TIMEOUT) : 10000,
  
  // Authentication
  JWT_SECRET: Config.JWT_SECRET,
  REFRESH_TOKEN_SECRET: Config.REFRESH_TOKEN_SECRET,
  
  // Firebase
  FIREBASE_API_KEY: Config.FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN: Config.FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID: Config.FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET: Config.FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID: Config.FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID: Config.FIREBASE_APP_ID,
  
  // WhatsApp Integration
  WHATSAPP_BUSINESS_ID: Config.WHATSAPP_BUSINESS_ID,
  WHATSAPP_API_URL: Config.WHATSAPP_API_URL || 'https://graph.facebook.com/v17.0',
  WHATSAPP_ACCESS_TOKEN: Config.WHATSAPP_ACCESS_TOKEN,
  
  // Security
  SECURE_STORAGE_KEY: Config.SECURE_STORAGE_KEY,
  ENCRYPTION_KEY: Config.ENCRYPTION_KEY,
  
  // Analytics
  SENTRY_DSN: Config.SENTRY_DSN,
  
  // Environment
  NODE_ENV: (Config.NODE_ENV as 'development' | 'production' | 'test') || 'development',
  DEBUG: Config.DEBUG === 'true',
};

// Validate and export configuration
validateEnv(envConfig);

export default envConfig as EnvConfig;