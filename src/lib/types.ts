export type DRLevel = 0 | 1 | 2 | 3 | 4;
export type ImageQualityStatus = 'gradable' | 'borderline' | 'ungradable';
export type ReviewStatus = 'pending' | 'in_review' | 'reviewed' | 'referred' | 'follow_up' | 'recapture';
export type AIStatus = 'pending' | 'processing' | 'complete' | 'error';
export type UserRole = 'health_worker' | 'doctor' | 'patient';
export type ConfidenceTier = 'standard' | 'priority' | 'mandatory';
export type ReferralPriority = 'urgent' | 'high' | 'routine' | 'followup';
export type EyeExamined = 'OD' | 'OS' | 'Both';

export interface ImageQuality {
  focus: number;
  illumination: number;
  fieldOfView: number;
  overall: ImageQualityStatus;
  score: number;
  reason?: string;
  guidance?: string;
}

export interface LesionFinding {
  detected: boolean;
  count?: number;
  confidence: number;
  region?: string;
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

export interface ReferralDetails {
  required: boolean;
  priority: ReferralPriority;
  center: string;
  appointmentDate?: string;
  appointmentTime?: string;
  followUpDate?: string;
  reason: string;
  confirmedAt?: string;
  confirmedBy?: string;
}

export interface AuditTrailItem {
  id: string;
  timestamp: string;
  action: 'registered' | 'analyzed' | 'confirmed' | 'modified' | 'recapture_requested' | 'referred' | 'appointment_booked';
  actor: string;
  actorRole: UserRole | 'AI Engine';
  details: string;
  notes?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  center: string;
  type: 'specialist_review' | 'screening_followup' | 'recapture';
  priority: ReferralPriority;
  status: 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F' | 'Other';
  phone: string;
  diabetesType?: 'Type 1' | 'Type 2' | 'Gestational' | 'Pre-diabetes';
  diabetesDuration: number;
  hba1c?: number;
  currentMedication?: string;
  phcLocation?: string;
  eye?: EyeExamined;
  screeningDate: string;
  screeningTime: string;
  imageQuality: ImageQuality;
  drLevel: DRLevel;
  drLabel: string;
  confidence: number;
  confidenceTier?: ConfidenceTier;
  referable: boolean;
  aiStatus: AIStatus;
  reviewStatus: ReviewStatus;
  lesions: Lesions;
  retinalStructures: RetinalStructures;
  whyFlagged?: string[];
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  doctorModifiedLevel?: DRLevel;
  referral?: ReferralDetails;
  auditTrail?: AuditTrailItem[];
  imageUrl?: string;
  enhancedImageUrl?: string;
  gradcamUrl?: string;
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
  imageSizeBytes?: number;
  aiProcessingUnits?: number;
}

export interface SimulationResults {
  annualCapacity: number;
  dailyThroughput: number;
  avgWaitMinutes: number;
  peakQueueLength: number;
  cameraUtilization: number;
  reviewerUtilization: number;
  aiUtilization?: number;
  networkUtilization?: number;
  bottleneck: string;
  recommendation?: string;
  estimatedPatientsServedYear: number;
}

// Section 35 ML API Output Contract
export interface MLScreeningOutput {
  image_quality: {
    gradable: boolean;
    focus: number;
    illumination: number;
    field_of_view: number;
    overall_score: number;
    failure_reasons?: string[];
    recapture_guidance?: string;
  };
  dr_prediction: {
    level: DRLevel;
    label: string;
    confidence: number;
    referable: boolean;
    tier: ConfidenceTier;
  };
  retinal_structures: {
    optic_disc: { detected: boolean; confidence: number; location: string };
    fovea: { detected: boolean; confidence: number; location: string };
    vessels: { segmented: boolean; confidence: number; mask_status: string };
  };
  lesions: {
    name: string;
    detected: boolean;
    count?: number;
    confidence: number;
    region?: string;
  }[];
  explainability: {
    gradcam_available: boolean;
    annotated_image_available: boolean;
    why_flagged_summary: string[];
    recommended_action: string;
  };
  enhancement: {
    clahe_applied: boolean;
    illumination_normalized: boolean;
    denoised: boolean;
    status: 'enhanced' | 'pending' | 'bypassed';
  };
}

export const DR_LEVEL_LABELS: Record<DRLevel, string> = {
  0: 'No DR',
  1: 'Mild NPDR',
  2: 'Moderate NPDR',
  3: 'Severe NPDR',
  4: 'Proliferative DR',
};

export const DR_LEVEL_DESCRIPTIONS: Record<DRLevel, string> = {
  0: 'No visible retinal microvascular abnormalities.',
  1: 'Microaneurysms only present in one or more quadrants.',
  2: 'Microaneurysms, scattered retinal hemorrhages and/or hard exudates.',
  3: 'Severe retinal hemorrhages in 4 quadrants or venous beading in 2+ quadrants.',
  4: 'Neovascularization of the disc/retina or vitreous hemorrhage.',
};

export const DR_LEVEL_COLORS: Record<DRLevel, string> = {
  0: 'text-emerald-400',
  1: 'text-yellow-400',
  2: 'text-amber-400',
  3: 'text-orange-400',
  4: 'text-red-400',
};

export const DR_LEVEL_BG_BADGES: Record<DRLevel, string> = {
  0: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  1: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  2: 'bg-amber-50 text-amber-700 border-amber-200',
  3: 'bg-orange-50 text-orange-700 border-orange-200',
  4: 'bg-red-50 text-red-700 border-red-200',
};
