import React, { useEffect } from 'react';
import PushNotification from 'react-native-push-notification';
import { Platform } from 'react-native';
import { useAppDispatch } from '../store';
import { updateAlarmStatus } from '../store/slices/alarmSlice';
import { ALARM_NOTIFICATION_CHANNEL } from '../constants';

const NotificationHandler: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Configure push notifications
    PushNotification.configure({
      onRegister: (token) => {
        // Token logging removed to prevent exposing sensitive credentials
      },
      onNotification: (notification: any) => {
        // Notification logging removed to prevent exposing sensitive data
        
        // Handle alarm notification
        if (notification.data?.alarmId) {
          const alarmId = notification.data.alarmId as string;
          dispatch(updateAlarmStatus({ id: alarmId, status: 'triggered' }));
        }

        // Required on iOS
        notification.finish(PushNotification.FetchResult.NoData);
      },
      onAction: (notification: any) => {
        // Action logging removed to prevent exposing data
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });

    // Create notification channel for Android
    if (Platform.OS === 'android') {
      PushNotification.createChannel(
        {
          channelId: ALARM_NOTIFICATION_CHANNEL,
          channelName: 'Alarm Notifications',
          channelDescription: 'Notification channel for alarm triggers',
          playSound: true,
          soundName: 'default',
          importance: 4,
          vibrate: true,
        },
        (created) => {
          // Channel creation logging removed to prevent exposing data
          if (!created) {
            // Handle channel creation failure silently
          }
        }
      );
    }

    // Cleanup function
    return () => {
      PushNotification.unregister();
    };
  }, [dispatch]);

  return null;
};

export default NotificationHandler;