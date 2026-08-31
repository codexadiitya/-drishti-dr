'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import {
  Sliders,
  Sparkles,
  Activity,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Users,
  Eye,
  Camera,
  Stethoscope,
  TrendingUp,
  RotateCcw,
  Zap
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function CapacitySimulationPage() {
  const { simulationParams, setSimulationParams, simulationOutput } = useApp();

  const handleReset = () => {
    setSimulationParams({
      targetPopulation: 100000,
      prevalenceRate: 0.18,
      fundusCameras: 12,
      screenersPerFacility: 2,
      screeningHoursPerDay: 6,
      minutesPerScreening: 15,
      aiSpecificityCutoff: 0.93,
      aiSensitivityCutoff: 0.96,
      teleOphthalmologists: 4,
      reviewMinutesPerCase: 4
    });
  };

  const costComparisonData = [
    {
      model: 'Traditional Universal Ophth Screening',
      CostPerScreenINR: 680,
      DoctorHoursDaily: 36,
      SightThreateningMissed: 380
    },
    {
      model: 'Drishti-DR AI Triaged Tele-Reading',
      CostPerScreenINR: simulationOutput.costPerPatientScreenedINR,
      DoctorHoursDaily: simulationOutput.dailyDoctorReviewWorkloadHours,
      SightThreateningMissed: simulationOutput.projectedFalseNegativesMissed
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
              Health Systems Resource Optimization
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Diabetic Retinopathy Capacity Simulation Planner
          </h1>
          <p className="text-xs text-slate-500">
            Interactive what-if scenario planning: camera deployments, AI triage sensitivity, and specialist workload
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 self-start sm:self-auto"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Main Simulation Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Input Parameter Sliders (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-teal-800 dark:text-teal-300 font-bold text-sm">
              <Sliders className="h-4 w-4 text-teal-600" />
              <span>Simulation Controls</span>
            </div>
            <span className="text-[11px] font-mono text-teal-600">Reactive Engine</span>
          </div>

          {/* Slider 1: Target Population */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between font-semibold">
              <span>Catchment Population</span>
              <span className="font-mono font-bold text-teal-600">
                {simulationParams.targetPopulation.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="20000"
              max="500000"
              step="10000"
              value={simulationParams.targetPopulation}
              onChange={e =>
                setSimulationParams({ ...simulationParams, targetPopulation: Number(e.target.value) })
              }
              className="w-full h-1.5 accent-teal-600 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Slider 2: Fundus Cameras */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between font-semibold">
              <span>Deployed Portable Fundus Cameras</span>
              <span className="font-mono font-bold text-teal-600">
                {simulationParams.fundusCameras} Cameras
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="40"
              step="1"
              value={simulationParams.fundusCameras}
              onChange={e =>
                setSimulationParams({ ...simulationParams, fundusCameras: Number(e.target.value) })
              }
              className="w-full h-1.5 accent-teal-600 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Slider 3: Screening Hours Daily */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between font-semibold">
              <span>PHC Screening Hours / Day</span>
              <span className="font-mono font-bold text-teal-600">
                {simulationParams.screeningHoursPerDay} Hours
              </span>
            </div>
            <input
              type="range"
              min="4"
              max="10"
              step="1"
              value={simulationParams.screeningHoursPerDay}
              onChange={e =>
                setSimulationParams({ ...simulationParams, screeningHoursPerDay: Number(e.target.value) })
              }
              className="w-full h-1.5 accent-teal-600 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Slider 4: Minutes per Screening */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between font-semibold">
              <span>Minutes per Patient Screening</span>
              <span className="font-mono font-bold text-teal-600">
                {simulationParams.minutesPerScreening} Mins
              </span>
            </div>
            <input
              type="range"
              min="8"
              max="30"
              step="1"
              value={simulationParams.minutesPerScreening}
              onChange={e =>
                setSimulationParams({ ...simulationParams, minutesPerScreening: Number(e.target.value) })
              }
              className="w-full h-1.5 accent-teal-600 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Slider 5: AI Sensitivity */}
          <div className="space-y-1.5 p-3 rounded-2xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800">
            <div className="flex items-center justify-between font-bold text-teal-900 dark:text-teal-200">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-teal-600" />
                AI Triage Sensitivity (Recall)
              </span>
              <span className="font-mono">{Math.round(simulationParams.aiSensitivityCutoff * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.85"
              max="0.99"
              step="0.01"
              value={simulationParams.aiSensitivityCutoff}
              onChange={e =>
                setSimulationParams({ ...simulationParams, aiSensitivityCutoff: parseFloat(e.target.value) })
              }
              className="w-full h-1.5 accent-teal-600 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">Higher sensitivity catches more subtle lesions</span>
          </div>

          {/* Slider 6: AI Specificity */}
          <div className="space-y-1.5 p-3 rounded-2xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800">
            <div className="flex items-center justify-between font-bold text-teal-900 dark:text-teal-200">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-teal-600" />
                AI Triage Specificity
              </span>
              <span className="font-mono">{Math.round(simulationParams.aiSpecificityCutoff * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.80"
              max="0.98"
              step="0.01"
              value={simulationParams.aiSpecificityCutoff}
              onChange={e =>
                setSimulationParams({ ...simulationParams, aiSpecificityCutoff: parseFloat(e.target.value) })
              }
              className="w-full h-1.5 accent-teal-600 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">Higher specificity reduces doctor false alarms</span>
          </div>

          {/* Slider 7: Tele-Ophthalmologists */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between font-semibold">
              <span>Tele-Ophthalmologists in Review Pool</span>
              <span className="font-mono font-bold text-teal-600">
                {simulationParams.teleOphthalmologists} Doctors
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              step="1"
              value={simulationParams.teleOphthalmologists}
              onChange={e =>
                setSimulationParams({ ...simulationParams, teleOphthalmologists: Number(e.target.value) })
              }
              className="w-full h-1.5 accent-teal-600 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Right: Projected Outcomes & Impact Analytics (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Key Simulation Outcomes Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-slate-400 text-[11px] font-bold block uppercase">
                Daily Throughput
              </span>
              <span className="text-2xl font-black text-teal-700 dark:text-teal-400 font-mono">
                {simulationOutput.dailyScreeningCapacity}
              </span>
              <span className="text-[10px] text-slate-500 block">Screens / Day</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-slate-400 text-[11px] font-bold block uppercase">
                Annual Coverage
              </span>
              <span className="text-2xl font-black text-emerald-600 font-mono">
                {simulationOutput.annualCoveragePercent}%
              </span>
              <span className="text-[10px] text-slate-500 block">Of target cohort</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-slate-400 text-[11px] font-bold block uppercase">
                Sight-Threatening Averted
              </span>
              <span className="text-2xl font-black text-orange-600 font-mono">
                {simulationOutput.projectedSightThreateningAverted}
              </span>
              <span className="text-[10px] text-slate-500 block">Severe/PDR detected</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-slate-400 text-[11px] font-bold block uppercase">
                Doc Workload / Day
              </span>
              <span className="text-2xl font-black text-sky-700 dark:text-sky-300 font-mono">
                {simulationOutput.dailyDoctorReviewWorkloadHours}h
              </span>
              <span className="text-[10px] text-slate-500 block">Tele-reading time</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-slate-400 text-[11px] font-bold block uppercase">
                Review Backlog
              </span>
              <span className={`text-2xl font-black font-mono ${simulationOutput.estimatedBacklogDays > 5 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {simulationOutput.estimatedBacklogDays} Days
              </span>
              <span className="text-[10px] text-slate-500 block">Wait time</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-slate-400 text-[11px] font-bold block uppercase">
                Cost Per Screen
              </span>
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                ₹{simulationOutput.costPerPatientScreenedINR}
              </span>
              <span className="text-[10px] text-slate-500 block">All inclusive</span>
            </div>
          </div>

          {/* Cost & Efficiency Comparison Chart */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              AI-Assisted Screening vs Manual Reading Cost (INR)
            </h3>
            <p className="text-xs text-slate-500">
              Comparing cost per screening encounter across deployment models
            </p>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costComparisonData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="model" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: '1rem', fontSize: '12px' }} />
                  <Bar dataKey="CostPerScreenINR" name="Cost per Screen (INR)" fill="#0f766e" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Simulation Policy Recommendations */}
          <div className="p-5 rounded-3xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 space-y-2">
            <div className="flex items-center gap-2 text-teal-900 dark:text-teal-200 font-bold text-xs">
              <Zap className="h-4 w-4 text-teal-600" />
              <span>AI System Recommendation & Capacity Health</span>
            </div>
            <ul className="text-xs text-teal-900/90 dark:text-teal-200 space-y-1.5 list-disc list-inside">
              {simulationOutput.recommendations.map((rec, idx) => (
                <li key={idx} className="leading-relaxed font-medium">
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
