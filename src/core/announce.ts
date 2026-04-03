let liveRegionElement: HTMLElement | null = null;
let clearTimer: ReturnType<typeof setTimeout> | null = null;

function ensureRegion(): HTMLElement | null {
  if (typeof document === 'undefined') return null;
  if (liveRegionElement && document.body.contains(liveRegionElement)) {
    return liveRegionElement;
  }
  liveRegionElement = document.createElement('div');
  liveRegionElement.setAttribute('role', 'status');
  liveRegionElement.setAttribute('aria-live', 'polite');
  liveRegionElement.setAttribute('aria-atomic', 'true');
  liveRegionElement.setAttribute('data-rzero-live', '');
  Object.assign(liveRegionElement.style, {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0,0,0,0)',
    whiteSpace: 'nowrap',
    borderWidth: '0',
  });
  document.body.appendChild(liveRegionElement);
  return liveRegionElement;
}

/**
 * Announce a message to screen readers via a live region.
 * Clear-then-set pattern forces screen readers to re-read.
 */
export function announce(message: string, clearAfterMs = 3000): void {
  const region = ensureRegion();
  if (!region) return;
  if (clearTimer) clearTimeout(clearTimer);
  // Clear first, then set on next frame — forces re-announcement
  region.textContent = '';
  requestAnimationFrame(() => {
    region.textContent = message;
  });
  clearTimer = setTimeout(() => {
    region.textContent = '';
  }, clearAfterMs);
}

/**
 * Cleanup for tests.
 */
export function destroyAnnouncer(): void {
  if (typeof document !== 'undefined' && liveRegionElement && document.body.contains(liveRegionElement)) {
    document.body.removeChild(liveRegionElement);
  }
  liveRegionElement = null;
  if (clearTimer) clearTimeout(clearTimer);
  clearTimer = null;
}
