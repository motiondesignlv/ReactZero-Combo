import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useComboIds } from './ids';

describe('useComboIds', () => {
  it('generates IDs with rzero prefix', () => {
    const { result } = renderHook(() => useComboIds());
    const ids = result.current;

    expect(ids.input).toMatch(/^rzero-input-/);
    expect(ids.label).toMatch(/^rzero-label-/);
    expect(ids.listbox).toMatch(/^rzero-listbox-/);
    expect(ids.toggleButton).toMatch(/^rzero-toggle-/);
    expect(ids.clearButton).toMatch(/^rzero-clear-/);
    expect(ids.liveRegion).toMatch(/^rzero-live-/);
  });

  it('uses user-provided ID when given', () => {
    const { result } = renderHook(() => useComboIds('my-combo'));
    const ids = result.current;

    expect(ids.base).toBe('my-combo');
    expect(ids.input).toBe('rzero-input-my-combo');
    expect(ids.listbox).toBe('rzero-listbox-my-combo');
  });

  it('generates item IDs with index', () => {
    const { result } = renderHook(() => useComboIds('test'));
    const ids = result.current;

    expect(ids.item(0)).toBe('rzero-item-test-0');
    expect(ids.item(5)).toBe('rzero-item-test-5');
    expect(ids.item(99)).toBe('rzero-item-test-99');
  });

  it('generates group IDs with index', () => {
    const { result } = renderHook(() => useComboIds('test'));
    const ids = result.current;

    expect(ids.group(0)).toBe('rzero-group-test-0');
    expect(ids.group(2)).toBe('rzero-group-test-2');
  });

  it('returns stable reference on re-renders', () => {
    const { result, rerender } = renderHook(() => useComboIds('stable'));

    const first = result.current;
    rerender();
    const second = result.current;

    expect(first).toBe(second);
  });
});
