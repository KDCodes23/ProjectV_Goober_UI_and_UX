// /screens/SelectDate.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SelectDateScreenProps } from '../../types/navigation';
import { useRide } from '../../contexts/RideContext';

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const generateCalendar = () => {
  const months = [];
  const today = new Date();
  
  for (let m = 0; m < 3; m++) {
    const monthDate = new Date(today.getFullYear(), today.getMonth() + m, 1);
    const monthName = monthDate.toLocaleString('default', { month: 'long' });
    const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
    const firstDay = monthDate.getDay();
    
    const days = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    months.push({ name: monthName, days, monthDate });
  }
  
  return months;
};

export default function SelectDate({ navigation }: SelectDateScreenProps) {
  const { booking, updateBooking } = useRide();
  const [selectedDate, setSelectedDate] = useState<{ month: number; day: number } | null>(null);
  const calendar = generateCalendar();
  const today = new Date();
  const todayDay = today.getDate();
  const currentMonth = today.getMonth();

  const isPastDate = (monthIndex: number, day: number) => {
    if (monthIndex === 0 && day < todayDay) return true;
    return false;
  };

  const handleDateSelect = (monthIndex: number, day: number) => {
    if (!isPastDate(monthIndex, day)) {
      setSelectedDate({ month: monthIndex, day });
    }
  };

  const handleConfirm = () => {
    if (selectedDate) {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const date = new Date(2024, selectedDate.month, selectedDate.day);
      const formattedDate = `${dayNames[date.getDay()]} ${monthNames[selectedDate.month]} ${selectedDate.day}`;
      updateBooking({ date: formattedDate });
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Yellow Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.title}>When are you going?</Text>
        <View style={styles.daysRow}>
          {DAYS.map((day) => (
            <Text key={day} style={styles.dayLabel}>
              {day}
            </Text>
          ))}
        </View>
      </View>

      <ScrollView style={styles.calendarContainer} contentContainerStyle={styles.calendarContent}>
        {calendar.map((month, monthIndex) => (
          <View key={monthIndex} style={styles.monthContainer}>
            <Text style={styles.monthName}>{month.name}</Text>
            <View style={styles.calendarGrid}>
              {month.days.map((day, dayIndex) => {
                if (day === null) {
                  return <View key={dayIndex} style={styles.dayCell} />;
                }
                const isPast = isPastDate(monthIndex, day);
                const isSelected =
                  selectedDate?.month === monthIndex && selectedDate?.day === day;
                return (
                  <TouchableOpacity
                    key={dayIndex}
                    style={[styles.dayCell, isSelected && styles.selectedDay]}
                    onPress={() => handleDateSelect(monthIndex, day)}
                    disabled={isPast}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        isPast && styles.pastDayText,
                        isSelected && styles.selectedDayText,
                      ]}
                    >
                      {day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.confirmButton, selectedDate && styles.confirmButtonActive]}
          onPress={handleConfirm}
          disabled={!selectedDate}
        >
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
  header: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1A1A',
    width: 40,
    textAlign: 'center',
  },
  calendarContainer: {
    flex: 1,
  },
  calendarContent: {
    padding: 20,
  },
  monthContainer: {
    marginBottom: 40,
  },
  monthName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayText: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  pastDayText: {
    color: '#CCC',
  },
  selectedDay: {
    backgroundColor: '#FFD700',
    borderRadius: 20,
  },
  selectedDayText: {
    color: '#1A1A1A',
    fontWeight: 'bold',
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  confirmButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    opacity: 0.5,
  },
  confirmButtonActive: {
    opacity: 1,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
});

