import { useState } from 'react';
import { Combo } from '@reactzero/combo';
import { CustomItem } from '@reactzero/combo/slots';
import { useTheme } from '../context/ThemeContext';
import { DemoCard } from '../shared/DemoCard';
import { users, environments, mailFolders, actionItems } from '../shared/data';
import type { UserItem, ActionItem } from '../shared/data';

const userComboCode = `<Combo
  items={users}
  itemToString={(item) => item?.name ?? ''}
  placeholder="Search people..."
  renderTrigger={({ getInputProps, getToggleButtonProps, getClearButtonProps,
    getChevronProps, chevronIcon, selectedItem, hasSelection, icons }) => (
    <div className="rzero-combo-trigger">
      {selectedItem && (
        <Avatar initials={selectedItem.initials} color={selectedItem.color} />
      )}
      <input {...getInputProps({
        placeholder: hasSelection ? selectedItem?.name : 'Search people...',
      })} />
      {hasSelection && (
        <button {...getClearButtonProps()}>{icons.clear}</button>
      )}
      <button {...getToggleButtonProps()}>
        <span {...getChevronProps()}>{chevronIcon}</span>
      </button>
    </div>
  )}
  renderItem={({ item }) => (
    <CustomItem
      icon={<Avatar initials={item.initials} color={item.color} />}
      title={item.name}
      description={item.role}
    />
  )}
/>`;

const statusItemsCode = `<Combo
  items={environments}
  itemToString={(item) => item?.label ?? ''}
  placeholder="Select environment..."
  renderItem={({ item }) => (
    <CustomItem
      icon={<StatusDot color={item.color} />}
      title={item.label}
      meta={item.status}
    />
  )}
/>`;

const badgeItemsCode = `<Combo
  items={mailFolders}
  itemToString={(item) => item?.label ?? ''}
  placeholder="Select folder..."
  renderItem={({ item }) => (
    <CustomItem
      title={item.label}
      badge={item.count}
    />
  )}
/>`;

const actionItemsCode = `<Combo
  items={actions}
  itemToString={(item) => item?.label ?? ''}
  placeholder="Search actions..."
  renderItem={({ item }) => (
    <CustomItem
      title={item.label}
      description={item.description}
      meta={
        <button onClick={() => runAction(item)}>
          {item.actionLabel}
        </button>
      }
    />
  )}
/>`;

export function RichContent() {
  const { theme } = useTheme();
  const [runningAction, setRunningAction] = useState<string | null>(null);
  const [completedAction, setCompletedAction] = useState<string | null>(null);

  return (
    <div className="demo-grid-2">
      <DemoCard title="User Combo" code={userComboCode}>
        <div style={{ width: '100%' }}>
          <Combo<UserItem>
            items={users}
            itemToString={(item) => item?.name ?? ''}
            itemToValue={(item) => item.name}
            placeholder="Search people..."
            theme={theme}
            renderTrigger={({ getInputProps, getToggleButtonProps, getClearButtonProps, getChevronProps, chevronIcon, selectedItem, hasSelection, icons }) => (
              <div className="rzero-combo-trigger">
                {selectedItem && (
                  <span style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: selectedItem.color, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 600, flexShrink: 0,
                  }}>
                    {selectedItem.initials}
                  </span>
                )}
                <input {...getInputProps({
                  placeholder: hasSelection ? selectedItem?.name : 'Search people...',
                } as Record<string, unknown>)} />
                {hasSelection && (
                  <button {...getClearButtonProps()}>{icons.clear}</button>
                )}
                <button {...getToggleButtonProps()}>
                  <span {...getChevronProps()}>{chevronIcon}</span>
                </button>
              </div>
            )}
            renderItem={({ item }) => (
              <CustomItem
                icon={
                  <span style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: item.color, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 600,
                  }}>
                    {item.initials}
                  </span>
                }
                title={item.name}
                description={item.role}
              />
            )}
          />
        </div>
      </DemoCard>

      <DemoCard title="Status Items" code={statusItemsCode}>
        <div style={{ width: '100%' }}>
          <Combo
            items={environments}
            itemToString={(item) => item?.label ?? ''}
            itemToValue={(item) => item.value}
            placeholder="Select environment..."
            theme={theme}
            renderItem={({ item }) => (
              <CustomItem
                icon={
                  <span style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: item.color,
                  }} />
                }
                title={item.label}
                meta={item.status}
              />
            )}
          />
        </div>
      </DemoCard>

      <DemoCard title="Badge Items" code={badgeItemsCode}>
        <div style={{ width: '100%' }}>
          <Combo
            items={mailFolders}
            itemToString={(item) => item?.label ?? ''}
            itemToValue={(item) => item.value}
            placeholder="Select folder..."
            theme={theme}
            renderItem={({ item }) => (
              <CustomItem
                title={item.label}
                badge={item.count > 0 ? item.count : undefined}
              />
            )}
          />
        </div>
      </DemoCard>

      <DemoCard title="Action Items" description="Click Run to execute an action with loading feedback" code={actionItemsCode}>
        <div style={{ width: '100%' }}>
          <Combo<ActionItem>
            items={actionItems}
            itemToString={(item) => item?.label ?? ''}
            itemToValue={(item) => item.value}
            placeholder="Search actions..."
            theme={theme}
            renderItem={({ item }) => {
              const isRunning = runningAction === item.value;
              const isComplete = completedAction === item.value;
              return (
                <CustomItem
                  title={item.label}
                  description={item.description}
                  meta={
                    <button
                      style={{
                        padding: '2px 8px',
                        borderRadius: 4,
                        border: `1px solid ${isRunning ? '#93c5fd' : isComplete ? '#86efac' : '#d1d5db'}`,
                        background: isRunning ? '#eff6ff' : isComplete ? '#f0fdf4' : 'transparent',
                        fontSize: 11,
                        cursor: isRunning ? 'wait' : 'pointer',
                        whiteSpace: 'nowrap',
                        minWidth: 36,
                        transition: 'all 0.15s ease',
                      }}
                      disabled={isRunning}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={(e) => {
                        e.stopPropagation();
                        setRunningAction(item.value);
                        setCompletedAction(null);
                        setTimeout(() => {
                          setRunningAction(null);
                          setCompletedAction(item.value);
                          setTimeout(() => setCompletedAction(null), 1500);
                        }, 1200);
                      }}
                    >
                      {isRunning ? '\u23F3' : isComplete ? '\u2713 Done' : item.actionLabel}
                    </button>
                  }
                />
              );
            }}
          />
        </div>
      </DemoCard>
    </div>
  );
}
