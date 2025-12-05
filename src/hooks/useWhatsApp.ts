import { useState, useCallback } from 'react';
import { Linking } from 'react-native';
import { validatePhoneNumber } from '../utils/validation';
import { logError } from '../utils/logger';

interface WhatsAppContact {
  phoneNumber: string;
  message?: string;
}

interface UseWhatsAppHook {
  isAvailable: boolean;
  checkAvailability: () => Promise<boolean>;
  sendMessage: (contact: WhatsAppContact) => Promise<boolean>;
  formatPhoneNumber: (phoneNumber: string) => string;
}

export const useWhatsApp = (): UseWhatsAppHook => {
  const [isAvailable, setIsAvailable] = useState<boolean>(false);

  const checkAvailability = useCallback(async (): Promise<boolean> => {
    try {
      const supported = await Linking.canOpenURL('whatsapp://send?text=hello');
      setIsAvailable(supported);
      return supported;
    } catch (error) {
      logError('WhatsApp availability check failed', error);
      setIsAvailable(false);
      return false;
    }
  }, []);

  const formatPhoneNumber = useCallback((phoneNumber: string): string => {
    return phoneNumber.replace(/[^0-9]/g, '');
  }, []);

  const sendMessage = useCallback(async ({ phoneNumber, message = '' }: WhatsAppContact): Promise<boolean> => {
    try {
      if (!validatePhoneNumber(phoneNumber)) {
        throw new Error('Invalid phone number');
      }

      const formattedNumber = formatPhoneNumber(phoneNumber);
      const url = `whatsapp://send?phone=${formattedNumber}&text=${encodeURIComponent(message)}`;
      
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        throw new Error('WhatsApp is not installed');
      }
      
      await Linking.openURL(url);
      return true;
    } catch (error) {
      logError('Failed to send WhatsApp message', error);
      return false;
    }
  }, [formatPhoneNumber]);

  return {
    isAvailable,
    checkAvailability,
    sendMessage,
    formatPhoneNumber
  };
};