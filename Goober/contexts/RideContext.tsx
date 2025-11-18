// /contexts/RideContext.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Location {
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
}

export interface RideBooking {
  from: Location | null;
  to: Location | null;
  date: string | null;
  time: string | null;
  seats: number;
  isRoundTrip: boolean;
  returnTime?: string;
  pickupPoint?: Location;
  dropoffPoint?: Location;
}

export interface ActiveRide {
  id: string;
  driverId: string;
  driverName: string;
  carInfo: string;
  status: 'accepted' | 'enRoute' | 'arrived' | 'inTrip' | 'completed';
  from: Location;
  to: Location;
  date: string;
  time: string;
  verificationCode?: string;
  eta?: string;
}

interface RideContextType {
  booking: RideBooking;
  activeRide: ActiveRide | null;
  updateBooking: (updates: Partial<RideBooking>) => void;
  resetBooking: () => void;
  setActiveRide: (ride: ActiveRide | null) => void;
  updateActiveRideStatus: (status: ActiveRide['status'], updates?: Partial<ActiveRide>) => void;
}

const RideContext = createContext<RideContextType | undefined>(undefined);

const initialBooking: RideBooking = {
  from: null,
  to: null,
  date: null,
  time: null,
  seats: 1,
  isRoundTrip: false,
};

export function RideProvider({ children }: { children: ReactNode }) {
  const [booking, setBooking] = useState<RideBooking>(initialBooking);
  const [activeRide, setActiveRide] = useState<ActiveRide | null>(null);

  const updateBooking = (updates: Partial<RideBooking>) => {
    setBooking((prev) => ({ ...prev, ...updates }));
  };

  const resetBooking = () => {
    setBooking(initialBooking);
  };

  const updateActiveRideStatus = (
    status: ActiveRide['status'],
    updates?: Partial<ActiveRide>
  ) => {
    if (activeRide) {
      setActiveRide({ ...activeRide, status, ...updates });
    }
  };

  return (
    <RideContext.Provider
      value={{
        booking,
        activeRide,
        updateBooking,
        resetBooking,
        setActiveRide,
        updateActiveRideStatus,
      }}
    >
      {children}
    </RideContext.Provider>
  );
}

export function useRide() {
  const context = useContext(RideContext);
  if (context === undefined) {
    throw new Error('useRide must be used within a RideProvider');
  }
  return context;
}

