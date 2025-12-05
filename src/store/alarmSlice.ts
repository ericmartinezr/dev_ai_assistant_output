import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Alarm, AlarmState } from './types';

const initialState: AlarmState = {
  alarms: [],
  loading: false,
  error: null,
};

export const alarmSlice = createSlice({
  name: 'alarm',
  initialState,
  reducers: {
    setAlarms: (state, action: PayloadAction<Alarm[]>) => {
      state.alarms = action.payload;
    },
    addAlarm: (state, action: PayloadAction<Alarm>) => {
      state.alarms.push(action.payload);
    },
    updateAlarm: (state, action: PayloadAction<Alarm>) => {
      const index = state.alarms.findIndex(alarm => alarm.id === action.payload.id);
      if (index !== -1) {
        state.alarms[index] = action.payload;
      }
    },
    removeAlarm: (state, action: PayloadAction<string>) => {
      state.alarms = state.alarms.filter(alarm => alarm.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setAlarms, addAlarm, updateAlarm, removeAlarm, setLoading, setError } = alarmSlice.actions;

export default alarmSlice.reducer;
