// /screens/Trips.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { TripsScreenProps } from '../types/navigation';
import { useRide } from '../contexts/RideContext';

interface Trip {
  id: string;
  from: string;
  to: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  driverName?: string;
  price?: number;
}

const mockTrips: Trip[] = [
  {
    id: '1',
    from: 'Times Square',
    to: 'Central Park',
    date: 'Mon 20 Jan',
    time: '10:00 AM',
    status: 'upcoming',
    driverName: 'Michael Johnson',
    price: 15.50,
  },
  {
    id: '2',
    from: 'Empire State Building',
    to: 'Brooklyn Bridge',
    date: 'Fri 17 Jan',
    time: '02:30 PM',
    status: 'completed',
    driverName: 'Sarah Williams',
    price: 22.00,
  },
  {
    id: '3',
    from: 'Statue of Liberty',
    to: 'LAX Airport',
    date: 'Wed 15 Jan',
    time: '08:00 AM',
    status: 'completed',
    driverName: 'David Brown',
    price: 45.75,
  },
];

export default function Trips({ navigation }: TripsScreenProps) {
  const { activeRide } = useRide();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return '#FFD700';
      case 'completed':
        return '#4CAF50';
      case 'cancelled':
        return '#FF0000';
      default:
        return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'Upcoming';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Trips</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Ionicons name="close" size={24} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Active Ride Section */}
        {activeRide && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Trip</Text>
            <View style={styles.tripCard}>
              <View style={styles.tripHeader}>
                <View style={styles.tripInfo}>
                  <Text style={styles.tripRoute}>{activeRide.from.name} → {activeRide.to.name}</Text>
                  <Text style={styles.tripDateTime}>{activeRide.date}, {activeRide.time}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: '#FFD700' }]}>
                  <Text style={styles.statusBadgeText}>Active</Text>
                </View>
              </View>
              <View style={styles.tripDetails}>
                <View style={styles.driverInfo}>
                  <Ionicons name="person" size={20} color="#666" />
                  <Text style={styles.driverText}>{activeRide.driverName}</Text>
                </View>
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() => {
                    // Navigate to appropriate active ride screen
                    switch (activeRide.status) {
                      case 'accepted':
                        navigation.navigate('BookingAccepted');
                        break;
                      case 'enRoute':
                        navigation.navigate('DriverEnRoute');
                        break;
                      case 'arrived':
                        navigation.navigate('DriverArrived');
                        break;
                      case 'inTrip':
                        navigation.navigate('InTripMap');
                        break;
                      default:
                        navigation.navigate('Home');
                    }
                  }}
                >
                  <Text style={styles.viewButtonText}>View</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Past Trips Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Past Trips</Text>
          {mockTrips.map((trip) => (
            <View key={trip.id} style={styles.tripCard}>
              <View style={styles.tripHeader}>
                <View style={styles.tripInfo}>
                  <Text style={styles.tripRoute}>{trip.from} → {trip.to}</Text>
                  <Text style={styles.tripDateTime}>{trip.date}, {trip.time}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(trip.status) }]}>
                  <Text style={styles.statusBadgeText}>{getStatusText(trip.status)}</Text>
                </View>
              </View>
              <View style={styles.tripDetails}>
                {trip.driverName && (
                  <View style={styles.driverInfo}>
                    <Ionicons name="person" size={20} color="#666" />
                    <Text style={styles.driverText}>{trip.driverName}</Text>
                  </View>
                )}
                {trip.price && (
                  <Text style={styles.priceText}>${trip.price.toFixed(2)}</Text>
                )}
              </View>
            </View>
          ))}
        </View>

        {mockTrips.length === 0 && !activeRide && (
          <View style={styles.emptyContainer}>
            <Ionicons name="car-outline" size={64} color="#999" />
            <Text style={styles.emptyText}>No trips yet</Text>
            <Text style={styles.emptySubtext}>Your trip history will appear here</Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="home" size={24} color="#999" />
          <Text style={[styles.navLabel, styles.navLabelInactive]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Trips')}
        >
          <Ionicons name="car-outline" size={24} color="#2D7A7A" />
          <Text style={styles.navLabel}>Trips</Text>
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
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  tripCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tripInfo: {
    flex: 1,
  },
  tripRoute: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  tripDateTime: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  tripDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF8800',
  },
  viewButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
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

