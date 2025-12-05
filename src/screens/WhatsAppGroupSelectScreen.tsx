import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../store/hooks';
import { WhatsAppGroup } from '../types';
import { whatsappService } from '../services/whatsappService';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { ErrorToast } from '../components/ErrorToast';

export const WhatsAppGroupSelectScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  
  const [groups, setGroups] = useState<WhatsAppGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const alarmId = (route.params as { alarmId?: string })?.alarmId;

  useEffect(() => {
    // Flag to track if component is still mounted
    let isMounted = true;
    
    const fetchGroups = async () => {
      try {
        // Clear previous error state
        if (isMounted) {
          setError(null);
          setLoading(true);
        }
        
        const fetchedGroups = await whatsappService.getUserGroups(user?.id || '');
        
        if (isMounted) {
          setGroups(fetchedGroups);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load WhatsApp groups');
          console.error('Error fetching WhatsApp groups:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (user?.id) {
      fetchGroups();
    } else if (isMounted) {
      // Handle case where no user ID is available
      setLoading(false);
    }

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const handleGroupSelect = async (group: WhatsAppGroup) => {
    try {
      if (alarmId) {
        // Associate group with alarm
        await whatsappService.associateGroupWithAlarm(alarmId, group.id);
        navigation.goBack();
      } else {
        // Open WhatsApp with selected group
        await whatsappService.openGroupChat(group.id);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to select WhatsApp group');
      console.error('Error selecting group:', err);
    }
  };

  const renderGroupItem = ({ item }: { item: WhatsAppGroup }) => (
    <TouchableOpacity 
      style={styles.groupItem}
      onPress={() => handleGroupSelect(item)}
    >
      <Text style={styles.groupName}>{item.name}</Text>
      <Text style={styles.groupDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <LoadingOverlay />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select WhatsApp Group</Text>
      
      {error ? (
        <ErrorToast message={error} onDismiss={() => setError(null)} />
      ) : null}
      
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={renderGroupItem}
        contentContainerStyle={styles.listContainer}
      />
      
      {groups.length === 0 && !loading && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No WhatsApp groups found. Make sure WhatsApp is installed and you have groups.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  groupItem: {
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  groupDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
  },
});