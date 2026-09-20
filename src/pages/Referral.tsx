import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Send, AlertTriangle, CheckCircle2, Calendar, MapPin,
  Clock, Phone, Building2, UserCheck, ShieldCheck, ChevronLeft,
} from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { CarePathwayTracker } from '../components/ui/CarePathwayTracker';
import { Badge } from '../components/ui/primitives';
import type { ReferralPriority } from '../lib/types';

const REFERRAL_CENTRES = [
  { id: 'dh_pune', name: 'District Eye Hospital, Aundh, Pune', dist: '18 km', type: 'Secondary Government' },
  { id: 'sassoon', name: 'Sassoon General Hospital & Regional Eye Institute, Pune', dist: '34 km', type: 'Tertiary Academic' },
  { id: 'apex_vr', name: 'Apex Vitreoretinal Institute, Pune', dist: '28 km', type: 'Specialized Retina' },
  { id: 'khed_sdh', name: 'Khed Sub-District Hospital Tele-Optha Unit', dist: '6 km', type: 'Sub-District PHC Hub' },
];

export function Referral() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { patients, updateDoctorReview, scheduleAppointment } = useAppState();

  const patient = patients.find(p => p.id === id) || patients[0];

  const [priority, setPriority] = useState<ReferralPriority>(
    patient.drLevel >= 3 ? 'urgent' : patient.referable ? 'high' : 'routine'
  );
  const [center, setCenter] = useState(patient.referral?.center || REFERRAL_CENTRES[0].name);
  const [appointmentDate, setAppointmentDate] = useState(
    patient.referral?.appointmentDate || new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0]
  );
  const [appointmentTime, setAppointmentTime] = useState(patient.referral?.appointmentTime || '10:00 AM');
  const [reason, setReason] = useState(
    patient.referral?.reason ||
      `Referable DR (Level ${patient.drLevel} · ${patient.drLabel}). Dilated fundus examination and OCT evaluation requested.`
  );
  const [confirmed, setConfirmed] = useState(false);

  function handleConfirmReferral(e: React.FormEvent) {
    e.preventDefault();

    updateDoctorReview(patient.id, 'refer', {
      referralPriority: priority,
      referralCenter: center,
      notes: reason,
    });

    scheduleAppointment({
      patientId: patient.id,
      patientName: patient.name,
      date: appointmentDate,
      time: appointmentTime,
      center,
      type: 'specialist_review',
      priority,
      status: 'confirmed',
      notes: reason,
    });

    setConfirmed(true);
    setTimeout(() => {
      navigate(`/doctor/review/${patient.id}`);
    }, 1500);
  }

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-5">
      {/* Back button */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 rounded-lg border border-gray-200 hover:bg-white text-gray-600 transition-colors cursor-pointer"
        >
          <ChevronLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Smart Referral & Care Pathway</h1>
          <p className="text-xs text-gray-500">
            Facilitating tertiary ophthalmology linkage for <span className="font-bold text-gray-800">{patient.name}</span> ({patient.id})
          </p>
        </div>
      </div>

      <CarePathwayTracker currentStep="referral" />

      <form onSubmit={handleConfirmReferral} className="bg-white border border-gray-200 rounded-xl p-6 card-shadow space-y-6">
        {/* Referral Triage Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <Send size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Clinical Referral Prioritization</h2>
              <p className="text-xs text-gray-500">Triage based on DR severity and macular proximity</p>
            </div>
          </div>
          <Badge variant={patient.referable ? 'danger' : 'neutral'}>
            {patient.drLabel} (Level {patient.drLevel})
          </Badge>
        </div>

        {/* Priority options */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-700">Select Urgency Triage Level:</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {[
              {
                id: 'urgent',
                label: 'Urgent Referral',
                timeline: '< 72 Hours',
                desc: 'Proliferative DR (Level 4), severe pre-retinal hemorrhage, or active disc neovascularization.',
                color: 'border-red-500 bg-red-50/50 text-red-900',
              },
              {
                id: 'high',
                label: 'High Priority',
                timeline: '1 – 2 Weeks',
                desc: 'Severe NPDR (Level 3) or Moderate NPDR with exudates threatening central fovea.',
                color: 'border-amber-500 bg-amber-50/50 text-amber-900',
              },
              {
                id: 'routine',
                label: 'Routine Consultation',
                timeline: '3 – 4 Weeks',
                desc: 'Confirmed non-urgent referable diabetic retinopathy requiring comprehensive baseline dilated exam.',
                color: 'border-blue-500 bg-blue-50/50 text-blue-900',
              },
            ].map(p => (
              <div
                key={p.id}
                onClick={() => setPriority(p.id as ReferralPriority)}
                className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                  priority === p.id ? p.color + ' ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold">{p.label}</span>
                  <span className="font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white/80 border">
                    {p.timeline}
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Hospital Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-700">Select Regional Eye Hospital / Specialist Centre:</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {REFERRAL_CENTRES.map(c => (
              <div
                key={c.id}
                onClick={() => setCenter(c.name)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  center === c.name ? 'border-blue-600 bg-blue-50/60 font-semibold' : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-900 font-bold">{c.name}</span>
                  <span className="text-[10px] text-gray-400 font-mono">{c.dist}</span>
                </div>
                <span className="text-[11px] text-gray-500 block mt-0.5">{c.type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Target Consultation Date:</label>
            <input
              type="date"
              required
              value={appointmentDate}
              onChange={e => setAppointmentDate(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Target Time Slot:</label>
            <select
              value={appointmentTime}
              onChange={e => setAppointmentTime(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="09:00 AM">09:00 AM (Morning Clinic)</option>
              <option value="10:30 AM">10:30 AM (Regular Slot)</option>
              <option value="01:30 PM">01:30 PM (Afternoon Retina Clinic)</option>
              <option value="03:00 PM">03:00 PM (Late Session)</option>
            </select>
          </div>
        </div>

        {/* Referral Reason / Clinical Summary */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Clinical Reason & Specific Findings for Referral:
          </label>
          <textarea
            rows={3}
            required
            value={reason}
            onChange={e => setReason(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 outline-none focus:border-blue-500"
          />
        </div>

        {/* CTA */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-[11px] text-gray-400">
            Triggers automated SMS notice to patient ({patient.phone}) & hospital intake coordinator.
          </span>
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-2 shadow-sm"
          >
            {confirmed ? '✓ Referral Booked!' : 'Confirm Referral & Book Slot →'}
          </button>
        </div>
      </form>
    </div>
  );
}
