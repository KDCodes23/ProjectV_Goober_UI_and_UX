// /config/supabase.ts

import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

// TODO: Replace with your actual Supabase URL and anon key
// Get these from your Supabase project settings: https://app.supabase.com/project/_/settings/api
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Check if Supabase is configured
export const isSupabaseConfigured = SUPABASE_URL !== 'https://placeholder.supabase.co' && SUPABASE_ANON_KEY !== 'placeholder-key';

// Custom storage adapter - uses SecureStore on native, localStorage on web
const createStorageAdapter = () => {
  if (Platform.OS === 'web') {
    // Use localStorage for web
    return {
      getItem: async (key: string) => {
        try {
          return localStorage.getItem(key);
        } catch (error) {
          console.warn('localStorage getItem error:', error);
          return null;
        }
      },
      setItem: async (key: string, value: string) => {
        try {
          localStorage.setItem(key, value);
        } catch (error) {
          console.warn('localStorage setItem error:', error);
        }
      },
      removeItem: async (key: string) => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.warn('localStorage removeItem error:', error);
        }
      },
    };
  } else {
    // Use SecureStore for native platforms
    const SecureStore = require('expo-secure-store');
    return {
      getItem: async (key: string) => {
        try {
          return await SecureStore.getItemAsync(key);
        } catch (error) {
          console.warn('SecureStore getItem error:', error);
          return null;
        }
      },
      setItem: async (key: string, value: string) => {
        try {
          await SecureStore.setItemAsync(key, value);
        } catch (error) {
          console.warn('SecureStore setItem error:', error);
        }
      },
      removeItem: async (key: string) => {
        try {
          await SecureStore.deleteItemAsync(key);
        } catch (error) {
          console.warn('SecureStore removeItem error:', error);
        }
      },
    };
  }
};

const ExpoSecureStoreAdapter = createStorageAdapter();

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

