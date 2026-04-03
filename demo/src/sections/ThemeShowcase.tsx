import { Combo, useCombo } from '@reactzero/combo';
import { useTheme } from '../context/ThemeContext';
import { DemoCard } from '../shared/DemoCard';
import { fruits } from '../shared/data';

const themes = [
  { id: 'default' as const, label: 'Default', bg: '#f8fafc', color: '#0f172a' },
  { id: 'dark' as const, label: 'Dark', bg: '#1e293b', color: '#f1f5f9' },
  { id: 'high-contrast' as const, label: 'High Contrast', bg: '#000000', color: '#ffffff' },
];

const cssCustomCode = `{/* Override CSS variables for custom styling */}
<div style={{
  '--rzero-combo-input-border-radius': '24px',
  '--rzero-combo-popover-border-radius': '16px',
  '--rzero-combo-item-highlighted-bg': '#fef3c7',
  '--rzero-combo-input-focus-ring': '0 0 0 2px #f59e0b',
}}>
  <Combo items={fruits} placeholder="Custom styled..." />
</div>`;

const headlessCode = `import { useCombo } from '@reactzero/combo';

function HeadlessSelect() {
  const { getInputProps, getMenuProps, getItemProps,
    isOpen, filteredItems } = useCombo({ items: fruits });

  return (
    <div>
      <input {...getInputProps({ placeholder: 'Type here...' })} />
      {isOpen && (
        <ul {...getMenuProps()}>
          {filteredItems.map((item, i) => (
            <li key={i} {...getItemProps({ item, index: i })}>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`;

function HeadlessExample() {
  const combo = useCombo({ items: fruits });

  return (
    <div style={{ width: '100%' }}>
      <input
        {...combo.getInputProps({ placeholder: 'Type to search (unstyled)...' })}
        style={{
          width: '100%',
          padding: '8px 12px',
          border: '2px dashed #d1d5db',
          borderRadius: 4,
          fontSize: 14,
          background: 'transparent',
          color: 'inherit',
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />
      {combo.isOpen && (
        <ul
          {...combo.getMenuProps()}
          style={{
            listStyle: 'none',
            margin: '4px 0 0',
            padding: 4,
            border: '2px dashed #d1d5db',
            borderRadius: 4,
            maxHeight: 200,
            overflow: 'auto',
          }}
        >
          {combo.filteredItems.map((item, i) => (
            <li
              key={i}
              {...combo.getItemProps({ item, index: i })}
              style={{
                padding: '6px 8px',
                cursor: 'pointer',
                borderRadius: 2,
                ...(combo.highlightedIndex === i ? { background: '#e5e7eb' } : {}),
                ...(combo.selectedItem === item ? { fontWeight: 700 } : {}),
              }}
            >
              {String(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ThemeShowcase() {
  const { theme } = useTheme();

  return (
    <div>
      <div className="demo-theme-grid">
        {themes.map((t) => (
          <div
            key={t.id}
            className={`demo-theme-card demo-theme-card--${t.id}`}
          >
            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{t.label}</span>
            <div style={{ width: '100%' }}>
              <Combo
                items={fruits}
                placeholder="Search fruits..."
                theme={t.id}
              />
            </div>
          </div>
        ))}
      </div>

      <h3 className="demo-section-title" style={{ fontSize: '1.25rem', marginTop: 48, marginBottom: 24 }}>
        Customization
      </h3>
      <div className="demo-grid-2">
        <DemoCard title="CSS Variable Override" code={cssCustomCode}>
          <div style={{ width: 280 }}>
            <div style={{
              '--rzero-combo-input-border-radius': '24px',
              '--rzero-combo-popover-border-radius': '16px',
              '--rzero-combo-item-highlighted-bg': '#fef3c7',
              '--rzero-combo-input-focus-ring': '0 0 0 2px #f59e0b',
            } as React.CSSProperties}>
              <Combo items={fruits} placeholder="Custom styled..." theme="default" />
            </div>
          </div>
        </DemoCard>
        <DemoCard title="Headless Hook Usage" code={headlessCode}>
          <HeadlessExample />
        </DemoCard>
      </div>

      <div style={{ marginTop: 24 }}>
        <DemoCard title="Popover Auto-Flip" description="The popover automatically flips above the trigger when there isn't enough space below in the viewport. Resize your browser window or scroll so this combo is near the bottom edge, then open it to see the flip in action.">
          <div style={{ width: 280 }}>
            <Combo items={fruits} placeholder="Open near viewport bottom..." theme={theme} />
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: '#9ca3af' }}>
            Flips when the list would be clipped below and there's more room above.
          </div>
        </DemoCard>
      </div>
    </div>
  );
}
