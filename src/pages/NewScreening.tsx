import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Camera, CheckCircle2, Loader2, AlertTriangle, ChevronRight, RefreshCw } from 'lucide-react';
import { QualityBar, Badge } from '../components/ui/primitives';
import { FundusViewer } from '../components/ui/FundusViewer';

type StepStatus = 'pending' | 'processing' | 'complete' | 'error' | 'warning';

const PIPELINE_STEPS = [
  { id: 1, label: 'Image Quality Assessment', module: 'P4' },
  { id: 2, label: 'Adaptive Enhancement (CLAHE)', module: 'P4' },
  { id: 3, label: 'Retinal Structure Segmentation', module: 'P5' },
  { id: 4, label: 'Lesion Detection', module: 'P3' },
  { id: 5, label: 'DR Severity Classification', module: 'P2' },
  { id: 6, label: 'Grad-CAM Explainability', module: 'P3' },
  { id: 7, label: 'Clinical Review Preparation', module: 'P1' },
];

function StepIcon({ status }: { status: StepStatus }) {
  if (status === 'complete') return <CheckCircle2 size={15} className="text-emerald-400" />;
  if (status === 'processing') return <Loader2 size={15} className="text-cyan-400 animate-spin" />;
  if (status === 'error') return <AlertTriangle size={15} className="text-red-400" />;
  if (status === 'warning') return <AlertTriangle size={15} className="text-amber-400" />;
  return <div className="w-3.5 h-3.5 rounded-full border border-slate-700" />;
}

const UNGRADABLE_QUALITY = { focus: 38, illumination: 44, fieldOfView: 52, score: 44 };
const GRADABLE_QUALITY = { focus: 94, illumination: 88, fieldOfView: 92, score: 91 };

type ScenarioType = 'gradable' | 'ungradable';

export function NewScreening() {
  const navigate = useNavigate();
  const [hasImage, setHasImage] = useState(false);
  const [scenario, setScenario] = useState<ScenarioType>('gradable');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [stepStatuses, setStepStatuses] = useState<StepStatus[]>(PIPELINE_STEPS.map(() => 'pending'));
  const dragOver = useRef(false);

  const quality = scenario === 'gradable' ? GRADABLE_QUALITY : UNGRADABLE_QUALITY;
  const isGradable = quality.score >= 70;

  function simulateUpload(type: ScenarioType) {
    setScenario(type);
    setHasImage(true);
    setIsAnalyzing(false);
    setAnalysisComplete(false);
    setStepStatuses(PIPELINE_STEPS.map(() => 'pending'));
  }

  async function runAnalysis() {
    if (!isGradable) return;
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    const newStatuses: StepStatus[] = PIPELINE_STEPS.map(() => 'pending');
    setStepStatuses([...newStatuses]);

    for (let i = 0; i < PIPELINE_STEPS.length; i++) {
      await new Promise(r => setTimeout(r, 600 + Math.random() * 400));
      newStatuses[i] = 'processing';
      setStepStatuses([...newStatuses]);
      await new Promise(r => setTimeout(r, 400 + Math.random() * 300));
      newStatuses[i] = 'complete';
      setStepStatuses([...newStatuses]);
    }

    setIsAnalyzing(false);
    setAnalysisComplete(true);
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-100">New Screening</h1>
        <p className="text-sm text-slate-400 mt-0.5">Upload a fundus image to begin AI-assisted diabetic retinopathy analysis.</p>
      </div>

      {/* Scenario selector (demo convenience) */}
      <div className="flex items-center gap-3 p-3 bg-slate-900 border border-slate-800 rounded-xl">
        <span className="text-xs text-slate-500">Demo scenario:</span>
        <button
          onClick={() => simulateUpload('gradable')}
          className={`px-3 py-1 text-xs rounded-lg border transition-colors cursor-pointer ${scenario === 'gradable' && hasImage ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'text-slate-400 border-slate-700 hover:border-slate-600'}`}
        >
          Gradable image
        </button>
        <button
          onClick={() => simulateUpload('ungradable')}
          className={`px-3 py-1 text-xs rounded-lg border transition-colors cursor-pointer ${scenario === 'ungradable' && hasImage ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'text-slate-400 border-slate-700 hover:border-slate-600'}`}
        >
          Ungradable image (poor quality)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Upload */}
        <div className="flex flex-col gap-4">
          {!hasImage ? (
            <div
              onDragOver={e => { e.preventDefault(); dragOver.current = true; }}
              onDrop={e => { e.preventDefault(); simulateUpload('gradable'); }}
              className="border-2 border-dashed border-slate-700 hover:border-cyan-500/50 rounded-xl p-12 flex flex-col items-center gap-4 text-center transition-colors cursor-pointer group"
              onClick={() => simulateUpload('gradable')}
            >
              <div className="w-16 h-16 rounded-2xl bg-slate-800 group-hover:bg-cyan-500/10 border border-slate-700 group-hover:border-cyan-500/30 flex items-center justify-center transition-colors">
                <Upload size={24} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-300">Upload Fundus Image</p>
                <p className="text-xs text-slate-500 mt-1">Drag and drop or click to browse</p>
                <p className="text-[10px] text-slate-600 mt-2 font-mono">Supported: JPEG · PNG · TIFF · DICOM</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">
                <Camera size={13} className="text-slate-500" />
                <span className="text-xs text-slate-500">Or connect fundus camera</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-200">Loaded Image</h3>
                <button
                  onClick={() => { setHasImage(false); setAnalysisComplete(false); setStepStatuses(PIPELINE_STEPS.map(() => 'pending')); }}
                  className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RefreshCw size={11} /> Reset
                </button>
              </div>
              <FundusViewer
                defaultMode={analysisComplete ? 'enhanced' : 'original'}
                showControls={analysisComplete}
              />
            </div>
          )}
        </div>

        {/* Right: Quality + Pipeline */}
        <div className="flex flex-col gap-4">
          {/* Quality assessment */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-200">Image Quality Assessment</h3>
              {hasImage && (
                <Badge variant={isGradable ? 'success' : 'danger'} dot>
                  {isGradable ? 'Gradable' : 'Ungradable'}
                </Badge>
              )}
            </div>

            {!hasImage ? (
              <p className="text-xs text-slate-600 text-center py-8">Upload an image to assess quality</p>
            ) : (
              <div className="space-y-4">
                <QualityBar label="Focus" value={quality.focus} />
                <QualityBar label="Illumination" value={quality.illumination} />
                <QualityBar label="Field of View" value={quality.fieldOfView} />
                <div className="pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Overall quality score</span>
                    <span className={`text-lg font-semibold font-mono ${quality.score >= 70 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {quality.score}%
                    </span>
                  </div>
                </div>

                {!isGradable && (
                  <div className="bg-amber-500/8 border border-amber-500/20 rounded-lg p-3 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={13} className="text-amber-400 flex-shrink-0" />
                      <span className="text-xs font-semibold text-amber-300">Image quality insufficient</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Focus quality is too low for reliable grading. Recapture recommended.
                    </p>
                    <p className="text-[10px] text-slate-500 italic">
                      "Hold the camera steady and ensure adequate retinal illumination."
                    </p>
                    <button className="mt-1 w-full py-1.5 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 rounded-lg text-xs text-amber-300 font-medium transition-colors cursor-pointer">
                      Recapture Image
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Processing pipeline */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex-1">
            <h3 className="text-sm font-semibold text-slate-200 mb-4">Processing Pipeline</h3>
            <div className="space-y-2">
              {PIPELINE_STEPS.map((step, i) => (
                <div key={step.id} className={`flex items-center gap-3 p-2.5 rounded-lg transition-colors ${
                  stepStatuses[i] === 'processing' ? 'bg-cyan-500/5 border border-cyan-500/15' :
                  stepStatuses[i] === 'complete' ? 'bg-emerald-500/5 border border-emerald-500/10' :
                  'border border-transparent'
                }`}>
                  <StepIcon status={stepStatuses[i]} />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-slate-300 truncate block">{step.label}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-600 flex-shrink-0">{step.module}</span>
                  <span className={`text-[10px] font-medium flex-shrink-0 capitalize ${
                    stepStatuses[i] === 'complete' ? 'text-emerald-400' :
                    stepStatuses[i] === 'processing' ? 'text-cyan-400' :
                    'text-slate-600'
                  }`}>
                    {stepStatuses[i]}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex gap-2">
              {!analysisComplete ? (
                <button
                  onClick={runAnalysis}
                  disabled={!hasImage || !isGradable || isAnalyzing}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 text-sm font-semibold rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  {isAnalyzing && <Loader2 size={15} className="animate-spin" />}
                  {isAnalyzing ? 'Analyzing…' : 'Start Analysis'}
                </button>
              ) : (
                <button
                  onClick={() => navigate('/patients/PT-10021')}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  View Results <ChevronRight size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
