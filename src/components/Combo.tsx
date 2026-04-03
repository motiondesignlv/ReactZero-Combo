import React, { useMemo, useRef } from 'react';
import { useCombo } from '../hooks/useCombo';
import { usePosition } from '../hooks/usePosition';
import { Portal } from './Portal';
import { LiveRegion } from './LiveRegion';
import type {
  UseComboOptions,
  UseComboReturn,
  ComboGroup,
  IconSlots,
} from '../types';

export interface ComboClassNames {
  root?: string;
  label?: string;
  input?: string;
  trigger?: string;
  popover?: string;
  list?: string;
  item?: string;
  itemSelected?: string;
  itemHighlighted?: string;
  itemDisabled?: string;
  clearButton?: string;
  toggleButton?: string;
  groupHeader?: string;
  loadingState?: string;
  emptyState?: string;
  errorState?: string;
  footer?: string;
}

export type ItemVariant = 'default' | 'checkbox' | 'radio';

export interface ComboProps<T> extends UseComboOptions<T> {
  placeholder?: string;
  label?: string;
  theme?: 'default' | 'dark' | 'high-contrast' | 'system';
  itemVariant?: ItemVariant;
  renderItem?: (props: {
    item: T;
    index: number;
    isHighlighted: boolean;
    isSelected: boolean;
    isDisabled: boolean;
  }) => React.ReactNode;
  renderEmpty?: () => React.ReactNode;
  renderLoading?: () => React.ReactNode;
  renderError?: (props: { error: Error | null }) => React.ReactNode;
  renderFooter?: (props: {
    selectedItem: T | null;
    selectedItems: T[];
    closeMenu: () => void;
    clearSelection: () => void;
  }) => React.ReactNode;
  renderTrigger?: (props: {
    getInputProps: UseComboReturn<T>['getInputProps'];
    getToggleButtonProps: UseComboReturn<T>['getToggleButtonProps'];
    getTriggerProps: UseComboReturn<T>['getTriggerProps'];
    getClearButtonProps: UseComboReturn<T>['getClearButtonProps'];
    getChevronProps: UseComboReturn<T>['getChevronProps'];
    selectedItem: T | null;
    hasSelection: boolean;
    triggerLabel: string;
    isOpen: boolean;
    icons: IconSlots;
    chevronIcon: React.ReactNode;
  }) => React.ReactNode;
  renderGroupHeader?: (props: {
    group: ComboGroup<T>;
    index: number;
  }) => React.ReactNode;
  renderListHeader?: () => React.ReactNode;
  hintText?: string;
  errorText?: string;
  minSelected?: number;
  onInputKeyDown?: (e: React.KeyboardEvent) => void;
  classNames?: ComboClassNames;
}

function cx(...args: (string | false | null | undefined)[]): string {
  return args.filter(Boolean).join(' ');
}

export function Combo<T>(props: ComboProps<T>) {
  const {
    placeholder,
    label,
    theme,
    itemVariant,
    renderItem,
    renderEmpty,
    renderLoading,
    renderError,
    renderFooter,
    renderTrigger,
    renderGroupHeader,
    renderListHeader,
    hintText,
    errorText,
    minSelected,
    onInputKeyDown,
    classNames = {},
    ...hookOptions
  } = props;

  // When groups are provided, flatten into items for the hook
  const flatItems = useMemo(() => {
    if (hookOptions.groups && !hookOptions.items?.length) {
      return hookOptions.groups.flatMap((g) => g.items);
    }
    return hookOptions.items;
  }, [hookOptions.groups, hookOptions.items]);

  const combo = useCombo({ ...hookOptions, items: flatItems });
  const {
    isOpen,
    selectedItem,
    highlightedIndex,
    filteredItems,
    hasSelection,
    triggerLabel,
    isLoading,
    isError,
    error,
    getLabelProps,
    getInputProps,
    getToggleButtonProps,
    getClearButtonProps,
    getMenuProps,
    getItemProps,
    getGroupProps,
    getChevronProps,
    getTriggerProps,
    icons,
    chevronIcon,
    inputRef,
    listboxRef,
    triggerRef,
    inputValue,
    openMenu,
    closeMenu,
    clearSelection,
    removeItem,
    selectedItems,
  } = combo;

  const itemToString =
    hookOptions.itemToString ??
    ((item: T | null) => (item != null ? String(item) : ''));
  const itemToValue =
    hookOptions.itemToValue ??
    ((item: T) => {
      if (
        typeof item === 'object' &&
        item != null &&
        'value' in (item as object)
      )
        return (item as Record<string, unknown>).value as string | number;
      return String(item);
    });
  const isItemDisabled = hookOptions.isItemDisabled ?? (() => false);
  const isSelectVariant = hookOptions.variant === 'select';
  const isMultiMode = hookOptions.mode === 'multi';
  const hasError = isError || !!errorText;

  // Stable ref for the multi-select trigger container so the popover
  // anchors to the outer div rather than the input (which shifts as chips wrap).
  const multiTriggerRef = useRef<HTMLDivElement>(null);

  const positionTriggerRef = isSelectVariant
    ? triggerRef
    : isMultiMode
      ? multiTriggerRef
      : inputRef;

  const position = usePosition({
    triggerRef: positionTriggerRef,
    listboxRef,
    isOpen,
  });

  const liveMessage = useMemo(() => {
    if (!isOpen) return '';
    if (isLoading) return 'Loading options...';
    const count = filteredItems.length;
    return count === 0
      ? 'No options available'
      : `${count} option${count !== 1 ? 's' : ''} available`;
  }, [isOpen, isLoading, filteredItems.length]);

  const themeAttr = theme ? { 'data-rzero-theme': theme } : {};
  const isDisabled = hookOptions.disabled === true;

  // Build a value → filteredItems index map for grouped rendering
  const valueToIndex = useMemo(() => {
    const map = new Map<string | number, number>();
    filteredItems.forEach((item, index) => {
      map.set(itemToValue(item), index);
    });
    return map;
  }, [filteredItems, itemToValue]);

  // Compute grouped items with global indices
  const groupedItems = useMemo(() => {
    if (!hookOptions.groups) return null;
    return hookOptions.groups
      .map((group, groupIdx) => {
        const items = group.items
          .map((item) => ({
            item,
            globalIndex: valueToIndex.get(itemToValue(item)),
          }))
          .filter(
            (entry): entry is { item: T; globalIndex: number } =>
              entry.globalIndex !== undefined,
          );
        return { group, groupIdx, items };
      })
      .filter((g) => g.items.length > 0);
  }, [hookOptions.groups, valueToIndex, itemToValue]);

  // Shared item renderer

  function renderItemLi(item: T, index: number) {
    const isHighlighted = highlightedIndex === index;
    const isSelected = isMultiMode
      ? selectedItems.some((si: T) => itemToValue(si) === itemToValue(item))
      : selectedItem != null &&
        itemToValue(selectedItem) === itemToValue(item);
    const itemDisabled = isItemDisabled(item);

    const variantForItem =
      itemVariant && itemVariant !== 'default' ? itemVariant : undefined;

    if (renderItem) {
      return (
        <li
          key={index}
          {...getItemProps({ item, index, variant: variantForItem })}
          className={cx(
            'rzero-combo-item',
            classNames.item,
            isHighlighted && classNames.itemHighlighted,
            isSelected && classNames.itemSelected,
            itemDisabled && classNames.itemDisabled,
          )}
        >
          {renderItem({
            item,
            index,
            isHighlighted,
            isSelected,
            isDisabled: itemDisabled,
          })}
        </li>
      );
    }

    return (
      <li
        key={index}
        {...getItemProps({ item, index, variant: variantForItem })}
        className={cx(
          'rzero-combo-item',
          classNames.item,
          isHighlighted && classNames.itemHighlighted,
          isSelected && classNames.itemSelected,
          itemDisabled && classNames.itemDisabled,
        )}
      >
        <span>{itemToString(item)}</span>
        {isSelected && !variantForItem && (
          <span className="rzero-combo-check" aria-hidden="true">
            {icons.check}
          </span>
        )}
      </li>
    );
  }

  // Default trigger (input variant)
  function renderDefaultTrigger() {
    if (isMultiMode) {
      return (
        <div
          ref={multiTriggerRef}
          className={cx('rzero-combo-trigger', 'rzero-combo-trigger--multi', classNames.trigger)}
          data-rzero-trigger=""
          data-disabled={isDisabled || undefined}
          data-readonly={hookOptions.readOnly || undefined}
          data-loading={hookOptions.disabled === 'loading' || undefined}
          data-error={hasError || undefined}
          onClick={(e) => {
            if (isDisabled || hookOptions.readOnly) return;
            // Only handle clicks on the container itself, not on input/buttons
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'BUTTON' || target.closest('button')) return;
            inputRef.current?.focus();
            if (!isOpen) openMenu();
          }}
          onMouseDown={(e) => {
            // Prevent blur when clicking the container (not input)
            const target = e.target as HTMLElement;
            if (target.tagName !== 'INPUT') {
              e.preventDefault();
            }
          }}
        >
          <div className="rzero-combo-trigger-content">
            {selectedItems.map((item: T) => (
              <span className="rzero-combo-chip" key={String(itemToValue(item))}>
                <span className="rzero-combo-chip-label">{itemToString(item)}</span>
                {!isDisabled && !hookOptions.readOnly && (
                  <button
                    type="button"
                    className="rzero-combo-chip-remove"
                    aria-label={`Remove ${itemToString(item)}`}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(item);
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </span>
            ))}
            <input
              {...getInputProps({
                placeholder: selectedItems.length === 0 ? placeholder : '',
                className: classNames.input,
                onKeyDown: onInputKeyDown,
              } as Record<string, unknown>)}
            />
          </div>

          <div className="rzero-combo-trigger-actions">
            {hasSelection && !isDisabled && !hookOptions.readOnly && (
              <button
                {...getClearButtonProps({
                  className: classNames.clearButton,
                } as Record<string, unknown>)}
              >
                {icons.clear}
              </button>
            )}

            <button
              {...getToggleButtonProps({
                className: classNames.toggleButton,
              } as Record<string, unknown>)}
            >
              <span {...getChevronProps()}>{chevronIcon}</span>
            </button>
          </div>
        </div>
      );
    }

    const hasHiddenSelection = hasSelection && isOpen && inputValue !== triggerLabel;

    return (
      <div
        className={cx('rzero-combo-trigger', classNames.trigger)}
        data-rzero-trigger=""
        data-disabled={isDisabled || undefined}
        data-readonly={hookOptions.readOnly || undefined}
        data-loading={hookOptions.disabled === 'loading' || undefined}
        data-error={hasError || undefined}
        data-has-hidden-selection={hasHiddenSelection || undefined}
      >
        <input
          {...getInputProps({
            placeholder: hasSelection ? triggerLabel : placeholder,
            className: classNames.input,
            onKeyDown: onInputKeyDown,
          } as Record<string, unknown>)}
        />

        {hasSelection && !isDisabled && !hookOptions.readOnly && (
          <button
            {...getClearButtonProps({
              className: classNames.clearButton,
            } as Record<string, unknown>)}
          >
            {icons.clear}
          </button>
        )}

        <button
          {...getToggleButtonProps({
            className: classNames.toggleButton,
          } as Record<string, unknown>)}
        >
          <span {...getChevronProps()}>{chevronIcon}</span>
        </button>
      </div>
    );
  }

  // Select variant trigger
  function renderSelectTrigger() {
    return (
      <button
        {...getTriggerProps({
          className: cx('rzero-combo-select-trigger', classNames.trigger),
          'data-error': hasError || undefined,
        } as Record<string, unknown>)}
      >
        <span className="rzero-combo-select-value">
          {hasSelection ? triggerLabel : placeholder || 'Select...'}
        </span>
        <span {...getChevronProps()}>{chevronIcon}</span>
      </button>
    );
  }

  return (
    <div
      className={cx('rzero-combo', classNames.root)}
      {...themeAttr}
      data-rzero-root=""
    >
      {/* Label */}
      {label && (
        <label
          {...getLabelProps({
            className: cx('rzero-combo-label', classNames.label),
          } as Record<string, unknown>)}
        >
          {label}
        </label>
      )}

      {/* Trigger */}
      {renderTrigger
        ? renderTrigger({
            getInputProps,
            getToggleButtonProps,
            getTriggerProps,
            getClearButtonProps,
            getChevronProps,
            selectedItem,
            hasSelection,
            triggerLabel,
            isOpen,
            icons,
            chevronIcon,
          })
        : isSelectVariant
          ? renderSelectTrigger()
          : renderDefaultTrigger()}

      {/* Meta row: hint/error text + selection count */}
      {(errorText || hintText || (isMultiMode && (minSelected != null || hookOptions.maxSelected != null))) && (
        <div className="rzero-combo-meta">
          {errorText ? (
            <span className="rzero-combo-error-text">{errorText}</span>
          ) : hintText ? (
            <span className="rzero-combo-hint">{hintText}</span>
          ) : (
            <span />
          )}
          {isMultiMode && (minSelected != null || hookOptions.maxSelected != null) && (
            <span
              className="rzero-combo-selection-count"
              data-warning={
                (minSelected != null && selectedItems.length < minSelected) ||
                (hookOptions.maxSelected != null && selectedItems.length >= hookOptions.maxSelected)
                  ? ''
                  : undefined
              }
            >
              {selectedItems.length}
              {hookOptions.maxSelected != null ? ` / ${hookOptions.maxSelected}` : ''}
              {minSelected != null && selectedItems.length < minSelected
                ? ` \u00B7 min ${minSelected}`
                : ''}
            </span>
          )}
        </div>
      )}

      {/* Popover */}
      <Portal
        disabled={hookOptions.disablePortal}
        target={hookOptions.portalTarget}
      >
        <ul
          {...getMenuProps({
            className: cx('rzero-combo-list', classNames.list),
            style: isOpen
              ? ({
                  position: 'absolute',
                  top: position.top,
                  left: position.left,
                  width: position.width,
                  maxHeight: position.maxHeight,
                  overflow: 'auto',
                  zIndex: 'var(--rzero-combo-z-index, 9999)',
                  margin: 0,
                } as React.CSSProperties)
              : ({ display: 'none' } as React.CSSProperties),
          } as Record<string, unknown>)}
          data-state={isOpen ? 'open' : 'closed'}
          data-placement={position.placement}
          hidden={!isOpen}
        >
          {/* List header (e.g. tab strip) */}
          {isOpen && renderListHeader && (
            <li role="presentation">
              {renderListHeader()}
            </li>
          )}

          {/* Loading */}
          {isOpen && isLoading && (
            <li
              role="presentation"
              className={cx('rzero-combo-loading', classNames.loadingState)}
            >
              {renderLoading ? renderLoading() : 'Loading...'}
            </li>
          )}

          {/* Error */}
          {isOpen && !isLoading && isError && renderError && (
            <li
              role="presentation"
              className={cx('rzero-combo-error', classNames.errorState)}
            >
              {renderError({ error })}
            </li>
          )}

          {/* Empty */}
          {isOpen &&
            !isLoading &&
            !isError &&
            filteredItems.length === 0 && (
              <li
                role="presentation"
                className={cx('rzero-combo-empty', classNames.emptyState)}
              >
                {renderEmpty ? renderEmpty() : 'No results found'}
              </li>
            )}

          {/* Items — grouped rendering */}
          {isOpen &&
            !isLoading &&
            !isError &&
            groupedItems &&
            groupedItems.map(({ group, groupIdx, items }) => (
              <li key={`group-${groupIdx}`} role="presentation">
                <div
                  {...getGroupProps({ group, index: groupIdx })}
                  className={cx(
                    'rzero-combo-group-header',
                    classNames.groupHeader,
                  )}
                >
                  {renderGroupHeader
                    ? renderGroupHeader({ group, index: groupIdx })
                    : group.label}
                </div>
                <ul role="group" aria-label={group.label} style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {items.map(({ item, globalIndex }) =>
                    renderItemLi(item, globalIndex),
                  )}
                </ul>
              </li>
            ))}

          {/* Items — flat rendering (no groups) */}
          {isOpen &&
            !isLoading &&
            !isError &&
            !groupedItems &&
            filteredItems.map((item, index) => renderItemLi(item, index))}

          {/* Footer */}
          {isOpen && renderFooter && (
            <li
              role="presentation"
              className={cx('rzero-combo-footer', classNames.footer)}
            >
              {renderFooter({
                selectedItem,
                selectedItems,
                closeMenu,
                clearSelection,
              })}
            </li>
          )}
        </ul>
      </Portal>

      {/* Live region */}
      <LiveRegion message={liveMessage} />
    </div>
  );
}
