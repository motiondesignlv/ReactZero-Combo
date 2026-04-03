import { useState } from 'react';
import { Combo } from '@reactzero/combo';
import { CheckboxItem } from '@reactzero/combo/slots';
import { useTheme } from '../context/ThemeContext';
import { DemoCard } from '../shared/DemoCard';
import { fruits } from '../shared/data';

// ---------------------------------------------------------------------------
// Keyboard shortcut data
// ---------------------------------------------------------------------------

interface Shortcut {
  key: string;
  action: string;
  context: string;
}

const shortcuts: Shortcut[] = [
  { key: 'ArrowDown', action: 'Open menu & highlight first item', context: 'Closed' },
  { key: 'ArrowDown', action: 'Move to next item', context: 'Open' },
  { key: 'ArrowUp', action: 'Open menu & highlight last item', context: 'Closed' },
  { key: 'ArrowUp', action: 'Move to previous item', context: 'Open' },
  { key: 'Enter', action: 'Select highlighted item', context: 'Open' },
  { key: 'Escape', action: 'Close menu', context: 'Open' },
  { key: 'Home', action: 'Jump to first item', context: 'Open' },
  { key: 'End', action: 'Jump to last item', context: 'Open' },
  { key: 'PageDown', action: 'Jump 10 items forward', context: 'Open' },
  { key: 'PageUp', action: 'Jump 10 items backward', context: 'Open' },
  { key: 'Tab', action: 'Close menu & move focus to next element', context: 'Open' },
  { key: 'Space', action: 'Open menu / select item (select variant)', context: 'Any' },
  { key: 'Backspace', action: 'Remove last chip (multi-select, empty input)', context: 'Any' },
  { key: 'Ctrl+A', action: 'Select all items (multi-select)', context: 'Any' },
];

// ---------------------------------------------------------------------------
// ARIA features data
// ---------------------------------------------------------------------------

interface AriaFeature {
  attribute: string;
  element: string;
  purpose: string;
}

const ariaFeatures: AriaFeature[] = [
  { attribute: 'role="combobox"', element: 'Input / Trigger', purpose: 'Identifies the element as a combobox' },
  { attribute: 'role="listbox"', element: 'Menu', purpose: 'Identifies the popup as a list of options' },
  { attribute: 'role="option"', element: 'Each item', purpose: 'Identifies each selectable option' },
  { attribute: 'aria-expanded', element: 'Input / Trigger', purpose: 'Indicates whether the popup is open' },
  { attribute: 'aria-activedescendant', element: 'Input / Trigger', purpose: 'Points to the currently highlighted option' },
  { attribute: 'aria-selected', element: 'Option', purpose: 'Indicates selected state' },
  { attribute: 'aria-checked', element: 'Option', purpose: 'Indicates checked state (checkbox/radio variants)' },
  { attribute: 'aria-multiselectable', element: 'Listbox', purpose: 'Indicates multiple selection is allowed' },
  { attribute: 'aria-autocomplete', element: 'Input', purpose: 'Indicates filtering behavior (list or none)' },
  { attribute: 'aria-disabled', element: 'Input / Option', purpose: 'Indicates disabled state' },
  { attribute: 'aria-haspopup', element: 'Input / Trigger', purpose: 'Indicates a popup listbox is available' },
  { attribute: 'aria-controls', element: 'Input / Trigger', purpose: 'References the listbox element' },
];

// ---------------------------------------------------------------------------
// Code examples
// ---------------------------------------------------------------------------

const labelCode = `<Combo
  items={items}
  label="Favorite Fruit"
  placeholder="Search..."
/>`;

const ariaLabelCode = `<Combo
  items={items}
  ariaLabel="Search countries"
  placeholder="Type to filter..."
/>`;

const multiA11yCode = `<Combo
  items={items}
  mode="multi"
  itemVariant="checkbox"
  label="Permissions"
  placeholder="Select permissions..."
  renderItem={({ item, isSelected }) => (
    <CheckboxItem
      label={String(item)}
      isSelected={isSelected}
    />
  )}
/>

{/* Keyboard: Ctrl+A to select all, Backspace to remove last */}`;

const highContrastCode = `import '@reactzero/combo/themes/high-contrast.css';

<Combo
  items={items}
  theme="high-contrast"
  label="High Contrast"
/>`;

// ---------------------------------------------------------------------------
// Interactive keyboard tester
// ---------------------------------------------------------------------------

function KeyboardTester() {
  const [log, setLog] = useState<string[]>([]);

  return (
    <div style={{ width: 280 }}>
      <Combo
        items={fruits}
        label="Try keyboard navigation"
        placeholder="Click here, then use arrow keys..."
        onIsOpenChange={(open) => {
          setLog((prev) => [...prev.slice(-4), open ? 'Menu opened' : 'Menu closed']);
        }}
        onSelectedItemChange={(item) => {
          if (item) setLog((prev) => [...prev.slice(-4), `Selected: ${item}`]);
        }}
      />
      <div
        role="log"
        aria-label="Keyboard event log"
        aria-live="polite"
        style={{
          marginTop: 12,
          padding: '8px 12px',
          borderRadius: 6,
          fontSize: '0.75rem',
          fontFamily: 'monospace',
          background: 'var(--demo-bg-alt)',
          border: '1px solid var(--demo-border)',
          minHeight: 80,
          color: 'var(--demo-text-muted)',
        }}
      >
        {log.length === 0 && <span>Events will appear here...</span>}
        {log.map((entry, i) => (
          <div key={i}>{entry}</div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function Accessibility() {
  const { theme } = useTheme();

  return (
    <div>
      {/* Keyboard shortcuts reference */}
      <div className="demo-card" style={{ marginBottom: 32, overflow: 'auto' }}>
        <div className="demo-card-header">Keyboard Shortcuts</div>
        <div style={{ padding: '0 4px 4px' }}>
          <table
            role="table"
            aria-label="Keyboard shortcuts reference"
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.8125rem',
            }}
          >
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--demo-border)' }}>
                <th style={{ padding: '10px 12px', fontWeight: 600 }}>Key</th>
                <th style={{ padding: '10px 12px', fontWeight: 600 }}>Action</th>
                <th style={{ padding: '10px 12px', fontWeight: 600 }}>Context</th>
              </tr>
            </thead>
            <tbody>
              {shortcuts.map((s, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--demo-border)' }}>
                  <td style={{ padding: '8px 12px' }}>
                    <kbd style={{
                      padding: '2px 6px',
                      borderRadius: 4,
                      border: '1px solid var(--demo-border)',
                      background: 'var(--demo-bg-alt)',
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                      whiteSpace: 'nowrap',
                    }}>
                      {s.key}
                    </kbd>
                  </td>
                  <td style={{ padding: '8px 12px', color: 'var(--demo-text)' }}>{s.action}</td>
                  <td style={{ padding: '8px 12px', color: 'var(--demo-text-muted)' }}>{s.context}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive examples */}
      <div className="demo-grid-2">
        <DemoCard
          title="Keyboard Navigation"
          description="Focus the input and use arrow keys, Enter, Escape to navigate"
          code={labelCode}
        >
          <KeyboardTester />
        </DemoCard>

        <DemoCard
          title="Accessible Labels"
          description="Use label prop or ariaLabel for screen readers"
          code={ariaLabelCode}
        >
          <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Combo
              items={fruits}
              label="With visible label"
              placeholder="Search fruits..."
              theme={theme}
            />
            <Combo
              items={fruits}
              ariaLabel="Hidden label for screen readers"
              placeholder="With aria-label (no visible label)..."
              theme={theme}
            />
          </div>
        </DemoCard>

        <DemoCard
          title="Multi-Select Keyboard"
          description="Ctrl+A to select all, Backspace to remove last chip"
          code={multiA11yCode}
        >
          <div style={{ width: 280 }}>
            <Combo
              items={fruits}
              mode="multi"
              itemVariant="checkbox"
              label="Permissions"
              placeholder="Select items..."
              theme={theme}
              closeOnSelect={false}
              renderItem={({ item, isSelected }) => (
                <CheckboxItem
                  label={String(item)}
                  isSelected={isSelected}
                />
              )}
            />
          </div>
        </DemoCard>

        <DemoCard
          title="High Contrast Theme"
          description="WCAG AAA contrast ratios with yellow focus indicators"
          code={highContrastCode}
        >
          <div style={{ width: 280 }}>
            <Combo
              items={fruits}
              theme="high-contrast"
              label="High Contrast"
              placeholder="Search..."
            />
          </div>
        </DemoCard>
      </div>

      {/* ARIA attributes reference */}
      <div className="demo-card" style={{ marginTop: 32, overflow: 'auto' }}>
        <div className="demo-card-header">ARIA Attributes</div>
        <div style={{ padding: '0 4px 4px' }}>
          <table
            role="table"
            aria-label="ARIA attributes reference"
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.8125rem',
            }}
          >
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--demo-border)' }}>
                <th style={{ padding: '10px 12px', fontWeight: 600 }}>Attribute</th>
                <th style={{ padding: '10px 12px', fontWeight: 600 }}>Element</th>
                <th style={{ padding: '10px 12px', fontWeight: 600 }}>Purpose</th>
              </tr>
            </thead>
            <tbody>
              {ariaFeatures.map((f, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--demo-border)' }}>
                  <td style={{ padding: '8px 12px' }}>
                    <code style={{
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                      color: 'var(--demo-accent)',
                    }}>
                      {f.attribute}
                    </code>
                  </td>
                  <td style={{ padding: '8px 12px', color: 'var(--demo-text)' }}>{f.element}</td>
                  <td style={{ padding: '8px 12px', color: 'var(--demo-text-muted)' }}>{f.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Screen reader section */}
      <div className="demo-card" style={{ marginTop: 32 }}>
        <div className="demo-card-header">Screen Reader Announcements</div>
        <div style={{ padding: 20 }}>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            display: 'grid',
            gap: 12,
            fontSize: '0.875rem',
          }}>
            {[
              ['Menu opens', '"X option(s) available" or "No options available"'],
              ['Filter changes', 'Updated count announced via live region'],
              ['Item selected', '"[item name] selected"'],
              ['Item deselected', '"[item name] deselected"'],
              ['Multi-select add', '"[item] selected, X total"'],
              ['Multi-select remove', '"Item removed, X selected"'],
            ].map(([event, message]) => (
              <li
                key={event}
                style={{
                  display: 'flex',
                  gap: 12,
                  alignItems: 'baseline',
                }}
              >
                <strong style={{ minWidth: 160, color: 'var(--demo-text)' }}>{event}</strong>
                <span style={{ color: 'var(--demo-text-muted)', fontFamily: 'monospace', fontSize: '0.8125rem' }}>
                  {message}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
