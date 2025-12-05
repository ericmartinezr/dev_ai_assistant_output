import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Alarm } from '../types';
import { Input } from './Input';
import { Button } from './Button';
import { validateAlarm } from '../utils/validation';
import { formatTime } from '../utils/dateUtils';

interface AlarmFormProps {
  alarm?: Alarm;
  onSubmit: (alarm: Partial<Alarm>) => void;
  onCancel: () => void;
}

export const AlarmForm: React.FC<AlarmFormProps> = ({ alarm, onSubmit, onCancel }) => {
  const [time, setTime] = useState(alarm?.time ? formatTime(alarm.time) : '');
  const [label, setLabel] = useState(alarm?.label || '');
  const [isEnabled, setIsEnabled] = useState(alarm?.isEnabled ?? true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (alarm) {
      setTime(formatTime(alarm.time));
      setLabel(alarm.label || '');
      setIsEnabled(alarm.isEnabled ?? true);
    }
  }, [alarm]);

  const handleSubmit = () => {
    const alarmData = {
      time,
      label,
      isEnabled,
    };

    const validationError = validateAlarm(alarmData);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    onSubmit({
      ...alarmData,
      id: alarm?.id,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Input
          label="Time"
          value={time}
          onChangeText={setTime}
          placeholder="HH:MM"
          error={error}
        />
        <Input
          label="Label"
          value={label}
          onChangeText={setLabel}
          placeholder="Alarm label"
        />
        <View style={styles.buttonContainer}>
          <Button title="Cancel" onPress={onCancel} variant="secondary" />
          <Button title="Save" onPress={handleSubmit} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
});