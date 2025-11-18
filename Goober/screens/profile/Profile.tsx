// /screens/Profile.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ProfileScreenProps } from '../../types/navigation';
import { useUser } from '../../contexts/UserContext';

export default function Profile({ navigation }: ProfileScreenProps) {
  const { user } = useUser();
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
          <Text style={styles.headerTitle}>PROFILE</Text>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <Ionicons name="person" size={48} color="#999" />
            </View>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark" size={16} color="#fff" />
            </View>
          </View>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <View style={styles.statsRow}>
            <View style={[styles.statItem, { marginRight: 40 }]}>
              <View style={styles.statRow}>
                <Ionicons name="star" size={20} color="#FFD700" style={{ marginRight: 4 }} />
                <Text style={styles.statValue}>{user?.rating || 0}</Text>
              </View>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user?.trips || 0}</Text>
              <Text style={styles.statLabel}>Trips</Text>
            </View>
          </View>
        </View>

        {/* Profile Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Profile Details</Text>
          <View style={styles.detailItem}>
            <Ionicons name="checkmark-circle" size={20} color="#FF8800" style={{ marginRight: 8 }} />
            <Text style={styles.detailText}>Verified passenger</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="checkmark-circle" size={20} color="#FF8800" style={{ marginRight: 8 }} />
            <Text style={styles.detailText}>Verified phone number</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="checkmark-circle" size={20} color="#FF8800" style={{ marginRight: 8 }} />
            <Text style={styles.detailText}>Verified Identity</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="checkmark-circle" size={20} color="#FF8800" style={{ marginRight: 8 }} />
            <Text style={styles.detailText}>Member since 2022</Text>
          </View>
        </View>

        {/* Ratings & Reviews Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Ratings & Reviews</Text>
            <TouchableOpacity
              onPress={() => {
                // TODO: Navigate to all reviews screen
                console.log('See all reviews');
              }}
            >
              <Text style={styles.seeAllLink}>See all</Text>
            </TouchableOpacity>
          </View>
          {[1, 2].map((item) => (
            <View key={item} style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4].map((star) => (
                  <Ionicons key={star} name="star" size={16} color="#FF8800" style={{ marginRight: 4 }} />
                ))}
                <Ionicons name="star-outline" size={16} color="#FF8800" />
              </View>
                <Text style={styles.reviewDate}>17/08/2025</Text>
              </View>
              <Text style={styles.reviewText}>
                Very nice and cool passenger, considerate of everyone. Always punctual.
              </Text>
            </View>
          ))}
        </View>

        {/* Report Button */}
        <TouchableOpacity 
          style={styles.reportButton}
          onPress={() => {
            // TODO: Navigate to report issue screen or show modal
            console.log('Report issue');
          }}
        >
          <Text style={styles.reportButtonText}>Report an issue</Text>
        </TouchableOpacity>
      </ScrollView>
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
    marginBottom: 30,
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
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF8800',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
  },
  statItem: {
    alignItems: 'center',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    color: '#1A1A1A',
    marginBottom: 16,
  },
  seeAllLink: {
    fontSize: 14,
    color: '#FF8800',
    fontWeight: '600',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#1A1A1A',
  },
  reviewItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  starsRow: {
    flexDirection: 'row',
  },
  reviewDate: {
    fontSize: 12,
    color: '#666',
  },
  reviewText: {
    fontSize: 14,
    color: '#1A1A1A',
    lineHeight: 20,
  },
  reportButton: {
    backgroundColor: '#E5E5E5',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  reportButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
  },
});

