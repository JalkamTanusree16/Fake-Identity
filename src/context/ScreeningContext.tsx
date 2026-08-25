import React, { createContext, useContext, useState } from 'react';

interface ScreeningContextType {
  activeCaseId: string;
  setActiveCaseId: (id: string) => void;
  travelerName: string;
  setTravelerName: (name: string) => void;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
}

const ScreeningContext = createContext<ScreeningContextType | undefined>(undefined);

export const ScreeningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeCaseId, setActiveCaseId] = useState<string>("TRI-2026-0001");
  const [travelerName, setTravelerName] = useState<string>("Vikram Malhotra");
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);

  return (
    <ScreeningContext.Provider value={{
      activeCaseId,
      setActiveCaseId,
      travelerName,
      setTravelerName,
      isDemoMode,
      setIsDemoMode
    }}>
      {children}
    </ScreeningContext.Provider>
  );
};

export const useScreening = () => {
  const ctx = useContext(ScreeningContext);
  if (!ctx) throw new Error('useScreening must be used within ScreeningProvider');
  return ctx;
};
