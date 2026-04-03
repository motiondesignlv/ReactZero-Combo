import { useState } from 'react';
import { Combo } from '@reactzero/combo';
import { CheckboxItem, FooterActions } from '@reactzero/combo/slots';
import { useTheme } from '../context/ThemeContext';
import { DemoCard } from '../shared/DemoCard';
import { checkboxItems } from '../shared/data';

const chipMultiSelectCode = `<Combo
  items={permissions}
  mode="multi"
  itemVariant="checkbox"
  closeOnSelect={false}
  placeholder="Select permissions..."
  label="Permissions"
  itemToString={(item) => item?.label ?? ''}
  onSelectedItemsChange={setSelectedItems}
  renderItem={({ item, isSelected }) => (
    <CheckboxItem label={item.label} isSelected={isSelected} />
  )}
  renderFooter={({ clearSelection }) => (
    <FooterActions
      selectedCount={selectedItems.length}
      totalCount={permissions.length}
      actions={[
        { label: 'Clear', onClick: clearSelection, variant: 'ghost' },
      ]}
    />
  )}
/>`;

const hintErrorCode = `<Combo
  items={roles}
  placeholder="Choose a role..."
  label="Role"
  hintText="Select your primary role"
  errorText={hasError ? "Role is required" : undefined}
/>`;

const minMaxCode = `<Combo
  items={permissions}
  mode="multi"
  itemVariant="checkbox"
  closeOnSelect={false}
  placeholder="Select permissions..."
  label="Permissions"
  hintText="Select between 2 and 4 permissions"
  minSelected={2}
  maxSelected={4}
  onSelectedItemsChange={setSelectedItems}
  renderItem={({ item, isSelected }) => (
    <CheckboxItem label={item.label} isSelected={isSelected} />
  )}
/>`;

export function MultiSelect() {
  const { theme } = useTheme();
  const [chipSelected, setChipSelected] = useState<typeof checkboxItems>([]);
  const [showError, setShowError] = useState(false);

  return (
    <div>
      <div className="demo-grid-2">
        <DemoCard
          title="Chip Multi-Select"
          description="Selected items appear as removable chips inside the input"
          code={chipMultiSelectCode}
        >
          <div style={{ width: '100%' }}>
            <Combo
              items={checkboxItems}
              itemToString={(item) => item?.label ?? ''}
              itemToValue={(item) => item.value}
              itemVariant="checkbox"
              mode="multi"
              closeOnSelect={false}
              placeholder="Select permissions..."
              label="Permissions"
              theme={theme}
              onSelectedItemsChange={setChipSelected}
              renderItem={({ item, isSelected }) => (
                <CheckboxItem label={item.label} isSelected={isSelected} />
              )}
              renderFooter={({ clearSelection }) => (
                <FooterActions
                  selectedCount={chipSelected.length}
                  totalCount={checkboxItems.length}
                  actions={[
                    { label: 'Clear', onClick: clearSelection, variant: 'ghost' },
                  ]}
                />
              )}
            />
          </div>
        </DemoCard>

        <DemoCard
          title="With Hint & Error Text"
          description="Display contextual help or validation errors. The trigger border turns red in error state."
          code={hintErrorCode}
        >
          <div style={{ width: '100%' }}>
            <Combo
              items={checkboxItems}
              itemToString={(item) => item?.label ?? ''}
              itemToValue={(item) => item.value}
              placeholder="Choose a role..."
              label="Role"
              theme={theme}
              hintText="Select your primary role"
              errorText={showError ? 'Role is required' : undefined}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
              <button
                onClick={() => setShowError((v) => !v)}
                className="demo-state-toggle"
                data-error={showError || undefined}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: showError ? '#dc2626' : '#10b981',
                    flexShrink: 0,
                  }}
                />
                {showError ? 'Error state' : 'Hint state'}
              </button>
            </div>
          </div>
        </DemoCard>
      </div>

      <div style={{ marginTop: 24 }}>
        <DemoCard
          title="Min / Max Selection"
          description="Constrain selections with minimum and maximum limits. Items are blocked once the max is reached."
          code={minMaxCode}
        >
          <div style={{ width: 320 }}>
            <Combo
              items={checkboxItems}
              itemToString={(item) => item?.label ?? ''}
              itemToValue={(item) => item.value}
              itemVariant="checkbox"
              mode="multi"
              closeOnSelect={false}
              placeholder="Select permissions..."
              label="Permissions"
              hintText="Select between 2 and 4 permissions"
              minSelected={2}
              maxSelected={4}
              theme={theme}
              renderItem={({ item, isSelected }) => (
                <CheckboxItem label={item.label} isSelected={isSelected} />
              )}
            />
          </div>
        </DemoCard>
      </div>
    </div>
  );
}
