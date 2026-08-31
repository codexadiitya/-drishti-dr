'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { DRGrade, EyeLaterality, InferenceResult, RetinalImageMetadata } from '@/lib/types';
import { drawRetinalFundus, CanvasLayerConfig } from '@/lib/retinal-canvas';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  SlidersHorizontal,
  Layers,
  Eye,
  Crosshair,
  Sparkles,
  Maximize2,
  Minimize2,
  Info,
  ShieldCheck
} from 'lucide-react';

interface RetinalViewerProps {
  grade?: DRGrade;
  eye?: EyeLaterality;
  dme?: boolean;
  imageMetadata?: RetinalImageMetadata;
  inference?: InferenceResult;
  initialSideBySide?: boolean;
  interactiveControls?: boolean;
}

export const RetinalViewer: React.FC<RetinalViewerProps> = ({
  grade = 2,
  eye = 'OD',
  dme = false,
  imageMetadata,
  inference,
  initialSideBySide = false,
  interactiveControls = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeEye, setActiveEye] = useState<EyeLaterality>(eye);
  const [zoom, setZoom] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [layerDrawerOpen, setLayerDrawerOpen] = useState<boolean>(false);

  const [layers, setLayers] = useState<CanvasLayerConfig>({
    showBaseFundus: true,
    showVessels: true,
    showMicroaneurysms: true,
    showExudates: true,
    showGradCAM: false,
    showAnnotations: true,
    baseOpacity: 1.0,
    vesselOpacity: 0.9,
    lesionOpacity: 0.95,
    gradcamOpacity: 0.75,
    contrast: 105,
    brightness: 100
  });

  const activeGrade = inference ? inference.icdrGrade : grade;
  const activeDme = inference ? inference.dmeRisk : dme;

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.save();
    ctx.clearRect(0, 0, width, height);

    // Apply Pan & Zoom transformations
    ctx.translate(width / 2 + pan.x, height / 2 + pan.y);
    ctx.scale(zoom, zoom);
    ctx.translate(-width / 2, -height / 2);

    const seed = activeEye === 'OD' ? 1042 : 2084;
    drawRetinalFundus(ctx, width, height, activeGrade, activeEye, activeDme, layers, seed);

    ctx.restore();
  }, [activeGrade, activeEye, activeDme, layers, zoom, pan]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleResetView = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-white overflow-hidden shadow-lg">
      {/* Top Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800 gap-2">
        {/* Laterality Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveEye('OD')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              activeEye === 'OD'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Right Eye (OD)
          </button>
          <button
            onClick={() => setActiveEye('OS')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              activeEye === 'OS'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Left Eye (OS)
          </button>
        </div>

        {/* View Controls & Zoom */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setZoom(z => Math.max(0.75, z - 0.25))}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="text-xs font-mono px-2 text-slate-300 font-semibold min-w-[3.5rem] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(z => Math.min(4.0, z + 0.25))}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={handleResetView}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Reset Pan & Zoom"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <div className="h-4 w-px bg-slate-800 mx-1" />
          <button
            onClick={() => setLayerDrawerOpen(!layerDrawerOpen)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              layerDrawerOpen
                ? 'bg-teal-600 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Overlays & Filters</span>
          </button>
        </div>
      </div>

      {/* Main Canvas + Overlay Panel */}
      <div className="relative flex items-center justify-center bg-black min-h-[420px] max-h-[560px] overflow-hidden select-none">
        <canvas
          ref={canvasRef}
          width={640}
          height={640}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="max-w-full max-h-[540px] cursor-grab active:cursor-grabbing transition-transform duration-75"
        />

        {/* Quick Canvas Watermark & Quality Tag */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-xs font-bold text-white">
            <Crosshair className="h-3.5 w-3.5 text-teal-400" />
            <span>
              {activeEye} • {activeEye === 'OD' ? 'Oculus Dexter' : 'Oculus Sinister'}
            </span>
          </div>
          {inference && (
            <div className="px-2 py-0.5 rounded bg-teal-900/80 border border-teal-500/40 text-[11px] text-teal-200 font-medium">
              AI Grade: {inference.icdrLabel} ({inference.confidence}% conf)
            </div>
          )}
        </div>

        {/* Overlay Layers Control Flyout */}
        {layerDrawerOpen && (
          <div className="absolute top-3 right-3 w-72 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700 p-4 shadow-2xl space-y-3 z-30 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Diagnostic Layers
              </span>
              <span className="text-[10px] text-teal-400 font-mono">Multi-Layer Blend</span>
            </div>

            {/* Layer Checkboxes & Sliders */}
            <div className="space-y-2.5 text-xs">
              {/* Base Fundus */}
              <div>
                <label className="flex items-center justify-between text-slate-200 font-medium">
                  <span className="flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      checked={layers.showBaseFundus}
                      onChange={e => setLayers({ ...layers, showBaseFundus: e.target.checked })}
                      className="rounded accent-teal-600"
                    />
                    Fundus Photograph
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {Math.round(layers.baseOpacity * 100)}%
                  </span>
                </label>
                {layers.showBaseFundus && (
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={layers.baseOpacity}
                    onChange={e => setLayers({ ...layers, baseOpacity: parseFloat(e.target.value) })}
                    className="w-full h-1 mt-1 accent-teal-500 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                )}
              </div>

              {/* Vessel Tree */}
              <div>
                <label className="flex items-center justify-between text-slate-200 font-medium">
                  <span className="flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      checked={layers.showVessels}
                      onChange={e => setLayers({ ...layers, showVessels: e.target.checked })}
                      className="rounded accent-teal-600"
                    />
                    Vessel Segmentation Tree
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {Math.round(layers.vesselOpacity * 100)}%
                  </span>
                </label>
                {layers.showVessels && (
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={layers.vesselOpacity}
                    onChange={e => setLayers({ ...layers, vesselOpacity: parseFloat(e.target.value) })}
                    className="w-full h-1 mt-1 accent-teal-500 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                )}
              </div>

              {/* Red Lesions */}
              <div>
                <label className="flex items-center justify-between text-slate-200 font-medium">
                  <span className="flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      checked={layers.showMicroaneurysms}
                      onChange={e => setLayers({ ...layers, showMicroaneurysms: e.target.checked })}
                      className="rounded accent-teal-600"
                    />
                    Microaneurysms & Hemorrhages
                  </span>
                  <span className="text-[11px] text-rose-400 font-mono">
                    {activeGrade >= 1 ? 'Detected' : 'None'}
                  </span>
                </label>
              </div>

              {/* Bright Lesions / Exudates */}
              <div>
                <label className="flex items-center justify-between text-slate-200 font-medium">
                  <span className="flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      checked={layers.showExudates}
                      onChange={e => setLayers({ ...layers, showExudates: e.target.checked })}
                      className="rounded accent-teal-600"
                    />
                    Hard Exudates (DME Ring)
                  </span>
                  <span className="text-[11px] text-amber-400 font-mono">
                    {activeDme ? 'Macular Ring' : 'Trace'}
                  </span>
                </label>
              </div>

              {/* Grad-CAM Saliency Heatmap */}
              <div className="p-2 rounded-xl bg-teal-950/60 border border-teal-800/80">
                <label className="flex items-center justify-between text-teal-200 font-bold">
                  <span className="flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      checked={layers.showGradCAM}
                      onChange={e => setLayers({ ...layers, showGradCAM: e.target.checked })}
                      className="rounded accent-teal-500"
                    />
                    <Sparkles className="h-3.5 w-3.5 text-teal-400" />
                    Grad-CAM Heatmap
                  </span>
                  <span className="text-[11px] text-teal-300 font-mono">
                    {Math.round(layers.gradcamOpacity * 100)}%
                  </span>
                </label>
                {layers.showGradCAM && (
                  <div className="mt-1.5 space-y-1">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={layers.gradcamOpacity}
                      onChange={e => setLayers({ ...layers, gradcamOpacity: parseFloat(e.target.value) })}
                      className="w-full h-1 accent-teal-400 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Low Saliency</span>
                      <span className="text-rose-400 font-bold">Pathology Focus</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Anatomical Grid */}
              <div>
                <label className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <input
                    type="checkbox"
                    checked={layers.showAnnotations}
                    onChange={e => setLayers({ ...layers, showAnnotations: e.target.checked })}
                    className="rounded accent-teal-600"
                  />
                  Disc & ETDRS Macular Grid
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lesion & Morphometric Metrics Bar */}
      {inference && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-slate-950 border-t border-slate-800 text-xs">
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">
              Microaneurysms
            </span>
            <span className="text-base font-bold text-rose-400 font-mono">
              {inference.lesions.microaneurysms}
            </span>
            <span className="text-[10px] text-slate-500 block">Punctate spots</span>
          </div>

          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">
              Hemorrhages
            </span>
            <span className="text-base font-bold text-rose-500 font-mono">
              {inference.lesions.hemorrhages}
            </span>
            <span className="text-[10px] text-slate-500 block">Blot & flame</span>
          </div>

          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">
              Hard Exudates
            </span>
            <span className="text-base font-bold text-amber-400 font-mono">
              {inference.lesions.hardExudates}
            </span>
            <span className="text-[10px] text-slate-500 block">Waxy lipid deposits</span>
          </div>

          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">
              Vessel Density
            </span>
            <span className="text-base font-bold text-teal-400 font-mono">
              {(inference.vesselDensity * 100).toFixed(1)}%
            </span>
            <span className="text-[10px] text-slate-500 block">Tortuosity: {inference.vesselTortuosity}</span>
          </div>
        </div>
      )}
    </div>
  );
};
