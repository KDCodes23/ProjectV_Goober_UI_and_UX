// /screens/OtherPassengers.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { OtherPassengersScreenProps } from '../types/navigation';

interface Passenger {
  id: string;
  name: string;
  rating: number;
  trips: number;
  memberSince: string;
  verified: boolean;
}

const passengers: Passenger[] = [
  { id: '1', name: 'Ronke Oshodi', rating: 4.4, trips: 14, memberSince: '2025', verified: true },
  { id: '2', name: 'Segun Dabiri', rating: 4.9, trips: 23, memberSince: '2022', verified: true },
  { id: '3', name: 'Adedeji Omotola', rating: 4.2, trips: 18, memberSince: '2023', verified: true },
];

export default function OtherPassengers({ navigation }: OtherPassengersScreenProps) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>OTHER PASSENGERS</Text>
        </View>

        {/* Passenger List */}
        {passengers.map((passenger) => (
          <View key={passenger.id} style={styles.passengerCard}>
            <View style={styles.passengerHeader}>
              <View style={styles.profileContainer}>
                <View style={styles.profileImage}>
                  <Ionicons name="person" size={32} color="#999" />
                </View>
                {passenger.verified && (
                  <View style={styles.verifiedBadge}>
                    <Ionicons name="checkmark" size={12} color="#fff" />
                  </View>
                )}
              </View>
              <View style={styles.passengerInfo}>
                <Text style={styles.passengerName}>{passenger.name}</Text>
                <View style={styles.ratingRow}>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color="#FFD700" style={{ marginRight: 4 }} />
                    <Text style={styles.rating}>{passenger.rating}</Text>
                  </View>
                  <Text style={styles.trips}>{passenger.trips} Trips</Text>
                </View>
              </View>
            </View>

            <View style={styles.profileDetails}>
              <Text style={styles.detailsTitle}>Profile Details</Text>
              <View style={styles.detailItem}>
                <Ionicons name="checkmark-circle" size={20} color="#FF8800" style={{ marginRight: 8 }} />
                <Text style={styles.detailText}>Verified passenger</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="checkmark-circle" size={20} color="#FF8800" style={{ marginRight: 8 }} />
                <Text style={styles.detailText}>Verified phone number</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="checkmark-circle" size={20} color="#FF8800" style={{ marginRight: 8 }} />
                <Text style={styles.detailText}>Verified Identity</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="checkmark-circle" size={20} color="#FF8800" style={{ marginRight: 8 }} />
                <Text style={styles.detailText}>Member since {passenger.memberSince}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  passengerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  passengerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileContainer: {
    position: 'relative',
    marginRight: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF8800',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  passengerInfo: {
    flex: 1,
  },
  passengerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  trips: {
    fontSize: 14,
    color: '#666',
  },
  profileDetails: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingTop: 16,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#1A1A1A',
  },
});

