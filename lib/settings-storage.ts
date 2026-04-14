import { DEFAULT_SETTINGS } from './config';
import { Settings } from './types';

export const SETTINGS_STORAGE_KEY = 'vvs-chatflow-settings-v1';

export function loadStoredSettings(): Settings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } as Settings;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: Settings) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}
