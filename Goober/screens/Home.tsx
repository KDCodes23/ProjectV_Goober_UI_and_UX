// /screens/Home.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreenProps } from '../types/navigation';

export default function Home({ navigation }: HomeScreenProps) {
  const userName = 'Naomi'; // Placeholder - will be replaced with actual user data

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.greetingSection}>
            <Text style={styles.greeting}>Hi, {userName}</Text>
            <Text style={styles.prompt}>What would you like to do today?</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <View style={styles.bellContainer}>
              <Ionicons name="notifications-outline" size={24} color="#333" />
              <View style={styles.notificationBadge} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Main Content Area */}
        <View style={styles.mainContent}>
          <View style={styles.iconContainer}>
            <View style={styles.arrowsContainer}>
              <Ionicons name="arrow-up" size={24} color="#2D7A7A" style={{ marginBottom: 4 }} />
              <Ionicons name="arrow-down" size={24} color="#2D7A7A" />
            </View>
          </View>
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <TouchableOpacity style={styles.findRideButton}>
            <Text style={styles.findRideText}>Find a Ride</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.switchProfileButton}>
            <Text style={styles.switchProfileText}>
              Want to offer a ride? <Text style={styles.switchProfileLink}>Switch to Profile</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <View style={styles.navItem}>
          <Ionicons name="home" size={24} color="#2D7A7A" />
          <Text style={styles.navLabel}>Home</Text>
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
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 40,
  },
  greetingSection: {
    flex: 1,
  },
  greeting: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D7A7A', // Dark teal/green
    marginBottom: 8,
  },
  prompt: {
    fontSize: 16,
    color: '#666',
    fontWeight: '400',
  },
  notificationButton: {
    padding: 8,
  },
  bellContainer: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF0000',
    borderWidth: 2,
    borderColor: '#fff',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 20,
  },
  iconContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSection: {
    paddingBottom: 20,
  },
  findRideButton: {
    backgroundColor: '#FFD700', // Bright yellow
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  findRideText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  switchProfileButton: {
    alignItems: 'center',
  },
  switchProfileText: {
    fontSize: 14,
    color: '#666',
  },
  switchProfileLink: {
    color: '#FFA500', // Light orange/yellow
    fontWeight: '600',
  },
  bottomNav: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  navItem: {
    alignItems: 'center',
  },
  navLabel: {
    fontSize: 12,
    color: '#2D7A7A',
    fontWeight: '500',
    marginTop: 4,
  },
});

