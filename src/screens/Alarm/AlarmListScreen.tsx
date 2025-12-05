import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { useAlarms } from '../../hooks/useAlarms';
import { AlarmItem } from '../../components/Alarm/AlarmItem';
import { fetchAlarms } from '../../store/slices/alarmSlice';
import { AppDispatch } from '../../store';

export const AlarmListScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { alarms, loading } = useAlarms();

  useEffect(() => {
    dispatch(fetchAlarms());
  }, [dispatch]);

  const handleAddAlarm = () => {
    navigation.navigate('AlarmEdit', { alarmId: null });
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <Text>Loading alarms...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={alarms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AlarmItem alarm={item} />}
        ListEmptyComponent={
          <View style={styles.centeredContainer}>
            <Text>No alarms set</Text>
          </View>
        }
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddAlarm}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButtonText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
});