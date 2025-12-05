import { notificationService } from '../services/notificationService';
import PushNotification from 'react-native-push-notification';

// Mock the push notification module
jest.mock('react-native-push-notification', () => ({
  configure: jest.fn(),
  createChannel: jest.fn(),
  localNotificationSchedule: jest.fn(),
  cancelLocalNotifications: jest.fn(),
  cancelAllLocalNotifications: jest.fn(),
}));

describe('notificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('configure', () => {
    it('should configure push notifications', () => {
      notificationService.configure();
      expect(PushNotification.configure).toHaveBeenCalled();
    });
  });

  describe('createChannel', () => {
    it('should create a notification channel', () => {
      const channelId = 'test-channel';
      notificationService.createChannel(channelId);
      expect(PushNotification.createChannel).toHaveBeenCalledWith(
        expect.objectContaining({
          channelId,
        }),
        expect.any(Function)
      );
    });
  });

  describe('scheduleNotification', () => {
    it('should schedule a local notification', () => {
      const notification = {
        id: '1',
        title: 'Test Alarm',
        message: 'Time to wake up!',
        date: new Date(Date.now() + 60000),
        channelId: 'alarm-channel',
      };

      notificationService.scheduleNotification(notification);
      expect(PushNotification.localNotificationSchedule).toHaveBeenCalledWith(
        expect.objectContaining({
          id: notification.id,
          title: notification.title,
          message: notification.message,
          date: notification.date,
        })
      );
    });
  });

  describe('cancelNotification', () => {
    it('should cancel a specific notification', () => {
      const notificationId = '123';
      notificationService.cancelNotification(notificationId);
      expect(PushNotification.cancelLocalNotifications).toHaveBeenCalledWith({ id: notificationId });
    });
  });

  describe('cancelAllNotifications', () => {
    it('should cancel all notifications', () => {
      notificationService.cancelAllNotifications();
      expect(PushNotification.cancelAllLocalNotifications).toHaveBeenCalled();
    });
  });
});