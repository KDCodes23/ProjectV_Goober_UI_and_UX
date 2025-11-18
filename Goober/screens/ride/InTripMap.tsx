// /screens/InTripMap.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { InTripMapScreenProps } from '../../types/navigation';
import { useRide } from '../../contexts/RideContext';
import LiveMap from '../../components/LiveMap';
import { MapService, MapLocation } from '../../services/mapService';

export default function InTripMap({ navigation }: InTripMapScreenProps) {
  const { activeRide } = useRide();
  const [origin, setOrigin] = useState<MapLocation | null>(null);
  const [destination, setDestination] = useState<MapLocation | null>(null);
  const [currentLocation, setCurrentLocation] = useState<MapLocation | null>(null);

  useEffect(() => {
    loadLocations();
  }, [activeRide]);

  const loadLocations = async () => {
    if (activeRide) {
      // Geocode addresses to get coordinates
      const fromCoords = await MapService.geocodeAddress(
        activeRide.from.address || activeRide.from.name
      );
      const toCoords = await MapService.geocodeAddress(
        activeRide.to.address || activeRide.to.name
      );

      if (fromCoords) {
        setOrigin({ ...fromCoords, address: activeRide.from.name });
      }
      if (toCoords) {
        setDestination({ ...toCoords, address: activeRide.to.name });
      }
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Live Map */}
      <View style={styles.mapContainer}>
        <LiveMap
          origin={origin || undefined}
          destination={destination || undefined}
          showCurrentLocation={true}
          showRoute={true}
          onLocationUpdate={(location) => setCurrentLocation(location)}
        />
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <View style={styles.locationLabel}>
          <Text style={styles.locationText}>Lagos</Text>
        </View>
      </View>

      {/* Trip Details Card */}
      <View style={styles.tripCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Driving to destination</Text>
          <TouchableOpacity
            onPress={() => {
              // TODO: Navigate to notifications screen
              console.log('Notifications pressed');
            }}
          >
            <Ionicons name="notifications-outline" size={24} color="#FF0000" />
          </TouchableOpacity>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
          <View style={styles.carIcon}>
            <Ionicons name="car" size={20} color="#2D7A7A" />
          </View>
        </View>

        <View style={styles.locationsRow}>
          <View style={styles.locationItem}>
            <Text style={styles.locationLabel}>PICK UP</Text>
            <Text style={styles.locationValue}>Alagomeji Bus stop</Text>
          </View>
          <View style={styles.locationItem}>
            <Text style={styles.locationLabel}>DROP OFF</Text>
            <Text style={styles.locationValue}>Lekki Gate Bus stop</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Driver Info */}
        <View style={styles.driverInfo}>
          <View style={styles.driverImage}>
            <Ionicons name="person" size={24} color="#999" />
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark" size={10} color="#fff" />
            </View>
          </View>
          <View style={styles.driverDetails}>
            <Text style={styles.driverName}>Ride share with Diran Olakunle</Text>
            <Text style={styles.carInfo}>Toyota Camry • JJJ 452 FZ</Text>
            <Text style={styles.rideDate}>Fri 18 Aug, 06:00 AM</Text>
          </View>
        </View>

        <View style={styles.etaContainer}>
          <Text style={styles.etaLabel}>Estimated arrival to drop off</Text>
          <Text style={styles.etaValue}>30mins</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.shareButton, { marginRight: 12 }]}
            onPress={() => {
              // TODO: Share trip status
              console.log('Share trip status');
            }}
          >
            <Text style={styles.shareButtonText}>Share trip status</Text>
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
          onPress={() => {
            // TODO: Navigate to trips screen
            console.log('Trips pressed');
          }}
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
    backgroundColor: '#F5F5F5',
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#E5E5E5',
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  locationLabel: {
    position: 'absolute',
    top: 20,
    left: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  tripCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D7A7A',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
    marginBottom: 20,
    position: 'relative',
  },
  progressFill: {
    width: '60%',
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  carIcon: {
    position: 'absolute',
    left: '58%',
    top: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  locationsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  locationItem: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
    fontWeight: '600',
  },
  locationValue: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 16,
  },
  driverInfo: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  driverImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  carInfo: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  rideDate: {
    fontSize: 12,
    color: '#666',
  },
  etaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  etaLabel: {
    fontSize: 14,
    color: '#666',
  },
  etaValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  shareButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFD700',
  },
  reportButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  reportButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
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

