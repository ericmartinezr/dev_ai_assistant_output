import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENV } from '../config/env';

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  [LogLevel.ERROR]: 0,
  [LogLevel.WARN]: 1,
  [LogLevel.INFO]: 2,
  [LogLevel.DEBUG]: 3,
};

const getLogLevel = (): LogLevel => {
  const logLevel = Object.values(LogLevel).find(level => level === ENV.LOG_LEVEL);
  return logLevel || LogLevel.INFO;
};

const shouldLog = (level: LogLevel): boolean => {
  const currentLevel = getLogLevel();
  return LOG_LEVEL_PRIORITY[level] <= LOG_LEVEL_PRIORITY[currentLevel];
};

const formatMessage = (level: LogLevel, message: string, metadata?: Record<string, any>): string => {
  const timestamp = new Date().toISOString();
  const baseMessage = `${timestamp} [${level.toUpperCase()}] ${message}`;
  
  if (metadata) {
    return `${baseMessage} ${JSON.stringify(metadata)}`;
  }
  
  return baseMessage;
};

const logToConsole = (level: LogLevel, message: string, metadata?: Record<string, any>): void => {
  if (!shouldLog(level)) return;
  
  const formattedMessage = formatMessage(level, message, metadata);
  
  switch (level) {
    case LogLevel.ERROR:
      console.error(formattedMessage);
      break;
    case LogLevel.WARN:
      console.warn(formattedMessage);
      break;
    case LogLevel.INFO:
      console.info(formattedMessage);
      break;
    case LogLevel.DEBUG:
      console.debug(formattedMessage);
      break;
    default:
      console.log(formattedMessage);
  }
};

const logToFile = async (level: LogLevel, message: string, metadata?: Record<string, any>): Promise<void> => {
  if (!shouldLog(level) || !ENV.ENABLE_FILE_LOGGING) return;
  
  try {
    const formattedMessage = formatMessage(level, message, metadata);
    const existingLogs = await AsyncStorage.getItem('APP_LOGS');
    const logs = existingLogs ? JSON.parse(existingLogs) : [];
    logs.push({
      timestamp: new Date().toISOString(),
      level,
      message,
      metadata,
      platform: Platform.OS,
    });
    
    // Keep only last 1000 logs to prevent storage bloat
    const trimmedLogs = logs.slice(-1000);
    await AsyncStorage.setItem('APP_LOGS', JSON.stringify(trimmedLogs));
  } catch (error) {
    // Log the actual error for debugging purposes
    console.warn('Failed to write log to file:', error);
  }
};

export const logger = {
  error: (message: string, metadata?: Record<string, any>): void => {
    logToConsole(LogLevel.ERROR, message, metadata);
    logToFile(LogLevel.ERROR, message, metadata);
  },
  
  warn: (message: string, metadata?: Record<string, any>): void => {
    logToConsole(LogLevel.WARN, message, metadata);
    logToFile(LogLevel.WARN, message, metadata);
  },
  
  info: (message: string, metadata?: Record<string, any>): void => {
    logToConsole(LogLevel.INFO, message, metadata);
    logToFile(LogLevel.INFO, message, metadata);
  },
  
  debug: (message: string, metadata?: Record<string, any>): void => {
    logToConsole(LogLevel.DEBUG, message, metadata);
    logToFile(LogLevel.DEBUG, message, metadata);
  },
  
  getLogs: async (): Promise<string> => {
    try {
      const logs = await AsyncStorage.getItem('APP_LOGS');
      return logs ? JSON.stringify(JSON.parse(logs), null, 2) : 'No logs found';
    } catch (error) {
      return 'Failed to retrieve logs';
    }
  },
  
  clearLogs: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem('APP_LOGS');
    } catch (error) {
      console.warn('Failed to clear logs');
    }
  },
};