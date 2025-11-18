// /screens/EmailVerification.tsx

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { EmailVerificationScreenProps } from '../../../types/navigation';
import { useRegistration } from '../../../contexts/RegistrationContext';
import { useUser } from '../../../contexts/UserContext';

export default function EmailVerification({ navigation }: EmailVerificationScreenProps) {
  const { registrationData, updateRegistrationData } = useRegistration();
  const { sendVerificationCode, verifyCode, user } = useUser();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [sentCode, setSentCode] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Send verification code when screen loads
  useEffect(() => {
    sendCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const sendCode = async () => {
    if (!registrationData.email) {
      Alert.alert('Error', 'No email address found');
      return;
    }

    setSending(true);
    try {
      // Use registration email if user is not logged in yet
      const email = registrationData.email;
      const userId = user?.id || null;
      
      // Import SupabaseService directly for registration flow
      const { SupabaseService } = await import('../../../services/supabaseService');
      const result = await SupabaseService.sendEmailVerificationCode(userId, email);
      
      if (result.success && result.code) {
        setSentCode(result.code);
        setTimeLeft(600); // Reset timer
        // Show code in alert for development (remove in production)
        Alert.alert(
          'Verification Code Sent',
          `Your verification code is: ${result.code}\n\n(For development - check console for details)`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', result.error || 'Failed to send verification code');
      }
    } catch (error: any) {
      console.error('Error sending verification code:', error);
      Alert.alert('Error', 'Failed to send verification code. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}s`;
  };

  const handleCodeChange = (text: string, index: number) => {
    if (text.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const isCodeComplete = code.every((digit) => digit !== '');

  const handleVerify = async () => {
    const codeString = code.join('');
    
    // For development: allow using the sent code
    if (sentCode && codeString === sentCode) {
      updateRegistrationData({ emailVerified: true });
      navigation.navigate('CreatePassword');
      return;
    }

    // Try verification through service
    try {
      const result = await verifyCode(codeString, 'email');
      if (result.success) {
        updateRegistrationData({ emailVerified: true });
        navigation.navigate('CreatePassword');
      } else {
        Alert.alert('Error', result.error || 'Invalid verification code');
      }
    } catch (error: any) {
      // Fallback: if verification service fails but code matches, accept it
      if (sentCode && codeString === sentCode) {
        updateRegistrationData({ emailVerified: true });
        navigation.navigate('CreatePassword');
      } else {
        Alert.alert('Error', 'Invalid verification code');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Yellow Dripping Design */}
        <View style={styles.drippingContainer}>
          <View style={styles.drip1} />
          <View style={styles.drip2} />
          <View style={styles.drip3} />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>We sent you an Email</Text>
          <Text style={styles.subtitle}>
            Please enter the code we just sent to{'\n'}
            <Text style={styles.emailText}>{registrationData.email || 'your email'}</Text>
          </Text>

          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={styles.codeInput}
                value={digit}
                onChangeText={(text) => handleCodeChange(text, index)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>

          <View style={styles.resendContainer}>
            {timeLeft > 0 ? (
              <Text style={styles.resendText}>
                Resend code in <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
              </Text>
            ) : (
              <TouchableOpacity
                onPress={sendCode}
                disabled={sending}
                style={styles.resendButton}
              >
                <Text style={styles.resendButtonText}>
                  {sending ? 'Sending...' : 'Resend code'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Show code for development */}
          {sentCode && __DEV__ && (
            <View style={styles.devCodeContainer}>
              <Text style={styles.devCodeLabel}>Development Mode - Code:</Text>
              <Text style={styles.devCode}>{sentCode}</Text>
            </View>
          )}
        </View>

        {/* Bottom Button */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[styles.verifyButton, isCodeComplete && styles.verifyButtonActive]}
            onPress={handleVerify}
            disabled={!isCodeComplete}
          >
            <Text style={styles.verifyButtonText}>Verify code</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDE7',
  },
  keyboardView: {
    flex: 1,
  },
  drippingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 150,
    overflow: 'hidden',
  },
  drip1: {
    position: 'absolute',
    top: -20,
    left: 20,
    width: 60,
    height: 100,
    backgroundColor: '#FFD700',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  drip2: {
    position: 'absolute',
    top: -10,
    right: 80,
    width: 50,
    height: 90,
    backgroundColor: '#FFD700',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  drip3: {
    position: 'absolute',
    top: -30,
    right: 20,
    width: 70,
    height: 120,
    backgroundColor: '#FFD700',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    zIndex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  emailText: {
    fontWeight: '600',
    color: '#1A1A1A',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  codeInput: {
    width: 50,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resendContainer: {
    marginTop: 20,
  },
  resendText: {
    fontSize: 14,
    color: '#666',
  },
  timerText: {
    color: '#FF6B35',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  resendButton: {
    paddingVertical: 8,
  },
  resendButtonText: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  devCodeContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFC107',
  },
  devCodeLabel: {
    fontSize: 12,
    color: '#856404',
    marginBottom: 8,
    fontWeight: '600',
  },
  devCode: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#856404',
    letterSpacing: 4,
    textAlign: 'center',
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  verifyButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    opacity: 0.5,
  },
  verifyButtonActive: {
    opacity: 1,
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
});

