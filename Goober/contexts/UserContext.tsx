// /contexts/UserContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SupabaseService, Profile } from '../services/supabaseService';
import { supabase } from '../config/supabase';

interface User extends Profile {
  // Extended interface for compatibility
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; requires2FA?: boolean }>;
  register: (email: string, password: string, name: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<boolean>;
  refreshUser: () => Promise<void>;
  sendVerificationCode: (type: 'phone' | 'email' | '2fa') => Promise<{ success: boolean; code?: string; error?: string }>;
  verifyCode: (code: string, type: 'phone' | 'email' | '2fa') => Promise<{ success: boolean; error?: string }>;
  setup2FA: (method: 'sms' | 'email' | 'totp', phoneNumber?: string) => Promise<{ success: boolean; error?: string }>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        await loadUserProfile(session.user.id);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkSession = async () => {
    try {
      const session = await SupabaseService.getSession();
      if (session?.user) {
        await loadUserProfile(session.user.id);
      }
    } catch (error) {
      console.error('Error checking session:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async (userId: string) => {
    try {
      const profile = await SupabaseService.getProfile(userId);
      if (profile) {
        setUser(profile as User);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await SupabaseService.signIn(email, password);
      
      if (error) {
        return { success: false, error: error.message };
      }

      if (data?.user) {
        await loadUserProfile(data.user.id);
        
        // Check if 2FA is required
        // TODO: Implement 2FA check logic
        return { success: true, requires2FA: false };
      }

      return { success: false, error: 'Login failed' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const register = async (email: string, password: string, name: string, phone?: string) => {
    try {
      const { data, error } = await SupabaseService.signUp(email, password, name);
      
      if (error) {
        return { success: false, error: error.message };
      }

      if (data?.user) {
        // Update profile with phone if provided
        if (phone) {
          await SupabaseService.updateProfile(data.user.id, { phone });
        }
        
        await loadUserProfile(data.user.id);
        return { success: true };
      }

      return { success: false, error: 'Registration failed' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      await SupabaseService.signOut();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return false;
    
    try {
      const { error } = await SupabaseService.updateProfile(user.id, userData);
      if (!error) {
        await refreshUser();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  };

  const refreshUser = async () => {
    if (!user) return;
    await loadUserProfile(user.id);
  };

  const sendVerificationCode = async (type: 'phone' | 'email' | '2fa') => {
    if (!user) {
      return { success: false, error: 'User not logged in' };
    }

    try {
      if (type === 'phone' && user.phone) {
        const result = await SupabaseService.sendPhoneVerificationCode(user.id, user.phone);
        return result;
      } else if (type === 'email' && user.email) {
        const result = await SupabaseService.sendEmailVerificationCode(user.id, user.email);
        return result;
      } else if (type === '2fa') {
        const code = await SupabaseService.generateVerificationCode(user.id, '2fa');
        return { success: !!code, code };
      }
      
      return { success: false, error: 'Invalid verification type' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const verifyCode = async (code: string, type: 'phone' | 'email' | '2fa') => {
    if (!user) {
      return { success: false, error: 'User not logged in' };
    }

    try {
      if (type === '2fa') {
        const result = await SupabaseService.verify2FA(user.id, code, 'sms');
        return result;
      } else {
        const result = await SupabaseService.verifyCode(user.id, code, type);
        return result;
      }
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const setup2FA = async (method: 'sms' | 'email' | 'totp', phoneNumber?: string) => {
    if (!user) {
      return { success: false, error: 'User not logged in' };
    }

    try {
      const { error } = await SupabaseService.setup2FA(user.id, method, phoneNumber);
      if (!error) {
        // Send verification code
        if (method === 'sms' && phoneNumber) {
          return await sendVerificationCode('2fa');
        }
        return { success: true };
      }
      return { success: false, error: error.message };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        updateUser,
        refreshUser,
        sendVerificationCode,
        verifyCode,
        setup2FA,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

