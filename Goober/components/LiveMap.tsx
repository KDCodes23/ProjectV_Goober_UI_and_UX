// /components/LiveMap.tsx

import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { MapService, MapLocation } from '../services/mapService';
import { Ionicons } from '@expo/vector-icons';

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
  const [region, setRegion] = useState<MapLocation>({
    latitude: 6.5244, // Default to Lagos, Nigeria
    longitude: 3.3792,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });
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

      setRegion({
        latitude: (minLat + maxLat) / 2,
        longitude: (minLon + maxLon) / 2,
        latitudeDelta: Math.max(latDelta, 0.01),
        longitudeDelta: Math.max(lonDelta, 0.01),
      });

      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: (minLat + maxLat) / 2,
          longitude: (minLon + maxLon) / 2,
          latitudeDelta: Math.max(latDelta, 0.01),
          longitudeDelta: Math.max(lonDelta, 0.01),
        });
      }
    } else if (currentLocation) {
      setRegion({
        ...currentLocation,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [origin, destination, currentLocation]);

  const initializeMap = async () => {
    if (showCurrentLocation) {
      const location = await MapService.getCurrentLocation();
      if (location) {
        setCurrentLocation(location);
        setRegion(location);
        onLocationUpdate?.(location);

        // Start watching location
        const subscription = await MapService.watchLocation((loc) => {
          setCurrentLocation(loc);
          onLocationUpdate?.(loc);
        });
        locationSubscriptionRef.current = subscription;
      }
    }
  };

  const routeCoordinates = origin && destination
    ? [
        { latitude: origin.latitude, longitude: origin.longitude },
        { latitude: destination.latitude, longitude: destination.longitude },
      ]
    : [];

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

