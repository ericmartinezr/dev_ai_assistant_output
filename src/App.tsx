import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './navigation/Root';
import { AuthProvider } from './contexts/Auth';
import { AlarmProvider } from './contexts/Alarm';

export default function App() {
  return (
    <AuthProvider>
      <AlarmProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </AlarmProvider>
    </AuthProvider>
  );
}
