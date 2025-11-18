// /screens/Payment.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PaymentScreenProps } from '../../types/navigation';
import { useRide } from '../../contexts/RideContext';

export default function Payment({ navigation, route }: PaymentScreenProps) {
  const { booking, updateBooking } = useRide();
  const [gooberCashEnabled, setGooberCashEnabled] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(booking.paymentMethod || null);
  const [gooberBalance, setGooberBalance] = useState(25);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [showVoucher, setShowVoucher] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [fundsAmount, setFundsAmount] = useState('');
  const [voucherCode, setVoucherCode] = useState('');
  
  const handleCheckout = () => {
    if (!selectedPaymentMethod) {
      Alert.alert('Payment Required', 'Please select a payment method to continue.');
      return;
    }
    
    // Save payment method to booking
    updateBooking({ paymentMethod: selectedPaymentMethod });
    
    // Navigate to LookingForRides to complete checkout
    navigation.navigate('LookingForRides');
  };

  const handleAddPaymentMethod = () => {
    if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
      Alert.alert('Error', 'Please fill in all card details');
      return;
    }
    // In a real app, this would save to backend
    Alert.alert('Success', 'Payment method added successfully!');
    setShowAddPayment(false);
    setCardNumber('');
    setCardName('');
    setCardExpiry('');
    setCardCvv('');
  };

  const handleAddFunds = () => {
    const amount = parseFloat(fundsAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    setGooberBalance(prev => prev + amount);
    Alert.alert('Success', `$${amount.toFixed(2)} added to your Goober balance!`);
    setShowAddFunds(false);
    setFundsAmount('');
  };

  const handleApplyVoucher = () => {
    if (!voucherCode) {
      Alert.alert('Error', 'Please enter a voucher code');
      return;
    }
    // In a real app, this would validate with backend
    Alert.alert('Success', 'Voucher code applied! 10% discount applied.');
    setShowVoucher(false);
    setVoucherCode('');
  };

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

        {/* Goober Balance Section */}
        <View style={styles.hitchBalanceCard}>
          <View style={styles.balanceInfo}>
            <Text style={styles.balanceAmount}>${gooberBalance.toFixed(2)}</Text>
            <Text style={styles.balanceLabel}>Goober Balance</Text>
          </View>
          <TouchableOpacity 
            style={styles.addFundsButton}
            onPress={() => setShowAddFunds(true)}
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
            onPress={() => setShowAddPayment(true)}
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
            onPress={() => setShowVoucher(true)}
          >
            <Ionicons name="add" size={20} color="#666" style={{ marginRight: 8 }} />
            <Text style={styles.addButtonText}>Voucher code</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {/* Checkout Button */}
      <View style={styles.checkoutContainer}>
        <TouchableOpacity
          style={[styles.checkoutButton, !selectedPaymentMethod && styles.checkoutButtonDisabled]}
          onPress={handleCheckout}
          disabled={!selectedPaymentMethod}
        >
          <Text style={styles.checkoutButtonText}>
            {selectedPaymentMethod ? 'Complete Checkout' : 'Select Payment Method'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Add Payment Method Modal */}
      <Modal visible={showAddPayment} transparent animationType="slide" onRequestClose={() => setShowAddPayment(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowAddPayment(false)}>
                <Text style={styles.modalCancel}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Add Payment Method</Text>
              <TouchableOpacity onPress={handleAddPaymentMethod}>
                <Text style={styles.modalDone}>Add</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll}>
              <Text style={styles.inputLabel}>Card Number</Text>
              <TextInput
                style={styles.input}
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChangeText={setCardNumber}
                keyboardType="numeric"
                maxLength={19}
              />
              <Text style={styles.inputLabel}>Cardholder Name</Text>
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                value={cardName}
                onChangeText={setCardName}
              />
              <View style={styles.rowInputs}>
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>Expiry</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChangeText={setCardExpiry}
                    maxLength={5}
                  />
                </View>
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>CVV</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="123"
                    value={cardCvv}
                    onChangeText={setCardCvv}
                    keyboardType="numeric"
                    maxLength={3}
                    secureTextEntry
                  />
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Add Funds Modal */}
      <Modal visible={showAddFunds} transparent animationType="slide" onRequestClose={() => setShowAddFunds(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowAddFunds(false)}>
                <Text style={styles.modalCancel}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Add Funds</Text>
              <TouchableOpacity onPress={handleAddFunds}>
                <Text style={styles.modalDone}>Add</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalScroll}>
              <Text style={styles.inputLabel}>Amount</Text>
              <View style={styles.amountInputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0.00"
                  value={fundsAmount}
                  onChangeText={setFundsAmount}
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={styles.quickAmounts}>
                <TouchableOpacity style={styles.quickAmountButton} onPress={() => setFundsAmount('10')}>
                  <Text style={styles.quickAmountText}>$10</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickAmountButton} onPress={() => setFundsAmount('25')}>
                  <Text style={styles.quickAmountText}>$25</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickAmountButton} onPress={() => setFundsAmount('50')}>
                  <Text style={styles.quickAmountText}>$50</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickAmountButton} onPress={() => setFundsAmount('100')}>
                  <Text style={styles.quickAmountText}>$100</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Voucher Code Modal */}
      <Modal visible={showVoucher} transparent animationType="slide" onRequestClose={() => setShowVoucher(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowVoucher(false)}>
                <Text style={styles.modalCancel}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Voucher Code</Text>
              <TouchableOpacity onPress={handleApplyVoucher}>
                <Text style={styles.modalDone}>Apply</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalScroll}>
              <Text style={styles.inputLabel}>Enter Voucher Code</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter code"
                value={voucherCode}
                onChangeText={setVoucherCode}
                autoCapitalize="characters"
              />
              <Text style={styles.voucherHint}>Enter your discount or promotional code</Text>
            </View>
          </View>
        </View>
      </Modal>
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
  checkoutContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  checkoutButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  checkoutButtonDisabled: {
    backgroundColor: '#E5E5E5',
    opacity: 0.6,
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalCancel: {
    fontSize: 16,
    color: '#666',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  modalDone: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: '600',
  },
  modalScroll: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1A1A1A',
    marginBottom: 16,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    padding: 12,
    fontSize: 20,
    color: '#1A1A1A',
    fontWeight: '600',
  },
  quickAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  quickAmountButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  quickAmountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  voucherHint: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    fontStyle: 'italic',
  },
});

