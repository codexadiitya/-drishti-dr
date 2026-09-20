import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ScanEye, Lock, Mail, ArrowRight, ShieldCheck, Stethoscope,
  Users, HeartPulse, Sparkles,
} from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import type { UserRole } from '../lib/types';

export function Login() {
  const navigate = useNavigate();
  const { setUserRole } = useAppState();

  const [email, setEmail] = useState('doctor@netrarakshaq.in');
  const [password, setPassword] = useState('demo2026');
  const [loading, setLoading] = useState(false);

  function handleSignIn(role: UserRole = 'doctor') {
    setUserRole(role);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (role === 'doctor') {
        navigate('/doctor');
      } else if (role === 'patient') {
        navigate('/patient-portal');
      } else {
        navigate('/');
      }
    }, 400);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col items-center justify-center p-4">
      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl card-shadow-md border border-gray-100 overflow-hidden">
        {/* Brand Header */}
        <div className="bg-gradient-to-br from-blue-700 to-indigo-800 px-8 py-8 text-white text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shadow-xs">
              <ScanEye size={24} className="text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">NetraRakshaq</span>
          </div>
          <p className="text-blue-100 text-xs font-semibold uppercase tracking-wider">
            AI-Assisted Diabetic Retinopathy Screening
          </p>
          <p className="text-blue-200 text-[11px] mt-1">
            SIH Problem Statement 26038 · Designed for Rural India
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-5">
          <div>
            <h2 className="text-base font-bold text-gray-900">Sign in to Platform</h2>
            <p className="text-xs text-gray-400">Access role-tailored telemedicine dashboards</p>
          </div>

          {/* Quick 1-Click Role Login for SIH Demonstration */}
          <div className="space-y-2 p-3.5 bg-blue-50/70 rounded-xl border border-blue-100">
            <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wide flex items-center gap-1">
              <Sparkles size={12} className="text-blue-600" />
              1-Click Demo Persona Sign-In:
            </span>
            <div className="grid grid-cols-1 gap-1.5">
              <button
                type="button"
                onClick={() => handleSignIn('health_worker')}
                className="w-full py-2 px-3 bg-white hover:bg-blue-100/50 border border-blue-200 rounded-lg text-xs text-blue-950 font-bold flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Users size={14} className="text-blue-700" /> Health Worker (PHC Field Unit)
                </span>
                <ArrowRight size={12} className="text-blue-500" />
              </button>

              <button
                type="button"
                onClick={() => handleSignIn('doctor')}
                className="w-full py-2 px-3 bg-white hover:bg-blue-100/50 border border-blue-200 rounded-lg text-xs text-blue-950 font-bold flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Stethoscope size={14} className="text-blue-700" /> Ophthalmologist / Reviewer
                </span>
                <ArrowRight size={12} className="text-blue-500" />
              </button>

              <button
                type="button"
                onClick={() => handleSignIn('patient')}
                className="w-full py-2 px-3 bg-white hover:bg-blue-100/50 border border-blue-200 rounded-lg text-xs text-blue-950 font-bold flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <HeartPulse size={14} className="text-blue-700" /> Patient Companion Portal
                </span>
                <ArrowRight size={12} className="text-blue-500" />
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-3 text-[10px] text-gray-400 uppercase font-mono">Or standard login</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <form onSubmit={e => { e.preventDefault(); handleSignIn('doctor'); }} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-blue-500 text-gray-800"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-blue-500 text-gray-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
            >
              Sign In to NetraRakshaq <ArrowRight size={14} />
            </button>
          </form>
        </div>
      </div>

      <p className="mt-5 text-[11px] text-gray-400 text-center max-w-sm">
        AI assists. Doctor decides. Complete clinical workflow for rural diabetic retinopathy prevention.
      </p>
    </div>
  );
}
