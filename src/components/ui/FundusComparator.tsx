import { useRef, useState, useCallback } from "react";
import { FundusImage } from "./FundusViewer";

interface FundusComparatorProps {
  imageUrl?: string;
  gradcamUrl?: string;
  enhancedImageUrl?: string;
  eye?: "OD" | "OS" | "Both";
  className?: string;
}

export function FundusComparator({
  imageUrl,
  gradcamUrl,
  enhancedImageUrl,
  eye = "OD",
  className = "",
}: FundusComparatorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [splitPct, setSplitPct] = useState(50);

  const updateSplit = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.min(95, Math.max(5, ((clientX - rect.left) / rect.width) * 100));
    setSplitPct(pct);
  }, []);

  const onMouseMove = (e: React.MouseEvent) => { if (dragging) updateSplit(e.clientX); };
  const onTouchMove = (e: React.TouchEvent) => updateSplit(e.touches[0].clientX);

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-[11px] font-mono px-1">
        <span className="text-cyan-400 font-bold">Preprocessed (CLAHE + Norm + 224x224)</span>
        <span className="text-orange-400 font-bold">MobileNetV2 Grad-CAM</span>
      </div>

      <div
        ref={containerRef}
        className="relative aspect-square w-full rounded-xl overflow-hidden bg-black border border-gray-700 select-none cursor-col-resize"
        onMouseMove={onMouseMove}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => setDragging(false)}
        style={{ touchAction: "none" }}
        onTouchMove={onTouchMove}
        onTouchEnd={() => setDragging(false)}
      >
        {/* RIGHT: Grad-CAM background */}
        <div className="absolute inset-0">
          <FundusImage mode="gradcam" imageUrl={imageUrl} enhancedImageUrl={enhancedImageUrl} gradcamUrl={gradcamUrl} heatmapOpacity={0.75} zoom={1} />
        </div>
        <div className="absolute top-3 right-3 text-[10px] font-mono font-bold text-orange-300 bg-black/60 px-2 py-0.5 rounded pointer-events-none z-10">
          MobileNetV2 Grad-CAM
        </div>

        {/* LEFT: CLAHE panel clipped */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ width: `${splitPct}%` }}>
          <div className="absolute inset-0" style={{ width: `${10000 / splitPct}%`, maxWidth: "none" }}>
            <FundusImage mode="enhanced" imageUrl={imageUrl} enhancedImageUrl={enhancedImageUrl} gradcamUrl={gradcamUrl} heatmapOpacity={0} zoom={1} />
          </div>
        </div>
        <div className="absolute top-3 left-3 text-[10px] font-mono font-bold text-cyan-300 bg-black/60 px-2 py-0.5 rounded pointer-events-none z-10">
          Preprocessed (CLAHE)
        </div>

        {/* Divider */}
        <div
          className="absolute top-0 bottom-0 z-20 flex items-center justify-center"
          style={{ left: `calc(${splitPct}% - 1px)`, width: "2px", background: "rgba(255,255,255,0.85)" }}
          onMouseDown={() => setDragging(true)}
          onTouchStart={() => setDragging(true)}
        >
          <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-300 shadow-lg flex items-center justify-center cursor-col-resize">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M4 3L1 7L4 11M10 3L13 7L10 11" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Eye badge */}
        <div className="absolute bottom-3 left-3 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded border border-white/20 z-10">
          {eye === "OD" ? "Right Eye (OD)" : eye === "OS" ? "Left Eye (OS)" : "Both Eyes"}
        </div>
        <div className="absolute bottom-3 right-3 bg-black/60 text-white/60 text-[9px] font-mono px-2 py-0.5 rounded z-10">
          Drag to compare
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-[10px] font-mono text-gray-400">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Low activation</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" /> Moderate</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Peak saliency</span>
      </div>
    </div>
  );
}
