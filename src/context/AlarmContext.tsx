import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Alarm } from '../types';
import { getAlarms, saveAlarms } from '../services/alarmService';

interface AlarmState {
  alarms: Alarm[];
  loading: boolean;
  error: string | null;
}

interface AlarmContextType extends AlarmState {
  addAlarm: (alarm: Omit<Alarm, 'id'>) => Promise<void>;
  updateAlarm: (id: string, alarm: Partial<Alarm>) => Promise<void>;
  deleteAlarm: (id: string) => Promise<void>;
  toggleAlarm: (id: string) => Promise<void>;
}

const initialState: AlarmState = {
  alarms: [],
  loading: false,
  error: null,
};

type AlarmAction =
  | { type: 'SET_LOADING' }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_ALARMS'; payload: Alarm[] }
  | { type: 'ADD_ALARM'; payload: Alarm }
  | { type: 'UPDATE_ALARM'; payload: { id: string; alarm: Partial<Alarm> } }
  | { type: 'DELETE_ALARM'; payload: string }
  | { type: 'TOGGLE_ALARM'; payload: string };

const alarmReducer = (state: AlarmState, action: AlarmAction): AlarmState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: true, error: null };
    case 'SET_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'SET_ALARMS':
      return { ...state, loading: false, alarms: action.payload };
    case 'ADD_ALARM':
      return { ...state, loading: false, alarms: [...state.alarms, action.payload] };
    case 'UPDATE_ALARM':
      return {
        ...state,
        loading: false,
        alarms: state.alarms.map(alarm =>
          alarm.id === action.payload.id ? { ...alarm, ...action.payload.alarm } : alarm
        ),
      };
    case 'DELETE_ALARM':
      return {
        ...state,
        loading: false,
        alarms: state.alarms.filter(alarm => alarm.id !== action.payload),
      };
    case 'TOGGLE_ALARM':
      return {
        ...state,
        loading: false,
        alarms: state.alarms.map(alarm =>
          alarm.id === action.payload
            ? { ...alarm, enabled: !alarm.enabled }
            : alarm
        ),
      };
    default:
      return state;
  }
};

const AlarmContext = createContext<AlarmContextType | undefined>(undefined);

export const useAlarm = () => {
  const context = useContext(AlarmContext);
  if (!context) {
    throw new Error('useAlarm must be used within an AlarmProvider');
  }
  return context;
};

interface AlarmProviderProps {
  children: React.ReactNode;
}

export const AlarmProvider: React.FC<AlarmProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(alarmReducer, initialState);

  useEffect(() => {
    loadAlarms();
  }, []);

  const loadAlarms = async () => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const alarms = await getAlarms();
      dispatch({ type: 'SET_ALARMS', payload: alarms });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load alarms' });
    }
  };

  const addAlarm = async (alarmData: Omit<Alarm, 'id'>) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const newAlarm: Alarm = {
        ...alarmData,
        id: Date.now().toString(),
      };
      const updatedAlarms = [...state.alarms, newAlarm];
      await saveAlarms(updatedAlarms);
      dispatch({ type: 'ADD_ALARM', payload: newAlarm });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add alarm' });
    }
  };

  const updateAlarm = async (id: string, alarmData: Partial<Alarm>) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const updatedAlarms = state.alarms.map(alarm =>
        alarm.id === id ? { ...alarm, ...alarmData } : alarm
      );
      await saveAlarms(updatedAlarms);
      dispatch({ type: 'UPDATE_ALARM', payload: { id, alarm: alarmData } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update alarm' });
    }
  };

  const deleteAlarm = async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const updatedAlarms = state.alarms.filter(alarm => alarm.id !== id);
      await saveAlarms(updatedAlarms);
      dispatch({ type: 'DELETE_ALARM', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete alarm' });
    }
  };

  const toggleAlarm = async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const alarm = state.alarms.find(a => a.id === id);
      if (!alarm) throw new Error('Alarm not found');
      
      const updatedAlarms = state.alarms.map(alarm =>
        alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
      );
      await saveAlarms(updatedAlarms);
      dispatch({ type: 'TOGGLE_ALARM', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to toggle alarm' });
    }
  };

  return (
    <AlarmContext.Provider
      value={{
        ...state,
        addAlarm,
        updateAlarm,
        deleteAlarm,
        toggleAlarm,
      }}
    >
      {children}
    </AlarmContext.Provider>
  );
};