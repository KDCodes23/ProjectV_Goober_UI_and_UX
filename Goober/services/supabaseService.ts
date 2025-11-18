// /services/supabaseService.ts

import { supabase } from '../config/supabase';
import { Session, User } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  email: string;
  phone?: string;
  name: string;
  role: 'passenger' | 'driver' | 'admin';
  rating: number;
  total_trips: number;
  verified: boolean;
  phone_verified: boolean;
  identity_verified: boolean;
  verification_status: 'pending' | 'verified' | 'rejected';
  member_since: string;
  avatar_url?: string;
  bio?: string;
}

export interface TwoFactorAuth {
  id: string;
  user_id: string;
  method: 'sms' | 'email' | 'totp';
  verified: boolean;
}

export class SupabaseService {
  // Authentication
  static async signUp(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });
    return { data, error };
  }

  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  static async getSession(): Promise<Session | null> {
    const { data } = await supabase.auth.getSession();
    return data.session;
  }

  static async getUser(): Promise<User | null> {
    const { data } = await supabase.auth.getUser();
    return data.user;
  }

  // Profile Management
  static async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data;
  }

  static async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    return { data, error };
  }

  // Two-Factor Authentication
  static async setup2FA(userId: string, method: 'sms' | 'email' | 'totp', phoneNumber?: string) {
    const { data, error } = await supabase
      .from('two_factor_auth')
      .upsert({
        user_id: userId,
        method,
        phone_number: phoneNumber,
        verified: false,
      })
      .select()
      .single();

    return { data, error };
  }

  static async verify2FA(userId: string, code: string, method: 'sms' | 'email' | 'totp') {
    // First, check if the code is valid
    const { data: codeData, error: codeError } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('user_id', userId)
      .eq('code', code)
      .eq('type', '2fa')
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (codeError || !codeData) {
      return { verified: false, error: 'Invalid or expired code' };
    }

    // Mark code as used
    await supabase
      .from('verification_codes')
      .update({ used: true })
      .eq('id', codeData.id);

    // Update 2FA as verified
    const { data, error } = await supabase
      .from('two_factor_auth')
      .update({ verified: true })
      .eq('user_id', userId)
      .eq('method', method)
      .select()
      .single();

    return { verified: !error, data, error };
  }

  // Verification Codes
  static async generateVerificationCode(
    userId: string,
    type: 'phone' | 'email' | '2fa'
  ): Promise<string | null> {
    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiration to 10 minutes from now
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    const { data, error } = await supabase
      .from('verification_codes')
      .insert({
        user_id: userId,
        code,
        type,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error generating verification code:', error);
      return null;
    }

    return code;
  }

  static async verifyCode(userId: string, code: string, type: 'phone' | 'email' | '2fa') {
    const { data, error } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('user_id', userId)
      .eq('code', code)
      .eq('type', type)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error || !data) {
      return { verified: false, error: 'Invalid or expired code' };
    }

    // Mark code as used
    await supabase
      .from('verification_codes')
      .update({ used: true })
      .eq('id', data.id);

    // Update profile verification status
    if (type === 'phone') {
      await supabase
        .from('profiles')
        .update({ phone_verified: true })
        .eq('id', userId);
    }

    return { verified: true, data };
  }

  // Phone Verification
  static async sendPhoneVerificationCode(userId: string, phoneNumber: string) {
    const code = await this.generateVerificationCode(userId, 'phone');
    
    if (!code) {
      return { success: false, error: 'Failed to generate code' };
    }

    // TODO: Integrate with SMS service (Twilio, AWS SNS, etc.)
    // For now, we'll just return the code (in production, send via SMS)
    console.log(`Verification code for ${phoneNumber}: ${code}`);
    
    // Update user's phone number
    await supabase
      .from('profiles')
      .update({ phone: phoneNumber })
      .eq('id', userId);

    return { success: true, code }; // Remove code in production
  }

  // Email Verification
  static async sendEmailVerificationCode(userId: string, email: string) {
    const code = await this.generateVerificationCode(userId, 'email');
    
    if (!code) {
      return { success: false, error: 'Failed to generate code' };
    }

    // TODO: Integrate with email service (SendGrid, AWS SES, etc.)
    // For now, we'll just return the code (in production, send via email)
    console.log(`Verification code for ${email}: ${code}`);
    
    return { success: true, code }; // Remove code in production
  }

  // Rides
  static async createRide(rideData: any) {
    const { data, error } = await supabase
      .from('rides')
      .insert(rideData)
      .select()
      .single();

    return { data, error };
  }

  static async getAvailableRides(filters?: any) {
    let query = supabase
      .from('rides')
      .select(`
        *,
        driver:profiles!rides_driver_id_fkey(*),
        from_location:locations!rides_from_location_id_fkey(*),
        to_location:locations!rides_to_location_id_fkey(*)
      `)
      .in('status', ['pending', 'accepted'])
      .order('created_at', { ascending: false });

    if (filters?.date) {
      query = query.eq('scheduled_date', filters.date);
    }

    if (filters?.from_location_id) {
      query = query.eq('from_location_id', filters.from_location_id);
    }

    if (filters?.to_location_id) {
      query = query.eq('to_location_id', filters.to_location_id);
    }

    const { data, error } = await query;
    return { data, error };
  }

  static async bookRide(rideId: string, passengerId: string, seats: number, totalPrice: number) {
    const { data, error } = await supabase
      .from('ride_bookings')
      .insert({
        ride_id: rideId,
        passenger_id: passengerId,
        seats,
        total_price: totalPrice,
      })
      .select()
      .single();

    return { data, error };
  }

  // Locations
  static async saveLocation(userId: string, locationData: any) {
    const { data, error } = await supabase
      .from('locations')
      .insert({
        user_id: userId,
        ...locationData,
      })
      .select()
      .single();

    return { data, error };
  }

  static async getUserLocations(userId: string) {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    return { data, error };
  }

  // User Balance
  static async getUserBalance(userId: string) {
    const { data, error } = await supabase
      .from('user_balances')
      .select('*')
      .eq('user_id', userId)
      .single();

    return { data, error };
  }

  static async addFunds(userId: string, amount: number) {
    const { data, error } = await supabase.rpc('add_user_balance', {
      user_id: userId,
      amount,
    });

    return { data, error };
  }

  // Notifications
  static async getNotifications(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    return { data, error };
  }

  static async markNotificationAsRead(notificationId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .select()
      .single();

    return { data, error };
  }
}

