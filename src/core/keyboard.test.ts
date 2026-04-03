import { createKeyboardHandler } from './keyboard';
import type { ComboState, ComboAction } from '../types';

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

type Item = { label: string; value: string };

const testItems: Item[] = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Date', value: 'date' },
  { label: 'Elderberry', value: 'elderberry' },
];

// Generate a list of 25 items to test PageUp/PageDown
const manyItems: Item[] = Array.from({ length: 25 }, (_, i) => ({
  label: `Item ${i}`,
  value: `item-${i}`,
}));

function makeState(overrides?: Partial<ComboState<Item>>): ComboState<Item> {
  return {
    status: 'IDLE',
    selectedItem: null,
    selectedItems: [],
    inputValue: '',
    lastConfirmedValue: '',
    highlightedIndex: -1,
    filteredItems: testItems,
    expandedItems: new Set(),
    activeTabId: null,
    isLoading: false,
    isLoadingMore: false,
    error: null,
    visibleChipCount: 0,
    ...overrides,
  };
}

function makeKeyEvent(key: string): React.KeyboardEvent {
  return {
    key,
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
  } as unknown as React.KeyboardEvent;
}

const closedState = makeState({ status: 'FOCUSED_CLOSED' });
const openIdleState = makeState({ status: 'OPEN_IDLE' });
const openHighlightedState = makeState({
  status: 'OPEN_HIGHLIGHTED',
  highlightedIndex: 2,
});

// ---------------------------------------------------------------------------
// ArrowDown
// ---------------------------------------------------------------------------

describe('ArrowDown', () => {
  it('opens menu and highlights first when closed', () => {
    const dispatch = vi.fn();
    const handler = createKeyboardHandler(dispatch, closedState, {
      variant: 'input',
      commitOnBlur: false, mode: 'single',
    });
    const event = makeKeyEvent('ArrowDown');
    handler(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenNthCalledWith(1, { type: 'OPEN_MENU' });
    expect(dispatch).toHaveBeenNthCalledWith(2, { type: 'HIGHLIGHT_FIRST' });
  });

  it('highlights next when already open', () => {
    const dispatch = vi.fn();
    const handler = createKeyboardHandler(dispatch, openHighlightedState, {
      variant: 'input',
      commitOnBlur: false, mode: 'single',
    });
    const event = makeKeyEvent('ArrowDown');
    handler(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({ type: 'HIGHLIGHT_NEXT' });
  });

  it('highlights next from OPEN_IDLE', () => {
    const dispatch = vi.fn();
    const handler = createKeyboardHandler(dispatch, openIdleState, {
      variant: 'input',
      commitOnBlur: false, mode: 'single',
    });
    const event = makeKeyEvent('ArrowDown');
    handler(event);

    expect(dispatch).toHaveBeenCalledWith({ type: 'HIGHLIGHT_NEXT' });
  });
});

// ---------------------------------------------------------------------------
// ArrowUp
// ---------------------------------------------------------------------------

describe('ArrowUp', () => {
  it('opens menu and highlights last when closed', () => {
    const dispatch = vi.fn();
    const handler = createKeyboardHandler(dispatch, closedState, {
      variant: 'input',
      commitOnBlur: false, mode: 'single',
    });
    const event = makeKeyEvent('ArrowUp');
    handler(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenNthCalledWith(1, { type: 'OPEN_MENU' });
    expect(dispatch).toHaveBeenNthCalledWith(2, { type: 'HIGHLIGHT_LAST' });
  });

  it('highlights previous when already open', () => {
    const dispatch = vi.fn();
    const handler = createKeyboardHandler(dispatch, openHighlightedState, {
      variant: 'input',
      commitOnBlur: false, mode: 'single',
    });
    const event = makeKeyEvent('ArrowUp');
    handler(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({ type: 'HIGHLIGHT_PREV' });
  });
});

// ---------------------------------------------------------------------------
// Enter
// ---------------------------------------------------------------------------

describe('Enter', () => {
  it('selects highlighted item when open with highlight', () => {
    const dispatch = vi.fn();
    const handler = createKeyboardHandler(dispatch, openHighlightedState, {
      variant: 'input',
      commitOnBlur: false, mode: 'single',
    });
    const event = makeKeyEvent('Enter');
    handler(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({ type: 'SELECT_HIGHLIGHTED' });
  });

  it('does nothing when open but no highlight', () => {
    const dispatch = vi.fn();
    const handler = createKeyboardHandler(dispatch, openIdleState, {
      variant: 'input',
      commitOnBlur: false, mode: 'single',
    });
    const event = makeKeyEvent('Enter');
    handler(event);

    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('does nothing when closed', () => {
    const dispatch = vi.fn();
    const handler = createKeyboardHandler(dispatch, closedState, {
      variant: 'input',
      commitOnBlur: false, mode: 'single',
    });
    const event = makeKeyEvent('Enter');
    handler(event);

    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('does nothing when IDLE', () => {
    const dispatch = vi.fn();
    const idleState = makeState({ status: 'IDLE' });
    const handler = createKeyboardHandler(dispatch, idleState, {
      variant: 'input',
      commitOnBlur: false, mode: 'single',
    });
    const event = makeKeyEvent('Enter');
    handler(event);

    expect(dispatch).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Escape
// ---------------------------------------------------------------------------

describe('Escape', () => {
  it('closes menu when open', () => {
    const dispatch = vi.fn();
    const handler = createKeyboardHandler(dispatch, openIdleState, {
      variant: 'input',
      commitOnBlur: false, mode: 'single',
    });
    const event = makeKeyEvent('Escape');
    handler(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({ type: 'CLOSE_MENU' });
  });

  it('closes menu from OPEN_HIGHLIGHTED', () => {
    const dispatch = vi.fn();
    const handler = createKeyboardHandler(dispatch, openHighlightedState, {
      variant: 'input',
      commitOnBlur: false, mode: 'single',
    });
    const event = makeKeyEvent('Escape');
    handler(event);

    expect(dispatch).toHaveBeenCalledWith({ type: 'CLOSE_MENU' });
  });

  it('does nothing when closed', () => {
    const dispatch = vi.fn();
    const handler = createKeyboardHandler(dispatch, closedState, {
      variant: 'input',
      commitOnBlur: false, mode: 'single',
    });
    const event = makeKeyEvent('Escape');
    handler(event);

    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Home / End
// ---------------------------------------------------------------------------

describe('Home', () => {
  it('highlights first when open', () => {
    const dispatch = vi.fn();
    const handler = createKeyboardHandler(dispatch, openHighlightedState, {
      variant: 'input',
      commitOnBlur: false, mode: 'single',
    });
    const event = makeKeyEvent('Home');
    handler(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith({ type: 'HIGHLIGHT_FIRST' });
  });

  it('does nothing when closed', () => {
    const dispatch = vi.fn();
    const handler = createKeyboardHandler(dispatch, closedState, {
      variant: 'input',
      commitOnBlur: false, mode: 'single',
    });
    const event = makeKeyEvent('Home');
    handler(event);

    expect(dispatch).not.toHaveBeenCalled();
  });
});

describe('End', () => {
  it('highlights last when open', () => {
    const dispatch = vi.fn();
    const handler = createKeyboardHandler(dispatch, openHighlightedState, {
      variant: 'input',
      commitOnBlur: false, mode: 'single',
    });
    const event = makeKeyEvent('End');
    handler(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith({ type: 'HIGHLIGHT_LAST' });
  });

  it('does nothing when closed', () => {
    const dispatch = vi.fn();
    const handler = createKeyboardHandler(dispatch, closedState, {
      variant: 'input',
      commitOnBlur: false, mode: 'single',
    });
    const event = makeKeyEvent('End');
    handler(event);

    expect(dispatch).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// PageDown / PageUp
// ---------------------------------------------------------------------------

describe('PageDown', () => {
  it('jumps forward by 10 items when open', () => {
    const state = makeState({
      status: 'OPEN_HIGHLIGHTED',
      highlightedIndex: 5,
      filteredItems: manyItems,
    });
    const dispatch = vi.fn();
    const handler = createKeyboardHandler(dispatch, state, {
      variant: 'input',
      commitOnBlur: false, mode: 'single',
    });
    const event = makeKeyEvent('PageDown');
    handler(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith({
      type: 'HIGHLIGHT_ITEM',
      index: 15, // 5 + 10
    });
  });

  it('clamps to max index when near the end', () => {
    const state = makeState({
      status: 'OPEN_HIGHLIGHTED',
      highlightedIndex: 20,
      filteredItems: manyItems,
    });
    const dispatch = vi.fn();
    const handler = createKeyboardHandler(dispatch, state, {
      variant: 'input',
      commitOnBlur: false, mode: 'single',
    });
    const event = makeKeyEvent('PageDown');
    handler(event);

    expect(dispatch).toHaveBeenCalledWith({
      type: 'HIGHLIGHT_ITEM',
      index: 24, // clamped to last index
    });
  });

  it('does nothing when closed', () => {
    const dispatch = vi.fn();
    const handler = createKeyboardHandler(dispatch, closedState, {
      variant: 'input',
      commitOnBlur: false, mode: 'single',
    });
    const event = makeKeyEvent('PageDown');
    handler(event);

    expect(dispatch).not.toHaveBeenCalled();
  });
});

describe('PageUp', () => {
  it('jumps backward by 10 items when open', () => {
    const state = makeState({
      status: 'OPEN_HIGHLIGHTED',
      highlightedIndex: 15,
      filteredItems: manyItems,
    });
    const dispatch = vi.fn();
    const handler = createKeyboardHandler(dispatch, state, {
      variant: 'input',
      commitOnBlur: false, mode: 'single',
    });
    const event = makeKeyEvent('PageUp');
    handler(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith({
      type: 'HIGHLIGHT_ITEM',
      index: 5, // 15 - 10
    });
  });

  it('clamps to 0 when near the start', () => {
    const state = makeState({
      status: 'OPEN_HIGHLIGHTED',
      highlightedIndex: 3,
      filteredItems: manyItems,
    });
    const dispatch = vi.fn();
    const handler = createKeyboardHandler(dispatch, state, {
      variant: 'input',
      commitOnBlur: false, mode: 'single',
    });
    const event = makeKeyEvent('PageUp');
    handler(event);

    expect(dispatch).toHaveBeenCalledWith({
      type: 'HIGHLIGHT_ITEM',
      index: 0, // clamped to 0
    });
  });

  it('does nothing when closed', () => {
    const dispatch = vi.fn();
    const handler = createKeyboardHandler(dispatch, closedState, {
      variant: 'input',
      commitOnBlur: false, mode: 'single',
    });
    const event = makeKeyEvent('PageUp');
    handler(event);

    expect(dispatch).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Tab
// ---------------------------------------------------------------------------

describe('Tab', () => {
  it('closes menu when open without committing (no commitOnBlur)', () => {
    const dispatch = vi.fn();
    const handler = createKeyboardHandler(dispatch, openHighlightedState, {
      variant: 'input',
      commitOnBlur: false, mode: 'single',
    });
    const event = makeKeyEvent('Tab');
    handler(event);

    // Should NOT call preventDefault — let focus move naturally
    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({ type: 'CLOSE_MENU' });
  });

  it('selects highlighted then closes when commitOnBlur and highlighted', () => {
    const dispatch = vi.fn();
    const handler = createKeyboardHandler(dispatch, openHighlightedState, {
      variant: 'input',
      commitOnBlur: true, mode: 'single',
    });
    const event = makeKeyEvent('Tab');
    handler(event);

    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenNthCalledWith(1, { type: 'SELECT_HIGHLIGHTED' });
    expect(dispatch).toHaveBeenNthCalledWith(2, { type: 'CLOSE_MENU' });
  });

  it('only closes when commitOnBlur but no highlight', () => {
    const dispatch = vi.fn();
    const handler = createKeyboardHandler(dispatch, openIdleState, {
      variant: 'input',
      commitOnBlur: true, mode: 'single',
    });
    const event = makeKeyEvent('Tab');
    handler(event);

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({ type: 'CLOSE_MENU' });
  });

  it('does nothing when closed', () => {
    const dispatch = vi.fn();
    const handler = createKeyboardHandler(dispatch, closedState, {
      variant: 'input',
      commitOnBlur: false, mode: 'single',
    });
    const event = makeKeyEvent('Tab');
    handler(event);

    expect(dispatch).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Space (select variant)
// ---------------------------------------------------------------------------

describe('Space', () => {
  it('opens menu in select variant when closed', () => {
    const dispatch = vi.fn();
    const handler = createKeyboardHandler(dispatch, closedState, {
      variant: 'select',
      commitOnBlur: false, mode: 'single',
    });
    const event = makeKeyEvent(' ');
    handler(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenNthCalledWith(1, { type: 'OPEN_MENU' });
    expect(dispatch).toHaveBeenNthCalledWith(2, { type: 'HIGHLIGHT_FIRST' });
  });

  it('selects highlighted item in select variant when open', () => {
    const dispatch = vi.fn();
    const handler = createKeyboardHandler(dispatch, openHighlightedState, {
      variant: 'select',
      commitOnBlur: false, mode: 'single',
    });
    const event = makeKeyEvent(' ');
    handler(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({ type: 'SELECT_HIGHLIGHTED' });
  });

  it('does nothing in input variant (allows typing space)', () => {
    const dispatch = vi.fn();
    const handler = createKeyboardHandler(dispatch, closedState, {
      variant: 'input',
      commitOnBlur: false, mode: 'single',
    });
    const event = makeKeyEvent(' ');
    handler(event);

    expect(dispatch).not.toHaveBeenCalled();
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('does nothing in select variant when open but no highlight', () => {
    const dispatch = vi.fn();
    const handler = createKeyboardHandler(dispatch, openIdleState, {
      variant: 'select',
      commitOnBlur: false, mode: 'single',
    });
    const event = makeKeyEvent(' ');
    handler(event);

    expect(dispatch).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Unrecognized keys
// ---------------------------------------------------------------------------

describe('unrecognized keys', () => {
  it('does nothing for regular character keys', () => {
    const dispatch = vi.fn();
    const handler = createKeyboardHandler(dispatch, openIdleState, {
      variant: 'input',
      commitOnBlur: false, mode: 'single',
    });
    const event = makeKeyEvent('a');
    handler(event);

    expect(dispatch).not.toHaveBeenCalled();
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('does nothing for Shift key', () => {
    const dispatch = vi.fn();
    const handler = createKeyboardHandler(dispatch, openIdleState, {
      variant: 'input',
      commitOnBlur: false, mode: 'single',
    });
    const event = makeKeyEvent('Shift');
    handler(event);

    expect(dispatch).not.toHaveBeenCalled();
  });
});
