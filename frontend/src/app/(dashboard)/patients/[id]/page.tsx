'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { SeverityBadge } from '@/components/common/SeverityBadge';
import { RetinalViewer } from '@/components/retinal/RetinalViewer';
import {
  User,
  ShieldCheck,
  Calendar,
  Activity,
  Heart,
  Eye,
  Camera,
  ArrowLeft,
  FileText,
  Clock,
  TrendingUp,
  Stethoscope,
  ChevronRight
} from 'lucide-react';

export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getPatient, screenings } = useApp();

  const patientId = params.id as string;
  const patient = getPatient(patientId);

  if (!patient) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Patient record not found</h2>
        <Link href="/patients" className="text-teal-600 font-semibold hover:underline">
          Return to Patients Directory
        </Link>
      </div>
    );
  }

  const patientEncounters = screenings.filter(s => s.patientId === patient.id);

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
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
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                {patient.patientCode}
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                ABHA: {patient.abhaId || 'N/A'}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
              {patient.firstName} {patient.lastName}
            </h1>
          </div>
        </div>

        <Link
          href={`/screenings/new?patientId=${patient.id}`}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs shadow-lg shadow-teal-600/30 transition-all self-start sm:self-auto"
        >
          <Camera className="h-4 w-4" />
          <span>New Retinal Screening</span>
        </Link>
      </div>

      {/* Demographics & Clinical Profile Card */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-xs">
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <span className="text-slate-400 block text-[11px] font-semibold">Age / Gender</span>
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {patient.age} Years • {patient.gender}
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <span className="text-slate-400 block text-[11px] font-semibold">Diabetes Duration</span>
          <span className="text-sm font-bold text-teal-700 dark:text-teal-400 font-mono">
            {patient.diabetesDurationYears} Years
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <span className="text-slate-400 block text-[11px] font-semibold">Latest HbA1c</span>
          <span className="text-sm font-bold text-amber-600 font-mono">
            {patient.lastHba1c ? `${patient.lastHba1c}%` : 'Not tested'}
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <span className="text-slate-400 block text-[11px] font-semibold">Visual Acuity (OD/OS)</span>
          <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">
            {patient.visualAcuityOD || '6/6'} / {patient.visualAcuityOS || '6/6'}
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <span className="text-slate-400 block text-[11px] font-semibold">Hypertension</span>
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {patient.hypertension ? 'Hypertensive' : 'Normotensive'}
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <span className="text-slate-400 block text-[11px] font-semibold">Primary PHC</span>
          <span className="text-sm font-bold text-slate-900 dark:text-white truncate block">
            {patient.phcCenter}
          </span>
        </div>
      </div>

      {/* Longitudinal Retinal Screening Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Longitudinal Screening Timeline ({patientEncounters.length} Encounters)
            </h2>
            <p className="text-xs text-slate-500">
              Historical progression of retinopathy stages and ophthalmologist sign-offs
            </p>
          </div>
        </div>

        {patientEncounters.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <Camera className="h-10 w-10 text-teal-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No Fundus Screenings Completed Yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Initiate the patient's baseline bilateral fundus scan to establish retinal tracking.
            </p>
            <Link
              href={`/screenings/new?patientId=${patient.id}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs"
            >
              Start Baseline Scan
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {patientEncounters.map((enc, idx) => (
              <div
                key={enc.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-teal-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 flex items-center justify-center font-bold text-xs font-mono">
                      #{patientEncounters.length - idx}
                    </div>
                    <div>
                      <span className="font-mono font-bold text-teal-700 dark:text-teal-400 text-xs">
                        {enc.encounterCode}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{new Date(enc.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                        <span>•</span>
                        <span>Screener: {enc.screenerName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <SeverityBadge grade={enc.highestGrade} size="md" />
                    <Link
                      href={`/screenings/${enc.id}`}
                      className="px-4 py-2 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 hover:bg-teal-100 font-bold text-xs inline-flex items-center gap-1.5"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Open Retinal Studio</span>
                    </Link>
                  </div>
                </div>

                {/* Retinal & Clinical Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 font-bold block uppercase text-[10px]">
                      Right Eye (OD) AI Analysis
                    </span>
                    <p className="font-bold text-slate-900 dark:text-white mt-1">
                      {enc.inferenceOD?.icdrLabel || 'Grade 0'} (Conf: {enc.inferenceOD?.confidence}%)
                    </p>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Microaneurysms: {enc.inferenceOD?.lesions.microaneurysms || 0} • Exudates: {enc.inferenceOD?.lesions.hardExudates || 0}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 font-bold block uppercase text-[10px]">
                      Left Eye (OS) AI Analysis
                    </span>
                    <p className="font-bold text-slate-900 dark:text-white mt-1">
                      {enc.inferenceOS?.icdrLabel || 'Grade 0'} (Conf: {enc.inferenceOS?.confidence}%)
                    </p>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Microaneurysms: {enc.inferenceOS?.lesions.microaneurysms || 0} • Exudates: {enc.inferenceOS?.lesions.hardExudates || 0}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 font-bold block uppercase text-[10px]">
                      Ophthalmologist Review
                    </span>
                    {enc.review ? (
                      <div className="mt-1">
                        <span className="font-bold text-emerald-700 dark:text-emerald-400">
                          Signed by {enc.review.doctor.name}
                        </span>
                        <p className="text-slate-500 text-[11px] line-clamp-1 mt-0.5">
                          {enc.review.clinicalNotes}
                        </p>
                      </div>
                    ) : (
                      <span className="text-amber-600 font-semibold block mt-1">
                        Pending Tele-Review Verification
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
