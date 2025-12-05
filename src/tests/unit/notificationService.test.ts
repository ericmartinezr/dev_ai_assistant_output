import { scheduleNotification, cancelNotification, cancelAllNotifications } from '../../services/notification';
import * as Notifee from '@notifee/react-native';

// Mock Notifee
jest.mock('@notifee/react-native', () => ({
  triggerNotification: jest.fn(),
  cancelNotification: jest.fn(),
  cancelAllNotifications: jest.fn(),
  EventType: { DELIVERED: 'delivered' },
  onForegroundEvent: jest.fn(),
  onBackgroundEvent: jest.fn(),
  displayNotification: jest.fn(),
}));

describe('Notification Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('scheduleNotification', () => {
    it('should schedule a notification with correct parameters', async () => {
      const notificationId = 'test-id';
      const title = 'Test Title';
      const body = 'Test Body';
      const timestamp = Date.now() + 60000; // 1 minute from now

      await scheduleNotification(notificationId, title, body, timestamp);

      expect(Notifee.displayNotification).toHaveBeenCalledWith({
        id: notificationId,
        title,
        body,
        android: {
          channelId: 'alarm-channel',
        },
      });
    });
  });

  describe('cancelNotification', () => {
    it('should cancel a notification by ID', async () => {
      const notificationId = 'test-id';
      
      await cancelNotification(notificationId);
      
      expect(Notifee.cancelNotification).toHaveBeenCalledWith(notificationId);
    });
  });

  describe('cancelAllNotifications', () => {
    it('should cancel all notifications', async () => {
      await cancelAllNotifications();
      
      expect(Notifee.cancelAllNotifications).toHaveBeenCalled();
    });
  });
});