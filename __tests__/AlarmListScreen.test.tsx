import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import AlarmListScreen from '../src/screens/AlarmListScreen';
import alarmsReducer, { AlarmsState } from '../src/store/alarmsSlice';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
} as any;

// Mock alarm data
const mockAlarms = [
  {
    id: '1',
    title: 'Morning Alarm',
    time: '07:00',
    enabled: true,
    days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    snooze: 5,
  },
  {
    id: '2',
    title: 'Evening Alarm',
    time: '19:30',
    enabled: false,
    days: ['saturday', 'sunday'],
    snooze: 10,
  },
];

// Create mock store
const createMockStore = (initialAlarms: AlarmsState) => {
  return configureStore({
    reducer: {
      alarms: alarmsReducer,
    },
    preloadedState: {
      alarms: initialAlarms,
    },
  });
};

describe('AlarmListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with alarms', async () => {
    const store = createMockStore({
      alarms: mockAlarms,
      loading: false,
      error: null,
    });

    const { getByText, getAllByTestId } = render(
      <Provider store={store}>
        <AlarmListScreen navigation={mockNavigation} />
      </Provider>
    );

    // Wait for component to render
    await waitFor(() => {
      expect(getByText('Morning Alarm')).toBeTruthy();
      expect(getByText('Evening Alarm')).toBeTruthy();
    });

    // Check that alarm items are rendered
    const alarmItems = getAllByTestId('alarm-item');
    expect(alarmItems.length).toBe(2);
  });

  it('shows loading state', () => {
    const store = createMockStore({
      alarms: [],
      loading: true,
      error: null,
    });

    const { getByTestId } = render(
      <Provider store={store}>
        <AlarmListScreen navigation={mockNavigation} />
      </Provider>
    );

    expect(getByTestId('loading-overlay')).toBeTruthy();
  });

  it('shows error state', () => {
    const errorMessage = 'Failed to load alarms';
    const store = createMockStore({
      alarms: [],
      loading: false,
      error: errorMessage,
    });

    const { getByText } = render(
      <Provider store={store}>
        <AlarmListScreen navigation={mockNavigation} />
      </Provider>
    );

    expect(getByText(errorMessage)).toBeTruthy();
  });

  it('shows empty state when no alarms', () => {
    const store = createMockStore({
      alarms: [],
      loading: false,
      error: null,
    });

    const { getByText } = render(
      <Provider store={store}>
        <AlarmListScreen navigation={mockNavigation} />
      </Provider>
    );

    expect(getByText('No alarms set')).toBeTruthy();
    expect(getByText('Create your first alarm')).toBeTruthy();
  });
});