import firestore from '@react-native-firebase/firestore';
import { logger } from '../utils/logger';

export interface RemoteConfig {
  maintenance_mode: boolean;
  api_version: string;
  max_alarms_per_user: number;
  whatsapp_group_limit: number;
  notification_cooldown_minutes: number;
}

// Firestore collection and document names
const CONFIG_COLLECTION = 'config';
const REMOTE_CONFIG_DOC = 'remote_config';

const DEFAULT_CONFIG: RemoteConfig = {
  maintenance_mode: false,
  api_version: '1.0.0',
  max_alarms_per_user: 10,
  whatsapp_group_limit: 5,
  notification_cooldown_minutes: 5,
};

let currentConfig: RemoteConfig = DEFAULT_CONFIG;

export const remoteConfigService = {
  /**
   * Fetches the remote configuration from Firestore
   * @returns Promise<RemoteConfig> The current remote configuration
   */
  async fetchConfig(): Promise<RemoteConfig> {
    try {
      const configDoc = await firestore().collection(CONFIG_COLLECTION).doc(REMOTE_CONFIG_DOC).get();
      
      if (configDoc.exists) {
        // Validate and merge config data with defaults
        const data = configDoc.data();
        currentConfig = {
          maintenance_mode: typeof data?.maintenance_mode === 'boolean' ? data.maintenance_mode : DEFAULT_CONFIG.maintenance_mode,
          api_version: typeof data?.api_version === 'string' ? data.api_version : DEFAULT_CONFIG.api_version,
          max_alarms_per_user: typeof data?.max_alarms_per_user === 'number' ? data.max_alarms_per_user : DEFAULT_CONFIG.max_alarms_per_user,
          whatsapp_group_limit: typeof data?.whatsapp_group_limit === 'number' ? data.whatsapp_group_limit : DEFAULT_CONFIG.whatsapp_group_limit,
          notification_cooldown_minutes: typeof data?.notification_cooldown_minutes === 'number' ? data.notification_cooldown_minutes : DEFAULT_CONFIG.notification_cooldown_minutes,
        };
        logger.info('Remote config fetched successfully', { config: currentConfig });
      } else {
        logger.warn('Remote config document not found, using defaults');
        currentConfig = DEFAULT_CONFIG;
      }
      
      return currentConfig;
    } catch (error) {
      logger.error('Failed to fetch remote config', { error });
      // Reset to default config on error to avoid stale configuration
      currentConfig = DEFAULT_CONFIG;
      return DEFAULT_CONFIG;
    }
  },

  /**
   * Gets the current remote configuration
   * @returns RemoteConfig The current configuration
   */
  getConfig(): RemoteConfig {
    return currentConfig;
  },

  /**
   * Checks if maintenance mode is enabled
   * @returns boolean True if maintenance mode is enabled
   */
  isMaintenanceMode(): boolean {
    return currentConfig.maintenance_mode;
  },

  /**
   * Gets the maximum number of alarms allowed per user
   * @returns number The maximum alarms per user
   */
  getMaxAlarmsPerUser(): number {
    return currentConfig.max_alarms_per_user;
  },

  /**
   * Gets the WhatsApp group limit
   * @returns number The WhatsApp group limit
   */
  getWhatsAppGroupLimit(): number {
    return currentConfig.whatsapp_group_limit;
  },

  /**
   * Gets the notification cooldown period in minutes
   * @returns number The notification cooldown in minutes
   */
  getNotificationCooldownMinutes(): number {
    return currentConfig.notification_cooldown_minutes;
  },
};