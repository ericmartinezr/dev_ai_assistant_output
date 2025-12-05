import { addAlarm, updateAlarm, deleteAlarm, getAlarms } from '../../services/alarm';
import { Alarm } from '../../types';

// Mock storage module
jest.mock('../../services/storage', () => ({
  getStoredAlarms: jest.fn().mockResolvedValue([
    { id: '1', title: 'Test Alarm', time: '09:00', enabled: true, days: [1, 2, 3, 4, 5] }
  ]),
  storeAlarms: jest.fn().mockResolvedValue(undefined)
}));

// Mock notification module
jest.mock('../../services/notification', () => ({
  scheduleAlarmNotification: jest.fn().mockResolvedValue(undefined),
  cancelAlarmNotification: jest.fn().mockResolvedValue(undefined)
}));

describe('Alarm Service', () => {
  const mockAlarm: Alarm = {
    id: '1',
    title: 'Morning Alarm',
    time: '08:30',
    enabled: true,
    days: [1, 2, 3, 4, 5]
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAlarms', () => {
    it('should retrieve all alarms', async () => {
      const alarms = await getAlarms();
      expect(alarms).toHaveLength(1);
      expect(alarms[0]).toEqual(expect.objectContaining({
        id: '1',
        title: 'Test Alarm'
      }));
    });
  });

  describe('addAlarm', () => {
    it('should add a new alarm', async () => {
      const result = await addAlarm(mockAlarm);
      expect(result).toEqual(expect.objectContaining({
        id: expect.any(String),
        title: 'Morning Alarm'
      }));
    });
  });

  describe('updateAlarm', () => {
    it('should update an existing alarm', async () => {
      const updatedAlarm = { ...mockAlarm, title: 'Updated Alarm' };
      const result = await updateAlarm(updatedAlarm);
      expect(result).toEqual(expect.objectContaining({
        title: 'Updated Alarm'
      }));
    });

    it('should throw error for non-existent alarm', async () => {
      const nonExistentAlarm = { ...mockAlarm, id: '999' };
      await expect(updateAlarm(nonExistentAlarm)).rejects.toThrow('Alarm not found');
    });
  });

  describe('deleteAlarm', () => {
    it('should delete an existing alarm', async () => {
      const result = await deleteAlarm('1');
      expect(result).toBe(true);
    });

    it('should throw error for non-existent alarm', async () => {
      await expect(deleteAlarm('999')).rejects.toThrow('Alarm not found');
    });
  });
});