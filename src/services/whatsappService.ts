import { Linking } from 'react-native';

/**
 * Service for handling WhatsApp-related functionality
 */

/**
 * Sanitizes phone number for WhatsApp URL scheme
 * Removes all non-digit characters except the leading +
 * @param phoneNumber - Phone number in international format (e.g., +1234567890)
 * @returns Sanitized phone number
 */
const sanitizePhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber || typeof phoneNumber !== 'string') {
    throw new Error('Invalid phone number provided');
  }
  
  // Remove all non-digit characters except the leading +
  const sanitized = phoneNumber.replace(/(?!^)\D/g, '');
  
  // Validate that the phone number has sufficient digits
  const digitsOnly = sanitized.replace(/\D/g, '');
  if (digitsOnly.length < 7) {
    throw new Error('Phone number is too short');
  }
  
  return sanitized;
};

/**
 * Opens WhatsApp with a specific phone number
 * @param phoneNumber - Phone number in international format (e.g., +1234567890)
 * @returns Promise that resolves if WhatsApp opens successfully
 */
export const openWhatsAppWithNumber = async (phoneNumber: string): Promise<void> => {
  const sanitizedNumber = sanitizePhoneNumber(phoneNumber);
  const url = `whatsapp://send?phone=${sanitizedNumber}`;
  
  const supported = await Linking.canOpenURL(url);
  if (supported) {
    await Linking.openURL(url);
  } else {
    throw new Error('WhatsApp is not installed on this device');
  }
};

/**
 * Opens WhatsApp with a pre-filled message
 * @param phoneNumber - Phone number in international format
 * @param message - Pre-filled message text
 * @returns Promise that resolves if WhatsApp opens successfully
 */
export const openWhatsAppWithMessage = async (phoneNumber: string, message: string): Promise<void> => {
  const sanitizedNumber = sanitizePhoneNumber(phoneNumber);
  const encodedMessage = encodeURIComponent(message);
  const url = `whatsapp://send?phone=${sanitizedNumber}&text=${encodedMessage}`;
  
  const supported = await Linking.canOpenURL(url);
  if (supported) {
    await Linking.openURL(url);
  } else {
    throw new Error('WhatsApp is not installed on this device');
  }
};

/**
 * Checks if WhatsApp is installed on the device
 * @returns Promise that resolves to true if WhatsApp is installed
 */
export const isWhatsAppInstalled = async (): Promise<boolean> => {
  const url = 'whatsapp://';
  return await Linking.canOpenURL(url);
};