import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HeartPulse, Calendar, FileText, Phone, MapPin, CheckCircle2,
  AlertTriangle, Clock, ChevronRight, ShieldCheck, Download,
  ExternalLink, Sparkles, AlertCircle, HelpCircle,
} from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { DR_LEVEL_LABELS } from '../lib/types';

export function PatientPortal() {
  const navigate = useNavigate();
  const { patients, appointments, activePatientId, setActivePatientId } = useAppState();

  const patient = patients.find(p => p.id === activePatientId) || patients[0];
  const patientAppointments = appointments.filter(a => a.patientId === patient.id);

  // Generate patient-friendly next action guidance (Section 32)
  const getNextActionGuidance = () => {
    if (patient.reviewStatus === 'recapture') {
      return {
        title: 'Retake Eye Photograph Recommended',
        badge: 'Recapture Needed',
        badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
        action: 'Please visit your local PHC health worker to retake the eye photo. The previous image had slight blur, and we want to ensure complete accuracy.',
        severity: 'warning',
        cta: 'Contact Health Worker',
      };
    }
    if (patient.reviewStatus === 'pending') {
      return {
        title: 'Awaiting Specialist Doctor Review',
        badge: 'Doctor Reviewing',
        badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
        action: 'Your retinal scan has been recorded and is currently in line for ophthalmologist evaluation. You will receive an SMS update once verified.',
        severity: 'info',
        cta: 'Check Status Later',
      };
    }
    if (patient.referable || patient.drLevel >= 2) {
      return {
        title: 'Specialist Eye Examination Recommended',
        badge: 'Action Required',
        badgeColor: 'bg-red-100 text-red-900 border-red-300',
        action: `Your retinal check showed signs of diabetic retinopathy (${patient.drLabel}). It is very important to visit a specialist eye doctor at ${patient.referral?.center || 'District Eye Hospital'} for a thorough dilated checkup. Early treatment prevents vision loss.`,
        severity: 'urgent',
        cta: 'View Appointment Details',
      };
    }
    return {
      title: 'No Urgent Retinal Changes Detected',
      badge: 'Healthy Routine',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      action: 'Great news! No severe diabetic damage was found in your retina today. Please continue regular blood sugar management and return in 12 months for your annual eye checkup.',
      severity: 'success',
      cta: 'Set 1-Year Reminder',
    };
  };

  const guidance = getNextActionGuidance();

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      {/* Patient Switcher (for demo convenience) */}
      <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-200 card-shadow text-xs">
        <div className="flex items-center gap-2">
          <HeartPulse size={16} className="text-blue-600" />
          <span className="font-bold text-gray-800">Viewing Patient Portal as:</span>
        </div>
        <select
          value={patient.id}
          onChange={e => setActivePatientId(e.target.value)}
          className="font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-2.5 py-1 outline-none cursor-pointer"
        >
          {patients.map(p => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.id}) · {p.drLabel.split(' ')[0]}
            </option>
          ))}
        </select>
      </div>

      {/* Hero Welcome Card */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-1">
          <span className="text-xs text-blue-200 uppercase tracking-widest font-semibold">
            NetraRakshaq Patient Companion
          </span>
          <h1 className="text-2xl font-bold">Namaste, {patient.name} 🙏</h1>
          <p className="text-xs text-blue-100 max-w-lg mt-1 leading-relaxed">
            Here is your simple summary of your diabetic eye screening performed at{' '}
            <strong className="text-white">{patient.phcLocation || 'Khed PHC'}</strong> on {patient.screeningDate}.
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-white/20 flex flex-wrap gap-4 text-xs text-blue-100">
          <div>Patient ID: <strong className="text-white font-mono">{patient.id}</strong></div>
          <div>Age: <strong className="text-white">{patient.age} years</strong></div>
          <div>Diabetes Duration: <strong className="text-white">{patient.diabetesDuration} years</strong></div>
        </div>
      </div>

      {/* WHAT SHOULD I DO NEXT? (Section 32) */}
      <div className={`p-6 rounded-2xl border card-shadow-md space-y-4 ${
        guidance.severity === 'urgent'
          ? 'bg-red-50/90 border-red-200 text-red-950'
          : guidance.severity === 'warning'
          ? 'bg-amber-50/90 border-amber-200 text-amber-950'
          : guidance.severity === 'info'
          ? 'bg-blue-50/90 border-blue-200 text-blue-950'
          : 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
      }`}>
        <div className="flex items-center justify-between">
          <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${guidance.badgeColor}`}>
            {guidance.badge}
          </span>
          <span className="text-xs font-semibold text-gray-500">Care Directive</span>
        </div>

        <div className="space-y-1.5">
          <h2 className="text-lg font-bold flex items-center gap-2">
            {guidance.severity === 'urgent' && <AlertTriangle size={20} className="text-red-600" />}
            {guidance.severity === 'warning' && <AlertCircle size={20} className="text-amber-600" />}
            {guidance.severity === 'success' && <CheckCircle2 size={20} className="text-emerald-600" />}
            {guidance.severity === 'info' && <Clock size={20} className="text-blue-600" />}
            {guidance.title}
          </h2>
          <p className="text-sm leading-relaxed text-gray-800">
            {guidance.action}
          </p>
        </div>

        {patient.reviewNotes && (
          <div className="p-3 bg-white rounded-xl border border-gray-200 text-xs text-gray-700 space-y-1">
            <span className="font-bold text-gray-900 block">Doctor's Clinical Advice:</span>
            <p className="italic leading-relaxed text-gray-600">"{patient.reviewNotes}"</p>
            <span className="text-[10px] text-gray-400 block mt-1">— Reviewed by {patient.reviewedBy || 'Dr. A. Sharma'}</span>
          </div>
        )}
      </div>

      {/* Two column: Appointments & Download Report */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Appointments Section (Section 33) */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 card-shadow space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-blue-600" />
              <h3 className="text-sm font-bold text-gray-900">Upcoming Visits & Appointments</h3>
            </div>
          </div>

          {patientAppointments.length > 0 || patient.referral?.appointmentDate ? (
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">
                  {patient.referral?.priority === 'urgent' ? 'Urgent Hospital Consultation' : 'Specialist Eye Checkup'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  Confirmed
                </span>
              </div>
              <div className="text-gray-700 flex items-center gap-1.5 font-medium">
                <Calendar size={13} className="text-gray-500" />
                Date: {patient.referral?.appointmentDate || '2026-09-12'} at {patient.referral?.appointmentTime || '10:00 AM'}
              </div>
              <div className="text-gray-700 flex items-start gap-1.5">
                <MapPin size={13} className="text-gray-500 mt-0.5 flex-shrink-0" />
                <span>{patient.referral?.center || 'District Eye Hospital, Aundh, Pune'}</span>
              </div>
              <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-blue-700 font-medium">
                <span className="flex items-center gap-1 text-[11px]">
                  <Phone size={11} /> PHC Helpline: 1800-209-1122
                </span>
                <span className="text-[11px] underline cursor-pointer">SMS Reminder Sent</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-500 p-4 bg-gray-50 rounded-xl text-center">
              No hospital referral appointments required at this time. Routine checkup due in 12 months.
            </p>
          )}
        </div>

        {/* Screening Report Download (Section 34) */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 card-shadow space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-blue-600" />
              <h3 className="text-sm font-bold text-gray-900">Official Screening Report</h3>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Download your verified medical report with fundus photographs, doctor notes, and clinical evidence.
            </p>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs flex items-center justify-between">
            <span className="font-mono text-gray-600">Report ID: NR-{patient.id}</span>
            <span className="text-[10px] text-gray-400">PDF Format</span>
          </div>

          <button
            onClick={() => navigate('/reports')}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Download size={14} /> View & Download Full Report
          </button>
        </div>
      </div>

      {/* Diabetic Eye Health Guidelines */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 card-shadow space-y-3">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
          Diabetic Eye Care Tips for Patients:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-700">
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
            <strong className="block text-gray-900 mb-1">1. Keep Sugar Under Control</strong>
            Maintain target HbA1c below 7.0%. High blood sugar damages tiny retinal blood vessels over time.
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
            <strong className="block text-gray-900 mb-1">2. Annual Eye Checkup</strong>
            Diabetic retinopathy causes zero pain in early stages. An annual photo scan catches issues early.
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
            <strong className="block text-gray-900 mb-1">3. Watch for Warning Signs</strong>
            See a doctor immediately if you notice sudden dark floaters, blurry vision, or dark spots in vision.
          </div>
        </div>
      </div>
    </div>
  );
}
