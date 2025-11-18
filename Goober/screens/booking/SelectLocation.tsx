// /screens/SelectLocation.tsx

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SelectLocationScreenProps } from '../../types/navigation';
import { useRide, Location } from '../../contexts/RideContext';
import { MapService, PlaceResult } from '../../services/mapService';

// Test destinations with real US coordinates
const testDestinations: PlaceResult[] = [
  {
    placeId: 'test-1',
    description: 'Times Square, New York, NY',
    mainText: 'Times Square',
    secondaryText: 'New York, NY',
    latitude: 40.7580,
    longitude: -73.9855,
  },
  {
    placeId: 'test-2',
    description: 'Central Park, New York, NY',
    mainText: 'Central Park',
    secondaryText: 'New York, NY',
    latitude: 40.7829,
    longitude: -73.9654,
  },
  {
    placeId: 'test-3',
    description: 'Empire State Building, New York, NY',
    mainText: 'Empire State Building',
    secondaryText: 'New York, NY',
    latitude: 40.7484,
    longitude: -73.9857,
  },
  {
    placeId: 'test-4',
    description: 'Brooklyn Bridge, New York, NY',
    mainText: 'Brooklyn Bridge',
    secondaryText: 'New York, NY',
    latitude: 40.7061,
    longitude: -73.9969,
  },
  {
    placeId: 'test-5',
    description: 'Statue of Liberty, New York, NY',
    mainText: 'Statue of Liberty',
    secondaryText: 'New York, NY',
    latitude: 40.6892,
    longitude: -74.0445,
  },
  {
    placeId: 'test-6',
    description: 'Los Angeles International Airport, Los Angeles, CA',
    mainText: 'LAX Airport',
    secondaryText: 'Los Angeles, CA',
    latitude: 33.9425,
    longitude: -118.4081,
  },
  {
    placeId: 'test-7',
    description: 'Golden Gate Bridge, San Francisco, CA',
    mainText: 'Golden Gate Bridge',
    secondaryText: 'San Francisco, CA',
    latitude: 37.8199,
    longitude: -122.4783,
  },
  {
    placeId: 'test-8',
    description: 'Chicago O\'Hare International Airport, Chicago, IL',
    mainText: 'O\'Hare Airport',
    secondaryText: 'Chicago, IL',
    latitude: 41.9786,
    longitude: -87.9048,
  },
  {
    placeId: 'test-9',
    description: 'Miami Beach, Miami, FL',
    mainText: 'Miami Beach',
    secondaryText: 'Miami, FL',
    latitude: 25.7907,
    longitude: -80.1300,
  },
  {
    placeId: 'test-10',
    description: 'Las Vegas Strip, Las Vegas, NV',
    mainText: 'Las Vegas Strip',
    secondaryText: 'Las Vegas, NV',
    latitude: 36.1147,
    longitude: -115.1728,
  },
];

export default function SelectLocation({ navigation, route }: SelectLocationScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [searchResults, setSearchResults] = useState<PlaceResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { updateBooking } = useRide();
  const isFrom = route.params?.type === 'from';
  const title = isFrom ? 'Where are you leaving from?' : 'Where are you heading?';

  // Get current location for search bias
  useEffect(() => {
    MapService.getCurrentLocation().then((location) => {
      if (location) {
        setCurrentLocation({ latitude: location.latitude, longitude: location.longitude });
      }
    });
  }, []);

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await MapService.searchPlaces(
          searchQuery,
          currentLocation || undefined
        );
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching places:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500); // 500ms debounce

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, currentLocation]);

  const handleSelectLocation = async (place: PlaceResult) => {
    const locationData: Location = {
      name: place.mainText,
      address: place.description,
      latitude: place.latitude,
      longitude: place.longitude,
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
            {isSearching && searchQuery.length >= 2 && (
              <ActivityIndicator size="small" color="#666" style={{ marginRight: 8 }} />
            )}
            {searchQuery.length > 0 && !isSearching && (
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
        {searchQuery.length >= 2 ? (
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.placeId}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.locationItem}
                onPress={() => handleSelectLocation(item)}
              >
                <Ionicons name="location-outline" size={24} color="#666" style={styles.locationIcon} />
                <View style={styles.locationInfo}>
                  <Text style={styles.locationName}>{item.mainText}</Text>
                  {item.secondaryText ? (
                    <Text style={styles.locationAddress}>{item.secondaryText}</Text>
                  ) : null}
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              isSearching ? (
                <View style={styles.emptyContainer}>
                  <ActivityIndicator size="large" color="#FFD700" />
                  <Text style={styles.emptyText}>Searching places...</Text>
                </View>
              ) : (
                <View style={styles.emptyContainer}>
                  <Ionicons name="search-outline" size={48} color="#999" />
                  <Text style={styles.emptyText}>No places found</Text>
                  <Text style={styles.emptySubtext}>Try a different search term or select from test destinations below</Text>
                </View>
              )
            }
            ListFooterComponent={
              searchResults.length > 0 ? null : (
                <View style={styles.testDestinationsSection}>
                  <Text style={styles.sectionLabel}>Or choose a test destination:</Text>
                  {testDestinations.slice(0, 5).map((dest) => (
                    <TouchableOpacity
                      key={dest.placeId}
                      style={styles.locationItem}
                      onPress={() => handleSelectLocation(dest)}
                    >
                      <Ionicons name="location-outline" size={24} color="#666" style={styles.locationIcon} />
                      <View style={styles.locationInfo}>
                        <Text style={styles.locationName}>{dest.mainText}</Text>
                        <Text style={styles.locationAddress}>{dest.secondaryText}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>
                  ))}
                </View>
              )
            }
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <FlatList
            data={testDestinations}
            keyExtractor={(item) => item.placeId}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.locationItem}
                onPress={() => handleSelectLocation(item)}
              >
                <Ionicons name="location-outline" size={24} color="#666" style={styles.locationIcon} />
                <View style={styles.locationInfo}>
                  <Text style={styles.locationName}>{item.mainText}</Text>
                  <Text style={styles.locationAddress}>{item.secondaryText}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
            )}
            ListHeaderComponent={
              <View style={styles.recentSection}>
                <Text style={styles.recentLabel}>TEST DESTINATIONS</Text>
                <Text style={styles.recentSubtext}>Tap to select a location</Text>
              </View>
            }
            contentContainerStyle={styles.listContent}
          />
        )}
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
    marginBottom: 4,
  },
  recentSubtext: {
    fontSize: 11,
    color: '#999',
    fontStyle: 'italic',
  },
  testDestinationsSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  sectionLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
    marginBottom: 12,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

