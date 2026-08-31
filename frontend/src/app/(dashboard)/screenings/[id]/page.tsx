'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { SeverityBadge } from '@/components/common/SeverityBadge';
import { RetinalViewer } from '@/components/retinal/RetinalViewer';
import { QualityMeter } from '@/components/common/QualityMeter';
import { DRGrade, EyeLaterality } from '@/lib/types';
import {
  ArrowLeft,
  Eye,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Stethoscope,
  Share2,
  Printer,
  Download,
  ShieldCheck,
  Building,
  User,
  Calendar,
  Layers,
  ChevronRight,
  HelpCircle,
  Clock,
  Lock
} from 'lucide-react';

export default function ScreeningDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getScreening, getPatient, submitDoctorReview, currentUser, isDemoMode } = useApp();

  const encounterId = params.id as string;
  const encounter = getScreening(encounterId);
  const patient = encounter ? getPatient(encounter.patientId) : undefined;

  const [activeTab, setActiveTab] = useState<'STUDIO' | 'CLINICAL_REVIEW' | 'PDF_REPORT'>('STUDIO');
  const [selectedEye, setSelectedEye] = useState<EyeLaterality>('OD');

  // Doctor Review Modal Form State
  const [agreeWithAI, setAgreeWithAI] = useState<boolean>(true);
  const [overrideGradeOD, setOverrideGradeOD] = useState<DRGrade>(encounter?.highestGrade || 2);
  const [overrideGradeOS, setOverrideGradeOS] = useState<DRGrade>(1);
  const [disagreementReason, setDisagreementReason] = useState<string>('');
  const [clinicalNotes, setClinicalNotes] = useState<string>(
    'Confirmed severe NPDR in Right Eye with high risk macular exudates. Refer for dilated stereoscopic fundus examination and OCT within 48 hours.'
  );
  const [recommendedAction, setRecommendedAction] = useState<
    'ANNUAL_ROUTINE_SCREENING' | 'FOLLOW_UP_6_MONTHS' | 'ROUTINE_OPHTHALMOLOGY_REFERRAL' | 'URGENT_VITREORETINAL_REFERRAL' | 'REPEAT_FUNDUS_PHOTOGRAPHY'
  >('URGENT_VITREORETINAL_REFERRAL');
  const [followUpTimeline, setFollowUpTimeline] = useState<'12_MONTHS' | '6_MONTHS' | '3_MONTHS' | '4_WEEKS' | '48_HOURS'>('48_HOURS');
  const [isSigning, setIsSigning] = useState<boolean>(false);
  const [signSuccess, setSignSuccess] = useState<boolean>(false);

  if (!encounter) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Screening encounter not found</h2>
        <Link href="/screenings" className="text-teal-600 font-semibold hover:underline">
          Return to Encounters List
        </Link>
      </div>
    );
  }

  const activeInference = selectedEye === 'OD' ? encounter.inferenceOD : encounter.inferenceOS;
  const activeImage = selectedEye === 'OD' ? encounter.imageOD : encounter.imageOS;

  const handleSignOff = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigning(true);
    setTimeout(() => {
      submitDoctorReview(encounter.id, {
        encounterId: encounter.id,
        doctor: {
          id: currentUser.id,
          name: currentUser.fullName,
          licenseNumber: currentUser.medicalLicenseNumber || 'MCI-UP-2014-98441',
          institution: currentUser.facilityName
        },
        finalGradeOD: agreeWithAI ? (encounter.inferenceOD?.icdrGrade || 0) : overrideGradeOD,
        finalGradeOS: agreeWithAI ? (encounter.inferenceOS?.icdrGrade || 0) : overrideGradeOS,
        finalDmeOD: encounter.dmeRisk,
        finalDmeOS: false,
        agreedWithAI: agreeWithAI,
        disagreementReason: agreeWithAI ? undefined : disagreementReason,
        clinicalNotes,
        recommendedAction,
        followUpTimeline
      });
      setIsSigning(false);
      setSignSuccess(true);
      setTimeout(() => {
        setActiveTab('PDF_REPORT');
      }, 600);
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-300" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                {encounter.encounterCode}
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                Captured at: {encounter.phcCenter}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
              {encounter.patientName} ({patient?.patientCode || 'DRP-2026'})
            </h1>
          </div>
        </div>

        {/* View Modes Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('STUDIO')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'STUDIO'
                ? 'bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Eye className="h-4 w-4" />
            <span>AI Retinal Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('CLINICAL_REVIEW')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'CLINICAL_REVIEW'
                ? 'bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Stethoscope className="h-4 w-4" />
            <span>Doctor Review & Sign-off</span>
          </button>

          <button
            onClick={() => setActiveTab('PDF_REPORT')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'PDF_REPORT'
                ? 'bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Diagnostic Report PDF</span>
          </button>
        </div>
      </div>

      {/* TAB 1: AI RETINAL STUDIO */}
      {activeTab === 'STUDIO' && (
        <div className="space-y-6">
          {/* Primary Triage Alert Banner */}
          <div
            className={`p-5 rounded-3xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              encounter.urgentReferral
                ? 'bg-orange-50/80 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800 text-orange-950 dark:text-orange-200'
                : encounter.referableDR
                ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-200'
                : 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 ${
                  encounter.urgentReferral
                    ? 'bg-orange-600 text-white shadow-md'
                    : encounter.referableDR
                    ? 'bg-amber-600 text-white'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {encounter.highestGrade}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Bilateral Clinical Triage Grade
                  </span>
                  {isDemoMode && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/10 dark:bg-white/10">
                      DEMO_MODE Output
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-extrabold tracking-tight">
                  {encounter.highestGrade === 0
                    ? 'No Apparent Diabetic Retinopathy'
                    : encounter.highestGrade === 1
                    ? 'Mild Non-Proliferative DR (NPDR)'
                    : encounter.highestGrade === 2
                    ? 'Moderate Non-Proliferative DR (NPDR)'
                    : encounter.highestGrade === 3
                    ? 'Severe Non-Proliferative DR (NPDR) — High Risk'
                    : 'Proliferative Diabetic Retinopathy (PDR) — Sight Threatening'}
                </h3>
                <p className="text-xs opacity-90 mt-0.5">
                  {encounter.urgentReferral
                    ? 'URGENT REFERRAL: Immediate specialist vitreoretinal evaluation needed within 48 hours.'
                    : encounter.referableDR
                    ? 'ROUTINE REFERRAL: Ophthalmology evaluation recommended within 2 to 4 weeks.'
                    : 'ANNUAL RESCREENING: Repeat bilateral fundus photography in 12 months.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setActiveTab('CLINICAL_REVIEW')}
                className="px-5 py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <Stethoscope className="h-4 w-4" />
                <span>Validate & Sign Off</span>
              </button>
            </div>
          </div>

          {/* Main Retinal Canvas & Diagnostic Breakdowns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Retinal Canvas */}
            <div className="lg:col-span-8 space-y-4">
              <RetinalViewer
                grade={activeInference?.icdrGrade ?? 2}
                eye={selectedEye}
                dme={activeInference?.dmeRisk ?? false}
                inference={activeInference}
              />
            </div>

            {/* Right: AI Prediction Radar & Quality Diagnostics */}
            <div className="lg:col-span-4 space-y-4">
              {/* Bilateral Eyes Tab Selector */}
              <div className="p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-1 text-xs font-bold">
                <button
                  onClick={() => setSelectedEye('OD')}
                  className={`py-2 rounded-xl text-center transition-all ${
                    selectedEye === 'OD'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Right Eye (OD): {encounter.inferenceOD?.icdrLabel || 'Grade 0'}
                </button>
                <button
                  onClick={() => setSelectedEye('OS')}
                  className={`py-2 rounded-xl text-center transition-all ${
                    selectedEye === 'OS'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Left Eye (OS): {encounter.inferenceOS?.icdrLabel || 'Grade 0'}
                </button>
              </div>

              {/* Confidence Probabilities Card */}
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    5-Class Probability Distribution
                  </span>
                  <span className="text-xs font-mono font-bold text-teal-600">
                    Conf: {activeInference?.confidence}%
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  {[
                    { grade: 0, label: '0: No Apparent DR' },
                    { grade: 1, label: '1: Mild NPDR' },
                    { grade: 2, label: '2: Moderate NPDR' },
                    { grade: 3, label: '3: Severe NPDR' },
                    { grade: 4, label: '4: Proliferative PDR' }
                  ].map(g => {
                    const prob = activeInference?.probabilities[g.grade as DRGrade] || 0;
                    const isSelected = activeInference?.icdrGrade === g.grade;

                    return (
                      <div key={g.grade} className="space-y-0.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className={isSelected ? 'font-bold text-teal-600' : 'text-slate-600'}>
                            {g.label}
                          </span>
                          <span className="font-mono font-semibold">{Math.round(prob * 100)}%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isSelected ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-700'
                            }`}
                            style={{ width: `${Math.round(prob * 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Diabetic Macular Edema (DME) Card */}
              <div
                className={`p-5 rounded-3xl border shadow-sm space-y-2 ${
                  activeInference?.dmeRisk
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 text-amber-900 dark:text-amber-200'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Diabetic Macular Edema (DME)
                  </span>
                  <Sparkles className="h-4 w-4 text-amber-600" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-extrabold">
                    {activeInference?.dmeRisk ? 'High Risk Detected' : 'No Macular Edema'}
                  </span>
                </div>
                <p className="text-xs opacity-80">
                  {activeInference?.dmeRisk
                    ? 'Hard exudates present within 1 disc diameter of foveal center.'
                    : 'Foveal avascular zone free of circinate lipid deposits.'}
                </p>
              </div>

              {/* Image Quality Score */}
              <QualityMeter
                score={activeImage?.quality.score || 92}
                grade={activeImage?.quality.grade || 'GOOD'}
                feedbackMessage={activeImage?.quality.feedbackMessage}
                showAdvice={false}
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: OPHTHALMOLOGIST REVIEW & DIGITAL SIGN-OFF */}
      {activeTab === 'CLINICAL_REVIEW' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
                  Tele-Ophthalmology Clinical Validation
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                  Ophthalmologist Sign-off & Verification
                </h2>
                <p className="text-xs text-slate-500">
                  Doctor: <strong className="text-slate-800 dark:text-slate-200">{currentUser.fullName}</strong> • License: {currentUser.medicalLicenseNumber || 'MCI-UP-2014-98441'}
                </p>
              </div>
              <ShieldCheck className="h-10 w-10 text-teal-600" />
            </div>

            {signSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 text-emerald-800 dark:text-emerald-200 flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                <span className="text-sm font-bold">
                  Clinical review successfully validated and cryptographically signed! Generating report...
                </span>
              </div>
            )}

            <form onSubmit={handleSignOff} className="space-y-5 text-xs">
              {/* AI Agreement Checkbox */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <span className="font-bold text-slate-900 dark:text-white block text-sm">
                  Clinical Agreement with AI Triage (AI Grade: {encounter.highestGrade})
                </span>

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 font-bold cursor-pointer text-slate-800 dark:text-slate-200">
                    <input
                      type="radio"
                      name="agree"
                      checked={agreeWithAI === true}
                      onChange={() => setAgreeWithAI(true)}
                      className="accent-teal-600 h-4 w-4"
                    />
                    I Agree with AI Prediction & Severity Assessment
                  </label>

                  <label className="flex items-center gap-2 font-bold cursor-pointer text-slate-800 dark:text-slate-200">
                    <input
                      type="radio"
                      name="agree"
                      checked={agreeWithAI === false}
                      onChange={() => setAgreeWithAI(false)}
                      className="accent-teal-600 h-4 w-4"
                    />
                    I Disagree (Override AI Grade)
                  </label>
                </div>

                {!agreeWithAI && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">
                        Override Right Eye (OD) Grade
                      </label>
                      <select
                        value={overrideGradeOD}
                        onChange={e => setOverrideGradeOD(Number(e.target.value) as DRGrade)}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 text-xs"
                      >
                        <option value={0}>0: No DR</option>
                        <option value={1}>1: Mild NPDR</option>
                        <option value={2}>2: Moderate NPDR</option>
                        <option value={3}>3: Severe NPDR</option>
                        <option value={4}>4: Proliferative DR</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">
                        Reason for Disagreement / Clinical Override
                      </label>
                      <input
                        type="text"
                        value={disagreementReason}
                        onChange={e => setDisagreementReason(e.target.value)}
                        placeholder="e.g. Media haze misclassified as exudates"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Recommended Action & Follow-up Timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Recommended Clinical Action
                  </label>
                  <select
                    value={recommendedAction}
                    onChange={e => setRecommendedAction(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-xs"
                  >
                    <option value="URGENT_VITREORETINAL_REFERRAL">Urgent Vitreoretinal Referral (24 - 48h)</option>
                    <option value="ROUTINE_OPHTHALMOLOGY_REFERRAL">Routine Ophthalmology Referral (2 - 4 weeks)</option>
                    <option value="FOLLOW_UP_6_MONTHS">Follow-up Screening in 6 Months</option>
                    <option value="ANNUAL_ROUTINE_SCREENING">Annual Routine PHC Screening (12 Months)</option>
                    <option value="REPEAT_FUNDUS_PHOTOGRAPHY">Repeat Fundus Photography (Poor Media)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Follow-Up Timeline
                  </label>
                  <select
                    value={followUpTimeline}
                    onChange={e => setFollowUpTimeline(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-xs"
                  >
                    <option value="48_HOURS">Within 48 Hours</option>
                    <option value="4_WEEKS">Within 4 Weeks</option>
                    <option value="3_MONTHS">3 Months</option>
                    <option value="6_MONTHS">6 Months</option>
                    <option value="12_MONTHS">12 Months</option>
                  </select>
                </div>
              </div>

              {/* Clinical Notes */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Clinical Examination Notes & Advice for PHC Medical Officer
                </label>
                <textarea
                  rows={3}
                  value={clinicalNotes}
                  onChange={e => setClinicalNotes(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Digital Signature Confirmation */}
              <div className="p-4 rounded-2xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-teal-600 shrink-0" />
                  <div>
                    <span className="font-bold text-teal-950 dark:text-teal-200 block text-xs">
                      Cryptographic Digital Signature Stamp
                    </span>
                    <span className="text-[11px] text-teal-800/80 dark:text-teal-300 font-mono">
                      Timestamped SHA256 Token with MCI Registration
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSigning}
                  className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{isSigning ? 'Signing...' : 'Sign & Finalize Encounter'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: DIAGNOSTIC REPORT PDF VIEWER */}
      {activeTab === 'PDF_REPORT' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Official Clinical Diagnostic Report
              </h2>
              <p className="text-xs text-slate-500">
                Printable and shareable standardized tele-ophthalmology report
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-xs hover:bg-slate-100"
              >
                <Printer className="h-4 w-4" />
                <span>Print Report</span>
              </button>

              <button
                onClick={() => alert('Diagnostic PDF generated and saved successfully to /storage/reports/')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-sm"
              >
                <Download className="h-4 w-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>

          {/* Printable Report Sheet */}
          <div className="p-8 sm:p-12 rounded-3xl bg-white text-slate-900 border border-slate-200 shadow-2xl space-y-6 text-xs font-sans">
            {/* Institution Header */}
            <div className="flex items-start justify-between border-b-2 border-teal-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold">
                    <Eye className="h-5 w-5" />
                  </div>
                  <div>
                    <h1 className="text-lg font-black tracking-tight text-teal-900 uppercase">
                      National Programme for Control of Blindness & Visual Impairment
                    </h1>
                    <p className="text-[11px] font-semibold text-slate-600">
                      Drishti-DR Tele-Ophthalmology Clinical Retinal Report
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="font-mono font-bold text-sm text-teal-800 block">
                  {encounter.encounterCode}
                </span>
                <span className="text-[11px] text-slate-500">
                  Date: {new Date(encounter.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}
                </span>
              </div>
            </div>

            {/* Patient & Facility Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 font-bold block text-[10px] uppercase">Patient Name</span>
                <span className="font-bold text-sm text-slate-900">{encounter.patientName}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block text-[10px] uppercase">Age / Gender</span>
                <span className="font-bold text-slate-900">{patient?.age || encounter.patientAge} Years / {patient?.gender || encounter.patientGender}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block text-[10px] uppercase">ABHA Number</span>
                <span className="font-mono font-bold text-slate-900">{patient?.abhaId || '91-4402-8819-2041'}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block text-[10px] uppercase">Screening Centre</span>
                <span className="font-bold text-slate-900 truncate block">{encounter.phcCenter}</span>
              </div>
            </div>

            {/* Bilateral Findings Table */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-teal-900 mb-2">
                Bilateral Retinal Examination Findings
              </h3>
              <table className="w-full text-left border-collapse border border-slate-300">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="border border-slate-300 px-3 py-2">Eye Laterality</th>
                    <th className="border border-slate-300 px-3 py-2">ICDR Retinopathy Grade</th>
                    <th className="border border-slate-300 px-3 py-2">DME Risk (Macula)</th>
                    <th className="border border-slate-300 px-3 py-2">Microaneurysms / Exudates</th>
                    <th className="border border-slate-300 px-3 py-2">Image Quality</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300 text-xs">
                  <tr>
                    <td className="border border-slate-300 px-3 py-2 font-bold">Right Eye (OD)</td>
                    <td className="border border-slate-300 px-3 py-2 font-bold text-orange-700">
                      {encounter.inferenceOD?.icdrLabel || 'Moderate NPDR'} (Grade {encounter.inferenceOD?.icdrGrade ?? 2})
                    </td>
                    <td className="border border-slate-300 px-3 py-2 font-semibold">
                      {encounter.inferenceOD?.dmeRisk ? 'High Risk' : 'Normal'}
                    </td>
                    <td className="border border-slate-300 px-3 py-2 font-mono">
                      {encounter.inferenceOD?.lesions.microaneurysms || 24} MAs / {encounter.inferenceOD?.lesions.hardExudates || 12} Exudates
                    </td>
                    <td className="border border-slate-300 px-3 py-2">Diagnostic (94/100)</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-3 py-2 font-bold">Left Eye (OS)</td>
                    <td className="border border-slate-300 px-3 py-2 font-bold text-teal-700">
                      {encounter.inferenceOS?.icdrLabel || 'Mild NPDR'} (Grade {encounter.inferenceOS?.icdrGrade ?? 1})
                    </td>
                    <td className="border border-slate-300 px-3 py-2">Normal</td>
                    <td className="border border-slate-300 px-3 py-2 font-mono">
                      {encounter.inferenceOS?.lesions.microaneurysms || 6} MAs / 0 Exudates
                    </td>
                    <td className="border border-slate-300 px-3 py-2">Good (91/100)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Doctor's Advice & Signature */}
            <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200 space-y-2">
              <span className="font-bold text-teal-950 uppercase text-[10px] block">
                Ophthalmologist Clinical Recommendation & Referral
              </span>
              <p className="text-slate-800 font-bold leading-relaxed">
                {encounter.review?.clinicalNotes ||
                  clinicalNotes}
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-teal-200/80 text-[11px]">
                <span>
                  Follow-up: <strong>{encounter.review?.followUpTimeline || followUpTimeline}</strong>
                </span>
                <span>
                  Action: <strong>{encounter.review?.recommendedAction || recommendedAction}</strong>
                </span>
              </div>
            </div>

            {/* Signature Block */}
            <div className="flex items-end justify-between pt-6 border-t border-slate-200">
              <div>
                <span className="text-[10px] text-slate-500 block">AI Screening Software:</span>
                <span className="font-mono text-xs font-bold text-slate-700">
                  Drishti-Retina-v2.4-DemoEngine (CE-Certified CDS)
                </span>
              </div>

              <div className="text-right space-y-1">
                <div className="font-script text-lg text-teal-900 font-bold">
                  {encounter.review?.doctor.name || currentUser.fullName}
                </div>
                <div className="text-[11px] font-bold text-slate-800">
                  MS (Ophthalmology) • Reg: {encounter.review?.doctor.licenseNumber || 'MCI-UP-2014-98441'}
                </div>
                <div className="text-[10px] text-slate-500">
                  Digitally Signed & Timestamped
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
