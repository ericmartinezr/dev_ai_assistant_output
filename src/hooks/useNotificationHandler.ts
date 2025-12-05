import { useEffect } from 'react';
import PushNotification, { PushNotificationObject } from 'react-native-push-notification';
import { Platform } from 'react-native';
import { navigate } from '../utils/navigationUtils';

// Define TypeScript interfaces
interface NotificationToken {
  os: string;
  token: string;
}

interface NotificationData {
  alarmId?: string;
  [key: string]: any;
}

interface NotificationPayload extends PushNotificationObject {
  userInteraction?: boolean;
  data?: NotificationData;
  finish?: (result: any) => void;
}

const useNotificationHandler = () => {
  useEffect(() => {
    // Configure push notifications
    PushNotification.configure({
      onRegister: (token: NotificationToken) => {
        // Handle token registration (typically send to server)
        // Removed sensitive logging for security compliance
      },
      onNotification: (notification: NotificationPayload) => {
        // Handle notification receipt
        // Removed sensitive logging for security compliance
        
        if (notification.userInteraction) {
          // Handle notification tap with proper optional chaining
          const alarmId = notification.data?.alarmId;
          if (alarmId) {
            navigate('AlarmDetail', { alarmId });
          }
        }
        
        // Properly finish notification handling
        if (notification.finish) {
          notification.finish(PushNotification.FetchResult.NoData);
        }
      },
      onAction: (notification: NotificationPayload) => {
        // Handle notification action
        // Removed sensitive logging for security compliance
      },
      onRegistrationError: (err: any) => {
        // Handle registration errors
        // Removed sensitive logging for security compliance
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      // Request permissions for both platforms
      requestPermissions: true,
    });

    // Create notification channel for Android
    if (Platform.OS === 'android') {
      PushNotification.createChannel(
        {
          channelId: 'alarm-notifications',
          channelName: 'Alarm Notifications',
          channelDescription: 'Notifications for scheduled alarms',
          playSound: true,
          soundName: 'default',
          importance: 4,
          vibrate: true,
        },
        () => {
          // Channel creation callback (removed unnecessary logging)
        }
      );
    }

    // Cleanup function - avoid global unregister that removes all listeners
    return () => {
      // Intentionally left empty to preserve other listeners
    };
  }, []);
};

export default useNotificationHandler;