import {
  useReducer,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import type {
  UseComboOptions,
  UseComboReturn,
  ComboState,
  ComboAction,
  ComboGroup,
} from '../types';
import {
  comboReducer,
  getInitialState,
  type ReducerContext,
} from '../core/stateMachine';
import { createKeyboardHandler } from '../core/keyboard';
import { useComboIds } from '../core/ids';
import { announce } from '../core/announce';
import { scrollIntoView } from '../core/scroll';
import { resolveIcons, resolveChevron } from '../icons/icons';
import {
  callAll,
  defaultItemToString,
  defaultItemToValue,
  mergeRefs,
} from '../core/utils';

export function useCombo<T>(
  options: UseComboOptions<T>,
): UseComboReturn<T> {
  const {
    items,
    itemToString: userItemToString,
    itemToValue: userItemToValue,
    mode = 'single',
    variant = 'input',
    filterFunction,
    closeOnSelect = mode === 'single',
    commitOnBlur = false,
    deselectionAllowed = true,
    disabled = false,
    readOnly = false,
    isItemDisabled: userIsItemDisabled,
    hideDisabled = false,
    disabledItemBehavior = 'skip',
    ariaLabel,
    ariaLabelledBy,
    icons: iconOverrides,
    chevronStyle = 'caret',
    onSelectedItemChange,
    onSelectedItemsChange,
    onIsOpenChange,
    onHighlightedIndexChange,
    onStateChange,
    onInputChange,
  } = options;

  const itemToString = userItemToString ?? defaultItemToString;
  const itemToValue = userItemToValue ?? defaultItemToValue;
  const isItemDisabled = userIsItemDisabled ?? (() => false);

  // IDs
  const ids = useComboIds(options.id);

  // Refs
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listboxRef = useRef<HTMLElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Reducer context
  const ctxRef = useRef<ReducerContext<T>>(null!);
  ctxRef.current = {
    items,
    itemToString,
    itemToValue,
    filterFunction,
    closeOnSelect,
    commitOnBlur,
    deselectionAllowed,
    isItemDisabled,
    disabledItemBehavior,
    hideDisabled,
    variant,
    mode,
    maxSelected: options.maxSelected,
  };

  // Reducer
  const [state, dispatch] = useReducer(
    (s: ComboState<T>, a: ComboAction<T>) =>
      comboReducer(s, a, ctxRef.current),
    options,
    getInitialState,
  );

  // Sync items when they change externally (e.g. tab switch in TabbedCombo)
  const prevItemsRef = useRef(items);
  useEffect(() => {
    if (prevItemsRef.current !== items) {
      prevItemsRef.current = items;
      dispatch({ type: 'SYNC_ITEMS' });
    }
  }, [items]);

  // Derived state
  const isOpen =
    state.status === 'OPEN_IDLE' || state.status === 'OPEN_HIGHLIGHTED';
  const hasSelection = mode === 'multi'
    ? state.selectedItems.length > 0
    : state.selectedItem != null;
  const triggerLabel = mode === 'multi'
    ? state.selectedItems.map(itemToString).join(', ')
    : state.selectedItem != null
      ? itemToString(state.selectedItem)
      : '';

  // Icons
  const icons = useMemo(
    () => resolveIcons(iconOverrides),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [iconOverrides],
  );
  const chevronIcon = useMemo(
    () => resolveChevron(chevronStyle, iconOverrides?.chevronDown),
    [chevronStyle, iconOverrides?.chevronDown],
  );

  // Keyboard handler — use ref-based approach to avoid stale closures
  const stateRef = useRef(state);
  stateRef.current = state;

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (disabled || readOnly) return;
      const handler = createKeyboardHandler<T>(dispatch, stateRef.current, {
        variant,
        commitOnBlur,
        mode,
      });
      handler(event);
    },
    [disabled, readOnly, variant, commitOnBlur, mode],
  );

  // Scroll into view on highlight change
  useEffect(() => {
    if (state.highlightedIndex >= 0) {
      scrollIntoView(listboxRef.current, state.highlightedIndex);
    }
  }, [state.highlightedIndex]);

  // Announce filtered results count
  const prevIsOpenRef = useRef(false);
  const prevFilteredLenRef = useRef(0);
  useEffect(() => {
    const wasOpen = prevIsOpenRef.current;
    const prevLen = prevFilteredLenRef.current;
    prevIsOpenRef.current = isOpen;
    prevFilteredLenRef.current = state.filteredItems.length;

    if (isOpen && (!wasOpen || prevLen !== state.filteredItems.length)) {
      const count = state.filteredItems.length;
      announce(
        count === 0
          ? 'No options available'
          : `${count} option${count !== 1 ? 's' : ''} available`,
      );
    }
  }, [isOpen, state.filteredItems.length]);

  // Fire callbacks on state changes
  const prevStateRef = useRef(state);
  useEffect(() => {
    const prev = prevStateRef.current;
    prevStateRef.current = state;

    if (prev.selectedItem !== state.selectedItem) {
      onSelectedItemChange?.(state.selectedItem);
      if (state.selectedItem) {
        announce(`${itemToString(state.selectedItem)} selected`);
      } else if (prev.selectedItem) {
        announce(`${itemToString(prev.selectedItem)} deselected`);
      }
    }

    if (prev.selectedItems !== state.selectedItems) {
      onSelectedItemsChange?.(state.selectedItems);
      // Announce additions and removals in multi-select
      if (state.selectedItems.length > prev.selectedItems.length) {
        const added = state.selectedItems[state.selectedItems.length - 1];
        if (added) {
          announce(`${itemToString(added)} selected, ${state.selectedItems.length} total`);
        }
      } else if (state.selectedItems.length < prev.selectedItems.length) {
        announce(`Item removed, ${state.selectedItems.length} selected`);
      }
    }

    const wasOpen =
      prev.status === 'OPEN_IDLE' || prev.status === 'OPEN_HIGHLIGHTED';
    if (wasOpen !== isOpen) {
      onIsOpenChange?.(isOpen);
    }

    if (prev.highlightedIndex !== state.highlightedIndex) {
      onHighlightedIndexChange?.(state.highlightedIndex);
    }

    if (prev.inputValue !== state.inputValue) {
      onInputChange?.(state.inputValue);
    }

    onStateChange?.(state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // ---- PROP GETTERS ----

  const getLabelProps = useCallback(
    (userProps: Record<string, unknown> = {}) => ({
      id: ids.label,
      htmlFor: ids.input,
      ...userProps,
    }),
    [ids],
  );

  const getInputProps = useCallback(
    (userProps: Record<string, unknown> = {}) => ({
      id: ids.input,
      role: 'combobox' as const,
      'aria-expanded': isOpen,
      'aria-haspopup': 'listbox' as const,
      'aria-controls': ids.listbox,
      'aria-autocomplete': (variant === 'select' ? 'none' : 'list') as
        | 'none'
        | 'list',
      'aria-activedescendant':
        state.highlightedIndex >= 0
          ? ids.item(state.highlightedIndex)
          : undefined,
      'aria-labelledby': ariaLabelledBy ?? ids.label,
      'aria-label': ariaLabel,
      'aria-disabled': disabled ? true : undefined,
      readOnly: readOnly || variant === 'select',
      disabled: disabled === true,
      autoComplete: 'off',
      value: state.inputValue,
      ...userProps,
      onChange: callAll(
        userProps.onChange as (() => void) | undefined,
        (e: React.ChangeEvent<HTMLInputElement>) => {
          if (disabled || readOnly) return;
          dispatch({ type: 'INPUT_CHANGE', value: e.target.value });
        },
      ),
      onKeyDown: callAll(
        userProps.onKeyDown as (() => void) | undefined,
        handleKeyDown,
      ),
      onFocus: callAll(
        userProps.onFocus as (() => void) | undefined,
        () => {
          if (disabled) return;
          dispatch({ type: 'FOCUS' });
        },
      ),
      onBlur: callAll(
        userProps.onBlur as (() => void) | undefined,
        () => {
          dispatch({ type: 'BLUR' });
        },
      ),
      onClick: callAll(
        userProps.onClick as (() => void) | undefined,
        () => {
          if (disabled || readOnly) return;
          if (!isOpen) dispatch({ type: 'OPEN_MENU' });
        },
      ),
      ref: mergeRefs(
        inputRef,
        userProps.ref as React.RefObject<HTMLInputElement | null> | undefined,
      ),
    }),
    [
      ids,
      isOpen,
      state.highlightedIndex,
      state.inputValue,
      ariaLabel,
      ariaLabelledBy,
      disabled,
      readOnly,
      variant,
      handleKeyDown,
    ],
  );

  const getToggleButtonProps = useCallback(
    (userProps: Record<string, unknown> = {}) => ({
      id: ids.toggleButton,
      type: 'button' as const,
      'aria-label': isOpen ? 'Close options' : 'Open options',
      'aria-expanded': isOpen,
      'aria-haspopup': 'listbox' as const,
      'aria-controls': ids.listbox,
      tabIndex: -1,
      'aria-disabled': disabled ? true : undefined,
      ...userProps,
      onMouseDown: callAll(
        userProps.onMouseDown as (() => void) | undefined,
        (e: React.MouseEvent) => e.preventDefault(), // prevent input blur
      ),
      onClick: callAll(
        userProps.onClick as (() => void) | undefined,
        () => {
          if (disabled || readOnly) return;
          dispatch({ type: 'TOGGLE_MENU' });
          inputRef.current?.focus();
        },
      ),
    }),
    [ids, isOpen, disabled, readOnly],
  );

  const getClearButtonProps = useCallback(
    (userProps: Record<string, unknown> = {}) => ({
      id: ids.clearButton,
      type: 'button' as const,
      'aria-label': 'Clear selection',
      tabIndex: -1,
      ...userProps,
      onMouseDown: callAll(
        userProps.onMouseDown as (() => void) | undefined,
        (e: React.MouseEvent) => e.preventDefault(), // prevent input blur
      ),
      onClick: callAll(
        userProps.onClick as (() => void) | undefined,
        () => {
          if (disabled || readOnly) return;
          dispatch({ type: 'CLEAR_SELECTION' });
          inputRef.current?.focus();
        },
      ),
    }),
    [ids, disabled, readOnly],
  );

  const getMenuProps = useCallback(
    (userProps: Record<string, unknown> = {}) => ({
      id: ids.listbox,
      role: 'listbox' as const,
      'aria-labelledby': ariaLabelledBy ?? ids.label,
      'aria-label': ariaLabel,
      'aria-multiselectable': mode === 'multi' ? true : undefined,
      ...userProps,
      onMouseDown: callAll(
        userProps.onMouseDown as (() => void) | undefined,
        (e: React.MouseEvent) => e.preventDefault(), // prevent input blur
      ),
      ref: mergeRefs(
        listboxRef,
        userProps.ref as React.RefObject<HTMLElement | null> | undefined,
      ),
    }),
    [ids, ariaLabel, ariaLabelledBy, mode],
  );

  const getItemProps = useCallback(
    ({
      item,
      index,
      variant: itemVariant,
      ...userProps
    }: { item: T; index: number; variant?: string } & Record<
      string,
      unknown
    >) => {
      const isSelected = mode === 'multi'
        ? state.selectedItems.some((si) => itemToValue(si) === itemToValue(item))
        : state.selectedItem != null &&
          itemToValue(state.selectedItem) === itemToValue(item);
      const isHighlighted = state.highlightedIndex === index;
      const itemIsDisabled = isItemDisabled(item);

      const useChecked = itemVariant === 'checkbox' || itemVariant === 'radio';

      return {
        id: ids.item(index),
        role: 'option' as const,
        'aria-selected': isSelected,
        'aria-checked': useChecked ? isSelected : undefined,
        'aria-disabled': itemIsDisabled || undefined,
        'data-rzero-index': index,
        'data-highlighted': isHighlighted || undefined,
        'data-selected': isSelected || undefined,
        'data-disabled': itemIsDisabled || undefined,
        'data-variant': itemVariant || undefined,
        ...userProps,
        onClick: callAll(
          userProps?.onClick as (() => void) | undefined,
          () => {
            if (itemIsDisabled) return;
            dispatch({ type: 'SELECT_ITEM', item });
          },
        ),
        onMouseEnter: callAll(
          userProps?.onMouseEnter as (() => void) | undefined,
          () => {
            if (itemIsDisabled && disabledItemBehavior === 'skip') return;
            dispatch({ type: 'HIGHLIGHT_ITEM', index });
          },
        ),
        onMouseLeave: callAll(
          userProps?.onMouseLeave as (() => void) | undefined,
          () => {
            dispatch({ type: 'HIGHLIGHT_ITEM', index: -1 });
          },
        ),
      };
    },
    [
      state.selectedItem,
      state.selectedItems,
      state.highlightedIndex,
      ids,
      itemToValue,
      isItemDisabled,
      disabledItemBehavior,
      mode,
    ],
  );

  const getGroupProps = useCallback(
    ({
      group,
      index,
      ...userProps
    }: {
      group: ComboGroup<T>;
      index: number;
    } & Record<string, unknown>) => ({
      role: 'group' as const,
      'aria-label': group.label,
      id: ids.group(index),
      'data-disabled': group.disabled || undefined,
      ...userProps,
    }),
    [ids],
  );

  const getChevronProps = useCallback(
    (userProps: Record<string, unknown> = {}) => ({
      'data-rzero-chevron': '',
      'aria-hidden': true as const,
      ...userProps,
    }),
    [],
  );

  const getTriggerProps = useCallback(
    (userProps: Record<string, unknown> = {}) => ({
      role: 'combobox' as const,
      'aria-expanded': isOpen,
      'aria-haspopup': 'listbox' as const,
      'aria-controls': ids.listbox,
      'aria-activedescendant':
        state.highlightedIndex >= 0
          ? ids.item(state.highlightedIndex)
          : undefined,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-disabled': disabled ? true : undefined,
      'data-rzero-trigger': '',
      'data-disabled': disabled || undefined,
      'data-readonly': readOnly || undefined,
      'data-loading': disabled === 'loading' || undefined,
      tabIndex: 0,
      ...userProps,
      onKeyDown: callAll(
        userProps.onKeyDown as (() => void) | undefined,
        handleKeyDown,
      ),
      onClick: callAll(
        userProps.onClick as (() => void) | undefined,
        () => {
          if (disabled || readOnly) return;
          dispatch({ type: 'TOGGLE_MENU' });
        },
      ),
      onFocus: callAll(
        userProps.onFocus as (() => void) | undefined,
        () => {
          if (disabled) return;
          dispatch({ type: 'FOCUS' });
        },
      ),
      onBlur: callAll(
        userProps.onBlur as (() => void) | undefined,
        () => {
          dispatch({ type: 'BLUR' });
        },
      ),
      ref: mergeRefs(
        triggerRef,
        userProps.ref as React.RefObject<HTMLElement | null> | undefined,
      ),
    }),
    [
      ids,
      isOpen,
      state.highlightedIndex,
      ariaLabel,
      ariaLabelledBy,
      disabled,
      readOnly,
      handleKeyDown,
    ],
  );

  // ---- IMPERATIVE ACTIONS ----
  const openMenu = useCallback(() => dispatch({ type: 'OPEN_MENU' }), []);
  const closeMenu = useCallback(() => dispatch({ type: 'CLOSE_MENU' }), []);
  const toggleMenu = useCallback(
    () => dispatch({ type: 'TOGGLE_MENU' }),
    [],
  );
  const selectItem = useCallback(
    (item: T) => dispatch({ type: 'SELECT_ITEM', item }),
    [],
  );
  const removeItem = useCallback(
    (item: T) => dispatch({ type: 'DESELECT_ITEM', item }),
    [],
  );
  const selectAll = useCallback(
    () => dispatch({ type: 'SELECT_ALL' }),
    [],
  );
  const clearSelection = useCallback(
    () => dispatch({ type: 'CLEAR_SELECTION' }),
    [],
  );
  const setInputValue = useCallback(
    (v: string) => dispatch({ type: 'INPUT_CHANGE', value: v }),
    [],
  );
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  return {
    // Prop getters
    getInputProps: getInputProps as UseComboReturn<T>['getInputProps'],
    getToggleButtonProps:
      getToggleButtonProps as UseComboReturn<T>['getToggleButtonProps'],
    getLabelProps: getLabelProps as UseComboReturn<T>['getLabelProps'],
    getClearButtonProps:
      getClearButtonProps as UseComboReturn<T>['getClearButtonProps'],
    getMenuProps: getMenuProps as UseComboReturn<T>['getMenuProps'],
    getItemProps,
    getGroupProps,
    getChevronProps: getChevronProps as UseComboReturn<T>['getChevronProps'],
    getTriggerProps:
      getTriggerProps as UseComboReturn<T>['getTriggerProps'],
    getControlProps:
      getTriggerProps as UseComboReturn<T>['getControlProps'],

    // State
    isOpen,
    inputValue: state.inputValue,
    selectedItem: state.selectedItem,
    selectedItems: state.selectedItems,
    highlightedIndex: state.highlightedIndex,
    filteredItems: state.filteredItems,
    hasSelection,
    triggerLabel,
    isLoading: state.isLoading,
    isEmpty: isOpen && state.filteredItems.length === 0,
    isError: state.error != null,
    error: state.error,

    // Icons
    icons,
    chevronIcon,

    // Actions
    openMenu,
    closeMenu,
    toggleMenu,
    selectItem,
    removeItem,
    selectAll,
    clearSelection,
    setInputValue,
    reset,

    // Refs
    inputRef,
    listboxRef,
    triggerRef,
  };
}
