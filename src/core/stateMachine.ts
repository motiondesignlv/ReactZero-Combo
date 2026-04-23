import type {
  ComboState,
  ComboAction,
  ComboStatus,
  UseComboOptions,
} from '../types';
import { defaultFilter, defaultItemToString } from './utils';

// ---------------------------------------------------------------------------
// Reducer context — passed alongside state and action
// ---------------------------------------------------------------------------

export interface ReducerContext<T> {
  items: T[];
  itemToString: (item: T | null) => string;
  itemToValue: (item: T) => string | number;
  filterFunction?: (items: T[], inputValue: string) => T[];
  closeOnSelect: boolean;
  commitOnBlur: boolean;
  deselectionAllowed: boolean;
  isItemDisabled: (item: T) => boolean;
  disabledItemBehavior: 'skip' | 'focus';
  hideDisabled: boolean;
  variant: 'input' | 'select';
  mode: 'single' | 'multi';
  maxSelected?: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isOpenStatus(status: ComboStatus): boolean {
  return status === 'OPEN_IDLE' || status === 'OPEN_HIGHLIGHTED';
}

function filterItems<T>(
  items: T[],
  inputValue: string,
  ctx: ReducerContext<T>,
): T[] {
  const filtered = ctx.filterFunction
    ? ctx.filterFunction(items, inputValue)
    : defaultFilter(items, inputValue, (item: T) => ctx.itemToString(item));

  if (ctx.hideDisabled) {
    return filtered.filter((item) => !ctx.isItemDisabled(item));
  }
  return filtered;
}

/**
 * Find the next enabled index in a given direction, wrapping around.
 * Returns -1 if no enabled items exist.
 */
export function getNextEnabledIndex<T>(
  filteredItems: T[],
  currentIndex: number,
  direction: 1 | -1,
  isItemDisabled: (item: T) => boolean,
  behavior: 'skip' | 'focus',
): number {
  const len = filteredItems.length;
  if (len === 0) return -1;

  // If behavior is 'focus', disabled items are still focusable
  if (behavior === 'focus') {
    let next = currentIndex + direction;
    if (next >= len) next = 0;
    if (next < 0) next = len - 1;
    return next;
  }

  // Skip disabled items
  let next = currentIndex + direction;
  let attempts = 0;
  while (attempts < len) {
    if (next >= len) next = 0;
    if (next < 0) next = len - 1;
    if (!isItemDisabled(filteredItems[next])) return next;
    next += direction;
    attempts++;
  }
  return -1; // All items disabled
}

/**
 * Find the first enabled index from a given starting position.
 */
export function getFirstEnabledIndex<T>(
  filteredItems: T[],
  isItemDisabled: (item: T) => boolean,
  behavior: 'skip' | 'focus',
): number {
  if (filteredItems.length === 0) return -1;
  if (behavior === 'focus') return 0;
  for (let i = 0; i < filteredItems.length; i++) {
    if (!isItemDisabled(filteredItems[i])) return i;
  }
  return -1;
}

/**
 * Find the last enabled index.
 */
export function getLastEnabledIndex<T>(
  filteredItems: T[],
  isItemDisabled: (item: T) => boolean,
  behavior: 'skip' | 'focus',
): number {
  if (filteredItems.length === 0) return -1;
  if (behavior === 'focus') return filteredItems.length - 1;
  for (let i = filteredItems.length - 1; i >= 0; i--) {
    if (!isItemDisabled(filteredItems[i])) return i;
  }
  return -1;
}

/**
 * Apply a selection to state, branching on single vs multi mode and honoring
 * `deselectionAllowed`, `maxSelected`, and `closeOnSelect`. Shared by
 * SELECT_HIGHLIGHTED and SELECT_ITEM so behavior can't drift between them
 * (notably around the maxSelected guard, which used to live in two places).
 */
function applySelection<T>(
  state: ComboState<T>,
  item: T,
  ctx: ReducerContext<T>,
): ComboState<T> {
  if (ctx.isItemDisabled(item)) return state;

  const closedStatus: ComboStatus = ctx.closeOnSelect
    ? 'FOCUSED_CLOSED'
    : state.status;
  const closedHighlight = ctx.closeOnSelect ? -1 : state.highlightedIndex;

  if (ctx.mode === 'multi') {
    const itemVal = ctx.itemToValue(item);
    const alreadySelected = state.selectedItems.some(
      (si) => ctx.itemToValue(si) === itemVal,
    );

    // Block adding beyond maxSelected (deselection always allowed)
    if (
      !alreadySelected &&
      ctx.maxSelected != null &&
      state.selectedItems.length >= ctx.maxSelected
    ) {
      return state;
    }

    const nextSelectedItems = alreadySelected
      ? state.selectedItems.filter((si) => ctx.itemToValue(si) !== itemVal)
      : [...state.selectedItems, item];

    return {
      ...state,
      status: closedStatus,
      selectedItems: nextSelectedItems,
      highlightedIndex: closedHighlight,
    };
  }

  // Single-mode deselection: clicking the already-selected item clears it
  if (
    ctx.deselectionAllowed &&
    state.selectedItem != null &&
    ctx.itemToValue(state.selectedItem) === ctx.itemToValue(item)
  ) {
    return {
      ...state,
      status: closedStatus,
      selectedItem: null,
      inputValue: '',
      lastConfirmedValue: '',
      highlightedIndex: closedHighlight,
    };
  }

  const label = ctx.itemToString(item);
  return {
    ...state,
    status: closedStatus,
    selectedItem: item,
    inputValue: label,
    lastConfirmedValue: label,
    highlightedIndex: closedHighlight,
  };
}

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

/**
 * Build the initial reducer state from hook options.
 *
 * Note: `inputValue` and `lastConfirmedValue` are derived from the same
 * source (the resolved selectedItem's label, or empty). `lastConfirmedValue`
 * is what BLUR reverts to — keep them seeded together so the input doesn't
 * "snap" to a different string the first time the user unfocuses without
 * editing. If you ever decouple these, also revisit BLUR's revert path.
 */
export function getInitialState<T>(
  options: UseComboOptions<T>,
): ComboState<T> {
  const its = options.itemToString ?? defaultItemToString;
  const selectedItem = options.selectedItem ?? options.defaultSelectedItem ?? null;

  return {
    status: 'IDLE' as ComboStatus,
    selectedItem,
    selectedItems: options.selectedItems ?? options.defaultSelectedItems ?? [],
    inputValue:
      options.inputValue ??
      options.defaultInputValue ??
      (selectedItem ? its(selectedItem) : ''),
    lastConfirmedValue: selectedItem ? its(selectedItem) : '',
    highlightedIndex: -1,
    filteredItems: options.items,
    expandedItems: new Set<string>(),
    activeTabId: null,
    isLoading: options.isLoading ?? false,
    isLoadingMore: false,
    error: null,
    visibleChipCount: 0,
  };
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

export function comboReducer<T>(
  state: ComboState<T>,
  action: ComboAction<T>,
  ctx: ReducerContext<T>,
): ComboState<T> {
  switch (action.type) {
    case 'FOCUS': {
      if (state.status !== 'IDLE') return state;
      return {
        ...state,
        status: 'FOCUSED_CLOSED',
        lastConfirmedValue: state.inputValue,
      };
    }

    case 'BLUR': {
      if (state.status === 'IDLE') return state;

      // Multi mode: clear input text on blur, don't revert to a label
      if (ctx.mode === 'multi') {
        return {
          ...state,
          status: 'IDLE',
          inputValue: '',
          lastConfirmedValue: '',
          highlightedIndex: -1,
          filteredItems: ctx.items,
        };
      }

      // If commitOnBlur and something is highlighted, select it
      if (
        ctx.commitOnBlur &&
        isOpenStatus(state.status) &&
        state.highlightedIndex >= 0 &&
        state.highlightedIndex < state.filteredItems.length
      ) {
        const item = state.filteredItems[state.highlightedIndex];
        if (!ctx.isItemDisabled(item)) {
          const label = ctx.itemToString(item);
          return {
            ...state,
            status: 'IDLE',
            selectedItem: item,
            inputValue: label,
            lastConfirmedValue: label,
            highlightedIndex: -1,
          };
        }
      }

      // Revert input to last confirmed value
      return {
        ...state,
        status: 'IDLE',
        inputValue: state.lastConfirmedValue,
        highlightedIndex: -1,
      };
    }

    case 'INPUT_CHANGE': {
      // In select variant, input changes are ignored
      if (ctx.variant === 'select') return state;

      const filtered = filterItems(ctx.items, action.value, ctx);
      return {
        ...state,
        status: 'OPEN_IDLE',
        inputValue: action.value,
        filteredItems: filtered,
        highlightedIndex: -1,
      };
    }

    case 'TOGGLE_MENU': {
      if (isOpenStatus(state.status)) {
        return {
          ...state,
          status: 'FOCUSED_CLOSED',
          inputValue: ctx.mode === 'multi' ? '' : state.lastConfirmedValue,
          highlightedIndex: -1,
          ...(ctx.mode === 'multi' ? { filteredItems: ctx.items } : {}),
        };
      }
      // Single mode: clear input so re-open shows all items (not filtered by selected label)
      const toggleSearchValue = ctx.mode === 'multi' ? state.inputValue : '';
      const filtered = filterItems(ctx.items, toggleSearchValue, ctx);
      return {
        ...state,
        status: 'OPEN_IDLE',
        inputValue: toggleSearchValue,
        filteredItems: filtered,
        highlightedIndex: -1,
      };
    }

    case 'OPEN_MENU': {
      if (isOpenStatus(state.status)) return state;
      // Single mode: clear input so re-open shows all items (not filtered by selected label)
      const searchValue = ctx.mode === 'multi' ? state.inputValue : '';
      const filtered = filterItems(ctx.items, searchValue, ctx);
      return {
        ...state,
        status: 'OPEN_IDLE',
        inputValue: searchValue,
        filteredItems: filtered,
        highlightedIndex: -1,
      };
    }

    case 'CLOSE_MENU': {
      if (!isOpenStatus(state.status)) return state;
      return {
        ...state,
        status: 'FOCUSED_CLOSED',
        inputValue: ctx.mode === 'multi' ? '' : state.lastConfirmedValue,
        highlightedIndex: -1,
        ...(ctx.mode === 'multi' ? { filteredItems: ctx.items } : {}),
      };
    }

    case 'HIGHLIGHT_ITEM': {
      if (!isOpenStatus(state.status) && state.status !== 'FOCUSED_CLOSED')
        return state;
      const idx = action.index;
      if (idx < 0) {
        return { ...state, status: 'OPEN_IDLE', highlightedIndex: -1 };
      }
      // Bounds check
      if (idx >= state.filteredItems.length) return state;
      // If behavior is skip and item is disabled, don't highlight
      if (
        ctx.disabledItemBehavior === 'skip' &&
        ctx.isItemDisabled(state.filteredItems[idx])
      ) {
        return state;
      }
      return {
        ...state,
        status: 'OPEN_HIGHLIGHTED',
        highlightedIndex: idx,
      };
    }

    case 'HIGHLIGHT_FIRST': {
      const idx = getFirstEnabledIndex(
        state.filteredItems,
        ctx.isItemDisabled,
        ctx.disabledItemBehavior,
      );
      if (idx < 0) return { ...state, status: 'OPEN_IDLE', highlightedIndex: -1 };
      return {
        ...state,
        status: 'OPEN_HIGHLIGHTED',
        highlightedIndex: idx,
      };
    }

    case 'HIGHLIGHT_LAST': {
      const idx = getLastEnabledIndex(
        state.filteredItems,
        ctx.isItemDisabled,
        ctx.disabledItemBehavior,
      );
      if (idx < 0) return { ...state, status: 'OPEN_IDLE', highlightedIndex: -1 };
      return {
        ...state,
        status: 'OPEN_HIGHLIGHTED',
        highlightedIndex: idx,
      };
    }

    case 'HIGHLIGHT_NEXT': {
      const current = state.highlightedIndex;
      const idx = getNextEnabledIndex(
        state.filteredItems,
        current,
        1,
        ctx.isItemDisabled,
        ctx.disabledItemBehavior,
      );
      if (idx < 0) return state;
      return {
        ...state,
        status: 'OPEN_HIGHLIGHTED',
        highlightedIndex: idx,
      };
    }

    case 'HIGHLIGHT_PREV': {
      const current = state.highlightedIndex;
      const idx = getNextEnabledIndex(
        state.filteredItems,
        current,
        -1,
        ctx.isItemDisabled,
        ctx.disabledItemBehavior,
      );
      if (idx < 0) return state;
      return {
        ...state,
        status: 'OPEN_HIGHLIGHTED',
        highlightedIndex: idx,
      };
    }

    case 'SELECT_HIGHLIGHTED': {
      if (state.highlightedIndex < 0) return state;
      if (state.highlightedIndex >= state.filteredItems.length) return state;
      return applySelection(state, state.filteredItems[state.highlightedIndex], ctx);
    }

    case 'SELECT_ITEM': {
      return applySelection(state, action.item, ctx);
    }

    case 'DESELECT_ITEM': {
      // Multi mode: remove specific item from selectedItems
      if (ctx.mode === 'multi') {
        const itemVal = ctx.itemToValue(action.item);
        return {
          ...state,
          selectedItems: state.selectedItems.filter(
            (si) => ctx.itemToValue(si) !== itemVal,
          ),
        };
      }
      if (state.selectedItem == null) return state;
      return {
        ...state,
        selectedItem: null,
        inputValue: '',
        lastConfirmedValue: '',
      };
    }

    case 'CLEAR_SELECTION': {
      return {
        ...state,
        selectedItem: null,
        selectedItems: [],
        inputValue: '',
        lastConfirmedValue: '',
        filteredItems: ctx.items,
      };
    }

    case 'REMOVE_LAST_CHIP': {
      if (ctx.mode !== 'multi') return state;
      if (state.selectedItems.length === 0) return state;
      if (state.inputValue !== '') return state; // Only remove when input is empty
      return {
        ...state,
        selectedItems: state.selectedItems.slice(0, -1),
      };
    }

    case 'SELECT_ALL': {
      if (ctx.mode !== 'multi') return state;
      let enabledItems = state.filteredItems.filter(
        (item) => !ctx.isItemDisabled(item),
      );
      if (ctx.maxSelected != null) {
        enabledItems = enabledItems.slice(0, ctx.maxSelected);
      }
      return {
        ...state,
        selectedItems: enabledItems,
      };
    }

    case 'SYNC_ITEMS': {
      const filtered = filterItems(ctx.items, state.inputValue, ctx);
      return {
        ...state,
        filteredItems: filtered,
        highlightedIndex: -1,
      };
    }

    case 'RESET': {
      return getInitialState({
        items: ctx.items,
        itemToString: ctx.itemToString,
        itemToValue: ctx.itemToValue,
      });
    }

    default:
      return state;
  }
}
