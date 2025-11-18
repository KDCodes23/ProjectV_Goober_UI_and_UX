// /screens/LookingForRides.tsx

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LookingForRidesScreenProps } from '../types/navigation';

export default function LookingForRides({ navigation }: LookingForRidesScreenProps) {
  useEffect(() => {
    // Simulate loading and navigate to available rides after 2 seconds
    const timer = setTimeout(() => {
      navigation.replace('AvailableRides');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <View style={styles.routeInfo}>
          <View style={styles.routeFrom}>
            <Text style={styles.routeText}>Cold Stone ...,</Text>
            <Text style={styles.routeLocation}>Yaba</Text>
          </View>
          <Ionicons name="arrow-forward" size={20} color="#FF8800" style={[styles.arrow, { marginHorizontal: 12 }]} />
          <View style={styles.routeTo}>
            <Text style={styles.routeText}>Lekki Phase 1,</Text>
            <Text style={styles.routeLocation}>Lekki</Text>
          </View>
        </View>

        <View style={styles.loadingContainer}>
          <View style={styles.dotsContainer}>
            <View style={[styles.dot, styles.dotActive, { marginRight: 12 }]} />
            <View style={[styles.dot, { marginRight: 12 }]} />
            <View style={styles.dot} />
          </View>
          <Text style={styles.loadingText}>
            Looking for{'\n'}rides near{'\n'}you
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  routeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  routeFrom: {
    flex: 1,
  },
  routeTo: {
    flex: 1,
  },
  routeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF8800',
  },
  routeLocation: {
    fontSize: 14,
    color: '#666',
  },
  arrow: {
    marginHorizontal: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFD700',
    opacity: 0.3,
  },
  dotActive: {
    opacity: 1,
  },
  loadingText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#1A1A1A',
    textAlign: 'center',
    lineHeight: 32,
  },
});

