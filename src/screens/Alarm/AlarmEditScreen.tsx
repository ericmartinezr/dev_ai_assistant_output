import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Alarm } from '../../types/alarm';
import { updateAlarm } from '../../store/slices/alarmSlice';
import { useAlarms } from '../../hooks/useAlarms';
import AlarmForm from '../../components/Alarm/AlarmForm';
import { globalStyles } from '../../styles/global';

type AlarmEditScreenRouteProp = RouteProp<RootStackParamList, 'AlarmEdit'>;
type AlarmEditScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AlarmEdit'>;

const AlarmEditScreen = () => {
  const route = useRoute<AlarmEditScreenRouteProp>();
  const navigation = useNavigation<AlarmEditScreenNavigationProp>();
  const dispatch = useDispatch();
  const { getAlarmById } = useAlarms();
  
  const { alarmId } = route.params;
  const [alarm, setAlarm] = useState<Alarm | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlarm = () => {
      try {
        const fetchedAlarm = getAlarmById(alarmId);
        if (fetchedAlarm) {
          setAlarm(fetchedAlarm);
        } else {
          Alert.alert('Error', 'Alarm not found');
          navigation.goBack();
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load alarm');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    fetchAlarm();
  }, [alarmId, getAlarmById, navigation]);

  const handleSave = (updatedAlarm: Alarm) => {
    try {
      dispatch(updateAlarm(updatedAlarm));
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update alarm');
    }
  };

  if (loading) {
    return (
      <View style={[globalStyles.container, styles.center]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      {alarm && (
        <AlarmForm
          initialAlarm={alarm}
          onSave={handleSave}
          onCancel={() => navigation.goBack()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AlarmEditScreen;