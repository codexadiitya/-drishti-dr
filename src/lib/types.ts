export type DRLevel = 0 | 1 | 2 | 3 | 4;
export type ImageQualityStatus = 'gradable' | 'borderline' | 'ungradable';
export type ReviewStatus = 'pending' | 'in_review' | 'reviewed' | 'referred' | 'follow_up' | 'recapture';
export type AIStatus = 'pending' | 'processing' | 'complete' | 'error';

export interface ImageQuality {
  focus: number;
  illumination: number;
  fieldOfView: number;
  overall: ImageQualityStatus;
  score: number;
}

export interface LesionFinding {
  detected: boolean;
  count?: number;
  confidence: number;
}

export interface Lesions {
  microaneurysms: LesionFinding;
  hemorrhages: LesionFinding;
  exudates: LesionFinding;
  neovascularization: LesionFinding;
}

export interface RetinalStructures {
  opticDisc: { detected: boolean; confidence: number; location: string };
  fovea: { detected: boolean; confidence: number; location: string };
  vessels: { segmented: boolean; confidence: number };
}

export interface Patient {
  id: string;
  age: number;
  gender: 'M' | 'F';
  diabetesDuration: number;
  screeningDate: string;
  screeningTime: string;
  imageQuality: ImageQuality;
  drLevel: DRLevel;
  drLabel: string;
  confidence: number;
  referable: boolean;
  aiStatus: AIStatus;
  reviewStatus: ReviewStatus;
  lesions: Lesions;
  retinalStructures: RetinalStructures;
  reviewNotes?: string;
  reviewedBy?: string;
}

export interface SystemComponent {
  name: string;
  status: 'online' | 'processing' | 'warning' | 'offline';
  latency?: number;
  module: string;
}

export interface SimulationParams {
  patientsPerDay: number;
  operatingHours: number;
  cameras: number;
  bandwidthMbps: number;
  aiProcessingSeconds: number;
  recaptureRate: number;
  ophthalmologists: number;
  reviewTimeSeconds: number;
}

export interface SimulationResults {
  annualCapacity: number;
  dailyThroughput: number;
  avgWaitMinutes: number;
  peakQueueLength: number;
  cameraUtilization: number;
  reviewerUtilization: number;
  bottleneck: string;
  estimatedPatientsServedYear: number;
}

export const DR_LEVEL_LABELS: Record<DRLevel, string> = {
  0: 'No DR',
  1: 'Mild NPDR',
  2: 'Moderate NPDR',
  3: 'Severe NPDR',
  4: 'Proliferative DR',
};

export const DR_LEVEL_COLORS: Record<DRLevel, string> = {
  0: 'text-emerald-400',
  1: 'text-yellow-400',
  2: 'text-amber-400',
  3: 'text-orange-400',
  4: 'text-red-400',
};
