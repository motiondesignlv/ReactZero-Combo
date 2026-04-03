import { useState, useCallback } from 'react';
import { Combo, useCombo } from '@reactzero/combo';
import { useTheme } from '../context/ThemeContext';
import { DemoCard } from '../shared/DemoCard';
import { fruits } from '../shared/data';

// ---------------------------------------------------------------------------
// Shared inline styles for headless examples
// ---------------------------------------------------------------------------

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  border: '2px dashed #d1d5db',
  borderRadius: 4,
  fontSize: 14,
  background: 'transparent',
  color: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
};

const menuStyle: React.CSSProperties = {
  listStyle: 'none',
  margin: '4px 0 0',
  padding: 4,
  border: '2px dashed #d1d5db',
  borderRadius: 4,
  maxHeight: 200,
  overflow: 'auto',
};

const itemStyle = (isHighlighted: boolean, isSelected: boolean): React.CSSProperties => ({
  padding: '6px 10px',
  borderRadius: 4,
  cursor: 'pointer',
  fontSize: 14,
  background: isHighlighted ? 'rgba(59,130,246,0.12)' : 'transparent',
  fontWeight: isSelected ? 600 : 400,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const buttonStyle: React.CSSProperties = {
  marginTop: 8,
  padding: '4px 12px',
  fontSize: '0.8125rem',
  borderRadius: 6,
  border: '1px solid var(--demo-border)',
  background: 'var(--demo-surface)',
  color: 'var(--demo-text)',
  cursor: 'pointer',
};

// ---------------------------------------------------------------------------
// Data for Custom Filter example
// ---------------------------------------------------------------------------

const languages = [
  { name: 'TypeScript', desc: 'Typed JavaScript superset' },
  { name: 'Rust', desc: 'Systems programming with safety' },
  { name: 'Python', desc: 'General-purpose scripting' },
  { name: 'Go', desc: 'Compiled language by Google' },
  { name: 'Swift', desc: 'Apple platform development' },
  { name: 'Kotlin', desc: 'JVM language for Android' },
];

// ---------------------------------------------------------------------------
// Code strings
// ---------------------------------------------------------------------------

const controlledCode = `const [selected, setSelected] = useState<string | null>(null);

const {
  getInputProps, getMenuProps, getItemProps,
  isOpen, filteredItems, highlightedIndex,
  selectedItem, selectItem, clearSelection,
} = useCombo<string>({
  items: fruits,
  selectedItem: selected,
  onSelectedItemChange: (item) => setSelected(item),
});

// External buttons call selectItem / clearSelection
<button onClick={() => selectItem('Cherry')}>Select Cherry</button>
<button onClick={() => clearSelection()}>Clear</button>`;

const customFilterCode = `const languages = [
  { name: 'TypeScript', desc: 'Typed JavaScript superset' },
  { name: 'Rust', desc: 'Systems programming with safety' },
  // ...
];

useCombo({
  items: languages,
  itemToString: (item) => item?.name ?? '',
  filterFunction: (items, input) => {
    const q = input.toLowerCase();
    return items.filter(
      (it) =>
        it.name.toLowerCase().includes(q) ||
        it.desc.toLowerCase().includes(q),
    );
  },
});`;

const dynamicItemsCode = `useCombo<string>({
  items: [],           // start empty
  filterFunction: (_items, input) => {
    const n = parseInt(input, 10);
    if (isNaN(n) || n < 1) return [];
    return Array.from(
      { length: Math.min(n, 50) },
      (_, i) => \`Item \${i + 1}\`,
    );
  },
});`;

const emptyStateCode = `// Default: shows "No results found" automatically
<Combo items={fruits} placeholder="Type 'zzz' to see..." />

// Custom empty state
<Combo
  items={fruits}
  placeholder="Try a bad search..."
  renderEmpty={() => (
    <div style={{ textAlign: 'center', padding: '12px' }}>
      <div>No matches</div>
      <div style={{ fontSize: 12, color: '#9ca3af' }}>
        Try a different search term
      </div>
    </div>
  )}
/>`;

const readOnlyDisabledCode = `<Combo
  items={fruits}
  readOnly
  defaultSelectedItem="Cherry"
  placeholder="Read-only..."
/>

<Combo
  items={fruits}
  disabled
  placeholder="Disabled..."
/>`;

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ControlledExample() {
  const [selected, setSelected] = useState<string | null>(null);

  const {
    getInputProps,
    getMenuProps,
    getItemProps,
    isOpen,
    filteredItems,
    highlightedIndex,
    selectedItem,
    selectItem,
    clearSelection,
  } = useCombo<string>({
    items: fruits,
    selectedItem: selected,
    onSelectedItemChange: (item) => setSelected(item),
    ariaLabel: 'Controlled fruit selection',
  });

  return (
    <div>
      <input
        {...getInputProps({ placeholder: 'Search fruits...' })}
        style={inputStyle}
      />
      {isOpen && (
        <ul {...getMenuProps()} style={menuStyle}>
          {filteredItems.map((item, index) => {
            const isHighlighted = highlightedIndex === index;
            const isSelected = selectedItem === item;
            return (
              <li
                key={item}
                {...getItemProps({ item, index })}
                style={itemStyle(isHighlighted, isSelected)}
              >
                <span>{item}</span>
                {isSelected && <span style={{ color: '#3b82f6' }}>&#10003;</span>}
              </li>
            );
          })}
          {filteredItems.length === 0 && (
            <li style={{ padding: '8px 10px', fontSize: 14, color: '#9ca3af', textAlign: 'center' }}>
              No results
            </li>
          )}
        </ul>
      )}
      {!isOpen && <ul {...getMenuProps()} style={{ display: 'none' }} />}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          type="button"
          style={buttonStyle}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            selectItem('Cherry');
            setSelected('Cherry');
          }}
        >
          Select Cherry
        </button>
        <button
          type="button"
          style={buttonStyle}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            clearSelection();
            setSelected(null);
          }}
        >
          Clear
        </button>
      </div>
      <div style={{ marginTop: 8, fontSize: 12, color: '#6b7280', fontFamily: 'monospace' }}>
        selected: {selected ?? 'null'}
      </div>
    </div>
  );
}

type Language = { name: string; desc: string };

function CustomFilterExample() {
  const filterAcrossFields = useCallback(
    (items: Language[], input: string) => {
      const q = input.toLowerCase();
      if (!q) return items;
      return items.filter(
        (it) =>
          it.name.toLowerCase().includes(q) ||
          it.desc.toLowerCase().includes(q),
      );
    },
    [],
  );

  const {
    getInputProps,
    getMenuProps,
    getItemProps,
    isOpen,
    filteredItems,
    highlightedIndex,
    selectedItem,
  } = useCombo<Language>({
    items: languages,
    itemToString: (item) => item?.name ?? '',
    filterFunction: filterAcrossFields,
    ariaLabel: 'Search programming languages',
  });

  return (
    <div>
      <input
        {...getInputProps({ placeholder: 'Try "safety" or "Google"...' })}
        style={inputStyle}
      />
      {isOpen && (
        <ul {...getMenuProps()} style={menuStyle}>
          {filteredItems.map((item, index) => {
            const isHighlighted = highlightedIndex === index;
            const isSelected = selectedItem === item;
            return (
              <li
                key={item.name}
                {...getItemProps({ item, index })}
                style={itemStyle(isHighlighted, isSelected)}
              >
                <div>
                  <div style={{ fontWeight: 500 }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: '#9ca3af' }}>{item.desc}</div>
                </div>
                {isSelected && <span style={{ color: '#3b82f6' }}>&#10003;</span>}
              </li>
            );
          })}
          {filteredItems.length === 0 && (
            <li style={{ padding: '8px 10px', fontSize: 14, color: '#9ca3af', textAlign: 'center' }}>
              No results
            </li>
          )}
        </ul>
      )}
      {!isOpen && <ul {...getMenuProps()} style={{ display: 'none' }} />}
    </div>
  );
}

function DynamicItemsExample() {
  const generateItems = useCallback(
    (_items: string[], input: string) => {
      const n = parseInt(input, 10);
      if (isNaN(n) || n < 1) return [];
      return Array.from(
        { length: Math.min(n, 50) },
        (_, i) => `Item ${i + 1}`,
      );
    },
    [],
  );

  const {
    getInputProps,
    getMenuProps,
    getItemProps,
    isOpen,
    filteredItems,
    highlightedIndex,
    selectedItem,
  } = useCombo<string>({
    items: [],
    filterFunction: generateItems,
    ariaLabel: 'Dynamic item generator',
  });

  return (
    <div>
      <input
        {...getInputProps({ placeholder: 'Type a number (e.g. 5)...' })}
        style={inputStyle}
      />
      {isOpen && (
        <ul {...getMenuProps()} style={menuStyle}>
          {filteredItems.map((item, index) => {
            const isHighlighted = highlightedIndex === index;
            const isSelected = selectedItem === item;
            return (
              <li
                key={item}
                {...getItemProps({ item, index })}
                style={itemStyle(isHighlighted, isSelected)}
              >
                <span>{item}</span>
                {isSelected && <span style={{ color: '#3b82f6' }}>&#10003;</span>}
              </li>
            );
          })}
          {filteredItems.length === 0 && (
            <li style={{ padding: '8px 10px', fontSize: 14, color: '#9ca3af', textAlign: 'center' }}>
              Type a number to generate items
            </li>
          )}
        </ul>
      )}
      {!isOpen && <ul {...getMenuProps()} style={{ display: 'none' }} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main section
// ---------------------------------------------------------------------------

export function EdgeCases() {
  const { theme } = useTheme();

  return (
    <div>
      <p className="demo-section-description">
        Edge cases and advanced patterns using the headless <code>useCombo</code> hook.
        Dashed borders indicate fully headless rendering with no built-in styles.
      </p>
      <div className="demo-grid-2">
        <DemoCard
          title="Controlled Selection"
          description="External state drives selection. Buttons modify the value from outside the combo."
          code={controlledCode}
        >
          <div style={{ width: '100%' }}>
            <ControlledExample />
          </div>
        </DemoCard>

        <DemoCard
          title="Custom Filter"
          description="Searches across both name and description fields. Try typing a description keyword."
          code={customFilterCode}
        >
          <div style={{ width: '100%' }}>
            <CustomFilterExample />
          </div>
        </DemoCard>

        <DemoCard
          title="Dynamic Items"
          description="Items generated on-the-fly from the input value. Type a number to produce that many items."
          code={dynamicItemsCode}
        >
          <div style={{ width: '100%' }}>
            <DynamicItemsExample />
          </div>
        </DemoCard>

        <DemoCard
          title="Empty State"
          description="Type a query with no matches to see the empty state. Default shows 'No results found'; pass renderEmpty for custom content."
          code={emptyStateCode}
        >
          <div style={{ display: 'flex', gap: 16, width: '100%', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 120px', minWidth: 120 }}>
              <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4, fontWeight: 500 }}>
                Default
              </div>
              <Combo
                items={fruits}
                placeholder="Type 'zzz'..."
                theme={theme}
              />
            </div>
            <div style={{ flex: '1 1 120px', minWidth: 120 }}>
              <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4, fontWeight: 500 }}>
                Custom
              </div>
              <Combo
                items={fruits}
                placeholder="Type 'zzz'..."
                theme={theme}
                renderEmpty={() => (
                  <div style={{ textAlign: 'center', padding: '12px' }}>
                    <div>No matches</div>
                    <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>
                      Try a different search term
                    </div>
                  </div>
                )}
              />
            </div>
          </div>
        </DemoCard>

        <DemoCard
          title="Read-Only & Disabled"
          description="Pre-built Combo in read-only and disabled states."
          code={readOnlyDisabledCode}
        >
          <div style={{ display: 'flex', gap: 16, width: '100%', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 120px', minWidth: 120 }}>
              <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4, fontWeight: 500 }}>
                Read-only
              </div>
              <Combo
                items={fruits}
                readOnly
                defaultSelectedItem="Cherry"
                placeholder="Read-only..."
                theme={theme}
              />
            </div>
            <div style={{ flex: '1 1 120px', minWidth: 120 }}>
              <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4, fontWeight: 500 }}>
                Disabled
              </div>
              <Combo
                items={fruits}
                disabled
                placeholder="Disabled..."
                theme={theme}
              />
            </div>
          </div>
        </DemoCard>
      </div>
    </div>
  );
}
