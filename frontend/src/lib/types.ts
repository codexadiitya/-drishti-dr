export type UserRole = 'SCREENER' | 'OPHTHALMOLOGIST' | 'DISTRICT_OFFICER' | 'ADMIN' | 'AUDITOR';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  facilityName: string;
  district: string;
  medicalLicenseNumber?: string;
  avatarUrl?: string;
}

export type DRGrade = 0 | 1 | 2 | 3 | 4;

export type DRGradeLabel = 
  | 'No Apparent DR' 
  | 'Mild NPDR' 
  | 'Moderate NPDR' 
  | 'Severe NPDR' 
  | 'Proliferative DR (PDR)';

export type ImageQualityGrade = 'GOOD' | 'USABLE' | 'UNUSABLE';

export type ScreeningStatus = 
  | 'PENDING_CAPTURE'
  | 'PROCESSING'
  | 'AI_COMPLETED'
  | 'UNDER_REVIEW'
  | 'FINALIZED'
  | 'REJECTED';

export type EyeLaterality = 'OD' | 'OS'; // OD = Right Eye, OS = Left Eye

export interface Patient {
  id: string;
  patientCode: string; // e.g. DRP-2026-0812
  abhaId?: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phone: string;
  district: string;
  phcCenter: string;
  diabetesDurationYears: number;
  diabetesType: 'TYPE_1' | 'TYPE_2' | 'GESTATIONAL' | 'PRE_DIABETES';
  lastHba1c?: number;
  hypertension: boolean;
  smokingStatus: 'NEVER' | 'FORMER' | 'CURRENT';
  visualAcuityOD?: string; // e.g. 6/6
  visualAcuityOS?: string;
  registeredAt: string;
  lastScreeningDate?: string;
  totalScreenings: number;
  highestRiskGrade?: DRGrade;
}

export interface RetinalImageMetadata {
  id: string;
  eye: EyeLaterality;
  field: 'MACULA_CENTERED' | 'DISC_CENTERED';
  url: string;
  thumbnailUrl: string;
  capturedAt: string;
  cameraModel: string;
  width: number;
  height: number;
  quality: {
    grade: ImageQualityGrade;
    score: number; // 0 to 100
    artifacts: {
      motionBlur: number; // 0 to 1
      unevenIllumination: number;
      cataractHaze: number;
      eyelashOcclusion: number;
      discCenteredCorrectly: boolean;
    };
    feedbackMessage: string;
  };
}

export interface LesionCounts {
  microaneurysms: number;
  hemorrhages: number;
  hardExudates: number;
  cottonWoolSpots: number;
  neovascularizationPresent: boolean;
}

export interface InferenceResult {
  id: string;
  imageId: string;
  eye: EyeLaterality;
  isDemoMode: boolean;
  modelVersion: string;
  inferenceTimeMs: number;
  
  // Classification
  icdrGrade: DRGrade;
  icdrLabel: DRGradeLabel;
  confidence: number; // 0..100
  probabilities: { [grade in DRGrade]: number };
  
  // Risk & Referral
  referableDR: boolean;
  urgentReferral: boolean;
  dmeRisk: boolean; // Diabetic Macular Edema
  dmeConfidence: number;
  
  // Vessel Analysis
  vesselDensity: number; // e.g. 0.142
  vesselTortuosity: number; // e.g. 1.28
  avRatio: number; // Arteriolar-to-venular ratio e.g. 0.65
  
  // Lesions
  lesions: LesionCounts;
  
  // Generated Overlays (URLs/Paths)
  vesselMaskUrl?: string;
  lesionMaskUrl?: string;
  gradcamHeatmapUrl?: string;
  dmeOverlayUrl?: string;
  
  createdAt: string;
}

export interface DoctorReview {
  id: string;
  encounterId: string;
  doctor: {
    id: string;
    name: string;
    licenseNumber: string;
    institution: string;
  };
  finalGradeOD: DRGrade;
  finalGradeOS: DRGrade;
  finalDmeOD: boolean;
  finalDmeOS: boolean;
  agreedWithAI: boolean;
  disagreementReason?: string;
  clinicalNotes: string;
  recommendedAction: 
    | 'ANNUAL_ROUTINE_SCREENING'
    | 'FOLLOW_UP_6_MONTHS'
    | 'ROUTINE_OPHTHALMOLOGY_REFERRAL'
    | 'URGENT_VITREORETINAL_REFERRAL'
    | 'REPEAT_FUNDUS_PHOTOGRAPHY';
  followUpTimeline: '12_MONTHS' | '6_MONTHS' | '3_MONTHS' | '4_WEEKS' | '48_HOURS';
  digitalSignatureHash: string;
  reviewedAt: string;
}

export interface ScreeningEncounter {
  id: string;
  encounterCode: string; // e.g. ENC-2026-4401
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientDistrict: string;
  phcCenter: string;
  screenerId: string;
  screenerName: string;
  status: ScreeningStatus;
  
  // Images
  imageOD?: RetinalImageMetadata;
  imageOS?: RetinalImageMetadata;
  
  // Inferences
  inferenceOD?: InferenceResult;
  inferenceOS?: InferenceResult;
  
  // Aggregated Triage
  highestGrade?: DRGrade;
  referableDR: boolean;
  urgentReferral: boolean;
  dmeRisk: boolean;
  
  // Review & Report
  review?: DoctorReview;
  reportPdfUrl?: string;
  
  createdAt: string;
  completedAt?: string;
}

export interface DistrictMetric {
  districtName: string;
  totalScreened: number;
  diabeticPopulation: number;
  coveragePercentage: number;
  referralCount: number;
  urgentReferralCount: number;
  gradeDistribution: { [grade in DRGrade]: number };
  dmeCount: number;
  avgTurnaroundHours: number;
  activePhcs: number;
}

export interface CapacitySimulationParams {
  targetPopulation: number;
  prevalenceRate: number; // e.g. 0.18
  fundusCameras: number;
  screenersPerFacility: number;
  screeningHoursPerDay: number;
  minutesPerScreening: number;
  aiSpecificityCutoff: number; // e.g. 0.92
  aiSensitivityCutoff: number; // e.g. 0.95
  teleOphthalmologists: number;
  reviewMinutesPerCase: number;
}

export interface CapacitySimulationOutput {
  dailyScreeningCapacity: number;
  monthlyPatientsScreened: number;
  annualCoveragePercent: number;
  dailyDoctorReviewWorkloadHours: number;
  estimatedBacklogDays: number;
  projectedTruePositivesDetected: number;
  projectedFalseNegativesMissed: number;
  projectedSightThreateningAverted: number;
  totalAnnualCostINR: number;
  costPerPatientScreenedINR: number;
  costPerSightThreateningDetectedINR: number;
  recommendations: string[];
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: 
    | 'USER_LOGIN'
    | 'PATIENT_CREATED'
    | 'FUNDUS_IMAGE_UPLOAD'
    | 'AI_INFERENCE_TRIGGERED'
    | 'DOCTOR_REVIEW_SUBMITTED'
    | 'PDF_REPORT_GENERATED'
    | 'MODEL_MODE_TOGGLED'
    | 'PATIENT_EXPORT';
  entityType: 'PATIENT' | 'ENCOUNTER' | 'IMAGE' | 'MODEL' | 'SYSTEM';
  entityId: string;
  details: string;
  ipAddress: string;
  integrityHash: string;
}

export interface ModelRegistryItem {
  id: string;
  name: string;
  taskType: 'IMAGE_QUALITY' | 'DR_CLASSIFICATION' | 'VESSEL_SEGMENTATION' | 'LESION_DETECTION' | 'EXPLAINABILITY';
  version: string;
  architecture: string;
  framework: string;
  trainingDataset: string;
  datasetSamples: number;
  sensitivity: number; // 0..100
  specificity: number;
  aucRoc: number;
  f1Score: number;
  inferenceLatencyMs: number;
  weightsChecksum: string;
  isActive: boolean;
  lastUpdated: string;
}
