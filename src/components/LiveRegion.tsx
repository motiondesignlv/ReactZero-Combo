import { useEffect, useRef } from 'react';

export interface LiveRegionProps {
  message: string;
  id?: string;
  clearAfterMs?: number;
}

const srOnlyStyle: React.CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0,0,0,0)',
  whiteSpace: 'nowrap',
  borderWidth: 0,
};

/**
 * Declarative live region. Renders a visually-hidden status node that
 * announces `message` to screen readers, clearing after `clearAfterMs`.
 *
 * Use this when you want a region scoped to your component (cleaned up on
 * unmount). For imperative announcements outside React render — e.g. from a
 * non-component utility — use the `announce()` helper from `core/announce`.
 */
export function LiveRegion({
  message,
  id,
  clearAfterMs = 3000,
}: LiveRegionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !message) return;
    const el = ref.current;
    // Clear then set — forces screen readers to re-announce
    el.textContent = '';
    const raf = requestAnimationFrame(() => {
      el.textContent = message;
    });
    const timer = setTimeout(() => {
      el.textContent = '';
    }, clearAfterMs);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [message, clearAfterMs]);

  return (
    <div
      ref={ref}
      id={id}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style={srOnlyStyle}
    />
  );
}
