import { scheduleNotification, cancelNotification, requestPermissions } from '../src/services/notificationService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, { TriggerType } from '@notifee/react-native';

// Mock dependencies
jest.mock('@notifee/react-native', () => ({
  __esModule: true,
  default: {
    requestPermission: jest.fn().mockResolvedValue({}),
    createChannel: jest.fn().mockResolvedValue('channelId'),
    createTriggerNotification: jest.fn().mockResolvedValue('notificationId'),
    cancelTriggerNotification: jest.fn().mockResolvedValue(undefined),
  },
  TriggerType: {
    TIMESTAMP: 'timestamp',
  },
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    setItem: jest.fn().mockResolvedValue(undefined),
    getItem: jest.fn().mockResolvedValue(null),
    removeItem: jest.fn().mockResolvedValue(undefined),
  },
}));

describe('notificationService', () => {
  const mockAlarm = {
    id: '1',
    title: 'Test Alarm',
    time: new Date(Date.now() + 60000), // 1 minute from now
    isEnabled: true,
    repeat: false,
    snoozeDuration: 5,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('requestPermissions', () => {
    it('should request notification permissions', async () => {
      await requestPermissions();
      expect(notifee.requestPermission).toHaveBeenCalled();
    });
  });

  describe('scheduleNotification', () => {
    it('should schedule a notification and store its ID', async () => {
      const notificationId = await scheduleNotification(mockAlarm);
      
      expect(notifee.createChannel).toHaveBeenCalledWith({
        id: 'alarm-channel',
        name: 'Alarm Notifications',
      });
      
      expect(notifee.createTriggerNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          title: mockAlarm.title,
          body: 'Your alarm is ringing!',
          android: expect.objectContaining({
            channelId: 'alarm-channel',
            pressAction: { id: 'default' },
          }),
        }),
        expect.objectContaining({
          type: TriggerType.TIMESTAMP,
          timestamp: mockAlarm.time.getTime(),
        })
      );
      
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        `alarm_notification_${mockAlarm.id}`,
        JSON.stringify(notificationId)
      );
      
      expect(notificationId).toBeDefined();
    });

    it('should throw an error if alarm time is in the past', async () => {
      const pastAlarm = { ...mockAlarm, time: new Date(Date.now() - 60000) };
      
      await expect(scheduleNotification(pastAlarm))
        .rejects
        .toThrow('Alarm time must be in the future');
    });
  });

  describe('cancelNotification', () => {
    it('should cancel a scheduled notification and remove its ID from storage', async () => {
      const notificationId = 'test-notification-id';
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(notificationId));
      
      await cancelNotification(mockAlarm.id);
      
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(`alarm_notification_${mockAlarm.id}`);
      expect(notifee.cancelTriggerNotification).toHaveBeenCalledWith(notificationId);
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(`alarm_notification_${mockAlarm.id}`);
    });

    it('should not call cancel if no notification ID exists', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
      
      await cancelNotification(mockAlarm.id);
      
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(`alarm_notification_${mockAlarm.id}`);
      expect(notifee.cancelTriggerNotification).not.toHaveBeenCalled();
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(`alarm_notification_${mockAlarm.id}`);
    });
  });
});