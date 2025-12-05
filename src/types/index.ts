export interface User {
  id: string;
  email: string;
  displayName?: string;
  createdAt: Date;
}

export interface Alarm {
  id: string;
  title: string;
  time: string; // HH:MM format
  enabled: boolean;
  days: number[]; // 0-6 (Sunday-Saturday)
  sound?: string;
  vibration: boolean;
  snoozeEnabled: boolean;
  snoozeDuration: number; // in minutes
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export interface AlarmContextType {
  alarms: Alarm[];
  loading: boolean;
  addAlarm: (alarm: Omit<Alarm, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateAlarm: (id: string, alarm: Partial<Alarm>) => Promise<void>;
  deleteAlarm: (id: string) => Promise<void>;
  toggleAlarm: (id: string) => Promise<void>;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface NotificationData {
  alarmId: string;
  title: string;
  body: string;
}