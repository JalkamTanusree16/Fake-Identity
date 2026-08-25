import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, role?: Role) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default demo user (Screening Officer Rajesh Mehta)
const DEFAULT_DEMO_USER: User = {
  id: 1,
  username: "officer_mehta",
  full_name: "Officer Rajesh Mehta",
  badge_number: "SSB-SO-4091",
  role: "screening_officer",
  department: "ICP Petrapole Border Checkpoint (IN-BD)"
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('trinetra_user');
    return saved ? JSON.parse(saved) : DEFAULT_DEMO_USER;
  });

  const login = async (username: string, password: string, role?: Role): Promise<boolean> => {
    try {
      const roleMap: Record<string, { name: string; badge: string; role: Role }> = {
        officer_mehta: { name: "Officer Rajesh Mehta", badge: "SSB-SO-4091", role: "screening_officer" },
        senior_rawat: { name: "Sr. Officer Col. Vikram Rawat", badge: "SSB-SNR-1002", role: "senior_officer" },
        admin_singh: { name: "Admin Harpreet Singh", badge: "MHA-ADM-0001", role: "administrator" }
      };

      const matched = roleMap[username] || { name: username.replace('_', ' ').toUpperCase(), badge: "SSB-DEMO-99", role: role || "screening_officer" };
      const newUser: User = {
        id: Math.floor(Math.random() * 1000),
        username,
        full_name: matched.name,
        badge_number: matched.badge,
        role: matched.role,
        department: "Sashastra Seema Bal (SSB), MHA"
      };

      setUser(newUser);
      localStorage.setItem('trinetra_user', JSON.stringify(newUser));
      localStorage.setItem('trinetra_token', 'DEMO_JWT_TOKEN_MHA_SSB_2026');
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('trinetra_user');
    localStorage.removeItem('trinetra_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
