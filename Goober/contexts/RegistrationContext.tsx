// /contexts/RegistrationContext.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface RegistrationData {
  name: string;
  phone: string;
  email: string;
  password: string;
  emailVerified: boolean;
  phoneVerified: boolean;
}

interface RegistrationContextType {
  registrationData: RegistrationData;
  updateRegistrationData: (data: Partial<RegistrationData>) => void;
  resetRegistrationData: () => void;
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

const initialData: RegistrationData = {
  name: '',
  phone: '',
  email: '',
  password: '',
  emailVerified: false,
  phoneVerified: false,
};

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [registrationData, setRegistrationData] = useState<RegistrationData>(initialData);

  const updateRegistrationData = (data: Partial<RegistrationData>) => {
    setRegistrationData((prev) => ({ ...prev, ...data }));
  };

  const resetRegistrationData = () => {
    setRegistrationData(initialData);
  };

  return (
    <RegistrationContext.Provider
      value={{
        registrationData,
        updateRegistrationData,
        resetRegistrationData,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  const context = useContext(RegistrationContext);
  if (context === undefined) {
    throw new Error('useRegistration must be used within a RegistrationProvider');
  }
  return context;
}

