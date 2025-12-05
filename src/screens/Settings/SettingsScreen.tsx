import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState, AppDispatch } from '../../store';
import { updatePreference } from '../../store/settingsSlice';
import { clearAuth } from '../../store/authSlice';
import { clearAlarms } from '../../store/alarmSlice';
import { Button } from '../../components/common/Button';
import { whatsappService } from '../../services/whatsappService';

export const SettingsScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const { preferences } = useSelector((state: RootState) => state.settings);
  
  const handlePreferenceChange = (key: string, value: boolean) => {
    dispatch(updatePreference({ key, value }));
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            dispatch(clearAuth());
            dispatch(clearAlarms());
          }
        }
      ]
    );
  };

  const handleTestWhatsApp = async () => {
    try {
      await whatsappService.sendMessage('+1234567890', 'Test message from AlarmApp');
      Alert.alert('Success', 'Test message sent successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send test message');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Enable Sound</Text>
          <Switch
            value={preferences.soundEnabled}
            onValueChange={(value) => handlePreferenceChange('soundEnabled', value)}
          />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Vibrate</Text>
          <Switch
            value={preferences.vibrationEnabled}
            onValueChange={(value) => handlePreferenceChange('vibrationEnabled', value)}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>WhatsApp Integration</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Enable WhatsApp Notifications</Text>
          <Switch
            value={preferences.whatsappEnabled}
            onValueChange={(value) => handlePreferenceChange('whatsappEnabled', value)}
          />
        </View>
        <Button 
          title="Test WhatsApp Connection" 
          onPress={handleTestWhatsApp}
          style={styles.testButton}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <Button 
          title="Logout" 
          onPress={handleLogout}
          variant="danger"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: 'white',
    marginVertical: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  testButton: {
    marginTop: 12,
  },
});