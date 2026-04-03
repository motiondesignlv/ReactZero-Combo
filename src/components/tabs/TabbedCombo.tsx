import { useState, useCallback, useRef, useMemo, useId } from 'react';
import { Combo } from '../Combo';
import type { ComboProps } from '../Combo';
import type { ReactNode, KeyboardEvent, RefObject } from 'react';

export interface TabConfig<T> {
  /** Unique tab identifier */
  id: string;
  /** Tab display label */
  label: string;
  /** Items belonging to this tab */
  items: T[];
  /** Optional icon for the tab */
  icon?: ReactNode;
  /** Optional badge (e.g. count) */
  badge?: ReactNode;
  /** Disable this tab */
  disabled?: boolean;
}

export interface TabbedComboProps<T>
  extends Omit<ComboProps<T>, 'items' | 'groups'> {
  /** Tab configuration with per-tab items */
  tabs: TabConfig<T>[];
  /** Default active tab ID (uncontrolled) */
  defaultActiveTab?: string;
  /** Active tab ID (controlled) */
  activeTab?: string;
  /** Callback when active tab changes */
  onTabChange?: (tabId: string) => void;
  /** Custom tab label renderer */
  renderTabLabel?: (tab: TabConfig<T>, isActive: boolean) => ReactNode;
}

/**
 * Combo with a tab strip inside the popover for categorized content.
 * Each tab filters to its own set of items.
 *
 * @example
 * ```tsx
 * <TabbedCombo
 *   tabs={[
 *     { id: 'fruits', label: 'Fruits', items: fruits },
 *     { id: 'vegetables', label: 'Vegetables', items: vegetables },
 *   ]}
 *   placeholder="Search food..."
 * />
 * ```
 */
export function TabbedCombo<T>(props: TabbedComboProps<T>) {
  const {
    tabs,
    defaultActiveTab,
    activeTab: controlledActiveTab,
    onTabChange,
    renderTabLabel,
    renderFooter,
    ...comboProps
  } = props;

  const baseId = useId();
  const tabListRef = useRef<HTMLDivElement>(null);

  // Active tab state (controlled or uncontrolled)
  const [internalActiveTab, setInternalActiveTab] = useState(
    () => defaultActiveTab ?? tabs[0]?.id ?? '',
  );

  const activeTabId =
    controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;

  const handleTabChange = useCallback(
    (tabId: string) => {
      if (controlledActiveTab === undefined) {
        setInternalActiveTab(tabId);
      }
      onTabChange?.(tabId);
    },
    [controlledActiveTab, onTabChange],
  );

  // Get items for the active tab
  const activeItems = useMemo(() => {
    const tab = tabs.find((t) => t.id === activeTabId);
    return tab?.items ?? [];
  }, [tabs, activeTabId]);

  // Tab keyboard navigation (Left/Right arrow)
  const handleTabKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const enabledTabs = tabs.filter((t) => !t.disabled);
      const currentIdx = enabledTabs.findIndex((t) => t.id === activeTabId);
      if (currentIdx === -1) return;

      let nextIdx = -1;
      if (e.key === 'ArrowRight') {
        nextIdx = (currentIdx + 1) % enabledTabs.length;
      } else if (e.key === 'ArrowLeft') {
        nextIdx = (currentIdx - 1 + enabledTabs.length) % enabledTabs.length;
      } else if (e.key === 'Home') {
        nextIdx = 0;
      } else if (e.key === 'End') {
        nextIdx = enabledTabs.length - 1;
      } else {
        return;
      }

      e.preventDefault();
      const nextTab = enabledTabs[nextIdx];
      handleTabChange(nextTab.id);

      // Focus the activated tab button
      const tabEl = tabListRef.current?.querySelector(
        `[data-tab-id="${nextTab.id}"]`,
      ) as HTMLButtonElement | null;
      tabEl?.focus();
    },
    [tabs, activeTabId, handleTabChange],
  );

  // Ctrl+Arrow from the input switches tabs without losing focus
  const handleInputKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;

      const enabledTabs = tabs.filter((t) => !t.disabled);
      const currentIdx = enabledTabs.findIndex((t) => t.id === activeTabId);
      if (currentIdx === -1) return;

      let nextIdx = -1;
      if (e.key === 'ArrowRight') {
        nextIdx = (currentIdx + 1) % enabledTabs.length;
      } else if (e.key === 'ArrowLeft') {
        nextIdx = (currentIdx - 1 + enabledTabs.length) % enabledTabs.length;
      } else {
        return;
      }

      e.preventDefault();
      handleTabChange(enabledTabs[nextIdx].id);
    },
    [tabs, activeTabId, handleTabChange],
  );

  return (
    <Combo<T>
      {...comboProps}
      items={activeItems}
      renderFooter={renderFooter}
      onInputKeyDown={handleInputKeyDown}
      renderListHeader={() => (
        <TabStrip
          tabs={tabs}
          activeTabId={activeTabId}
          baseId={baseId}
          tabListRef={tabListRef}
          onTabChange={handleTabChange}
          onKeyDown={handleTabKeyDown}
          renderTabLabel={renderTabLabel}
        />
      )}
    />
  );
}

// Internal TabStrip component
function TabStrip<T>({
  tabs,
  activeTabId,
  baseId,
  tabListRef,
  onTabChange,
  onKeyDown,
  renderTabLabel,
}: {
  tabs: TabConfig<T>[];
  activeTabId: string;
  baseId: string;
  tabListRef: RefObject<HTMLDivElement | null>;
  onTabChange: (tabId: string) => void;
  onKeyDown: (e: KeyboardEvent) => void;
  renderTabLabel?: (tab: TabConfig<T>, isActive: boolean) => ReactNode;
}) {
  return (
    <div
      ref={tabListRef as RefObject<HTMLDivElement>}
      className="rzero-combo-tabs"
      role="tablist"
      aria-label="Item categories"
      onMouseDown={(e) => e.preventDefault()}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`${baseId}-tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`${baseId}-panel-${tab.id}`}
            aria-disabled={tab.disabled || undefined}
            data-tab-id={tab.id}
            data-active={isActive || undefined}
            data-disabled={tab.disabled || undefined}
            className="rzero-combo-tab"
            tabIndex={isActive ? 0 : -1}
            onClick={() => {
              if (tab.disabled) return;
              onTabChange(tab.id);
            }}
            onKeyDown={onKeyDown}
          >
            {renderTabLabel ? (
              renderTabLabel(tab, isActive)
            ) : (
              <>
                {tab.icon && (
                  <span className="rzero-combo-tab-icon" aria-hidden="true">
                    {tab.icon}
                  </span>
                )}
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className="rzero-combo-tab-badge">{tab.badge}</span>
                )}
              </>
            )}
          </button>
        );
      })}
    </div>
  );
}
