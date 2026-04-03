import { announce, destroyAnnouncer } from './announce';

// ---------------------------------------------------------------------------
// Setup / teardown
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.useFakeTimers();
  // jsdom has no real rAF; stub it so announce()'s requestAnimationFrame works
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    const id = setTimeout(() => cb(performance.now()), 0);
    return id as unknown as number;
  });
  vi.stubGlobal('cancelAnimationFrame', (id: number) => clearTimeout(id));
  destroyAnnouncer();
});

afterEach(() => {
  destroyAnnouncer();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getLiveRegion(): HTMLElement | null {
  return document.querySelector('[data-rzero-live]');
}

function flushRAF(): void {
  // Flush the stubbed rAF (setTimeout(cb, 0)) without advancing the clock
  // significantly, so it doesn't interfere with longer clear-timers.
  vi.advanceTimersByTime(0);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('announce', () => {
  it('creates a live region element in document.body', () => {
    expect(getLiveRegion()).toBeNull();
    announce('hello');
    const region = getLiveRegion();
    expect(region).not.toBeNull();
    expect(region).toBeInstanceOf(HTMLElement);
    expect(document.body.contains(region)).toBe(true);
  });

  it('sets correct ARIA attributes on the live region', () => {
    announce('test');
    const region = getLiveRegion()!;
    expect(region.getAttribute('role')).toBe('status');
    expect(region.getAttribute('aria-live')).toBe('polite');
    expect(region.getAttribute('aria-atomic')).toBe('true');
  });

  it('visually hides the live region', () => {
    announce('hidden test');
    const region = getLiveRegion()!;
    expect(region.style.position).toBe('absolute');
    expect(region.style.width).toBe('1px');
    expect(region.style.height).toBe('1px');
    expect(region.style.overflow).toBe('hidden');
  });

  it('sets message text content after requestAnimationFrame', () => {
    announce('screen reader message');
    const region = getLiveRegion()!;
    // Before rAF fires, content should be cleared (clear-then-set pattern)
    expect(region.textContent).toBe('');
    flushRAF();
    expect(region.textContent).toBe('screen reader message');
  });

  it('clears message after the default timeout (3000ms)', () => {
    announce('temporary');
    flushRAF();
    expect(getLiveRegion()!.textContent).toBe('temporary');

    vi.advanceTimersByTime(3000);
    expect(getLiveRegion()!.textContent).toBe('');
  });

  it('clears message after a custom timeout', () => {
    announce('custom', 1000);
    flushRAF();
    expect(getLiveRegion()!.textContent).toBe('custom');

    vi.advanceTimersByTime(999);
    expect(getLiveRegion()!.textContent).toBe('custom');

    vi.advanceTimersByTime(1);
    expect(getLiveRegion()!.textContent).toBe('');
  });

  it('reuses the same element for multiple announcements', () => {
    announce('first');
    const region1 = getLiveRegion();
    announce('second');
    const region2 = getLiveRegion();
    expect(region1).toBe(region2);

    // Only one live region element should exist
    const allRegions = document.querySelectorAll('[data-rzero-live]');
    expect(allRegions.length).toBe(1);
  });

  it('handles rapid successive calls (last message wins)', () => {
    announce('first');
    announce('second');
    announce('third');
    flushRAF();
    const region = getLiveRegion()!;
    // The last rAF callback should set the last message
    expect(region.textContent).toBe('third');
  });

  it('resets the clear timer on rapid calls', () => {
    announce('message one', 2000);
    flushRAF();
    expect(getLiveRegion()!.textContent).toBe('message one');

    // Advance part-way through the timeout, then announce again
    vi.advanceTimersByTime(1500);
    announce('message two', 2000);
    flushRAF();
    expect(getLiveRegion()!.textContent).toBe('message two');

    // The old 2000ms timer was cancelled, so at 1500+2000=3500ms total
    // the message should still be there at 3499ms
    vi.advanceTimersByTime(1999);
    expect(getLiveRegion()!.textContent).toBe('message two');

    // And gone at 2000ms after the second call
    vi.advanceTimersByTime(1);
    expect(getLiveRegion()!.textContent).toBe('');
  });

  it('clears content first before setting via rAF (forces re-announcement)', () => {
    announce('first');
    flushRAF();
    expect(getLiveRegion()!.textContent).toBe('first');

    // Calling announce again immediately clears before rAF
    announce('second');
    expect(getLiveRegion()!.textContent).toBe('');
    flushRAF();
    expect(getLiveRegion()!.textContent).toBe('second');
  });
});

// ---------------------------------------------------------------------------
// destroyAnnouncer
// ---------------------------------------------------------------------------

describe('destroyAnnouncer', () => {
  it('removes the live region element from the DOM', () => {
    announce('to be destroyed');
    expect(getLiveRegion()).not.toBeNull();

    destroyAnnouncer();
    expect(getLiveRegion()).toBeNull();
  });

  it('is safe to call multiple times', () => {
    announce('test');
    destroyAnnouncer();
    destroyAnnouncer();
    expect(getLiveRegion()).toBeNull();
  });

  it('is safe to call when no announcer was ever created', () => {
    expect(() => destroyAnnouncer()).not.toThrow();
  });

  it('allows a new announcer to be created after destruction', () => {
    announce('before destroy');
    const firstRegion = getLiveRegion();
    destroyAnnouncer();

    announce('after destroy');
    const secondRegion = getLiveRegion();
    expect(secondRegion).not.toBeNull();
    expect(secondRegion).not.toBe(firstRegion);
  });

  it('clears pending timers so they do not fire after destruction', () => {
    announce('timed message', 1000);
    flushRAF();
    destroyAnnouncer();

    // Advancing timers should not throw even though the element is gone
    expect(() => vi.advanceTimersByTime(5000)).not.toThrow();
  });
});
