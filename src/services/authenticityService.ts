import { AuthenticityResult } from '../types';

export interface AuthenticityParams {
  documentId?: string;
  filename?: string;
  scenarioId?: string;
}

export const authenticityService = {
  /**
   * Run deterministic fake/authentic demonstration check.
   */
  async checkAuthenticity(params: AuthenticityParams): Promise<AuthenticityResult> {
    const key = params.documentId || params.filename || params.scenarioId || 'default-doc';
    try {
      const response = await fetch('http://127.0.0.1:8000/api/demo/authenticity-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_id: key,
          filename: params.filename,
          scenario_id: params.scenarioId
        })
      });

      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Graceful fallback if backend server is unreachable
    }

    // Deterministic fallback generator if network request fails
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash << 5) - hash + key.charCodeAt(i);
      hash |= 0;
    }
    const mod = Math.abs(hash) % 3;

    if (mod === 0) {
      return {
        status: 'FAKE',
        confidence: 92,
        riskLevel: 'HIGH',
        reasons: [
          'Document structure anomaly detected in micro-text optical band',
          'Synthetic security-feature simulation inconsistency',
          'MRZ line checksum mismatch against visual zone data'
        ],
        checks: [
          { name: 'Image quality check', status: 'PASS', detail: 'Optimal resolution and contrast' },
          { name: 'Document structure anomaly', status: 'FAIL', detail: 'Font layout alignment deviation > 2.4mm' },
          { name: 'Security-feature simulation', status: 'FAIL', detail: 'UV hologram pattern simulation failed' },
          { name: 'Field consistency check', status: 'FAIL', detail: 'DOB discrepancy across zone 1 and zone 2' }
        ],
        isDemoResult: true,
        disclaimer: 'DigiVerify AI screening prototype demonstration check. Final authority remains with authorized border officers.'
      };
    } else if (mod === 1) {
      return {
        status: 'SUSPICIOUS',
        confidence: 78,
        riskLevel: 'MEDIUM',
        reasons: [
          'Minor font thickness variation in identity fields',
          'Photo edge gradient anomaly suggesting potential image replacement'
        ],
        checks: [
          { name: 'Image quality check', status: 'PASS', detail: 'Clear scan quality' },
          { name: 'Document structure anomaly', status: 'WARN', detail: 'Font thickness slightly irregular' },
          { name: 'Security-feature simulation', status: 'PASS', detail: 'Basic watermark simulation verified' },
          { name: 'Field consistency check', status: 'WARN', detail: 'Expiry date near boundary window' }
        ],
        isDemoResult: true,
        disclaimer: 'DigiVerify AI screening prototype demonstration check. Final authority remains with authorized border officers.'
      };
    } else {
      return {
        status: 'AUTHENTIC / NO OBVIOUS ISSUE',
        confidence: 96,
        riskLevel: 'LOW',
        reasons: [
          'No visual layout or structural anomalies detected',
          'Document security pattern checks verified within acceptable thresholds'
        ],
        checks: [
          { name: 'Image quality check', status: 'PASS', detail: 'High quality image capture' },
          { name: 'Document structure anomaly', status: 'PASS', detail: 'All fields align with standard template' },
          { name: 'Security-feature simulation', status: 'PASS', detail: 'Security grid pattern intact' },
          { name: 'Field consistency check', status: 'PASS', detail: '100% field cross-matching verified' }
        ],
        isDemoResult: true,
        disclaimer: 'DigiVerify AI screening prototype demonstration check. Final authority remains with authorized border officers.'
      };
    }
  }
};
