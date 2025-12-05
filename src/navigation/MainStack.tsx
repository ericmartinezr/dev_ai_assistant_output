import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home';
import AlarmListScreen from '../screens/AlarmList';
import AlarmDetailScreen from '../screens/AlarmDetail';
import SettingsScreen from '../screens/Settings';
import { RootStackParamList } from '../store/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const MainStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AlarmList" component={AlarmListScreen} />
      <Stack.Screen name="AlarmDetail" component={AlarmDetailScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

export default MainStack;