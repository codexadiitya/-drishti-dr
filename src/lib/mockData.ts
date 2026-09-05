/**
 * Mock data service layer for NetraRakshaq prototype.
 *
 * TODO: Replace each service function with real API calls when backend is ready.
 * Integration points:
 *   - P4 MATLAB image quality service → analyzeImageQuality()
 *   - P5 retinal segmentation service → getRetinalStructures()
 *   - P3 lesion detection + explainability → getLesionAnalysis()
 *   - P2 DR classification → getDRClassification()
 *   - Unified screening result endpoint → getPatientResult()
 */

import type { Patient, SimulationParams, SimulationResults, SystemComponent } from './types';

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'PT-10021',
    age: 58,
    gender: 'M',
    diabetesDuration: 12,
    screeningDate: '2026-09-02',
    screeningTime: '09:14',
    imageQuality: { focus: 94, illumination: 88, fieldOfView: 92, overall: 'gradable', score: 91 },
    drLevel: 2,
    drLabel: 'Moderate Non-Proliferative Diabetic Retinopathy',
    confidence: 93.1,
    referable: true,
    aiStatus: 'complete',
    reviewStatus: 'pending',
    lesions: {
      microaneurysms: { detected: true, count: 14, confidence: 91 },
      hemorrhages: { detected: true, count: 6, confidence: 87 },
      exudates: { detected: true, count: 3, confidence: 90 },
      neovascularization: { detected: false, confidence: 88 },
    },
    retinalStructures: {
      opticDisc: { detected: true, confidence: 97, location: '(265, 188)' },
      fovea: { detected: true, confidence: 94, location: '(150, 202)' },
      vessels: { segmented: true, confidence: 92 },
    },
  },
  {
    id: 'PT-10022',
    age: 45,
    gender: 'F',
    diabetesDuration: 6,
    screeningDate: '2026-09-02',
    screeningTime: '09:32',
    imageQuality: { focus: 87, illumination: 82, fieldOfView: 89, overall: 'gradable', score: 86 },
    drLevel: 1,
    drLabel: 'Mild Non-Proliferative Diabetic Retinopathy',
    confidence: 88.4,
    referable: false,
    aiStatus: 'complete',
    reviewStatus: 'reviewed',
    lesions: {
      microaneurysms: { detected: true, count: 4, confidence: 84 },
      hemorrhages: { detected: false, count: 0, confidence: 91 },
      exudates: { detected: false, count: 0, confidence: 89 },
      neovascularization: { detected: false, confidence: 95 },
    },
    retinalStructures: {
      opticDisc: { detected: true, confidence: 96, location: '(268, 185)' },
      fovea: { detected: true, confidence: 92, location: '(148, 200)' },
      vessels: { segmented: true, confidence: 90 },
    },
    reviewedBy: 'Dr. R. Mehta',
  },
  {
    id: 'PT-10023',
    age: 62,
    gender: 'M',
    diabetesDuration: 18,
    screeningDate: '2026-09-02',
    screeningTime: '09:51',
    imageQuality: { focus: 38, illumination: 44, fieldOfView: 52, overall: 'ungradable', score: 44 },
    drLevel: 0,
    drLabel: 'No DR — Image Ungradable',
    confidence: 0,
    referable: false,
    aiStatus: 'error',
    reviewStatus: 'recapture',
    lesions: {
      microaneurysms: { detected: false, count: 0, confidence: 0 },
      hemorrhages: { detected: false, count: 0, confidence: 0 },
      exudates: { detected: false, count: 0, confidence: 0 },
      neovascularization: { detected: false, confidence: 0 },
    },
    retinalStructures: {
      opticDisc: { detected: false, confidence: 0, location: 'N/A' },
      fovea: { detected: false, confidence: 0, location: 'N/A' },
      vessels: { segmented: false, confidence: 0 },
    },
  },
  {
    id: 'PT-10024',
    age: 71,
    gender: 'F',
    diabetesDuration: 22,
    screeningDate: '2026-09-02',
    screeningTime: '10:08',
    imageQuality: { focus: 91, illumination: 95, fieldOfView: 93, overall: 'gradable', score: 93 },
    drLevel: 3,
    drLabel: 'Severe Non-Proliferative Diabetic Retinopathy',
    confidence: 91.7,
    referable: true,
    aiStatus: 'complete',
    reviewStatus: 'referred',
    lesions: {
      microaneurysms: { detected: true, count: 28, confidence: 93 },
      hemorrhages: { detected: true, count: 15, confidence: 91 },
      exudates: { detected: true, count: 8, confidence: 89 },
      neovascularization: { detected: false, confidence: 86 },
    },
    retinalStructures: {
      opticDisc: { detected: true, confidence: 98, location: '(264, 190)' },
      fovea: { detected: true, confidence: 95, location: '(149, 203)' },
      vessels: { segmented: true, confidence: 94 },
    },
    reviewedBy: 'Dr. A. Sharma',
  },
  {
    id: 'PT-10025',
    age: 53,
    gender: 'M',
    diabetesDuration: 9,
    screeningDate: '2026-09-02',
    screeningTime: '10:25',
    imageQuality: { focus: 96, illumination: 91, fieldOfView: 97, overall: 'gradable', score: 95 },
    drLevel: 0,
    drLabel: 'No Diabetic Retinopathy',
    confidence: 97.2,
    referable: false,
    aiStatus: 'complete',
    reviewStatus: 'reviewed',
    lesions: {
      microaneurysms: { detected: false, count: 0, confidence: 96 },
      hemorrhages: { detected: false, count: 0, confidence: 97 },
      exudates: { detected: false, count: 0, confidence: 95 },
      neovascularization: { detected: false, confidence: 98 },
    },
    retinalStructures: {
      opticDisc: { detected: true, confidence: 99, location: '(266, 187)' },
      fovea: { detected: true, confidence: 97, location: '(151, 201)' },
      vessels: { segmented: true, confidence: 96 },
    },
    reviewedBy: 'Dr. R. Mehta',
  },
  {
    id: 'PT-10026',
    age: 49,
    gender: 'F',
    diabetesDuration: 5,
    screeningDate: '2026-09-02',
    screeningTime: '10:42',
    imageQuality: { focus: 79, illumination: 83, fieldOfView: 81, overall: 'borderline', score: 81 },
    drLevel: 1,
    drLabel: 'Mild Non-Proliferative Diabetic Retinopathy',
    confidence: 82.3,
    referable: false,
    aiStatus: 'complete',
    reviewStatus: 'pending',
    lesions: {
      microaneurysms: { detected: true, count: 3, confidence: 79 },
      hemorrhages: { detected: false, count: 0, confidence: 88 },
      exudates: { detected: false, count: 0, confidence: 90 },
      neovascularization: { detected: false, confidence: 93 },
    },
    retinalStructures: {
      opticDisc: { detected: true, confidence: 90, location: '(264, 191)' },
      fovea: { detected: true, confidence: 87, location: '(149, 204)' },
      vessels: { segmented: true, confidence: 85 },
    },
  },
  {
    id: 'PT-10027',
    age: 66,
    gender: 'M',
    diabetesDuration: 14,
    screeningDate: '2026-09-02',
    screeningTime: '11:05',
    imageQuality: { focus: 93, illumination: 90, fieldOfView: 94, overall: 'gradable', score: 92 },
    drLevel: 4,
    drLabel: 'Proliferative Diabetic Retinopathy',
    confidence: 89.5,
    referable: true,
    aiStatus: 'complete',
    reviewStatus: 'referred',
    lesions: {
      microaneurysms: { detected: true, count: 35, confidence: 90 },
      hemorrhages: { detected: true, count: 22, confidence: 92 },
      exudates: { detected: true, count: 11, confidence: 88 },
      neovascularization: { detected: true, confidence: 86 },
    },
    retinalStructures: {
      opticDisc: { detected: true, confidence: 95, location: '(263, 189)' },
      fovea: { detected: true, confidence: 91, location: '(149, 201)' },
      vessels: { segmented: true, confidence: 90 },
    },
    reviewedBy: 'Dr. A. Sharma',
  },
  {
    id: 'PT-10028',
    age: 55,
    gender: 'F',
    diabetesDuration: 8,
    screeningDate: '2026-09-02',
    screeningTime: '11:28',
    imageQuality: { focus: 88, illumination: 86, fieldOfView: 90, overall: 'gradable', score: 88 },
    drLevel: 0,
    drLabel: 'No Diabetic Retinopathy',
    confidence: 94.8,
    referable: false,
    aiStatus: 'complete',
    reviewStatus: 'pending',
    lesions: {
      microaneurysms: { detected: false, count: 0, confidence: 93 },
      hemorrhages: { detected: false, count: 0, confidence: 95 },
      exudates: { detected: false, count: 0, confidence: 94 },
      neovascularization: { detected: false, confidence: 97 },
    },
    retinalStructures: {
      opticDisc: { detected: true, confidence: 97, location: '(265, 188)' },
      fovea: { detected: true, confidence: 94, location: '(150, 202)' },
      vessels: { segmented: true, confidence: 93 },
    },
  },
];

export const HOURLY_SCREENING_DATA = [
  { time: '08:00', screened: 8, referable: 2, recapture: 1 },
  { time: '09:00', screened: 14, referable: 3, recapture: 2 },
  { time: '10:00', screened: 16, referable: 4, recapture: 1 },
  { time: '11:00', screened: 18, referable: 4, recapture: 2 },
  { time: '12:00', screened: 12, referable: 2, recapture: 1 },
  { time: '13:00', screened: 15, referable: 3, recapture: 2 },
  { time: '14:00', screened: 17, referable: 5, recapture: 1 },
  { time: '15:00', screened: 19, referable: 4, recapture: 3 },
  { time: '16:00', screened: 11, referable: 2, recapture: 1 },
  { time: '17:00', screened: 8, referable: 2, recapture: 0 },
];

export const SYSTEM_COMPONENTS: SystemComponent[] = [
  { name: 'Image Quality Assessment', status: 'online', latency: 320, module: 'P4' },
  { name: 'CLAHE Enhancement', status: 'online', latency: 180, module: 'P4' },
  { name: 'Vessel Segmentation', status: 'online', latency: 1240, module: 'P5' },
  { name: 'Optic Disc Localization', status: 'online', latency: 890, module: 'P5' },
  { name: 'Lesion Detection', status: 'online', latency: 2100, module: 'P3' },
  { name: 'DR Classification', status: 'online', latency: 1560, module: 'P2' },
  { name: 'Grad-CAM Explainability', status: 'online', latency: 980, module: 'P3' },
  { name: 'Report Generation', status: 'online', latency: 210, module: 'P1' },
  { name: 'MATLAB Processing Service', status: 'online', latency: 45, module: 'P4/P5' },
  { name: 'Simulink Simulator', status: 'online', latency: 0, module: 'P6' },
  { name: 'REST API Gateway', status: 'online', latency: 28, module: 'P1' },
  { name: 'Database / Storage', status: 'online', latency: 12, module: 'P1' },
];

export const SCENARIO_PRESETS: Record<string, SimulationParams> = {
  baseline: {
    patientsPerDay: 50,
    operatingHours: 8,
    cameras: 1,
    bandwidthMbps: 5,
    aiProcessingSeconds: 60,
    recaptureRate: 15,
    ophthalmologists: 1,
    reviewTimeSeconds: 45,
  },
  lowResource: {
    patientsPerDay: 30,
    operatingHours: 6,
    cameras: 1,
    bandwidthMbps: 2,
    aiProcessingSeconds: 90,
    recaptureRate: 25,
    ophthalmologists: 1,
    reviewTimeSeconds: 60,
  },
  standardDistrict: {
    patientsPerDay: 120,
    operatingHours: 10,
    cameras: 3,
    bandwidthMbps: 10,
    aiProcessingSeconds: 45,
    recaptureRate: 12,
    ophthalmologists: 2,
    reviewTimeSeconds: 30,
  },
  highVolume: {
    patientsPerDay: 250,
    operatingHours: 12,
    cameras: 5,
    bandwidthMbps: 25,
    aiProcessingSeconds: 30,
    recaptureRate: 10,
    ophthalmologists: 4,
    reviewTimeSeconds: 25,
  },
  hundredThousand: {
    patientsPerDay: 345,
    operatingHours: 12,
    cameras: 6,
    bandwidthMbps: 50,
    aiProcessingSeconds: 25,
    recaptureRate: 10,
    ophthalmologists: 5,
    reviewTimeSeconds: 20,
  },
};

export function computeSimulation(params: SimulationParams): SimulationResults {
  const {
    patientsPerDay, operatingHours, cameras, aiProcessingSeconds,
    recaptureRate, ophthalmologists, reviewTimeSeconds,
  } = params;

  const workingSeconds = operatingHours * 3600;
  const effectivePatients = patientsPerDay * (1 + recaptureRate / 100);

  const cameraCapacityPerDay = (cameras * workingSeconds) / aiProcessingSeconds;
  const reviewerCapacityPerDay = (ophthalmologists * workingSeconds) / reviewTimeSeconds;

  const dailyThroughput = Math.min(patientsPerDay, cameraCapacityPerDay, reviewerCapacityPerDay);

  const cameraUtil = Math.min(100, (effectivePatients * aiProcessingSeconds) / (cameras * workingSeconds) * 100);
  const reviewerUtil = Math.min(100, (patientsPerDay * reviewTimeSeconds) / (ophthalmologists * workingSeconds) * 100);

  const bottleneck = cameraUtil > reviewerUtil ? 'Camera acquisition' : 'Clinical review';

  const peakArrivalRate = patientsPerDay / (operatingHours * 2);
  const peakQueue = Math.max(0, Math.round(peakArrivalRate * (aiProcessingSeconds / 60)));
  const avgWait = Math.round((peakQueue / 2) * (aiProcessingSeconds / 60));

  const workingDaysPerYear = 312;
  const annualCapacity = Math.round(dailyThroughput * workingDaysPerYear);
  const estimatedServed = Math.round(Math.min(annualCapacity, patientsPerDay * workingDaysPerYear));

  return {
    annualCapacity,
    dailyThroughput: Math.round(dailyThroughput),
    avgWaitMinutes: avgWait,
    peakQueueLength: peakQueue,
    cameraUtilization: Math.round(cameraUtil),
    reviewerUtilization: Math.round(reviewerUtil),
    bottleneck,
    estimatedPatientsServedYear: estimatedServed,
  };
}

// TODO: Replace with real API call to unified screening endpoint
export async function fetchPatient(id: string): Promise<Patient | undefined> {
  return Promise.resolve(MOCK_PATIENTS.find(p => p.id === id));
}

// TODO: Replace with real API call to patient list endpoint
export async function fetchPatients(): Promise<Patient[]> {
  return Promise.resolve([...MOCK_PATIENTS]);
}
