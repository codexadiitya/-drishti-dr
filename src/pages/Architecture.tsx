import { ArrowDown, ArrowRight, Zap, Server, GitBranch } from 'lucide-react';

interface ModuleProps {
  label: string;
  badge: string;
  color: string;
  borderColor: string;
  desc: string;
  outputs?: string[];
}

function Module({ label, badge, color, borderColor, desc, outputs }: ModuleProps) {
  return (
    <div className={`rounded-xl border p-4 ${color} ${borderColor} relative`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-semibold text-slate-100">{label}</h3>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/60 text-slate-300 shrink-0">{badge}</span>
      </div>
      <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
      {outputs && (
        <div className="mt-2 flex flex-wrap gap-1">
          {outputs.map(o => (
            <span key={o} className="px-1.5 py-0.5 rounded bg-slate-900/60 text-[10px] text-slate-400 font-mono">{o}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function PipelineStep({ step, last = false }: { step: ModuleProps & { inputs?: string[] }; last?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <Module {...step} />
      {!last && (
        <div className="flex flex-col items-center py-1">
          <div className="w-0.5 h-4 bg-slate-700" />
          <ArrowDown size={12} className="text-slate-600" />
        </div>
      )}
    </div>
  );
}

const MAIN_PIPELINE = [
  {
    label: 'Fundus Camera Acquisition',
    badge: 'Hardware',
    color: 'bg-slate-800/60',
    borderColor: 'border-slate-700',
    desc: 'Retinal image capture via fundus camera. Field teams, mobile units, or hospital-based acquisition points.',
    outputs: ['JPEG', 'TIFF', 'DICOM'],
  },
  {
    label: 'Image Quality Assessment & Enhancement',
    badge: 'P4',
    color: 'bg-blue-500/5',
    borderColor: 'border-blue-500/20',
    desc: 'MATLAB-based automatic evaluation (focus, illumination, FoV). CLAHE adaptive enhancement for borderline images. Rejection of ungradable images with recapture feedback.',
    outputs: ['Quality score', 'Enhancement', 'Reject/Accept'],
  },
  {
    label: 'Retinal Structure Segmentation',
    badge: 'P5',
    color: 'bg-purple-500/5',
    borderColor: 'border-purple-500/20',
    desc: 'Optic disc/fovea localization, vessel segmentation. Structural landmarks for downstream lesion contextualization.',
    outputs: ['Disc loc.', 'Fovea loc.', 'Vessel map'],
  },
  {
    label: 'Lesion Detection',
    badge: 'P3',
    color: 'bg-amber-500/5',
    borderColor: 'border-amber-500/20',
    desc: 'Sub-pixel microaneurysm detection, hemorrhage classification, exudate segmentation, neovascularization detection. Clinically graded outputs.',
    outputs: ['MA count', 'Hemorrhages', 'Exudates', 'NV'],
  },
  {
    label: 'DR Severity Classification',
    badge: 'P2',
    color: 'bg-red-500/5',
    borderColor: 'border-red-500/20',
    desc: 'ICDR scale grading (Level 0–4) with calibrated confidence scores. >90% sensitivity, >85% specificity target for referable DR (Level 2+).',
    outputs: ['DR Level 0–4', 'Confidence', 'Referable Y/N'],
  },
  {
    label: 'Explainability & Report Generation',
    badge: 'P3 + P1',
    color: 'bg-cyan-500/5',
    borderColor: 'border-cyan-500/20',
    desc: 'Grad-CAM attention maps, lesion-level evidence correlated with ICDR criteria. Calibrated confidence, annotated report. Ophthalmologist validation in <30 seconds.',
    outputs: ['Grad-CAM', 'Evidence', 'Report PDF'],
  },
  {
    label: 'Clinical Review → Referral',
    badge: 'Human-in-loop',
    color: 'bg-emerald-500/5',
    borderColor: 'border-emerald-500/20',
    desc: 'Ophthalmologist validation with AI evidence. Review, confirm, modify, or override AI assessment. Final referral decision and patient management.',
    outputs: ['Reviewed', 'Referred', 'Follow-up'],
  },
];

const TEAM_MODULES = [
  { badge: 'P1', label: 'Product / Full Stack', desc: 'API, frontend, reporting, integration', color: 'bg-slate-500/10 border-slate-500/30 text-slate-300' },
  { badge: 'P2', label: 'DR Classification', desc: 'CNN grading model, calibration, evaluation', color: 'bg-red-500/10 border-red-500/30 text-red-300' },
  { badge: 'P3', label: 'Lesion Detection & XAI', desc: 'Microaneurysm, hemorrhage, Grad-CAM', color: 'bg-amber-500/10 border-amber-500/30 text-amber-300' },
  { badge: 'P4', label: 'Image Quality & Enhancement', desc: 'CLAHE, focus, illumination, MATLAB', color: 'bg-blue-500/10 border-blue-500/30 text-blue-300' },
  { badge: 'P5', label: 'Retinal Segmentation', desc: 'Disc, fovea, vessels, MATLAB', color: 'bg-purple-500/10 border-purple-500/30 text-purple-300' },
  { badge: 'P6', label: 'Simulation & Validation', desc: 'Simulink model, capacity optimization, benchmarks', color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' },
];

export function Architecture() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-100">System Architecture</h1>
        <p className="text-sm text-slate-400 mt-0.5">End-to-end NetraRakshaq pipeline — from fundus acquisition to clinical referral and telemedicine capacity optimization</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main pipeline */}
        <div className="xl:col-span-2 space-y-1">
          <div className="flex items-center gap-2 mb-3">
            <GitBranch size={14} className="text-cyan-400" />
            <h2 className="text-sm font-semibold text-slate-200">Screening Pipeline</h2>
          </div>
          <div className="max-w-lg mx-auto xl:mx-0">
            {MAIN_PIPELINE.map((step, i) => (
              <PipelineStep key={step.label} step={step} last={i === MAIN_PIPELINE.length - 1} />
            ))}
          </div>
        </div>

        {/* Right: Parallel branch + Team modules */}
        <div className="space-y-4">
          {/* Operational metrics branch */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap size={14} className="text-teal-400" />
              <h2 className="text-sm font-semibold text-slate-200">Capacity Optimization Branch</h2>
            </div>
            <div className="flex flex-col items-start gap-1">
              {[
                { label: 'Operational Metrics', desc: 'Throughput, queue, utilization', badge: 'Live data', color: 'bg-slate-800/60', borderColor: 'border-slate-700' },
                { label: 'Simulink Model', desc: 'Bandwidth, processing, review simulation', badge: 'P6', color: 'bg-teal-500/5', borderColor: 'border-teal-500/20' },
                { label: 'Capacity Optimization', desc: 'Resource allocation recommendations', badge: 'P6', color: 'bg-emerald-500/5', borderColor: 'border-emerald-500/20' },
              ].map((s, i) => (
                <div key={s.label} className="w-full flex flex-col items-center gap-1">
                  <Module label={s.label} badge={s.badge} color={s.color} borderColor={s.borderColor} desc={s.desc} />
                  {i < 2 && (
                    <div className="flex flex-col items-center py-0.5">
                      <div className="w-0.5 h-3 bg-slate-700" />
                      <ArrowDown size={10} className="text-slate-600" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Data flow */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wide mb-3">API Integration Points</h3>
            <div className="space-y-2">
              {[
                { from: 'Frontend', to: 'Backend API' },
                { from: 'API', to: 'P4 Image Quality' },
                { from: 'API', to: 'P5 Segmentation' },
                { from: 'API', to: 'P3 Lesion + XAI' },
                { from: 'API', to: 'P2 DR Classification' },
                { from: 'Services', to: 'Unified Result' },
                { from: 'Result', to: 'Frontend' },
              ].map(({ from, to }) => (
                <div key={`${from}-${to}`} className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="font-mono text-slate-300 w-24 truncate">{from}</span>
                  <ArrowRight size={10} className="text-slate-600 flex-shrink-0" />
                  <span className="font-mono text-cyan-400 truncate">{to}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-600 mt-3 leading-relaxed">
              Mock services return JSON responses. Replace each service with real MATLAB/Python endpoints.
            </p>
          </div>

          {/* Tech stack */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wide mb-3">Technology Stack</h3>
            <div className="space-y-1.5">
              {[
                ['Frontend', 'React + Vite + Tailwind CSS'],
                ['AI / ML', 'MATLAB Deep Learning Toolbox'],
                ['Vision', 'MATLAB Image Processing + CV'],
                ['Simulation', 'Simulink'],
                ['Statistics', 'MATLAB Stats & ML Toolbox'],
                ['Medical Imaging', 'MATLAB Medical Imaging TB'],
              ].map(([layer, tech]) => (
                <div key={layer} className="flex items-center gap-3 py-1.5 border-b border-slate-800/40 last:border-0">
                  <span className="text-[10px] text-slate-500 w-24 flex-shrink-0">{layer}</span>
                  <span className="text-xs text-slate-300 font-mono">{tech}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Team modules */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Server size={14} className="text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-200">Team Module Ownership</h2>
          <span className="text-xs text-slate-500">— for hackathon review</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {TEAM_MODULES.map(m => (
            <div key={m.badge} className={`rounded-xl border p-4 ${m.color.replace(/text-\S+/, '')}`}>
              <span className={`text-xl font-bold ${m.color.split(' ').find(c => c.startsWith('text-'))}`}>{m.badge}</span>
              <p className={`text-xs font-semibold mt-1 ${m.color.split(' ').find(c => c.startsWith('text-'))}`}>{m.label}</p>
              <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <p className="text-xs text-slate-500 text-center leading-relaxed">
          NetraRakshaq Architecture · Prototype v1.0 · Hackathon build · For evaluation purposes only · Not approved for clinical deployment
        </p>
      </div>
    </div>
  );
}
