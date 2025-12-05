import CryptoJS from 'crypto-js';
import { generateSecureRandom } from 'react-native-securerandom';

/**
 * Generates a cryptographically secure random nonce
 * @returns Promise resolving to a hex string nonce
 */
export const generateNonce = async (): Promise<string> => {
  try {
    const randomBytes = await generateSecureRandom(32);
    // Convert bytes to hex string without using Buffer
    return randomBytes.reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0'), '');
  } catch (error) {
    throw new Error('Failed to generate secure nonce');
  }
};

/**
 * Creates a hash using SHA-256
 * @param data - Data to hash
 * @returns Hex string hash
 */
export const createHash = (data: string): string => {
  return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
};

/**
 * Sanitizes user input by removing potentially dangerous characters
 * @param input - User input string
 * @returns Sanitized string
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  return input
    .replace(/<[^>]*>/g, '') // Remove complete HTML tags
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .trim();
};

/**
 * Validates if a string is a secure password
 * @param password - Password to validate
 * @returns Boolean indicating if password is valid
 */
export const isSecurePassword = (password: string): boolean => {
  if (!password) return false;
  
  // Minimum 8 characters, at least one uppercase, one lowercase, one number
  // Less restrictive by removing special character requirement
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};