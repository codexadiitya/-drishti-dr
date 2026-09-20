/**
 * NetraRakshaq Demo API Service
 * 
 * Provides mock responses for testing and demonstration during the SIH evaluation.
 * Clearly identified with disclaimers:
 * "DEMO CASE — SAMPLE DATA — NOT FOR CLINICAL USE"
 */

import type { MLScreeningOutput } from '../lib/types';
import { DEMO_PRESETS } from '../lib/demoData';

export type DemoPresetKey = keyof typeof DEMO_PRESETS;

export async function fetchDemoScreeningResult(
  presetKey: DemoPresetKey = 'moderate_npdr',
  delayMs = 800
): Promise<MLScreeningOutput> {
  if (delayMs > 0) {
    await new Promise(r => setTimeout(r, delayMs));
  }
  const preset = DEMO_PRESETS[presetKey];
  if (!preset) {
    return DEMO_PRESETS.moderate_npdr.output;
  }
  // Return deep copy so caller can manipulate if needed
  return JSON.parse(JSON.stringify(preset.output));
}

export function getDemoPresetsList(): { key: DemoPresetKey; label: string; desc: string }[] {
  return Object.entries(DEMO_PRESETS).map(([key, value]) => ({
    key: key as DemoPresetKey,
    label: value.label,
    desc: value.desc,
  }));
}
