import { DRGrade, EyeLaterality } from './types';

export interface CanvasLayerConfig {
  showBaseFundus: boolean;
  showVessels: boolean;
  showMicroaneurysms: boolean;
  showExudates: boolean;
  showGradCAM: boolean;
  showAnnotations: boolean;
  baseOpacity: number;
  vesselOpacity: number;
  lesionOpacity: number;
  gradcamOpacity: number;
  contrast: number;
  brightness: number;
}

export function drawRetinalFundus(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  grade: DRGrade,
  eye: EyeLaterality,
  dme: boolean,
  layers: CanvasLayerConfig,
  seed = 42
) {
  ctx.clearRect(0, 0, width, height);

  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.46;

  // Eye geometry: In OD (Right Eye), Optic Disc is to the nasal side (left in image), Macula is temporal (center-right).
  // In OS (Left Eye), Optic Disc is to the right, Macula is center-left.
  const discX = eye === 'OD' ? cx - radius * 0.42 : cx + radius * 0.42;
  const discY = cy - radius * 0.05;
  const maculaX = eye === 'OD' ? cx + radius * 0.15 : cx - radius * 0.15;
  const maculaY = cy;

  // Clip to circular fundus aperture
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();

  // 1. BASE FUNDUS LAYER
  if (layers.showBaseFundus && layers.baseOpacity > 0) {
    ctx.save();
    ctx.globalAlpha = layers.baseOpacity;
    ctx.filter = `contrast(${layers.contrast}%) brightness(${layers.brightness}%)`;

    // Radial background
    const bgGrad = ctx.createRadialGradient(maculaX, maculaY, radius * 0.1, cx, cy, radius);
    bgGrad.addColorStop(0, '#c2410c'); // warm orange-red macula center
    bgGrad.addColorStop(0.35, '#9a3412');
    bgGrad.addColorStop(0.7, '#7c2d12');
    bgGrad.addColorStop(0.95, '#451a03'); // darker peripheral margin
    bgGrad.addColorStop(1.0, '#1c0a00');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Subtle choroidal texture
    for (let i = 0; i < 40; i++) {
      const tx = cx + (Math.sin(seed + i * 2.3) * radius * 0.85);
      const ty = cy + (Math.cos(seed + i * 3.7) * radius * 0.85);
      const r = 20 + ((i * 17) % 35);
      const grad = ctx.createRadialGradient(tx, ty, 0, tx, ty, r);
      grad.addColorStop(0, 'rgba(180, 60, 20, 0.15)');
      grad.addColorStop(1, 'rgba(100, 30, 10, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(tx, ty, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Macula / Fovea centralis (darker avascular zone)
    const maculaGrad = ctx.createRadialGradient(maculaX, maculaY, 2, maculaX, maculaY, radius * 0.18);
    maculaGrad.addColorStop(0, 'rgba(45, 10, 5, 0.7)');
    maculaGrad.addColorStop(0.4, 'rgba(70, 20, 10, 0.45)');
    maculaGrad.addColorStop(1, 'rgba(150, 45, 15, 0)');
    ctx.fillStyle = maculaGrad;
    ctx.beginPath();
    ctx.arc(maculaX, maculaY, radius * 0.18, 0, Math.PI * 2);
    ctx.fill();

    // Optic Disc (yellow-pink oval)
    const discRadiusX = radius * 0.12;
    const discRadiusY = radius * 0.14;
    const discGrad = ctx.createRadialGradient(discX, discY, 3, discX, discY, discRadiusX);
    discGrad.addColorStop(0, '#fef08a'); // Physiological cup (bright)
    discGrad.addColorStop(0.55, '#fde047');
    discGrad.addColorStop(0.85, '#f59e0b'); // Neuroretinal rim
    discGrad.addColorStop(1, '#b45309');
    ctx.fillStyle = discGrad;
    ctx.beginPath();
    ctx.ellipse(discX, discY, discRadiusX, discRadiusY, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // 2. RETINAL VESSEL TREE LAYER
  if (layers.showVessels && layers.vesselOpacity > 0) {
    ctx.save();
    ctx.globalAlpha = layers.vesselOpacity;

    const drawVesselBranch = (
      startX: number,
      startY: number,
      angles: number[],
      lengths: number[],
      baseWidth: number,
      color: string
    ) => {
      ctx.strokeStyle = color;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      let currX = startX;
      let currY = startY;
      let w = baseWidth;

      for (let i = 0; i < angles.length; i++) {
        const rad = (angles[i] * Math.PI) / 180;
        const len = lengths[i];
        const nextX = currX + Math.cos(rad) * len;
        const nextY = currY + Math.sin(rad) * len;

        ctx.lineWidth = w;
        ctx.beginPath();
        ctx.moveTo(currX, currY);
        // smooth bezier curve
        const ctrlX = currX + Math.cos(rad) * (len * 0.5) + (Math.sin(i * 1.5) * 4);
        const ctrlY = currY + Math.sin(rad) * (len * 0.5) + (Math.cos(i * 1.5) * 4);
        ctx.quadraticCurveTo(ctrlX, ctrlY, nextX, nextY);
        ctx.stroke();

        currX = nextX;
        currY = nextY;
        w = Math.max(1.2, w * 0.78);
      }
    };

    const dir = eye === 'OD' ? 1 : -1;
    const veinColor = '#450a0a';
    const arteryColor = '#7f1d1d';

    // Superior temporal arcade
    drawVesselBranch(discX, discY, [-85, -60, -35, -15, 5].map(a => a * dir), [radius * 0.2, radius * 0.25, radius * 0.28, radius * 0.2, radius * 0.15], 6.5, veinColor);
    drawVesselBranch(discX, discY, [-90, -65, -40, -18, 0].map(a => a * dir), [radius * 0.18, radius * 0.23, radius * 0.26, radius * 0.18, radius * 0.12], 4.2, arteryColor);

    // Inferior temporal arcade
    drawVesselBranch(discX, discY, [85, 60, 35, 15, -5].map(a => a * dir), [radius * 0.2, radius * 0.25, radius * 0.28, radius * 0.2, radius * 0.15], 6.5, veinColor);
    drawVesselBranch(discX, discY, [90, 65, 40, 18, 0].map(a => a * dir), [radius * 0.18, radius * 0.23, radius * 0.26, radius * 0.18, radius * 0.12], 4.2, arteryColor);

    // Nasal branches
    drawVesselBranch(discX, discY, [170, 160, 150].map(a => a * dir), [radius * 0.2, radius * 0.2, radius * 0.2], 4.5, veinColor);
    drawVesselBranch(discX, discY, [-170, -160, -150].map(a => a * dir), [radius * 0.2, radius * 0.2, radius * 0.2], 4.5, veinColor);

    ctx.restore();
  }

  // 3. MICROANEURYSMS & HEMORRHAGES (RED LESIONS)
  if (layers.showMicroaneurysms && layers.lesionOpacity > 0 && grade >= 1) {
    ctx.save();
    ctx.globalAlpha = layers.lesionOpacity;

    const microaneurysmCount = grade === 1 ? 8 : grade === 2 ? 22 : grade === 3 ? 45 : 75;
    const hemorrhageCount = grade === 1 ? 0 : grade === 2 ? 6 : grade === 3 ? 20 : 38;

    // Microaneurysms (tiny sharp deep-red round dots)
    ctx.fillStyle = '#ef4444';
    for (let i = 0; i < microaneurysmCount; i++) {
      const angle = (seed * 11 + i * 37) % 360;
      const dist = (radius * 0.15) + (((seed * 7 + i * 19) % 100) / 100) * radius * 0.65;
      const x = maculaX + Math.cos((angle * Math.PI) / 180) * dist;
      const y = maculaY + Math.sin((angle * Math.PI) / 180) * dist;
      const dotRadius = 1.5 + ((i % 3) * 0.6);

      ctx.beginPath();
      ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Blot & Flame Hemorrhages (larger dark-red patches)
    for (let i = 0; i < hemorrhageCount; i++) {
      const angle = (seed * 13 + i * 53) % 360;
      const dist = (radius * 0.2) + (((seed * 5 + i * 29) % 100) / 100) * radius * 0.55;
      const x = maculaX + Math.cos((angle * Math.PI) / 180) * dist;
      const y = maculaY + Math.sin((angle * Math.PI) / 180) * dist;
      const w = 4 + (i % 5) * 2;
      const h = 3 + (i % 4) * 2;

      ctx.fillStyle = '#991b1b';
      ctx.beginPath();
      ctx.ellipse(x, y, w, h, (i * 45 * Math.PI) / 180, 0, Math.PI * 2);
      ctx.fill();
    }

    // Neovascularization (PDR only)
    if (grade === 4) {
      ctx.strokeStyle = '#f87171';
      ctx.lineWidth = 1.2;
      for (let i = 0; i < 6; i++) {
        const nx = discX + (Math.sin(i * 2) * 25);
        const ny = discY + (Math.cos(i * 2) * 25);
        ctx.beginPath();
        ctx.moveTo(nx, ny);
        ctx.bezierCurveTo(nx + 10, ny - 15, nx + 25, ny + 10, nx + 30, ny - 5);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  // 4. HARD EXUDATES & COTTON WOOL SPOTS (BRIGHT LESIONS)
  if (layers.showExudates && layers.lesionOpacity > 0 && (grade >= 2 || dme)) {
    ctx.save();
    ctx.globalAlpha = layers.lesionOpacity;

    // Hard Exudates (bright yellowish waxy deposits, circinate rings around macula)
    const exudateCount = dme ? 35 : grade >= 3 ? 24 : 10;
    ctx.fillStyle = '#fef08a';
    ctx.shadowColor = '#eab308';
    ctx.shadowBlur = 3;

    for (let i = 0; i < exudateCount; i++) {
      const circinateAngle = (i / exudateCount) * Math.PI * 2 + (seed * 0.1);
      const circinateDist = radius * 0.22 + (Math.sin(i * 3) * radius * 0.08);
      const x = maculaX + Math.cos(circinateAngle) * circinateDist;
      const y = maculaY + Math.sin(circinateAngle) * circinateDist;

      ctx.beginPath();
      ctx.ellipse(x, y, 2.5 + (i % 3), 1.8 + (i % 2), i * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Cotton Wool Spots (fluffy white ischemic patches)
    if (grade >= 3) {
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#ffffff';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      for (let i = 0; i < (grade === 3 ? 3 : 6); i++) {
        const cwx = cx + Math.cos(i * 1.8 + seed) * (radius * 0.45);
        const cwy = cy + Math.sin(i * 1.8 + seed) * (radius * 0.45);
        ctx.beginPath();
        ctx.arc(cwx, cwy, 9 + (i % 4) * 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  // 5. GRAD-CAM SALIENCY HEATMAP LAYER
  if (layers.showGradCAM && layers.gradcamOpacity > 0 && grade >= 1) {
    ctx.save();
    ctx.globalAlpha = layers.gradcamOpacity;
    ctx.globalCompositeOperation = 'screen';

    // Highlight key pathological hotspots
    const hotspotCount = grade === 1 ? 2 : grade === 2 ? 4 : grade === 3 ? 6 : 8;
    for (let i = 0; i < hotspotCount; i++) {
      const hx = maculaX + (Math.cos(seed + i * 2.1) * radius * 0.35);
      const hy = maculaY + (Math.sin(seed + i * 2.1) * radius * 0.35);
      const hr = radius * 0.22 + (i % 3) * 15;

      const grad = ctx.createRadialGradient(hx, hy, 2, hx, hy, hr);
      grad.addColorStop(0, 'rgba(239, 68, 68, 0.85)');   // High attention: Red
      grad.addColorStop(0.3, 'rgba(234, 179, 8, 0.7)');   // Yellow
      grad.addColorStop(0.65, 'rgba(34, 197, 94, 0.4)');  // Green
      grad.addColorStop(0.9, 'rgba(59, 130, 246, 0.15)'); // Blue
      grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(hx, hy, hr, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // 6. ANNOTATIONS & CALIBRATION OVERLAYS
  if (layers.showAnnotations) {
    ctx.save();
    // Optic Disc Ring
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.ellipse(discX, discY, radius * 0.14, radius * 0.16, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Macula Center Target
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(maculaX, maculaY, radius * 0.08, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(maculaX, maculaY, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#facc15';
    ctx.fill();

    // ETDRS Grid Rings around Macula
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.35)';
    ctx.setLineDash([2, 4]);
    ctx.beginPath();
    ctx.arc(maculaX, maculaY, radius * 0.25, 0, Math.PI * 2);
    ctx.stroke();

    // Eye Laterality stamp
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(`${eye} (${eye === 'OD' ? 'Right Eye' : 'Left Eye'})`, cx - radius + 20, cy - radius + 35);

    ctx.restore();
  }

  ctx.restore(); // end clip
}
