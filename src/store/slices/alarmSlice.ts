import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Alarm } from '../../types/alarm';

interface AlarmState {
  alarms: Alarm[];
  loading: boolean;
  error: string | null;
}

const initialState: AlarmState = {
  alarms: [],
  loading: false,
  error: null,
};

const alarmSlice = createSlice({
  name: 'alarm',
  initialState,
  reducers: {
    setAlarms: (state, action: PayloadAction<Alarm[]>) => {
      state.alarms = action.payload;
      state.loading = false;
      state.error = null;
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
      state.loading = false;
    },
    toggleAlarmStatus: (state, action: PayloadAction<string>) => {
      const alarm = state.alarms.find(alarm => alarm.id === action.payload);
      if (alarm) {
        alarm.enabled = !alarm.enabled;
      }
    },
  },
});

export const {
  setAlarms,
  addAlarm,
  updateAlarm,
  removeAlarm,
  setLoading,
  setError,
  toggleAlarmStatus,
} = alarmSlice.actions;

export default alarmSlice.reducer;
