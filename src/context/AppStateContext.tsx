import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Patient, Appointment, UserRole, DRLevel, ReferralPriority, AuditTrailItem } from '../lib/types';
import { DEMO_PATIENTS, INITIAL_APPOINTMENTS } from '../lib/demoData';
import type { DemoPresetKey } from '../services/demoApi';

export interface UserSession {
  name: string;
  district: string;
  role: UserRole;
}

interface AppStateContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  currentUser: UserSession;
  login: (name: string, district: string, role: UserRole) => void;
  logout: () => void;
  isRuralMode: boolean;
  setIsRuralMode: (val: boolean) => void;
  networkStatus: 'fast' | 'weak' | 'offline';
  setNetworkStatus: (status: 'fast' | 'weak' | 'offline') => void;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  mlConnected: boolean;
  setMlConnected: (val: boolean) => void;
  patients: Patient[];
  activePatientId: string;
  setActivePatientId: (id: string) => void;
  appointments: Appointment[];
  currentDemoPreset: DemoPresetKey;
  setCurrentDemoPreset: (preset: DemoPresetKey) => void;
  addPatientScreening: (newPatient: Patient) => void;
  updateDoctorReview: (
    patientId: string,
    action: 'confirm' | 'modify' | 'recapture' | 'refer',
    data: {
      modifiedLevel?: DRLevel;
      notes?: string;
      reviewerName?: string;
      referralPriority?: ReferralPriority;
      referralCenter?: string;
    }
  ) => void;
  scheduleAppointment: (appointment: Omit<Appointment, 'id'>) => string;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('netrarakshaq_auth') === 'true';
  });

  const [currentUser, setCurrentUser] = useState<UserSession>(() => {
    const saved = sessionStorage.getItem('netrarakshaq_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      name: 'Priya Sharma / प्रिया शर्मा',
      district: 'Pune District / पुणे',
      role: 'health_worker',
    };
  });

  const [userRole, setUserRole] = useState<UserRole>(() => {
    const saved = sessionStorage.getItem('netrarakshaq_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.role) return parsed.role;
      } catch {}
    }
    return 'health_worker';
  });

  const [isRuralMode, setIsRuralMode] = useState<boolean>(false);
  const [networkStatus, setNetworkStatus] = useState<'fast' | 'weak' | 'offline'>('fast');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [mlConnected, setMlConnected] = useState<boolean>(false);
  const [patients, setPatients] = useState<Patient[]>(DEMO_PATIENTS);
  const [activePatientId, setActivePatientId] = useState<string>(DEMO_PATIENTS[0].id);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [currentDemoPreset, setCurrentDemoPreset] = useState<DemoPresetKey>('moderate_npdr');

  function login(name: string, district: string, role: UserRole) {
    setIsAuthenticated(true);
    setUserRole(role);
    const session: UserSession = { name, district, role };
    setCurrentUser(session);
    sessionStorage.setItem('netrarakshaq_auth', 'true');
    sessionStorage.setItem('netrarakshaq_user', JSON.stringify(session));
  }

  function logout() {
    setIsAuthenticated(false);
    sessionStorage.removeItem('netrarakshaq_auth');
    sessionStorage.removeItem('netrarakshaq_user');
  }

  // Sync rural mode with network status
  useEffect(() => {
    if (isRuralMode && networkStatus === 'fast') {
      setNetworkStatus('weak');
    }
  }, [isRuralMode]);

  function addPatientScreening(newPatient: Patient) {
    setPatients(prev => [newPatient, ...prev]);
    setActivePatientId(newPatient.id);
  }

  function updateDoctorReview(
    patientId: string,
    action: 'confirm' | 'modify' | 'recapture' | 'refer',
    data: {
      modifiedLevel?: DRLevel;
      notes?: string;
      reviewerName?: string;
      referralPriority?: ReferralPriority;
      referralCenter?: string;
    }
  ) {
    setPatients(prev =>
      prev.map(p => {
        if (p.id !== patientId) return p;

        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const timeStr = now.toTimeString().slice(0, 5);
        const reviewer = data.reviewerName || 'Dr. A. Sharma (Ophthalmologist)';

        let newReviewStatus = p.reviewStatus;
        let newDRLevel = p.drLevel;
        let newDRLabel = p.drLabel;
        let newReferable = p.referable;

        const auditItem: AuditTrailItem = {
          id: `AT-${Date.now()}`,
          timestamp: `${dateStr} ${timeStr}`,
          action: 'confirmed',
          actor: reviewer,
          actorRole: 'doctor',
          details: '',
          notes: data.notes,
        };

        if (action === 'confirm') {
          newReviewStatus = 'reviewed';
          auditItem.action = 'confirmed';
          auditItem.details = `Doctor confirmed AI assessment: Level ${p.drLevel} (${p.drLabel}).`;
        } else if (action === 'modify' && data.modifiedLevel !== undefined) {
          newReviewStatus = 'reviewed';
          newDRLevel = data.modifiedLevel;
          const labels: Record<DRLevel, string> = {
            0: 'No DR',
            1: 'Mild NPDR',
            2: 'Moderate NPDR',
            3: 'Severe NPDR',
            4: 'Proliferative DR',
          };
          newDRLabel = labels[data.modifiedLevel];
          newReferable = data.modifiedLevel >= 2;
          auditItem.action = 'modified';
          auditItem.details = `Doctor modified DR severity from Level ${p.drLevel} to Level ${data.modifiedLevel} (${newDRLabel}).`;
        } else if (action === 'recapture') {
          newReviewStatus = 'recapture';
          auditItem.action = 'recapture_requested';
          auditItem.details = `Doctor requested field recapture. Reason: ${data.notes || 'Sub-optimal image quality / obscured fovea'}.`;
        } else if (action === 'refer') {
          newReviewStatus = 'referred';
          auditItem.action = 'referred';
          auditItem.details = `Specialist referral initiated. Priority: ${data.referralPriority || 'high'}. Center: ${data.referralCenter || 'District Hospital'}.`;
        }

        const updatedReferral = data.referralCenter
          ? {
              required: true,
              priority: data.referralPriority || 'high',
              center: data.referralCenter,
              appointmentDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
              appointmentTime: '10:00 AM',
              reason: data.notes || `Referral for DR Level ${newDRLevel}`,
              confirmedAt: `${dateStr} ${timeStr}`,
              confirmedBy: reviewer,
            }
          : p.referral;

        return {
          ...p,
          reviewStatus: newReviewStatus,
          drLevel: newDRLevel,
          drLabel: newDRLabel,
          referable: newReferable,
          doctorModifiedLevel: action === 'modify' ? data.modifiedLevel : undefined,
          reviewedBy: reviewer,
          reviewedAt: `${dateStr} ${timeStr}`,
          reviewNotes: data.notes || p.reviewNotes,
          referral: updatedReferral,
          auditTrail: [...(p.auditTrail || []), auditItem],
        };
      })
    );
  }

  function scheduleAppointment(apptData: Omit<Appointment, 'id'>): string {
    const newId = `APT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newAppt: Appointment = {
      ...apptData,
      id: newId,
    };
    setAppointments(prev => [newAppt, ...prev]);
    return newId;
  }

  return (
    <AppStateContext.Provider
      value={{
        userRole,
        setUserRole,
        isAuthenticated,
        currentUser,
        login,
        logout,
        isRuralMode,
        setIsRuralMode,
        networkStatus,
        setNetworkStatus,
        isDemoMode,
        setIsDemoMode,
        mlConnected,
        setMlConnected,
        patients,
        activePatientId,
        setActivePatientId,
        appointments,
        currentDemoPreset,
        setCurrentDemoPreset,
        addPatientScreening,
        updateDoctorReview,
        scheduleAppointment,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}
