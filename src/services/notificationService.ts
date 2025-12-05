import notifee, { TriggerType, TimestampTrigger, RepeatFrequency, AndroidImportance } from '@notifee/react-native';
import { Platform } from 'react-native';
import { Alarm } from '../types';

// Initialize Notifee
export const initializeNotificationService = async (): Promise<void> => {
  try {
    await notifee.requestPermission();
    
    // Create default notification channel for Android
    if (Platform.OS === 'android') {
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });
    }
  } catch (error) {
    console.error('Failed to initialize notification service:', error);
  }
};

// Create a notification for an alarm
export const createAlarmNotification = async (alarm: Alarm): Promise<string> => {
  try {
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: alarm.time.getTime(),
      repeatFrequency: alarm.repeat ? RepeatFrequency.DAILY : undefined,
    };

    const notificationId = await notifee.createTriggerNotification(
      {
        id: alarm.id.toString(),
        title: alarm.label || 'Alarm',
        body: 'Your alarm is ringing',
        android: {
          channelId: 'default',
          pressAction: {
            id: 'default',
          },
        },
        ios: {
          sound: 'default',
        },
      },
      trigger
    );

    return notificationId;
  } catch (error) {
    console.error('Failed to create alarm notification:', error);
    throw error;
  }
};

// Cancel a specific notification
export const cancelNotification = async (notificationId: string): Promise<void> => {
  try {
    await notifee.cancelNotification(notificationId);
  } catch (error) {
    console.error('Failed to cancel notification:', error);
    throw error;
  }
};

// Cancel all notifications
export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await notifee.cancelAllNotifications();
  } catch (error) {
    console.error('Failed to cancel all notifications:', error);
    throw error;
  }
};

// Get all scheduled notifications
export const getScheduledNotifications = async (): Promise<Notification[]> => {
  try {
    const notifications = await notifee.getTriggerNotifications();
    return notifications;
  } catch (error) {
    console.error('Failed to get scheduled notifications:', error);
    throw error;
  }
};