import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AlarmForm from '../src/components/alarms/AlarmForm';

jest.mock('../src/services/alarmService', () => ({
  scheduleAlarm: jest.fn(),
  updateAlarm: jest.fn(),
}));

jest.mock('../src/hooks/useAlarms', () => ({
  __esModule: true,
  default: () => ({
    alarms: [],
    addAlarm: jest.fn(),
    updateAlarm: jest.fn(),
  }),
}));

describe('AlarmForm', () => {
  const mockOnSave = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly for creating new alarm', () => {
    const { getByPlaceholderText, getByText } = render(
      <AlarmForm
        isVisible={true}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    expect(getByPlaceholderText('Alarm name')).toBeTruthy();
    expect(get ByText('Save')).toBeTruthy();
    expect(getByText('Cancel')).toBeTruthy();
  });

  it('calls onSave with form data when save is pressed', async () => {
    const { getByPlaceholderText, getByText } = render(
      <AlarmForm
        isVisible={true}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    const nameInput = getByPlaceholderText('Alarm name');
    const timeInput = getByPlaceholderText('Select time');
    
    fireEvent.changeText(nameInput, 'Morning Alarm');
    fireEvent.press(timeInput);
    
    // Mock time selection
    fireEvent.press(getByText('Save'));

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalled();
    });
  });

  it('calls onCancel when cancel is pressed', () => {
    const { getByText } = render(
      <AlarmForm
        isVisible={true}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.press(getByText('Cancel'));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('shows validation error for empty name', async () => {
    const { getByText } = render(
      <AlarmForm
        isVisible={true}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.press(getByText('Save'));

    await waitFor(() => {
      expect(getByText('Name is required')).toBeTruthy();
    });
  });
});