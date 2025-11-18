// /screens/RideRating.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RideRatingScreenProps } from '../../types/navigation';

interface Passenger {
  id: string;
  name: string;
  rating: number;
}

const passengers: Passenger[] = [
  { id: '1', name: 'Ronke Oshodi', rating: 4 },
  { id: '2', name: 'Segun Dabiri', rating: 0 },
];

export default function RideRating({ navigation }: RideRatingScreenProps) {
  const [rideRating, setRideRating] = useState(4);
  const [passengerRatings, setPassengerRatings] = useState<{ [key: string]: number }>({
    '1': 4,
    '2': 0,
  });

  const handlePassengerRating = (passengerId: string, rating: number) => {
    setPassengerRatings({ ...passengerRatings, [passengerId]: rating });
  };

  const handleContinue = () => {
    navigation.navigate('LeaveComment');
  };

  return (
    <Modal visible={true} animationType="slide" transparent>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>How was your ride?</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="close" size={24} color="#1A1A1A" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            {/* Ride Info */}
            <View style={styles.rideInfo}>
              <View style={styles.rideDetails}>
                <Text style={styles.rideText}>Ride share with Michael Johnson</Text>
                <Text style={styles.rideDate}>Fri 18 Aug, 06:00 AM</Text>
              </View>
              <View style={styles.driverImage}>
                <Ionicons name="person" size={24} color="#999" />
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark" size={10} color="#fff" />
                </View>
              </View>
            </View>

            {/* Ride Rating */}
            <View style={styles.ratingSection}>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setRideRating(star)}
                    style={[styles.starButton, star < 5 && { marginRight: 8 }]}
                  >
                    <Ionicons
                      name={star <= rideRating ? 'star' : 'star-outline'}
                      size={40}
                      color="#FF8800"
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.anonymousText}>Your feedback is anonymous</Text>
            </View>

            <View style={styles.divider} />

            {/* Other Passengers */}
            <View style={styles.passengersSection}>
              <Text style={styles.sectionTitle}>Tell us about other passengers</Text>
              {passengers.map((passenger) => (
                <View key={passenger.id} style={styles.passengerRating}>
                  <View style={styles.passengerInfo}>
                    <View style={styles.passengerImage}>
                      <Ionicons name="person" size={20} color="#999" />
                      <View style={styles.verifiedBadgeSmall}>
                        <Ionicons name="checkmark" size={8} color="#fff" />
                      </View>
                    </View>
                    <Text style={styles.passengerName}>{passenger.name}</Text>
                  </View>
                  <View style={styles.starsRow}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <TouchableOpacity
                        key={star}
                        onPress={() => handlePassengerRating(passenger.id, star)}
                        style={star < 5 && { marginRight: 4 }}
                      >
                        <Ionicons
                          name={star <= passengerRatings[passenger.id] ? 'star' : 'star-outline'}
                          size={24}
                          color="#FF8800"
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.bottomActions}>
            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.reportButton}
              onPress={() => {
                // TODO: Report an issue
                console.log('Report an issue');
              }}
            >
              <Text style={styles.reportButtonText}>Report an issue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
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
  rideInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  rideDetails: {
    flex: 1,
  },
  rideText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  rideDate: {
    fontSize: 14,
    color: '#666',
  },
  driverImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FF8800',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  verifiedBadgeSmall: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FF8800',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    justifyContent: 'center',
  },
  starButton: {
    marginHorizontal: 4,
  },
  anonymousText: {
    fontSize: 12,
    color: '#999',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 20,
  },
  passengersSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  passengerRating: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  passengerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  passengerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  passengerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  starsRow: {
    flexDirection: 'row',
  },
  bottomActions: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  continueButton: {
    backgroundColor: '#FF8800',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  reportButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  reportButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
  },
});

