import { useLayoutEffect, useState, useCallback, type RefObject } from 'react';

export interface Position {
  top: number;
  left: number;
  width: number;
  placement: 'bottom-start' | 'top-start';
  maxHeight: number;
}

export interface UsePositionOptions {
  triggerRef: RefObject<HTMLElement | null>;
  listboxRef: RefObject<HTMLElement | null>;
  isOpen: boolean;
  matchTriggerWidth?: boolean;
}

const INITIAL_POSITION: Position = {
  top: 0,
  left: 0,
  width: 0,
  placement: 'bottom-start',
  maxHeight: 0,
};

const MARGIN = 8;
const MAX_HEIGHT_VH = 0.4;

export function usePosition(options: UsePositionOptions): Position {
  const { triggerRef, listboxRef, isOpen, matchTriggerWidth = true } = options;

  const [position, setPosition] = useState<Position>(INITIAL_POSITION);

  const calculate = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger || !isOpen) return;

    const rect = trigger.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const maxHeightValue = viewportHeight * MAX_HEIGHT_VH;

    // Flip: prefer bottom, flip to top if list would be clipped and there's more room above
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    const maxHeightBelow = Math.min(maxHeightValue, spaceBelow - MARGIN);
    const maxHeightAbove = Math.min(maxHeightValue, spaceAbove - MARGIN);
    const needsFlip = maxHeightBelow < maxHeightValue && maxHeightAbove > maxHeightBelow;
    const placement = needsFlip ? 'top-start' : 'bottom-start';

    const effectiveMaxHeight =
      placement === 'bottom-start' ? maxHeightBelow : maxHeightAbove;

    // For top placement, use actual listbox height (clamped to max) so popover
    // sits flush against the trigger instead of reserving full maxHeight space
    const listbox = listboxRef.current;
    const actualHeight =
      placement === 'top-start' && listbox
        ? Math.min(listbox.scrollHeight, Math.max(effectiveMaxHeight, 0))
        : Math.max(effectiveMaxHeight, 0);

    const top =
      placement === 'bottom-start'
        ? rect.bottom + window.scrollY + MARGIN
        : rect.top + window.scrollY - actualHeight - MARGIN;

    // Shift: keep within horizontal viewport bounds
    const width = matchTriggerWidth
      ? rect.width
      : Math.max(rect.width, 200);
    let left = rect.left + window.scrollX;
    if (left + width > viewportWidth) {
      left = Math.max(0, viewportWidth - width);
    }

    setPosition({
      top,
      left,
      width,
      placement,
      maxHeight: Math.max(effectiveMaxHeight, 0),
    });
  }, [triggerRef, listboxRef, isOpen, matchTriggerWidth]);

  useLayoutEffect(() => {
    if (!isOpen) return;
    calculate();

    const trigger = triggerRef.current;
    let resizeObserver: ResizeObserver | undefined;
    if (trigger && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(calculate);
      resizeObserver.observe(trigger);
    }

    window.addEventListener('scroll', calculate, { passive: true });
    window.addEventListener('resize', calculate, { passive: true });

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('scroll', calculate);
      window.removeEventListener('resize', calculate);
    };
  }, [isOpen, calculate, triggerRef]);

  return isOpen ? position : INITIAL_POSITION;
}
