import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useAlarms } from '../../hooks/useAlarms';
import { AlarmList } from '../../components/alarms/AlarmList';
import { WhatsAppButton } from '../../components/whatsapp/WhatsAppButton';

export const HomeScreen: React.FC = () => {
  const { user } = useAuth();
  const { alarms, loading } = useAlarms();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome, {user?.displayName || 'User'}</Text>
        <Text style={styles.subtitle}>Your alarm management dashboard</Text>
      </View>
      
      <View style={styles.content}>
        <AlarmList 
          alarms={alarms}
          loading={loading}
        />
      </View>
      
      <View style={styles.footer}>
        <WhatsAppButton />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
});