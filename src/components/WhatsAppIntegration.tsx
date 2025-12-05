import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useWhatsApp } from '../hooks/useWhatsApp';
import { useAlarms } from '../hooks/useAlarms';
import { Alarm } from '../store/types';

interface WhatsAppIntegrationProps {
  alarm: Alarm;
}

const WhatsAppIntegration: React.FC<WhatsAppIntegrationProps> = ({ alarm }) => {
  const { sendAlarmNotification } = useWhatsApp();
  const { updateAlarm } = useAlarms();
  const [groupName, setGroupName] = useState(alarm.whatsappGroup || '');
  const [isEnabled, setIsEnabled] = useState(!!alarm.whatsappGroup);

  const handleToggle = () => {
    if (isEnabled) {
      setGroupName('');
      updateAlarm({
        ...alarm,
        whatsappGroup: undefined
      });
    }
    setIsEnabled(!isEnabled);
  };

  const handleSave = () => {
    if (!groupName.trim()) {
      Alert.alert('Error', 'Please enter a WhatsApp group name');
      return;
    }
    
    updateAlarm({
      ...alarm,
      whatsappGroup: groupName.trim()
    });
    
    Alert.alert(
      'Success',
      'WhatsApp integration configured successfully',
      [
        {
          text: 'OK',
          onPress: () => sendAlarmNotification(alarm, groupName.trim())
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>WhatsApp Notifications</Text>
        <TouchableOpacity 
          style={[styles.toggle, isEnabled ? styles.toggleEnabled : styles.toggleDisabled]}
          onPress={handleToggle}
        >
          <Text style={styles.toggleText}>
            {isEnabled ? 'ENABLED' : 'DISABLED'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {isEnabled && (
        <View style={styles.content}>
          <Text style={styles.label}>Group Name</Text>
          <TextInput
            style={styles.input}
            value={groupName}
            onChangeText={setGroupName}
            placeholder="Enter WhatsApp group name"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save & Test</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginVertical: 8
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  toggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12
  },
  toggleEnabled: {
    backgroundColor: '#28a745'
  },
  toggleDisabled: {
    backgroundColor: '#6c757d'
  },
  toggleText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold'
  },
  content: {
    marginTop: 8
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    backgroundColor: 'white',
    marginBottom: 12
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center'
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600'
  }
});

export default WhatsAppIntegration;
