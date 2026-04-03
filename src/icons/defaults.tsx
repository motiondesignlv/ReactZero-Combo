import React from 'react';
import type { IconSlots, ChevronStyle } from '../types';

// ---------------------------------------------------------------------------
// Minimal inline SVG components (tree-shakable named exports)
// ---------------------------------------------------------------------------

export const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ArrowDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 3v10m0 0l-3-3m3 3l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const AngleDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const PlusMinusIcon = ({ isOpen }: { isOpen?: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M4 8h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    {!isOpen && <path d="M8 4v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>}
  </svg>
);

export const DotsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="4" cy="8" r="1" fill="currentColor"/>
    <circle cx="8" cy="8" r="1" fill="currentColor"/>
    <circle cx="12" cy="8" r="1" fill="currentColor"/>
  </svg>
);

export const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M11.5 3.5l-6 6L2.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ClearIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M10.5 3.5l-7 7M3.5 3.5l7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const LoadingIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    style={{ animation: 'rzero-spin 0.8s linear infinite' }}
  >
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" opacity="0.25"/>
    <path d="M14 8a6 6 0 00-6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// ---------------------------------------------------------------------------
// Built-in defaults
// ---------------------------------------------------------------------------

export const defaultIcons: IconSlots = {
  chevronDown: <ChevronDownIcon />,
  check: <CheckIcon />,
  clear: <ClearIcon />,
  search: <SearchIcon />,
  loading: <LoadingIcon />,
};

// ---------------------------------------------------------------------------
// Chevron presets
// ---------------------------------------------------------------------------

export const chevronPresets: Record<
  Exclude<ChevronStyle, 'custom'>,
  React.ReactNode
> = {
  caret: <ChevronDownIcon />,
  arrow: <ArrowDownIcon />,
  angle: <AngleDownIcon />,
  plusminus: <PlusMinusIcon />,
  dots: <DotsIcon />,
  none: null,
};
