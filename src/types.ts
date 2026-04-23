import type { ReactNode, HTMLAttributes, RefObject, MutableRefObject } from 'react';

// ---------------------------------------------------------------------------
// Status
// ---------------------------------------------------------------------------

export type ComboStatus =
  | 'IDLE'
  | 'FOCUSED_CLOSED'
  | 'OPEN_IDLE'
  | 'OPEN_HIGHLIGHTED'
  | 'LOADING'
  | 'LOADING_MORE'
  | 'ERROR';

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

export interface ComboState<T> {
  status: ComboStatus;
  selectedItem: T | null;
  selectedItems: T[];
  inputValue: string;
  lastConfirmedValue: string;
  highlightedIndex: number; // -1 = none
  filteredItems: T[];
  expandedItems: Set<string>;
  activeTabId: string | null;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: Error | null;
  visibleChipCount: number;
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

export type ComboAction<T> =
  | { type: 'FOCUS' }
  | { type: 'BLUR' }
  | { type: 'INPUT_CHANGE'; value: string }
  | { type: 'TOGGLE_MENU' }
  | { type: 'OPEN_MENU' }
  | { type: 'CLOSE_MENU' }
  | { type: 'HIGHLIGHT_ITEM'; index: number }
  | { type: 'HIGHLIGHT_FIRST' }
  | { type: 'HIGHLIGHT_LAST' }
  | { type: 'HIGHLIGHT_NEXT' }
  | { type: 'HIGHLIGHT_PREV' }
  | { type: 'SELECT_HIGHLIGHTED' }
  | { type: 'SELECT_ITEM'; item: T }
  | { type: 'DESELECT_ITEM'; item: T }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'REMOVE_LAST_CHIP' }
  | { type: 'SELECT_ALL' }
  | { type: 'SYNC_ITEMS' }
  | { type: 'RESET' };

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

export interface IconSlots {
  chevronDown: ReactNode;
  check: ReactNode;
  clear: ReactNode;
  search: ReactNode;
  loading: ReactNode;
}

export type ChevronStyle =
  | 'caret'
  | 'arrow'
  | 'angle'
  | 'plusminus'
  | 'dots'
  | 'none'
  | 'custom';

// ---------------------------------------------------------------------------
// Groups
// ---------------------------------------------------------------------------

export interface ComboGroup<T> {
  label: string;
  items: T[];
  disabled?: boolean;
  disabledReason?: string;
}

// ---------------------------------------------------------------------------
// Prop Getter
// ---------------------------------------------------------------------------

export type PropGetter<
  TElement extends HTMLElement = HTMLElement,
  TExtra = Record<string, unknown>,
> = (
  userProps?: HTMLAttributes<TElement> & TExtra,
) => HTMLAttributes<TElement> & Record<string, unknown>;

// ---------------------------------------------------------------------------
// Ref type
// ---------------------------------------------------------------------------

export type ComboRef<T extends HTMLElement> =
  | RefObject<T | null>
  | MutableRefObject<T | null>
  | ((instance: T | null) => void)
  | null;

// ---------------------------------------------------------------------------
// Hook Options
// ---------------------------------------------------------------------------

export interface UseComboOptions<T> {
  // Data
  items: T[];
  itemToString?: (item: T | null) => string;
  itemToValue?: (item: T) => string | number;

  // Mode
  mode?: 'single' | 'multi';
  variant?: 'input' | 'select';

  // Controlled / uncontrolled
  selectedItem?: T | null;
  defaultSelectedItem?: T | null;
  selectedItems?: T[];
  defaultSelectedItems?: T[];
  inputValue?: string;
  defaultInputValue?: string;
  isOpen?: boolean;
  defaultIsOpen?: boolean;

  // Behavior
  filterFunction?: (items: T[], inputValue: string) => T[];
  closeOnSelect?: boolean;
  commitOnBlur?: boolean;
  /** @experimental Planned for Phase 2 (multi-select). Passing this prop has no effect today. */
  clearOnSelect?: boolean;
  deselectionAllowed?: boolean;
  maxSelected?: number;

  // Accessibility
  id?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;

  // Callbacks
  onSelectedItemChange?: (item: T | null) => void;
  onSelectedItemsChange?: (items: T[]) => void;
  onIsOpenChange?: (isOpen: boolean) => void;
  onHighlightedIndexChange?: (index: number) => void;
  onStateChange?: (state: ComboState<T>) => void;
  onInputChange?: (value: string) => void;

  // Async
  /** @experimental Planned for Phase 3 — not yet implemented. Passing this prop has no effect. */
  debounceMs?: number;
  isLoading?: boolean;
  /** @experimental Planned for Phase 3 — not yet implemented. Passing this prop has no effect. */
  hasMore?: boolean;
  /** @experimental Planned for Phase 3 — not yet implemented. Passing this prop has no effect. */
  onLoadMore?: () => void;

  // Disabled
  disabled?: boolean | 'loading';
  readOnly?: boolean;
  isItemDisabled?: (item: T) => boolean;
  hideDisabled?: boolean;
  disabledItemBehavior?: 'skip' | 'focus';

  // Icons
  icons?: Partial<IconSlots>;
  chevronStyle?: ChevronStyle;

  // Portal
  portalTarget?: Element | null;
  disablePortal?: boolean;

  // Groups
  groups?: ComboGroup<T>[];
}

// ---------------------------------------------------------------------------
// Hook Return
// ---------------------------------------------------------------------------

export interface UseComboReturn<T> {
  // Prop getters
  getInputProps: PropGetter<HTMLInputElement>;
  getToggleButtonProps: PropGetter<HTMLButtonElement>;
  getLabelProps: PropGetter<HTMLLabelElement>;
  getClearButtonProps: PropGetter<HTMLButtonElement>;
  getMenuProps: PropGetter<HTMLElement>;
  getItemProps: (
    options: { item: T; index: number } & Record<string, unknown>,
  ) => HTMLAttributes<HTMLLIElement> & Record<string, unknown>;
  getGroupProps: (
    options: { group: ComboGroup<T>; index: number } & Record<string, unknown>,
  ) => HTMLAttributes<HTMLElement> & Record<string, unknown>;
  getChevronProps: PropGetter<HTMLElement>;
  getTriggerProps: PropGetter<HTMLElement>;
  getControlProps: PropGetter<HTMLElement>;

  // State
  isOpen: boolean;
  inputValue: string;
  selectedItem: T | null;
  selectedItems: T[];
  highlightedIndex: number;
  filteredItems: T[];
  hasSelection: boolean;
  triggerLabel: string;
  isLoading: boolean;
  isEmpty: boolean;
  isError: boolean;
  error: Error | null;

  // Icons
  icons: IconSlots;
  chevronIcon: ReactNode;

  // Actions
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
  selectItem: (item: T) => void;
  removeItem: (item: T) => void;
  selectAll: () => void;
  clearSelection: () => void;
  setInputValue: (value: string) => void;
  reset: () => void;

  // Refs
  inputRef: RefObject<HTMLInputElement | null>;
  listboxRef: RefObject<HTMLElement | null>;
  triggerRef: RefObject<HTMLElement | null>;
}
