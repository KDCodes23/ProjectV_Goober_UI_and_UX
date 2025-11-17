// /screens/Home.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreenProps } from '../types/navigation';

export default function Home({ navigation }: HomeScreenProps) {
  const userName = 'Naomi'; // Placeholder - will be replaced with actual user data
  const [fromLocation, setFromLocation] = useState('Cold stone, Yaba');
  const [toLocation, setToLocation] = useState('Lekki Phase 1');
  const [selectedDate, setSelectedDate] = useState('Fri Aug 18');
  const [selectedTime, setSelectedTime] = useState('06:00 AM');
  const [seats, setSeats] = useState(0);

  const swapLocations = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.greetingSection}>
            <Text style={styles.greeting}>Hi, {userName}</Text>
            <Text style={styles.prompt}>What would you like to do today?</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <View style={styles.bellContainer}>
              <Ionicons name="notifications-outline" size={24} color="#333" />
              <View style={styles.notificationBadge} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Ride Booking Card */}
        <View style={styles.bookingCard}>
          <TouchableOpacity
            style={styles.locationField}
            onPress={() => navigation.navigate('SelectLocation', { type: 'from' })}
          >
            <Text style={styles.fieldLabel}>From</Text>
            <Text style={styles.fieldValue}>{fromLocation}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.locationField}
            onPress={() => navigation.navigate('SelectLocation', { type: 'to' })}
          >
            <Text style={styles.fieldLabel}>To</Text>
            <Text style={styles.fieldValue}>{toLocation}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.swapButton} onPress={swapLocations}>
            <Ionicons name="swap-vertical" size={24} color="#2D7A7A" />
          </TouchableOpacity>

          <View style={styles.detailsRow}>
            <TouchableOpacity
              style={styles.detailItem}
              onPress={() => navigation.navigate('SelectDate')}
            >
              <Ionicons name="calendar-outline" size={20} color="#2D7A7A" style={{ marginRight: 6 }} />
              <Text style={styles.detailText}>{selectedDate}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.detailItem}
              onPress={() => navigation.navigate('SelectTime')}
            >
              <Ionicons name="time-outline" size={20} color="#2D7A7A" style={{ marginRight: 6 }} />
              <Text style={styles.detailText}>{selectedTime}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.detailItem}
              onPress={() => navigation.navigate('SelectSeats')}
            >
              <Ionicons name="person-outline" size={20} color="#2D7A7A" style={{ marginRight: 6 }} />
              <Text style={styles.detailText}>{seats}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.findRideButton}
            onPress={() => navigation.navigate('BookRide')}
          >
            <Text style={styles.findRideText}>Find a Ride</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.switchProfileButton}>
            <Text style={styles.switchProfileText}>
              Want to offer a ride? <Text style={styles.switchProfileLink}>Switch in Profile</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color="#2D7A7A" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="car-outline" size={24} color="#999" />
          <Text style={[styles.navLabel, styles.navLabelInactive]}>Trips</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person-outline" size={24} color="#999" />
          <Text style={[styles.navLabel, styles.navLabelInactive]}>Account</Text>
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
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  greetingSection: {
    flex: 1,
  },
  greeting: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D7A7A',
    marginBottom: 8,
  },
  prompt: {
    fontSize: 16,
    color: '#666',
    fontWeight: '400',
  },
  notificationButton: {
    padding: 8,
  },
  bellContainer: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF0000',
    borderWidth: 2,
    borderColor: '#fff',
  },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  locationField: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  swapButton: {
    position: 'absolute',
    right: 20,
    top: 50,
    padding: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  bottomSection: {
    paddingBottom: 20,
  },
  findRideButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  findRideText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  switchProfileButton: {
    alignItems: 'center',
  },
  switchProfileText: {
    fontSize: 14,
    color: '#666',
  },
  switchProfileLink: {
    color: '#FFA500',
    fontWeight: '600',
  },
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    justifyContent: 'space-around',
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navLabel: {
    fontSize: 12,
    color: '#2D7A7A',
    fontWeight: '500',
    marginTop: 4,
  },
  navLabelInactive: {
    color: '#999',
  },
});
