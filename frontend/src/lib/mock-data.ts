import {
  Patient,
  ScreeningEncounter,
  User,
  DistrictMetric,
  ModelRegistryItem,
  AuditLogItem,
  CapacitySimulationParams,
  CapacitySimulationOutput,
  DRGrade
} from './types';

export const CURRENT_USER_SCREENER: User = {
  id: 'usr_scr_01',
  email: 'priya.sharma@nhm.gov.in',
  fullName: 'Priya Sharma (ASHA/CHO)',
  role: 'SCREENER',
  facilityName: 'Sultanpur Primary Health Centre (PHC)',
  district: 'Varanasi',
  avatarUrl: 'https://images.unsplash.com/photo-1594824813598-a28941f71dfb?w=120&auto=format&fit=crop&q=60'
};

export const CURRENT_USER_DOCTOR: User = {
  id: 'usr_doc_01',
  email: 'dr.anand.mehta@drishti-teleophth.org',
  fullName: 'Dr. Anand Mehta, MS (Ophthalmology)',
  role: 'OPHTHALMOLOGIST',
  facilityName: 'District Apex Eye Hospital & Tele-DR Command Center',
  district: 'Varanasi',
  medicalLicenseNumber: 'MCI-UP-2014-98441',
  avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&auto=format&fit=crop&q=60'
};

export const CURRENT_USER_ADMIN: User = {
  id: 'usr_adm_01',
  email: 'admin.drishti@health.gov.in',
  fullName: 'Rajiv Sengupta (State Health Mission Admin)',
  role: 'ADMIN',
  facilityName: 'State Directorate of Health Services',
  district: 'State HQ',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=60'
};

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pat_001',
    patientCode: 'DRP-2026-0812',
    abhaId: '91-4402-8819-2041',
    firstName: 'Rameshwar',
    lastName: 'Prasad',
    age: 58,
    gender: 'MALE',
    phone: '+91 98391 24102',
    district: 'Varanasi',
    phcCenter: 'Sultanpur PHC',
    diabetesDurationYears: 12,
    diabetesType: 'TYPE_2',
    lastHba1c: 9.4,
    hypertension: true,
    smokingStatus: 'FORMER',
    visualAcuityOD: '6/12',
    visualAcuityOS: '6/18',
    registeredAt: '2026-06-10T10:15:00Z',
    lastScreeningDate: '2026-08-30T11:20:00Z',
    totalScreenings: 3,
    highestRiskGrade: 3
  },
  {
    id: 'pat_002',
    patientCode: 'DRP-2026-0813',
    abhaId: '91-1182-9930-1099',
    firstName: 'Sunita',
    lastName: 'Devi',
    age: 49,
    gender: 'FEMALE',
    phone: '+91 94152 77810',
    district: 'Varanasi',
    phcCenter: 'Chiraigaon PHC',
    diabetesDurationYears: 6,
    diabetesType: 'TYPE_2',
    lastHba1c: 7.6,
    hypertension: false,
    smokingStatus: 'NEVER',
    visualAcuityOD: '6/6',
    visualAcuityOS: '6/6',
    registeredAt: '2026-07-02T09:00:00Z',
    lastScreeningDate: '2026-08-31T09:45:00Z',
    totalScreenings: 1,
    highestRiskGrade: 1
  },
  {
    id: 'pat_003',
    patientCode: 'DRP-2026-0814',
    abhaId: '91-8833-2104-5541',
    firstName: 'Mohammad',
    lastName: 'Irfan',
    age: 64,
    gender: 'MALE',
    phone: '+91 97920 44319',
    district: 'Chandauli',
    phcCenter: 'Mughalsarai CHC',
    diabetesDurationYears: 18,
    diabetesType: 'TYPE_2',
    lastHba1c: 10.8,
    hypertension: true,
    smokingStatus: 'CURRENT',
    visualAcuityOD: '6/36',
    visualAcuityOS: '6/24',
    registeredAt: '2026-05-18T14:30:00Z',
    lastScreeningDate: '2026-08-31T10:10:00Z',
    totalScreenings: 4,
    highestRiskGrade: 4
  },
  {
    id: 'pat_004',
    patientCode: 'DRP-2026-0815',
    abhaId: '91-5541-7729-3301',
    firstName: 'Kanti',
    lastName: 'Gupta',
    age: 52,
    gender: 'FEMALE',
    phone: '+91 91400 66521',
    district: 'Mirzapur',
    phcCenter: 'Chunar PHC',
    diabetesDurationYears: 4,
    diabetesType: 'TYPE_2',
    lastHba1c: 6.8,
    hypertension: false,
    smokingStatus: 'NEVER',
    visualAcuityOD: '6/6',
    visualAcuityOS: '6/9',
    registeredAt: '2026-08-20T11:00:00Z',
    lastScreeningDate: '2026-08-31T11:00:00Z',
    totalScreenings: 1,
    highestRiskGrade: 0
  },
  {
    id: 'pat_005',
    patientCode: 'DRP-2026-0816',
    abhaId: '91-3329-8812-7744',
    firstName: 'Harish',
    lastName: 'Chandra',
    age: 61,
    gender: 'MALE',
    phone: '+91 98899 11029',
    district: 'Jaunpur',
    phcCenter: 'Badlapur CHC',
    diabetesDurationYears: 14,
    diabetesType: 'TYPE_2',
    lastHba1c: 8.9,
    hypertension: true,
    smokingStatus: 'FORMER',
    visualAcuityOD: '6/18',
    visualAcuityOS: '6/18',
    registeredAt: '2026-07-15T15:20:00Z',
    lastScreeningDate: '2026-08-31T11:30:00Z',
    totalScreenings: 2,
    highestRiskGrade: 2
  }
];

export const INITIAL_SCREENINGS: ScreeningEncounter[] = [
  {
    id: 'enc_4401',
    encounterCode: 'ENC-2026-4401',
    patientId: 'pat_001',
    patientName: 'Rameshwar Prasad',
    patientAge: 58,
    patientGender: 'MALE',
    patientDistrict: 'Varanasi',
    phcCenter: 'Sultanpur PHC',
    screenerId: 'usr_scr_01',
    screenerName: 'Priya Sharma (CHO)',
    status: 'AI_COMPLETED',
    highestGrade: 3,
    referableDR: true,
    urgentReferral: true,
    dmeRisk: true,
    createdAt: '2026-08-31T09:15:00Z',
    imageOD: {
      id: 'img_od_001',
      eye: 'OD',
      field: 'MACULA_CENTERED',
      url: '/samples/fundus_od_01.png',
      thumbnailUrl: '/samples/fundus_od_01.png',
      capturedAt: '2026-08-31T09:16:12Z',
      cameraModel: 'Remidio NM-FOP 10.1 Handheld',
      width: 2048,
      height: 2048,
      quality: {
        grade: 'GOOD',
        score: 94,
        artifacts: {
          motionBlur: 0.04,
          unevenIllumination: 0.08,
          cataractHaze: 0.12,
          eyelashOcclusion: 0.0,
          discCenteredCorrectly: true
        },
        feedbackMessage: 'Clear macula and vascular arcades with optimal contrast.'
      }
    },
    imageOS: {
      id: 'img_os_001',
      eye: 'OS',
      field: 'MACULA_CENTERED',
      url: '/samples/fundus_os_01.png',
      thumbnailUrl: '/samples/fundus_os_01.png',
      capturedAt: '2026-08-31T09:17:45Z',
      cameraModel: 'Remidio NM-FOP 10.1 Handheld',
      width: 2048,
      height: 2048,
      quality: {
        grade: 'GOOD',
        score: 91,
        artifacts: {
          motionBlur: 0.06,
          unevenIllumination: 0.1,
          cataractHaze: 0.15,
          eyelashOcclusion: 0.02,
          discCenteredCorrectly: true
        },
        feedbackMessage: 'Adequate field illumination, minor nasal artifact.'
      }
    },
    inferenceOD: {
      id: 'inf_od_001',
      imageId: 'img_od_001',
      eye: 'OD',
      isDemoMode: true,
      modelVersion: 'Drishti-Retina-v2.4-DemoEngine',
      inferenceTimeMs: 382,
      icdrGrade: 3,
      icdrLabel: 'Severe NPDR',
      confidence: 91.8,
      probabilities: { 0: 0.01, 1: 0.03, 2: 0.12, 3: 0.76, 4: 0.08 },
      referableDR: true,
      urgentReferral: true,
      dmeRisk: true,
      dmeConfidence: 87.4,
      vesselDensity: 0.138,
      vesselTortuosity: 1.34,
      avRatio: 0.62,
      lesions: {
        microaneurysms: 48,
        hemorrhages: 24,
        hardExudates: 28,
        cottonWoolSpots: 4,
        neovascularizationPresent: false
      },
      createdAt: '2026-08-31T09:18:20Z'
    },
    inferenceOS: {
      id: 'inf_os_001',
      imageId: 'img_os_001',
      eye: 'OS',
      isDemoMode: true,
      modelVersion: 'Drishti-Retina-v2.4-DemoEngine',
      inferenceTimeMs: 365,
      icdrGrade: 2,
      icdrLabel: 'Moderate NPDR',
      confidence: 86.2,
      probabilities: { 0: 0.02, 1: 0.14, 2: 0.74, 3: 0.08, 4: 0.02 },
      referableDR: true,
      urgentReferral: false,
      dmeRisk: false,
      dmeConfidence: 22.1,
      vesselDensity: 0.146,
      vesselTortuosity: 1.22,
      avRatio: 0.68,
      lesions: {
        microaneurysms: 22,
        hemorrhages: 8,
        hardExudates: 6,
        cottonWoolSpots: 0,
        neovascularizationPresent: false
      },
      createdAt: '2026-08-31T09:18:22Z'
    }
  },
  {
    id: 'enc_4402',
    encounterCode: 'ENC-2026-4402',
    patientId: 'pat_003',
    patientName: 'Mohammad Irfan',
    patientAge: 64,
    patientGender: 'MALE',
    patientDistrict: 'Chandauli',
    phcCenter: 'Mughalsarai CHC',
    screenerId: 'usr_scr_01',
    screenerName: 'Priya Sharma (CHO)',
    status: 'UNDER_REVIEW',
    highestGrade: 4,
    referableDR: true,
    urgentReferral: true,
    dmeRisk: true,
    createdAt: '2026-08-31T10:10:00Z',
    imageOD: {
      id: 'img_od_002',
      eye: 'OD',
      field: 'MACULA_CENTERED',
      url: '/samples/fundus_od_02.png',
      thumbnailUrl: '/samples/fundus_od_02.png',
      capturedAt: '2026-08-31T10:11:15Z',
      cameraModel: 'Remidio NM-FOP 10.1 Handheld',
      width: 2048,
      height: 2048,
      quality: {
        grade: 'GOOD',
        score: 89,
        artifacts: {
          motionBlur: 0.08,
          unevenIllumination: 0.11,
          cataractHaze: 0.22,
          eyelashOcclusion: 0.0,
          discCenteredCorrectly: true
        },
        feedbackMessage: 'Mild lens haze present; adequate for deep retinal grading.'
      }
    },
    imageOS: {
      id: 'img_os_002',
      eye: 'OS',
      field: 'MACULA_CENTERED',
      url: '/samples/fundus_os_02.png',
      thumbnailUrl: '/samples/fundus_os_02.png',
      capturedAt: '2026-08-31T10:12:40Z',
      cameraModel: 'Remidio NM-FOP 10.1 Handheld',
      width: 2048,
      height: 2048,
      quality: {
        grade: 'GOOD',
        score: 93,
        artifacts: {
          motionBlur: 0.03,
          unevenIllumination: 0.07,
          cataractHaze: 0.18,
          eyelashOcclusion: 0.0,
          discCenteredCorrectly: true
        },
        feedbackMessage: 'High quality fundus image with visible disc neovascularization.'
      }
    },
    inferenceOD: {
      id: 'inf_od_002',
      imageId: 'img_od_002',
      eye: 'OD',
      isDemoMode: true,
      modelVersion: 'Drishti-Retina-v2.4-DemoEngine',
      inferenceTimeMs: 412,
      icdrGrade: 4,
      icdrLabel: 'Proliferative DR (PDR)',
      confidence: 95.6,
      probabilities: { 0: 0.0, 1: 0.01, 2: 0.03, 3: 0.12, 4: 0.84 },
      referableDR: true,
      urgentReferral: true,
      dmeRisk: true,
      dmeConfidence: 91.2,
      vesselDensity: 0.162,
      vesselTortuosity: 1.52,
      avRatio: 0.54,
      lesions: {
        microaneurysms: 82,
        hemorrhages: 41,
        hardExudates: 38,
        cottonWoolSpots: 7,
        neovascularizationPresent: true
      },
      createdAt: '2026-08-31T10:13:20Z'
    },
    inferenceOS: {
      id: 'inf_os_002',
      imageId: 'img_os_002',
      eye: 'OS',
      isDemoMode: true,
      modelVersion: 'Drishti-Retina-v2.4-DemoEngine',
      inferenceTimeMs: 390,
      icdrGrade: 4,
      icdrLabel: 'Proliferative DR (PDR)',
      confidence: 92.4,
      probabilities: { 0: 0.0, 1: 0.02, 2: 0.05, 3: 0.18, 4: 0.75 },
      referableDR: true,
      urgentReferral: true,
      dmeRisk: true,
      dmeConfidence: 88.0,
      vesselDensity: 0.158,
      vesselTortuosity: 1.48,
      avRatio: 0.57,
      lesions: {
        microaneurysms: 70,
        hemorrhages: 35,
        hardExudates: 30,
        cottonWoolSpots: 5,
        neovascularizationPresent: true
      },
      createdAt: '2026-08-31T10:13:22Z'
    }
  },
  {
    id: 'enc_4403',
    encounterCode: 'ENC-2026-4403',
    patientId: 'pat_002',
    patientName: 'Sunita Devi',
    patientAge: 49,
    patientGender: 'FEMALE',
    patientDistrict: 'Varanasi',
    phcCenter: 'Chiraigaon PHC',
    screenerId: 'usr_scr_01',
    screenerName: 'Priya Sharma (CHO)',
    status: 'FINALIZED',
    highestGrade: 1,
    referableDR: false,
    urgentReferral: false,
    dmeRisk: false,
    createdAt: '2026-08-31T09:45:00Z',
    completedAt: '2026-08-31T10:05:00Z',
    review: {
      id: 'rev_003',
      encounterId: 'enc_4403',
      doctor: {
        id: 'usr_doc_01',
        name: 'Dr. Anand Mehta, MS',
        licenseNumber: 'MCI-UP-2014-98441',
        institution: 'District Apex Tele-Ophthalmology Center'
      },
      finalGradeOD: 1,
      finalGradeOS: 0,
      finalDmeOD: false,
      finalDmeOS: false,
      agreedWithAI: true,
      clinicalNotes: 'Confirmed isolated microaneurysms in Right Eye temporal quadrant. Left Eye within normal limits. Blood sugar control counseling given.',
      recommendedAction: 'FOLLOW_UP_6_MONTHS',
      followUpTimeline: '6_MONTHS',
      digitalSignatureHash: 'SHA256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      reviewedAt: '2026-08-31T10:05:00Z'
    },
    inferenceOD: {
      id: 'inf_od_003',
      imageId: 'img_od_003',
      eye: 'OD',
      isDemoMode: true,
      modelVersion: 'Drishti-Retina-v2.4-DemoEngine',
      inferenceTimeMs: 340,
      icdrGrade: 1,
      icdrLabel: 'Mild NPDR',
      confidence: 88.5,
      probabilities: { 0: 0.18, 1: 0.74, 2: 0.06, 3: 0.01, 4: 0.01 },
      referableDR: false,
      urgentReferral: false,
      dmeRisk: false,
      dmeConfidence: 4.2,
      vesselDensity: 0.152,
      vesselTortuosity: 1.15,
      avRatio: 0.72,
      lesions: {
        microaneurysms: 6,
        hemorrhages: 0,
        hardExudates: 0,
        cottonWoolSpots: 0,
        neovascularizationPresent: false
      },
      createdAt: '2026-08-31T09:47:00Z'
    },
    inferenceOS: {
      id: 'inf_os_003',
      imageId: 'img_os_003',
      eye: 'OS',
      isDemoMode: true,
      modelVersion: 'Drishti-Retina-v2.4-DemoEngine',
      inferenceTimeMs: 330,
      icdrGrade: 0,
      icdrLabel: 'No Apparent DR',
      confidence: 94.1,
      probabilities: { 0: 0.94, 1: 0.05, 2: 0.01, 3: 0.0, 4: 0.0 },
      referableDR: false,
      urgentReferral: false,
      dmeRisk: false,
      dmeConfidence: 1.5,
      vesselDensity: 0.155,
      vesselTortuosity: 1.12,
      avRatio: 0.74,
      lesions: {
        microaneurysms: 0,
        hemorrhages: 0,
        hardExudates: 0,
        cottonWoolSpots: 0,
        neovascularizationPresent: false
      },
      createdAt: '2026-08-31T09:47:02Z'
    }
  },
  {
    id: 'enc_4404',
    encounterCode: 'ENC-2026-4404',
    patientId: 'pat_004',
    patientName: 'Kanti Gupta',
    patientAge: 52,
    patientGender: 'FEMALE',
    patientDistrict: 'Mirzapur',
    phcCenter: 'Chunar PHC',
    screenerId: 'usr_scr_01',
    screenerName: 'Priya Sharma (CHO)',
    status: 'FINALIZED',
    highestGrade: 0,
    referableDR: false,
    urgentReferral: false,
    dmeRisk: false,
    createdAt: '2026-08-31T11:00:00Z',
    completedAt: '2026-08-31T11:15:00Z',
    inferenceOD: {
      id: 'inf_od_004',
      imageId: 'img_od_004',
      eye: 'OD',
      isDemoMode: true,
      modelVersion: 'Drishti-Retina-v2.4-DemoEngine',
      inferenceTimeMs: 310,
      icdrGrade: 0,
      icdrLabel: 'No Apparent DR',
      confidence: 97.2,
      probabilities: { 0: 0.97, 1: 0.02, 2: 0.01, 3: 0.0, 4: 0.0 },
      referableDR: false,
      urgentReferral: false,
      dmeRisk: false,
      dmeConfidence: 0.8,
      vesselDensity: 0.158,
      vesselTortuosity: 1.1,
      avRatio: 0.75,
      lesions: {
        microaneurysms: 0,
        hemorrhages: 0,
        hardExudates: 0,
        cottonWoolSpots: 0,
        neovascularizationPresent: false
      },
      createdAt: '2026-08-31T11:02:00Z'
    }
  }
];

export const DISTRICT_ANALYTICS_DATA: DistrictMetric[] = [
  {
    districtName: 'Varanasi',
    totalScreened: 14820,
    diabeticPopulation: 82000,
    coveragePercentage: 18.1,
    referralCount: 2940,
    urgentReferralCount: 680,
    gradeDistribution: { 0: 9240, 1: 2640, 2: 1820, 3: 780, 4: 340 },
    dmeCount: 840,
    avgTurnaroundHours: 3.4,
    activePhcs: 28
  },
  {
    districtName: 'Chandauli',
    totalScreened: 8450,
    diabeticPopulation: 54000,
    coveragePercentage: 15.6,
    referralCount: 1860,
    urgentReferralCount: 490,
    gradeDistribution: { 0: 5120, 1: 1470, 2: 1180, 3: 450, 4: 230 },
    dmeCount: 520,
    avgTurnaroundHours: 4.8,
    activePhcs: 16
  },
  {
    districtName: 'Mirzapur',
    totalScreened: 11200,
    diabeticPopulation: 68000,
    coveragePercentage: 16.5,
    referralCount: 2210,
    urgentReferralCount: 510,
    gradeDistribution: { 0: 7100, 1: 1890, 2: 1410, 3: 560, 4: 240 },
    dmeCount: 610,
    avgTurnaroundHours: 3.9,
    activePhcs: 22
  },
  {
    districtName: 'Jaunpur',
    totalScreened: 16900,
    diabeticPopulation: 98000,
    coveragePercentage: 17.2,
    referralCount: 3510,
    urgentReferralCount: 830,
    gradeDistribution: { 0: 10450, 1: 2940, 2: 2280, 3: 840, 4: 390 },
    dmeCount: 990,
    avgTurnaroundHours: 4.2,
    activePhcs: 34
  },
  {
    districtName: 'Ghazipur',
    totalScreened: 9600,
    diabeticPopulation: 62000,
    coveragePercentage: 15.5,
    referralCount: 2040,
    urgentReferralCount: 470,
    gradeDistribution: { 0: 5980, 1: 1580, 2: 1320, 3: 510, 4: 210 },
    dmeCount: 540,
    avgTurnaroundHours: 5.1,
    activePhcs: 19
  }
];

export const INITIAL_SIMULATION_PARAMS: CapacitySimulationParams = {
  targetPopulation: 100000,
  prevalenceRate: 0.18, // 18% diabetic prevalence
  fundusCameras: 12,
  screenersPerFacility: 2,
  screeningHoursPerDay: 6,
  minutesPerScreening: 15,
  aiSpecificityCutoff: 0.93,
  aiSensitivityCutoff: 0.96,
  teleOphthalmologists: 4,
  reviewMinutesPerCase: 4
};

export function calculateSimulation(params: CapacitySimulationParams): CapacitySimulationOutput {
  const diabeticCohort = params.targetPopulation * params.prevalenceRate; // 18,000 diabetics
  const screensPerHourPerCamera = 60 / params.minutesPerScreening; // 4
  const dailyScreeningCapacity = Math.round(params.fundusCameras * params.screeningHoursPerDay * screensPerHourPerCamera); // 12 * 6 * 4 = 288 / day
  const monthlyPatientsScreened = dailyScreeningCapacity * 24; // 6,912 / month
  const annualScreens = dailyScreeningCapacity * 280; // 80,640
  const annualCoveragePercent = Math.min(100, Math.round((annualScreens / diabeticCohort) * 100));

  // DR epidemiology
  const sightThreateningPrevalence = 0.055; // 5.5% have severe/PDR/DME
  const allDRPrevalence = 0.22; // 22% of diabetics have some DR

  const annualDiabeticsScreened = Math.min(diabeticCohort, annualScreens);
  const actualSightThreateningCases = annualDiabeticsScreened * sightThreateningPrevalence;
  const actualAllDRCases = annualDiabeticsScreened * allDRPrevalence;
  const normalCases = annualDiabeticsScreened * (1 - allDRPrevalence);

  // AI Triaging: Only AI positive cases sent to Doctor
  const truePositivesSent = actualAllDRCases * params.aiSensitivityCutoff;
  const falsePositivesSent = normalCases * (1 - params.aiSpecificityCutoff);
  const totalCasesToDoctorDaily = (truePositivesSent + falsePositivesSent) / 280;

  const totalDoctorMinutesRequiredDaily = totalCasesToDoctorDaily * params.reviewMinutesPerCase;
  const dailyDoctorReviewWorkloadHours = Math.round((totalDoctorMinutesRequiredDaily / 60) * 10) / 10;

  const dailyDoctorCapacityHours = params.teleOphthalmologists * 5; // 5 hours review per doc
  const estimatedBacklogDays = Math.max(0, Math.round((dailyDoctorReviewWorkloadHours / dailyDoctorCapacityHours - 1) * 30));

  const projectedTruePositivesDetected = Math.round(truePositivesSent);
  const projectedFalseNegativesMissed = Math.round(actualAllDRCases * (1 - params.aiSensitivityCutoff));
  const projectedSightThreateningAverted = Math.round(actualSightThreateningCases * params.aiSensitivityCutoff * 0.88);

  const capitalCost = params.fundusCameras * 450000; // INR 4.5L per portable camera
  const operationalCostAnnual = (params.fundusCameras * params.screenersPerFacility * 240000) + (params.teleOphthalmologists * 720000) + 500000;
  const totalAnnualCostINR = capitalCost + operationalCostAnnual;
  const costPerPatientScreenedINR = Math.round(totalAnnualCostINR / annualDiabeticsScreened);
  const costPerSightThreateningDetectedINR = Math.round(totalAnnualCostINR / Math.max(1, projectedSightThreateningAverted));

  const recommendations = [];
  if (estimatedBacklogDays > 7) {
    recommendations.push(`Tele-ophthalmology capacity bottleneck: Consider increasing review specialists from ${params.teleOphthalmologists} to ${Math.ceil(dailyDoctorReviewWorkloadHours / 4)}.`);
  } else {
    recommendations.push(`Tele-review queue is balanced. Average case turnaround < 4 hours.`);
  }
  if (annualCoveragePercent < 60) {
    recommendations.push(`To reach 80%+ district coverage within 12 months, deploy 4 additional handheld fundus cameras at high-burden CHCs.`);
  }
  if (params.aiSpecificityCutoff >= 0.92) {
    recommendations.push(`AI Triaging reduces doctor workload by ${Math.round((1 - (truePositivesSent + falsePositivesSent) / annualDiabeticsScreened) * 100)}% compared to manual universal reading.`);
  }

  return {
    dailyScreeningCapacity,
    monthlyPatientsScreened,
    annualCoveragePercent,
    dailyDoctorReviewWorkloadHours,
    estimatedBacklogDays,
    projectedTruePositivesDetected,
    projectedFalseNegativesMissed,
    projectedSightThreateningAverted,
    totalAnnualCostINR,
    costPerPatientScreenedINR,
    costPerSightThreateningDetectedINR,
    recommendations
  };
}

export const MODEL_REGISTRY_DATA: ModelRegistryItem[] = [
  {
    id: 'mod_001',
    name: 'Drishti-Quality-Net',
    taskType: 'IMAGE_QUALITY',
    version: 'v2.1.0',
    architecture: 'MobileNetV3-Large + Dual-Head Artifact Regressor',
    framework: 'PyTorch 2.3 / ONNX Runtime',
    trainingDataset: 'EyeQ + Internal Indian PHC Dataset (n=28,400)',
    datasetSamples: 28400,
    sensitivity: 96.8,
    specificity: 94.2,
    aucRoc: 0.984,
    f1Score: 0.955,
    inferenceLatencyMs: 42,
    weightsChecksum: 'SHA256:9f8a6b2c4e1d7a8f3c5b9e0a1d4f6c8b',
    isActive: true,
    lastUpdated: '2026-08-15'
  },
  {
    id: 'mod_002',
    name: 'Drishti-ICDR-Classifier',
    taskType: 'DR_CLASSIFICATION',
    version: 'v3.4.2',
    architecture: 'Ensemble EfficientNet-B4 + ConvNeXt-Small (5-Class Ordinal)',
    framework: 'PyTorch 2.3 / TensorRT',
    trainingDataset: 'EyePACS + APTOS 2019 + Messidor-2 + DDR (n=88,500)',
    datasetSamples: 88500,
    sensitivity: 96.2,
    specificity: 93.8,
    aucRoc: 0.989,
    f1Score: 0.949,
    inferenceLatencyMs: 118,
    weightsChecksum: 'SHA256:3a7b9c1d5e8f2a4b6c0d8e1f3a5c7e9b',
    isActive: true,
    lastUpdated: '2026-08-20'
  },
  {
    id: 'mod_003',
    name: 'Drishti-Vessel-UNet',
    taskType: 'VESSEL_SEGMENTATION',
    version: 'v1.8.0',
    architecture: 'Residual U-Net with Multi-Scale Attention Gating',
    framework: 'PyTorch 2.3',
    trainingDataset: 'DRIVE + STARE + CHASE_DB1 + HRF (n=4,200)',
    datasetSamples: 4200,
    sensitivity: 92.4,
    specificity: 97.1,
    aucRoc: 0.978,
    f1Score: 0.892,
    inferenceLatencyMs: 95,
    weightsChecksum: 'SHA256:7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f',
    isActive: true,
    lastUpdated: '2026-07-28'
  },
  {
    id: 'mod_004',
    name: 'Drishti-Lesion-Detector',
    taskType: 'LESION_DETECTION',
    version: 'v2.0.1',
    architecture: 'Mask R-CNN + PointRend for Microaneurysms & Exudates',
    framework: 'PyTorch 2.3',
    trainingDataset: 'IDRiD + e-ophtha + FGADR (n=12,600)',
    datasetSamples: 12600,
    sensitivity: 91.5,
    specificity: 95.0,
    aucRoc: 0.965,
    f1Score: 0.884,
    inferenceLatencyMs: 140,
    weightsChecksum: 'SHA256:1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d',
    isActive: true,
    lastUpdated: '2026-08-10'
  },
  {
    id: 'mod_005',
    name: 'Drishti-GradCAM-Explainability',
    taskType: 'EXPLAINABILITY',
    version: 'v1.4.0',
    architecture: 'GradCAM++ on Final Stage Feature Maps with Guided Backprop',
    framework: 'PyTorch 2.3',
    trainingDataset: 'Validated on 500 Ophthalmologist-Annotated Heatmaps',
    datasetSamples: 500,
    sensitivity: 94.0,
    specificity: 91.2,
    aucRoc: 0.952,
    f1Score: 0.925,
    inferenceLatencyMs: 55,
    weightsChecksum: 'SHA256:5f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0c',
    isActive: true,
    lastUpdated: '2026-08-18'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'aud_1001',
    timestamp: '2026-08-31T11:30:15Z',
    userId: 'usr_doc_01',
    userName: 'Dr. Anand Mehta, MS',
    userRole: 'OPHTHALMOLOGIST',
    action: 'DOCTOR_REVIEW_SUBMITTED',
    entityType: 'ENCOUNTER',
    entityId: 'enc_4403',
    details: 'Validated encounter ENC-2026-4403. Final Grade: Mild NPDR (OD) / No DR (OS). Follow-up 6 Months. Signed with digital token.',
    ipAddress: '10.14.82.105',
    integrityHash: 'a7c9f82e1d0b3c4e5f6a7b8c9d0e1f2a'
  },
  {
    id: 'aud_1002',
    timestamp: '2026-08-31T11:15:00Z',
    userId: 'usr_scr_01',
    userName: 'Priya Sharma (CHO)',
    userRole: 'SCREENER',
    action: 'PDF_REPORT_GENERATED',
    entityType: 'ENCOUNTER',
    entityId: 'enc_4404',
    details: 'Exported diagnostic PDF report for Patient DRP-2026-0815 (Kanti Gupta).',
    ipAddress: '192.168.1.44',
    integrityHash: '8b7a6c5d4e3f2a1b0c9d8e7f6a5b4c3d'
  },
  {
    id: 'aud_1003',
    timestamp: '2026-08-31T10:13:25Z',
    userId: 'system',
    userName: 'Celery ML Worker #3',
    userRole: 'ADMIN',
    action: 'AI_INFERENCE_TRIGGERED',
    entityType: 'ENCOUNTER',
    entityId: 'enc_4402',
    details: 'Completed bilateral inference pipeline in DEMO_MODE. OD: PDR (Confidence 95.6%), OS: PDR (Confidence 92.4%). Processing time 802ms.',
    ipAddress: '127.0.0.1',
    integrityHash: '3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c'
  },
  {
    id: 'aud_1004',
    timestamp: '2026-08-31T10:11:15Z',
    userId: 'usr_scr_01',
    userName: 'Priya Sharma (CHO)',
    userRole: 'SCREENER',
    action: 'FUNDUS_IMAGE_UPLOAD',
    entityType: 'IMAGE',
    entityId: 'img_od_002',
    details: 'Captured & uploaded OD Fundus (2048x2048 PNG) from Remidio Handheld. Image Quality Score: 89/100 (GOOD).',
    ipAddress: '192.168.1.44',
    integrityHash: '1e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6b'
  },
  {
    id: 'aud_1005',
    timestamp: '2026-08-31T10:08:40Z',
    userId: 'usr_scr_01',
    userName: 'Priya Sharma (CHO)',
    userRole: 'SCREENER',
    action: 'PATIENT_CREATED',
    entityType: 'PATIENT',
    entityId: 'pat_003',
    details: 'Registered new patient Mohammad Irfan (ABHA: 91-8833-2104-5541) with 18yr diabetes history and HbA1c 10.8%.',
    ipAddress: '192.168.1.44',
    integrityHash: '9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f'
  },
  {
    id: 'aud_1006',
    timestamp: '2026-08-31T09:00:12Z',
    userId: 'usr_scr_01',
    userName: 'Priya Sharma (CHO)',
    userRole: 'SCREENER',
    action: 'USER_LOGIN',
    entityType: 'SYSTEM',
    entityId: 'usr_scr_01',
    details: 'Field worker authenticated successfully from Sultanpur PHC offline-first terminal.',
    ipAddress: '192.168.1.44',
    integrityHash: '4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a'
  }
];
