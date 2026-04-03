import { renderHook, act } from '@testing-library/react';
import { usePosition } from './usePosition';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// ---------------------------------------------------------------------------
// Helpers to mock DOM geometry
// ---------------------------------------------------------------------------

function mockViewport(height: number, width = 1024) {
  Object.defineProperty(window, 'innerHeight', { value: height, writable: true });
  Object.defineProperty(window, 'innerWidth', { value: width, writable: true });
  Object.defineProperty(window, 'scrollX', { value: 0, writable: true });
  Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
}

function makeTriggerRef(rect: Partial<DOMRect>) {
  const el = document.createElement('div');
  el.getBoundingClientRect = () => ({
    top: 0, left: 0, bottom: 0, right: 0, width: 200, height: 40,
    x: 0, y: 0, toJSON: () => ({}),
    ...rect,
  });
  return { current: el };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('usePosition', () => {
  beforeEach(() => {
    mockViewport(800);
  });

  it('places below when there is plenty of room', () => {
    const triggerRef = makeTriggerRef({ top: 100, bottom: 140, left: 50, width: 200 });
    const listboxRef = { current: document.createElement('ul') };

    const { result } = renderHook(() =>
      usePosition({ triggerRef, listboxRef, isOpen: true }),
    );

    expect(result.current.placement).toBe('bottom-start');
    expect(result.current.top).toBe(148); // 140 (rect.bottom) + 8 (MARGIN)
  });

  it('flips to top when list would be clipped below but has more room above', () => {
    // Trigger near bottom: 500px above, 100px below
    // maxHeightValue = 800 * 0.4 = 320px
    // maxHeightBelow = min(320, 100 - 8) = 92  → clipped (92 < 320)
    // maxHeightAbove = min(320, 500 - 8) = 320  → fits fully (320 > 92)
    // → should flip
    const triggerRef = makeTriggerRef({ top: 500, bottom: 700, left: 50, width: 200 });
    const listboxRef = { current: document.createElement('ul') };

    const { result } = renderHook(() =>
      usePosition({ triggerRef, listboxRef, isOpen: true }),
    );

    expect(result.current.placement).toBe('top-start');
  });

  it('does NOT flip when list fits fully below', () => {
    // Trigger near top: 100px above, 660px below
    // maxHeightValue = 800 * 0.4 = 320px
    // maxHeightBelow = min(320, 660 - 8) = 320  → fits fully
    // → no flip
    const triggerRef = makeTriggerRef({ top: 100, bottom: 140, left: 50, width: 200 });
    const listboxRef = { current: document.createElement('ul') };

    const { result } = renderHook(() =>
      usePosition({ triggerRef, listboxRef, isOpen: true }),
    );

    expect(result.current.placement).toBe('bottom-start');
  });

  it('does NOT flip when above has less room than below (even if both clip)', () => {
    // Trigger in middle: 200px above, 250px below
    // maxHeightValue = 800 * 0.4 = 320px
    // maxHeightBelow = min(320, 250 - 8) = 242  → clipped
    // maxHeightAbove = min(320, 200 - 8) = 192  → clipped AND less than 242
    // → no flip (below still better)
    const triggerRef = makeTriggerRef({ top: 200, bottom: 550, left: 50, width: 200 });
    const listboxRef = { current: document.createElement('ul') };

    const { result } = renderHook(() =>
      usePosition({ triggerRef, listboxRef, isOpen: true }),
    );

    expect(result.current.placement).toBe('bottom-start');
  });

  it('returns INITIAL_POSITION when not open', () => {
    const triggerRef = makeTriggerRef({ top: 500, bottom: 700 });
    const listboxRef = { current: document.createElement('ul') };

    const { result } = renderHook(() =>
      usePosition({ triggerRef, listboxRef, isOpen: false }),
    );

    expect(result.current.placement).toBe('bottom-start');
    expect(result.current.top).toBe(0);
    expect(result.current.maxHeight).toBe(0);
  });

  it('maxHeight is clamped to 0 when space is negative', () => {
    // Trigger almost at the bottom edge — nearly no space below
    const triggerRef = makeTriggerRef({ top: 10, bottom: 798, left: 0, width: 200 });
    const listboxRef = { current: document.createElement('ul') };

    const { result } = renderHook(() =>
      usePosition({ triggerRef, listboxRef, isOpen: true }),
    );

    expect(result.current.maxHeight).toBeGreaterThanOrEqual(0);
  });
});
