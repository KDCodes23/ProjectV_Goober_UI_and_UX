// /screens/AvailableRides.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AvailableRidesScreenProps } from '../../types/navigation';
import { useRide } from '../../contexts/RideContext';

interface Driver {
  id: string;
  name: string;
  rating: number;
  trips: number;
  departTime: string;
  distance: string;
  price: number;
  vehicle?: string;
  isPrevious?: boolean;
}

const drivers: Driver[] = [
  { id: '1', name: 'Michael Johnson', rating: 4.9, trips: 50, departTime: '06:00 AM', distance: '0.3km away', price: 25, isPrevious: true },
  { id: '2', name: 'Sarah Williams', rating: 4.5, trips: 30, departTime: '06:15 AM', distance: '0.4km away', price: 30, isPrevious: true },
  { id: '3', name: 'David Brown', rating: 4.3, trips: 25, departTime: '06:15 AM', distance: '0.4km away', price: 33, isPrevious: true },
  { id: '4', name: 'Emily Davis', rating: 4.2, trips: 20, departTime: '06:00 AM', distance: '0.3km away', price: 25 },
  { id: '5', name: 'James Miller', rating: 4.6, trips: 35, departTime: '06:15 AM', distance: '0.4km away', price: 26 },
];

export default function AvailableRides({ navigation }: AvailableRidesScreenProps) {
  const { booking } = useRide();
  const [filter, setFilter] = useState<'all' | 'male' | 'female'>('all');

  const previousDrivers = drivers.filter((d) => d.isPrevious);
  const contactDrivers = drivers.filter((d) => !d.isPrevious);

  // Format booking data for display
  const fromName = booking.from?.name || 'Select location';
  const fromAddress = booking.from?.address?.split(',')[1]?.trim() || '';
  const toName = booking.to?.name || 'Select location';
  const toAddress = booking.to?.address?.split(',')[1]?.trim() || '';
  const tripDate = booking.date || 'Fri 18 Aug';
  const tripTime = booking.time || '06:00 AM';
  const seats = booking.seats || 1;

  const renderDriverCard = (driver: Driver) => (
    <TouchableOpacity
      style={styles.driverCard}
      onPress={() => navigation.navigate('TripDetails', { driverId: driver.id })}
    >
      <View style={styles.driverHeader}>
        <View style={styles.profileContainer}>
          <View style={styles.profileImage}>
            <Ionicons name="person" size={24} color="#999" />
          </View>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>{driver.rating}</Text>
          </View>
        </View>
        <View style={styles.driverInfo}>
          <Text style={styles.driverName}>{driver.name}</Text>
          <View style={styles.driverMeta}>
            <Text style={styles.departTime}>{driver.departTime}</Text>
            <Ionicons name="swap-vertical" size={16} color="#666" style={[styles.swapIcon, { marginHorizontal: 4 }]} />
            <Text style={styles.distance}>{driver.distance}</Text>
          </View>
        </View>
        <Text style={styles.price}>${driver.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <View style={styles.routeInfo}>
            <Text style={styles.routeFrom} numberOfLines={1}>{fromName}</Text>
            {fromAddress ? <Text style={styles.routeLocation}>{fromAddress}</Text> : null}
            <Ionicons name="arrow-forward" size={16} color="#666" style={styles.routeArrow} />
            <Text style={styles.routeTo} numberOfLines={1}>{toName}</Text>
            {toAddress ? <Text style={styles.routeLocation}>{toAddress}</Text> : null}
          </View>
        </View>

        {/* Trip Info */}
        <View style={styles.tripInfo}>
          <Text style={styles.tripText}>{tripDate} • {tripTime} • {seats} {seats === 1 ? 'Seat' : 'Seats'}</Text>
        </View>

        {/* Filters */}
        <View style={styles.filters}>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'male' && styles.filterButtonActive, { marginLeft: 12 }]}
            onPress={() => setFilter('male')}
          >
            <Text style={[styles.filterText, filter === 'male' && styles.filterTextActive]}>
              Male only
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'female' && styles.filterButtonActive, { marginLeft: 12 }]}
            onPress={() => setFilter('female')}
          >
            <Text style={[styles.filterText, filter === 'female' && styles.filterTextActive]}>
              Female only
            </Text>
          </TouchableOpacity>
        </View>

        {/* Previous Drivers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AVAILABLE RIDES</Text>
          <Text style={styles.sectionSubtitle}>Drivers you previously shared a ride with</Text>
          {previousDrivers.map((driver) => renderDriverCard(driver))}
        </View>

        {/* Contact Drivers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>People in you contact</Text>
          <Text style={styles.sectionSubtitle}>
            These suggestions are based off people in your contact who are on Goober.
          </Text>
          {contactDrivers.map((driver) => renderDriverCard(driver))}
        </View>
      </ScrollView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  routeInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  routeFrom: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF8800',
  },
  routeTo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF8800',
  },
  routeLocation: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  routeArrow: {
    marginHorizontal: 8,
  },
  tripInfo: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  tripText: {
    fontSize: 14,
    color: '#666',
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  filterButtonActive: {
    backgroundColor: '#FFD700',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#1A1A1A',
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  driverCard: {
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
  driverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileContainer: {
    position: 'relative',
    marginRight: 12,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingBadge: {
    position: 'absolute',
    bottom: -4,
    left: -4,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  ratingText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
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
  driverMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  departTime: {
    fontSize: 14,
    color: '#666',
  },
  swapIcon: {
    marginHorizontal: 4,
  },
  distance: {
    fontSize: 14,
    color: '#666',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF8800',
  },
});

