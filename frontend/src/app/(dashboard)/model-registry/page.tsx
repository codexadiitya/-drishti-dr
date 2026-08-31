'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { MODEL_REGISTRY_DATA } from '@/lib/mock-data';
import {
  Cpu,
  Sparkles,
  Database,
  CheckCircle2,
  ShieldCheck,
  Activity,
  Layers,
  FileCode,
  Lock,
  AlertTriangle,
  Info
} from 'lucide-react';

export default function ModelRegistryPage() {
  const { isDemoMode, setIsDemoMode } = useApp();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
              AI Governance & Model Cards
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Model & Dataset Information Registry
          </h1>
          <p className="text-xs text-slate-500">
            Validated deep learning models, training corpora, explainability benchmarks, and execution runtime
          </p>
        </div>

        {/* DEMO_MODE toggle */}
        <button
          onClick={() => setIsDemoMode(!isDemoMode)}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl border font-bold text-xs shadow-md transition-all self-start sm:self-auto ${
            isDemoMode
              ? 'bg-amber-50 dark:bg-amber-950 border-amber-300 text-amber-900 dark:text-amber-300'
              : 'bg-emerald-50 dark:bg-emerald-950 border-emerald-300 text-emerald-900 dark:text-emerald-300'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>Active Inference: {isDemoMode ? 'DEMO_MODE (Synthetic AI)' : 'REAL_MODEL_MODE (Weights Loaded)'}</span>
        </button>
      </div>

      {/* Mode Transparency Banner */}
      <div className="p-5 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-md space-y-2">
        <div className="flex items-center gap-2 text-teal-400 font-bold text-xs">
          <Info className="h-4 w-4" />
          <span>Clinical Architecture Disclaimer & Demarcation</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {isDemoMode
            ? 'The platform is currently operating in DEMO_MODE. AI predictions, segmentation masks, and Grad-CAM colormaps are generated via deterministic simulation algorithms for development and clinical walkthroughs. Outputs are not real medical predictions.'
            : 'REAL_MODEL_MODE is active. Model inference pipelines execute PyTorch deep learning weights against the local GPU/CPU backend.'}
        </p>
      </div>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {MODEL_REGISTRY_DATA.map(m => (
          <div
            key={m.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs hover:border-teal-400 transition-colors flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-mono">
                  {m.version}
                </span>
                <span className="flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Active Model
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {m.name}
                </h3>
                <span className="text-[11px] text-teal-700 dark:text-teal-400 font-semibold block mt-0.5">
                  Task: {m.taskType.replace('_', ' ')}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 space-y-1.5">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Architecture</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">{m.architecture}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Framework</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">{m.framework}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Training Dataset</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">{m.trainingDataset}</span>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Sensitivity</span>
                  <span className="font-mono font-bold text-teal-600">{m.sensitivity}%</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Specificity</span>
                  <span className="font-mono font-bold text-teal-600">{m.specificity}%</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px]">AUC-ROC</span>
                  <span className="font-mono font-bold text-teal-600">{m.aucRoc}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Latency: {m.inferenceLatencyMs}ms</span>
              <span>Updated: {m.lastUpdated}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
