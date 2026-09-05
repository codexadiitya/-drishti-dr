import { useState } from 'react';

export type OverlayMode = 'original' | 'enhanced' | 'vessel' | 'lesion' | 'gradcam' | 'combined';

interface FundusImageProps {
  mode: OverlayMode;
  heatmapOpacity?: number;
}

const MICROANEURYSM_POSITIONS = [
  [148, 195], [155, 210], [140, 218], [168, 200], [165, 215], [178, 208],
  [182, 192], [158, 228], [172, 235], [188, 222], [193, 204], [163, 182],
  [145, 192], [175, 178],
];

const HEMORRHAGE_POSITIONS: [number, number, number, number][] = [
  [143, 202, 6, 4], [176, 218, 5, 4], [165, 232, 7, 5],
  [192, 226, 5, 4], [182, 196, 4, 4], [155, 220, 6, 5],
];

const EXUDATE_POSITIONS: [number, number, number][] = [
  [170, 224, 7], [186, 230, 5], [180, 212, 6],
];

function FundusImage({ mode, heatmapOpacity = 0.7 }: FundusImageProps) {
  const showOriginal = ['original', 'enhanced', 'vessel', 'lesion', 'combined'].includes(mode);
  const showVessels = ['original', 'enhanced', 'vessel', 'combined'].includes(mode);
  const showLesions = ['lesion', 'combined'].includes(mode);
  const showGradCam = ['gradcam', 'combined'].includes(mode);
  const isVesselMode = mode === 'vessel';
  const isEnhanced = mode === 'enhanced';

  const bgOpacity = showGradCam && mode !== 'combined' ? 0.4 : 1;
  const vesselColor = isVesselMode ? '#60a5fa' : isEnhanced ? '#d04535' : '#b83520';

  return (
    <svg viewBox="0 0 400 400" className="w-full h-full" style={{ display: 'block' }}>
      <defs>
        <clipPath id="fundus-clip">
          <circle cx="200" cy="200" r="196" />
        </clipPath>
        <radialGradient id="fundus-bg" cx="45%" cy="48%" r="55%">
          <stop offset="0%" stopColor={isEnhanced ? '#3a0c04' : '#200803'} />
          <stop offset="25%" stopColor={isEnhanced ? '#2e0902' : '#1e0602'} />
          <stop offset="60%" stopColor={isEnhanced ? '#1c0500' : '#150401'} />
          <stop offset="100%" stopColor="#060100" />
        </radialGradient>
        <radialGradient id="vessel-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#05080f" />
          <stop offset="100%" stopColor="#020304" />
        </radialGradient>
        <radialGradient id="disc-grad" cx="45%" cy="40%" r="60%">
          <stop offset="0%" stopColor={isEnhanced ? '#fff8e0' : '#ffe8a8'} />
          <stop offset="40%" stopColor={isEnhanced ? '#ffce60' : '#e8a040'} />
          <stop offset="80%" stopColor="#c06828" />
          <stop offset="100%" stopColor="#8a4018" />
        </radialGradient>
        <radialGradient id="cup-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff4d0" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#e0a840" stopOpacity="0.2" />
        </radialGradient>
        <radialGradient id="fovea-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#080200" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#1a0500" stopOpacity="0.1" />
        </radialGradient>
        {/* Grad-CAM heatmap gradients */}
        <radialGradient id="heat1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ef4444" stopOpacity={heatmapOpacity} />
          <stop offset="40%" stopColor="#f97316" stopOpacity={heatmapOpacity * 0.7} />
          <stop offset="70%" stopColor="#eab308" stopOpacity={heatmapOpacity * 0.4} />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="heat2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f97316" stopOpacity={heatmapOpacity * 0.75} />
          <stop offset="50%" stopColor="#eab308" stopOpacity={heatmapOpacity * 0.4} />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="heat3" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#eab308" stopOpacity={heatmapOpacity * 0.55} />
          <stop offset="60%" stopColor="#22c55e" stopOpacity={heatmapOpacity * 0.2} />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="glow-disc" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffe090" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#ffe090" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background — changes based on mode */}
      <g clipPath="url(#fundus-clip)">
        <circle cx="200" cy="200" r="196"
          fill={isVesselMode ? 'url(#vessel-bg)' : 'url(#fundus-bg)'}
          opacity={bgOpacity}
        />

        {/* Choroidal texture */}
        {showOriginal && !isVesselMode && (
          <>
            <ellipse cx="185" cy="195" rx="95" ry="85" fill="#2a0906" opacity="0.25" />
            <ellipse cx="160" cy="210" rx="65" ry="55" fill="#200704" opacity="0.2" />
            <ellipse cx="220" cy="185" rx="55" ry="45" fill="#1e0704" opacity="0.15" />
          </>
        )}

        {/* Blood vessels */}
        {showVessels && (
          <g stroke={vesselColor} fill="none" strokeLinecap="round" strokeLinejoin="round"
            opacity={isVesselMode ? 0.9 : 0.85}>
            {/* Superior temporal main arcade */}
            <path d="M 263,178 C 248,155 225,138 198,132 C 172,126 145,132 127,148 C 115,160 112,172 115,185" strokeWidth="2.5" />
            {/* Superior first branch */}
            <path d="M 215,137 C 202,128 188,125 175,128 C 163,130 155,134 150,140" strokeWidth="1.8" />
            {/* Superior second branch */}
            <path d="M 180,130 C 170,124 160,122 152,124" strokeWidth="1.2" />
            {/* Superior fine arcade */}
            <path d="M 240,146 C 232,138 222,133 212,132" strokeWidth="1.2" />
            {/* Superior nasal */}
            <path d="M 272,180 C 285,168 298,158 315,150" strokeWidth="1.8" />
            <path d="M 282,174 C 292,163 302,156 316,152" strokeWidth="1.2" />

            {/* Inferior temporal main arcade */}
            <path d="M 263,200 C 248,222 225,240 198,248 C 172,254 145,248 127,232 C 115,220 112,208 115,205" strokeWidth="2.5" />
            {/* Inferior first branch */}
            <path d="M 215,243 C 202,252 188,255 175,252 C 163,250 155,246 150,242" strokeWidth="1.8" />
            {/* Inferior second branch */}
            <path d="M 180,252 C 170,258 160,258 152,256" strokeWidth="1.2" />
            {/* Inferior fine arcade */}
            <path d="M 240,235 C 232,242 222,247 212,248" strokeWidth="1.2" />
            {/* Inferior nasal */}
            <path d="M 272,200 C 285,213 298,224 315,232" strokeWidth="1.8" />
            <path d="M 282,207 C 292,218 302,226 316,230" strokeWidth="1.2" />

            {/* Central temporal vessel toward fovea */}
            <path d="M 263,190 C 240,191 218,194 195,197 C 178,199 165,201 155,202" strokeWidth="1.5" />
            {/* Fine central */}
            <path d="M 185,196 C 172,198 163,200 158,202" strokeWidth="1.0" />

            {/* Disc ring vessels */}
            <path d="M 260,177 C 256,170 250,165 244,163" strokeWidth="1.0" />
            <path d="M 260,205 C 256,211 250,216 244,218" strokeWidth="1.0" />
          </g>
        )}

        {/* Optic disc */}
        {showOriginal && (
          <>
            <circle cx="265" cy="188" r="32" fill="url(#glow-disc)" />
            <ellipse cx="265" cy="188" rx="22" ry="24" fill="url(#disc-grad)" />
            <ellipse cx="267" cy="187" rx="10" ry="11" fill="url(#cup-grad)" />
          </>
        )}
        {isVesselMode && (
          <ellipse cx="265" cy="188" rx="22" ry="24" fill="#1f2937" stroke="#60a5fa" strokeWidth="1" opacity="0.6" />
        )}

        {/* Fovea / macula */}
        {showOriginal && !isVesselMode && (
          <circle cx="150" cy="202" r="14" fill="url(#fovea-grad)" />
        )}

        {/* Grad-CAM heatmap */}
        {showGradCam && (
          <g style={{ mixBlendMode: 'screen' }}>
            <ellipse cx="163" cy="208" rx="52" ry="46" fill="url(#heat1)" />
            <ellipse cx="188" cy="197" rx="40" ry="36" fill="url(#heat2)" />
            <ellipse cx="205" cy="218" rx="35" ry="30" fill="url(#heat3)" />
          </g>
        )}

        {/* Lesion overlay */}
        {showLesions && (
          <g>
            {/* Microaneurysms — tiny red-orange dots */}
            {MICROANEURYSM_POSITIONS.map(([x, y], i) => (
              <circle key={`ma-${i}`} cx={x} cy={y} r={2.5} fill="#f97316" opacity="0.85" />
            ))}
            {/* Hemorrhages — dark red blotches */}
            {HEMORRHAGE_POSITIONS.map(([x, y, rx, ry], i) => (
              <ellipse key={`hm-${i}`} cx={x} cy={y} rx={rx} ry={ry} fill="#7f1d1d" opacity="0.8" />
            ))}
            {/* Exudates — bright yellow-white patches */}
            {EXUDATE_POSITIONS.map(([x, y, r], i) => (
              <circle key={`ex-${i}`} cx={x} cy={y} r={r} fill="#fef08a" opacity="0.75" />
            ))}
          </g>
        )}
      </g>

      {/* Circle border */}
      <circle cx="200" cy="200" r="196" fill="none" stroke="#1e293b" strokeWidth="2" />

      {/* Mode label watermark */}
      <text x="200" y="385" textAnchor="middle" fill="rgba(148,163,184,0.5)" fontSize="9" fontFamily="'JetBrains Mono', monospace">
        {mode.toUpperCase()} • DEMO VISUALIZATION
      </text>
    </svg>
  );
}

const MODES: { id: OverlayMode; label: string }[] = [
  { id: 'original', label: 'Original' },
  { id: 'enhanced', label: 'Enhanced' },
  { id: 'vessel', label: 'Vessel Overlay' },
  { id: 'lesion', label: 'Lesion Overlay' },
  { id: 'gradcam', label: 'Grad-CAM' },
  { id: 'combined', label: 'Combined Evidence' },
];

interface FundusViewerProps {
  className?: string;
  defaultMode?: OverlayMode;
  showControls?: boolean;
}

export function FundusViewer({ className = '', defaultMode = 'original', showControls = true }: FundusViewerProps) {
  const [mode, setMode] = useState<OverlayMode>(defaultMode);
  const [heatmapOpacity, setHeatmapOpacity] = useState(0.7);

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {showControls && (
        <div className="flex flex-wrap gap-1.5">
          {MODES.map(m => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                mode === m.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200 hover:border-slate-600'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      )}

      {(mode === 'gradcam' || mode === 'combined') && showControls && (
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-mono">Heatmap opacity</span>
          <input
            type="range"
            min={20}
            max={100}
            value={Math.round(heatmapOpacity * 100)}
            onChange={e => setHeatmapOpacity(Number(e.target.value) / 100)}
            className="flex-1 max-w-32 accent-cyan-500 h-1"
          />
          <span className="text-xs text-slate-400 font-mono w-8">{Math.round(heatmapOpacity * 100)}%</span>
        </div>
      )}

      <div className="rounded-xl overflow-hidden bg-black fundus-shadow aspect-square w-full">
        <FundusImage mode={mode} heatmapOpacity={heatmapOpacity} />
      </div>
    </div>
  );
}

export { FundusImage };
