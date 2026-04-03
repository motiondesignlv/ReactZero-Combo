import type { ReactNode } from 'react';
import type { IconSlots, ChevronStyle } from '../types';

// ---------------------------------------------------------------------------
// Empty fallback — used when no icon provider is registered (hook-bare entry)
// ---------------------------------------------------------------------------

const emptyIcons: IconSlots = {
  chevronDown: null,
  check: null,
  clear: null,
  search: null,
  loading: null,
};

// ---------------------------------------------------------------------------
// Lazy provider storage
// ---------------------------------------------------------------------------

let defaultIconsProvider: (() => IconSlots) | null = null;
let chevronPresetsProvider: (() => Record<string, ReactNode>) | null = null;

/**
 * Register a provider for built-in default icons.
 * Called by entry points that want built-in SVGs available.
 */
export function registerDefaultIcons(provider: () => IconSlots): void {
  defaultIconsProvider = provider;
}

/**
 * Register a provider for chevron preset icons.
 * Called by entry points that want built-in chevron presets available.
 */
export function registerChevronPresets(
  provider: () => Record<string, ReactNode>,
): void {
  chevronPresetsProvider = provider;
}

// ---------------------------------------------------------------------------
// Global override storage
// ---------------------------------------------------------------------------

let globalOverrides: Partial<IconSlots> = {};

/**
 * Set global default icons for all Combo instances.
 */
export function setDefaultIcons(overrides: Partial<IconSlots>): void {
  globalOverrides = { ...globalOverrides, ...overrides };
}

/**
 * Reset global overrides (useful for tests).
 */
export function resetDefaultIcons(): void {
  globalOverrides = {};
}

/**
 * Resolve icons with precedence: instance > global > registered defaults.
 * If no provider is registered (hook-bare entry), base is emptyIcons (all null).
 */
export function resolveIcons(
  instanceOverrides?: Partial<IconSlots>,
): IconSlots {
  const base = defaultIconsProvider?.() ?? emptyIcons;
  return {
    ...base,
    ...globalOverrides,
    ...instanceOverrides,
  };
}

// ---------------------------------------------------------------------------
// Chevron presets
// ---------------------------------------------------------------------------

/**
 * Resolve the chevron icon based on style preset or custom icon.
 */
export function resolveChevron(
  style: ChevronStyle,
  customIcon?: ReactNode,
): ReactNode {
  if (style === 'custom') return customIcon ?? null;
  if (style === 'none') return null;
  const presets = chevronPresetsProvider?.() ?? {};
  return presets[style] ?? null;
}
