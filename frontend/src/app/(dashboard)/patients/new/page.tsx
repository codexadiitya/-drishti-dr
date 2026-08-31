'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import {
  UserPlus,
  ShieldCheck,
  Activity,
  Heart,
  Eye,
  Building,
  Phone,
  Calendar,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function NewPatientPage() {
  const router = useRouter();
  const { addPatient, currentUser, createScreening } = useApp();

  const [formData, setFormData] = useState({
    abhaId: '91-7721-4402-9912',
    firstName: '',
    lastName: '',
    age: 54,
    gender: 'MALE' as 'MALE' | 'FEMALE' | 'OTHER',
    phone: '+91 ',
    district: currentUser.district || 'Varanasi',
    phcCenter: currentUser.facilityName || 'Sultanpur PHC',
    diabetesDurationYears: 8,
    diabetesType: 'TYPE_2' as 'TYPE_1' | 'TYPE_2' | 'GESTATIONAL' | 'PRE_DIABETES',
    lastHba1c: 8.5,
    hypertension: true,
    smokingStatus: 'NEVER' as 'NEVER' | 'FORMER' | 'CURRENT',
    visualAcuityOD: '6/9',
    visualAcuityOS: '6/12'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName) {
      alert('Please enter patient first and last name');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newPat = addPatient({
        abhaId: formData.abhaId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        age: Number(formData.age),
        gender: formData.gender,
        phone: formData.phone,
        district: formData.district,
        phcCenter: formData.phcCenter,
        diabetesDurationYears: Number(formData.diabetesDurationYears),
        diabetesType: formData.diabetesType,
        lastHba1c: Number(formData.lastHba1c),
        hypertension: formData.hypertension,
        smokingStatus: formData.smokingStatus,
        visualAcuityOD: formData.visualAcuityOD,
        visualAcuityOS: formData.visualAcuityOS
      });

      // Auto-create screening encounter
      const enc = createScreening(newPat.id);
      setIsSubmitting(false);
      setSuccessNotice(true);

      setTimeout(() => {
        router.push(`/screenings/new?encounterId=${enc.id}`);
      }, 700);
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
              ABDM Certified Registration
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Register New Diabetic Patient
          </h1>
          <p className="text-xs text-slate-500">
            Enter demographics and glycemic history prior to retinal fundus photography
          </p>
        </div>
      </div>

      {successNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 text-emerald-800 dark:text-emerald-200 flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span className="text-sm font-bold">
            Patient registered successfully! Redirecting to Bilateral Fundus Capture...
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: ABHA & Primary Identity */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800 text-teal-800 dark:text-teal-400 font-bold text-sm">
            <ShieldCheck className="h-5 w-5" />
            <span>Ayushman Bharat Health Account (ABHA) & Identity</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                ABHA ID / National Health Identifier
              </label>
              <input
                type="text"
                value={formData.abhaId}
                onChange={e => setFormData({ ...formData, abhaId: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                placeholder="14-digit ABHA Number"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                First Name *
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="e.g. Ramesh"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="e.g. Verma"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Age (Years) *
              </label>
              <input
                type="number"
                required
                min="1"
                max="115"
                value={formData.age}
                onChange={e => setFormData({ ...formData, age: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Biological Gender *
              </label>
              <select
                value={formData.gender}
                onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                District / Administrative Zone
              </label>
              <input
                type="text"
                value={formData.district}
                onChange={e => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Clinical Diabetes & Cardiovascular Profile */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800 text-teal-800 dark:text-teal-400 font-bold text-sm">
            <Activity className="h-5 w-5" />
            <span>Clinical Diabetes & Retinal Risk Factors</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Duration of Diabetes (Years) *
              </label>
              <input
                type="number"
                min="0"
                max="60"
                value={formData.diabetesDurationYears}
                onChange={e => setFormData({ ...formData, diabetesDurationYears: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Diabetes Classification
              </label>
              <select
                value={formData.diabetesType}
                onChange={e => setFormData({ ...formData, diabetesType: e.target.value as any })}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
              >
                <option value="TYPE_2">Type 2 Diabetes Mellitus</option>
                <option value="TYPE_1">Type 1 Diabetes Mellitus</option>
                <option value="GESTATIONAL">Gestational Diabetes</option>
                <option value="PRE_DIABETES">Pre-Diabetes / High Risk</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Last Known HbA1c (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="4"
                max="20"
                value={formData.lastHba1c}
                onChange={e => setFormData({ ...formData, lastHba1c: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Hypertension Comorbidity
              </label>
              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                  <input
                    type="radio"
                    name="htn"
                    checked={formData.hypertension === true}
                    onChange={() => setFormData({ ...formData, hypertension: true })}
                    className="accent-teal-600"
                  />
                  Yes (Diagnosed / On Meds)
                </label>
                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                  <input
                    type="radio"
                    name="htn"
                    checked={formData.hypertension === false}
                    onChange={() => setFormData({ ...formData, hypertension: false })}
                    className="accent-teal-600"
                  />
                  No
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Visual Acuity Right Eye (OD)
              </label>
              <input
                type="text"
                value={formData.visualAcuityOD}
                onChange={e => setFormData({ ...formData, visualAcuityOD: e.target.value })}
                placeholder="e.g. 6/6, 6/12"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Visual Acuity Left Eye (OS)
              </label>
              <input
                type="text"
                value={formData.visualAcuityOS}
                onChange={e => setFormData({ ...formData, visualAcuityOS: e.target.value })}
                placeholder="e.g. 6/6, 6/18"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Submit & Next Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-teal-600/30 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            {isSubmitting ? (
              <span>Registering Patient...</span>
            ) : (
              <>
                <span>Save & Proceed to Fundus Capture</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
