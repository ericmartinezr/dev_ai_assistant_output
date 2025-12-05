import { useState, useEffect } from 'react';
import { Alarm } from '../types';
import { getAlarms, createAlarm, updateAlarm, deleteAlarm } from '../services/alarmService';
import { scheduleNotification, cancelNotification } from '../services/notificationService';

export const useAlarms = () => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAlarms();
  }, []);

  const loadAlarms = async () => {
    try {
      setLoading(true);
      const alarmList = await getAlarms();
      setAlarms(alarmList);
    } catch (err) {
      setError('Failed to load alarms');
      console.error('Error loading alarms:', err);
    } finally {
      setLoading(false);
    }
  };

  const addAlarm = async (alarm: Omit<Alarm, 'id'>) => {
    try {
      const newAlarm = await createAlarm(alarm);
      setAlarms(prev => [...prev, newAlarm]);
      await scheduleNotification(newAlarm);
      return newAlarm;
    } catch (err) {
      setError('Failed to add alarm');
      console.error('Error adding alarm:', err);
      throw err;
    }
  };

  const editAlarm = async (id: string, updatedAlarm: Partial<Alarm>) => {
    try {
      const alarm = alarms.find(a => a.id === id);
      if (!alarm) throw new Error('Alarm not found');
      
      await cancelNotification(id);
      const updated = await updateAlarm(id, updatedAlarm);
      setAlarms(prev => prev.map(a => (a.id === id ? updated : a)));
      
      if (updated.enabled) {
        await scheduleNotification(updated);
      }
      
      return updated;
    } catch (err) {
      setError('Failed to update alarm');
      console.error('Error updating alarm:', err);
      throw err;
    }
  };

  const removeAlarm = async (id: string) => {
    try {
      await deleteAlarm(id);
      await cancelNotification(id);
      setAlarms(prev => prev.filter(alarm => alarm.id !== id));
    } catch (err) {
      setError('Failed to delete alarm');
      console.error('Error deleting alarm:', err);
      throw err;
    }
  };

  const toggleAlarm = async (id: string) => {
    try {
      const alarm = alarms.find(a => a.id === id);
      if (!alarm) throw new Error('Alarm not found');
      
      if (alarm.enabled) {
        await cancelNotification(id);
      } else {
        await scheduleNotification(alarm);
      }
      
      const updated = await updateAlarm(id, { enabled: !alarm.enabled });
      setAlarms(prev => prev.map(a => (a.id === id ? updated : a)));
      return updated;
    } catch (err) {
      setError('Failed to toggle alarm');
      console.error('Error toggling alarm:', err);
      throw err;
    }
  };

  return {
    alarms,
    loading,
    error,
    addAlarm,
    editAlarm,
    removeAlarm,
    toggleAlarm,
    refreshAlarms: loadAlarms,
  };
};