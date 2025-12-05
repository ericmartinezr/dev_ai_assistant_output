import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

export type MainStackParamList = {
  Home: undefined;
  AlarmList: undefined;
  AlarmDetail: { alarmId: string };
  Settings: undefined;
  WhatsAppGroupSelect: { onSelect: (groupId: string, groupName: string) => void };
};

export type AppNavigationProp = StackNavigationProp<RootStackParamList>;
export type AuthNavigationProp = StackNavigationProp<AuthStackParamList>;
export type MainNavigationProp = StackNavigationProp<MainStackParamList>;

export type AlarmDetailRouteProp = RouteProp<MainStackParamList, 'AlarmDetail'>;
export type WhatsAppGroupSelectRouteProp = RouteProp<MainStackParamList, 'WhatsAppGroupSelect'>;