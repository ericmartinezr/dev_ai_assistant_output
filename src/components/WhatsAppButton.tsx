import React from 'react';
import { TouchableOpacity, Text, Linking, Alert } from 'react-native';
import { useAlarms } from '../hooks/useAlarms';

interface WhatsAppButtonProps {
  alarmId: string;
  phoneNumber: string;
  message?: string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ 
  alarmId, 
  phoneNumber, 
  message = 'Alarm notification' 
}) => {
  const { snoozeAlarm } = useAlarms();

  const handlePress = async () => {
    try {
      // Snooze the alarm first
      await snoozeAlarm(alarmId);
      
      // Open WhatsApp with pre-filled message
      const url = `whatsapp://send?phone=${encodeURIComponent(phoneNumber)}&text=${encodeURIComponent(message)}`;
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'WhatsApp is not installed on this device');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open WhatsApp');
    }
  };

  return (
    <TouchableOpacity 
      onPress={handlePress}
      style={{
        backgroundColor: '#25D366',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 8,
      }}
    >
      <Text style={{
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
      }}>
        Send WhatsApp
      </Text>
    </TouchableOpacity>
  );
};

export default WhatsAppButton;
