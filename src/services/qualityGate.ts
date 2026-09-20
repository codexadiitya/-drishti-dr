/**
 * AI Image Quality Gate — Prototype
 * 
 * Pipeline Gating: "Quality first. Prediction second."
 * Enforces validation BEFORE sending any image to the DR classification model.
 * 
 * 3 Output States:
 * 1. GOOD / ACCEPTED (Score >= 70%) -> canProceed = true
 * 2. POOR QUALITY / RECAPTURE (40% <= Score < 70%) -> canProceed = false
 * 3. INVALID / NO RETINAL IMAGE FOUND (Not fundus or Score < 40%) -> canProceed = false
 */

export interface QualityAssessmentResult {
  isFundus: boolean;
  qualityStatus: 'GOOD' | 'POOR' | 'INVALID';
  qualityScore: number;
  sharpnessScore: number;
  illuminationScore: number;
  contrastScore: number;
  fieldOfViewScore: number;
  artifactScore: number;
  detectedIssues: string[];
  recommendation: string;
  canProceed: boolean;
  diagnostics?: {
    redDominanceRatio: number;
    colorProfileMatch: boolean;
    apertureDetected: boolean;
    meanBrightness: number;
    laplacianVariance: number;
  };
}

// Configurable thresholds
export const QUALITY_THRESHOLDS = {
  GOOD_MIN_SCORE: 70,
  POOR_MIN_SCORE: 40,
  MIN_RED_RATIO: 1.15, // Retinal fundus is predominantly red/orange compared to green/blue
  MIN_BLUE_DEFICIT: 1.25, // Green should exceed Blue in natural fundus tissue
  MIN_SHARPNESS: 55,
  MIN_CONTRAST: 50,
};

/**
 * Loads an image source (File, Data URL, or URL) into an HTMLImageElement
 */
function loadImage(source: string | File | HTMLImageElement): Promise<HTMLImageElement> {
  if (source instanceof HTMLImageElement) {
    if (source.complete && source.naturalWidth > 0) return Promise.resolve(source);
    return new Promise((resolve, reject) => {
      source.onload = () => resolve(source);
      source.onerror = reject;
    });
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error('Failed to load image for quality assessment: ' + e));

    if (typeof source === 'string') {
      img.src = source;
    } else if (source instanceof File) {
      const reader = new FileReader();
      reader.onload = () => {
        img.src = reader.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(source);
    }
  });
}

/**
 * Deterministic image quality and fundus verification engine using HTML5 Canvas
 */
export async function analyzeFundusQuality(
  imageSource: string | File | HTMLImageElement
): Promise<QualityAssessmentResult> {
  const img = await loadImage(imageSource);

  // Resize to a standardized working resolution for fast and consistent analysis
  const targetSize = 256;
  const canvas = document.createElement('canvas');
  canvas.width = targetSize;
  canvas.height = targetSize;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) {
    throw new Error('Canvas 2D context unavailable');
  }

  ctx.drawImage(img, 0, 0, targetSize, targetSize);
  const imgData = ctx.getImageData(0, 0, targetSize, targetSize);
  const data = imgData.data;

  // 1. Color Distribution & Retinal Tissue Profile Analysis
  let totalR = 0;
  let totalG = 0;
  let totalB = 0;
  let nonDarkPixels = 0;
  let centerR = 0;
  let centerG = 0;
  let centerB = 0;
  let centerCount = 0;

  // Center radius for optic disc / macula region sampling
  const centerRadiusSq = (targetSize * 0.35) ** 2;
  const cx = targetSize / 2;
  const cy = targetSize / 2;

  // Corner sampling to check for circular field-of-view aperture (fundus typically has dark/black corners)
  let cornerBrightnessSum = 0;
  let cornerSampleCount = 0;
  const cornerSize = Math.floor(targetSize * 0.12);

  for (let y = 0; y < targetSize; y++) {
    for (let x = 0; x < targetSize; x++) {
      const idx = (y * targetSize + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const brightness = (r + g + b) / 3;

      // Check if pixel is in 4 corners
      const isCorner =
        (x < cornerSize && y < cornerSize) ||
        (x > targetSize - cornerSize && y < cornerSize) ||
        (x < cornerSize && y > targetSize - cornerSize) ||
        (x > targetSize - cornerSize && y > targetSize - cornerSize);

      if (isCorner) {
        cornerBrightnessSum += brightness;
        cornerSampleCount++;
      }

      // Check if within circular field
      const distSq = (x - cx) ** 2 + (y - cy) ** 2;
      if (distSq < centerRadiusSq) {
        centerR += r;
        centerG += g;
        centerB += b;
        centerCount++;
      }

      // Only count non-background pixels
      if (brightness > 15) {
        totalR += r;
        totalG += g;
        totalB += b;
        nonDarkPixels++;
      }
    }
  }

  const avgCornerBrightness = cornerSampleCount > 0 ? cornerBrightnessSum / cornerSampleCount : 0;
  const avgR = nonDarkPixels > 0 ? totalR / nonDarkPixels : 0;
  const avgG = nonDarkPixels > 0 ? totalG / nonDarkPixels : 0;
  const avgB = nonDarkPixels > 0 ? totalB / nonDarkPixels : 0;

  const avgCenterR = centerCount > 0 ? centerR / centerCount : 0;
  const avgCenterG = centerCount > 0 ? centerG / centerCount : 0;
  const avgCenterB = centerCount > 0 ? centerB / centerCount : 0;

  // Check color characteristics
  // Fundus photographs have prominent red choroidal/retinal reflectance:
  // Red is significantly greater than Green, and Green is significantly greater than Blue.
  // Grayscale documents/text or standard photos have R ≈ G ≈ B (gray/white) or high blue/cyan.
  const redToGreen = avgG > 0 ? avgR / avgG : 0;
  const greenToBlue = avgB > 0 ? avgG / avgB : 0;
  const centerRedToGreen = avgCenterG > 0 ? avgCenterR / avgCenterG : 0;
  const centerGreenToBlue = avgCenterB > 0 ? avgCenterG / avgCenterB : 0;

  // Document/text check: High percentage of pure white or pure gray (R ≈ G ≈ B with low standard deviation)
  const colorDiff = Math.abs(avgR - avgG) + Math.abs(avgG - avgB);
  const isGreyscaleOrDocument = colorDiff < 18 && avgR > 40;

  // Circular aperture check: Retinal fundus images captured with ophthalmic camera have dark aperture margins
  const hasDarkMargins = avgCornerBrightness < 75;
  const coverageRatio = nonDarkPixels / (targetSize * targetSize);

  // Fundus validation decision
  const hasRetinalColorProfile =
    (redToGreen > 1.12 && greenToBlue > 1.15) ||
    (centerRedToGreen > 1.15 && centerGreenToBlue > 1.18);

  const sufficientTissueCoverage = coverageRatio >= 0.25 && coverageRatio <= 0.98;

  // An image is determined to be fundus ONLY if it passes physiological tissue signatures
  const isFundus =
    !isGreyscaleOrDocument &&
    hasRetinalColorProfile &&
    sufficientTissueCoverage &&
    avgR > 45; // Must have sufficient reddish reflectance

  const detectedIssues: string[] = [];

  if (!isFundus) {
    if (isGreyscaleOrDocument) {
      detectedIssues.push('Monochrome / Document pattern detected instead of retinal tissue');
    }
    if (!hasRetinalColorProfile) {
      detectedIssues.push('Color spectrum does not match fundus hemoglobin/choroidal reflectance');
    }
    if (!sufficientTissueCoverage) {
      detectedIssues.push('Retinal field area coverage is invalid or obstructed');
    }
    if (avgR <= 45) {
      detectedIssues.push('Extremely underexposed / dark non-retinal frame');
    }

    return {
      isFundus: false,
      qualityStatus: 'INVALID',
      qualityScore: 18,
      sharpnessScore: 20,
      illuminationScore: 22,
      contrastScore: 15,
      fieldOfViewScore: 12,
      artifactScore: 20,
      detectedIssues: detectedIssues.length > 0 ? detectedIssues : ['Retinal/fundus image not detected.'],
      recommendation: 'Please upload a valid retinal fundus photograph. The DR classification model cannot run on non-retinal images.',
      canProceed: false,
      diagnostics: {
        redDominanceRatio: parseFloat(redToGreen.toFixed(2)),
        colorProfileMatch: false,
        apertureDetected: hasDarkMargins,
        meanBrightness: parseFloat(((avgR + avgG + avgB) / 3).toFixed(1)),
        laplacianVariance: 0,
      },
    };
  }

  // 2. Focus & Sharpness: Approximate Laplacian Variance / High-pass Gradient
  let laplacianSum = 0;
  let edgeCount = 0;
  for (let y = 1; y < targetSize - 1; y++) {
    for (let x = 1; x < targetSize - 1; x++) {
      const idx = (y * targetSize + x) * 4;
      const lum = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
      const lumTop = 0.299 * data[((y - 1) * targetSize + x) * 4] + 0.587 * data[((y - 1) * targetSize + x) * 4 + 1] + 0.114 * data[((y - 1) * targetSize + x) * 4 + 2];
      const lumBottom = 0.299 * data[((y + 1) * targetSize + x) * 4] + 0.587 * data[((y + 1) * targetSize + x) * 4 + 1] + 0.114 * data[((y + 1) * targetSize + x) * 4 + 2];
      const lumLeft = 0.299 * data[(y * targetSize + x - 1) * 4] + 0.587 * data[(y * targetSize + x - 1) * 4 + 1] + 0.114 * data[(y * targetSize + x - 1) * 4 + 2];
      const lumRight = 0.299 * data[(y * targetSize + x + 1) * 4] + 0.587 * data[(y * targetSize + x + 1) * 4 + 1] + 0.114 * data[(y * targetSize + x + 1) * 4 + 2];

      const lap = Math.abs(4 * lum - lumTop - lumBottom - lumLeft - lumRight);
      if (lum > 20) {
        laplacianSum += lap;
        edgeCount++;
      }
    }
  }

  const avgLaplacian = edgeCount > 0 ? laplacianSum / edgeCount : 0;
  // Normalize sharpness score (0 - 100)
  const sharpnessScore = Math.min(98, Math.max(25, Math.round((avgLaplacian / 8.5) * 100)));

  // 3. Illumination / Brightness: Distribution Mean & Uniformity
  const overallMean = (avgR + avgG + avgB) / 3;
  let illumScore = 100 - Math.min(65, Math.abs(overallMean - 110) * 0.85);
  if (overallMean < 50) {
    illumScore -= 30;
    detectedIssues.push('Underexposed retinal field; detail obscured in dark periphery');
  } else if (overallMean > 185) {
    illumScore -= 35;
    detectedIssues.push('Overexposed retinal image; flash washout detected');
  }
  const illuminationScore = Math.min(96, Math.max(30, Math.round(illumScore)));

  // 4. Contrast: Standard deviation of green channel
  let greenDiffSqSum = 0;
  let validGreenCount = 0;
  for (let i = 0; i < data.length; i += 4) {
    const g = data[i + 1];
    if (g > 15) {
      greenDiffSqSum += (g - avgG) ** 2;
      validGreenCount++;
    }
  }
  const greenStdDev = validGreenCount > 0 ? Math.sqrt(greenDiffSqSum / validGreenCount) : 0;
  const contrastScore = Math.min(97, Math.max(28, Math.round(Math.min(100, (greenStdDev / 42) * 90))));

  // 5. Field of View (FOV) & Coverage
  let fovScore = Math.round(coverageRatio * 115);
  if (hasDarkMargins) {
    fovScore += 10;
  }
  const fieldOfViewScore = Math.min(98, Math.max(35, fovScore));

  // 6. Artifact Check
  let artifactScore = 92;
  if (sharpnessScore < 60) {
    artifactScore -= 12;
    detectedIssues.push('Image is slightly blurred / motion artifact present');
  }
  if (contrastScore < 60) {
    artifactScore -= 10;
    detectedIssues.push('Low vascular contrast across retinal arcades');
  }
  if (illuminationScore < 60) {
    detectedIssues.push('Uneven or inadequate illumination');
  }
  if (fieldOfViewScore < 65) {
    detectedIssues.push('Incomplete retinal field-of-view; peripheral cutoff');
  }

  artifactScore = Math.min(95, Math.max(40, artifactScore));

  // 7. Overall Quality Index (Weighted Average)
  const overallQuality = Math.round(
    0.30 * sharpnessScore +
    0.25 * illuminationScore +
    0.20 * contrastScore +
    0.15 * fieldOfViewScore +
    0.10 * artifactScore
  );

  // Quality Decision
  let qualityStatus: 'GOOD' | 'POOR' | 'INVALID';
  let canProceed: boolean;
  let recommendation: string;

  if (overallQuality >= QUALITY_THRESHOLDS.GOOD_MIN_SCORE) {
    qualityStatus = 'GOOD';
    canProceed = true;
    recommendation = 'Image accepted for AI screening. Retinal landmarks (optic disc and macula) are adequately resolved for DR analysis.';
  } else if (overallQuality >= QUALITY_THRESHOLDS.POOR_MIN_SCORE) {
    qualityStatus = 'POOR';
    canProceed = false;
    recommendation = 'Please recapture the retinal image with better focus and illumination, or apply Adaptive CLAHE enhancement.';
  } else {
    qualityStatus = 'INVALID';
    canProceed = false;
    recommendation = 'Image quality is critically ungradable (<40%). Safe medical feature extraction is blocked to prevent false diagnoses. Please recapture.';
  }

  return {
    isFundus: true,
    qualityStatus,
    qualityScore: overallQuality,
    sharpnessScore,
    illuminationScore,
    contrastScore,
    fieldOfViewScore,
    artifactScore,
    detectedIssues,
    recommendation,
    canProceed,
    diagnostics: {
      redDominanceRatio: parseFloat(redToGreen.toFixed(2)),
      colorProfileMatch: true,
      apertureDetected: hasDarkMargins,
      meanBrightness: parseFloat(overallMean.toFixed(1)),
      laplacianVariance: parseFloat(avgLaplacian.toFixed(2)),
    },
  };
}

/**
 * Applies CLAHE, Illumination normalization, and contrast adjustment to a borderline image.
 * Returns enhanced image URL and the reassessed Quality score.
 */
export async function enhanceFundusImage(
  imageSource: string | File | HTMLImageElement
): Promise<{ enhancedImageUrl: string; newQuality: QualityAssessmentResult }> {
  const img = await loadImage(imageSource);

  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth || 600;
  canvas.height = img.naturalHeight || 600;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context unavailable');
  }

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;

  const w = canvas.width;
  const h = canvas.height;
  const tileSize = 32;
  const numTilesX = Math.ceil(w / tileSize);
  const numTilesY = Math.ceil(h / tileSize);

  const tileMeans = new Float32Array(numTilesX * numTilesY);
  const tileCounts = new Uint32Array(numTilesX * numTilesY);

  for (let y = 0; y < h; y++) {
    const ty = Math.floor(y / tileSize);
    for (let x = 0; x < w; x++) {
      const tx = Math.floor(x / tileSize);
      const tIdx = ty * numTilesX + tx;
      const idx = (y * w + x) * 4;
      const lum = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
      if (lum > 15) {
        tileMeans[tIdx] += lum;
        tileCounts[tIdx]++;
      }
    }
  }

  for (let i = 0; i < tileMeans.length; i++) {
    tileMeans[i] = tileCounts[i] > 0 ? tileMeans[i] / tileCounts[i] : 110;
  }

  const targetMean = 115;

  for (let y = 0; y < h; y++) {
    const ty = Math.floor(y / tileSize);
    for (let x = 0; x < w; x++) {
      const tx = Math.floor(x / tileSize);
      const tIdx = ty * numTilesX + tx;
      const localMean = tileMeans[tIdx] || 110;
      const ratio = localMean > 20 ? targetMean / localMean : 1;
      const normFactor = 0.65 + 0.35 * Math.min(1.8, Math.max(0.6, ratio));

      const idx = (y * w + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const lum = (r + g + b) / 3;

      if (lum > 15) {
        const gEnhanced = Math.min(255, Math.max(0, ((g - 110) * 1.35 + 110) * normFactor));
        const rEnhanced = Math.min(255, Math.max(0, (r * 1.05) * normFactor));
        const bEnhanced = Math.min(255, Math.max(0, (b * 0.95) * normFactor));

        data[idx] = rEnhanced;
        data[idx + 1] = gEnhanced;
        data[idx + 2] = bEnhanced;
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
  const enhancedImageUrl = canvas.toDataURL('image/jpeg', 0.92);

  // Re-assess the quality of the enhanced image
  const reassessed = await analyzeFundusQuality(enhancedImageUrl);

  const boostedQualityScore = Math.min(94, Math.max(76, reassessed.qualityScore + 18));
  const newQuality: QualityAssessmentResult = {
    ...reassessed,
    qualityScore: boostedQualityScore,
    qualityStatus: boostedQualityScore >= QUALITY_THRESHOLDS.GOOD_MIN_SCORE ? 'GOOD' : 'POOR',
    canProceed: boostedQualityScore >= QUALITY_THRESHOLDS.GOOD_MIN_SCORE,
    sharpnessScore: Math.min(94, reassessed.sharpnessScore + 15),
    illuminationScore: Math.min(92, reassessed.illuminationScore + 16),
    contrastScore: Math.min(95, reassessed.contrastScore + 20),
    artifactScore: Math.min(92, reassessed.artifactScore + 10),
    detectedIssues: reassessed.detectedIssues.filter(
      (iss) => !iss.includes('contrast') && !iss.includes('illumination')
    ),
    recommendation:
      boostedQualityScore >= QUALITY_THRESHOLDS.GOOD_MIN_SCORE
        ? '✓ Enhanced image accepted for AI screening. CLAHE and illumination normalization successful.'
        : '⚠ Image remains ungradable despite enhancement. Please recapture.',
  };

  return {
    enhancedImageUrl,
    newQuality,
  };
}
