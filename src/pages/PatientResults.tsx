import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Eye, FileText, UserCheck, ChevronLeft, ChevronRight,
  AlertTriangle, MapPin, Send, HelpCircle, ArrowRight,
  ShieldCheck, BrainCircuit,
} from 'lucide-react';
import { Badge, ConfidenceMeter, ReviewStatusBadge, QualityBar } from '../components/ui/primitives';
import { FundusViewer, type OverlayMode } from '../components/ui/FundusViewer';
import { ClinicalEvidence } from '../components/ui/ClinicalEvidence';
import { CarePathwayTracker } from '../components/ui/CarePathwayTracker';
import { useAppState } from '../context/AppStateContext';
import { DR_LEVEL_LABELS, DR_LEVEL_BG_BADGES, type DRLevel } from '../lib/types';

export function PatientResults() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { patients } = useAppState();

  const patient = patients.find(p => p.id === id) || patients[0];
  const patientIndex = patients.findIndex(p => p.id === patient.id);
  const prevPatient = patients[patientIndex - 1];
  const nextPatient = patients[patientIndex + 1];

  const [selectedOverlay, setSelectedOverlay] = useState<OverlayMode>('gradcam');
  const isUngradable = patient.imageQuality.overall === 'ungradable';

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200 card-shadow">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/queue')}
            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
            title="Back to Screening Queue"
          >
            <ChevronLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900 font-mono">{patient.id}</h1>
              <span className="text-xs text-gray-600 font-medium">({patient.name})</span>
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold border ${DR_LEVEL_BG_BADGES[patient.drLevel]}`}>
                L{patient.drLevel} · {patient.drLabel.split(' ')[0]}
              </span>
              {patient.referable && (
                <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded border border-red-200">
                  REFERABLE (Level 2+)
                </span>
              )}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              Age {patient.age}y · {patient.gender === 'M' ? 'Male' : 'Female'} · Diabetes {patient.diabetesDuration}y (HbA1c {patient.hba1c || 8.1}%) · Location: {patient.phcLocation || 'Khed PHC'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {prevPatient && (
            <button
              onClick={() => navigate(`/patients/${prevPatient.id}`)}
              className="px-2.5 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft size={14} /> Prev
            </button>
          )}
          {nextPatient && (
            <button
              onClick={() => navigate(`/patients/${nextPatient.id}`)}
              className="px-2.5 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors flex items-center gap-1 cursor-pointer"
            >
              Next <ChevronRight size={14} />
            </button>
          )}
          <button
            onClick={() => navigate(`/doctor/review/${patient.id}`)}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <UserCheck size={14} /> Doctor Review →
          </button>
          <button
            onClick={() => navigate('/reports')}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FileText size={14} /> Report
          </button>
        </div>
      </div>

      <CarePathwayTracker currentStep={patient.reviewStatus === 'reviewed' ? 'decision' : 'evidence'} />

      {/* Main Grid: Fundus Viewer & Clinical Evidence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Fundus Viewer */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4 card-shadow space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wide flex items-center gap-1.5">
                <Eye size={15} className="text-blue-600" />
                Retinal Fundus Optical Evidence
              </h2>
              <span className="text-[11px] font-mono text-gray-400">Eye: {patient.eye || 'OD'}</span>
            </div>

            <FundusViewer
              defaultMode={selectedOverlay}
              eye={patient.eye === 'Both' ? 'OD' : (patient.eye || 'OD')}
              imageUrl={patient.imageUrl || '/clinical-fundus-bg.jpg'}
              enhancedImageUrl={patient.enhancedImageUrl}
              gradcamUrl={patient.gradcamUrl}
              onModeChange={m => setSelectedOverlay(m)}
            />

            {/* Quality parameters */}
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Image Quality Index:</span>
                <span className="font-bold text-emerald-700 font-mono">{patient.imageQuality.score}% (Gradable)</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[10px]">
                <div>Focus: <strong>{patient.imageQuality.focus}%</strong></div>
                <div>Illumination: <strong>{patient.imageQuality.illumination}%</strong></div>
                <div>FoV: <strong>{patient.imageQuality.fieldOfView}%</strong></div>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 card-shadow space-y-2">
            <span className="text-xs font-bold text-gray-900 block">Next Clinical Action:</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => navigate(`/doctor/review/${patient.id}`)}
                className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer text-center"
              >
                Launch Doctor Review
              </button>
              <button
                onClick={() => navigate(`/referral/${patient.id}`)}
                className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-lg transition-colors cursor-pointer text-center"
              >
                Smart Referral Hub
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Combined Clinical Evidence */}
        <div className="lg:col-span-7">
          <ClinicalEvidence
            patient={patient}
            onSelectOverlay={m => setSelectedOverlay(m)}
          />
        </div>
      </div>
    </div>
  );
}
