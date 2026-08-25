import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ScreeningProvider } from './context/ScreeningContext';

import { GovernmentHeader } from './components/GovernmentHeader';
import { SidebarNav } from './components/SidebarNav';
import { GovernmentDisclaimer } from './components/GovernmentDisclaimer';

import { Login } from './pages/Login';
import { CommandDashboard } from './pages/CommandDashboard';
import { ScreeningWorkspace } from './pages/ScreeningWorkspace';
import { OCRIntelligence } from './pages/OCRIntelligence';
import { DocumentValidation } from './pages/DocumentValidation';
import { ForensicsLab } from './pages/ForensicsLab';
import { FaceVerification } from './pages/FaceVerification';
import { CrossDocumentIntelligence } from './pages/CrossDocumentIntelligence';
import { IdentityGraphPage } from './pages/IdentityGraphPage';
import { RiskEnginePage } from './pages/RiskEnginePage';
import { CaseInvestigation } from './pages/CaseInvestigation';
import { SeniorOfficerReview } from './pages/SeniorOfficerReview';
import { AuditLedgerPage } from './pages/AuditLedgerPage';
import { ReportsCenter } from './pages/ReportsCenter';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AttackSimulator } from './pages/AttackSimulator';
import { SystemSettings } from './pages/SystemSettings';

const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gov-navyDark text-slate-100 font-sans">
      <GovernmentHeader />
      <div className="flex flex-1">
        <SidebarNav />
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
      <GovernmentDisclaimer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <ScreeningProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/dashboard" element={<ProtectedLayout><CommandDashboard /></ProtectedLayout>} />
            <Route path="/screening" element={<ProtectedLayout><ScreeningWorkspace /></ProtectedLayout>} />
            <Route path="/ocr" element={<ProtectedLayout><OCRIntelligence /></ProtectedLayout>} />
            <Route path="/validation" element={<ProtectedLayout><DocumentValidation /></ProtectedLayout>} />
            <Route path="/forensics" element={<ProtectedLayout><ForensicsLab /></ProtectedLayout>} />
            <Route path="/face-verification" element={<ProtectedLayout><FaceVerification /></ProtectedLayout>} />
            <Route path="/cross-document" element={<ProtectedLayout><CrossDocumentIntelligence /></ProtectedLayout>} />
            <Route path="/identity-graph" element={<ProtectedLayout><IdentityGraphPage /></ProtectedLayout>} />
            <Route path="/risk-engine" element={<ProtectedLayout><RiskEnginePage /></ProtectedLayout>} />
            <Route path="/case-investigation" element={<ProtectedLayout><CaseInvestigation /></ProtectedLayout>} />
            <Route path="/senior-review" element={<ProtectedLayout><SeniorOfficerReview /></ProtectedLayout>} />
            <Route path="/audit-ledger" element={<ProtectedLayout><AuditLedgerPage /></ProtectedLayout>} />
            <Route path="/reports" element={<ProtectedLayout><ReportsCenter /></ProtectedLayout>} />
            <Route path="/analytics" element={<ProtectedLayout><AnalyticsPage /></ProtectedLayout>} />
            <Route path="/attack-simulator" element={<ProtectedLayout><AttackSimulator /></ProtectedLayout>} />
            <Route path="/settings" element={<ProtectedLayout><SystemSettings /></ProtectedLayout>} />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </ScreeningProvider>
    </AuthProvider>
  );
};

export default App;
