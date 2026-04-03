import { useState } from 'react';
import { Combo } from '@reactzero/combo';
import { GroupSeparator, CheckboxItem, FooterActions } from '@reactzero/combo/slots';
import { useTheme } from '../context/ThemeContext';
import { DemoCard } from '../shared/DemoCard';
import { fruitGroups, categoryGroups } from '../shared/data';
import type { CategoryItem } from '../shared/data';

const groupedCode = `<Combo
  groups={fruitGroups}
  placeholder="Search fruits..."
  renderGroupHeader={({ group }) => (
    <GroupSeparator
      label={group.label}
      count={group.items.length}
      sticky
    />
  )}
/>`;

const selectGroupCode = `<Combo
  groups={categoryGroups}
  variant="select"
  placeholder="Choose a technology..."
  label="Technology"
  itemToString={(item) => item?.label ?? ''}
  renderGroupHeader={({ group }) => (
    <GroupSeparator label={group.label} count={group.items.length} sticky />
  )}
/>`;

const multiGroupCode = `<Combo
  groups={categoryGroups}
  mode="multi"
  itemVariant="checkbox"
  closeOnSelect={false}
  placeholder="Select technologies..."
  label="Tech Stack"
  itemToString={(item) => item?.label ?? ''}
  minSelected={1}
  maxSelected={5}
  renderGroupHeader={({ group }) => (
    <GroupSeparator label={group.label} count={group.items.length} sticky />
  )}
  renderFooter={({ clearSelection }) => (
    <FooterActions
      selectedCount={selected.length}
      totalCount={9}
      actions={[{ label: 'Clear', onClick: clearSelection, variant: 'ghost' }]}
    />
  )}
/>`;

export function GroupedItems() {
  const { theme } = useTheme();
  const [multiSelected, setMultiSelected] = useState<CategoryItem[]>([]);

  return (
    <div>
      <DemoCard
        title="Grouped Items with Sticky Headers"
        description="Items organized by category with sticky group headers"
        code={groupedCode}
      >
        <div style={{ width: 320 }}>
          <Combo
            groups={fruitGroups}
            placeholder="Search fruits..."
            theme={theme}
            renderGroupHeader={({ group }) => (
              <GroupSeparator
                label={group.label}
                count={group.items.length}
                sticky
              />
            )}
          />
        </div>
      </DemoCard>

      <div className="demo-grid-2" style={{ marginTop: 24 }}>
        <DemoCard
          title="Select from Groups"
          description="Select variant with grouped options"
          code={selectGroupCode}
        >
          <div style={{ width: 320 }}>
            <Combo
              groups={categoryGroups}
              variant="select"
              placeholder="Choose a technology..."
              label="Technology"
              theme={theme}
              itemToString={(item) => item?.label ?? ''}
              itemToValue={(item) => item.value}
              renderGroupHeader={({ group }) => (
                <GroupSeparator label={group.label} count={group.items.length} sticky />
              )}
            />
          </div>
        </DemoCard>

        <DemoCard
          title="Multi-Select with Groups"
          description="Checkbox multi-select with categorized items"
          code={multiGroupCode}
        >
          <div style={{ width: 320 }}>
            <Combo
              groups={categoryGroups}
              mode="multi"
              itemVariant="checkbox"
              closeOnSelect={false}
              placeholder="Select technologies..."
              label="Tech Stack"
              theme={theme}
              itemToString={(item) => item?.label ?? ''}
              itemToValue={(item) => item.value}
              onSelectedItemsChange={setMultiSelected}
              minSelected={1}
              maxSelected={5}
              hintText="Build your stack from each category"
              renderGroupHeader={({ group }) => (
                <GroupSeparator label={group.label} count={group.items.length} sticky />
              )}
              renderItem={({ item, isSelected }) => (
                <CheckboxItem label={item.label} isSelected={isSelected} />
              )}
              renderFooter={({ clearSelection }) => (
                <FooterActions
                  selectedCount={multiSelected.length}
                  totalCount={9}
                  actions={[{ label: 'Clear', onClick: clearSelection, variant: 'ghost' as const }]}
                />
              )}
            />
          </div>
        </DemoCard>
      </div>
    </div>
  );
}
