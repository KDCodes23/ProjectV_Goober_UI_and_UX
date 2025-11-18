// /screens/BookingAccepted.tsx

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BookingAcceptedScreenProps } from '../../types/navigation';
import { useUser } from '../../contexts/UserContext';
import { useRide } from '../../contexts/RideContext';

export default function BookingAccepted({ navigation }: BookingAcceptedScreenProps) {
  const { user } = useUser();
  const { activeRide, updateActiveRideStatus } = useRide();

  // Simulate driver starting trip after 3 seconds
  useEffect(() => {
    if (activeRide?.status === 'accepted') {
      const timer = setTimeout(() => {
        updateActiveRideStatus('enRoute', { eta: '5 mins' });
        navigation.replace('DriverEnRoute');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [activeRide?.status]);
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.greetingSection}>
            <Text style={styles.greeting}>Hi, {user?.name || 'User'}</Text>
            <Text style={styles.prompt}>What would you like to do today?</Text>
          </View>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => {
              // TODO: Navigate to notifications screen
              console.log('Notifications pressed');
            }}
          >
            <View style={styles.bellContainer}>
              <Ionicons name="notifications-outline" size={24} color="#333" />
              <View style={styles.notificationBadge} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Booking Card */}
        <View style={styles.bookingCard}>
          <View style={styles.driverHeader}>
            <View style={styles.driverImage}>
              <Ionicons name="person" size={32} color="#999" />
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark" size={12} color="#fff" />
              </View>
            </View>
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>Ride share with {activeRide?.driverName || 'Driver'}</Text>
              <Text style={styles.carInfo}>{activeRide?.carInfo || 'Car Info'}</Text>
              <Text style={styles.rideDate}>{activeRide?.date}, {activeRide?.time}</Text>
            </View>
          </View>
          <Text style={styles.acceptedText}>Your booking has been accepted</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, { marginRight: 12 }]}
              onPress={() => {
                // TODO: Initiate call to driver
                console.log('Call driver');
              }}
            >
              <Ionicons name="call-outline" size={20} color="#FFD700" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => {
                // TODO: Open chat with driver
                console.log('Chat with driver');
              }}
            >
              <Ionicons name="chatbubble-outline" size={20} color="#FF8800" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Find Ride Button */}
        <TouchableOpacity 
          style={styles.findRideButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.findRideText}>Find a Ride</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.switchProfileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.switchProfileText}>
            Want to offer a ride? <Text style={styles.switchProfileLink}>Switch in Profile</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="home" size={24} color="#2D7A7A" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Trips')}
        >
          <Ionicons name="car-outline" size={24} color="#999" />
          <Text style={[styles.navLabel, styles.navLabelInactive]}>Trips</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Profile')}
        >
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  driverHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  driverImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF8800',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  carInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  rideDate: {
    fontSize: 14,
    color: '#666',
  },
  acceptedText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D7A7A',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  findRideButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  findRideText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  switchProfileButton: {
    alignItems: 'center',
    marginBottom: 20,
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

