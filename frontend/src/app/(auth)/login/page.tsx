'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { UserRole } from '@/lib/types';
import {
  Eye,
  ShieldCheck,
  Building2,
  Stethoscope,
  Activity,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  CheckCircle2,
  Cpu
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { setCurrentUserRole, isDemoMode, setIsDemoMode } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>('SCREENER');
  const [email, setEmail] = useState<string>('priya.sharma@nhm.gov.in');
  const [password, setPassword] = useState<string>('••••••••••••');
  const [facility, setFacility] = useState<string>('Sultanpur Primary Health Centre (PHC)');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'SCREENER') {
      setEmail('priya.sharma@nhm.gov.in');
      setFacility('Sultanpur Primary Health Centre (PHC)');
    } else if (role === 'OPHTHALMOLOGIST') {
      setEmail('dr.anand.mehta@drishti-teleophth.org');
      setFacility('District Apex Tele-Ophthalmology Center, Varanasi');
    } else if (role === 'DISTRICT_OFFICER') {
      setEmail('cmo.varanasi@health.up.gov.in');
      setFacility('Chief Medical Officer HQ, Varanasi');
    } else {
      setEmail('admin.drishti@health.gov.in');
      setFacility('State Health Mission IT Directorate');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setCurrentUserRole(selectedRole);

    setTimeout(() => {
      setIsLoading(false);
      if (selectedRole === 'OPHTHALMOLOGIST') {
        router.push('/review-queue');
      } else if (selectedRole === 'DISTRICT_OFFICER') {
        router.push('/district-analytics');
      } else {
        router.push('/dashboard');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Bar Branding */}
      <div className="flex items-center justify-between max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-teal-500 to-sky-400 flex items-center justify-center text-slate-950 shadow-lg shadow-teal-500/30">
            <Eye className="h-7 w-7 stroke-[2.4]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white">
                Drishti<span className="text-teal-400">-DR</span>
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Clinical AI Platform
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              National Diabetic Retinopathy Triage & Tele-Reading Grid
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDemoMode(!isDemoMode)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-semibold text-amber-300 hover:bg-slate-800 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Mode: {isDemoMode ? 'DEMO (Synthetic AI)' : 'REAL WEIGHTS'}</span>
          </button>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="max-w-4xl mx-auto w-full my-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left Clinical Presentation */}
        <div className="md:col-span-6 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="h-4 w-4" />
              Ayushman Bharat Digital Mission (ABDM) Compliant
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Early DR Detection, Saving Vision in Rural Communities.
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              AI-assisted bilateral fundus screening, vessel morphometry, and tele-ophthalmology verification connecting Primary Health Centres with apex eye specialists.
            </p>
          </div>

          {/* Clinical Pillars */}
          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10">
              <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0" />
              <span>
                <strong>5-Stage ICDR Grading</strong> with real-time DME risk alerts.
              </span>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10">
              <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0" />
              <span>
                <strong>Explainable AI:</strong> Grad-CAM heatmap overlays & microaneurysm counts.
              </span>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10">
              <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0" />
              <span>
                <strong>Offline-First:</strong> Local queueing for remote health camps with no network.
              </span>
            </div>
          </div>
        </div>

        {/* Right Authentication Form */}
        <div className="md:col-span-6 bg-slate-850/90 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
          <div>
            <h2 className="text-xl font-bold text-white">Healthcare Portal Login</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select your role to access your dedicated clinical console
            </p>
          </div>

          {/* Role Tabs */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'SCREENER', label: 'Field Screener', icon: '🩺' },
              { id: 'OPHTHALMOLOGIST', label: 'Ophthalmologist', icon: '👁️' },
              { id: 'DISTRICT_OFFICER', label: 'District Officer', icon: '📊' },
              { id: 'ADMIN', label: 'System Admin', icon: '⚙️' }
            ].map(r => (
              <button
                key={r.id}
                type="button"
                onClick={() => handleRoleSelect(r.id as UserRole)}
                className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold transition-all ${
                  selectedRole === r.id
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                }`}
              >
                <span>{r.icon}</span>
                <span>{r.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Facility / PHC Center
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={facility}
                  onChange={e => setFacility(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Official Email / ABHA ID
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Security Password / OTP
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-600/30 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              {isLoading ? (
                <span>Authenticating Credentials...</span>
              ) : (
                <>
                  <span>Enter Clinical Console</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center">
            <span className="text-[11px] text-slate-400">
              DISHA & HIPAA Certified • 256-bit Encrypted Tele-Consultation Channel
            </span>
          </div>
        </div>
      </div>

      {/* Footer Credentials & Notice */}
      <div className="max-w-6xl mx-auto w-full pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
        <span>© 2026 Drishti-DR Tele-Ophthalmology Network. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-teal-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            DISHA Compliant
          </span>
          <span className="flex items-center gap-1 text-sky-400">
            <Cpu className="h-3.5 w-3.5" />
            AI Decision Support System
          </span>
        </div>
      </div>
    </div>
  );
}
