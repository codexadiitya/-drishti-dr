import { useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Layers, Eye, Sparkles, Activity } from 'lucide-react';

export type OverlayMode = 'original' | 'enhanced' | 'vessel' | 'lesion' | 'gradcam' | 'combined' | 'grayscale';

interface FundusImageProps {
  mode: OverlayMode;
  heatmapOpacity?: number;
  imageUrl?: string;
  enhancedImageUrl?: string;
  gradcamUrl?: string;
  zoom?: number;
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

function FundusImage({
  mode,
  heatmapOpacity = 0.7,
  imageUrl,
  enhancedImageUrl,
  gradcamUrl,
  zoom = 1,
}: FundusImageProps) {
  const showOriginal = ['original', 'enhanced', 'vessel', 'lesion', 'combined', 'grayscale'].includes(mode);
  const showVessels = ['original', 'enhanced', 'vessel', 'combined', 'grayscale'].includes(mode);
  const showLesions = ['lesion', 'combined'].includes(mode);
  const showGradCam = ['gradcam', 'combined'].includes(mode);
  const isVesselMode = mode === 'vessel';
  const isEnhanced = mode === 'enhanced';
  const isGrayscale = mode === 'grayscale';

  // Check whether we have a genuine clinical or user-uploaded photograph
  const hasRealImage = Boolean(imageUrl || enhancedImageUrl || gradcamUrl);

  // Determine active visual source depending on selected mode
  let activeSrc = imageUrl;
  if (mode === 'gradcam') {
    activeSrc = gradcamUrl || imageUrl || enhancedImageUrl;
  } else if (mode === 'enhanced') {
    activeSrc = enhancedImageUrl || imageUrl;
  } else if (mode === 'original') {
    activeSrc = imageUrl || enhancedImageUrl;
  } else if (mode === 'combined') {
    activeSrc = gradcamUrl || enhancedImageUrl || imageUrl;
  } else if (mode === 'grayscale') {
    activeSrc = imageUrl || enhancedImageUrl;
  } else {
    // vessel, lesion
    activeSrc = imageUrl || enhancedImageUrl;
  }

  const bgOpacity = showGradCam && mode !== 'combined' && !hasRealImage ? 0.35 : 1;
  const vesselColor = isVesselMode ? '#60a5fa' : isEnhanced ? '#d04535' : '#b83520';

  // Filter effect when rendering real fundus photos
  let imageFilter: string | undefined = undefined;
  if (hasRealImage) {
    if (mode === 'grayscale') {
      imageFilter = 'grayscale(100%) contrast(140%) brightness(108%)';
    } else if (mode === 'enhanced' && !enhancedImageUrl) {
      imageFilter = 'contrast(135%) brightness(104%) saturate(115%)';
    } else if (mode === 'vessel') {
      imageFilter = 'contrast(175%) brightness(95%) hue-rotate(90deg)';
    }
  }

  return (
    <div className="w-full h-full relative overflow-hidden bg-black flex items-center justify-center">
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full transition-transform duration-200"
        style={{
          display: 'block',
          transform: `scale(${zoom})`,
          transformOrigin: 'center center',
        }}
      >
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

          {/* Grad-CAM heatmap gradients for synthetic or layered blend */}
          <radialGradient id="heat1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity={heatmapOpacity} />
            <stop offset="40%" stopColor="#f97316" stopOpacity={heatmapOpacity * 0.75} />
            <stop offset="70%" stopColor="#eab308" stopOpacity={heatmapOpacity * 0.45} />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="heat2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f97316" stopOpacity={heatmapOpacity * 0.8} />
            <stop offset="50%" stopColor="#eab308" stopOpacity={heatmapOpacity * 0.45} />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="heat3" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#eab308" stopOpacity={heatmapOpacity * 0.6} />
            <stop offset="60%" stopColor="#22c55e" stopOpacity={heatmapOpacity * 0.25} />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Retinal Fundus Base */}
        <g clipPath="url(#fundus-clip)">
          {/* Base layer: always show original/enhanced image */}
          {(imageUrl || enhancedImageUrl) ? (
            <image
              href={imageUrl || enhancedImageUrl}
              xlinkHref={imageUrl || enhancedImageUrl}
              x="0" y="0" width="400" height="400"
              preserveAspectRatio="xMidYMid slice"
              opacity={1}
              style={imageFilter && mode !== 'gradcam' ? { filter: imageFilter } : undefined}
            />
          ) : activeSrc ? (
            <image
              href={activeSrc}
              xlinkHref={activeSrc}
              x="0" y="0" width="400" height="400"
              preserveAspectRatio="xMidYMid slice"
              opacity={bgOpacity}
              style={imageFilter ? { filter: imageFilter } : undefined}
            />
          ) : (
            <circle cx="200" cy="200" r="196"
              fill={isVesselMode ? 'url(#vessel-bg)' : 'url(#fundus-bg)'}
              opacity={bgOpacity}
            />
          )}

          {/* Grad-CAM overlay: real heatmap image on top with adjustable opacity */}
          {showGradCam && gradcamUrl && (
            <image
              href={gradcamUrl}
              xlinkHref={gradcamUrl}
              x="0" y="0" width="400" height="400"
              preserveAspectRatio="xMidYMid slice"
              opacity={heatmapOpacity}
              style={{ mixBlendMode: 'multiply' }}
            />
          )}


          {/* Choroidal texture (fallback synthetic mode only) */}
          {!hasRealImage && showOriginal && !isVesselMode && (
            <>
              <ellipse cx="185" cy="195" rx="95" ry="85" fill="#2a0906" opacity="0.25" />
              <ellipse cx="160" cy="210" rx="65" ry="55" fill="#200704" opacity="0.2" />
            </>
          )}

          {/* Optic Disc landmark — shown on both real and synthetic images */}
          {showOriginal && (
            <g id="optic-disc" opacity={hasRealImage ? 0.45 : 1}>
              {!hasRealImage && (
                <>
                  <ellipse cx="265" cy="188" rx="28" ry="34" fill="url(#disc-grad)" />
                  <ellipse cx="263" cy="188" rx="14" ry="18" fill="url(#cup-grad)" />
                </>
              )}
              {/* Optic disc ring annotation — always visible */}
              <ellipse cx="265" cy="188" rx="30" ry="36" fill="none"
                stroke={isVesselMode ? '#60a5fa' : hasRealImage ? '#facc15' : 'none'}
                strokeWidth="1.5" strokeDasharray="4 3" />
              {/* Optic disc label dot */}
              <circle cx="265" cy="155" r="3" fill="#facc15" opacity={hasRealImage ? 0.8 : 0} />
              <text x="272" y="152" fontSize="9" fill="#facc15" fontFamily="monospace"
                opacity={hasRealImage ? 0.85 : 0}>OD</text>
            </g>
          )}

          {/* Fovea / Macula — shown on both real and synthetic images */}
          {showOriginal && (
            <g id="macula" opacity={hasRealImage ? 0.45 : 1}>
              {!hasRealImage && (
                <>
                  <ellipse cx="150" cy="202" rx="36" ry="30" fill="url(#fovea-grad)" />
                  <circle cx="150" cy="202" r="6" fill="#040100" opacity="0.95" />
                  <circle cx="150" cy="202" r="1.5" fill="#ffe090" opacity="0.6" />
                </>
              )}
              {/* Foveal marker annotation — always visible */}
              <ellipse cx="150" cy="202" rx="18" ry="15" fill="none"
                stroke={isVesselMode ? '#eab308' : hasRealImage ? '#38bdf8' : 'none'}
                strokeWidth="1" strokeDasharray="3 2" />
              {/* Crosshair */}
              {hasRealImage && (
                <>
                  <line x1="143" y1="202" x2="157" y2="202" stroke="#38bdf8" strokeWidth="0.8" opacity="0.9" />
                  <line x1="150" y1="195" x2="150" y2="209" stroke="#38bdf8" strokeWidth="0.8" opacity="0.9" />
                  <circle cx="150" cy="202" r="2" fill="#38bdf8" opacity="0.85" />
                  <text x="155" y="195" fontSize="9" fill="#38bdf8" fontFamily="monospace" opacity="0.85">Fovea</text>
                </>
              )}
            </g>
          )}

          {/* Retinal Vessel Arcades — always rendered, semi-transparent on real images */}
          {showVessels && (
            <g id="vessels" stroke={vesselColor} fill="none" strokeLinecap="round"
              opacity={hasRealImage ? 0.38 : 1}>
              <path d="M 263 180 Q 255 130 220 95 Q 190 70 140 65" strokeWidth={isVesselMode ? 3.5 : 2.8} />
              <path d="M 220 95 Q 185 85 140 90 Q 100 100 70 120" strokeWidth={isVesselMode ? 2.5 : 2} />
              <path d="M 263 196 Q 252 245 218 285 Q 180 320 130 330" strokeWidth={isVesselMode ? 3.5 : 2.8} />
              <path d="M 218 285 Q 175 300 135 295 Q 95 285 65 255" strokeWidth={isVesselMode ? 2.5 : 2} />
              <path d="M 270 182 Q 300 160 335 155 Q 360 152 385 156" strokeWidth={isVesselMode ? 2.2 : 1.8} />
              <path d="M 270 194 Q 305 215 340 225 Q 365 230 388 230" strokeWidth={isVesselMode ? 2.2 : 1.8} />
              <path d="M 255 175 Q 210 178 175 188" strokeWidth={isVesselMode ? 1.8 : 1.4} />
              <path d="M 255 198 Q 215 198 175 210" strokeWidth={isVesselMode ? 1.8 : 1.4} />
            </g>
          )}

          {/* Lesions (visible in lesion and combined modes) */}
          {showLesions && (
            <g id="lesion-overlay">
              {/* Microaneurysms */}
              {MICROANEURYSM_POSITIONS.map(([cx, cy], i) => (
                <g key={`ma-${i}`}>
                  <circle cx={cx} cy={cy} r="3.2" fill="#ef4444" opacity="0.9" />
                  <circle cx={cx} cy={cy} r="6" fill="none" stroke="#f87171" strokeWidth="0.9" opacity="0.75" />
                </g>
              ))}

              {/* Hemorrhages */}
              {HEMORRHAGE_POSITIONS.map(([cx, cy, rx, ry], i) => (
                <ellipse
                  key={`hem-${i}`}
                  cx={cx}
                  cy={cy}
                  rx={rx}
                  ry={ry}
                  fill="#b91c1c"
                  opacity="0.85"
                  stroke="#ef4444"
                  strokeWidth="0.6"
                />
              ))}

              {/* Exudates */}
              {EXUDATE_POSITIONS.map(([cx, cy, r], i) => (
                <g key={`ex-${i}`}>
                  <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.7} fill="#fbbf24" opacity="0.88" />
                  <ellipse cx={cx - 1} cy={cy - 1} rx={r * 0.5} ry={r * 0.35} fill="#fef08a" opacity="0.95" />
                </g>
              ))}
            </g>
          )}

          {/* Grad-CAM Heatmap: when no backend gradcamUrl is provided, or in combined mode overlay */}
          {showGradCam && (!gradcamUrl || mode === 'combined') && (
            <g id="gradcam-heatmap" style={{ mixBlendMode: 'screen', opacity: heatmapOpacity }}>
              <circle cx="165" cy="215" r="75" fill="url(#heat1)" />
              <circle cx="185" cy="200" r="55" fill="url(#heat2)" />
              <circle cx="145" cy="205" r="45" fill="url(#heat3)" />
            </g>
          )}
        </g>

        {/* Outer Circular Boundary */}
        <circle cx="200" cy="200" r="196" fill="none" stroke="#334155" strokeWidth="2" />

        {/* Watermark */}
        <text
          x="200"
          y="385"
          textAnchor="middle"
          fill="rgba(255,255,255,0.4)"
          fontSize="9"
          fontFamily="monospace"
        >
          NETRARAKSHAQ • {mode.toUpperCase()}
        </text>
      </svg>

      {/* Mode pill on top right */}
      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white/90 px-2.5 py-1 rounded text-[10px] font-mono border border-white/10 uppercase">
        {mode}
      </div>
    </div>
  );
}

const MODES: { id: OverlayMode; label: string }[] = [
  { id: 'original', label: 'Original' },
  { id: 'enhanced', label: 'Enhanced (CLAHE)' },
  { id: 'grayscale', label: 'B&W Segmentation' },
  { id: 'vessel', label: 'Retinal Vessels' },
  { id: 'lesion', label: 'Lesion Overlay' },
  { id: 'gradcam', label: 'Grad-CAM' },
  { id: 'combined', label: 'Combined' },
];

interface FundusViewerProps {
  className?: string;
  defaultMode?: OverlayMode;
  showControls?: boolean;
  eye?: 'OD' | 'OS' | 'Both';
  imageUrl?: string;
  enhancedImageUrl?: string;
  gradcamUrl?: string;
  onModeChange?: (mode: OverlayMode) => void;
}

export function FundusViewer({
  className = '',
  defaultMode = 'original',
  showControls = true,
  eye = 'OD',
  imageUrl,
  enhancedImageUrl,
  gradcamUrl,
  onModeChange,
}: FundusViewerProps) {
  const [mode, setMode] = useState<OverlayMode>(defaultMode);
  const [heatmapOpacity, setHeatmapOpacity] = useState(0.7);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    setMode(defaultMode);
  }, [defaultMode]);

  function handleModeSelect(newMode: OverlayMode) {
    setMode(newMode);
    if (onModeChange) onModeChange(newMode);
  }

  return (
    <div className={`flex flex-col gap-2.5 ${className}`}>
      {showControls && (
        <div className="flex flex-wrap items-center justify-between gap-1.5">
          <div className="flex flex-wrap gap-1">
            {MODES.map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => handleModeSelect(m.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  mode === m.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setZoom(z => Math.max(0.8, z - 0.2))}
              className="p-1 text-gray-500 hover:text-gray-800 rounded hover:bg-gray-100 cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut size={13} />
            </button>
            <span className="text-[10px] font-mono px-1 text-gray-600 w-8 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoom(z => Math.min(2.0, z + 0.2))}
              className="p-1 text-gray-500 hover:text-gray-800 rounded hover:bg-gray-100 cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn size={13} />
            </button>
          </div>
        </div>
      )}

      {(mode === 'gradcam' || mode === 'combined') && showControls && (
        <div className="flex items-center justify-between gap-3 bg-white p-2 rounded-lg border border-gray-200 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Heatmap Activation Opacity:</span>
            <input
              type="range"
              min={20}
              max={100}
              value={Math.round(heatmapOpacity * 100)}
              onChange={e => setHeatmapOpacity(Number(e.target.value) / 100)}
              className="w-24 sm:w-36 accent-blue-600 h-1 cursor-pointer"
            />
            <span className="font-mono text-gray-600 text-xs">{Math.round(heatmapOpacity * 100)}%</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[10px] text-gray-500 font-mono">
            <span className="w-2 h-2 rounded-full bg-blue-500" /> Low
            <span className="w-2 h-2 rounded-full bg-yellow-500 ml-1" /> Med
            <span className="w-2 h-2 rounded-full bg-red-500 ml-1" /> High
          </div>
        </div>
      )}

      {/* Retinal viewer container */}
      <div className="rounded-xl overflow-hidden fundus-shadow aspect-square w-full relative border border-gray-800">
        <FundusImage
          mode={mode}
          heatmapOpacity={heatmapOpacity}
          imageUrl={imageUrl}
          enhancedImageUrl={enhancedImageUrl}
          gradcamUrl={gradcamUrl}
          zoom={zoom}
        />

        {/* Eye badge */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[11px] font-bold border border-white/15">
          {eye === 'OD' ? 'Right Eye (OD)' : eye === 'OS' ? 'Left Eye (OS)' : 'Both Eyes'}
        </div>
      </div>
    </div>
  );
}

export { FundusImage };
