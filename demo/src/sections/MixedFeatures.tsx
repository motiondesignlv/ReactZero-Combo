import { useState } from 'react';
import { Combo } from '@reactzero/combo';
import { CheckboxItem, CustomItem, FooterActions } from '@reactzero/combo/slots';
import { GroupSeparator } from '@reactzero/combo/slots';
import { useTheme } from '../context/ThemeContext';
import { DemoCard } from '../shared/DemoCard';

// --- Data ---

const teamMembers = [
  { name: 'Alice Chen', role: 'Frontend Lead', initials: 'AC', color: '#3b82f6' },
  { name: 'Bob Kim', role: 'Backend Dev', initials: 'BK', color: '#ef4444' },
  { name: 'Carol Wu', role: 'Designer', initials: 'CW', color: '#10b981' },
  { name: 'Dan Park', role: 'DevOps', initials: 'DP', color: '#f59e0b' },
  { name: 'Eve Liu', role: 'PM', initials: 'EL', color: '#8b5cf6' },
  { name: 'Frank Li', role: 'QA Lead', initials: 'FL', color: '#ec4899' },
];

const roleGroups = [
  { label: 'Engineering', items: [
    { label: 'Frontend', value: 'frontend' },
    { label: 'Backend', value: 'backend' },
    { label: 'Fullstack', value: 'fullstack' },
  ]},
  { label: 'Design', items: [
    { label: 'UI Design', value: 'ui' },
    { label: 'UX Research', value: 'ux' },
  ]},
  { label: 'Product', items: [
    { label: 'Product Manager', value: 'pm' },
    { label: 'Data Analyst', value: 'analyst' },
  ]},
];

const priorities = ['Critical', 'High', 'Medium', 'Low', 'None'];

const countries = ['United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Japan', 'Australia', 'Brazil'];

// --- Code strings ---

const multiRichCode = `<Combo
  items={teamMembers}
  mode="multi"
  closeOnSelect={false}
  itemVariant="checkbox"
  placeholder="Select team members..."
  label="Team Members"
  itemToString={(item) => item?.name ?? ''}
  onSelectedItemsChange={setSelected}
  renderItem={({ item, isSelected }) => (
    <CheckboxItem
      label={item.name}
      description={item.role}
      isSelected={isSelected}
      icon={
        <span style={{
          width: 28, height: 28, borderRadius: '50%',
          background: item.color, color: '#fff',
          display: 'inline-flex', alignItems: 'center',
          justifyContent: 'center',
          fontSize: 11, fontWeight: 600,
        }}>
          {item.initials}
        </span>
      }
    />
  )}
  renderFooter={({ clearSelection }) => (
    <FooterActions
      selectedCount={selected.length}
      totalCount={teamMembers.length}
      actions={[
        { label: 'Clear', onClick: clearSelection, variant: 'ghost' },
      ]}
    />
  )}
/>`;

const groupedMultiCode = `<Combo
  groups={roleGroups}
  mode="multi"
  closeOnSelect={false}
  itemVariant="checkbox"
  placeholder="Select roles..."
  label="Roles"
  itemToString={(item) => item?.label ?? ''}
  onSelectedItemsChange={setSelected}
  renderItem={({ item, isSelected }) => (
    <CheckboxItem label={item.label} isSelected={isSelected} />
  )}
  renderGroupHeader={({ group }) => (
    <GroupSeparator label={group.label} count={group.items.length} />
  )}
  renderFooter={({ clearSelection }) => (
    <FooterActions
      selectedCount={selected.length}
      totalCount={7}
      actions={[
        { label: 'Clear', onClick: clearSelection, variant: 'ghost' },
      ]}
    />
  )}
/>`;

const selectValidationCode = `<Combo
  items={priorities}
  variant="select"
  placeholder="Select priority..."
  label="Priority"
  hintText={!selectedPriority ? "Choose a priority level" : undefined}
  errorText={validated && !selectedPriority ? "Priority is required" : undefined}
  onSelectedItemChange={(item) => {
    setSelectedPriority(item);
    setValidated(false);
  }}
/>`;

const searchSelectCode = `<Combo
  items={countries}
  variant="select"
  placeholder="Select country..."
  label="Country"
  filterFunction={(items, input) =>
    items.filter((item) =>
      item.toLowerCase().includes(input.toLowerCase())
    )
  }
  renderTrigger={({ getInputProps, getToggleButtonProps, getChevronProps, chevronIcon }) => (
    <div className="rzero-combo-trigger">
      <SearchIcon />
      <input {...getInputProps({ placeholder: 'Select country...' })} />
      <button {...getToggleButtonProps()}>
        <span {...getChevronProps()}>{chevronIcon}</span>
      </button>
    </div>
  )}
/>`;

// --- Component ---

export function MixedFeatures() {
  const { theme } = useTheme();
  const [teamSelected, setTeamSelected] = useState<typeof teamMembers>([]);
  const [roleSelected, setRoleSelected] = useState<(typeof roleGroups)[number]['items'][number][]>([]);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [validated, setValidated] = useState(false);

  return (
    <div className="demo-grid-2">
      {/* 1. Multi-Select + Rich Items */}
      <DemoCard
        title="Multi-Select + Rich Items"
        description="Multi-select with avatar icons, descriptions, and a footer showing selection count"
        code={multiRichCode}
      >
        <div style={{ width: '100%' }}>
          <Combo
            items={teamMembers}
            mode="multi"
            closeOnSelect={false}
            itemVariant="checkbox"
            placeholder="Select team members..."
            label="Team Members"
            theme={theme}
            itemToString={(item) => item?.name ?? ''}
            itemToValue={(item) => item.name}
            onSelectedItemsChange={setTeamSelected}
            renderItem={({ item, isSelected }) => (
              <CheckboxItem
                label={item.name}
                description={item.role}
                isSelected={isSelected}
                icon={
                  <span style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: item.color, color: '#fff',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 600,
                  }}>
                    {item.initials}
                  </span>
                }
              />
            )}
            renderFooter={({ clearSelection }) => (
              <FooterActions
                selectedCount={teamSelected.length}
                totalCount={teamMembers.length}
                actions={[
                  { label: 'Clear', onClick: clearSelection, variant: 'ghost' },
                ]}
              />
            )}
          />
        </div>
      </DemoCard>

      {/* 2. Grouped + Multi-Select */}
      <DemoCard
        title="Grouped + Multi-Select"
        description="Multi-select with categorized groups, checkbox items, and selection summary"
        code={groupedMultiCode}
      >
        <div style={{ width: '100%' }}>
          <Combo
            groups={roleGroups}
            mode="multi"
            closeOnSelect={false}
            itemVariant="checkbox"
            placeholder="Select roles..."
            label="Roles"
            theme={theme}
            itemToString={(item) => item?.label ?? ''}
            itemToValue={(item) => item.value}
            onSelectedItemsChange={setRoleSelected}
            renderItem={({ item, isSelected }) => (
              <CheckboxItem label={item.label} isSelected={isSelected} />
            )}
            renderGroupHeader={({ group }) => (
              <GroupSeparator label={group.label} count={group.items.length} />
            )}
            renderFooter={({ clearSelection }) => (
              <FooterActions
                selectedCount={roleSelected.length}
                totalCount={7}
                actions={[
                  { label: 'Clear', onClick: clearSelection, variant: 'ghost' },
                ]}
              />
            )}
          />
        </div>
      </DemoCard>

      {/* 3. Select + Hint + Error Validation */}
      <DemoCard
        title="Select + Validation"
        description="Select variant with hint text and error validation on button click"
        code={selectValidationCode}
      >
        <div style={{ width: '100%' }}>
          <Combo
            items={priorities}
            variant="select"
            placeholder="Select priority..."
            label="Priority"
            theme={theme}
            hintText={!selectedPriority ? 'Choose a priority level' : undefined}
            errorText={validated && !selectedPriority ? 'Priority is required' : undefined}
            onSelectedItemChange={(item) => {
              setSelectedPriority(item);
              setValidated(false);
            }}
          />
          <button
            onClick={() => setValidated(true)}
            style={{
              marginTop: 16,
              padding: '6px 14px',
              fontSize: '0.8125rem',
              borderRadius: 6,
              border: '1px solid var(--demo-border)',
              background: 'var(--demo-surface)',
              color: 'var(--demo-text)',
              cursor: 'pointer',
            }}
          >
            Validate
          </button>
        </div>
      </DemoCard>

      {/* 4. Search Prefix + Custom Filter + Select Variant */}
      <DemoCard
        title="Searchable Select"
        description="Select variant with a search icon prefix and custom case-insensitive filter"
        code={searchSelectCode}
      >
        <div style={{ width: '100%' }}>
          <Combo
            items={countries}
            variant="select"
            placeholder="Select country..."
            label="Country"
            theme={theme}
            filterFunction={(items, input) =>
              items.filter((item) =>
                item.toLowerCase().includes(input.toLowerCase())
              )
            }
            renderTrigger={({ getInputProps, getToggleButtonProps, getChevronProps, chevronIcon }) => (
              <div className="rzero-combo-trigger">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#9ca3af', flexShrink: 0 }}>
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input {...getInputProps({ placeholder: 'Select country...' })} />
                <button {...getToggleButtonProps()}>
                  <span {...getChevronProps()}>{chevronIcon}</span>
                </button>
              </div>
            )}
          />
        </div>
      </DemoCard>
    </div>
  );
}
