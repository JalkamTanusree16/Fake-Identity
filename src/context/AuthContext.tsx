import React, { createContext, useContext, useState } from 'react';
import { User, Role } from '../types';

export const PERMISSIONS: Record<string, string[]> = {
  screening: [
    'view_screening',
    'upload_document',
    'view_document_result',
    'run_authenticity_demo',
    'view_basic_risk',
    'view_alerts'
  ],
  screening_officer: [
    'view_screening',
    'upload_document',
    'view_document_result',
    'run_authenticity_demo',
    'view_basic_risk',
    'view_alerts'
  ],
  senior: [
    'view_screening',
    'upload_document',
    'view_document_result',
    'run_authenticity_demo',
    'view_basic_risk',
    'view_alerts',
    'view_detailed_risk',
    'view_history',
    'review_case',
    'view_escalations',
    'view_audit_information'
  ],
  senior_officer: [
    'view_screening',
    'upload_document',
    'view_document_result',
    'run_authenticity_demo',
    'view_basic_risk',
    'view_alerts',
    'view_detailed_risk',
    'view_history',
    'review_case',
    'view_escalations',
    'view_audit_information'
  ],
  admin: [
    'view_screening',
    'upload_document',
    'view_document_result',
    'run_authenticity_demo',
    'view_basic_risk',
    'view_alerts',
    'view_detailed_risk',
    'view_history',
    'review_case',
    'view_escalations',
    'view_audit_information',
    'manage_users',
    'view_system_statistics',
    'view_audit_logs',
    'view_system_status',
    'manage_configuration'
  ],
  administrator: [
    'view_screening',
    'upload_document',
    'view_document_result',
    'run_authenticity_demo',
    'view_basic_risk',
    'view_alerts',
    'view_detailed_risk',
    'view_history',
    'review_case',
    'view_escalations',
    'view_audit_information',
    'manage_users',
    'view_system_statistics',
    'view_audit_logs',
    'view_system_status',
    'manage_configuration'
  ]
};

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, role?: Role) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_DEMO_USER: User = {
  id: 101,
  username: "screening@gmail.com",
  full_name: "Screening Officer Rajesh Mehta",
  badge_number: "SSB-SO-4091",
  role: "screening",
  department: "Operational Border Screening Unit"
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('trinetra_user');
    return saved ? JSON.parse(saved) : DEFAULT_DEMO_USER;
  });

  const login = async (username: string, password: string, role?: Role): Promise<boolean> => {
    try {
      // Attempt backend login first
      const resp = await fetch('http://127.0.0.1:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (resp.ok) {
        const data = await resp.json();
        setUser(data.user);
        localStorage.setItem('trinetra_user', JSON.stringify(data.user));
        localStorage.setItem('trinetra_token', data.access_token);
        return true;
      }

      // Client-side fallback if backend call returns error
      const u = username.toLowerCase().trim();
      let assignedRole: Role = role || "screening";
      let fullName = "Screening Officer Rajesh Mehta";
      let badge = "SSB-SO-4091";

      if (u === "senior@gmail.com" || u === "senior_rawat" || role === "senior" || role === "senior_officer") {
        assignedRole = "senior";
        fullName = "Senior Officer Col. Vikram Rawat";
        badge = "SSB-SNR-1002";
      } else if (u === "admin@gmail.com" || u === "admin_singh" || role === "admin" || role === "administrator") {
        assignedRole = "admin";
        fullName = "System Admin Harpreet Singh";
        badge = "MHA-ADM-0001";
      }

      if (password === "12345" || password === "mha123") {
        const newUser: User = {
          id: Math.floor(Math.random() * 1000) + 1,
          username: u,
          full_name: fullName,
          badge_number: badge,
          role: assignedRole,
          department: "Sashastra Seema Bal (SSB)"
        };
        setUser(newUser);
        localStorage.setItem('trinetra_user', JSON.stringify(newUser));
        localStorage.setItem('trinetra_token', 'DEMO_JWT_TOKEN_MHA_SSB_2026');
        return true;
      }

      return false;
    } catch {
      // Offline / fallback mode
      const u = username.toLowerCase().trim();
      let assignedRole: Role = role || "screening";
      if (u.includes("senior")) assignedRole = "senior";
      if (u.includes("admin")) assignedRole = "admin";

      if (password === "12345" || password === "mha123") {
        const newUser: User = {
          id: 1,
          username: u,
          full_name: u,
          badge_number: "SSB-DEMO-99",
          role: assignedRole,
          department: "Sashastra Seema Bal (SSB)"
        };
        setUser(newUser);
        localStorage.setItem('trinetra_user', JSON.stringify(newUser));
        localStorage.setItem('trinetra_token', 'DEMO_JWT_TOKEN_MHA_SSB_2026');
        return true;
      }
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('trinetra_user');
    localStorage.removeItem('trinetra_token');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    const allowed = PERMISSIONS[user.role] || [];
    return allowed.includes(permission);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
