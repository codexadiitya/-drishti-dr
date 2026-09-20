import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Printer, Download, Share2, AlertTriangle,
  CheckCircle2, ShieldCheck, MapPin, Eye, Stethoscope, ChevronLeft,
} from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { FundusViewer } from '../components/ui/FundusViewer';
import { DR_LEVEL_LABELS, DR_LEVEL_BG_BADGES } from '../lib/types';

export function Reports() {
  const navigate = useNavigate();
  const { patients, activePatientId, setActivePatientId } = useAppState();

  const [selectedId, setSelectedId] = useState(activePatientId || patients[0]?.id || 'PT-10021');
  const patient = patients.find(p => p.id === selectedId) || patients[0];

  function handlePrint() {
    window.print();
  }

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      {/* Action Header */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-lg border border-gray-200 hover:bg-white text-gray-600 transition-colors cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Clinical Screening Report</h1>
            <p className="text-xs text-gray-500">Official medical tele-ophthalmology screening summary</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedId}
            onChange={e => {
              setSelectedId(e.target.value);
              setActivePatientId(e.target.value);
            }}
            className="text-xs font-semibold text-blue-700 bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none cursor-pointer card-shadow"
          >
            {patients.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.id}) · L{p.drLevel}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            <Printer size={14} /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* Printable Medical Document Sheet (Section 34) */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-10 card-shadow-md space-y-6 text-gray-800">
        {/* Clinic Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-blue-900 pb-4 gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                NR
              </div>
              <h2 className="text-lg font-bold text-blue-950 tracking-tight">
                NetraRakshaq Rural Tele-Ophthalmology Network
              </h2>
            </div>
            <p className="text-xs text-gray-600">
              National Health Mission · Rural Diabetic Retinopathy Screening Camp
            </p>
            <p className="text-[11px] text-gray-500">
              Location: <strong>{patient.phcLocation || 'Khed PHC, Pune District'}</strong>
            </p>
          </div>

          <div className="text-left sm:text-right text-xs">
            <span className="font-mono font-bold text-blue-900 block text-sm">
              REPORT: NR-{patient.id}-{patient.screeningDate.replace(/-/g, '')}
            </span>
            <span className="text-gray-500">Date: {patient.screeningDate} at {patient.screeningTime}</span>
            <span className="text-[10px] text-gray-400 block mt-0.5">AI-Assisted · Doctor Verified</span>
          </div>
        </div>

        {/* Patient Demographics Table */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider block">Patient Name</span>
            <strong className="text-gray-900 text-sm">{patient.name}</strong>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider block">Patient ID</span>
            <strong className="text-gray-900 font-mono text-sm">{patient.id}</strong>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider block">Age / Gender</span>
            <strong className="text-gray-900">{patient.age} Yrs / {patient.gender === 'M' ? 'Male' : 'Female'}</strong>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider block">Contact Phone</span>
            <strong className="text-gray-900 font-mono">{patient.phone}</strong>
          </div>

          <div>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider block">Diabetes Type / Duration</span>
            <strong className="text-gray-900">{patient.diabetesType || 'Type 2'} ({patient.diabetesDuration} Years)</strong>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider block">Recent HbA1c</span>
            <strong className="text-gray-900 font-mono">{patient.hba1c || 8.1}%</strong>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider block">Eye Examined</span>
            <strong className="text-gray-900">{patient.eye === 'Both' ? 'Both Eyes (OU)' : patient.eye || 'OD'}</strong>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider block">Quality Index</span>
            <strong className="text-emerald-700 font-mono">{patient.imageQuality.score}% (Gradable)</strong>
          </div>
        </div>

        {/* Diagnosis & Findings Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-1.5">
            <span className="text-[10px] text-blue-700 font-bold uppercase tracking-wider">
              Diagnostic Retinopathy Assessment
            </span>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-gray-900">{patient.drLabel}</h3>
              <span className={`px-2 py-0.5 rounded text-xs font-bold border ${DR_LEVEL_BG_BADGES[patient.drLevel]}`}>
                Level {patient.drLevel} / 4
              </span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Based on International Clinical Diabetic Retinopathy (ICDR) severity scale. Referable DR threshold is Level 2+.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 flex flex-col justify-center text-center space-y-1">
            <span className="text-[10px] text-gray-500 uppercase tracking-wide">Referral Status</span>
            <div className={`text-base font-bold ${patient.referable ? 'text-red-700' : 'text-emerald-700'}`}>
              {patient.referable ? 'REFERRAL REQUIRED' : 'NON-REFERABLE'}
            </div>
            <span className="text-[10px] text-gray-500">
              Confidence: <strong>{patient.confidence}%</strong>
            </span>
          </div>
        </div>

        {/* Fundus Image & Evidence Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          <div className="space-y-2">
            <span className="text-xs font-bold text-gray-900 uppercase tracking-wide block">
              Grad-CAM Attention Map & Fundus Optical Scan
            </span>
            <div className="rounded-xl overflow-hidden border border-gray-300 aspect-square max-w-sm mx-auto">
              <FundusViewer
                showControls={false}
                defaultMode="gradcam"
                imageUrl={patient?.imageUrl || undefined}
                enhancedImageUrl={patient?.enhancedImageUrl}
                gradcamUrl={patient?.gradcamUrl}
              />
            </div>
            <p className="text-[10px] text-gray-400 text-center font-mono">
              NetraRakshaq Grad-CAM Activation Overlay · Demonstrating model focus
            </p>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold text-gray-900 uppercase tracking-wide block">
              Clinical Biomarker Summary
            </span>

            <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200 text-xs space-y-2">
              <div className="font-semibold text-gray-800">Retinal Structures:</div>
              <div className="grid grid-cols-2 gap-2 text-gray-600 text-[11px]">
                <div>• Optic Disc: {patient.retinalStructures.opticDisc.detected ? 'Normal Localization' : 'Obscured'}</div>
                <div>• Fovea: {patient.retinalStructures.fovea.detected ? 'Reflex Identified' : 'Obscured'}</div>
                <div>• Vessels: {patient.retinalStructures.vessels.segmented ? 'Arcades Mapped' : 'Pending'}</div>
              </div>

              <div className="pt-2 border-t border-gray-200 font-semibold text-gray-800">Lesion Evidence:</div>
              <div className="grid grid-cols-2 gap-2 text-gray-600 text-[11px]">
                <div>• Microaneurysms: {patient.lesions.microaneurysms.count || 0} Count</div>
                <div>• Hemorrhages: {patient.lesions.hemorrhages.count || 0} Count</div>
                <div>• Hard Exudates: {patient.lesions.exudates.count || 0} Count</div>
                <div>• Neovascularization: {patient.lesions.neovascularization.detected ? 'Detected (PDR)' : 'None'}</div>
              </div>
            </div>

            {/* Why Flagged */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs space-y-1">
              <span className="font-bold text-amber-950 block">Clinical Rationale:</span>
              <ul className="text-amber-900 text-[11px] space-y-1 list-disc list-inside">
                {patient.whyFlagged?.map((w, idx) => (
                  <li key={idx}>{w}</li>
                )) || <li>No focal microvascular lesions identified.</li>}
              </ul>
            </div>
          </div>
        </div>

        {/* Doctor Final Decision & Signature (Section 28) */}
        <div className="border-t-2 border-gray-200 pt-4 grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          <div className="space-y-1">
            <span className="font-bold text-gray-900 block uppercase tracking-wider text-[10px]">
              Ophthalmologist Clinical Decision & Orders:
            </span>
            <p className="text-gray-700 leading-relaxed italic">
              "{patient.reviewNotes || 'AI prediction verified. Specialist dilated examination and OCT recommended.'}"
            </p>
            {patient.referral && (
              <div className="mt-2 text-[11px] text-gray-600">
                <div>Referral Center: <strong>{patient.referral.center}</strong></div>
                <div>Appointment Date: <strong>{patient.referral.appointmentDate}</strong></div>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-end sm:items-end space-y-1">
            <div className="w-44 border-b border-gray-400 pb-1 text-center font-serif text-gray-800 font-bold">
              Dr. A. Sharma
            </div>
            <div className="text-[10px] text-gray-500 sm:text-right">
              <div>Dr. A. Sharma, MS (Ophthalmology)</div>
              <div>Reg. No: MH-42901 · Consulting Vitreoretinal Specialist</div>
              <div>Signed electronically on {patient.reviewedAt || patient.screeningDate}</div>
            </div>
          </div>
        </div>

        {/* Legal Medical Disclaimer */}
        <div className="border-t border-gray-200 pt-3 text-[10px] text-gray-400 text-center leading-relaxed">
          NetraRakshaq is an AI-assisted screening support tool designed for tele-ophthalmology in rural India. Results do not constitute a definitive therapeutic prescription without personal clinical evaluation by a licensed ophthalmologist. (SIH 26038 Prototype).
        </div>
      </div>
    </div>
  );
}
