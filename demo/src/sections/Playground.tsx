import { useReducer, useState } from 'react';
import { Combo } from '@reactzero/combo';
import { CheckboxItem, FooterActions, CustomItem } from '@reactzero/combo/slots';
import { useTheme } from '../context/ThemeContext';
import { ControlPanel, type Control } from '../shared/ControlPanel';
import { CodeBlock } from '../shared/CodeBlock';
import { fruits, richFruits, actionItems } from '../shared/data';
import type { RichFruit, ActionItem } from '../shared/data';

interface PlaygroundState {
  variant: string;
  chevronStyle: string;
  itemVariant: string;
  mode: string;
  footer: string;
  header: string;
  label: string;
  placeholder: string;
  disabled: boolean;
  readOnly: boolean;
  deselectionAllowed: boolean;
  closeOnSelect: boolean;
}

const initial: PlaygroundState = {
  variant: 'input',
  chevronStyle: 'caret',
  itemVariant: 'default',
  mode: 'single',
  footer: 'none',
  header: 'none',
  label: 'Favorite Fruit',
  placeholder: 'Search fruits...',
  disabled: false,
  readOnly: false,
  deselectionAllowed: true,
  closeOnSelect: true,
};

type Action = { type: 'set'; key: string; value: unknown };

function reducer(state: PlaygroundState, action: Action): PlaygroundState {
  const next = { ...state, [action.key]: action.value };
  // Auto-adjust when switching to multi mode
  if (action.key === 'mode' && action.value === 'multi') {
    next.closeOnSelect = false;
    if (next.itemVariant === 'default') next.itemVariant = 'checkbox';
    if (next.itemVariant === 'radio') next.itemVariant = 'checkbox';
  }
  if (action.key === 'mode' && action.value === 'single') {
    next.closeOnSelect = true;
  }
  return next;
}

function generateCode(s: PlaygroundState): string {
  const lines = ['<Combo'];
  if (s.itemVariant === 'rich') {
    lines.push('  items={richFruits}');
    lines.push('  itemToString={(item) => item?.label ?? \'\'}');
  } else if (s.itemVariant === 'action') {
    lines.push('  items={actionItems}');
    lines.push('  itemToString={(item) => item?.label ?? \'\'}');
  } else {
    lines.push('  items={fruits}');
  }
  if (s.variant !== 'input') lines.push(`  variant="${s.variant}"`);
  if (s.mode !== 'single') lines.push(`  mode="${s.mode}"`);
  if (s.chevronStyle !== 'caret') lines.push(`  chevronStyle="${s.chevronStyle}"`);
  if (s.itemVariant !== 'default' && s.itemVariant !== 'rich' && s.itemVariant !== 'action') {
    lines.push(`  itemVariant="${s.itemVariant}"`);
  }
  if (s.label) lines.push(`  label="${s.label}"`);
  if (s.placeholder) lines.push(`  placeholder="${s.placeholder}"`);
  if (s.disabled) lines.push('  disabled');
  if (s.readOnly) lines.push('  readOnly');
  if (!s.deselectionAllowed) lines.push('  deselectionAllowed={false}');
  if (!s.closeOnSelect) lines.push('  closeOnSelect={false}');
  if (s.footer === 'actions') {
    lines.push('  renderFooter={({ clearSelection }) => (');
    lines.push('    <FooterActions');
    lines.push('      actions={[{ label: "Clear", onClick: clearSelection, variant: "ghost" }]}');
    lines.push('    />');
    lines.push('  )}');
  } else if (s.footer === 'summary') {
    lines.push('  renderFooter={() => (');
    lines.push('    <div style={{ padding: "8px 12px", fontSize: 12 }}>');
    lines.push(`    ${s.mode === 'multi' ? '  {selectedItems.length} selected' : '  Select an option'}`);
    lines.push('    </div>');
    lines.push('  )}');
  }
  if (s.header !== 'none') lines.push(`  renderListHeader={/* ${s.header} header */}`);
  if (s.itemVariant === 'rich') lines.push('  renderItem={/* rich item with icon + description */}');
  if (s.itemVariant === 'action') lines.push('  renderItem={/* action item with button */}');
  lines.push('/>');
  return lines.join('\n');
}

export function Playground() {
  const { theme } = useTheme();
  const [state, dispatch] = useReducer(reducer, initial);
  const set = (key: string) => (value: unknown) => dispatch({ type: 'set', key, value });
  const [selectedItems, setSelectedItems] = useState<unknown[]>([]);
  const [singleSelected, setSingleSelected] = useState<unknown>(null);
  const [runningAction, setRunningAction] = useState<string | null>(null);
  const [completedAction, setCompletedAction] = useState<string | null>(null);

  const isMulti = state.mode === 'multi';

  const itemVariantOptions = isMulti
    ? ['default', 'checkbox', 'rich', 'action']
    : ['default', 'checkbox', 'radio', 'rich', 'action'];

  const controls: Control[] = [
    { type: 'segmented', label: 'Mode', value: state.mode, options: ['single', 'multi'], onChange: set('mode') },
    { type: 'segmented', label: 'Variant', value: state.variant, options: ['input', 'select'], onChange: set('variant') },
    { type: 'select', label: 'Chevron Style', value: state.chevronStyle, options: ['caret', 'arrow', 'angle', 'plusminus', 'dots', 'none'], onChange: set('chevronStyle') },
    { type: 'segmented', label: 'Item Variant', value: state.itemVariant, options: itemVariantOptions, onChange: set('itemVariant') },
    { type: 'segmented', label: 'Footer', value: state.footer, options: ['none', 'actions', 'summary'], onChange: set('footer') },
    { type: 'segmented', label: 'Header', value: state.header, options: ['none', 'search', 'info'], onChange: set('header') },
    { type: 'text', label: 'Label', value: state.label, onChange: set('label') },
    { type: 'text', label: 'Placeholder', value: state.placeholder, onChange: set('placeholder') },
    { type: 'toggle', label: 'Disabled', value: state.disabled, onChange: set('disabled') },
    { type: 'toggle', label: 'Read Only', value: state.readOnly, onChange: set('readOnly') },
    { type: 'toggle', label: 'Deselection Allowed', value: state.deselectionAllowed, onChange: set('deselectionAllowed') },
    { type: 'toggle', label: 'Close On Select', value: state.closeOnSelect, onChange: set('closeOnSelect') },
  ];

  // Determine items and render functions based on itemVariant
  const useRichItems = state.itemVariant === 'rich';
  const useActionItems = state.itemVariant === 'action';

  const renderItem = useRichItems
    ? ({ item }: { item: RichFruit; isSelected: boolean }) => (
        <CustomItem
          icon={<span style={{ fontSize: 20 }}>{item.icon}</span>}
          title={item.label}
          description={item.description}
        />
      )
    : useActionItems
    ? ({ item }: { item: ActionItem }) => {
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
                {isRunning ? '\u23F3' : isComplete ? '\u2713' : item.actionLabel}
              </button>
            }
          />
        );
      }
    : state.itemVariant === 'checkbox'
    ? ({ item, isSelected }: { item: string; isSelected: boolean }) => (
        <CheckboxItem label={typeof item === 'string' ? item : String(item)} isSelected={isSelected} />
      )
    : undefined;

  const selectionCount = isMulti ? selectedItems.length : (singleSelected != null ? 1 : 0);

  const renderFooter = state.footer === 'actions'
    ? ({ clearSelection }: { clearSelection: () => void }) => (
        <FooterActions
          selectedCount={selectionCount}
          totalCount={useRichItems ? richFruits.length : useActionItems ? actionItems.length : fruits.length}
          actions={[
            { label: 'Clear', onClick: clearSelection, variant: 'ghost' as const },
          ]}
        />
      )
    : state.footer === 'summary'
    ? () => (
        <div style={{ padding: '8px 12px', fontSize: 12, color: '#9ca3af', borderTop: '1px solid var(--demo-border, #e5e7eb)' }}>
          {selectionCount > 0 ? `${selectionCount} selected` : 'Select an option'}
        </div>
      )
    : undefined;

  const renderListHeader = state.header === 'search'
    ? () => (
        <div style={{ padding: '8px 12px', fontSize: 12, color: '#9ca3af', borderBottom: '1px solid var(--demo-border, #e5e7eb)' }}>
          Type to search and filter results
        </div>
      )
    : state.header === 'info'
    ? () => (
        <div style={{ padding: '8px 12px', fontSize: 12, color: '#9ca3af', borderBottom: '1px solid var(--demo-border, #e5e7eb)' }}>
          {useRichItems ? `${richFruits.length} items` : useActionItems ? `${actionItems.length} actions` : `${fruits.length} fruits available`}
        </div>
      )
    : undefined;

  // Common props
  const comboProps: Record<string, unknown> = {
    theme,
    variant: state.variant as 'input' | 'select',
    chevronStyle: state.chevronStyle,
    label: state.label || undefined,
    placeholder: state.placeholder,
    disabled: state.disabled,
    readOnly: state.readOnly,
    deselectionAllowed: state.deselectionAllowed,
    closeOnSelect: state.closeOnSelect,
    ...(isMulti
      ? { mode: 'multi' as const, onSelectedItemsChange: setSelectedItems }
      : { onSelectedItemChange: setSingleSelected }),
    ...(renderFooter ? { renderFooter } : {}),
    ...(renderListHeader ? { renderListHeader } : {}),
  };

  // Only pass itemVariant for checkbox/radio (not rich/action which use custom renderItem)
  if (state.itemVariant === 'checkbox' || state.itemVariant === 'radio') {
    comboProps.itemVariant = state.itemVariant;
  }

  return (
    <div>
      <div className="demo-playground">
        <div className="demo-playground-preview">
          <div style={{ width: 320 }}>
            {useRichItems ? (
              <Combo
                items={richFruits}
                itemToString={(item) => item?.label ?? ''}
                itemToValue={(item) => item.value}
                renderItem={renderItem as any}
                {...comboProps}
              />
            ) : useActionItems ? (
              <Combo
                items={actionItems}
                itemToString={(item) => item?.label ?? ''}
                itemToValue={(item) => item.value}
                renderItem={renderItem as any}
                {...comboProps}
              />
            ) : (
              <Combo
                items={fruits}
                renderItem={renderItem as any}
                {...comboProps}
              />
            )}
          </div>
        </div>
        <ControlPanel controls={controls} title="Props" />
      </div>
      <div className="demo-mt-3">
        <CodeBlock code={generateCode(state)} collapsible={false} />
      </div>
    </div>
  );
}
