import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import alarmsSlice from './slices/alarmsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    alarms: alarmsSlice,
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