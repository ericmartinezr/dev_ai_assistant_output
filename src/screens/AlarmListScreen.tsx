import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAlarms } from '../hooks/useAlarms';
import { AlarmItem } from '../components/AlarmItem';
import { Button } from '../components/Button';
import { RootStackNavigationProp } from '../navigation/RootNavigator';

export const AlarmListScreen = () => {
  const { alarms, loading, error, fetchAlarms, deleteAlarm } = useAlarms();
  const navigation = useNavigation<RootStackNavigationProp>();

  useEffect(() => {
    fetchAlarms();
  }, []);

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Alarm',
      'Are you sure you want to delete this alarm?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteAlarm(id) }
      ]
    );
  };

  const handleEdit = (id: string) => {
    navigation.navigate('AlarmEdit', { alarmId: id });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading alarms...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text>Error: {error}</Text>
        <Button title="Retry" onPress={fetchAlarms} style={styles.retryButton} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={alarms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AlarmItem
            alarm={item}
            onDelete={() => handleDelete(item.id)}
            onEdit={() => handleEdit(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No alarms set</Text>
            <Button 
              title="Create Alarm" 
              onPress={() => navigation.navigate('AlarmEdit', { alarmId: null })}
            />
          </View>
        }
      />
      <Button 
        title="Add New Alarm" 
        onPress={() => navigation.navigate('AlarmEdit', { alarmId: null })}
        style={styles.addButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  retryButton: {
    marginTop: 10,
  },
  addButton: {
    margin: 16,
  },
});