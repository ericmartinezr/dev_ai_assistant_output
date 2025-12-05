import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import alarmSlice from './alarmSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    alarms: alarmSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
