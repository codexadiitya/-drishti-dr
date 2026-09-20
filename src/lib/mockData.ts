/**
 * Mock data service layer for NetraRakshaq prototype.
 */

import type { Patient, SimulationParams, SimulationResults, SystemComponent } from './types';
import { DEMO_PATIENTS } from './demoData';

export const MOCK_PATIENTS: Patient[] = DEMO_PATIENTS;

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

export async function fetchPatient(id: string): Promise<Patient | undefined> {
  return Promise.resolve(MOCK_PATIENTS.find(p => p.id === id));
}

export async function fetchPatients(): Promise<Patient[]> {
  return Promise.resolve([...MOCK_PATIENTS]);
}
