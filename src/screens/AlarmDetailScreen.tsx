import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '../navigation/AppNavigator';
import { deleteAlarm, updateAlarm } from '../store/alarmSlice';
import { selectAlarmById } from '../store/selectors';
import { Alarm } from '../store/types';
import AlarmForm from '../components/AlarmForm';
import LoadingOverlay from '../components/LoadingOverlay';
import ErrorBanner from '../components/ErrorBanner';
import { useAlarms } from '../hooks/useAlarms';

type AlarmDetailScreenRouteProp = RouteProp<RootStackParamList, 'AlarmDetail'>;
type AlarmDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AlarmDetail'>;

const AlarmDetailScreen: React.FC = () => {
  const route = useRoute<AlarmDetailScreenRouteProp>();
  const navigation = useNavigation<AlarmDetailScreenNavigationProp>();
  const dispatch = useDispatch();
  
  const { alarmId } = route.params;
  const alarm = useSelector(selectAlarmById(alarmId));
  const { loading, error } = useAlarms();
  
  const [localAlarm, setLocalAlarm] = useState<Alarm | null>(null);
  
  useEffect(() => {
    if (alarm) {
      setLocalAlarm(alarm);
    } else {
      // If alarm doesn't exist, navigate back
      navigation.goBack();
    }
  }, [alarm, navigation]);
  
  const handleSave = () => {
    if (localAlarm) {
      dispatch(updateAlarm(localAlarm));
      navigation.goBack();
    }
  };
  
  const handleDelete = () => {
    Alert.alert(
      'Delete Alarm',
      'Are you sure you want to delete this alarm?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            dispatch(deleteAlarm(alarmId));
            navigation.goBack();
          }
        }
      ]
    );
  };
  
  if (loading) {
    return <LoadingOverlay />;
  }
  
  if (!localAlarm) {
    return null;
  }
  
  return (
    <View style={styles.container}>
      {error && <ErrorBanner message={error} />}
      <AlarmForm
        alarm={localAlarm}
        onSave={handleSave}
        onDelete={handleDelete}
        onChange={setLocalAlarm}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default AlarmDetailScreen;
