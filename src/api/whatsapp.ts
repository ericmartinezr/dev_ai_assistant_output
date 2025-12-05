import { Linking } from 'react-native';

/**
 * Sends a WhatsApp message to a specific phone number
 * @param phoneNumber - Phone number in international format (e.g., +1234567890)
 * @param message - Pre-filled message text
 * @returns Promise that resolves if the WhatsApp app is opened successfully
 */
export const sendWhatsAppMessage = async (
  phoneNumber: string,
  message: string
): Promise<void> => {
  const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

  const supported = await Linking.canOpenURL(url);

  if (supported) {
    return Linking.openURL(url);
  } else {
    throw new Error('WhatsApp is not installed on this device');
  }
};

/**
 * Opens WhatsApp chat with a specific phone number (without pre-filled message)
 * @param phoneNumber - Phone number in international format (e.g., +1234567890)
 * @returns Promise that resolves if the WhatsApp app is opened successfully
 */
export const openWhatsAppChat = async (phoneNumber: string): Promise<void> => {
  const url = `whatsapp://send?phone=${phoneNumber}`;

  const supported = await Linking.canOpenURL(url);

  if (supported) {
    return Linking.openURL(url);
  } else {
    throw new Error('WhatsApp is not installed on this device');
  }
};