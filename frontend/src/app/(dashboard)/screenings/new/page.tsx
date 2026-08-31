'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/lib/store';
import { QualityMeter } from '@/components/common/QualityMeter';
import { RetinalViewer } from '@/components/retinal/RetinalViewer';
import {
  Camera,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  UserCheck,
  Eye,
  Activity,
  Layers,
  Cpu,
  RefreshCw
} from 'lucide-react';
import { DRGrade } from '@/lib/types';

function NewScreeningContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientIdParam = searchParams.get('patientId');
  const encounterIdParam = searchParams.get('encounterId');

  const { patients, screenings, createScreening, updateScreeningImages, runInferenceForEncounter } = useApp();

  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    patientIdParam || (patients.length > 0 ? patients[0].id : '')
  );

  const [currentStep, setCurrentStep] = useState<'SELECT_PATIENT' | 'CAPTURE_OD' | 'CAPTURE_OS' | 'QUALITY_CHECK' | 'PROCESSING'>('SELECT_PATIENT');

  const [activeEncounterId, setActiveEncounterId] = useState<string>(encounterIdParam || '');

  // Quality State for OD and OS
  const [qualityOD, setQualityOD] = useState({
    score: 93,
    grade: 'GOOD' as 'GOOD' | 'USABLE' | 'UNUSABLE',
    artifacts: {
      motionBlur: 0.05,
      unevenIllumination: 0.08,
      cataractHaze: 0.12,
      eyelashOcclusion: 0.0,
      discCenteredCorrectly: true
    },
    message: 'Optimal 45° macula-centered view with sharp vascular arcades.'
  });

  const [qualityOS, setQualityOS] = useState({
    score: 91,
    grade: 'GOOD' as 'GOOD' | 'USABLE' | 'UNUSABLE',
    artifacts: {
      motionBlur: 0.06,
      unevenIllumination: 0.1,
      cataractHaze: 0.15,
      eyelashOcclusion: 0.02,
      discCenteredCorrectly: true
    },
    message: 'Good quality. Slight peripheral shadow; foveal avascular zone fully clear.'
  });

  // Processing stage animation
  const [processingStage, setProcessingStage] = useState<number>(0);
  const stages = [
    'Color normalization & CLAHE contrast balance',
    'Retinal vascular tree segmentation & AV ratio analysis',
    'Microaneurysm, hemorrhage & exudate localization',
    '5-Stage ICDR classification backbone evaluation',
    'Grad-CAM++ attention heatmap saliency mapping',
    'Compiling clinical triage summary & referral priority'
  ];

  useEffect(() => {
    if (encounterIdParam) {
      setActiveEncounterId(encounterIdParam);
      setCurrentStep('CAPTURE_OD');
    } else if (patientIdParam) {
      setSelectedPatientId(patientIdParam);
      setCurrentStep('CAPTURE_OD');
    }
  }, [encounterIdParam, patientIdParam]);

  const handleStartCapture = () => {
    if (!selectedPatientId) {
      alert('Please select a patient');
      return;
    }
    const enc = createScreening(selectedPatientId);
    setActiveEncounterId(enc.id);
    setCurrentStep('CAPTURE_OD');
  };

  const handleODCaptured = () => {
    setCurrentStep('CAPTURE_OS');
  };

  const handleOSCaptured = () => {
    setCurrentStep('QUALITY_CHECK');
  };

  const handleStartProcessing = async () => {
    setCurrentStep('PROCESSING');
    setProcessingStage(0);

    // Simulate multi-stage pipeline steps
    for (let i = 1; i <= stages.length; i++) {
      await new Promise(r => setTimeout(r, 450));
      setProcessingStage(i);
    }

    if (activeEncounterId) {
      const result = await runInferenceForEncounter(activeEncounterId);
      router.push(`/screenings/${result.id}`);
    }
  };

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Wizard Step Stepper */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between max-w-3xl mx-auto text-xs font-bold">
          <div
            className={`flex items-center gap-2 ${
              currentStep === 'SELECT_PATIENT' ? 'text-teal-600' : 'text-slate-400'
            }`}
          >
            <span className="h-6 w-6 rounded-full border-2 flex items-center justify-center border-current">
              1
            </span>
            <span className="hidden sm:inline">Select Patient</span>
          </div>

          <div className="h-0.5 w-12 bg-slate-200 dark:bg-slate-800" />

          <div
            className={`flex items-center gap-2 ${
              currentStep === 'CAPTURE_OD' || currentStep === 'CAPTURE_OS'
                ? 'text-teal-600'
                : 'text-slate-400'
            }`}
          >
            <span className="h-6 w-6 rounded-full border-2 flex items-center justify-center border-current">
              2
            </span>
            <span className="hidden sm:inline">Bilateral Capture</span>
          </div>

          <div className="h-0.5 w-12 bg-slate-200 dark:bg-slate-800" />

          <div
            className={`flex items-center gap-2 ${
              currentStep === 'QUALITY_CHECK' ? 'text-teal-600' : 'text-slate-400'
            }`}
          >
            <span className="h-6 w-6 rounded-full border-2 flex items-center justify-center border-current">
              3
            </span>
            <span className="hidden sm:inline">Quality Feedback</span>
          </div>

          <div className="h-0.5 w-12 bg-slate-200 dark:bg-slate-800" />

          <div
            className={`flex items-center gap-2 ${
              currentStep === 'PROCESSING' ? 'text-teal-600' : 'text-slate-400'
            }`}
          >
            <span className="h-6 w-6 rounded-full border-2 flex items-center justify-center border-current">
              4
            </span>
            <span className="hidden sm:inline">AI Analysis</span>
          </div>
        </div>
      </div>

      {/* STEP 1: PATIENT SELECTION */}
      {currentStep === 'SELECT_PATIENT' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Step 1 of 4</span>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Select Patient for Screening Encounter
            </h2>
            <p className="text-xs text-slate-500">
              Choose an existing patient from the registry or register a new patient
            </p>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Select Patient Record
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {patients.map(p => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPatientId(p.id)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedPatientId === p.id
                      ? 'border-teal-600 bg-teal-50/50 dark:bg-teal-950/30 shadow-md'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-teal-700 dark:text-teal-400">
                      {p.patientCode}
                    </span>
                    <span className="text-[11px] text-slate-400 font-semibold">{p.gender}, {p.age}y</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                    {p.firstName} {p.lastName}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ABHA: {p.abhaId || 'Not linked'} • HbA1c: {p.lastHba1c ? `${p.lastHba1c}%` : 'N/A'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => router.push('/patients/new')}
              className="text-xs font-bold text-teal-600 hover:underline"
            >
              + Register A New Patient Instead
            </button>

            <button
              onClick={handleStartCapture}
              className="px-8 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-teal-600/30 transition-all hover:scale-[1.01]"
            >
              <span>Proceed to Bilateral Capture</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: BILATERAL FUNDUS CAPTURE (OD / OS) */}
      {(currentStep === 'CAPTURE_OD' || currentStep === 'CAPTURE_OS') && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
                Step 2 of 4 • {currentStep === 'CAPTURE_OD' ? 'Right Eye (OD)' : 'Left Eye (OS)'}
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                Capture {currentStep === 'CAPTURE_OD' ? 'Right Eye (OD - Oculus Dexter)' : 'Left Eye (OS - Oculus Sinister)'}
              </h2>
              <p className="text-xs text-slate-500">
                Patient: <strong className="text-slate-800 dark:text-slate-200">{selectedPatient?.firstName} {selectedPatient?.lastName}</strong> ({selectedPatient?.patientCode})
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-xl text-xs font-bold ${currentStep === 'CAPTURE_OD' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                1. OD (Right)
              </span>
              <span className={`px-3 py-1 rounded-xl text-xs font-bold ${currentStep === 'CAPTURE_OS' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                2. OS (Left)
              </span>
            </div>
          </div>

          {/* Interactive Live Capture Viewport */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7">
              <RetinalViewer
                grade={currentStep === 'CAPTURE_OD' ? 3 : 2}
                eye={currentStep === 'CAPTURE_OD' ? 'OD' : 'OS'}
                dme={currentStep === 'CAPTURE_OD'}
              />
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 space-y-2">
                <div className="flex items-center gap-2 text-teal-900 dark:text-teal-200 font-bold text-xs">
                  <Camera className="h-4 w-4 text-teal-600" />
                  <span>Fundus Camera Alignment Guide</span>
                </div>
                <ul className="text-xs text-teal-800/90 dark:text-teal-300 space-y-1.5 list-disc list-inside">
                  <li>Position patient chin comfortably on rest.</li>
                  <li>Instruct patient to fixate on the green cross target.</li>
                  <li>Ensure pupil diameter &gt; 3.5mm; dim room lights if needed.</li>
                  <li>Verify optic disc is visible on the {currentStep === 'CAPTURE_OD' ? 'nasal (left)' : 'temporal (right)'} side.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <button
                  onClick={currentStep === 'CAPTURE_OD' ? handleODCaptured : handleOSCaptured}
                  className="w-full py-4 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-600/30 transition-all hover:scale-[1.01]"
                >
                  <Camera className="h-5 w-5" />
                  <span>Confirm & Save {currentStep === 'CAPTURE_OD' ? 'OD (Right Eye)' : 'OS (Left Eye)'} Capture</span>
                </button>

                <button
                  onClick={() => alert('Simulated reload from connected USB Handheld Fundus Camera (Remidio / Volk VistaView).')}
                  className="w-full py-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Retake Image from Camera</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: AUTOMATED IMAGE QUALITY FEEDBACK */}
      {currentStep === 'QUALITY_CHECK' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Step 3 of 4</span>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Automated Image Quality Assessment (AI Pre-Check)
            </h2>
            <p className="text-xs text-slate-500">
              Evaluating bilateral illumination, sharpness, and field-of-view centering before deep inference
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Right Eye (OD) Quality Score
              </h3>
              <QualityMeter
                score={qualityOD.score}
                grade={qualityOD.grade}
                artifacts={qualityOD.artifacts}
                feedbackMessage={qualityOD.message}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Left Eye (OS) Quality Score
              </h3>
              <QualityMeter
                score={qualityOS.score}
                grade={qualityOS.grade}
                artifacts={qualityOS.artifacts}
                feedbackMessage={qualityOS.message}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setCurrentStep('CAPTURE_OD')}
              className="px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 font-bold text-xs hover:bg-slate-100"
            >
              Retake Bilateral Images
            </button>

            <button
              onClick={handleStartProcessing}
              className="px-8 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-teal-600/30 transition-all hover:scale-[1.01]"
            >
              <Sparkles className="h-4 w-4" />
              <span>Launch AI Diagnostic Pipeline</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: ASYNC PROCESSING PIPELINE STATUS */}
      {currentStep === 'PROCESSING' && (
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-3xl bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 text-teal-600 flex items-center justify-center animate-pulse">
              <Cpu className="h-8 w-8 stroke-[2.2]" />
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Running Drishti-DR AI Diagnostic Pipeline
            </h2>
            <p className="text-xs text-slate-500">
              Celery Worker Queue • Model Tag: Drishti-Retina-v2.4-DemoEngine
            </p>
          </div>

          {/* Stepper progress list */}
          <div className="max-w-lg mx-auto text-left space-y-2.5 text-xs">
            {stages.map((stg, idx) => {
              const isDone = processingStage > idx;
              const isCurrent = processingStage === idx;

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                    isDone
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-emerald-800 dark:text-emerald-300'
                      : isCurrent
                      ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-300 text-teal-900 dark:text-teal-200 font-bold shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isDone ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    ) : isCurrent ? (
                      <div className="h-4 w-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin shrink-0" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-slate-300 dark:border-slate-700 shrink-0" />
                    )}
                    <span>{stg}</span>
                  </div>

                  {isDone && <span className="font-mono text-[10px] text-emerald-700">Done</span>}
                  {isCurrent && <span className="font-mono text-[10px] text-teal-600 animate-pulse">Running</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function NewScreeningPage() {
  return (
    <Suspense fallback={
      <div className="p-12 text-center text-teal-600">
        <div className="h-8 w-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <span className="text-xs font-bold">Loading Screening Wizard...</span>
      </div>
    }>
      <NewScreeningContent />
    </Suspense>
  );
}
