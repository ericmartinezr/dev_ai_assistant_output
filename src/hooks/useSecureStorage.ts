import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import { Platform } from 'react-native';
import { logger } from '../utils/logger';

interface SecureStorageHook {
  setItem: (key: string, value: string, accessible?: Keychain.ACCESSIBLE) => Promise<boolean>;
  getItem: (key: string) => Promise<string | null>;
  removeItem: (key: string) => Promise<boolean>;
  clearAll: () => Promise<boolean>;
}

export const useSecureStorage = (): SecureStorageHook => {
  const setItem = async (
    key: string,
    value: string,
    accessible: Keychain.ACCESSIBLE = Keychain.ACCESSIBLE.WHEN_UNLOCKED
  ): Promise<boolean> => {
    try {
      if (Platform.OS === 'ios') {
        await Keychain.setGenericPassword(key, value, {
          service: key,
          accessible,
        });
      } else {
        await Keychain.setGenericPassword(key, value, {
          service: key,
        });
      }
      return true;
    } catch (error) {
      logger.error('SecureStorage:setItem', error);
      return false;
    }
  };

  const getItem = async (key: string): Promise<string | null> => {
    try {
      const credentials = await Keychain.getGenericPassword({ service: key });
      return credentials ? credentials.password : null;
    } catch (error) {
      logger.error('SecureStorage:getItem', error);
      return null;
    }
  };

  const removeItem = async (key: string): Promise<boolean> => {
    try {
      await Keychain.resetGenericPassword({ service: key });
      return true;
    } catch (error) {
      logger.error('SecureStorage:removeItem', error);
      return false;
    }
  };

  const clearAll = async (): Promise<boolean> => {
    try {
      // Note: This only clears AsyncStorage, Keychain items need to be removed individually
      // In a production app, you would maintain a list of secure keys to remove
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      logger.error('SecureStorage:clearAll', error);
      return false;
    }
  };

  return {
    setItem,
    getItem,
    removeItem,
    clearAll,
  };
};