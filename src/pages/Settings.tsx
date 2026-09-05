import { useState } from 'react';
import { CheckCircle2, AlertTriangle, RefreshCw, Settings as SettingsIcon } from 'lucide-react';
import { SYSTEM_COMPONENTS } from '../lib/mockData';
import type { SystemComponent } from '../lib/types';

function StatusIcon({ status }: { status: SystemComponent['status'] }) {
  if (status === 'online') return <CheckCircle2 size={14} className="text-emerald-400" />;
  if (status === 'processing') return <RefreshCw size={14} className="text-cyan-400 animate-spin" />;
  if (status === 'warning') return <AlertTriangle size={14} className="text-amber-400" />;
  return <XCircle size={14} className="text-red-400" />;
}

function StatusBadge({ status }: { status: SystemComponent['status'] }) {
  const classes = {
    online: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    processing: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
    warning: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    offline: 'text-red-400 bg-red-400/10 border-red-400/20',
  };
  const labels = { online: 'Online', processing: 'Processing', warning: 'Warning', offline: 'Offline' };
  return (
    <span className={`px-2 py-0.5 text-[10px] font-medium rounded border ${classes[status]}`}>
      {labels[status]}
    </span>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-950/30">
        <h2 className="text-sm font-semibold text-slate-200">{title}</h2>
      </div>
      <div className="p-5">
        {children}
      </div>
    </div>
  );
}

function ToggleSetting({ label, desc, enabled, onChange }: {
  label: string; desc: string; enabled: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-800/50 last:border-0">
      <div>
        <p className="text-sm text-slate-200">{label}</p>
        <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer flex-shrink-0 ${enabled ? 'bg-cyan-500' : 'bg-slate-700'}`}
      >
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );
}

export function Settings() {
  const [autoEnhance, setAutoEnhance] = useState(true);
  const [autoReject, setAutoReject] = useState(true);
  const [gradcamDefault, setGradcamDefault] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [debugMode, setDebugMode] = useState(false);

  const online = SYSTEM_COMPONENTS.filter(c => c.status === 'online').length;

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
          <SettingsIcon size={18} className="text-slate-400" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-slate-100">System Configuration</h1>
          <p className="text-sm text-slate-400 mt-0.5">AI model status, service connections, and system health</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* System health */}
        <Section title="System Health Overview">
          <div className="flex items-center justify-between mb-4 p-3 bg-emerald-500/5 border border-emerald-500/15 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span className="text-sm font-medium text-emerald-300">All Systems Operational</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">{online}/{SYSTEM_COMPONENTS.length} online</span>
          </div>
          <div className="space-y-1">
            {SYSTEM_COMPONENTS.map(c => (
              <div key={c.name} className="flex items-center gap-3 py-2 border-b border-slate-800/40 last:border-0">
                <StatusIcon status={c.status} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-300 truncate">{c.name}</p>
                  <p className="text-[10px] text-slate-600 font-mono">Module {c.module}</p>
                </div>
                {c.latency !== undefined && c.latency > 0 && (
                  <span className="text-[10px] text-slate-500 font-mono">{c.latency}ms</span>
                )}
                <StatusBadge status={c.status} />
              </div>
            ))}
          </div>
        </Section>

        {/* AI model */}
        <Section title="AI Model Status">
          <div className="space-y-3">
            {[
              { label: 'DR Classification (P2)', version: 'v2.3.1', dataset: 'EyePACS + APTOS 2019', status: 'online' as const },
              { label: 'Lesion Detection (P3)', version: 'v1.8.4', dataset: 'IDRiD + Messidor-2', status: 'online' as const },
              { label: 'Image Quality (P4)', version: 'v1.2.0', dataset: 'DRIMDB', status: 'online' as const },
              { label: 'Segmentation (P5)', version: 'v2.1.0', dataset: 'DRIVE + CHASEDB1', status: 'online' as const },
            ].map(m => (
              <div key={m.label} className="bg-slate-800/40 rounded-lg p-3 flex items-center gap-3">
                <StatusIcon status={m.status} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-200">{m.label}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-mono">{m.version} · {m.dataset}</p>
                </div>
                <StatusBadge status={m.status} />
              </div>
            ))}
            <div className="mt-2 p-3 bg-slate-800/30 rounded-lg">
              <p className="text-[10px] text-slate-500">
                Models are prototype implementations. Evaluation metrics are from published benchmarks only.
                Clinical validation required before deployment.
              </p>
            </div>
          </div>
        </Section>

        {/* MATLAB service */}
        <Section title="MATLAB Processing Service">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Service Status', value: 'Online', accent: 'text-emerald-400' },
                { label: 'MATLAB Version', value: 'R2024b', accent: '' },
                { label: 'Toolboxes', value: '6 active', accent: '' },
                { label: 'Queue depth', value: '0 jobs', accent: '' },
              ].map(({ label, value, accent }) => (
                <div key={label} className="bg-slate-800/40 rounded-lg p-3">
                  <p className="text-[10px] text-slate-500">{label}</p>
                  <p className={`text-sm font-medium mt-0.5 ${accent || 'text-slate-200'}`}>{value}</p>
                </div>
              ))}
            </div>
            <div className="space-y-1.5">
              {['Image Processing Toolbox', 'Computer Vision Toolbox', 'Deep Learning Toolbox', 'Medical Imaging Toolbox', 'Simulink', 'Statistics and ML Toolbox'].map(t => (
                <div key={t} className="flex items-center gap-2 py-1.5 border-b border-slate-800/40 last:border-0">
                  <CheckCircle2 size={12} className="text-emerald-400 flex-shrink-0" />
                  <span className="text-xs text-slate-300">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Settings toggles */}
        <Section title="Pipeline Configuration">
          <div className="space-y-0">
            <ToggleSetting
              label="Auto-enhance borderline images"
              desc="Apply CLAHE and illumination normalization for borderline quality images"
              enabled={autoEnhance}
              onChange={setAutoEnhance}
            />
            <ToggleSetting
              label="Auto-reject ungradable images"
              desc="Immediately flag images below quality threshold for recapture"
              enabled={autoReject}
              onChange={setAutoReject}
            />
            <ToggleSetting
              label="Default to Grad-CAM view"
              desc="Show Grad-CAM heatmap by default in patient results"
              enabled={gradcamDefault}
              onChange={setGradcamDefault}
            />
            <ToggleSetting
              label="Email alerts for referable cases"
              desc="Send notification to reviewer when referable DR is detected"
              enabled={emailAlerts}
              onChange={setEmailAlerts}
            />
            <ToggleSetting
              label="Debug mode"
              desc="Show additional model metadata and pipeline timing information"
              enabled={debugMode}
              onChange={setDebugMode}
            />
          </div>
        </Section>

        {/* Storage */}
        <Section title="Storage & Data">
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Images stored', value: '1,284', unit: 'images' },
                { label: 'Reports generated', value: '1,241', unit: 'reports' },
                { label: 'Storage used', value: '4.7', unit: 'GB' },
              ].map(({ label, value, unit }) => (
                <div key={label} className="bg-slate-800/40 rounded-lg p-3 text-center">
                  <p className="text-xl font-semibold font-mono text-slate-100">{value}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{unit}</p>
                  <p className="text-[10px] text-slate-600">{label}</p>
                </div>
              ))}
            </div>
            <div className="p-3 bg-slate-800/30 rounded-lg text-[10px] text-slate-600">
              Demo prototype — no actual patient data is stored. All displayed values are synthetic.
            </div>
          </div>
        </Section>

      </div>
    </div>
  );
}

function XCircle({ size, className }: { size: number; className: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M15 9l-6 6M9 9l6 6" />
    </svg>
  );
}
