import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { Alarm } from '../types';
import { sanitizeInput } from '../utils/validation';
import { generateNonce } from '../utils/security';

/**
 * Service interface for alarm operations
 */
export interface AlarmService {
  /**
   * Creates a new alarm
   * @param alarm - Alarm data without ID
   * @returns Promise resolving to the created alarm with ID
   */
  createAlarm: (alarm: Omit<Alarm, 'id'>) => Promise<Alarm>;
  
  /**
   * Retrieves all alarms
   * @returns Promise resolving to array of alarms
   */
  getAlarms: () => Promise<Alarm[]>;
  
  /**
   * Retrieves a specific alarm by ID
   * @param id - Alarm ID
   * @returns Promise resolving to alarm or null if not found
   */
  getAlarmById: (id: string) => Promise<Alarm | null>;
  
  /**
   * Updates an existing alarm
   * @param id - Alarm ID
   * @param alarm - Partial alarm data to update
   * @returns Promise resolving to updated alarm
   */
  updateAlarm: (id: string, alarm: Partial<Alarm>) => Promise<Alarm>;
  
  /**
   * Deletes an alarm by ID
   * @param id - Alarm ID
   * @returns Promise resolving when deletion is complete
   */
  deleteAlarm: (id: string) => Promise<void>;
  
  /**
   * Toggles the enabled state of an alarm
   * @param id - Alarm ID
   * @param enabled - New enabled state
   * @returns Promise resolving to updated alarm
   */
  toggleAlarm: (id: string, enabled: boolean) => Promise<Alarm>;
}

/**
 * Creates an instance of AlarmService
 * @param db - SQLite database instance
 * @returns AlarmService implementation
 */
export const createAlarmService = (db: SQLiteDatabase): AlarmService => {
  const createAlarm = async (alarm: Omit<Alarm, 'id'>): Promise<Alarm> => {
    // Validate required fields
    if (!alarm.title || typeof alarm.time !== 'string' || !Array.isArray(alarm.days)) {
      throw new Error('Invalid alarm data: missing required fields');
    }

    // Validate days array contains only valid numbers (0-6)
    if (alarm.days.some(day => typeof day !== 'number' || day < 0 || day > 6)) {
      throw new Error('Invalid days array: must contain numbers between 0 and 6');
    }

    // Validate time format (HH:MM)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(alarm.time)) {
      throw new Error('Invalid time format: must be HH:MM');
    }

    const sanitizedAlarm = {
      ...alarm,
      title: sanitizeInput(alarm.title),
      description: sanitizeInput(alarm.description || ''),
    };

    try {
      return await db.executeSql(
        `INSERT INTO alarms (title, description, time, days, enabled) 
         VALUES (?, ?, ?, ?, ?)`,
        [
          sanitizedAlarm.title,
          sanitizedAlarm.description,
          sanitizedAlarm.time,
          JSON.stringify(sanitizedAlarm.days),
          sanitizedAlarm.enabled ? 1 : 0
        ]
      ).then(([result]) => {
        if (!result.insertId) {
          throw new Error('Failed to create alarm: no ID returned');
        }
        
        return {
          id: result.insertId.toString(),
          ...sanitizedAlarm,
        };
      });
    } catch (error) {
      throw new Error(`Failed to create alarm: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getAlarms = async (): Promise<Alarm[]> => {
    try {
      return await db.executeSql(
        'SELECT * FROM alarms ORDER BY time ASC'
      ).then(([result]) => {
        const alarms: Alarm[] = [];
        for (let i = 0; i < result.rows.length; i++) {
          const row = result.rows.item(i);
          alarms.push({
            id: row.id.toString(),
            title: row.title,
            description: row.description,
            time: row.time,
            days: JSON.parse(row.days),
            enabled: row.enabled === 1,
          });
        }
        return alarms;
      });
    } catch (error) {
      throw new Error(`Failed to retrieve alarms: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getAlarmById = async (id: string): Promise<Alarm | null> => {
    try {
      return await db.executeSql(
        'SELECT * FROM alarms WHERE id = ?',
        [id]
      ).then(([result]) => {
        if (result.rows.length === 0) return null;
        
        const row = result.rows.item(0);
        return {
          id: row.id.toString(),
          title: row.title,
          description: row.description,
          time: row.time,
          days: JSON.parse(row.days),
          enabled: row.enabled === 1,
        };
      });
    } catch (error) {
      throw new Error(`Failed to retrieve alarm: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const updateAlarm = async (id: string, alarm: Partial<Alarm>): Promise<Alarm> => {
    const existingAlarm = await getAlarmById(id);
    if (!existingAlarm) throw new Error('Alarm not found');

    // Validate provided fields if they exist
    if (alarm.days !== undefined) {
      if (!Array.isArray(alarm.days)) {
        throw new Error('Invalid days array: must be an array');
      }
      if (alarm.days.some(day => typeof day !== 'number' || day < 0 || day > 6)) {
        throw new Error('Invalid days array: must contain numbers between 0 and 6');
      }
    }

    if (alarm.time !== undefined) {
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(alarm.time)) {
        throw new Error('Invalid time format: must be HH:MM');
      }
    }

    const updatedAlarm = {
      ...existingAlarm,
      ...alarm,
      title: alarm.title ? sanitizeInput(alarm.title) : existingAlarm.title,
      description: alarm.description ? sanitizeInput(alarm.description) : existingAlarm.description,
    };

    try {
      return await db.executeSql(
        `UPDATE alarms SET 
          title = ?, 
          description = ?, 
          time = ?, 
          days = ?, 
          enabled = ? 
         WHERE id = ?`,
        [
          updatedAlarm.title,
          updatedAlarm.description,
          updatedAlarm.time,
          JSON.stringify(updatedAlarm.days),
          updatedAlarm.enabled ? 1 : 0,
          id
        ]
      ).then(() => updatedAlarm);
    } catch (error) {
      throw new Error(`Failed to update alarm: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const deleteAlarm = async (id: string): Promise<void> => {
    try {
      await db.executeSql('DELETE FROM alarms WHERE id = ?', [id]);
    } catch (error) {
      throw new Error(`Failed to delete alarm: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const toggleAlarm = async (id: string, enabled: boolean): Promise<Alarm> => {
    const alarm = await getAlarmById(id);
    if (!alarm) throw new Error('Alarm not found');
    
    return updateAlarm(id, { enabled });
  };

  return {
    createAlarm,
    getAlarms,
    getAlarmById,
    updateAlarm,
    deleteAlarm,
    toggleAlarm,
  };
};