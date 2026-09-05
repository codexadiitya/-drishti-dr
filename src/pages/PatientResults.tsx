import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Eye, FileText, UserCheck, ChevronLeft, ChevronRight,
  AlertTriangle, MapPin,
} from 'lucide-react';
import {
  Badge, ConfidenceMeter, ReviewStatusBadge, QualityBadge,
  QualityBar, Stat,
} from '../components/ui/primitives';
import { FundusViewer } from '../components/ui/FundusViewer';
import { MOCK_PATIENTS } from '../lib/mockData';
import { DR_LEVEL_LABELS, DR_LEVEL_COLORS } from '../lib/types';
import type { DRLevel } from '../lib/types';

const DR_SCALE: { level: DRLevel; label: string; desc: string }[] = [
  { level: 0, label: 'No DR', desc: 'No lesions' },
  { level: 1, label: 'Mild', desc: 'MA only' },
  { level: 2, label: 'Moderate', desc: 'More than MA' },
  { level: 3, label: 'Severe', desc: 'No PDR yet' },
  { level: 4, label: 'PDR', desc: 'Neovascularization' },
];

function LesionCard({ name, found, count, confidence, onView }: {
  name: string; found: boolean; count?: number;
  confidence: number; onView?: () => void;
}) {
  return (
    <div className={`rounded-xl border p-4 ${found ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-gray-800">{name}</span>
        {found
          ? <Badge variant="danger" dot>Detected</Badge>
          : <Badge variant="success" dot>Not Detected</Badge>
        }
      </div>
      <div className="flex items-center gap-4">
        {found && count !== undefined && (
          <div>
            <span className="text-[10px] text-gray-400 uppercase tracking-wide">Count</span>
            <span className="text-xl font-bold text-gray-800 font-mono block leading-tight">{count}</span>
          </div>
        )}
        <div className="flex-1">
          <ConfidenceMeter value={confidence} size="sm" />
        </div>
      </div>
      {onView && (
        <button
          onClick={onView}
          className="mt-2 text-[10px] text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors cursor-pointer font-medium"
        >
          <Eye size={10} /> View overlay
        </button>
      )}
    </div>
  );
}

export function PatientResults() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const patient = MOCK_PATIENTS.find(p => p.id === id) ?? MOCK_PATIENTS[0];
  const patientIndex = MOCK_PATIENTS.findIndex(p => p.id === patient.id);

  const [activeTab, setActiveTab] = useState<'assessment' | 'structures' | 'review'>('assessment');
  const [reviewAction, setReviewAction] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [timer] = useState('00:18');

  const drColor = DR_LEVEL_COLORS[patient.drLevel];
  const isUngradable = patient.imageQuality.overall === 'ungradable';

  const prevPatient = MOCK_PATIENTS[patientIndex - 1];
  const nextPatient = MOCK_PATIENTS[patientIndex + 1];

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/queue')}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors cursor-pointer font-medium"
        >
          <ChevronLeft size={15} /> Back to Queue
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900 font-mono">{patient.id}</h1>
            {patient.referable && <Badge variant="danger" size="md" dot>REFERABLE — Clinician review required</Badge>}
            {isUngradable && <Badge variant="neutral">Ungradable Image</Badge>}
          </div>
          <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
            <span>Age {patient.age} · {patient.gender === 'M' ? 'Male' : 'Female'}</span>
            <span>Diabetes duration: {patient.diabetesDuration} years</span>
            <span className="font-mono">{patient.screeningDate} {patient.screeningTime}</span>
            <ReviewStatusBadge status={patient.reviewStatus} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {prevPatient && (
            <button onClick={() => navigate(`/patients/${prevPatient.id}`)}
              className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-300 transition-colors cursor-pointer">
              <ChevronLeft size={15} />
            </button>
          )}
          {nextPatient && (
            <button onClick={() => navigate(`/patients/${nextPatient.id}`)}
              className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-300 transition-colors cursor-pointer">
              <ChevronRight size={15} />
            </button>
          )}
          <button
            onClick={() => navigate('/reports')}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors cursor-pointer card-shadow"
          >
            <FileText size={14} /> Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Fundus viewer */}
        <div className="lg:col-span-1">
          <FundusViewer showControls={!isUngradable} />
          <div className="mt-3 grid grid-cols-3 gap-2">
            <QualityBar label="Focus" value={patient.imageQuality.focus} />
            <QualityBar label="Illumination" value={patient.imageQuality.illumination} />
            <QualityBar label="FoV" value={patient.imageQuality.fieldOfView} />
          </div>
        </div>

        {/* Center: DR assessment + tabs */}
        <div className="lg:col-span-2 space-y-4">
          {/* DR Assessment card */}
          {!isUngradable && (
            <div className="bg-white border border-gray-200 rounded-xl p-5 card-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1 font-semibold">AI-Assisted DR Assessment</p>
                  <h2 className="text-lg font-bold text-gray-900 leading-snug">{patient.drLabel}</h2>
                </div>
                <div className="text-right">
                  <div className={`text-4xl font-bold font-mono ${drColor}`}>{patient.drLevel}<span className="text-xl text-gray-300">/4</span></div>
                  <div className="text-xs text-gray-400 mt-0.5">DR Level</div>
                </div>
              </div>

              <div className="mb-4">
                <ConfidenceMeter value={patient.confidence} size="lg" />
              </div>

              {/* DR Scale */}
              <div className="flex gap-1.5 mt-3">
                {DR_SCALE.map(s => (
                  <div key={s.level} className={`flex-1 rounded-lg p-2 border text-center transition-colors ${
                    s.level === patient.drLevel
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-gray-50 border-gray-100'
                  }`}>
                    <div className={`text-xs font-bold ${s.level === patient.drLevel ? 'text-blue-700' : 'text-gray-400'}`}>
                      L{s.level}
                    </div>
                    <div className={`text-[9px] mt-0.5 ${s.level === patient.drLevel ? 'text-blue-600' : 'text-gray-400'}`}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
                <p className="text-xs text-amber-700">
                  AI-assisted assessment only. Clinician confirmation required before clinical decisions. Model prediction — not a diagnostic guarantee.
                </p>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden card-shadow">
            <div className="flex border-b border-gray-100">
              {[
                { key: 'assessment', label: 'Lesion Evidence', icon: AlertTriangle },
                { key: 'structures', label: 'Retinal Structures', icon: Eye },
                { key: 'review', label: 'Clinical Review', icon: UserCheck },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as typeof activeTab)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm transition-colors cursor-pointer border-b-2 ${
                    activeTab === key
                      ? 'bg-blue-50 text-blue-700 border-blue-500 font-semibold'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50 border-transparent'
                  }`}
                >
                  <Icon size={14} />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>

            <div className="p-4">
              {/* Lesion Evidence */}
              {activeTab === 'assessment' && (
                <div className="space-y-3">
                  <p className="text-xs text-gray-400">AI-associated evidence for the model prediction. Not a clinical diagnosis.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <LesionCard
                      name="Microaneurysms"
                      found={patient.lesions.microaneurysms.detected}
                      count={patient.lesions.microaneurysms.count}
                      confidence={patient.lesions.microaneurysms.confidence}
                    />
                    <LesionCard
                      name="Hemorrhages"
                      found={patient.lesions.hemorrhages.detected}
                      count={patient.lesions.hemorrhages.count}
                      confidence={patient.lesions.hemorrhages.confidence}
                    />
                    <LesionCard
                      name="Exudates"
                      found={patient.lesions.exudates.detected}
                      count={patient.lesions.exudates.count}
                      confidence={patient.lesions.exudates.confidence}
                    />
                    <LesionCard
                      name="Neovascularization"
                      found={patient.lesions.neovascularization.detected}
                      confidence={patient.lesions.neovascularization.confidence}
                    />
                  </div>
                </div>
              )}

              {/* Retinal Structures */}
              {activeTab === 'structures' && (
                <div className="space-y-3">
                  <p className="text-xs text-gray-400">Retinal structure localization from segmentation module.</p>
                  {[
                    { name: 'Optic Disc', data: patient.retinalStructures.opticDisc, icon: '●' },
                    { name: 'Fovea / Macula', data: patient.retinalStructures.fovea, icon: '◎' },
                  ].map(({ name, data, icon }) => (
                    <div key={name} className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-lg shadow-sm">
                        {icon}
                      </div>
                      <div className="flex-1 grid grid-cols-3 gap-4">
                        <Stat label="Structure" value={name} />
                        <Stat label="Status" value={data.detected ? 'Detected' : 'Not found'} />
                        <div className="w-full">
                          <ConfidenceMeter value={data.confidence} size="sm" />
                        </div>
                      </div>
                      {data.location !== 'N/A' && (
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-mono">
                          <MapPin size={10} /> {data.location}
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-400 shadow-sm">
                      <Eye size={18} />
                    </div>
                    <div className="flex-1 grid grid-cols-3 gap-4">
                      <Stat label="Structure" value="Retinal Vessels" />
                      <Stat label="Status" value={patient.retinalStructures.vessels.segmented ? 'Segmented' : 'Failed'} />
                      <ConfidenceMeter value={patient.retinalStructures.vessels.confidence} size="sm" />
                    </div>
                  </div>
                </div>
              )}

              {/* Clinical Review */}
              {activeTab === 'review' && (
                <div className="space-y-4">
                  <div className={`flex items-center justify-between p-4 rounded-xl border ${patient.referable ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-0.5">AI Recommendation</p>
                      <p className={`text-base font-bold ${patient.referable ? 'text-red-700' : 'text-green-700'}`}>
                        {patient.referable ? 'REFER to Ophthalmologist' : 'Monitor — Non-referable'}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {patient.referable
                          ? 'Referable diabetic retinopathy detected by AI model.'
                          : 'No referable findings identified by AI model.'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 font-mono">Review timer</p>
                      <p className="text-xl font-mono font-bold text-blue-600">{timer}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { action: 'confirm', label: 'Confirm AI Assessment', color: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' },
                      { action: 'modify', label: 'Modify Assessment', color: 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50' },
                      { action: 'recapture', label: 'Request Recapture', color: 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50' },
                      { action: 'refer', label: 'Refer to Ophthalmologist', color: 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100' },
                      { action: 'followup', label: 'Mark for Follow-up', color: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100' },
                    ].map(({ action, label, color }) => (
                      <button
                        key={action}
                        onClick={() => setReviewAction(action)}
                        className={`px-3 py-2.5 text-xs font-semibold border rounded-lg transition-colors cursor-pointer text-left ${color} ${reviewAction === action ? 'ring-2 ring-blue-400 ring-offset-1' : ''}`}
                      >
                        {label}
                        {reviewAction === action && <span className="block text-[10px] text-blue-600 mt-0.5 font-normal">✓ Selected</span>}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="text-xs text-gray-600 font-semibold block mb-1.5">Review Notes</label>
                    <textarea
                      value={reviewNotes}
                      onChange={e => setReviewNotes(e.target.value)}
                      placeholder="Add clinical observations, modifications, or referral notes…"
                      rows={3}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none font-sans transition-all"
                    />
                  </div>

                  <button
                    disabled={!reviewAction}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-100 disabled:text-gray-400 text-white text-sm font-bold rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed shadow-sm"
                  >
                    Submit Clinical Review
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
