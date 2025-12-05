import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useAlarms } from '../hooks/useAlarms';
import { AlarmItem } from '../components/AlarmItem';
import { Button } from '../components/Button';
import { RootStackScreenProps } from '../navigation/RootNavigator';

type Props = RootStackScreenProps<'Home'>;

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { user, signOut } = useAuth();
  const { alarms, deleteAlarm } = useAlarms();

  const handleAddAlarm = () => {
    navigation.navigate('AlarmEdit', { alarmId: null });
  };

  const handleEditAlarm = (id: string) => {
    navigation.navigate('AlarmEdit', { alarmId: id });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome, {user?.displayName || 'User'}</Text>
        <Button title="Sign Out" onPress={signOut} variant="outline" />
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Alarms</Text>
          <Button title="Add Alarm" onPress={handleAddAlarm} size="small" />
        </View>
        
        {alarms.length === 0 ? (
          <Text style={styles.emptyText}>No alarms set yet</Text>
        ) : (
          alarms.map((alarm) => (
            <AlarmItem
              key={alarm.id}
              alarm={alarm}
              onEdit={() => handleEditAlarm(alarm.id)}
              onDelete={() => deleteAlarm(alarm.id)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 32,
  },
});