// /screens/TripDetails.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { TripDetailsScreenProps } from '../types/navigation';

export default function TripDetails({ navigation }: TripDetailsScreenProps) {
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
          <Text style={styles.headerTitle}>TRIP DETAILS</Text>
        </View>

        {/* Route Info */}
        <View style={styles.routeInfo}>
          <Text style={styles.routeFrom}>Cold Stone Yaba</Text>
          <Ionicons name="arrow-forward" size={16} color="#FF8800" style={{ marginHorizontal: 8 }} />
          <Text style={styles.routeTo}>Lekki Phase 1, Lekki</Text>
        </View>
        <Text style={styles.tripSummary}>Fri 18 Aug • 06:00 AM • 2 Seats</Text>

        {/* Departure Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Departure</Text>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>PICK UP</Text>
            <View style={styles.inputField}>
              <Ionicons name="location-outline" size={16} color="#999" />
              <Text style={styles.inputText}>Alagomeji Bus stop</Text>
            </View>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>DROP OFF</Text>
            <View style={styles.inputField}>
              <Ionicons name="location-outline" size={16} color="#999" />
              <Text style={styles.inputText}>Lekki Gate Bus stop</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={20} color="#666" style={{ marginRight: 8 }} />
              <Text style={styles.infoLabel}>Depart</Text>
            </View>
            <Text style={styles.infoValue}>06:00 AM</Text>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="person-outline" size={20} color="#666" />
              <Text style={styles.infoLabel}>Seats available</Text>
            </View>
            <Text style={styles.infoValue}>2</Text>
          </View>
        </View>

        {/* Return Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Return</Text>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>PICK UP</Text>
            <View style={styles.inputField}>
              <Ionicons name="location-outline" size={16} color="#999" />
              <Text style={styles.inputText}>Lekki Gate Bus stop</Text>
            </View>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>DROP OFF</Text>
            <View style={styles.inputField}>
              <Ionicons name="location-outline" size={16} color="#999" />
              <Text style={styles.inputText}>Alagomeji Bus stop</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={20} color="#666" />
              <Text style={styles.infoLabel}>Return</Text>
            </View>
            <Text style={styles.infoValue}>06:00 PM</Text>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="person-outline" size={20} color="#666" />
              <Text style={styles.infoLabel}>Seats available</Text>
            </View>
            <Text style={styles.infoValue}>2</Text>
          </View>
        </View>

        {/* Driver Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Driver and Vehicle details</Text>
          <View style={styles.driverInfo}>
            <View style={styles.profileImage}>
              <Ionicons name="person" size={32} color="#999" />
            </View>
            <View style={styles.driverDetails}>
              <Text style={styles.driverName}>Olakunle Diran</Text>
              <Text style={styles.verifiedText}>Verified driver</Text>
            </View>
            <View style={styles.ratingContainer}>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={16} color="#FFD700" style={{ marginRight: 4 }} />
                <Text style={styles.rating}>4.9</Text>
              </View>
              <Text style={styles.trips}>50 Trips</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <Text style={styles.priceLabel}>$25/Passenger</Text>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => navigation.navigate('TripGoldenRules')}
        >
          <Text style={styles.bookButtonText}>Book</Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
  routeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
  tripSummary: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  fieldRow: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
    fontWeight: '600',
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  inputText: {
    fontSize: 14,
    color: '#1A1A1A',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  verifiedText: {
    fontSize: 12,
    color: '#4CAF50',
  },
  ratingContainer: {
    alignItems: 'flex-end',
    marginRight: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  trips: {
    fontSize: 12,
    color: '#666',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF8800',
  },
  bookButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
});

