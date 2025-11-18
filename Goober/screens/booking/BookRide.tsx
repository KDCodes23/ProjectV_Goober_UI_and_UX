// /screens/BookRide.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BookRideScreenProps } from '../../types/navigation';
import { useRide } from '../../contexts/RideContext';
import { MapService } from '../../services/mapService';

export default function BookRide({ navigation }: BookRideScreenProps) {
  const { booking, updateBooking } = useRide();
  const [isRoundTrip, setIsRoundTrip] = useState(booking.isRoundTrip || false);
  
  // Calculate distance and cost
  const tripInfo = useMemo(() => {
    if (booking.from?.latitude && booking.from?.longitude && 
        booking.to?.latitude && booking.to?.longitude) {
      const distanceKm = MapService.calculateDistance(
        booking.from.latitude,
        booking.from.longitude,
        booking.to.latitude,
        booking.to.longitude
      );
      const distanceMiles = MapService.kmToMiles(distanceKm);
      const cost = MapService.calculateTripCost(distanceKm);
      const timeMinutes = MapService.calculateTripTime(distanceKm);
      
      // Calculate return trip if round trip
      let returnCost = 0;
      if (isRoundTrip) {
        returnCost = cost; // Same cost for return
      }
      
      return {
        distanceKm,
        distanceMiles,
        cost,
        returnCost,
        totalCost: cost + returnCost,
        timeMinutes,
      };
    }
    return null;
  }, [booking.from, booking.to, isRoundTrip]);

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
          <Text style={styles.headerTitle}>BOOK RIDE</Text>
        </View>

        {/* Departure Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Departure</Text>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>FROM</Text>
            <View style={styles.inputField}>
              <Ionicons name="location-outline" size={16} color="#999" style={{ marginRight: 8 }} />
              <Text style={styles.inputText}>{booking.from?.name || 'Select location'}</Text>
            </View>
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>TO</Text>
            <View style={styles.inputField}>
              <Ionicons name="location-outline" size={16} color="#999" style={{ marginRight: 8 }} />
              <Text style={styles.inputText}>{booking.to?.name || 'Select location'}</Text>
            </View>
          </View>

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
            <Text style={styles.infoValue}>{booking.time || '06:00 AM'}</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="person-outline" size={20} color="#666" style={{ marginRight: 8 }} />
              <Text style={styles.infoLabel}>Seats</Text>
            </View>
            <TouchableOpacity 
              style={styles.seatsSelector}
              onPress={() => navigation.navigate('SelectSeats')}
            >
              <Text style={styles.infoValue}>{booking.seats || 1}</Text>
              <Ionicons name="chevron-down" size={16} color="#666" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="swap-vertical-outline" size={20} color="#666" />
              <Text style={styles.infoLabel}>Round trip</Text>
            </View>
            <Switch
              value={isRoundTrip}
              onValueChange={(value) => {
                setIsRoundTrip(value);
                updateBooking({ isRoundTrip: value });
              }}
              trackColor={{ false: '#E5E5E5', true: '#4CAF50' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Return Section */}
        {isRoundTrip && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Return</Text>

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
          </View>
        )}

        {/* Trip Info */}
        {tripInfo && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trip Details</Text>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Ionicons name="navigate-outline" size={20} color="#666" style={{ marginRight: 8 }} />
                <Text style={styles.infoLabel}>Distance</Text>
              </View>
              <Text style={styles.infoValue}>{tripInfo.distanceMiles} mi ({tripInfo.distanceKm.toFixed(1)} km)</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Ionicons name="time-outline" size={20} color="#666" style={{ marginRight: 8 }} />
                <Text style={styles.infoLabel}>Est. Time</Text>
              </View>
              <Text style={styles.infoValue}>{tripInfo.timeMinutes} min</Text>
            </View>
            {isRoundTrip && (
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Ionicons name="arrow-redo-outline" size={20} color="#666" style={{ marginRight: 8 }} />
                  <Text style={styles.infoLabel}>Return Trip</Text>
                </View>
                <Text style={styles.infoValue}>${tripInfo.returnCost.toFixed(2)}</Text>
              </View>
            )}
          </View>
        )}

        {/* Total Price */}
        <View style={styles.priceSection}>
          <Text style={styles.priceLabel}>Total price</Text>
          <Text style={styles.priceValue}>
            ${tripInfo ? tripInfo.totalCost.toFixed(2) : '0.00'}
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={styles.paymentMethod}
          onPress={() => navigation.navigate('Payment')}
        >
          <View style={styles.cardIcon}>
            {booking.paymentMethod === 'visa' ? (
              <View style={styles.visaIcon}>
                <Text style={styles.visaText}>VISA</Text>
              </View>
            ) : booking.paymentMethod === 'goober' ? (
              <Ionicons name="wallet-outline" size={20} color="#666" />
            ) : (
              <>
                <View style={styles.mastercardCircle1} />
                <View style={styles.mastercardCircle2} />
              </>
            )}
          </View>
          <Text style={styles.cardText}>
            {booking.paymentMethod === 'goober' 
              ? 'Goober Balance' 
              : booking.paymentMethod 
              ? '.... 5678' 
              : 'Select payment'}
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#999" style={{ marginLeft: 12 }} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.confirmButton, !booking.paymentMethod && styles.confirmButtonDisabled]}
          onPress={() => {
            if (booking.paymentMethod) {
              navigation.navigate('LookingForRides');
            } else {
              navigation.navigate('Payment');
            }
          }}
          disabled={!booking.paymentMethod}
        >
          <Text style={styles.confirmButtonText}>
            {booking.paymentMethod ? 'Confirm' : 'Select Payment'}
          </Text>
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
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
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
  seatsSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 16,
    color: '#666',
  },
  priceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF8800',
  },
  bottomBar: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardIcon: {
    width: 40,
    height: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mastercardCircle1: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EB001B',
    position: 'absolute',
    left: 0,
  },
  mastercardCircle2: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F79E1B',
    position: 'absolute',
    right: 0,
  },
  cardText: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
  },
  confirmButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#E5E5E5',
    opacity: 0.6,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  visaIcon: {
    width: 40,
    height: 24,
    backgroundColor: '#1A1F71',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  visaText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

