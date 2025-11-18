// /screens/TwoFactorAuth.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';

export default function TwoFactorAuth() {
  const navigation = useNavigation();
  const { user, verifyCode, sendVerificationCode, setup2FA } = useUser();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // Send code on mount
    sendCode();
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const sendCode = async () => {
    setLoading(true);
    const result = await sendVerificationCode('2fa');
    setLoading(false);
    
    if (result.success) {
      setCountdown(60); // 60 second countdown
      Alert.alert('Code Sent', `Verification code sent${result.code ? `: ${result.code}` : ''}`);
    } else {
      Alert.alert('Error', result.error || 'Failed to send verification code');
    }
  };

  const handleVerify = async () => {
    if (code.length !== 6) {
      Alert.alert('Error', 'Please enter a 6-digit code');
      return;
    }

    setLoading(true);
    const result = await verifyCode(code, '2fa');
    setLoading(false);

    if (result.success) {
      Alert.alert('Success', '2FA verified successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert('Error', result.error || 'Invalid verification code');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Two-Factor Authentication</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.body}>
            <View style={styles.iconContainer}>
              <Ionicons name="shield-checkmark" size={64} color="#2D7A7A" />
            </View>

            <Text style={styles.title}>Enter Verification Code</Text>
            <Text style={styles.subtitle}>
              We've sent a 6-digit verification code to your registered phone number
            </Text>

            <View style={styles.codeContainer}>
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <View
                  key={index}
                  style={[
                    styles.codeInput,
                    code[index] && styles.codeInputFilled,
                    index === code.length && styles.codeInputActive,
                  ]}
                >
                  <Text style={styles.codeText}>{code[index] || ''}</Text>
                </View>
              ))}
            </View>

            <TextInput
              style={styles.hiddenInput}
              value={code}
              onChangeText={(text) => {
                const numericText = text.replace(/[^0-9]/g, '').slice(0, 6);
                setCode(numericText);
              }}
              keyboardType="number-pad"
              maxLength={6}
              autoFocus
            />

            <TouchableOpacity
              style={[styles.verifyButton, (!code || code.length !== 6 || loading) && styles.verifyButtonDisabled]}
              onPress={handleVerify}
              disabled={!code || code.length !== 6 || loading}
            >
              <Text style={styles.verifyButtonText}>
                {loading ? 'Verifying...' : 'Verify'}
              </Text>
            </TouchableOpacity>

            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn't receive the code? </Text>
              <TouchableOpacity
                onPress={sendCode}
                disabled={countdown > 0 || loading}
              >
                <Text style={[styles.resendLink, (countdown > 0 || loading) && styles.resendLinkDisabled]}>
                  {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  body: {
    flex: 1,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    width: '100%',
    paddingHorizontal: 20,
  },
  codeInput: {
    width: 50,
    height: 60,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeInputFilled: {
    borderColor: '#2D7A7A',
    backgroundColor: '#fff',
  },
  codeInputActive: {
    borderColor: '#2D7A7A',
    borderWidth: 3,
  },
  codeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 0,
    height: 0,
  },
  verifyButton: {
    backgroundColor: '#2D7A7A',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  verifyButtonDisabled: {
    opacity: 0.5,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    color: '#666',
  },
  resendLink: {
    fontSize: 14,
    color: '#2D7A7A',
    fontWeight: '600',
  },
  resendLinkDisabled: {
    opacity: 0.5,
  },
});

