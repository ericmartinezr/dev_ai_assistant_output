import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Constants
const SECURE_STORAGE_KEY = 'user_session_token';
const STORAGE_SALT_KEY = 'encryption_salt';

/**
 * Security Service
 * Handles encryption, secure storage, and cryptographic operations
 */

/**
 * Generates a random salt for encryption
 * @returns Base64 encoded salt
 */
export const generateSalt = async (): Promise<string> => {
  const salt = await Crypto.getRandomBytesAsync(16);
  return Buffer.from(salt).toString('base64');
};

/**
 * Derives a key from password and salt using PBKDF2
 * @param password User password
 * @param salt Random salt
 * @returns Derived key as hex string
 */
export const deriveKey = async (password: string, salt: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const saltBuffer = Buffer.from(salt, 'base64');
  
  const key = await Crypto.deriveKeyAsync(
    data,
    saltBuffer,
    {
      hash: 'SHA-256',
      iterations: 100000, // Increased iterations for better security
      length: 32, // 256 bits
    }
  );
  
  return key.toString('hex');
};

/**
 * Encrypts data using AES
 * @param data Data to encrypt
 * @param key Encryption key
 * @returns Base64 encoded encrypted data
 */
export const encryptData = async (data: string, key: string): Promise<string> => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const keyBuffer = Buffer.from(key, 'hex');
  
  const encrypted = await Crypto.encryptAsync(
    dataBuffer,
    keyBuffer,
    'AES-CBC'
  );
  
  return Buffer.from(encrypted).toString('base64');
};

/**
 * Decrypts data using AES
 * @param encryptedData Base64 encoded encrypted data
 * @param key Decryption key
 * @returns Decrypted data
 */
export const decryptData = async (encryptedData: string, key: string): Promise<string> => {
  const encryptedBuffer = Buffer.from(encryptedData, 'base64');
  const keyBuffer = Buffer.from(key, 'hex');
  
  const decrypted = await Crypto.decryptAsync(
    encryptedBuffer,
    keyBuffer,
    'AES-CBC'
  );
  
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
};

/**
 * Stores sensitive data securely based on platform
 * @param key Storage key
 * @param value Data to store
 */
export const setSecureItem = async (key: string, value: string): Promise<void> => {
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    await SecureStore.setItemAsync(key, value);
  } else {
    // Fallback for web - Note: This is less secure than native platforms
    console.warn('Secure storage not available on web, using AsyncStorage');
    await AsyncStorage.setItem(key, value);
  }
};

/**
 * Retrieves sensitive data securely based on platform
 * @param key Storage key
 * @returns Stored value or null
 */
export const getSecureItem = async (key: string): Promise<string | null> => {
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    return await SecureStore.getItemAsync(key);
  } else {
    // Fallback for web
    return await AsyncStorage.getItem(key);
  }
};

/**
 * Removes sensitive data securely
 * @param key Storage key
 */
export const removeSecureItem = async (key: string): Promise<void> => {
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    await SecureStore.deleteItemAsync(key);
  } else {
    // Fallback for web
    await AsyncStorage.removeItem(key);
  }
};

/**
 * Stores authentication token securely
 * @param token JWT or session token
 */
export const storeAuthToken = async (token: string): Promise<void> => {
  await setSecureItem(SECURE_STORAGE_KEY, token);
};

/**
 * Retrieves authentication token
 * @returns Auth token or null
 */
export const getAuthToken = async (): Promise<string | null> => {
  return await getSecureItem(SECURE_STORAGE_KEY);
};

/**
 * Clears authentication token
 */
export const clearAuthToken = async (): Promise<void> => {
  await removeSecureItem(SECURE_STORAGE_KEY);
};

/**
 * Hashes data using SHA-256
 * @param data Data to hash
 * @returns Hashed data as hex string
 */
export const hashData = async (data: string): Promise<string> => {
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    data
  );
  
  return hash;
};

/**
 * Generates a random secure token
 * @param length Length of token in bytes
 * @returns Base64 encoded random token
 */
export const generateSecureToken = async (length: number = 32): Promise<string> => {
  const bytes = await Crypto.getRandomBytesAsync(length);
  return Buffer.from(bytes).toString('base64');
};

/**
 * Validates data integrity by comparing hashes
 * @param data Original data
 * @param hash Hash to compare against
 * @returns Boolean indicating if data matches hash
 */
export const verifyDataIntegrity = async (
  data: string,
  hash: string
): Promise<boolean> => {
  try {
    const dataHash = await hashData(data);
    return dataHash === hash;
  } catch (error) {
    return false;
  }
};

// Named exports only - removing default export to avoid duplication