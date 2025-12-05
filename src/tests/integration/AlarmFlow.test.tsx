import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, TouchableOpacity, Text, TextInput } from 'react-native';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock components using React Native components
const MockHomeScreen = ({ navigation }: any) => (
  <View testID="home-screen">
    <TouchableOpacity testID="navigate-to-alarms" onPress={() => navigation.navigate('AlarmList')}>
      <Text>Alarms</Text>
    </TouchableOpacity>
  </View>
);

const MockAlarmListScreen = ({ navigation }: any) => (
  <View testID="alarm-list-screen">
    <TouchableOpacity testID="add-alarm-button" onPress={() => navigation.navigate('AlarmEdit')}>
      <Text>Add Alarm</Text>
    </TouchableOpacity>
  </View>
);

const MockAlarmEditScreen = ({ navigation }: any) => {
  const [title, setTitle] = React.useState('');
  
  const handleSave = async () => {
    try {
      const existingAlarms = await AsyncStorage.getItem('alarms');
      const alarms = existingAlarms ? JSON.parse(existingAlarms) : [];
      alarms.push({ id: Date.now(), title });
      await AsyncStorage.setItem('alarms', JSON.stringify(alarms));
      navigation.goBack();
    } catch (error) {
      console.error('Error saving alarm:', error);
    }
  };

  return (
    <View testID="alarm-edit-screen">
      <TextInput
        testID="alarm-title-input"
        placeholder="Alarm title"
        value={title}
        onChangeText={setTitle}
      />
      <TouchableOpacity testID="save-alarm-button" onPress={handleSave}>
        <Text>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

// Setup navigation
const Stack = createStackNavigator();

const TestNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={MockHomeScreen} />
      <Stack.Screen name="AlarmList" component={MockAlarmListScreen} />
      <Stack.Screen name="AlarmEdit" component={MockAlarmEditScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

describe('Alarm Flow Integration', () => {
  beforeEach(async () => {
    (AsyncStorage.clear as jest.Mock).mockResolvedValue(undefined);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    await AsyncStorage.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should navigate from home to alarms list and create a new alarm', async () => {
    const { getByTestId } = render(<TestNavigator />);
    
    // Verify we're on home screen
    expect(getByTestId('home-screen')).toBeTruthy();
    
    // Navigate to alarms list
    fireEvent.press(getByTestId('navigate-to-alarms'));
    
    // Verify we're on alarms list
    await waitFor(() => expect(getByTestId('alarm-list-screen')).toBeTruthy());
    
    // Navigate to create alarm
    fireEvent.press(getByTestId('add-alarm-button'));
    
    // Verify we're on alarm edit screen
    await waitFor(() => expect(getByTestId('alarm-edit-screen')).toBeTruthy());
    
    // Fill in alarm details
    fireEvent.changeText(getByTestId('alarm-title-input'), 'Morning Alarm');
    
    // Save alarm
    fireEvent.press(getByTestId('save-alarm-button'));
    
    // Should return to alarm list
    await waitFor(() => expect(getByTestId('alarm-list-screen')).toBeTruthy());
  });

  it('should persist alarms after creation', async () => {
    // Mock AsyncStorage to return empty array initially
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    
    // Create alarm flow
    const { getByTestId } = render(<TestNavigator />);
    
    fireEvent.press(getByTestId('navigate-to-alarms'));
    await waitFor(() => expect(getByTestId('alarm-list-screen')).toBeTruthy());
    
    fireEvent.press(getByTestId('add-alarm-button'));
    await waitFor(() => expect(getByTestId('alarm-edit-screen')).toBeTruthy());
    
    fireEvent.changeText(getByTestId('alarm-title-input'), 'Test Alarm');
    fireEvent.press(getByTestId('save-alarm-button'));
    
    await waitFor(() => expect(getByTestId('alarm-list-screen')).toBeTruthy());
    
    // Check if alarm was saved
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'alarms',
      JSON.stringify([{ id: expect.any(Number), title: 'Test Alarm' }])
    );
  });
});