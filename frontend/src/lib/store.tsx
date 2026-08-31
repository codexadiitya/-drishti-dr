'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Patient,
  ScreeningEncounter,
  AuditLogItem,
  CapacitySimulationParams,
  CapacitySimulationOutput,
  DRGrade,
  DoctorReview,
  RetinalImageMetadata,
  InferenceResult
} from './types';
import {
  CURRENT_USER_SCREENER,
  CURRENT_USER_DOCTOR,
  CURRENT_USER_ADMIN,
  INITIAL_PATIENTS,
  INITIAL_SCREENINGS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SIMULATION_PARAMS,
  calculateSimulation
} from './mock-data';

interface AppContextType {
  currentUser: User;
  setCurrentUserRole: (role: UserRole) => void;
  patients: Patient[];
  addPatient: (patient: Omit<Patient, 'id' | 'patientCode' | 'registeredAt' | 'totalScreenings'>) => Patient;
  getPatient: (id: string) => Patient | undefined;
  screenings: ScreeningEncounter[];
  getScreening: (id: string) => ScreeningEncounter | undefined;
  createScreening: (patientId: string) => ScreeningEncounter;
  updateScreeningImages: (encounterId: string, imageOD?: RetinalImageMetadata, imageOS?: RetinalImageMetadata) => void;
  runInferenceForEncounter: (encounterId: string) => Promise<ScreeningEncounter>;
  submitDoctorReview: (encounterId: string, review: Omit<DoctorReview, 'id' | 'reviewedAt' | 'digitalSignatureHash'>) => void;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  auditLogs: AuditLogItem[];
  addAuditLog: (action: AuditLogItem['action'], entityType: AuditLogItem['entityType'], entityId: string, details: string) => void;
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  pendingSyncCount: number;
  simulationParams: CapacitySimulationParams;
  setSimulationParams: React.Dispatch<React.SetStateAction<CapacitySimulationParams>>;
  simulationOutput: CapacitySimulationOutput;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER_SCREENER);
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [screenings, setScreenings] = useState<ScreeningEncounter[]>(INITIAL_SCREENINGS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);
  const [simulationParams, setSimulationParams] = useState<CapacitySimulationParams>(INITIAL_SIMULATION_PARAMS);
  const [simulationOutput, setSimulationOutput] = useState<CapacitySimulationOutput>(calculateSimulation(INITIAL_SIMULATION_PARAMS));

  useEffect(() => {
    setSimulationOutput(calculateSimulation(simulationParams));
  }, [simulationParams]);

  const setCurrentUserRole = (role: UserRole) => {
    if (role === 'OPHTHALMOLOGIST') {
      setCurrentUser(CURRENT_USER_DOCTOR);
    } else if (role === 'ADMIN' || role === 'AUDITOR' || role === 'DISTRICT_OFFICER') {
      setCurrentUser({ ...CURRENT_USER_ADMIN, role });
    } else {
      setCurrentUser(CURRENT_USER_SCREENER);
    }
  };

  const addAuditLog = (
    action: AuditLogItem['action'],
    entityType: AuditLogItem['entityType'],
    entityId: string,
    details: string
  ) => {
    const newLog: AuditLogItem = {
      id: `aud_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      userName: currentUser.fullName,
      userRole: currentUser.role,
      action,
      entityType,
      entityId,
      details,
      ipAddress: '192.168.1.44',
      integrityHash: `SHA256:${Math.random().toString(16).substr(2, 32)}`
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const addPatient = (data: Omit<Patient, 'id' | 'patientCode' | 'registeredAt' | 'totalScreenings'>) => {
    const count = patients.length + 1;
    const newPatient: Patient = {
      ...data,
      id: `pat_${Date.now()}`,
      patientCode: `DRP-2026-${(810 + count).toString().padStart(4, '0')}`,
      registeredAt: new Date().toISOString(),
      totalScreenings: 0
    };
    setPatients(prev => [newPatient, ...prev]);
    addAuditLog('PATIENT_CREATED', 'PATIENT', newPatient.id, `Created patient ${newPatient.firstName} ${newPatient.lastName} (${newPatient.patientCode})`);
    return newPatient;
  };

  const getPatient = (id: string) => patients.find(p => p.id === id);

  const getScreening = (id: string) => screenings.find(s => s.id === id);

  const createScreening = (patientId: string): ScreeningEncounter => {
    const patient = getPatient(patientId);
    if (!patient) throw new Error('Patient not found');

    const newEncounter: ScreeningEncounter = {
      id: `enc_${Date.now()}`,
      encounterCode: `ENC-2026-${Math.floor(4000 + Math.random() * 5000)}`,
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      patientAge: patient.age,
      patientGender: patient.gender,
      patientDistrict: patient.district,
      phcCenter: patient.phcCenter,
      screenerId: currentUser.id,
      screenerName: currentUser.fullName,
      status: 'PENDING_CAPTURE',
      referableDR: false,
      urgentReferral: false,
      dmeRisk: false,
      createdAt: new Date().toISOString()
    };

    setScreenings(prev => [newEncounter, ...prev]);
    addAuditLog('AI_INFERENCE_TRIGGERED', 'ENCOUNTER', newEncounter.id, `Initialized screening encounter ${newEncounter.encounterCode} for patient ${patient.patientCode}`);
    return newEncounter;
  };

  const updateScreeningImages = (
    encounterId: string,
    imageOD?: RetinalImageMetadata,
    imageOS?: RetinalImageMetadata
  ) => {
    setScreenings(prev =>
      prev.map(s => {
        if (s.id !== encounterId) return s;
        return {
          ...s,
          imageOD: imageOD || s.imageOD,
          imageOS: imageOS || s.imageOS,
          status: 'PENDING_CAPTURE'
        };
      })
    );
  };

  const runInferenceForEncounter = async (encounterId: string): Promise<ScreeningEncounter> => {
    const encounter = getScreening(encounterId);
    if (!encounter) throw new Error('Encounter not found');

    // Simulate async pipeline stages
    await new Promise(resolve => setTimeout(resolve, 800));

    // Generate realistic simulated results
    const gradeOD: DRGrade = (Math.floor(Math.random() * 4) as DRGrade);
    const gradeOS: DRGrade = Math.max(0, gradeOD - (Math.random() > 0.5 ? 1 : 0)) as DRGrade;
    const highestGrade = Math.max(gradeOD, gradeOS) as DRGrade;
    const referable = highestGrade >= 2;
    const urgent = highestGrade >= 3;
    const dme = highestGrade >= 2 && Math.random() > 0.4;

    const inferenceOD: InferenceResult = {
      id: `inf_od_${Date.now()}`,
      imageId: encounter.imageOD?.id || 'img_od_temp',
      eye: 'OD',
      isDemoMode: true,
      modelVersion: 'Drishti-Retina-v2.4-DemoEngine',
      inferenceTimeMs: 385,
      icdrGrade: gradeOD,
      icdrLabel: getGradeLabel(gradeOD),
      confidence: Math.round(85 + Math.random() * 12),
      probabilities: getProbabilitiesForGrade(gradeOD),
      referableDR: gradeOD >= 2,
      urgentReferral: gradeOD >= 3,
      dmeRisk: dme,
      dmeConfidence: dme ? 88.5 : 12.0,
      vesselDensity: 0.142 + (gradeOD * 0.005),
      vesselTortuosity: 1.15 + (gradeOD * 0.08),
      avRatio: 0.72 - (gradeOD * 0.04),
      lesions: {
        microaneurysms: gradeOD === 0 ? 0 : gradeOD === 1 ? 8 : gradeOD === 2 ? 24 : 52,
        hemorrhages: gradeOD <= 1 ? 0 : gradeOD === 2 ? 10 : 28,
        hardExudates: dme ? 32 : gradeOD >= 2 ? 12 : 0,
        cottonWoolSpots: gradeOD >= 3 ? 4 : 0,
        neovascularizationPresent: gradeOD === 4
      },
      createdAt: new Date().toISOString()
    };

    const inferenceOS: InferenceResult = {
      id: `inf_os_${Date.now()}`,
      imageId: encounter.imageOS?.id || 'img_os_temp',
      eye: 'OS',
      isDemoMode: true,
      modelVersion: 'Drishti-Retina-v2.4-DemoEngine',
      inferenceTimeMs: 360,
      icdrGrade: gradeOS,
      icdrLabel: getGradeLabel(gradeOS),
      confidence: Math.round(86 + Math.random() * 11),
      probabilities: getProbabilitiesForGrade(gradeOS),
      referableDR: gradeOS >= 2,
      urgentReferral: gradeOS >= 3,
      dmeRisk: false,
      dmeConfidence: 8.5,
      vesselDensity: 0.146,
      vesselTortuosity: 1.18,
      avRatio: 0.70,
      lesions: {
        microaneurysms: gradeOS === 0 ? 0 : gradeOS === 1 ? 4 : 14,
        hemorrhages: gradeOS >= 2 ? 6 : 0,
        hardExudates: 0,
        cottonWoolSpots: 0,
        neovascularizationPresent: false
      },
      createdAt: new Date().toISOString()
    };

    const updated: ScreeningEncounter = {
      ...encounter,
      status: 'AI_COMPLETED',
      inferenceOD,
      inferenceOS,
      highestGrade,
      referableDR: referable,
      urgentReferral: urgent,
      dmeRisk: dme,
      completedAt: new Date().toISOString()
    };

    setScreenings(prev => prev.map(s => (s.id === encounterId ? updated : s)));
    addAuditLog('AI_INFERENCE_TRIGGERED', 'ENCOUNTER', encounterId, `AI bilateral inference completed. Grade: ${getGradeLabel(highestGrade)} (${highestGrade}). DME: ${dme ? 'Yes' : 'No'}.`);

    return updated;
  };

  const submitDoctorReview = (
    encounterId: string,
    reviewData: Omit<DoctorReview, 'id' | 'reviewedAt' | 'digitalSignatureHash'>
  ) => {
    const fullReview: DoctorReview = {
      ...reviewData,
      id: `rev_${Date.now()}`,
      reviewedAt: new Date().toISOString(),
      digitalSignatureHash: `SHA256:${Math.random().toString(16).substr(2, 32)}`
    };

    setScreenings(prev =>
      prev.map(s => {
        if (s.id !== encounterId) return s;
        return {
          ...s,
          status: 'FINALIZED',
          review: fullReview
        };
      })
    );

    addAuditLog('DOCTOR_REVIEW_SUBMITTED', 'ENCOUNTER', encounterId, `Clinical sign-off submitted by ${reviewData.doctor.name}. Action: ${reviewData.recommendedAction}`);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUserRole,
        patients,
        addPatient,
        getPatient,
        screenings,
        getScreening,
        createScreening,
        updateScreeningImages,
        runInferenceForEncounter,
        submitDoctorReview,
        isDemoMode,
        setIsDemoMode,
        auditLogs,
        addAuditLog,
        isOnline,
        setIsOnline,
        pendingSyncCount,
        simulationParams,
        setSimulationParams,
        simulationOutput
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

function getGradeLabel(grade: DRGrade) {
  switch (grade) {
    case 0: return 'No Apparent DR';
    case 1: return 'Mild NPDR';
    case 2: return 'Moderate NPDR';
    case 3: return 'Severe NPDR';
    case 4: return 'Proliferative DR (PDR)';
  }
}

function getProbabilitiesForGrade(grade: DRGrade): { [g in DRGrade]: number } {
  const probs = { 0: 0.02, 1: 0.03, 2: 0.05, 3: 0.05, 4: 0.05 };
  probs[grade] = 0.85;
  return probs;
}
