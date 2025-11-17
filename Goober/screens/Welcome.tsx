// /screens/Welcome.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { WelcomeScreenProps } from '../types/navigation';

export default function Welcome({ navigation }: WelcomeScreenProps) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Yellow Dripping Design at Top */}
      <View style={styles.drippingContainer}>
        <View style={styles.drip1} />
        <View style={styles.drip2} />
        <View style={styles.drip3} />
        <View style={styles.drip4} />
        <View style={styles.drip5} />
      </View>

      {/* GOOBER Logo with Yellow O */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/Icon_Goober.png')}
          style={styles.logoIcon}
          resizeMode="contain"
        />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>G</Text>
          <View style={styles.yellowO}>
            <Image
              source={require('../assets/Icon_Goober.png')}
              style={styles.yellowOIcon}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>OBER</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.loginButton]}
          onPress={() => navigation.navigate('SignIn')}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.registerButton]}
          onPress={() => navigation.navigate('EnterName')}
        >
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.googleButton]}
          onPress={() => {
            // TODO: Implement Google sign in
            console.log('Google sign in');
          }}
        >
          <View style={styles.socialButtonContent}>
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.googleButtonText}>Sign in with Google</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.appleButton]}
          onPress={() => {
            // TODO: Implement Apple sign in
            console.log('Apple sign in');
          }}
        >
          <View style={styles.socialButtonContent}>
            <Ionicons name="logo-apple" size={20} color="#fff" />
            <Text style={styles.appleButtonText}>Sign in with Apple</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Legal Disclaimer */}
      <View style={styles.legalContainer}>
        <Text style={styles.legalText}>
          By continuing you agree to Goober's{' '}
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
    backgroundColor: '#FFFDE7', // Light cream/yellow
  },
  drippingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    overflow: 'hidden',
  },
  drip1: {
    position: 'absolute',
    top: -20,
    left: 20,
    width: 60,
    height: 120,
    backgroundColor: '#FFD700',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  drip2: {
    position: 'absolute',
    top: -10,
    left: 100,
    width: 50,
    height: 100,
    backgroundColor: '#FFD700',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  drip3: {
    position: 'absolute',
    top: -30,
    right: 80,
    width: 70,
    height: 140,
    backgroundColor: '#FFD700',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },
  drip4: {
    position: 'absolute',
    top: -15,
    right: 20,
    width: 45,
    height: 110,
    backgroundColor: '#FFD700',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  drip5: {
    position: 'absolute',
    top: -25,
    left: '50%',
    width: 55,
    height: 130,
    backgroundColor: '#FFD700',
    borderTopLeftRadius: 27,
    borderTopRightRadius: 27,
    borderBottomLeftRadius: 27,
    borderBottomRightRadius: 27,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 100,
    marginBottom: 60,
  },
  logoIcon: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1A1A1A',
    letterSpacing: 2,
  },
  yellowO: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFD700',
    marginHorizontal: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  yellowOIcon: {
    width: 30,
    height: 30,
  },
  buttonsContainer: {
    paddingHorizontal: 20,
    width: '100%',
    marginBottom: 20,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 12,
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
  loginButton: {
    backgroundColor: '#FFD700',
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  registerButton: {
    backgroundColor: '#FFD700',
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  googleButton: {
    backgroundColor: '#4285F4',
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  googleIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    width: 20,
    height: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  appleButton: {
    backgroundColor: '#000',
  },
  appleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  socialButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  legalContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  legalText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
  legalLink: {
    color: '#FFA500',
    fontWeight: '600',
  },
});
