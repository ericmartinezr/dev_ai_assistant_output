import { AnyAction } from '@reduxjs/toolkit';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { AuthState } from './authSlice';
import { AlarmState } from './alarmSlice';

export interface RootState {
  auth: AuthState;
  alarms: AlarmState;
}

// Extra arguments for thunks - can be extended with services like api clients
export interface AppThunkExtraArgs {
  // Example: apiClient: ApiClient;
}

export type AppDispatch = ThunkDispatch<RootState, AppThunkExtraArgs, AnyAction>;
