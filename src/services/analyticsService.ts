import { Platform } from 'react-native';
import { ENV } from '../config/env';
import { logger } from '../utils/logger';

interface EventParams {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Analytics service for tracking user events and interactions
 * Provides methods for logging various events like screen views, 
 * login attempts, and alarm interactions
 */
class AnalyticsService {
  private isInitialized = false;
  private userId: string | null = null;

  async initialize(): Promise<void> {
    try {
      if (this.isInitialized) return;
      
      // In a real implementation, initialize your analytics SDK here
      // Example: await firebase.analytics().setAnalyticsCollectionEnabled(true);
      
      this.isInitialized = true;
      logger.info('Analytics service initialized');
    } catch (error) {
      logger.error('Failed to initialize analytics', error);
    }
  }

  async setUserId(userId: string): Promise<void> {
    try {
      this.userId = userId;
      // Example: await firebase.analytics().setUserId(userId);
      logger.info('User ID set for analytics', { userId });
    } catch (error) {
      logger.error('Failed to set user ID for analytics', error);
    }
  }

  async logEvent(eventName: string, params?: EventParams): Promise<void> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Filter out undefined values to prevent issues with analytics SDKs
      const filteredParams: EventParams = {};
      if (params) {
        Object.keys(params).forEach(key => {
          if (params[key] !== undefined) {
            filteredParams[key] = params[key];
          }
        });
      }

      const enhancedParams = {
        ...filteredParams,
        platform: Platform.OS,
        app_version: ENV.APP_VERSION,
        userId: this.userId || 'anonymous',
      };

      // Example: await firebase.analytics().logEvent(eventName, enhancedParams);
      logger.info(`Analytics event: ${eventName}`, enhancedParams);
    } catch (error) {
      logger.error(`Failed to log event: ${eventName}`, error);
    }
  }

  async logScreenView(screenName: string): Promise<void> {
    try {
      await this.logEvent('screen_view', { screen_name: screenName });
    } catch (error) {
      logger.error(`Failed to log screen view: ${screenName}`, error);
    }
  }

  async logLogin(method: string): Promise<void> {
    try {
      await this.logEvent('login', { method });
    } catch (error) {
      logger.error('Failed to log login event', error);
    }
  }

  async logSignUp(method: string): Promise<void> {
    try {
      await this.logEvent('sign_up', { method });
    } catch (error) {
      logger.error('Failed to log sign up event', error);
    }
  }

  async logAlarmCreated(alarmId: string): Promise<void> {
    try {
      await this.logEvent('alarm_created', { alarm_id: alarmId });
    } catch (error) {
      logger.error('Failed to log alarm created event', error);
    }
  }

  async logAlarmTriggered(alarmId: string): Promise<void> {
    try {
      await this.logEvent('alarm_triggered', { alarm_id: alarmId });
    } catch (error) {
      logger.error('Failed to log alarm triggered event', error);
    }
  }

  async logAlarmSnoozed(alarmId: string): Promise<void> {
    try {
      await this.logEvent('alarm_snoozed', { alarm_id: alarmId });
    } catch (error) {
      logger.error('Failed to log alarm snoozed event', error);
    }
  }

  async logAlarmDismissed(alarmId: string): Promise<void> {
    try {
      await this.logEvent('alarm_dismissed', { alarm_id: alarmId });
    } catch (error) {
      logger.error('Failed to log alarm dismissed event', error);
    }
  }

  async logWhatsAppGroupSelected(groupId: string): Promise<void> {
    try {
      await this.logEvent('whatsapp_group_selected', { group_id: groupId });
    } catch (error) {
      logger.error('Failed to log WhatsApp group selected event', error);
    }
  }
}

export const analyticsService = new AnalyticsService();