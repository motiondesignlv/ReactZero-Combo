import type { MutableRefObject, RefObject } from 'react';

/**
 * Compose multiple event handlers — user's handler runs first, then ours.
 */
export const callAll =
  <E extends (...args: never[]) => void>(
    ...fns: (E | undefined)[]
  ) =>
  (...args: Parameters<E>) => {
    fns.forEach((fn) => fn?.(...args));
  };

/**
 * Default itemToString — handles strings, objects with `.label`, null.
 */
export const defaultItemToString = <T>(item: T | null): string => {
  if (item == null) return '';
  if (typeof item === 'string') return item;
  if (typeof item === 'object' && 'label' in (item as object))
    return String((item as Record<string, unknown>).label);
  return String(item);
};

/**
 * Default itemToValue — handles objects with `.value`, primitives.
 * Falls back to `String(item)` for any non-string/number `.value` so equality
 * comparisons in the reducer remain stable. Pass a custom `itemToValue` if
 * your items use object identifiers.
 */
export const defaultItemToValue = <T>(item: T): string | number => {
  if (typeof item === 'string' || typeof item === 'number') return item;
  if (typeof item === 'object' && item != null && 'value' in (item as object)) {
    const v = (item as Record<string, unknown>).value;
    if (typeof v === 'string' || typeof v === 'number') return v;
    return String(v);
  }
  return String(item);
};

/**
 * Default case-insensitive substring filter.
 */
export const defaultFilter = <T>(
  items: T[],
  inputValue: string,
  itemToString: (item: T) => string,
): T[] => {
  if (!inputValue) return items;
  const lower = inputValue.toLowerCase();
  return items.filter((item) =>
    itemToString(item).toLowerCase().includes(lower),
  );
};

/**
 * Clamp a number to a range.
 */
export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

/**
 * Merge multiple refs (callback refs, RefObjects, or null).
 */
export function mergeRefs<T>(
  ...refs: (
    | MutableRefObject<T | null>
    | RefObject<T | null>
    | ((instance: T | null) => void)
    | null
    | undefined
  )[]
): (instance: T | null) => void {
  return (instance: T | null) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(instance);
      } else if (ref != null) {
        (ref as MutableRefObject<T | null>).current = instance;
      }
    });
  };
}
