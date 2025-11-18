// /screens/CreatePassword.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CreatePasswordScreenProps } from '../../../types/navigation';
import { useRegistration } from '../../../contexts/RegistrationContext';
import { useUser } from '../../../contexts/UserContext';

export default function CreatePassword({ navigation }: CreatePasswordScreenProps) {
  const { registrationData, resetRegistrationData } = useRegistration();
  const { register } = useUser();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const has8Chars = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const isPasswordValid = has8Chars && hasUppercase && hasNumber && password === confirmPassword;

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
          <Text style={styles.title}>Create your Password</Text>
          <Text style={styles.subtitle}>Choose a password</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#999"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          {/* Password Requirements */}
          <View style={styles.requirementsContainer}>
            <View style={[styles.requirement, has8Chars && styles.requirementMet]}>
              <Text style={[styles.requirementText, has8Chars && styles.requirementTextMet]}>
                8 characters
              </Text>
            </View>
            <View style={[styles.requirement, hasUppercase && styles.requirementMet]}>
              <Text style={[styles.requirementText, hasUppercase && styles.requirementTextMet]}>
                1 Uppercase
              </Text>
            </View>
            <View style={[styles.requirement, hasNumber && styles.requirementMet]}>
              <Text style={[styles.requirementText, hasNumber && styles.requirementTextMet]}>
                1 number
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom Button */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[styles.createButton, isPasswordValid && styles.createButtonActive]}
            onPress={async () => {
              if (!isPasswordValid) return;
              
              setLoading(true);
              const result = await register(
                registrationData.email,
                password,
                registrationData.name,
                registrationData.phone
              );
              setLoading(false);

              if (result.success) {
                resetRegistrationData();
                navigation.replace('Home');
              } else {
                Alert.alert('Error', result.error || 'Registration failed');
              }
            }}
            disabled={!isPasswordValid || loading}
          >
            <Text style={styles.createButtonText}>
              {loading ? 'Creating Account...' : 'Create Password'}
            </Text>
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    paddingRight: 50,
    fontSize: 16,
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
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    padding: 4,
  },
  requirementsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  requirement: {
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  requirementMet: {
    backgroundColor: '#FFD700',
  },
  requirementText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  requirementTextMet: {
    color: '#1A1A1A',
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  createButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    opacity: 0.5,
  },
  createButtonActive: {
    opacity: 1,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
});

