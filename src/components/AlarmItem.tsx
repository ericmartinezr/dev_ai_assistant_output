import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Alarm } from '../types';
import { formatTime } from '../utils/dateUtils';

interface AlarmItemProps {
  alarm: Alarm;
  onToggle: (id: string) => void;
  onEdit: (alarm: Alarm) => void;
  onDelete: (id: string) => void;
}

const AlarmItem: React.FC<AlarmItemProps> = ({ alarm, onToggle, onEdit, onDelete }) => {
  return (
    <View style={[styles.container, !alarm.enabled && styles.disabled]}>
      <TouchableOpacity 
        style={styles.toggleButton}
        onPress={() => onToggle(alarm.id)}
        accessibilityLabel={alarm.enabled ? 'Disable alarm' : 'Enable alarm'}
      >
        <View style={[styles.toggleCircle, alarm.enabled ? styles.toggleActive : styles.toggleInactive]} />
      </TouchableOpacity>
      
      <View style={styles.contentContainer}>
        <Text style={styles.timeText}>{formatTime(alarm.time)}</Text>
        <Text style={styles.labelText}>{alarm.label || 'Alarm'}</Text>
        <Text style={styles.repeatText}>
          {alarm.repeat.length > 0 
            ? alarm.repeat.map(day => day.substring(0, 3)).join(', ') 
            : 'Once'}
        </Text>
      </View>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => onEdit(alarm)}
          accessibilityLabel="Edit alarm"
        >
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => onDelete(alarm.id)}
          accessibilityLabel="Delete alarm"
        >
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginVertical: 4,
    marginHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  disabled: {
    opacity: 0.6,
  },
  toggleButton: {
    padding: 8,
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  toggleActive: {
    backgroundColor: '#4CAF50',
  },
  toggleInactive: {
    backgroundColor: '#B0B0B0',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  timeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
  },
  labelText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 4,
  },
  repeatText: {
    fontSize: 14,
    color: '#999999',
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  editButton: {
    padding: 8,
  },
  editText: {
    color: '#2196F3',
    fontWeight: '600',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  deleteText: {
    color: '#F44336',
    fontWeight: '600',
  },
});

export default AlarmItem;
