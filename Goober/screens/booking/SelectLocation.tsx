// /screens/SelectLocation.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SelectLocationScreenProps } from '../../types/navigation';
import { useRide, Location } from '../../contexts/RideContext';
import { MapService } from '../../services/mapService';

interface LocationItem {
  id: string;
  name: string;
  address: string;
}

const mockLocations: LocationItem[] = [
  { id: '1', name: 'Lekki Phase I', address: 'Lekki' },
  { id: '2', name: 'Lekki Penninsula II', address: 'Lagos' },
  { id: '3', name: 'Penninsula Garden Estate', address: 'Lekki' },
  { id: '4', name: 'Cold Stone Creamery Yaba', address: 'Herbert Macaulay Way, Lagos' },
  { id: '5', name: 'Cold Stone Creamery Ogudu', address: 'Ogudu Road, Lagos' },
  { id: '6', name: 'Cold Stone Creamery Wuse 2 Abuja', address: 'Amini Kano Crescent, Abuja' },
];

export default function SelectLocation({ navigation, route }: SelectLocationScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(false);
  const { updateBooking } = useRide();
  const isFrom = route.params?.type === 'from';
  const title = isFrom ? 'Where are you leaving from?' : 'Where are you heading?';

  const filteredLocations = mockLocations.filter(
    (location) =>
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectLocation = async (location: LocationItem) => {
    // Geocode the address to get coordinates
    const coords = await MapService.geocodeAddress(location.address || location.name);
    
    const locationData: Location = {
      name: location.name,
      address: location.address,
      latitude: coords?.latitude,
      longitude: coords?.longitude,
    };
    
    if (isFrom) {
      updateBooking({ from: locationData });
    } else {
      updateBooking({ to: locationData });
    }
    
    navigation.goBack();
  };

  const handleUseCurrentLocation = async () => {
    setLoadingLocation(true);
    try {
      const currentLocation = await MapService.getCurrentLocation();
      if (currentLocation) {
        const address = currentLocation.address || 'Current Location';
        const locationData: Location = {
          name: address,
          address: address,
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        };
        
        if (isFrom) {
          updateBooking({ from: locationData });
        } else {
          updateBooking({ to: locationData });
        }
        
        navigation.goBack();
      } else {
        alert('Could not get your current location. Please enable location permissions.');
      }
    } catch (error) {
      console.error('Error getting current location:', error);
      alert('Error getting your location. Please try again.');
    } finally {
      setLoadingLocation(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Yellow Header */}
        <View style={styles.yellowHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.title}>{title}</Text>
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="locate-outline" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity 
            style={styles.currentLocationButton}
            onPress={handleUseCurrentLocation}
            disabled={loadingLocation}
          >
            <Ionicons name="locate-outline" size={20} color="#1A1A1A" />
            <Text style={styles.currentLocationText}>
              {loadingLocation ? 'Getting location...' : 'Use current location'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Location List */}
        <FlatList
          data={filteredLocations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.locationItem}
              onPress={() => handleSelectLocation(item)}
            >
              <Ionicons name="location-outline" size={24} color="#666" style={styles.locationIcon} />
              <View style={styles.locationInfo}>
                <Text style={styles.locationName}>{item.name}</Text>
                <Text style={styles.locationAddress}>{item.address}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          )}
          ListHeaderComponent={
            <View style={styles.recentSection}>
              <Text style={styles.recentLabel}>RECENT</Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDE7',
  },
  keyboardView: {
    flex: 1,
  },
  yellowHeader: {
    backgroundColor: '#FF8800',
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
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  currentLocationText: {
    fontSize: 16,
    color: '#1A1A1A',
    marginLeft: 12,
  },
  listContent: {
    paddingHorizontal: 20,
  },
  recentSection: {
    marginBottom: 16,
  },
  recentLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
    letterSpacing: 1,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  locationIcon: {
    marginRight: 16,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: '#666',
  },
});

