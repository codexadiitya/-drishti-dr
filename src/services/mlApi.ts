/**
 * NetraRakshaq Production ML API Adapter
 * 
 * Interface contract with the actual ML backend.
 * When the ML team deploys the inference service, configure VITE_ML_API_URL.
 * 
 * Endpoint: POST /api/screening/analyze
 */

import type { MLScreeningOutput } from '../lib/types';

export interface ScreeningAnalyzePayload {
  patient_id: string;
  eye: 'OD' | 'OS';
  image_base64?: string;
  image_file?: File;
  compressed?: boolean;
}

const DEFAULT_API_URL = import.meta.env.VITE_ML_API_URL || '/api/screening';

export async function analyzeRetinalImage(payload: ScreeningAnalyzePayload): Promise<MLScreeningOutput> {
  const formData = new FormData();
  formData.append('patient_id', payload.patient_id);
  formData.append('eye', payload.eye);
  if (payload.image_file) {
    formData.append('file', payload.image_file);
  } else if (payload.image_base64) {
    formData.append('image_base64', payload.image_base64);
  }
  if (payload.compressed) {
    formData.append('compressed', 'true');
  }

  const response = await fetch(`${DEFAULT_API_URL}/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Network response was not ok');
    throw new Error(`ML Service Error (${response.status}): ${errorText}`);
  }

  return response.json();
}

export async function checkMLServiceHealth(): Promise<{ status: 'online' | 'offline'; version?: string; latency?: number }> {
  try {
    const start = performance.now();
    const res = await fetch(`${DEFAULT_API_URL}/health`, { method: 'GET', signal: AbortSignal.timeout(3000) });
    const latency = Math.round(performance.now() - start);
    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      return { status: 'online', version: data.version || '1.0.0', latency };
    }
    return { status: 'offline' };
  } catch {
    return { status: 'offline' };
  }
}
