// /services/mapService.ts

import * as Location from 'expo-location';
import { LocationObject, LocationAccuracy } from 'expo-location';
import { Platform } from 'react-native';

export interface MapLocation {
  latitude: number;
  longitude: number;
  latitudeDelta?: number;
  longitudeDelta?: number;
  address?: string;
}

export class MapService {
  // Request location permissions
  static async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return false;
    }
  }

  // Get current location (works on web and native)
  static async getCurrentLocation(): Promise<MapLocation | null> {
    try {
      if (Platform.OS === 'web') {
        // Use browser geolocation API for web
        return new Promise((resolve) => {
          if (!navigator.geolocation) {
            console.warn('Geolocation is not supported by this browser');
            resolve(null);
            return;
          }

          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const location: MapLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              };
              
              // Try to get address
              const address = await this.reverseGeocode(
                location.latitude,
                location.longitude
              );
              if (address) {
                location.address = address;
              }
              
              resolve(location);
            },
            (error) => {
              console.warn('Error getting browser location:', error);
              resolve(null);
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0,
            }
          );
        });
      } else {
        // Use Expo Location for native platforms
        const hasPermission = await this.requestPermissions();
        if (!hasPermission) {
          throw new Error('Location permission not granted');
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: LocationAccuracy.High,
        });

        const mapLocation: MapLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };

        // Try to get address
        const address = await this.reverseGeocode(
          mapLocation.latitude,
          mapLocation.longitude
        );
        if (address) {
          mapLocation.address = address;
        }

        return mapLocation;
      }
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  }

  // Watch location (for live tracking)
  static async watchLocation(
    callback: (location: MapLocation) => void
  ): Promise<Location.LocationSubscription | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Location permission not granted');
      }

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: LocationAccuracy.High,
          timeInterval: 5000, // Update every 5 seconds
          distanceInterval: 10, // Update every 10 meters
        },
        (location) => {
          callback({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      );

      return subscription;
    } catch (error) {
      console.error('Error watching location:', error);
      return null;
    }
  }

  // Geocode address to coordinates
  static async geocodeAddress(address: string): Promise<MapLocation | null> {
    try {
      const results = await Location.geocodeAsync(address);
      if (results.length > 0) {
        const result = results[0];
        return {
          latitude: result.latitude,
          longitude: result.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
      }
      return null;
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  }

  // Reverse geocode coordinates to address
  static async reverseGeocode(latitude: number, longitude: number): Promise<string | null> {
    try {
      const results = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (results.length > 0) {
        const result = results[0];
        const addressParts = [
          result.street,
          result.city,
          result.region,
          result.country,
        ].filter(Boolean);
        return addressParts.join(', ');
      }
      return null;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return null;
    }
  }

  // Calculate distance between two points (in kilometers)
  static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Radius of the Earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  }

  private static deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  // Calculate trip cost based on distance
  static calculateTripCost(distanceKm: number, baseFare: number = 2.50, perKmRate: number = 1.25): number {
    // Base fare + (distance in km * rate per km)
    const cost = baseFare + (distanceKm * perKmRate);
    // Round to 2 decimal places
    return Math.round(cost * 100) / 100;
  }

  // Calculate estimated trip time (in minutes) based on distance
  static calculateTripTime(distanceKm: number, averageSpeedKmh: number = 50): number {
    // Time = Distance / Speed (in hours), convert to minutes
    const timeHours = distanceKm / averageSpeedKmh;
    const timeMinutes = timeHours * 60;
    // Round to nearest minute
    return Math.round(timeMinutes);
  }

  // Get distance in miles (for US display)
  static kmToMiles(km: number): number {
    return Math.round((km * 0.621371) * 10) / 10; // Round to 1 decimal
  }

  // Get distance in kilometers
  static milesToKm(miles: number): number {
    return Math.round((miles * 1.60934) * 10) / 10; // Round to 1 decimal
  }

  // Google Places API - Search for places
  static async searchPlaces(query: string, location?: MapLocation): Promise<PlaceResult[]> {
    const apiKey = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;
    
    if (!apiKey || apiKey === 'your-google-places-api-key') {
      console.warn('Google Places API key not configured. Using fallback geocoding.');
      // Fallback to Expo Location geocoding
      try {
        const results = await Location.geocodeAsync(query);
        return results.map((result, index) => ({
          placeId: `geocode-${index}`,
          description: query,
          mainText: query,
          secondaryText: '',
          latitude: result.latitude,
          longitude: result.longitude,
        }));
      } catch (error) {
        console.error('Error in fallback geocoding:', error);
        return [];
      }
    }

    try {
      // Build request URL
      let url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${apiKey}`;
      
      // Add location bias if available
      if (location) {
        url += `&location=${location.latitude},${location.longitude}&radius=50000`;
      }
      
      // Add types filter for better results
      url += '&types=geocode|establishment';
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.predictions) {
        // Get place details for each prediction to get coordinates
        const places: PlaceResult[] = [];
        
        for (const prediction of data.predictions.slice(0, 5)) { // Limit to 5 results
          try {
            const details = await this.getPlaceDetails(prediction.place_id, apiKey);
            if (details) {
              places.push({
                placeId: prediction.place_id,
                description: prediction.description,
                mainText: prediction.structured_formatting?.main_text || prediction.description,
                secondaryText: prediction.structured_formatting?.secondary_text || '',
                latitude: details.latitude,
                longitude: details.longitude,
              });
            }
          } catch (error) {
            console.error('Error getting place details:', error);
          }
        }
        
        return places;
      } else {
        console.warn('Google Places API error:', data.status, data.error_message);
        return [];
      }
    } catch (error) {
      console.error('Error searching places:', error);
      // Fallback to Expo Location geocoding
      try {
        const results = await Location.geocodeAsync(query);
        return results.map((result, index) => ({
          placeId: `geocode-${index}`,
          description: query,
          mainText: query,
          secondaryText: '',
          latitude: result.latitude,
          longitude: result.longitude,
        }));
      } catch (geocodeError) {
        console.error('Error in fallback geocoding:', geocodeError);
        return [];
      }
    }
  }

  // Get place details (coordinates, etc.)
  private static async getPlaceDetails(placeId: string, apiKey: string): Promise<{ latitude: number; longitude: number } | null> {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry&key=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.result?.geometry?.location) {
        return {
          latitude: data.result.geometry.location.lat,
          longitude: data.result.geometry.location.lng,
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting place details:', error);
      return null;
    }
  }
}

// Google Places API result interface
export interface PlaceResult {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
  latitude: number;
  longitude: number;
}

