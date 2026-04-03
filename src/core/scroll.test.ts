import { describe, it, expect, vi } from 'vitest';
import { scrollIntoView } from './scroll';

describe('scrollIntoView', () => {
  it('does nothing when listboxElement is null', () => {
    // Should not throw
    scrollIntoView(null, 0);
  });

  it('does nothing when highlightedIndex is -1', () => {
    const el = document.createElement('ul');
    scrollIntoView(el, -1);
    // No error
  });

  it('calls scrollIntoView on the matching element', () => {
    const ul = document.createElement('ul');
    const li = document.createElement('li');
    li.setAttribute('data-rzero-index', '2');
    li.scrollIntoView = vi.fn();
    ul.appendChild(li);

    scrollIntoView(ul, 2);

    expect(li.scrollIntoView).toHaveBeenCalledWith({ block: 'nearest' });
  });

  it('does nothing if no element matches the index', () => {
    const ul = document.createElement('ul');
    const li = document.createElement('li');
    li.setAttribute('data-rzero-index', '0');
    li.scrollIntoView = vi.fn();
    ul.appendChild(li);

    scrollIntoView(ul, 5);

    expect(li.scrollIntoView).not.toHaveBeenCalled();
  });
});
