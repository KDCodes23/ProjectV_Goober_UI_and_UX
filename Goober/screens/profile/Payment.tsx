// /screens/Payment.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PaymentScreenProps } from '../../types/navigation';

export default function Payment({ navigation }: PaymentScreenProps) {
  const [gooberCashEnabled, setGooberCashEnabled] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

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
          <Text style={styles.headerTitle}>Payment</Text>
        </View>

        {/* Hitch Balance Section */}
        <View style={styles.hitchBalanceCard}>
          <View style={styles.balanceInfo}>
            <Text style={styles.balanceAmount}>$25</Text>
            <Text style={styles.balanceLabel}>Hitch Balance</Text>
          </View>
          <TouchableOpacity 
            style={styles.addFundsButton}
            onPress={() => {
              // TODO: Navigate to add funds screen
              console.log('Add funds');
            }}
          >
            <Ionicons name="add" size={20} color="#1A1A1A" style={{ marginRight: 4 }} />
            <Text style={styles.addFundsText}>Add funds</Text>
          </TouchableOpacity>
        </View>

        {/* Goober Cash Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Goober Cash</Text>
            <Switch
              value={gooberCashEnabled}
              onValueChange={setGooberCashEnabled}
              trackColor={{ false: '#E5E5E5', true: '#FFD700' }}
              thumbColor="#fff"
            />
          </View>
          <TouchableOpacity 
            style={styles.optionItem}
            onPress={() => setSelectedPaymentMethod('goober')}
          >
            <Ionicons name="wallet-outline" size={20} color="#666" style={{ marginRight: 12 }} />
            <Text style={styles.optionText}>Goober Balance</Text>
            <View style={[styles.checkbox, selectedPaymentMethod === 'goober' && styles.checkboxSelected]}>
              {selectedPaymentMethod === 'goober' && (
                <Ionicons name="checkmark" size={16} color="#fff" />
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Payment Methods Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment methods</Text>
          
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => setSelectedPaymentMethod('visa')}
          >
            <View style={styles.cardLogo}>
              <Text style={styles.visaLogo}>VISA</Text>
            </View>
            <Text style={styles.cardText}>.... 5678</Text>
            <View style={[styles.checkbox, selectedPaymentMethod === 'visa' && styles.checkboxSelected]}>
              {selectedPaymentMethod === 'visa' && (
                <Ionicons name="checkmark" size={16} color="#fff" />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => setSelectedPaymentMethod('mastercard')}
          >
            <View style={styles.mastercardLogo}>
              <View style={styles.mastercardCircle1} />
              <View style={styles.mastercardCircle2} />
            </View>
            <Text style={styles.cardText}>.... 5678</Text>
            <View style={[styles.checkbox, selectedPaymentMethod === 'mastercard' && styles.checkboxSelected]}>
              {selectedPaymentMethod === 'mastercard' && (
                <Ionicons name="checkmark" size={16} color="#fff" />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => {
              // TODO: Navigate to add payment method screen
              console.log('Add payment method');
            }}
          >
            <Ionicons name="add" size={20} color="#666" style={{ marginRight: 8 }} />
            <Text style={styles.addButtonText}>Add payment method</Text>
          </TouchableOpacity>
        </View>

        {/* Voucher Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Voucher</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => {
              // TODO: Show voucher code input modal
              console.log('Voucher code');
            }}
          >
            <Ionicons name="add" size={20} color="#666" style={{ marginRight: 8 }} />
            <Text style={styles.addButtonText}>Voucher code</Text>
          </TouchableOpacity>
        </View>
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
    marginBottom: 20,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  hitchBalanceCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  balanceInfo: {
    flex: 1,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
  },
  addFundsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  addFundsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  cardLogo: {
    width: 50,
    height: 30,
    backgroundColor: '#1A1F71',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  visaLogo: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  mastercardLogo: {
    width: 50,
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginRight: 12,
  },
  mastercardCircle1: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EB001B',
    position: 'absolute',
    left: 5,
  },
  mastercardCircle2: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F79E1B',
    position: 'absolute',
    right: 5,
  },
  cardText: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#FF8800',
    borderColor: '#FF8800',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  addButtonText: {
    fontSize: 16,
    color: '#666',
  },
});

