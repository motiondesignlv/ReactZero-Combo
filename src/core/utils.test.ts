import { createRef } from 'react';
import {
  callAll,
  defaultItemToString,
  defaultItemToValue,
  defaultFilter,
  clamp,
  mergeRefs,
} from './utils';

// ---------------------------------------------------------------------------
// callAll
// ---------------------------------------------------------------------------

describe('callAll', () => {
  it('composes multiple handlers and calls all of them', () => {
    const fn1 = vi.fn();
    const fn2 = vi.fn();
    const composed = callAll(fn1, fn2);
    composed();
    expect(fn1).toHaveBeenCalledOnce();
    expect(fn2).toHaveBeenCalledOnce();
  });

  it('passes arguments to every handler', () => {
    const fn1 = vi.fn();
    const fn2 = vi.fn();
    const composed = callAll<(a: number, b: string) => void>(fn1, fn2);
    composed(42, 'hello');
    expect(fn1).toHaveBeenCalledWith(42, 'hello');
    expect(fn2).toHaveBeenCalledWith(42, 'hello');
  });

  it('handles undefined functions gracefully', () => {
    const fn1 = vi.fn();
    const composed = callAll(fn1, undefined, undefined);
    expect(() => composed()).not.toThrow();
    expect(fn1).toHaveBeenCalledOnce();
  });

  it('calls handlers in order (first handler runs first)', () => {
    const order: number[] = [];
    const fn1 = vi.fn(() => order.push(1));
    const fn2 = vi.fn(() => order.push(2));
    const fn3 = vi.fn(() => order.push(3));
    const composed = callAll(fn1, fn2, fn3);
    composed();
    expect(order).toEqual([1, 2, 3]);
  });

  it('works with no arguments', () => {
    const composed = callAll();
    expect(() => composed()).not.toThrow();
  });

  it('works when all functions are undefined', () => {
    const composed = callAll(undefined, undefined);
    expect(() => composed()).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// defaultItemToString
// ---------------------------------------------------------------------------

describe('defaultItemToString', () => {
  it('returns the string itself for string items', () => {
    expect(defaultItemToString('apple')).toBe('apple');
  });

  it('returns empty string for empty string items', () => {
    expect(defaultItemToString('')).toBe('');
  });

  it('returns empty string for null', () => {
    expect(defaultItemToString(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(defaultItemToString(undefined)).toBe('');
  });

  it('returns .label property for objects with label', () => {
    expect(defaultItemToString({ label: 'Banana', value: 'b' })).toBe(
      'Banana',
    );
  });

  it('stringifies numeric labels', () => {
    expect(defaultItemToString({ label: 123 })).toBe('123');
  });

  it('converts numbers via String()', () => {
    expect(defaultItemToString(42)).toBe('42');
    expect(defaultItemToString(0)).toBe('0');
  });

  it('converts booleans via String()', () => {
    expect(defaultItemToString(true as unknown)).toBe('true');
  });

  it('converts objects without label via String()', () => {
    expect(defaultItemToString({ foo: 'bar' })).toBe('[object Object]');
  });
});

// ---------------------------------------------------------------------------
// defaultItemToValue
// ---------------------------------------------------------------------------

describe('defaultItemToValue', () => {
  it('returns the string itself for string items', () => {
    expect(defaultItemToValue('apple')).toBe('apple');
  });

  it('returns the number itself for number items', () => {
    expect(defaultItemToValue(42)).toBe(42);
    expect(defaultItemToValue(0)).toBe(0);
  });

  it('returns .value property for objects with value (string)', () => {
    expect(defaultItemToValue({ label: 'Apple', value: 'a' })).toBe('a');
  });

  it('returns .value property for objects with value (number)', () => {
    expect(defaultItemToValue({ label: 'Apple', value: 7 })).toBe(7);
  });

  it('converts objects without value via String()', () => {
    expect(defaultItemToValue({ label: 'Apple' })).toBe('[object Object]');
  });

  it('returns String(item) for non-primitive, non-value objects', () => {
    expect(defaultItemToValue({ foo: 'bar' })).toBe('[object Object]');
  });

  it('handles null values inside .value', () => {
    // .value exists but is null — still returned as value
    const item = { value: null as unknown as string };
    expect(defaultItemToValue(item)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// defaultFilter
// ---------------------------------------------------------------------------

describe('defaultFilter', () => {
  const fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];
  const identity = (item: string) => item;

  it('returns all items when inputValue is empty', () => {
    expect(defaultFilter(fruits, '', identity)).toEqual(fruits);
  });

  it('returns all items when inputValue is only whitespace-like but non-empty', () => {
    // Note: ' ' is truthy so it filters — no fruit contains leading space
    expect(defaultFilter(fruits, ' ', identity)).toEqual([]);
  });

  it('filters case-insensitively', () => {
    expect(defaultFilter(fruits, 'apple', identity)).toEqual(['Apple']);
    expect(defaultFilter(fruits, 'APPLE', identity)).toEqual(['Apple']);
    expect(defaultFilter(fruits, 'aPpLe', identity)).toEqual(['Apple']);
  });

  it('matches substrings', () => {
    expect(defaultFilter(fruits, 'an', identity)).toEqual(['Banana']);
    expect(defaultFilter(fruits, 'erry', identity)).toEqual([
      'Cherry',
      'Elderberry',
    ]);
  });

  it('returns empty array when nothing matches', () => {
    expect(defaultFilter(fruits, 'zzz', identity)).toEqual([]);
  });

  it('works with objects using a custom itemToString', () => {
    const items = [
      { label: 'Apple', value: 'a' },
      { label: 'Banana', value: 'b' },
    ];
    const its = (item: { label: string }) => item.label;
    expect(defaultFilter(items, 'ban', its)).toEqual([
      { label: 'Banana', value: 'b' },
    ]);
  });

  it('returns all items for an empty list', () => {
    expect(defaultFilter([], 'test', identity)).toEqual([]);
  });

  it('handles single-character search', () => {
    expect(defaultFilter(fruits, 'e', identity)).toEqual([
      'Apple',
      'Cherry',
      'Date',
      'Elderberry',
    ]);
  });
});

// ---------------------------------------------------------------------------
// clamp
// ---------------------------------------------------------------------------

describe('clamp', () => {
  it('returns the value when within range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it('clamps to min when value is below', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it('clamps to max when value is above', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it('returns min when value equals min', () => {
    expect(clamp(0, 0, 10)).toBe(0);
  });

  it('returns max when value equals max', () => {
    expect(clamp(10, 0, 10)).toBe(10);
  });

  it('works when min equals max', () => {
    expect(clamp(5, 3, 3)).toBe(3);
    expect(clamp(1, 3, 3)).toBe(3);
  });

  it('works with negative ranges', () => {
    expect(clamp(-5, -10, -1)).toBe(-5);
    expect(clamp(-15, -10, -1)).toBe(-10);
    expect(clamp(0, -10, -1)).toBe(-1);
  });

  it('works with floating point values', () => {
    expect(clamp(0.5, 0, 1)).toBe(0.5);
    expect(clamp(1.5, 0, 1)).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// mergeRefs
// ---------------------------------------------------------------------------

describe('mergeRefs', () => {
  it('calls callback refs with the instance', () => {
    const cbRef = vi.fn();
    const merged = mergeRefs(cbRef);
    const node = document.createElement('div');
    merged(node);
    expect(cbRef).toHaveBeenCalledWith(node);
  });

  it('sets .current on RefObjects', () => {
    const refObj = createRef<HTMLDivElement>();
    const merged = mergeRefs(refObj);
    const node = document.createElement('div');
    merged(node);
    expect(refObj.current).toBe(node);
  });

  it('handles null refs gracefully', () => {
    const cbRef = vi.fn();
    const merged = mergeRefs(null, cbRef, undefined);
    const node = document.createElement('div');
    expect(() => merged(node)).not.toThrow();
    expect(cbRef).toHaveBeenCalledWith(node);
  });

  it('merges multiple refs of different types', () => {
    const cbRef = vi.fn();
    const refObj = createRef<HTMLDivElement>();
    const merged = mergeRefs(cbRef, refObj);
    const node = document.createElement('div');
    merged(node);
    expect(cbRef).toHaveBeenCalledWith(node);
    expect(refObj.current).toBe(node);
  });

  it('passes null to all refs on cleanup', () => {
    const cbRef = vi.fn();
    const refObj = createRef<HTMLDivElement>();
    const merged = mergeRefs(cbRef, refObj);
    merged(null);
    expect(cbRef).toHaveBeenCalledWith(null);
    expect(refObj.current).toBeNull();
  });

  it('works with zero refs', () => {
    const merged = mergeRefs<HTMLDivElement>();
    expect(() => merged(document.createElement('div'))).not.toThrow();
  });

  it('handles MutableRefObject style refs', () => {
    const mutableRef = { current: null as HTMLDivElement | null };
    const merged = mergeRefs(mutableRef);
    const node = document.createElement('div');
    merged(node);
    expect(mutableRef.current).toBe(node);
  });
});
