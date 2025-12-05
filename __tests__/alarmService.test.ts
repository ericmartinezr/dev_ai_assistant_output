import { Alarm, AlarmFrequency, AlarmStatus } from '../src/types/alarm';
import { createAlarm, updateAlarm, deleteAlarm, getAlarms, snoozeAlarm } from '../src/services/alarmService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

describe('alarmService', () => {
  const mockAlarms: Alarm[] = [
    {
      id: '1',
      title: 'Morning Alarm',
      time: '07:00',
      enabled: true,
      frequency: [AlarmFrequency.Monday, AlarmFrequency.Tuesday],
      status: AlarmStatus.ACTIVE,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    },
    {
      id: '2',
      title: 'Evening Alarm',
      time: '19:30',
      enabled: false,
      frequency: [AlarmFrequency.Daily],
      status: AlarmStatus.INACTIVE,
      createdAt: new Date('2023-01-02'),
      updatedAt: new Date('2023-01-02'),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAlarms', () => {
    it('should return parsed alarms from storage', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockAlarms));
      
      const result = await getAlarms();
      
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('alarms');
      expect(result).toEqual(mockAlarms);
    });

    it('should return empty array when no alarms exist', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      
      const result = await getAlarms();
      
      expect(result).toEqual([]);
    });

    it('should handle JSON parsing errors', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('invalid json');
      
      const result = await getAlarms();
      
      expect(result).toEqual([]);
    });
  });

  describe('createAlarm', () => {
    it('should create and save a new alarm', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]));
      
      const newAlarm: Omit<Alarm, 'id' | 'createdAt' | 'updatedAt'> = {
        title: 'Test Alarm',
        time: '10:00',
        enabled: true,
        frequency: [AlarmFrequency.Weekdays],
        status: AlarmStatus.ACTIVE,
      };
      
      const result = await createAlarm(newAlarm);
      
      expect(result).toMatchObject({
        ...newAlarm,
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'alarms',
        expect.any(String)
      );
    });
  });

  describe('updateAlarm', () => {
    it('should update an existing alarm', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockAlarms));
      
      const updatedData = { title: 'Updated Alarm' };
      const result = await updateAlarm('1', updatedData);
      
      expect(result).toMatchObject({
        ...mockAlarms[0],
        ...updatedData,
        updatedAt: expect.any(Date),
      });
      
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'alarms',
        expect.any(String)
      );
    });

    it('should return null for non-existent alarm', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockAlarms));
      
      const result = await updateAlarm('999', { title: 'Updated' });
      
      expect(result).toBeNull();
    });
  });

  describe('deleteAlarm', () => {
    it('should delete an existing alarm', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockAlarms));
      
      const result = await deleteAlarm('1');
      
      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'alarms',
        JSON.stringify([mockAlarms[1]])
      );
    });

    it('should return false for non-existent alarm', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockAlarms));
      
      const result = await deleteAlarm('999');
      
      expect(result).toBe(false);
    });
  });

  describe('snoozeAlarm', () => {
    it('should snooze an alarm by updating its time', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockAlarms));
      
      // Mock Date to control time values
      const mockDate = new Date('2023-01-01T07:00:00');
      jest.useFakeTimers().setSystemTime(mockDate);
      
      const result = await snoozeAlarm('1', 5);
      
      expect(result).toMatchObject({
        ...mockAlarms[0],
        time: '07:05',
        updatedAt: expect.any(Date),
      });
      
      jest.useRealTimers();
    });

    it('should handle snooze across hour boundary', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockAlarms));
      
      const mockDate = new Date('2023-01-01T07:58:00');
      jest.useFakeTimers().setSystemTime(mockDate);
      
      const result = await snoozeAlarm('1', 5);
      
      expect(result).toMatchObject({
        time: '08:03',
      });
      
      jest.useRealTimers();
    });

    it('should return null for non-existent alarm', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockAlarms));
      
      const result = await snoozeAlarm('999', 5);
      
      expect(result).toBeNull();
    });
  });
});