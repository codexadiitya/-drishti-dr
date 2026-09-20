import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Stethoscope, Clock, CheckCircle2, Edit3, RefreshCw, Send,
  AlertTriangle, ChevronLeft, ChevronRight, FileText, UserCheck,
  ShieldCheck, Eye, HelpCircle, ArrowLeft, History,
} from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { FundusViewer, type OverlayMode } from '../components/ui/FundusViewer';
import { ClinicalEvidence } from '../components/ui/ClinicalEvidence';
import { Badge, ConfidenceMeter, QualityBar } from '../components/ui/primitives';
import { DR_LEVEL_LABELS, DR_LEVEL_BG_BADGES, type DRLevel, type ReferralPriority } from '../lib/types';

export function DoctorReview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { patients, updateDoctorReview } = useAppState();

  const patient = patients.find(p => p.id === id) || patients[0];
  const patientIndex = patients.findIndex(p => p.id === patient.id);
  const prevPatient = patients[patientIndex - 1];
  const nextPatient = patients[patientIndex + 1];

  // Review screen states
  const [selectedOverlay, setSelectedOverlay] = useState<OverlayMode>('gradcam');
  const [reviewAction, setReviewAction] = useState<'confirm' | 'modify' | 'recapture' | 'refer' | null>(null);
  const [modifiedDRLevel, setModifiedDRLevel] = useState<DRLevel>(patient.drLevel);
  const [doctorNotes, setDoctorNotes] = useState(patient.reviewNotes || '');
  const [referralPriority, setReferralPriority] = useState<ReferralPriority>('high');
  const [referralCenter, setReferralCenter] = useState('District Eye Hospital, Aundh, Pune');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // 30s UX review timer (UX target per Section 27)
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed(s => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  function handleDecisionSubmit() {
    if (!reviewAction) return;

    updateDoctorReview(patient.id, reviewAction, {
      modifiedLevel: reviewAction === 'modify' ? modifiedDRLevel : undefined,
      notes: doctorNotes,
      reviewerName: 'Dr. A. Sharma (Ophthalmologist)',
      referralPriority: reviewAction === 'refer' ? referralPriority : undefined,
      referralCenter: reviewAction === 'refer' ? referralCenter : undefined,
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      if (nextPatient) {
        navigate(`/doctor/review/${nextPatient.id}`);
      } else {
        navigate('/doctor');
      }
    }, 1200);
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4">
      {/* Top Banner: Doctor in the Loop (Section 26) */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-xl px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
            <Stethoscope size={20} className="text-blue-300" />
          </div>
          <div>
            <div className="text-xs text-blue-200 uppercase tracking-widest font-bold">
              Doctor-in-the-Loop Clinical Review
            </div>
            <div className="text-sm sm:text-base font-bold text-white">
              AI assists. Doctor decides.
            </div>
          </div>
        </div>

        {/* 30-Second Review Timer (Section 27) */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="text-right">
            <div className="text-[10px] text-blue-200 uppercase tracking-wider font-mono">Review Duration</div>
            <div className={`font-mono text-sm font-bold ${secondsElapsed > 30 ? 'text-amber-300' : 'text-emerald-300'}`}>
              00:{secondsElapsed.toString().padStart(2, '0')} <span className="text-[10px] text-blue-200 font-normal">(&lt;30s UX Target)</span>
            </div>
          </div>
          <Badge variant="info">Ophthalmologist Gate</Badge>
        </div>
      </div>

      {/* Navigation & Patient Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200 card-shadow">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/doctor')}
            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer"
            title="Back to Review Queue"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900 font-mono">{patient.id}</h2>
              <span className="text-xs text-gray-500 font-medium">({patient.name})</span>
              <span className={`px-2 py-0.5 rounded text-xs font-bold border ${DR_LEVEL_BG_BADGES[patient.drLevel]}`}>
                L{patient.drLevel} · {patient.drLabel.split(' ')[0]}
              </span>
              {patient.referable && (
                <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded border border-red-200">
                  REFERABLE
                </span>
              )}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              Age {patient.age}y · {patient.gender === 'M' ? 'Male' : 'Female'} · Diabetes {patient.diabetesDuration}y (HbA1c {patient.hba1c || 8.1}%) · Location: {patient.phcLocation || 'Khed PHC'}
            </div>
          </div>
        </div>

        {/* Previous / Next Case Switcher */}
        <div className="flex items-center gap-2">
          {prevPatient && (
            <button
              onClick={() => navigate(`/doctor/review/${prevPatient.id}`)}
              className="px-2.5 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft size={14} /> Prev ({prevPatient.id})
            </button>
          )}
          {nextPatient && (
            <button
              onClick={() => navigate(`/doctor/review/${nextPatient.id}`)}
              className="px-2.5 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors flex items-center gap-1 cursor-pointer"
            >
              Next ({nextPatient.id}) <ChevronRight size={14} />
            </button>
          )}
          <button
            onClick={() => navigate('/reports')}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FileText size={14} /> Report
          </button>
        </div>
      </div>

      {/* Main Review Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Retinal Image with Interactive Overlays (Section 25) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4 card-shadow space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide flex items-center gap-1.5">
                <Eye size={15} className="text-blue-600" />
                Diagnostic Optical Fundus Inspection
              </h3>
              <span className="text-[11px] font-mono text-gray-400">Eye: {patient.eye || 'OD'}</span>
            </div>

            <FundusViewer
              defaultMode={selectedOverlay}
              eye={patient.eye === 'Both' ? 'OD' : (patient.eye || 'OD')}
              imageUrl={selectedOverlay === 'gradcam' ? (patient.gradcamUrl || patient.imageUrl) : (patient.enhancedImageUrl || patient.imageUrl)}
              onModeChange={m => setSelectedOverlay(m)}
            />

            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Pre-Inference Quality Index:</span>
                <span className="font-bold text-emerald-700 font-mono">{patient.imageQuality.score}% (Gradable)</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[10px]">
                <div>Focus: <strong>{patient.imageQuality.focus}%</strong></div>
                <div>Illumination: <strong>{patient.imageQuality.illumination}%</strong></div>
                <div>FoV: <strong>{patient.imageQuality.fieldOfView}%</strong></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Clinical Evidence & Decision Actions (Section 24, 26, 28) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Integrated Evidence */}
          <ClinicalEvidence
            patient={patient}
            onSelectOverlay={mode => setSelectedOverlay(mode)}
          />

          {/* DOCTOR FINAL CLINICAL DECISION ACTION PANEL (Section 26 & 28) */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 card-shadow space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck size={18} className="text-blue-600" />
                <h3 className="text-sm font-bold text-gray-900">Final Clinical Decision & Sign-off</h3>
              </div>
              <span className="text-xs text-gray-500">Ophthalmologist: Dr. A. Sharma (Reg. #MH-42901)</span>
            </div>

            {/* Decision Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setReviewAction('confirm')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                  reviewAction === 'confirm'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <CheckCircle2 size={18} />
                <span>Confirm AI Result</span>
              </button>

              <button
                type="button"
                onClick={() => setReviewAction('modify')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                  reviewAction === 'modify'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
                }`}
              >
                <Edit3 size={18} />
                <span>Modify DR Level</span>
              </button>

              <button
                type="button"
                onClick={() => setReviewAction('recapture')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                  reviewAction === 'recapture'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                    : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                }`}
              >
                <RefreshCw size={18} />
                <span>Request Recapture</span>
              </button>

              <button
                type="button"
                onClick={() => setReviewAction('refer')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                  reviewAction === 'refer'
                    ? 'bg-red-600 text-white border-red-600 shadow-sm'
                    : 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100'
                }`}
              >
                <Send size={18} />
                <span>Refer to Specialist</span>
              </button>
            </div>

            {/* Modify severity selector */}
            {reviewAction === 'modify' && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-2 text-xs">
                <span className="font-bold text-blue-900">Select Doctor-Corrected DR Severity:</span>
                <div className="grid grid-cols-5 gap-1.5">
                  {([0, 1, 2, 3, 4] as DRLevel[]).map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setModifiedDRLevel(lvl)}
                      className={`py-2 px-1 rounded-lg text-center font-bold text-xs border transition-colors cursor-pointer ${
                        modifiedDRLevel === lvl
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div>L{lvl}</div>
                      <div className="text-[9px] truncate font-normal">{DR_LEVEL_LABELS[lvl]}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Referral Triage details */}
            {reviewAction === 'refer' && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-2.5 text-xs">
                <span className="font-bold text-red-900">Specialist Referral Prioritization:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Priority Triage:</label>
                    <select
                      value={referralPriority}
                      onChange={e => setReferralPriority(e.target.value as any)}
                      className="w-full p-2 bg-white border border-gray-300 rounded-lg outline-none cursor-pointer"
                    >
                      <option value="urgent">Urgent (&lt;72 Hours · PDR / Severe NPDR)</option>
                      <option value="high">High (1–2 Weeks · Moderate NPDR with Macular Threat)</option>
                      <option value="routine">Routine (3–4 Weeks · Non-urgent evaluation)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Referral Tertiary Hospital:</label>
                    <input
                      type="text"
                      value={referralCenter}
                      onChange={e => setReferralCenter(e.target.value)}
                      className="w-full p-2 bg-white border border-gray-300 rounded-lg outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Doctor clinical notes */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Clinical Examination Notes & Directives for Patient / Field Worker:
              </label>
              <textarea
                rows={2}
                value={doctorNotes}
                onChange={e => setDoctorNotes(e.target.value)}
                placeholder="Enter clinical assessment, specific macular concerns, or lifestyle/follow-up recommendations…"
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 outline-none focus:border-blue-500"
              />
            </div>

            {/* Commit Decision Button */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-gray-400">
                Action will be permanently recorded in patient audit trail.
              </span>
              <button
                type="button"
                disabled={!reviewAction}
                onClick={handleDecisionSubmit}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                {savedSuccess ? '✓ Decision Saved!' : 'Sign & Submit Clinical Decision →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
