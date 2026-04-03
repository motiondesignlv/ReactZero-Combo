import {
  comboReducer,
  getInitialState,
  getNextEnabledIndex,
  getFirstEnabledIndex,
  getLastEnabledIndex,
  type ReducerContext,
} from './stateMachine';
import type { ComboState, ComboAction } from '../types';

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

type Item = { label: string; value: string; disabled?: boolean };

const items: Item[] = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Date', value: 'date' },
  { label: 'Elderberry', value: 'elderberry' },
];

function makeCtx(overrides?: Partial<ReducerContext<Item>>): ReducerContext<Item> {
  return {
    items,
    itemToString: (item: Item | null) => item?.label ?? '',
    itemToValue: (item: Item) => item.value,
    closeOnSelect: true,
    commitOnBlur: false,
    deselectionAllowed: false,
    isItemDisabled: (item: Item) => item.disabled === true,
    disabledItemBehavior: 'skip',
    hideDisabled: false,
    variant: 'input',
    mode: 'single',
    ...overrides,
  };
}

function makeState(overrides?: Partial<ComboState<Item>>): ComboState<Item> {
  return {
    status: 'IDLE',
    selectedItem: null,
    selectedItems: [],
    inputValue: '',
    lastConfirmedValue: '',
    highlightedIndex: -1,
    filteredItems: items,
    expandedItems: new Set(),
    activeTabId: null,
    isLoading: false,
    isLoadingMore: false,
    error: null,
    visibleChipCount: 0,
    ...overrides,
  };
}

function dispatch(
  state: ComboState<Item>,
  action: ComboAction<Item>,
  ctx?: Partial<ReducerContext<Item>>,
): ComboState<Item> {
  return comboReducer(state, action, makeCtx(ctx));
}

// ---------------------------------------------------------------------------
// getInitialState
// ---------------------------------------------------------------------------

describe('getInitialState', () => {
  it('returns default initial state', () => {
    const state = getInitialState({ items });
    expect(state.status).toBe('IDLE');
    expect(state.selectedItem).toBeNull();
    expect(state.selectedItems).toEqual([]);
    expect(state.inputValue).toBe('');
    expect(state.lastConfirmedValue).toBe('');
    expect(state.highlightedIndex).toBe(-1);
    expect(state.filteredItems).toBe(items);
  });

  it('uses defaultSelectedItem and derives inputValue from it', () => {
    const state = getInitialState({
      items,
      defaultSelectedItem: items[1],
      itemToString: (item: Item | null) => item?.label ?? '',
    });
    expect(state.selectedItem).toBe(items[1]);
    expect(state.inputValue).toBe('Banana');
    expect(state.lastConfirmedValue).toBe('Banana');
  });

  it('prefers selectedItem over defaultSelectedItem', () => {
    const state = getInitialState({
      items,
      selectedItem: items[2],
      defaultSelectedItem: items[0],
      itemToString: (item: Item | null) => item?.label ?? '',
    });
    expect(state.selectedItem).toBe(items[2]);
    expect(state.inputValue).toBe('Cherry');
  });

  it('uses explicit inputValue over derived value', () => {
    const state = getInitialState({
      items,
      defaultSelectedItem: items[0],
      inputValue: 'custom',
      itemToString: (item: Item | null) => item?.label ?? '',
    });
    expect(state.inputValue).toBe('custom');
  });

  it('uses defaultInputValue', () => {
    const state = getInitialState({
      items,
      defaultInputValue: 'search text',
    });
    expect(state.inputValue).toBe('search text');
  });

  it('sets isLoading from options', () => {
    const state = getInitialState({ items, isLoading: true });
    expect(state.isLoading).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// FOCUS
// ---------------------------------------------------------------------------

describe('FOCUS', () => {
  it('transitions IDLE -> FOCUSED_CLOSED', () => {
    const state = makeState({ status: 'IDLE' });
    const next = dispatch(state, { type: 'FOCUS' });
    expect(next.status).toBe('FOCUSED_CLOSED');
  });

  it('sets lastConfirmedValue from current inputValue', () => {
    const state = makeState({ status: 'IDLE', inputValue: 'hello' });
    const next = dispatch(state, { type: 'FOCUS' });
    expect(next.lastConfirmedValue).toBe('hello');
  });

  it('does nothing when already focused', () => {
    const state = makeState({ status: 'FOCUSED_CLOSED' });
    const next = dispatch(state, { type: 'FOCUS' });
    expect(next).toBe(state);
  });

  it('does nothing when open', () => {
    const state = makeState({ status: 'OPEN_IDLE' });
    const next = dispatch(state, { type: 'FOCUS' });
    expect(next).toBe(state);
  });
});

// ---------------------------------------------------------------------------
// BLUR
// ---------------------------------------------------------------------------

describe('BLUR', () => {
  it('does nothing when IDLE', () => {
    const state = makeState({ status: 'IDLE' });
    const next = dispatch(state, { type: 'BLUR' });
    expect(next).toBe(state);
  });

  it('reverts input to lastConfirmedValue when no commitOnBlur', () => {
    const state = makeState({
      status: 'OPEN_IDLE',
      inputValue: 'typed something',
      lastConfirmedValue: 'Apple',
    });
    const next = dispatch(state, { type: 'BLUR' });
    expect(next.status).toBe('IDLE');
    expect(next.inputValue).toBe('Apple');
    expect(next.highlightedIndex).toBe(-1);
  });

  it('selects highlighted item when commitOnBlur is true', () => {
    const state = makeState({
      status: 'OPEN_HIGHLIGHTED',
      highlightedIndex: 2,
      inputValue: 'che',
      lastConfirmedValue: '',
    });
    const next = dispatch(state, { type: 'BLUR' }, { commitOnBlur: true });
    expect(next.status).toBe('IDLE');
    expect(next.selectedItem).toBe(items[2]);
    expect(next.inputValue).toBe('Cherry');
    expect(next.lastConfirmedValue).toBe('Cherry');
  });

  it('does not select disabled highlighted item on commitOnBlur', () => {
    const disabledItems = items.map((item, i) =>
      i === 1 ? { ...item, disabled: true } : item,
    );
    const state = makeState({
      status: 'OPEN_HIGHLIGHTED',
      highlightedIndex: 1,
      filteredItems: disabledItems,
      inputValue: 'ban',
      lastConfirmedValue: '',
    });
    const ctx = makeCtx({ commitOnBlur: true, items: disabledItems });
    const next = comboReducer(state, { type: 'BLUR' }, ctx);
    // Should revert instead of selecting
    expect(next.selectedItem).toBeNull();
    expect(next.inputValue).toBe('');
  });

  it('reverts when commitOnBlur true but highlightedIndex is -1', () => {
    const state = makeState({
      status: 'OPEN_IDLE',
      highlightedIndex: -1,
      inputValue: 'typed',
      lastConfirmedValue: 'prev',
    });
    const next = dispatch(state, { type: 'BLUR' }, { commitOnBlur: true });
    expect(next.inputValue).toBe('prev');
  });

  it('transitions FOCUSED_CLOSED -> IDLE', () => {
    const state = makeState({
      status: 'FOCUSED_CLOSED',
      inputValue: 'test',
      lastConfirmedValue: 'confirmed',
    });
    const next = dispatch(state, { type: 'BLUR' });
    expect(next.status).toBe('IDLE');
    expect(next.inputValue).toBe('confirmed');
  });
});

// ---------------------------------------------------------------------------
// INPUT_CHANGE
// ---------------------------------------------------------------------------

describe('INPUT_CHANGE', () => {
  it('updates inputValue and filters items', () => {
    const state = makeState({ status: 'FOCUSED_CLOSED' });
    const next = dispatch(state, { type: 'INPUT_CHANGE', value: 'ap' });
    expect(next.inputValue).toBe('ap');
    expect(next.status).toBe('OPEN_IDLE');
    expect(next.filteredItems).toEqual([items[0]]); // Apple
  });

  it('resets highlightedIndex to -1', () => {
    const state = makeState({
      status: 'OPEN_HIGHLIGHTED',
      highlightedIndex: 2,
    });
    const next = dispatch(state, { type: 'INPUT_CHANGE', value: 'b' });
    expect(next.highlightedIndex).toBe(-1);
  });

  it('shows all items when input is empty', () => {
    const state = makeState({ status: 'OPEN_IDLE', inputValue: 'apple' });
    const next = dispatch(state, { type: 'INPUT_CHANGE', value: '' });
    expect(next.filteredItems).toEqual(items);
  });

  it('is ignored when variant is select', () => {
    const state = makeState({ status: 'FOCUSED_CLOSED' });
    const next = dispatch(
      state,
      { type: 'INPUT_CHANGE', value: 'test' },
      { variant: 'select' },
    );
    expect(next).toBe(state);
  });

  it('uses custom filterFunction when provided', () => {
    const customFilter = vi.fn((_items: Item[], input: string) =>
      _items.filter((i) => i.value === input),
    );
    const state = makeState({ status: 'FOCUSED_CLOSED' });
    const next = dispatch(
      state,
      { type: 'INPUT_CHANGE', value: 'banana' },
      { filterFunction: customFilter },
    );
    expect(customFilter).toHaveBeenCalledWith(items, 'banana');
    expect(next.filteredItems).toEqual([items[1]]);
  });

  it('hides disabled items when hideDisabled is true', () => {
    const itemsWithDisabled = [
      ...items,
      { label: 'Fig', value: 'fig', disabled: true },
    ];
    const state = makeState({ status: 'FOCUSED_CLOSED' });
    const next = dispatch(
      state,
      { type: 'INPUT_CHANGE', value: '' },
      { items: itemsWithDisabled, hideDisabled: true },
    );
    expect(next.filteredItems).not.toContainEqual(
      expect.objectContaining({ value: 'fig' }),
    );
  });
});

// ---------------------------------------------------------------------------
// TOGGLE_MENU
// ---------------------------------------------------------------------------

describe('TOGGLE_MENU', () => {
  it('opens the menu from FOCUSED_CLOSED', () => {
    const state = makeState({ status: 'FOCUSED_CLOSED' });
    const next = dispatch(state, { type: 'TOGGLE_MENU' });
    expect(next.status).toBe('OPEN_IDLE');
    expect(next.highlightedIndex).toBe(-1);
  });

  it('closes the menu from OPEN_IDLE', () => {
    const state = makeState({
      status: 'OPEN_IDLE',
      inputValue: 'typed',
      lastConfirmedValue: 'prev',
    });
    const next = dispatch(state, { type: 'TOGGLE_MENU' });
    expect(next.status).toBe('FOCUSED_CLOSED');
    expect(next.inputValue).toBe('prev'); // reverts
  });

  it('closes the menu from OPEN_HIGHLIGHTED', () => {
    const state = makeState({
      status: 'OPEN_HIGHLIGHTED',
      highlightedIndex: 2,
      inputValue: 'typed',
      lastConfirmedValue: 'prev',
    });
    const next = dispatch(state, { type: 'TOGGLE_MENU' });
    expect(next.status).toBe('FOCUSED_CLOSED');
    expect(next.highlightedIndex).toBe(-1);
    expect(next.inputValue).toBe('prev');
  });

  it('clears inputValue in single mode when toggling open after selection', () => {
    const state = makeState({
      status: 'FOCUSED_CLOSED',
      inputValue: 'Banana',
      lastConfirmedValue: 'Banana',
      selectedItem: items[1],
    });
    const next = dispatch(state, { type: 'TOGGLE_MENU' });
    expect(next.status).toBe('OPEN_IDLE');
    expect(next.inputValue).toBe('');
    expect(next.filteredItems).toEqual(items);
  });
});

// ---------------------------------------------------------------------------
// OPEN_MENU / CLOSE_MENU
// ---------------------------------------------------------------------------

describe('OPEN_MENU', () => {
  it('opens from FOCUSED_CLOSED', () => {
    const state = makeState({ status: 'FOCUSED_CLOSED' });
    const next = dispatch(state, { type: 'OPEN_MENU' });
    expect(next.status).toBe('OPEN_IDLE');
    expect(next.highlightedIndex).toBe(-1);
  });

  it('clears inputValue and shows all items in single mode on re-open', () => {
    const state = makeState({
      status: 'FOCUSED_CLOSED',
      inputValue: 'Apple',
      lastConfirmedValue: 'Apple',
      selectedItem: items[0],
    });
    const next = dispatch(state, { type: 'OPEN_MENU' });
    expect(next.inputValue).toBe('');
    expect(next.filteredItems).toEqual(items); // all items, not just Apple
  });

  it('preserves inputValue in multi mode on open', () => {
    const state = makeState({ status: 'FOCUSED_CLOSED', inputValue: 'ch' });
    const next = dispatch(state, { type: 'OPEN_MENU' }, { mode: 'multi' });
    expect(next.inputValue).toBe('ch');
    expect(next.filteredItems).toEqual([items[2]]); // Cherry
  });

  it('does nothing if already open', () => {
    const state = makeState({ status: 'OPEN_IDLE' });
    const next = dispatch(state, { type: 'OPEN_MENU' });
    expect(next).toBe(state);
  });
});

describe('CLOSE_MENU', () => {
  it('closes from OPEN_IDLE and reverts input', () => {
    const state = makeState({
      status: 'OPEN_IDLE',
      inputValue: 'typed',
      lastConfirmedValue: 'confirmed',
    });
    const next = dispatch(state, { type: 'CLOSE_MENU' });
    expect(next.status).toBe('FOCUSED_CLOSED');
    expect(next.inputValue).toBe('confirmed');
    expect(next.highlightedIndex).toBe(-1);
  });

  it('closes from OPEN_HIGHLIGHTED', () => {
    const state = makeState({ status: 'OPEN_HIGHLIGHTED', highlightedIndex: 3 });
    const next = dispatch(state, { type: 'CLOSE_MENU' });
    expect(next.status).toBe('FOCUSED_CLOSED');
    expect(next.highlightedIndex).toBe(-1);
  });

  it('does nothing if already closed', () => {
    const state = makeState({ status: 'FOCUSED_CLOSED' });
    const next = dispatch(state, { type: 'CLOSE_MENU' });
    expect(next).toBe(state);
  });

  it('does nothing when IDLE', () => {
    const state = makeState({ status: 'IDLE' });
    const next = dispatch(state, { type: 'CLOSE_MENU' });
    expect(next).toBe(state);
  });
});

// ---------------------------------------------------------------------------
// HIGHLIGHT actions
// ---------------------------------------------------------------------------

describe('HIGHLIGHT_ITEM', () => {
  it('highlights a specific index', () => {
    const state = makeState({ status: 'OPEN_IDLE' });
    const next = dispatch(state, { type: 'HIGHLIGHT_ITEM', index: 2 });
    expect(next.status).toBe('OPEN_HIGHLIGHTED');
    expect(next.highlightedIndex).toBe(2);
  });

  it('sets status to OPEN_IDLE when index is -1', () => {
    const state = makeState({ status: 'OPEN_HIGHLIGHTED', highlightedIndex: 2 });
    const next = dispatch(state, { type: 'HIGHLIGHT_ITEM', index: -1 });
    expect(next.status).toBe('OPEN_IDLE');
    expect(next.highlightedIndex).toBe(-1);
  });

  it('does nothing when index is out of bounds (too high)', () => {
    const state = makeState({ status: 'OPEN_IDLE' });
    const next = dispatch(state, { type: 'HIGHLIGHT_ITEM', index: 999 });
    expect(next).toBe(state);
  });

  it('skips disabled items when behavior is skip', () => {
    const disabledItems = items.map((item, i) =>
      i === 1 ? { ...item, disabled: true } : item,
    );
    const state = makeState({ status: 'OPEN_IDLE', filteredItems: disabledItems });
    const next = dispatch(
      state,
      { type: 'HIGHLIGHT_ITEM', index: 1 },
      { items: disabledItems, disabledItemBehavior: 'skip' },
    );
    expect(next).toBe(state); // no change — item is disabled
  });

  it('allows focusing disabled items when behavior is focus', () => {
    const disabledItems = items.map((item, i) =>
      i === 1 ? { ...item, disabled: true } : item,
    );
    const state = makeState({ status: 'OPEN_IDLE', filteredItems: disabledItems });
    const next = dispatch(
      state,
      { type: 'HIGHLIGHT_ITEM', index: 1 },
      { items: disabledItems, disabledItemBehavior: 'focus' },
    );
    expect(next.highlightedIndex).toBe(1);
  });

  it('does nothing from IDLE status', () => {
    const state = makeState({ status: 'IDLE' });
    const next = dispatch(state, { type: 'HIGHLIGHT_ITEM', index: 0 });
    expect(next).toBe(state);
  });
});

describe('HIGHLIGHT_FIRST', () => {
  it('highlights the first item', () => {
    const state = makeState({ status: 'OPEN_IDLE' });
    const next = dispatch(state, { type: 'HIGHLIGHT_FIRST' });
    expect(next.highlightedIndex).toBe(0);
    expect(next.status).toBe('OPEN_HIGHLIGHTED');
  });

  it('skips disabled first items', () => {
    const disabledItems = [
      { ...items[0], disabled: true },
      ...items.slice(1),
    ];
    const state = makeState({ status: 'OPEN_IDLE', filteredItems: disabledItems });
    const next = dispatch(state, { type: 'HIGHLIGHT_FIRST' }, { items: disabledItems });
    expect(next.highlightedIndex).toBe(1);
  });

  it('returns -1 when all items are disabled', () => {
    const allDisabled = items.map((item) => ({ ...item, disabled: true }));
    const state = makeState({ status: 'OPEN_IDLE', filteredItems: allDisabled });
    const next = dispatch(state, { type: 'HIGHLIGHT_FIRST' }, { items: allDisabled });
    expect(next.highlightedIndex).toBe(-1);
    expect(next.status).toBe('OPEN_IDLE');
  });

  it('returns 0 when behavior is focus even if first item disabled', () => {
    const disabledItems = [
      { ...items[0], disabled: true },
      ...items.slice(1),
    ];
    const state = makeState({ status: 'OPEN_IDLE', filteredItems: disabledItems });
    const next = dispatch(
      state,
      { type: 'HIGHLIGHT_FIRST' },
      { items: disabledItems, disabledItemBehavior: 'focus' },
    );
    expect(next.highlightedIndex).toBe(0);
  });
});

describe('HIGHLIGHT_LAST', () => {
  it('highlights the last item', () => {
    const state = makeState({ status: 'OPEN_IDLE' });
    const next = dispatch(state, { type: 'HIGHLIGHT_LAST' });
    expect(next.highlightedIndex).toBe(4);
    expect(next.status).toBe('OPEN_HIGHLIGHTED');
  });

  it('skips disabled last items', () => {
    const disabledItems = [
      ...items.slice(0, 4),
      { ...items[4], disabled: true },
    ];
    const state = makeState({ status: 'OPEN_IDLE', filteredItems: disabledItems });
    const next = dispatch(state, { type: 'HIGHLIGHT_LAST' }, { items: disabledItems });
    expect(next.highlightedIndex).toBe(3);
  });
});

describe('HIGHLIGHT_NEXT', () => {
  it('moves highlight forward', () => {
    const state = makeState({
      status: 'OPEN_HIGHLIGHTED',
      highlightedIndex: 1,
    });
    const next = dispatch(state, { type: 'HIGHLIGHT_NEXT' });
    expect(next.highlightedIndex).toBe(2);
  });

  it('wraps from last to first', () => {
    const state = makeState({
      status: 'OPEN_HIGHLIGHTED',
      highlightedIndex: 4,
    });
    const next = dispatch(state, { type: 'HIGHLIGHT_NEXT' });
    expect(next.highlightedIndex).toBe(0);
  });

  it('skips disabled items', () => {
    const disabledItems = items.map((item, i) =>
      i === 2 ? { ...item, disabled: true } : item,
    );
    const state = makeState({
      status: 'OPEN_HIGHLIGHTED',
      highlightedIndex: 1,
      filteredItems: disabledItems,
    });
    const next = dispatch(state, { type: 'HIGHLIGHT_NEXT' }, { items: disabledItems });
    expect(next.highlightedIndex).toBe(3); // skips index 2
  });

  it('does nothing when all items disabled', () => {
    const allDisabled = items.map((item) => ({ ...item, disabled: true }));
    const state = makeState({
      status: 'OPEN_HIGHLIGHTED',
      highlightedIndex: 0,
      filteredItems: allDisabled,
    });
    const next = dispatch(state, { type: 'HIGHLIGHT_NEXT' }, { items: allDisabled });
    expect(next).toBe(state);
  });
});

describe('HIGHLIGHT_PREV', () => {
  it('moves highlight backward', () => {
    const state = makeState({
      status: 'OPEN_HIGHLIGHTED',
      highlightedIndex: 2,
    });
    const next = dispatch(state, { type: 'HIGHLIGHT_PREV' });
    expect(next.highlightedIndex).toBe(1);
  });

  it('wraps from first to last', () => {
    const state = makeState({
      status: 'OPEN_HIGHLIGHTED',
      highlightedIndex: 0,
    });
    const next = dispatch(state, { type: 'HIGHLIGHT_PREV' });
    expect(next.highlightedIndex).toBe(4);
  });

  it('skips disabled items backward', () => {
    const disabledItems = items.map((item, i) =>
      i === 1 ? { ...item, disabled: true } : item,
    );
    const state = makeState({
      status: 'OPEN_HIGHLIGHTED',
      highlightedIndex: 2,
      filteredItems: disabledItems,
    });
    const next = dispatch(state, { type: 'HIGHLIGHT_PREV' }, { items: disabledItems });
    expect(next.highlightedIndex).toBe(0); // skips index 1
  });
});

// ---------------------------------------------------------------------------
// SELECT_HIGHLIGHTED
// ---------------------------------------------------------------------------

describe('SELECT_HIGHLIGHTED', () => {
  it('selects the highlighted item', () => {
    const state = makeState({
      status: 'OPEN_HIGHLIGHTED',
      highlightedIndex: 1,
    });
    const next = dispatch(state, { type: 'SELECT_HIGHLIGHTED' });
    expect(next.selectedItem).toBe(items[1]);
    expect(next.inputValue).toBe('Banana');
    expect(next.lastConfirmedValue).toBe('Banana');
  });

  it('closes menu when closeOnSelect is true', () => {
    const state = makeState({
      status: 'OPEN_HIGHLIGHTED',
      highlightedIndex: 0,
    });
    const next = dispatch(state, { type: 'SELECT_HIGHLIGHTED' }, { closeOnSelect: true });
    expect(next.status).toBe('FOCUSED_CLOSED');
    expect(next.highlightedIndex).toBe(-1);
  });

  it('keeps menu open when closeOnSelect is false', () => {
    const state = makeState({
      status: 'OPEN_HIGHLIGHTED',
      highlightedIndex: 0,
    });
    const next = dispatch(
      state,
      { type: 'SELECT_HIGHLIGHTED' },
      { closeOnSelect: false },
    );
    expect(next.status).toBe('OPEN_HIGHLIGHTED');
    expect(next.highlightedIndex).toBe(0);
  });

  it('does nothing when highlightedIndex is -1', () => {
    const state = makeState({
      status: 'OPEN_IDLE',
      highlightedIndex: -1,
    });
    const next = dispatch(state, { type: 'SELECT_HIGHLIGHTED' });
    expect(next).toBe(state);
  });

  it('does nothing when highlighted item is disabled', () => {
    const disabledItems = items.map((item, i) =>
      i === 1 ? { ...item, disabled: true } : item,
    );
    const state = makeState({
      status: 'OPEN_HIGHLIGHTED',
      highlightedIndex: 1,
      filteredItems: disabledItems,
    });
    const next = dispatch(
      state,
      { type: 'SELECT_HIGHLIGHTED' },
      { items: disabledItems },
    );
    expect(next).toBe(state);
  });

  it('deselects when deselectionAllowed and same item highlighted', () => {
    const state = makeState({
      status: 'OPEN_HIGHLIGHTED',
      highlightedIndex: 1,
      selectedItem: items[1],
    });
    const next = dispatch(
      state,
      { type: 'SELECT_HIGHLIGHTED' },
      { deselectionAllowed: true },
    );
    expect(next.selectedItem).toBeNull();
    expect(next.inputValue).toBe('');
    expect(next.lastConfirmedValue).toBe('');
  });

  it('does not deselect when deselectionAllowed but different item', () => {
    const state = makeState({
      status: 'OPEN_HIGHLIGHTED',
      highlightedIndex: 2,
      selectedItem: items[1],
    });
    const next = dispatch(
      state,
      { type: 'SELECT_HIGHLIGHTED' },
      { deselectionAllowed: true },
    );
    expect(next.selectedItem).toBe(items[2]);
  });

  it('does nothing when highlightedIndex is out of bounds', () => {
    const state = makeState({
      status: 'OPEN_HIGHLIGHTED',
      highlightedIndex: 999,
    });
    const next = dispatch(state, { type: 'SELECT_HIGHLIGHTED' });
    expect(next).toBe(state);
  });
});

// ---------------------------------------------------------------------------
// SELECT_ITEM
// ---------------------------------------------------------------------------

describe('SELECT_ITEM', () => {
  it('selects the given item', () => {
    const state = makeState({ status: 'OPEN_IDLE' });
    const next = dispatch(state, { type: 'SELECT_ITEM', item: items[3] });
    expect(next.selectedItem).toBe(items[3]);
    expect(next.inputValue).toBe('Date');
    expect(next.lastConfirmedValue).toBe('Date');
  });

  it('closes menu when closeOnSelect is true', () => {
    const state = makeState({ status: 'OPEN_IDLE' });
    const next = dispatch(
      state,
      { type: 'SELECT_ITEM', item: items[0] },
      { closeOnSelect: true },
    );
    expect(next.status).toBe('FOCUSED_CLOSED');
  });

  it('does nothing when item is disabled', () => {
    const disabledItem = { ...items[0], disabled: true };
    const state = makeState({ status: 'OPEN_IDLE' });
    const next = dispatch(state, { type: 'SELECT_ITEM', item: disabledItem });
    expect(next).toBe(state);
  });

  it('deselects when deselectionAllowed and same item', () => {
    const state = makeState({
      status: 'OPEN_IDLE',
      selectedItem: items[0],
    });
    const next = dispatch(
      state,
      { type: 'SELECT_ITEM', item: items[0] },
      { deselectionAllowed: true },
    );
    expect(next.selectedItem).toBeNull();
    expect(next.inputValue).toBe('');
  });

  it('does not deselect when different item even with deselectionAllowed', () => {
    const state = makeState({
      status: 'OPEN_IDLE',
      selectedItem: items[0],
    });
    const next = dispatch(
      state,
      { type: 'SELECT_ITEM', item: items[1] },
      { deselectionAllowed: true },
    );
    expect(next.selectedItem).toBe(items[1]);
  });
});

// ---------------------------------------------------------------------------
// DESELECT_ITEM
// ---------------------------------------------------------------------------

describe('DESELECT_ITEM', () => {
  it('deselects current item', () => {
    const state = makeState({
      status: 'FOCUSED_CLOSED',
      selectedItem: items[0],
      inputValue: 'Apple',
      lastConfirmedValue: 'Apple',
    });
    const next = dispatch(state, { type: 'DESELECT_ITEM', item: items[0] });
    expect(next.selectedItem).toBeNull();
    expect(next.inputValue).toBe('');
    expect(next.lastConfirmedValue).toBe('');
  });

  it('does nothing when nothing is selected', () => {
    const state = makeState({ status: 'FOCUSED_CLOSED', selectedItem: null });
    const next = dispatch(state, { type: 'DESELECT_ITEM', item: items[0] });
    expect(next).toBe(state);
  });
});

// ---------------------------------------------------------------------------
// CLEAR_SELECTION
// ---------------------------------------------------------------------------

describe('CLEAR_SELECTION', () => {
  it('clears everything', () => {
    const state = makeState({
      status: 'FOCUSED_CLOSED',
      selectedItem: items[2],
      selectedItems: [items[0], items[1]],
      inputValue: 'Cherry',
      lastConfirmedValue: 'Cherry',
      filteredItems: [items[2]],
    });
    const next = dispatch(state, { type: 'CLEAR_SELECTION' });
    expect(next.selectedItem).toBeNull();
    expect(next.selectedItems).toEqual([]);
    expect(next.inputValue).toBe('');
    expect(next.lastConfirmedValue).toBe('');
    expect(next.filteredItems).toEqual(items); // reset to full list
  });
});

// ---------------------------------------------------------------------------
// RESET
// ---------------------------------------------------------------------------

describe('RESET', () => {
  it('returns to initial state', () => {
    const state = makeState({
      status: 'OPEN_HIGHLIGHTED',
      selectedItem: items[1],
      inputValue: 'Banana',
      highlightedIndex: 3,
    });
    const next = dispatch(state, { type: 'RESET' });
    expect(next.status).toBe('IDLE');
    expect(next.selectedItem).toBeNull();
    expect(next.inputValue).toBe('');
    expect(next.highlightedIndex).toBe(-1);
  });
});

// ---------------------------------------------------------------------------
// Unknown action
// ---------------------------------------------------------------------------

describe('unknown action', () => {
  it('returns the same state for unrecognized actions', () => {
    const state = makeState();
    const next = dispatch(state, { type: 'UNKNOWN' } as unknown as ComboAction<Item>);
    expect(next).toBe(state);
  });
});

// ---------------------------------------------------------------------------
// getNextEnabledIndex
// ---------------------------------------------------------------------------

describe('getNextEnabledIndex', () => {
  const isDisabled = (item: Item) => item.disabled === true;

  it('moves forward by one', () => {
    expect(getNextEnabledIndex(items, 0, 1, isDisabled, 'skip')).toBe(1);
  });

  it('moves backward by one', () => {
    expect(getNextEnabledIndex(items, 2, -1, isDisabled, 'skip')).toBe(1);
  });

  it('wraps forward from last to first', () => {
    expect(getNextEnabledIndex(items, 4, 1, isDisabled, 'skip')).toBe(0);
  });

  it('wraps backward from first to last', () => {
    expect(getNextEnabledIndex(items, 0, -1, isDisabled, 'skip')).toBe(4);
  });

  it('skips disabled items going forward', () => {
    const withDisabled = items.map((item, i) =>
      i === 2 ? { ...item, disabled: true } : item,
    );
    expect(getNextEnabledIndex(withDisabled, 1, 1, isDisabled, 'skip')).toBe(3);
  });

  it('skips disabled items going backward', () => {
    const withDisabled = items.map((item, i) =>
      i === 1 ? { ...item, disabled: true } : item,
    );
    expect(getNextEnabledIndex(withDisabled, 2, -1, isDisabled, 'skip')).toBe(0);
  });

  it('returns -1 when all items are disabled', () => {
    const allDisabled = items.map((item) => ({ ...item, disabled: true }));
    expect(getNextEnabledIndex(allDisabled, 0, 1, isDisabled, 'skip')).toBe(-1);
  });

  it('returns -1 for empty array', () => {
    expect(getNextEnabledIndex([], 0, 1, isDisabled, 'skip')).toBe(-1);
  });

  it('focuses disabled items when behavior is focus (forward)', () => {
    const withDisabled = items.map((item, i) =>
      i === 2 ? { ...item, disabled: true } : item,
    );
    expect(getNextEnabledIndex(withDisabled, 1, 1, isDisabled, 'focus')).toBe(2);
  });

  it('focuses disabled items when behavior is focus (backward)', () => {
    const withDisabled = items.map((item, i) =>
      i === 1 ? { ...item, disabled: true } : item,
    );
    expect(getNextEnabledIndex(withDisabled, 2, -1, isDisabled, 'focus')).toBe(1);
  });

  it('wraps correctly with focus behavior', () => {
    expect(getNextEnabledIndex(items, 4, 1, isDisabled, 'focus')).toBe(0);
    expect(getNextEnabledIndex(items, 0, -1, isDisabled, 'focus')).toBe(4);
  });
});

// ---------------------------------------------------------------------------
// getFirstEnabledIndex / getLastEnabledIndex
// ---------------------------------------------------------------------------

describe('getFirstEnabledIndex', () => {
  const isDisabled = (item: Item) => item.disabled === true;

  it('returns 0 for non-disabled first item', () => {
    expect(getFirstEnabledIndex(items, isDisabled, 'skip')).toBe(0);
  });

  it('skips disabled items at the start', () => {
    const disabledStart = [
      { ...items[0], disabled: true },
      { ...items[1], disabled: true },
      ...items.slice(2),
    ];
    expect(getFirstEnabledIndex(disabledStart, isDisabled, 'skip')).toBe(2);
  });

  it('returns -1 when all disabled', () => {
    const allDisabled = items.map((item) => ({ ...item, disabled: true }));
    expect(getFirstEnabledIndex(allDisabled, isDisabled, 'skip')).toBe(-1);
  });

  it('returns -1 for empty array', () => {
    expect(getFirstEnabledIndex([], isDisabled, 'skip')).toBe(-1);
  });

  it('returns 0 with focus behavior even if disabled', () => {
    const disabledStart = [{ ...items[0], disabled: true }, ...items.slice(1)];
    expect(getFirstEnabledIndex(disabledStart, isDisabled, 'focus')).toBe(0);
  });
});

describe('getLastEnabledIndex', () => {
  const isDisabled = (item: Item) => item.disabled === true;

  it('returns last index for non-disabled last item', () => {
    expect(getLastEnabledIndex(items, isDisabled, 'skip')).toBe(4);
  });

  it('skips disabled items at the end', () => {
    const disabledEnd = [
      ...items.slice(0, 3),
      { ...items[3], disabled: true },
      { ...items[4], disabled: true },
    ];
    expect(getLastEnabledIndex(disabledEnd, isDisabled, 'skip')).toBe(2);
  });

  it('returns -1 when all disabled', () => {
    const allDisabled = items.map((item) => ({ ...item, disabled: true }));
    expect(getLastEnabledIndex(allDisabled, isDisabled, 'skip')).toBe(-1);
  });

  it('returns -1 for empty array', () => {
    expect(getLastEnabledIndex([], isDisabled, 'skip')).toBe(-1);
  });

  it('returns last index with focus behavior even if disabled', () => {
    const disabledEnd = [...items.slice(0, 4), { ...items[4], disabled: true }];
    expect(getLastEnabledIndex(disabledEnd, isDisabled, 'focus')).toBe(4);
  });
});

// ---------------------------------------------------------------------------
// Multi-select mode
// ---------------------------------------------------------------------------

describe('Multi-select mode', () => {
  const multiCtx: Partial<ReducerContext<Item>> = {
    mode: 'multi',
    closeOnSelect: false,
  };

  it('SELECT_ITEM toggles item into selectedItems', () => {
    const state = makeState({ status: 'OPEN_IDLE', selectedItems: [] });
    const next = dispatch(state, { type: 'SELECT_ITEM', item: items[1] }, multiCtx);
    expect(next.selectedItems).toEqual([items[1]]);
  });

  it('SELECT_ITEM toggles item out of selectedItems when already selected', () => {
    const state = makeState({
      status: 'OPEN_IDLE',
      selectedItems: [items[0], items[1]],
    });
    const next = dispatch(state, { type: 'SELECT_ITEM', item: items[1] }, multiCtx);
    expect(next.selectedItems).toEqual([items[0]]);
  });

  it('SELECT_ITEM keeps selectedItem null in multi mode', () => {
    const state = makeState({ status: 'OPEN_IDLE', selectedItem: null });
    const next = dispatch(state, { type: 'SELECT_ITEM', item: items[2] }, multiCtx);
    expect(next.selectedItem).toBeNull();
  });

  it('SELECT_ITEM keeps menu open when closeOnSelect is false', () => {
    const state = makeState({ status: 'OPEN_IDLE' });
    const next = dispatch(state, { type: 'SELECT_ITEM', item: items[0] }, multiCtx);
    expect(next.status).toBe('OPEN_IDLE');
  });

  it('SELECT_HIGHLIGHTED toggles in multi mode', () => {
    const state = makeState({
      status: 'OPEN_HIGHLIGHTED',
      highlightedIndex: 2,
      selectedItems: [],
    });
    const next = dispatch(state, { type: 'SELECT_HIGHLIGHTED' }, multiCtx);
    expect(next.selectedItems).toEqual([items[2]]);
    expect(next.status).toBe('OPEN_HIGHLIGHTED');

    // Toggle the same item out
    const next2 = dispatch(next, { type: 'SELECT_HIGHLIGHTED' }, multiCtx);
    expect(next2.selectedItems).toEqual([]);
  });

  it('SELECT_ITEM does not select disabled items in multi mode', () => {
    const disabledItem = { ...items[0], disabled: true };
    const state = makeState({ status: 'OPEN_IDLE', selectedItems: [] });
    const next = dispatch(state, { type: 'SELECT_ITEM', item: disabledItem }, multiCtx);
    expect(next).toBe(state);
  });

  it('SELECT_ALL selects all non-disabled items', () => {
    const mixedItems = [
      items[0],
      { ...items[1], disabled: true },
      items[2],
      items[3],
      items[4],
    ];
    const state = makeState({
      status: 'OPEN_IDLE',
      selectedItems: [],
      filteredItems: mixedItems,
    });
    const next = dispatch(state, { type: 'SELECT_ALL' }, {
      ...multiCtx,
      items: mixedItems,
    });
    expect(next.selectedItems).toEqual([
      items[0],
      items[2],
      items[3],
      items[4],
    ]);
  });

  it('SELECT_ALL is no-op in single mode', () => {
    const state = makeState({ status: 'OPEN_IDLE', selectedItems: [] });
    const next = dispatch(state, { type: 'SELECT_ALL' }, { mode: 'single' });
    expect(next).toBe(state);
  });

  it('DESELECT_ITEM removes from selectedItems in multi mode', () => {
    const state = makeState({
      status: 'OPEN_IDLE',
      selectedItems: [items[0], items[2], items[4]],
    });
    const next = dispatch(state, { type: 'DESELECT_ITEM', item: items[2] }, multiCtx);
    expect(next.selectedItems).toEqual([items[0], items[4]]);
  });

  it('BLUR clears inputValue in multi mode (not revert to lastConfirmedValue)', () => {
    const state = makeState({
      status: 'OPEN_IDLE',
      inputValue: 'typed something',
      lastConfirmedValue: 'Apple',
      selectedItems: [items[0]],
    });
    const next = dispatch(state, { type: 'BLUR' }, multiCtx);
    expect(next.status).toBe('IDLE');
    expect(next.inputValue).toBe('');
    expect(next.lastConfirmedValue).toBe('');
  });

  it('TOGGLE_MENU (close) clears inputValue in multi mode', () => {
    const state = makeState({
      status: 'OPEN_IDLE',
      inputValue: 'typed',
      lastConfirmedValue: 'prev',
      selectedItems: [items[1]],
    });
    const next = dispatch(state, { type: 'TOGGLE_MENU' }, multiCtx);
    expect(next.status).toBe('FOCUSED_CLOSED');
    expect(next.inputValue).toBe('');
  });

  it('CLOSE_MENU clears inputValue in multi mode', () => {
    const state = makeState({
      status: 'OPEN_IDLE',
      inputValue: 'typed',
      lastConfirmedValue: 'prev',
      selectedItems: [items[1]],
    });
    const next = dispatch(state, { type: 'CLOSE_MENU' }, multiCtx);
    expect(next.status).toBe('FOCUSED_CLOSED');
    expect(next.inputValue).toBe('');
  });

  it('CLEAR_SELECTION clears selectedItems', () => {
    const state = makeState({
      status: 'FOCUSED_CLOSED',
      selectedItems: [items[0], items[2], items[4]],
      inputValue: '',
    });
    const next = dispatch(state, { type: 'CLEAR_SELECTION' }, multiCtx);
    expect(next.selectedItem).toBeNull();
    expect(next.selectedItems).toEqual([]);
    expect(next.inputValue).toBe('');
  });
});

// ---------------------------------------------------------------------------
// maxSelected constraint
// ---------------------------------------------------------------------------

describe('maxSelected constraint', () => {
  const multiCtx: Partial<ReducerContext<Item>> = {
    mode: 'multi',
    closeOnSelect: false,
  };

  it('SELECT_ITEM blocks adding beyond maxSelected', () => {
    const state = makeState({
      status: 'OPEN_IDLE',
      selectedItems: [items[0], items[1]],
    });
    const next = dispatch(
      state,
      { type: 'SELECT_ITEM', item: items[2] },
      { ...multiCtx, maxSelected: 2 },
    );
    expect(next).toBe(state); // no change
    expect(next.selectedItems).toHaveLength(2);
  });

  it('SELECT_ITEM allows adding when under maxSelected', () => {
    const state = makeState({
      status: 'OPEN_IDLE',
      selectedItems: [items[0]],
    });
    const next = dispatch(
      state,
      { type: 'SELECT_ITEM', item: items[2] },
      { ...multiCtx, maxSelected: 3 },
    );
    expect(next.selectedItems).toHaveLength(2);
    expect(next.selectedItems).toContain(items[2]);
  });

  it('SELECT_ITEM allows deselection even at maxSelected', () => {
    const state = makeState({
      status: 'OPEN_IDLE',
      selectedItems: [items[0], items[1]],
    });
    const next = dispatch(
      state,
      { type: 'SELECT_ITEM', item: items[1] },
      { ...multiCtx, maxSelected: 2 },
    );
    expect(next.selectedItems).toEqual([items[0]]); // toggled off
  });

  it('SELECT_HIGHLIGHTED blocks adding beyond maxSelected', () => {
    const state = makeState({
      status: 'OPEN_HIGHLIGHTED',
      highlightedIndex: 2,
      selectedItems: [items[0], items[1]],
    });
    const next = dispatch(
      state,
      { type: 'SELECT_HIGHLIGHTED' },
      { ...multiCtx, maxSelected: 2 },
    );
    expect(next).toBe(state);
    expect(next.selectedItems).toHaveLength(2);
  });

  it('SELECT_HIGHLIGHTED allows deselection at maxSelected', () => {
    const state = makeState({
      status: 'OPEN_HIGHLIGHTED',
      highlightedIndex: 1,
      selectedItems: [items[0], items[1]],
    });
    const next = dispatch(
      state,
      { type: 'SELECT_HIGHLIGHTED' },
      { ...multiCtx, maxSelected: 2 },
    );
    expect(next.selectedItems).toEqual([items[0]]); // toggled off items[1]
  });

  it('SELECT_ALL caps to maxSelected', () => {
    const state = makeState({
      status: 'OPEN_IDLE',
      selectedItems: [],
      filteredItems: items,
    });
    const next = dispatch(
      state,
      { type: 'SELECT_ALL' },
      { ...multiCtx, maxSelected: 3 },
    );
    expect(next.selectedItems).toHaveLength(3);
    expect(next.selectedItems).toEqual(items.slice(0, 3));
  });

  it('no constraint when maxSelected is undefined', () => {
    const state = makeState({
      status: 'OPEN_IDLE',
      selectedItems: [items[0], items[1], items[2], items[3]],
    });
    const next = dispatch(
      state,
      { type: 'SELECT_ITEM', item: items[4] },
      multiCtx,
    );
    expect(next.selectedItems).toHaveLength(5);
  });
});
