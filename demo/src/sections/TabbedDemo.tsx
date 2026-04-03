import { useState } from 'react';
import { Combo } from '@reactzero/combo';
import { TabbedCombo } from '@reactzero/combo/tabs';
import { useTheme } from '../context/ThemeContext';
import { DemoCard } from '../shared/DemoCard';
import { foodTabs, fruits } from '../shared/data';

const tabbedCode = `<TabbedCombo
  tabs={[
    { id: 'fruits', label: 'Fruits', items: fruitItems, badge: 5 },
    { id: 'vegetables', label: 'Vegetables', items: vegItems, badge: 4 },
    { id: 'grains', label: 'Grains', items: grainItems, badge: 4 },
  ]}
  placeholder="Search food..."
  label="Food categories"
/>`;

const headerCode = `<Combo
  items={fruits}
  placeholder="Search fruits..."
  renderListHeader={() => (
    <div style={{ padding: '8px 12px', fontSize: 12, color: '#9ca3af', borderBottom: '1px solid #e5e7eb' }}>
      Browse or type to filter results
    </div>
  )}
/>`;

const tabbedFooterCode = `<TabbedCombo
  tabs={foodTabs}
  placeholder="Search food..."
  label="With footer"
  renderFooter={({ selectedItem }) => (
    <div style={{ ... }}>
      <span>Browse by category</span>
      {selectedItem && <span>Selected: {selectedItem.label}</span>}
    </div>
  )}
/>`;

export function TabbedDemo() {
  const { theme } = useTheme();
  const [selectedFood, setSelectedFood] = useState<{ label: string; value: string } | null>(null);

  return (
    <div>
      <div className="demo-grid-2">
        <DemoCard title="Tabbed Popover" description="Switch tabs by clicking, or use Ctrl+Arrow Left/Right from the search input" code={tabbedCode}>
          <div style={{ width: 340 }}>
            <TabbedCombo
              tabs={foodTabs}
              itemToString={(item) => item?.label ?? ''}
              itemToValue={(item) => item.value}
              placeholder="Search food..."
              label="Food categories"
              theme={theme}
            />
          </div>
        </DemoCard>
        <DemoCard title="Custom List Header" code={headerCode}>
          <div style={{ width: 340 }}>
            <Combo
              items={fruits}
              placeholder="Search fruits..."
              theme={theme}
              renderListHeader={() => (
                <div style={{ padding: '8px 12px', fontSize: 12, color: '#9ca3af', borderBottom: '1px solid #e5e7eb' }}>
                  Browse or type to filter results
                </div>
              )}
            />
          </div>
        </DemoCard>
      </div>

      <div style={{ marginTop: 24 }}>
        <DemoCard
          title="Tabs with Footer"
          description="Tabbed popover with a contextual footer showing selection info"
          code={tabbedFooterCode}
        >
          <div style={{ width: 340 }}>
            <TabbedCombo
              tabs={foodTabs}
              itemToString={(item) => item?.label ?? ''}
              itemToValue={(item) => item.value}
              placeholder="Search food..."
              label="With footer"
              theme={theme}
              onSelectedItemChange={setSelectedFood}
              renderFooter={() => (
                <div style={{
                  padding: '6px 12px',
                  fontSize: 12,
                  color: '#9ca3af',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid var(--demo-border, #e5e7eb)',
                }}>
                  <span>Browse by category</span>
                  {selectedFood && (
                    <span style={{ color: 'var(--demo-accent, #3b82f6)', fontWeight: 500 }}>
                      {selectedFood.label}
                    </span>
                  )}
                </div>
              )}
            />
          </div>
        </DemoCard>
      </div>
    </div>
  );
}
