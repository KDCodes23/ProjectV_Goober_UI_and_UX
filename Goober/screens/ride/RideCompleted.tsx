// /screens/RideCompleted.tsx

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RideCompletedScreenProps } from '../types/navigation';

export default function RideCompleted({ navigation }: RideCompletedScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('RideRating');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <Modal visible={true} animationType="fade" transparent>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.modalContent}>
          <View style={styles.checkmarkContainer}>
            <Ionicons name="checkmark-circle" size={100} color="#2D7A7A" />
          </View>
          <Text style={styles.title}>Ride completed</Text>
          <Text style={styles.subtitle}>Please let us know how the ride was</Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  checkmarkContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D7A7A',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});

