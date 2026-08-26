export type Role = 'screening' | 'senior' | 'admin' | 'screening_officer' | 'senior_officer' | 'administrator' | 'ADMIN' | 'OFFICER' | 'SENIOR_REVIEWER' | 'AUDITOR';

export interface User {
  id?: number;
  username?: string;
  email?: string;
  full_name: string;
  badge_number: string;
  role: Role;
  country?: string;
  department?: string;
}

export interface AuthenticityCheckItem {
  name: string;
  status: 'PASS' | 'WARN' | 'FAIL';
  detail?: string;
}

export interface AuthenticityResult {
  status: string;
  confidence: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  reasons: string[];
  checks: AuthenticityCheckItem[];
  isDemoResult: boolean;
  disclaimer?: string;
}

export interface ScreeningCase {
  id: string;
  status: 'NEW' | 'ANALYZING' | 'REVIEW_REQUIRED' | 'ESCALATED' | 'UNDER_INVESTIGATION' | 'CLEARED' | 'REJECTED' | 'CLOSED';
  traveler_name: string;
  checkpoint: string;
  is_hero_case?: boolean;
  created_at: string;
  risk_score?: number;
  risk_level?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface OCRFields {
  name: string;
  passport_number: string;
  dob: string;
  expiry: string;
  nationality: string;
  gender: string;
  mrz_l1: string;
  mrz_l2: string;
}

export interface ValidationCheck {
  check_name: string;
  status: 'PASS' | 'WARN' | 'FAIL';
  detail: string;
  code: string;
}

export interface HeatmapRegion {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  confidence: number;
  method: string;
}

export interface TamperingData {
  is_tampered: boolean;
  tampering_score: number;
  detected_types: string[];
  heatmap_regions: HeatmapRegion[];
  explanation: string;
}

export interface FaceData {
  match_score: number;
  is_matched: boolean;
  liveness_score: number;
  pose_quality: number;
  illumination_quality: number;
  explanation: string;
}

export interface Discrepancy {
  field: string;
  values: Record<string, string>;
  severity: 'MEDIUM' | 'HIGH' | 'CRITICAL';
  explanation: string;
}

export interface CrossDocMatrixRow {
  field: string;
  passport: string;
  visa: string;
  id: string;
  status: 'PASS' | 'CONFLICT';
}

export interface RiskFactorBreakdown {
  tampering: number;
  face_mismatch: number;
  validation_anomaly: number;
  cross_document_conflict: number;
  identity_graph_alert: number;
}

export interface RiskData {
  score: number;
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  factor_breakdown: RiskFactorBreakdown;
  explanation: string;
  recommendation: string;
  confidence: number;
}

export interface GraphNode {
  id: string;
  label: string;
  type: string;
  category: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  relationship: string;
  is_suspicious: boolean;
}

export interface IdentityGraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  suspicious_clusters: any[];
}

export interface AuditBlock {
  block_index: number;
  case_id: string;
  event_type: string;
  officer_id: string;
  document_hash: string;
  previous_hash: string;
  current_hash: string;
  merkle_root: string;
  timestamp: string;
}
