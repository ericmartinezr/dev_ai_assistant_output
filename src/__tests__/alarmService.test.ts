import { alarmService } from '../services/alarmService';
import { Alarm } from '../types/alarm';

// Mock SQLite dependency
jest.mock('react-native-sqlite-storage', () => ({
  openDatabase: jest.fn().mockReturnValue({
    transaction: jest.fn((callback) => callback({
      executeSql: jest.fn().mockResolvedValue([{}, {}]),
    })),
  }),
}));

// Mock PushNotification dependency
jest.mock('react-native-push-notification', () => ({
  configure: jest.fn(),
  localNotificationSchedule: jest.fn(),
  cancelLocalNotifications: jest.fn(),
}));

describe('alarmService', () => {
  const mockAlarm: Alarm = {
    id: '1',
    title: 'Test Alarm',
    time: '09:00',
    enabled: true,
    days: ['monday', 'wednesday', 'friday'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createAlarm', () => {
    it('should create a new alarm', async () => {
      const result = await alarmService.createAlarm(mockAlarm);
      expect(result).toEqual(expect.objectContaining({
        ...mockAlarm,
        id: expect.any(String),
      }));
    });
  });

  describe('getAlarms', () => {
    it('should retrieve all alarms', async () => {
      const alarms = await alarmService.getAlarms();
      expect(Array.isArray(alarms)).toBe(true);
    });
  });

  describe('getAlarmById', () => {
    it('should retrieve an alarm by ID', async () => {
      const alarm = await alarmService.getAlarmById('1');
      expect(alarm).toBeDefined();
      if (alarm) {
        expect(alarm.id).toBe('1');
      }
    });
  });

  describe('updateAlarm', () => {
    it('should update an existing alarm', async () => {
      const updatedAlarm = await alarmService.updateAlarm('1', {
        ...mockAlarm,
        title: 'Updated Alarm',
      });
      expect(updatedAlarm).toEqual(expect.objectContaining({
        id: '1',
        title: 'Updated Alarm',
      }));
    });
  });

  describe('deleteAlarm', () => {
    it('should delete an alarm', async () => {
      const result = await alarmService.deleteAlarm('1');
      expect(result).toBe(true);
    });
  });

  describe('scheduleAlarmNotification', () => {
    it('should schedule a notification for an alarm', () => {
      alarmService.scheduleAlarmNotification(mockAlarm);
      // Verify that the scheduling function was called
      const PushNotification = require('react-native-push-notification');
      expect(PushNotification.localNotificationSchedule).toHaveBeenCalled();
    });
  });

  describe('cancelAlarmNotification', () => {
    it('should cancel a scheduled notification', () => {
      alarmService.cancelAlarmNotification('1');
      const PushNotification = require('react-native-push-notification');
      expect(PushNotification.cancelLocalNotifications).toHaveBeenCalledWith({ id: '1' });
    });
  });
});