// /screens/SelectSeats.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SelectSeatsScreenProps } from '../../types/navigation';
import { useRide } from '../../contexts/RideContext';

export default function SelectSeats({ navigation }: SelectSeatsScreenProps) {
  const { booking, updateBooking } = useRide();
  const [seats, setSeats] = useState(booking.seats || 1);

  const handleDecrement = () => {
    if (seats > 1) {
      setSeats(seats - 1);
    }
  };

  const handleIncrement = () => {
    if (seats < 10) {
      setSeats(seats + 1);
    }
  };

  const handleConfirm = () => {
    updateBooking({ seats });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <Text style={styles.title}>How many seats would you like?</Text>

        <View style={styles.seatSelector}>
          <TouchableOpacity
            style={styles.seatButton}
            onPress={handleDecrement}
            disabled={seats === 1}
          >
            <Text style={[styles.seatButtonText, seats === 1 && styles.seatButtonTextDisabled]}>
              -
            </Text>
          </TouchableOpacity>

          <Text style={[styles.seatCount, { marginHorizontal: 40 }]}>{seats}</Text>

          <TouchableOpacity
            style={styles.seatButton}
            onPress={handleIncrement}
            disabled={seats === 10}
          >
            <Text style={[styles.seatButtonText, seats === 10 && styles.seatButtonTextDisabled]}>
              +
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 60,
    textAlign: 'center',
  },
  seatSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  seatButton: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  seatButtonText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  seatButtonTextDisabled: {
    color: '#CCC',
  },
  seatCount: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#1A1A1A',
    minWidth: 80,
    textAlign: 'center',
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 20,
  },
  confirmButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
});

