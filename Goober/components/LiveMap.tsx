// /components/LiveMap.tsx

import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, Text, Platform } from 'react-native';
import { MapService, MapLocation } from '../services/mapService';
import { Ionicons } from '@expo/vector-icons';

// Conditionally import react-native-maps only on native platforms
let MapView: any, Marker: any, Polyline: any, PROVIDER_GOOGLE: any;
if (Platform.OS !== 'web') {
  try {
    const Maps = require('react-native-maps');
    MapView = Maps.default;
    Marker = Maps.Marker;
    Polyline = Maps.Polyline;
    PROVIDER_GOOGLE = Maps.PROVIDER_GOOGLE;
  } catch (error) {
    console.warn('react-native-maps not available:', error);
  }
}

interface LiveMapProps {
  origin?: MapLocation;
  destination?: MapLocation;
  showCurrentLocation?: boolean;
  showRoute?: boolean;
  onLocationUpdate?: (location: MapLocation) => void;
}

const { width, height } = Dimensions.get('window');

export default function LiveMap({
  origin,
  destination,
  showCurrentLocation = true,
  showRoute = false,
  onLocationUpdate,
}: LiveMapProps) {
  const [currentLocation, setCurrentLocation] = useState<MapLocation | null>(null);
  const [region, setRegion] = useState<MapLocation | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const mapRef = useRef<MapView>(null);
  const locationSubscriptionRef = useRef<any>(null);

  useEffect(() => {
    initializeMap();
    return () => {
      if (locationSubscriptionRef.current) {
        locationSubscriptionRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (origin && destination) {
      // Fit map to show both origin and destination
      const minLat = Math.min(origin.latitude, destination.latitude);
      const maxLat = Math.max(origin.latitude, destination.latitude);
      const minLon = Math.min(origin.longitude, destination.longitude);
      const maxLon = Math.max(origin.longitude, destination.longitude);

      const latDelta = (maxLat - minLat) * 1.5;
      const lonDelta = (maxLon - minLon) * 1.5;

      const newRegion = {
        latitude: (minLat + maxLat) / 2,
        longitude: (minLon + maxLon) / 2,
        latitudeDelta: Math.max(latDelta, 0.01),
        longitudeDelta: Math.max(lonDelta, 0.01),
      };

      setRegion(newRegion);

      if (mapRef.current && Platform.OS !== 'web') {
        mapRef.current.animateToRegion(newRegion);
      }
    } else if (currentLocation) {
      const newRegion = {
        ...currentLocation,
        latitudeDelta: currentLocation.latitudeDelta || 0.05,
        longitudeDelta: currentLocation.longitudeDelta || 0.05,
      };
      setRegion(newRegion);
      
      if (mapRef.current && Platform.OS !== 'web') {
        mapRef.current.animateToRegion(newRegion);
      }
    }
  }, [origin, destination, currentLocation]);

  const initializeMap = async () => {
    if (showCurrentLocation) {
      setLoadingLocation(true);
      const location = await MapService.getCurrentLocation();
      if (location) {
        setCurrentLocation(location);
        setRegion({
          ...location,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
        onLocationUpdate?.(location);

        // Start watching location
        const subscription = await MapService.watchLocation((loc) => {
          setCurrentLocation(loc);
          onLocationUpdate?.(loc);
        });
        locationSubscriptionRef.current = subscription;
      } else {
        // Fallback to a default location if GPS fails (e.g., on web without permission)
        console.warn('Could not get current location, using default');
        setRegion({
          latitude: 40.7128, // Default to New York, USA
          longitude: -74.0060,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        });
      }
      setLoadingLocation(false);
    } else {
      setLoadingLocation(false);
    }
  };

  const routeCoordinates = origin && destination
    ? [
        { latitude: origin.latitude, longitude: origin.longitude },
        { latitude: destination.latitude, longitude: destination.longitude },
      ]
    : [];

  // Web fallback - show a placeholder view
  if (Platform.OS === 'web' || !MapView) {
    return (
      <View style={[styles.container, styles.webFallback]}>
        <View style={styles.webFallbackContent}>
          <Ionicons name="map" size={48} color="#666" />
          <Text style={styles.webFallbackText}>Map View</Text>
          {origin && (
            <Text style={styles.webFallbackSubtext}>
              From: {origin.address || `${origin.latitude}, ${origin.longitude}`}
            </Text>
          )}
          {destination && (
            <Text style={styles.webFallbackSubtext}>
              To: {destination.address || `${destination.latitude}, ${destination.longitude}`}
            </Text>
          )}
          <Text style={styles.webFallbackNote}>
            Maps are available on iOS and Android
          </Text>
        </View>
      </View>
    );
  }

  // Don't render map if region is not set yet
  if (!region) {
    return (
      <View style={[styles.container, styles.webFallback]}>
        <View style={styles.webFallbackContent}>
          <Ionicons name="map" size={48} color="#666" />
          <Text style={styles.webFallbackText}>Loading map...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={region}
        showsUserLocation={showCurrentLocation}
        showsMyLocationButton={true}
        followsUserLocation={showCurrentLocation}
        mapType="standard"
      >
        {origin && (
          <Marker
            coordinate={{
              latitude: origin.latitude,
              longitude: origin.longitude,
            }}
            title="Pickup"
            description={origin.address || 'Pickup location'}
          >
            <View style={styles.markerContainer}>
              <View style={[styles.marker, styles.originMarker]}>
                <Ionicons name="location" size={24} color="#4CAF50" />
              </View>
            </View>
          </Marker>
        )}

        {destination && (
          <Marker
            coordinate={{
              latitude: destination.latitude,
              longitude: destination.longitude,
            }}
            title="Destination"
            description={destination.address || 'Destination location'}
          >
            <View style={styles.markerContainer}>
              <View style={[styles.marker, styles.destinationMarker]}>
                <Ionicons name="location" size={24} color="#FF0000" />
              </View>
            </View>
          </Marker>
        )}

        {showRoute && routeCoordinates.length === 2 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#2D7A7A"
            strokeWidth={4}
            lineDashPattern={[5, 5]}
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webFallback: {
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  webFallbackContent: {
    alignItems: 'center',
    padding: 20,
  },
  webFallbackText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  webFallbackSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  webFallbackNote: {
    fontSize: 12,
    color: '#999',
    marginTop: 16,
    fontStyle: 'italic',
  },
  map: {
    width: width,
    height: height,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  marker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  originMarker: {
    borderColor: '#4CAF50',
  },
  destinationMarker: {
    borderColor: '#FF0000',
  },
});

