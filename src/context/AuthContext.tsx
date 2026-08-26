import React, { createContext, useContext, useState } from 'react';
import { User, Role } from '../types';

// DEMO CREDENTIALS
// Admin: admin@idverify.gov / Admin@123
// Officer: officer@idverify.gov / Officer@123
// Reviewer: reviewer@idverify.gov / Reviewer@123
// Auditor: auditor@idverify.gov / Auditor@123

export const USERS = {
  "admin@idverify.gov": {
    password: "Admin@123",
    role: "ADMIN" as Role,
    name: "Dr. Priya Sharma",
    country: "IN",
    badge: "SYS-ADM-001"
  },
  "officer@idverify.gov": {
    password: "Officer@123",
    role: "OFFICER" as Role,
    name: "Ravi Mehta",
    country: "IN",
    badge: "SCR-OFF-042"
  },
  "reviewer@idverify.gov": {
    password: "Reviewer@123",
    role: "SENIOR_REVIEWER" as Role,
    name: "Anita Nair",
    country: "IN",
    badge: "SNR-REV-007"
  },
  "auditor@idverify.gov": {
    password: "Auditor@123",
    role: "AUDITOR" as Role,
    name: "Suresh Iyer",
    country: "IN",
    badge: "AUD-CMP-015"
  }
};

export const PERMISSIONS: Record<string, Record<string, boolean | string>> = {
  ADMIN: {
    dashboard: true, upload: true, ocr: true, validation: true,
    forensics: true, faceVerification: true, riskEngine: true,
    caseInvestigation: true, seniorReview: true, auditLedger: true,
    reports: true, analytics: true, userManagement: true,
    roleManagement: true, systemSettings: true, attackSimulator: true
  },
  OFFICER: {
    dashboard: true, upload: true, ocr: true, validation: true,
    forensics: true, faceVerification: true, riskEngine: true,
    caseInvestigation: true, seniorReview: false, auditLedger: "readonly",
    reports: "limited", analytics: "limited", userManagement: false,
    roleManagement: false, systemSettings: false, attackSimulator: false
  },
  SENIOR_REVIEWER: {
    dashboard: true, upload: true, ocr: true, validation: true,
    forensics: true, faceVerification: true, riskEngine: true,
    caseInvestigation: true, seniorReview: true, auditLedger: "readonly",
    reports: true, analytics: "limited", userManagement: false,
    roleManagement: false, systemSettings: false, attackSimulator: false
  },
  AUDITOR: {
    dashboard: "limited", upload: false, ocr: false, validation: false,
    forensics: false, faceVerification: false, riskEngine: false,
    caseInvestigation: "readonly", seniorReview: "readonly", auditLedger: true,
    reports: true, analytics: true, userManagement: false,
    roleManagement: false, systemSettings: false, attackSimulator: false
  }
};

export interface CountryInfo {
  code: string;
  name: string;
  flag: string;
}

interface AuthContextType {
  user: User | null;
  selectedCountry: CountryInfo | null;
  setSelectedCountry: (country: CountryInfo) => void;
  login: (email: string, pass: string, country?: CountryInfo) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<{
    user: User | null;
    role: Role | null;
    country: CountryInfo | null;
    loginTime: string | null;
  }>(() => {
    const saved = localStorage.getItem('auth_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse auth_state", e);
      }
    }
    return { user: null, role: null, country: null, loginTime: null };
  });

  const [selectedCountryState, setSelectedCountryState] = useState<CountryInfo | null>(() => {
    const saved = localStorage.getItem('auth_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.country || null;
      } catch (e) {}
    }
    return null;
  });

  const user = authState.user;
  const selectedCountry = selectedCountryState;

  const setSelectedCountry = (country: CountryInfo) => {
    setSelectedCountryState(country);
  };

  const login = async (email: string, pass: string, countryInput?: CountryInfo): Promise<boolean> => {
    const normalizedEmail = email.toLowerCase().trim() as keyof typeof USERS;
    const matchedUser = USERS[normalizedEmail];

    if (matchedUser && matchedUser.password === pass) {
      const country = countryInput || selectedCountry || { code: matchedUser.country, name: matchedUser.country === 'IN' ? 'India' : 'Unknown', flag: '🇮🇳' };
      const userObj: User = {
        id: Math.floor(Math.random() * 1000) + 1,
        username: email,
        email: email,
        full_name: matchedUser.name,
        badge_number: matchedUser.badge,
        role: matchedUser.role,
        country: country.code,
        department: "National Identity Verification Center"
      };

      const newAuthState = {
        user: userObj,
        role: matchedUser.role,
        country: country,
        loginTime: new Date().toISOString()
      };

      setAuthState(newAuthState);
      setSelectedCountryState(country);
      localStorage.setItem('auth_state', JSON.stringify(newAuthState));
      // Keep old localStorage keys for backwards compatibility with any existing pages
      localStorage.setItem('trinetra_user', JSON.stringify(userObj));
      localStorage.setItem('trinetra_token', 'DEMO_JWT_TOKEN_MHA_SSB_2026');

      return true;
    }
    return false;
  };

  const logout = () => {
    setAuthState({ user: null, role: null, country: null, loginTime: null });
    setSelectedCountryState(null);
    localStorage.removeItem('auth_state');
    localStorage.removeItem('trinetra_user');
    localStorage.removeItem('trinetra_token');
  };

  const hasPermission = (permissionKey: string): boolean => {
    if (!user) return false;
    const rolePermissions = PERMISSIONS[user.role];
    if (!rolePermissions) return false;
    
    // If the permission is explicitly set to false, access is denied.
    // If it is true, "readonly", or "limited", access is allowed.
    return rolePermissions[permissionKey] !== false && rolePermissions[permissionKey] !== undefined;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        selectedCountry,
        setSelectedCountry,
        login,
        logout,
        isAuthenticated: !!user,
        hasPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
