// /screens/TripGoldenRules.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { TripGoldenRulesScreenProps } from '../../types/navigation';

const rules = [
  {
    icon: 'time-outline',
    title: 'Be Punctual',
    description: 'Arrive on time at the designated pick-up location. Being late can inconvenience other passengers and disrupt the schedule.',
    color: '#2D7A7A',
  },
  {
    icon: 'brush-outline',
    title: 'Keep the Car Clean',
    description: 'Avoid leaving trash or making a mess in the car. Treat the vehicle as you would your own.',
    color: '#FFD700',
  },
  {
    icon: 'megaphone-outline',
    title: 'Be Courteous',
    description: 'Practice good etiquette during the ride. Avoid being overly loud, offensive, or intrusive.',
    color: '#4285F4',
  },
  {
    icon: 'wallet-outline',
    title: 'No Cash',
    description: 'Avoid offering or accepting cash payments for rides booked through the app.',
    color: '#2D7A7A',
  },
  {
    icon: 'checkmark-circle-outline',
    title: 'Be Reliable',
    description: 'If you need to make changes to the route or schedule, discuss it with the driver and other passengers before doing so.',
    color: '#2D7A7A',
  },
];

export default function TripGoldenRules({ navigation }: TripGoldenRulesScreenProps) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Trip Golden Rules</Text>

        {rules.map((rule, index) => (
          <View key={index} style={styles.ruleItem}>
            <View style={[styles.iconContainer, { borderColor: rule.color }]}>
              <Ionicons name={rule.icon as any} size={24} color={rule.color} />
            </View>
            <View style={styles.ruleContent}>
              <Text style={styles.ruleTitle}>{rule.title}</Text>
              <Text style={styles.ruleDescription}>{rule.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => navigation.navigate('Payment')}
        >
          <Text style={styles.acceptButtonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.declineButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.declineButtonText}>Decline</Text>
        </TouchableOpacity>
        <Text style={styles.legalText}>
          By accepting you agree to Goober's{' '}
          <Text style={styles.legalLink}>Terms of Use</Text> and{' '}
          <Text style={styles.legalLink}>Privacy Policy</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 30,
  },
  ruleItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  ruleContent: {
    flex: 1,
  },
  ruleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  ruleDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  bottomContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  acceptButton: {
    backgroundColor: '#FF8800',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  declineButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  declineButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  legalText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
  legalLink: {
    color: '#FF8800',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

