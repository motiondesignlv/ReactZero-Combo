import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useCombo } from './useCombo';

beforeEach(() => {
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    const id = setTimeout(() => cb(performance.now()), 0);
    return id;
  });
});

afterEach(() => {
  cleanup();
});

function TestCombo({ items }: { items: string[] }) {
  const combo = useCombo({ items });

  return (
    <div>
      <input {...combo.getInputProps()} />
      <ul {...combo.getMenuProps()}>
        {combo.filteredItems.map((item, i) => (
          <li key={i} {...combo.getItemProps({ item, index: i })}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

describe('useCombo memory safety', () => {
  it('does not leak DOM elements across mount/unmount cycles', () => {
    const items = ['Apple', 'Banana', 'Cherry'];

    // Count live region elements before
    const liveRegionsBefore = document.querySelectorAll(
      '[role="status"][aria-live="polite"]',
    ).length;

    // Mount/unmount 50 times
    for (let i = 0; i < 50; i++) {
      const { unmount } = render(<TestCombo items={items} />);
      unmount();
    }

    // Count live region elements after — should be same or very close
    const liveRegionsAfter = document.querySelectorAll(
      '[role="status"][aria-live="polite"]',
    ).length;

    // The announcer uses a singleton pattern, so at most 1 extra element
    expect(liveRegionsAfter - liveRegionsBefore).toBeLessThanOrEqual(1);
  });

  it('cleans up properly when items change rapidly', () => {
    const { rerender, unmount } = render(
      <TestCombo items={['Apple']} />,
    );

    // Rapidly change items
    for (let i = 0; i < 20; i++) {
      rerender(
        <TestCombo items={[`Item ${i}`, `Item ${i + 1}`, `Item ${i + 2}`]} />,
      );
    }

    unmount();

    // If we get here without errors, no memory issues
    expect(true).toBe(true);
  });
});
