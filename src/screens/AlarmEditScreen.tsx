import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useAlarms } from '../hooks/useAlarms';
import { AlarmForm } from '../components/AlarmForm';
import { Button } from '../components/Button';
import { Alarm } from '../types';

type AlarmEditScreenRouteProp = RouteProp<RootStackParamList, 'AlarmEdit'>;

type Props = {};

export const AlarmEditScreen: React.FC<Props> = () => {
  const navigation = useNavigation();
  const route = useRoute<AlarmEditScreenRouteProp>();
  const { alarmId } = route.params;
  const { alarms, updateAlarm, deleteAlarm } = useAlarms();
  
  const [alarm, setAlarm] = useState<Alarm | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundAlarm = alarms.find(a => a.id === alarmId);
    if (foundAlarm) {
      setAlarm(foundAlarm);
    } else {
      Alert.alert('Error', 'Alarm not found');
      navigation.goBack();
    }
    setLoading(false);
  }, [alarmId, alarms, navigation]);

  const handleSave = async (updatedAlarm: Alarm) => {
    try {
      await updateAlarm(updatedAlarm);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update alarm');
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this alarm?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAlarm(alarmId);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete alarm');
            }
          },
        },
      ]
    );
  };

  if (loading || !alarm) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <AlarmForm
        initialAlarm={alarm}
        onSave={handleSave}
      />
      <View style={styles.buttonContainer}>
        <Button 
          title="Delete Alarm" 
          onPress={handleDelete} 
          variant="danger" 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginTop: 16,
  },
});