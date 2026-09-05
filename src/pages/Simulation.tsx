import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from 'recharts';
import { TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Badge } from '../components/ui/primitives';
import { SCENARIO_PRESETS, computeSimulation } from '../lib/mockData';
import type { SimulationParams } from '../lib/types';

type ScenarioKey = keyof typeof SCENARIO_PRESETS;

const SCENARIO_LABELS: Record<ScenarioKey, string> = {
  baseline: 'Baseline',
  lowResource: 'Low Resource',
  standardDistrict: 'Standard District',
  highVolume: 'High Volume',
  hundredThousand: '100K+ / Year',
};

function Slider({ label, min, max, value, step = 1, unit, onChange }: {
  label: string; min: number; max: number; value: number;
  step?: number; unit?: string; onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">{label}</span>
        <span className="text-xs font-mono font-semibold text-slate-200">{value}{unit ?? ''}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-cyan-500 h-1.5 cursor-pointer"
      />
      <div className="flex justify-between text-[10px] text-slate-600 font-mono">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}

function MetricCard({ label, value, unit, accent = false, sub }: {
  label: string; value: string | number; unit?: string; accent?: boolean; sub?: string;
}) {
  return (
    <div className={`rounded-xl p-4 border ${accent ? 'bg-cyan-500/5 border-cyan-500/20' : 'bg-slate-800/50 border-slate-700/50'}`}>
      <p className="text-[10px] text-slate-500 uppercase tracking-wide">{label}</p>
      <p className={`text-2xl font-semibold font-mono mt-1 ${accent ? 'text-cyan-400' : 'text-slate-100'}`}>
        {value}
        {unit && <span className="text-sm text-slate-500 ml-1">{unit}</span>}
      </p>
      {sub && <p className="text-[10px] text-slate-500 mt-0.5">{sub}</p>}
    </div>
  );
}

export function Simulation() {
  const [scenario, setScenario] = useState<ScenarioKey>('standardDistrict');
  const [params, setParams] = useState<SimulationParams>(SCENARIO_PRESETS.standardDistrict);

  function loadScenario(key: ScenarioKey) {
    setScenario(key);
    setParams({ ...SCENARIO_PRESETS[key] });
  }

  function updateParam(key: keyof SimulationParams, value: number) {
    setScenario('standardDistrict'); // custom
    setParams(p => ({ ...p, [key]: value }));
  }

  const results = computeSimulation(params);

  // Comparison data for all scenarios
  const comparisonData = (Object.keys(SCENARIO_PRESETS) as ScenarioKey[]).map(k => {
    const r = computeSimulation(SCENARIO_PRESETS[k]);
    return {
      name: SCENARIO_LABELS[k],
      annual: Math.round(r.annualCapacity / 1000),
      daily: r.dailyThroughput,
      cameraUtil: r.cameraUtilization,
      reviewerUtil: r.reviewerUtilization,
    };
  });

  // Hourly throughput simulation
  const throughputData = Array.from({ length: params.operatingHours }, (_, i) => {
    const hour = 8 + i;
    const factor = Math.sin((i / params.operatingHours) * Math.PI) * 0.4 + 0.8;
    return {
      time: `${String(hour).padStart(2, '0')}:00`,
      patients: Math.round((params.patientsPerDay / params.operatingHours) * factor),
      queue: Math.round(results.peakQueueLength * Math.sin((i / params.operatingHours) * Math.PI)),
    };
  });

  const isBottleneckReview = results.bottleneck === 'Clinical review';

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-100">Rural Screening Capacity Simulator</h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Model telemedicine capacity, throughput and resource allocation. <span className="text-slate-600">Simulation outputs — not real measurements.</span>
        </p>
      </div>

      {/* Scenario presets */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(SCENARIO_PRESETS) as ScenarioKey[]).map(k => (
          <button
            key={k}
            onClick={() => loadScenario(k)}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors cursor-pointer ${
              scenario === k
                ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/35'
                : 'text-slate-400 border-slate-700 hover:border-slate-600 hover:text-slate-300'
            }`}
          >
            {SCENARIO_LABELS[k]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        {/* Controls panel */}
        <div className="xl:col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
          <h2 className="text-sm font-semibold text-slate-200">Simulation Parameters</h2>

          <Slider label="Patients / day" min={10} max={500} value={params.patientsPerDay}
            onChange={v => updateParam('patientsPerDay', v)} />
          <Slider label="Operating hours" min={4} max={16} value={params.operatingHours}
            unit="h" onChange={v => updateParam('operatingHours', v)} />
          <Slider label="Cameras" min={1} max={10} value={params.cameras}
            onChange={v => updateParam('cameras', v)} />
          <Slider label="Bandwidth" min={1} max={100} value={params.bandwidthMbps}
            unit=" Mbps" onChange={v => updateParam('bandwidthMbps', v)} />
          <Slider label="AI processing time" min={15} max={180} value={params.aiProcessingSeconds}
            unit="s" onChange={v => updateParam('aiProcessingSeconds', v)} />
          <Slider label="Recapture rate" min={5} max={40} value={params.recaptureRate}
            unit="%" onChange={v => updateParam('recaptureRate', v)} />
          <Slider label="Ophthalmologists" min={1} max={10} value={params.ophthalmologists}
            onChange={v => updateParam('ophthalmologists', v)} />
          <Slider label="Avg. review time" min={10} max={120} value={params.reviewTimeSeconds}
            unit="s" onChange={v => updateParam('reviewTimeSeconds', v)} />
        </div>

        {/* Results */}
        <div className="xl:col-span-3 space-y-4">
          {/* KPI metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MetricCard label="Annual Capacity" value={(results.annualCapacity / 1000).toFixed(1)} unit="K" accent />
            <MetricCard label="Daily Throughput" value={results.dailyThroughput} unit="patients" />
            <MetricCard label="Avg Wait Time" value={results.avgWaitMinutes} unit="min" />
            <MetricCard label="Peak Queue" value={results.peakQueueLength} unit="patients" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MetricCard label="Camera Utilization" value={`${results.cameraUtilization}%`}
              sub="Acquisition stations" />
            <MetricCard label="Reviewer Utilization" value={`${results.reviewerUtilization}%`}
              sub="Ophthalmologists" />
            <MetricCard label="Est. Patients / Year" value={(results.estimatedPatientsServedYear / 1000).toFixed(1)} unit="K" accent />
            <div className={`rounded-xl p-4 border ${isBottleneckReview ? 'bg-amber-500/5 border-amber-500/20' : 'bg-slate-800/50 border-slate-700/50'}`}>
              <p className="text-[10px] text-slate-500 uppercase tracking-wide">Bottleneck</p>
              <p className={`text-sm font-semibold mt-1 ${isBottleneckReview ? 'text-amber-400' : 'text-slate-300'}`}>
                {results.bottleneck}
              </p>
              <p className="text-[10px] text-slate-600 mt-0.5">Limiting resource</p>
            </div>
          </div>

          {/* Optimization card */}
          <div className={`flex items-start gap-3 p-4 rounded-xl border ${isBottleneckReview ? 'bg-amber-500/5 border-amber-500/20' : 'bg-cyan-500/5 border-cyan-500/20'}`}>
            {isBottleneckReview
              ? <AlertTriangle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
              : <TrendingUp size={16} className="text-cyan-400 flex-shrink-0 mt-0.5" />
            }
            <div>
              <p className="text-sm font-semibold text-slate-200">Optimization Recommendation</p>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {isBottleneckReview
                  ? `Clinical review is currently the limiting resource (${results.reviewerUtilization}% utilization). Adding one ophthalmologist reviewer increases annual screening capacity by approximately ${Math.round(params.operatingHours * 3600 / params.reviewTimeSeconds * 312 / 1000)}K patients — more than adding another acquisition camera.`
                  : `Image acquisition is the current bottleneck (${results.cameraUtilization}% camera utilization). Adding one camera increases daily throughput by approximately ${Math.round(params.operatingHours * 3600 / params.aiProcessingSeconds)} patients.`
                }
              </p>
              <p className="text-[10px] text-slate-600 mt-2">Simulation result — validate with real operational data before deployment decisions.</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Resource utilization */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-slate-300 mb-3 uppercase tracking-wide">Resource Utilization by Scenario</h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={comparisonData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#475569', fontSize: 9 }} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, fontSize: 11 }} />
                  <Bar dataKey="cameraUtil" name="Camera %" fill="#22d3ee" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="reviewerUtil" name="Reviewer %" fill="#f97316" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Annual capacity comparison */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-slate-300 mb-3 uppercase tracking-wide">Annual Capacity (K patients)</h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={comparisonData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis type="number" tick={{ fill: '#475569', fontSize: 9 }} axisLine={false} tickLine={false} unit="K" />
                  <YAxis dataKey="name" type="category" tick={{ fill: '#475569', fontSize: 9 }} width={75} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, fontSize: 11 }} />
                  <Bar dataKey="annual" name="Annual capacity" fill="#14b8a6" radius={[0, 2, 2, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Hourly throughput */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:col-span-2">
              <h3 className="text-xs font-semibold text-slate-300 mb-3 uppercase tracking-wide">Simulated Daily Patient Throughput</h3>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={throughputData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, fontSize: 11 }} />
                  <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                  <Line type="monotone" dataKey="patients" name="Patients screened" stroke="#22d3ee" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="queue" name="Queue length" stroke="#fbbf24" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
