// /screens/Welcome.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { WelcomeScreenProps } from '../../types/navigation';
import { useUser } from '../../contexts/UserContext';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { supabase, isSupabaseConfigured } from '../../config/supabase';

// Complete auth session for web
WebBrowser.maybeCompleteAuthSession();

export default function Welcome({ navigation }: WelcomeScreenProps) {
  console.log('🎉 Welcome screen rendering!');
  const { login } = useUser();
  const [loading, setLoading] = useState(false);

  // Check if Google OAuth is configured
  const googleClientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '';
  const isGoogleConfigured = googleClientId && googleClientId !== 'YOUR_GOOGLE_CLIENT_ID' && googleClientId.length > 0;

  // Google OAuth configuration (only if configured)
  const [request, response, promptAsync] = Google.useAuthRequest(
    isGoogleConfigured
      ? {
          expoClientId: googleClientId,
          iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || googleClientId,
          androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || googleClientId,
          webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || googleClientId,
        }
      : {
          // Dummy config to prevent errors
          expoClientId: 'demo',
          iosClientId: 'demo',
          androidClientId: 'demo',
          webClientId: 'demo',
        }
  );

  React.useEffect(() => {
    if (response?.type === 'success' && isGoogleConfigured) {
      handleGoogleAuth(response.authentication);
    } else if (response?.type === 'error' && isGoogleConfigured) {
      Alert.alert('Error', 'Google sign in failed. Please try again.');
      setLoading(false);
    }
  }, [response, isGoogleConfigured]);

  const handleGoogleAuth = async (authentication: any) => {
    try {
      setLoading(true);
      
      if (!isSupabaseConfigured) {
        // Mock login for demo mode
        Alert.alert('Success', 'Google sign in successful! (Demo mode)');
        navigation.replace('Home');
        setLoading(false);
        return;
      }

      // Exchange the access token for a Supabase session
      const redirectTo = Platform.OS === 'web' 
        ? (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:19006')
        : 'goober://auth/callback';
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
        },
      });

      if (error) throw error;

      // For now, show success and navigate (actual OAuth flow will complete in browser)
      Alert.alert('Success', 'Google sign in successful!');
      navigation.replace('Home');
    } catch (error: any) {
      console.error('Google auth error:', error);
      Alert.alert('Error', error.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      
      // Demo mode - works without OAuth configuration
      if (!isGoogleConfigured || !isSupabaseConfigured) {
        // Simulate a brief delay for better UX
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Demo mode - just navigate to home
        Alert.alert(
          'Demo Mode', 
          'Google sign in successful!\n\n(To enable real Google sign-in, configure OAuth client IDs in your .env file)',
          [{ text: 'OK', onPress: () => navigation.replace('Home') }]
        );
        setLoading(false);
        return;
      }

      // Real OAuth flow - only if configured
      if (request) {
        await promptAsync();
      } else {
        // Fallback: Use Supabase OAuth directly
        const redirectTo = Platform.OS === 'web' 
          ? (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:19006')
          : 'goober://auth/callback';
        
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo,
          },
        });

        if (error) throw error;
      }
    } catch (error: any) {
      console.error('Google sign in error:', error);
      Alert.alert('Error', error.message || 'Failed to sign in with Google. Please try again.');
      setLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.contentWrapper}>
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
          <View style={styles.titleContainer}>
            <Text style={styles.title}>G</Text>
            <Text style={styles.title}>O</Text>
            <View style={styles.yellowO}>
              <Text style={styles.yellowOText}>O</Text>
            </View>
            <Text style={styles.title}>BER</Text>
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
            style={[styles.button, styles.googleButton, loading && styles.buttonDisabled]}
            onPress={handleGoogleSignIn}
            disabled={loading}
          >
            <View style={styles.socialButtonContent}>
              <Text style={styles.googleIcon}>G</Text>
              <Text style={styles.googleButtonText}>
                {loading ? 'Signing in...' : 'Sign in with Google'}
              </Text>
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FFFDE7', // Light cream/yellow
    alignSelf: 'stretch',
  },
  contentWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: '100%',
    alignItems: 'center',
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
    width: '100%',
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
  yellowOText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  buttonsContainer: {
    paddingHorizontal: 20,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
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
  buttonDisabled: {
    opacity: 0.6,
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
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
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
