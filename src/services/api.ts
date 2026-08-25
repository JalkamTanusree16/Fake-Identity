const API_BASE = '/api';

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('trinetra_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });
    if (!res.ok) {
      throw new Error(`API Error ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`API call failed for ${endpoint}, using fallback mock dataset:`, err);
    throw err;
  }
}

export const api = {
  login: async (username: string, password: string, role?: string) => {
    return fetchApi<{ access_token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password, role_requested: role })
    });
  },
  getAnalytics: async () => {
    return fetchApi<any>('/analytics/dashboard');
  },
  getCases: async () => {
    return fetchApi<any[]>('/cases');
  },
  getScreeningData: async (caseId: string) => {
    return fetchApi<any>(`/screening/${caseId}`);
  },
  runScreening: async (caseId: string, travelerName: string) => {
    return fetchApi<any>('/screening/start', {
      method: 'POST',
      body: JSON.stringify({ case_id: caseId, traveler_name: travelerName })
    });
  },
  correctOcr: async (caseId: string, fieldName: string, newValue: string) => {
    return fetchApi<any>(`/ocr/correct?case_id=${caseId}`, {
      method: 'POST',
      body: JSON.stringify({ field_name: fieldName, new_value: newValue })
    });
  },
  getIdentityGraph: async (caseId: string) => {
    return fetchApi<any>(`/graph/${caseId}`);
  },
  getAuditLedger: async (caseId: string) => {
    return fetchApi<any>(`/audit/${caseId}`);
  },
  verifyAudit: async (caseId: string) => {
    return fetchApi<any>(`/audit/verify/${caseId}`);
  },
  escalateCase: async (caseId: string, notes: string) => {
    return fetchApi<any>(`/cases/${caseId}/escalate`, {
      method: 'POST',
      body: JSON.stringify({ notes })
    });
  },
  recordDecision: async (caseId: string, decision: string, notes: string) => {
    return fetchApi<any>(`/cases/${caseId}/decision`, {
      method: 'POST',
      body: JSON.stringify({ decision, notes })
    });
  },
  runAttackSimulator: async (caseId: string, attacks: Record<string, boolean>) => {
    return fetchApi<any>('/attack-simulator', {
      method: 'POST',
      body: JSON.stringify({ case_id: caseId, ...attacks })
    });
  }
};
