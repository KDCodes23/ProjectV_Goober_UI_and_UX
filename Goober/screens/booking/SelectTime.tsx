// /screens/SelectTime.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SelectTimeScreenProps } from '../../types/navigation';
import { useRide } from '../../contexts/RideContext';

const generateTimeSlots = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const displayTime = new Date(2000, 0, 1, hour, minute).toLocaleString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      times.push({ value: timeString, display: displayTime });
    }
  }
  return times;
};

export default function SelectTime({ navigation }: SelectTimeScreenProps) {
  const { booking, updateBooking } = useRide();
  const [selectedTime, setSelectedTime] = useState(booking.time || '06:00 AM');
  const [showPicker, setShowPicker] = useState(false);
  const timeSlots = generateTimeSlots();

  // Update selected time when booking time changes
  useEffect(() => {
    if (booking.time) {
      setSelectedTime(booking.time);
    }
  }, [booking.time]);
  
  const handleConfirm = () => {
    updateBooking({ time: selectedTime });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <Text style={styles.title}>What time will you like to depart?</Text>

        <TouchableOpacity
          style={styles.timeInput}
          onPress={() => setShowPicker(true)}
        >
          <Text style={styles.timeText}>{selectedTime}</Text>
          <Ionicons name="chevron-down" size={20} color="#999" />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowPicker(false)}>
                <Text style={styles.modalCancel}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Select Time</Text>
              <TouchableOpacity
                onPress={() => {
                  updateBooking({ time: selectedTime });
                  setShowPicker(false);
                }}
              >
                <Text style={styles.modalDone}>Done</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.timeList} showsVerticalScrollIndicator={true}>
              {timeSlots.map((time, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.timeOption,
                    selectedTime === time.display && styles.selectedTimeOption,
                  ]}
                  onPress={() => {
                    setSelectedTime(time.display);
                  }}
                >
                  <Text
                    style={[
                      styles.timeOptionText,
                      selectedTime === time.display && styles.selectedTimeOptionText,
                    ]}
                  >
                    {time.display}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 40,
    textAlign: 'center',
  },
  timeInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  timeText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1A1A1A',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalCancel: {
    fontSize: 16,
    color: '#666',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  modalDone: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: '600',
  },
  timeList: {
    maxHeight: 400,
    flexGrow: 0,
  },
  timeOption: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  selectedTimeOption: {
    backgroundColor: '#FFF9E6',
  },
  timeOptionText: {
    fontSize: 18,
    color: '#1A1A1A',
  },
  selectedTimeOptionText: {
    color: '#FFD700',
    fontWeight: '600',
  },
});

