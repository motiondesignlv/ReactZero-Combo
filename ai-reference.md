# @reactzero/combo — AI Reference

> Headless, accessible React combo & select component. **Zero dependencies.** ARIA 1.2 compliant, under 7kB brotli.

Feed this file to your AI coding assistant for complete API docs, examples, and patterns.

## Why Zero Dependencies?

@reactzero/combo has **zero runtime dependencies** — it only peer-depends on React 18+. No Popper.js, no Floating UI, no Downshift. Everything is built from scratch: the state machine, positioning, keyboard handling, ARIA compliance. This means:

- No supply-chain risk from transitive dependencies
- No version conflicts or breaking changes from upstream
- Predictable, auditable bundle size
- Works in any React 18+ project without dependency resolution issues

## Installation

```bash
npm install @reactzero/combo
```

## Entry Points (Tree-Shakeable)

| Import | Description | Gzipped |
|--------|-------------|---------|
| `@reactzero/combo` | Full: Combo + Portal + LiveRegion + hook | 6.7kB |
| `@reactzero/combo/hook` | Hook only (useCombo) + default icons | 4.8kB |
| `@reactzero/combo/hook-bare` | Hook only, no icons (save ~0.5kB) | 4.3kB |
| `@reactzero/combo/headless` | Alias for /hook | 4.8kB |
| `@reactzero/combo/slots` | Slot components (CheckboxItem, CustomItem, FooterActions, GroupSeparator) | 583B |
| `@reactzero/combo/tabs` | TabbedCombo component | 7.3kB |
| `@reactzero/combo/icons` | Icon customization utilities | 706B |
| `@reactzero/combo/position` | Positioning hook (usePosition) | 634B |
| `@reactzero/combo/styles` | Base structural CSS | 2.5kB |
| `@reactzero/combo/styles/base` | Core layout only | — |
| `@reactzero/combo/styles/select` | Select variant styles | — |
| `@reactzero/combo/styles/states` | Disabled/error/loading states | — |
| `@reactzero/combo/styles/checkbox` | Checkbox item styles | — |
| `@reactzero/combo/styles/radio` | Radio item styles | — |
| `@reactzero/combo/styles/chips` | Multi-select chip styles | — |
| `@reactzero/combo/styles/groups` | Group header styles | — |
| `@reactzero/combo/styles/footer` | Footer action styles | — |
| `@reactzero/combo/styles/custom-item` | Rich item styles | — |
| `@reactzero/combo/styles/meta` | Meta text styles | — |
| `@reactzero/combo/styles/tabs` | Tab strip styles | — |
| `@reactzero/combo/themes/default.css` | Light theme tokens | — |
| `@reactzero/combo/themes/dark.css` | Dark theme tokens | — |
| `@reactzero/combo/themes/high-contrast.css` | WCAG AAA theme tokens | — |

## Quick Start — Pre-built Component

```tsx
import { Combo } from '@reactzero/combo';
import '@reactzero/combo/styles';
import '@reactzero/combo/themes/default.css';

function App() {
  return (
    <Combo
      items={['Apple', 'Banana', 'Cherry']}
      placeholder="Search fruits..."
      onSelectedItemChange={(item) => console.log('Selected:', item)}
    />
  );
}
```

## Quick Start — Headless Hook

```tsx
import { useCombo } from '@reactzero/combo/hook';

function MyCombo() {
  const {
    getInputProps,
    getMenuProps,
    getItemProps,
    getToggleButtonProps,
    getClearButtonProps,
    getChevronProps,
    getLabelProps,
    isOpen,
    filteredItems,
    highlightedIndex,
    selectedItem,
    hasSelection,
    icons,
    chevronIcon,
  } = useCombo({ items: ['Apple', 'Banana', 'Cherry'] });

  return (
    <div>
      <label {...getLabelProps()}>Fruit</label>
      <div>
        <input {...getInputProps({ placeholder: 'Search...' })} />
        {hasSelection && <button {...getClearButtonProps()}>{icons.clear}</button>}
        <button {...getToggleButtonProps()}>
          <span {...getChevronProps()}>{chevronIcon}</span>
        </button>
      </div>
      {isOpen && (
        <ul {...getMenuProps()} style={{ listStyle: 'none' }}>
          {filteredItems.map((item, i) => (
            <li
              key={i}
              {...getItemProps({ item, index: i })}
              style={{
                background: highlightedIndex === i ? '#dbeafe' : 'transparent',
                fontWeight: selectedItem === item ? 700 : 400,
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
```

## Hook API: useCombo(options)

### Options (UseComboOptions\<T\>)

```typescript
interface UseComboOptions<T> {
  // Required
  items: T[];

  // Item accessors
  itemToString?: (item: T | null) => string;     // Default: String(item)
  itemToValue?: (item: T) => string | number;     // Default: item.value ?? String(item)

  // Mode & variant
  mode?: 'single' | 'multi';                      // Default: 'single'
  variant?: 'input' | 'select';                   // Default: 'input'
  // 'input' = type-to-filter combobox
  // 'select' = click-to-open dropdown (no text input)

  // Controlled / uncontrolled state
  selectedItem?: T | null;
  defaultSelectedItem?: T | null;
  selectedItems?: T[];
  defaultSelectedItems?: T[];
  inputValue?: string;
  defaultInputValue?: string;
  isOpen?: boolean;
  defaultIsOpen?: boolean;

  // Behavior
  filterFunction?: (items: T[], inputValue: string) => T[];
  closeOnSelect?: boolean;           // Default: true for single, false for multi
  commitOnBlur?: boolean;            // Default: false
  clearOnSelect?: boolean;           // Default: false
  deselectionAllowed?: boolean;      // Default: true
  maxSelected?: number;

  // Accessibility
  id?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;

  // Callbacks
  onSelectedItemChange?: (item: T | null) => void;
  onSelectedItemsChange?: (items: T[]) => void;
  onIsOpenChange?: (isOpen: boolean) => void;
  onHighlightedIndexChange?: (index: number) => void;
  onStateChange?: (state: ComboState<T>) => void;
  onInputChange?: (value: string) => void;

  // Async (isLoading is implemented; others are Phase 3)
  debounceMs?: number;               // @experimental — not yet implemented
  isLoading?: boolean;
  hasMore?: boolean;                  // @experimental — not yet implemented
  onLoadMore?: () => void;            // @experimental — not yet implemented

  // Disabled states
  disabled?: boolean | 'loading';
  readOnly?: boolean;
  isItemDisabled?: (item: T) => boolean;
  hideDisabled?: boolean;
  disabledItemBehavior?: 'skip' | 'focus'; // Default: 'skip'

  // Icons & style
  icons?: Partial<IconSlots>;
  chevronStyle?: 'caret' | 'arrow' | 'angle' | 'plusminus' | 'dots' | 'none' | 'custom';

  // Portal
  portalTarget?: Element | null;
  disablePortal?: boolean;

  // Groups
  groups?: ComboGroup<T>[];
}
```

### Return Value (UseComboReturn\<T\>)

```typescript
interface UseComboReturn<T> {
  // Prop getters — spread onto your elements for ARIA compliance
  getInputProps: (userProps?) => InputHTMLAttributes;
  getToggleButtonProps: (userProps?) => ButtonHTMLAttributes;
  getLabelProps: (userProps?) => LabelHTMLAttributes;
  getClearButtonProps: (userProps?) => ButtonHTMLAttributes;
  getMenuProps: (userProps?) => HTMLAttributes;          // role="listbox"
  getItemProps: ({ item, index }) => LiHTMLAttributes;  // role="option"
  getGroupProps: ({ group, index }) => HTMLAttributes;
  getChevronProps: (userProps?) => HTMLAttributes;
  getTriggerProps: (userProps?) => ButtonHTMLAttributes; // For select variant
  getControlProps: (userProps?) => HTMLAttributes;       // Alias for getTriggerProps

  // State
  isOpen: boolean;
  inputValue: string;
  selectedItem: T | null;
  selectedItems: T[];
  highlightedIndex: number;
  filteredItems: T[];
  hasSelection: boolean;
  triggerLabel: string;      // Display text for select variant trigger
  isLoading: boolean;
  isEmpty: boolean;          // filteredItems.length === 0
  isError: boolean;
  error: Error | null;

  // Icons
  icons: IconSlots;          // { chevronDown, check, clear, search, loading }
  chevronIcon: ReactNode;    // Pre-resolved chevron based on chevronStyle

  // Imperative actions
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
  selectItem: (item: T) => void;
  removeItem: (item: T) => void;
  selectAll: () => void;
  clearSelection: () => void;
  setInputValue: (value: string) => void;
  reset: () => void;

  // Refs
  inputRef: RefObject<HTMLInputElement>;
  listboxRef: RefObject<HTMLElement>;
  triggerRef: RefObject<HTMLElement>;
}
```

## Combo Component Props (ComboProps\<T\>)

Extends all `UseComboOptions<T>` plus:

```typescript
interface ComboProps<T> extends UseComboOptions<T> {
  placeholder?: string;
  label?: string;
  theme?: 'default' | 'dark' | 'high-contrast' | 'system';
  itemVariant?: 'default' | 'checkbox' | 'radio';
  hintText?: string;
  errorText?: string;
  minSelected?: number;
  maxSelected?: number;
  classNames?: ComboClassNames;

  // Render props
  renderItem?: (props: {
    item: T; index: number;
    isHighlighted: boolean; isSelected: boolean; isDisabled: boolean;
  }) => ReactNode;
  renderEmpty?: () => ReactNode;
  renderLoading?: () => ReactNode;
  renderError?: (props: { error: Error | null }) => ReactNode;
  renderFooter?: (props: {
    selectedItem: T | null; selectedItems: T[];
    closeMenu: () => void; clearSelection: () => void;
  }) => ReactNode;
  renderTrigger?: (props: {
    getInputProps; getToggleButtonProps; getTriggerProps;
    getClearButtonProps; getChevronProps;
    selectedItem; hasSelection; triggerLabel; isOpen; icons; chevronIcon;
  }) => ReactNode;
  renderGroupHeader?: (props: { group: ComboGroup<T>; index: number }) => ReactNode;
  renderListHeader?: () => ReactNode;
}
```

## Slot Components

Import from `@reactzero/combo/slots`:

### CheckboxItem

```tsx
<CheckboxItem
  label="Option Label"
  description="Optional description"
  isSelected={true}
  isHighlighted={false}
  isDisabled={false}
/>
```

### CustomItem

```tsx
<CustomItem
  icon={<Avatar />}
  title="Item Title"
  description="Optional description"
  badge={42}
  meta={<span>metadata</span>}
/>
```

### FooterActions

```tsx
<FooterActions
  selectedCount={3}
  totalCount={10}
  actions={[
    { label: 'Select All', onClick: () => selectAll(), variant: 'default' },
    { label: 'Clear', onClick: () => clearSelection(), variant: 'ghost' },
  ]}
/>
```

### GroupSeparator

```tsx
<GroupSeparator label="Category" count={5} sticky />
```

## TabbedCombo

```tsx
import { TabbedCombo } from '@reactzero/combo/tabs';
import '@reactzero/combo/styles/tabs';

<TabbedCombo
  tabs={[
    { id: 'fruits', label: 'Fruits', items: fruitItems, badge: 5 },
    { id: 'vegs', label: 'Vegetables', items: vegItems, badge: 4 },
  ]}
  itemToString={(item) => item?.label ?? ''}
  placeholder="Search food..."
/>
```

## Keyboard Navigation

| Key | Action |
|-----|--------|
| ArrowDown | Open menu / highlight next item |
| ArrowUp | Open menu (last item) / highlight previous item |
| Enter | Select highlighted item |
| Escape | Close menu |
| Home | Highlight first item |
| End | Highlight last item |
| PageDown | Jump 10 items forward |
| PageUp | Jump 10 items back |
| Tab | Commit selection (if commitOnBlur) and close |
| Backspace | Remove last chip (multi mode, empty input) |
| Space | Toggle menu (select variant only) |

## CSS Custom Properties (Complete List)

All visual aspects are customizable. Override these on your wrapper element or globally:

### Layout & Structure

```css
--rzero-combo-z-index
--rzero-combo-min-width
--rzero-combo-max-height
--rzero-combo-transition-duration
--rzero-combo-transition-easing
```

### Input

```css
--rzero-combo-input-bg
--rzero-combo-input-border
--rzero-combo-input-border-radius
--rzero-combo-input-color
--rzero-combo-input-focus-ring
--rzero-combo-input-font-size
--rzero-combo-input-height
--rzero-combo-input-hover-border
--rzero-combo-input-padding
--rzero-combo-input-padding-multi
```

### Popover / Dropdown

```css
--rzero-combo-popover-bg
--rzero-combo-popover-border
--rzero-combo-popover-border-radius
--rzero-combo-popover-shadow
```

### Items

```css
--rzero-combo-item-color
--rzero-combo-item-height
--rzero-combo-item-padding
--rzero-combo-item-hover-bg
--rzero-combo-item-highlighted-bg
--rzero-combo-item-selected-bg
--rzero-combo-item-selected-color
--rzero-combo-item-disabled-opacity
--rzero-combo-item-description-color
--rzero-combo-item-description-font-size
--rzero-combo-item-meta-color
--rzero-combo-item-meta-font-size
```

### Label & Hint

```css
--rzero-combo-label-color
--rzero-combo-label-font-size
--rzero-combo-label-font-weight
--rzero-combo-label-margin-bottom
--rzero-combo-hint-color
```

### Error State

```css
--rzero-combo-error-border
--rzero-combo-error-color
--rzero-combo-error-focus-ring
--rzero-combo-error-text-color
```

### Icons

```css
--rzero-combo-icon-color
--rzero-combo-icon-muted-color
--rzero-combo-icon-size-sm
--rzero-combo-icon-size-md
--rzero-combo-icon-size-lg
```

### Chips (Multi-Select)

```css
--rzero-combo-chip-bg
--rzero-combo-chip-color
--rzero-combo-chip-font-size
--rzero-combo-chip-padding
--rzero-combo-chip-border-radius
--rzero-combo-chip-radius
--rzero-combo-chip-remove-color
--rzero-combo-chip-remove-hover-bg
--rzero-combo-chip-remove-hover-color
```

### Checkbox Variant

```css
--rzero-combo-checkbox-bg
--rzero-combo-checkbox-border
--rzero-combo-checkbox-checked-bg
--rzero-combo-checkbox-checked-border
--rzero-combo-checkbox-hover-border
--rzero-combo-checkbox-radius
--rzero-combo-checkbox-size
```

### Radio Variant

```css
--rzero-combo-radio-bg
--rzero-combo-radio-border
--rzero-combo-radio-checked-border
--rzero-combo-radio-checked-dot
--rzero-combo-radio-hover-border
--rzero-combo-radio-size
```

### Groups

```css
--rzero-combo-group-header-color
--rzero-combo-group-header-count-bg
--rzero-combo-group-header-count-color
--rzero-combo-group-header-font-size
--rzero-combo-group-header-font-weight
--rzero-combo-group-header-letter-spacing
--rzero-combo-group-header-text-transform
--rzero-combo-separator-color
```

### Footer

```css
--rzero-combo-footer-border-top
--rzero-combo-footer-color
--rzero-combo-footer-padding
--rzero-combo-footer-note-color
--rzero-combo-footer-note-font-size
--rzero-combo-footer-action-bg
--rzero-combo-footer-action-border
--rzero-combo-footer-action-border-radius
--rzero-combo-footer-action-color
--rzero-combo-footer-action-font-size
--rzero-combo-footer-action-hover-bg
--rzero-combo-footer-action-primary-bg
--rzero-combo-footer-action-primary-color
--rzero-combo-footer-action-primary-hover-bg
```

### Tabs

```css
--rzero-combo-tab-bg
--rzero-combo-tab-color
--rzero-combo-tab-font-size
--rzero-combo-tab-font-weight
--rzero-combo-tab-padding
--rzero-combo-tab-border-color
--rzero-combo-tab-hover-bg
--rzero-combo-tab-hover-color
--rzero-combo-tab-active-bg
--rzero-combo-tab-active-border-color
--rzero-combo-tab-active-color
--rzero-combo-tab-focus-ring
--rzero-combo-tab-badge-bg
--rzero-combo-tab-badge-color
--rzero-combo-tab-badge-active-bg
--rzero-combo-tab-badge-active-color
```

### Custom Items

```css
--rzero-combo-custom-item-icon-size
--rzero-combo-custom-item-icon-radius
--rzero-combo-badge-bg
--rzero-combo-badge-color
--rzero-combo-badge-font-size
--rzero-combo-badge-radius
--rzero-combo-meta-font-size
--rzero-combo-meta-margin-top
```

### Selection Count & Misc

```css
--rzero-combo-selection-count-color
--rzero-combo-selection-count-warning-color
--rzero-combo-hidden-selection-border
```

## Built-in Themes

```tsx
// Light (default)
import '@reactzero/combo/themes/default.css';

// Dark
import '@reactzero/combo/themes/dark.css';

// High contrast (WCAG AAA)
import '@reactzero/combo/themes/high-contrast.css';

// Auto-detect from system
<Combo theme="system" ... />
```

## Common Patterns

### Multi-select with chips

```tsx
<Combo
  items={permissions}
  mode="multi"
  closeOnSelect={false}
  itemVariant="checkbox"
  placeholder="Select permissions..."
  onSelectedItemsChange={setSelected}
  renderItem={({ item, isSelected }) => (
    <CheckboxItem label={item.label} isSelected={isSelected} />
  )}
/>
```

### Select dropdown (no text filtering)

```tsx
<Combo
  items={['Draft', 'Published', 'Archived']}
  variant="select"
  placeholder="Status..."
  onSelectedItemChange={setStatus}
/>
```

### Custom filter function

```tsx
<Combo
  items={users}
  itemToString={(u) => u?.name ?? ''}
  filterFunction={(items, query) =>
    items.filter(u =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase())
    )
  }
/>
```

### Grouped items

```tsx
<Combo
  groups={[
    { label: 'Fruits', items: ['Apple', 'Banana'] },
    { label: 'Vegetables', items: ['Carrot', 'Broccoli'] },
  ]}
  items={[]}
  renderGroupHeader={({ group }) => (
    <GroupSeparator label={group.label} count={group.items.length} sticky />
  )}
/>
```

### Controlled selection

```tsx
const [selected, setSelected] = useState<string | null>(null);

<Combo
  items={items}
  selectedItem={selected}
  onSelectedItemChange={setSelected}
/>
```

### Custom trigger (attach to any element)

```tsx
<Combo
  items={items}
  renderTrigger={({ getInputProps, getToggleButtonProps, isOpen, chevronIcon }) => (
    <div className="my-custom-trigger">
      <input {...getInputProps()} />
      <button {...getToggleButtonProps()}>{chevronIcon}</button>
    </div>
  )}
/>
```

### Tabbed categories

```tsx
import { TabbedCombo } from '@reactzero/combo/tabs';

<TabbedCombo
  tabs={[
    { id: 'recent', label: 'Recent', items: recentFiles, badge: recentFiles.length },
    { id: 'all', label: 'All Files', items: allFiles },
  ]}
  itemToString={(f) => f?.name ?? ''}
  placeholder="Find a file..."
/>
```

### Custom styling via CSS properties

```tsx
<div style={{
  '--rzero-combo-input-border-radius': '24px',
  '--rzero-combo-popover-border-radius': '16px',
  '--rzero-combo-item-highlighted-bg': '#fef3c7',
  '--rzero-combo-input-focus-ring': '0 0 0 2px #f59e0b',
} as React.CSSProperties}>
  <Combo items={items} placeholder="Custom styled..." />
</div>
```

## State Machine Actions

The internal state machine processes these actions:

| Action | Description |
|--------|-------------|
| `FOCUS` / `BLUR` | Input focus management |
| `INPUT_CHANGE` | Filter items as user types |
| `TOGGLE_MENU` / `OPEN_MENU` / `CLOSE_MENU` | Menu visibility |
| `HIGHLIGHT_ITEM` / `HIGHLIGHT_FIRST` / `HIGHLIGHT_LAST` | Direct highlight |
| `HIGHLIGHT_NEXT` / `HIGHLIGHT_PREV` | Arrow key navigation |
| `SELECT_HIGHLIGHTED` | Select current highlight (Enter) |
| `SELECT_ITEM` / `DESELECT_ITEM` | Programmatic selection |
| `CLEAR_SELECTION` | Remove all selections |
| `SELECT_ALL` | Select all filtered items (multi mode) |
| `REMOVE_LAST_CHIP` | Backspace removes last chip (multi mode) |
| `SYNC_ITEMS` | Re-filter when items change externally |
| `RESET` | Return to initial state |

## Accessibility

- Implements [ARIA Authoring Practices Guide — Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
- `role="combobox"` on input, `role="listbox"` on menu, `role="option"` on items
- `aria-expanded`, `aria-activedescendant`, `aria-selected`, `aria-disabled` managed automatically
- Live region announces selection changes and result counts to screen readers
- Full keyboard navigation (see table above)
- High-contrast theme passes WCAG AAA contrast ratios
- Focus management: focus returns to input on menu close

## Architecture

```
@reactzero/combo/
├── src/
│   ├── types.ts              # All TypeScript interfaces
│   ├── core/
│   │   ├── stateMachine.ts   # Pure reducer (no side effects)
│   │   ├── keyboard.ts       # Key -> action mapping
│   │   ├── scroll.ts         # scrollIntoView helper
│   │   ├── announce.ts       # Live region announcements
│   │   ├── ids.ts            # ARIA id generation (prefix: rzero-combo-)
│   │   └── utils.ts          # Shared utilities
│   ├── hooks/
│   │   ├── useCombo.ts       # Main hook
│   │   └── usePosition.ts    # Portal positioning (flip/shift)
│   ├── components/
│   │   ├── Combo.tsx          # Pre-built component
│   │   ├── Portal.tsx         # Portal wrapper
│   │   ├── LiveRegion.tsx     # ARIA live region
│   │   ├── slots/             # CheckboxItem, CustomItem, FooterActions, GroupSeparator
│   │   └── tabs/              # TabbedCombo
│   ├── icons/
│   │   ├── icons.tsx          # Icon registry + lazy provider
│   │   └── defaults.tsx       # 9 built-in SVG icons
│   ├── entries/               # 7 tree-shakeable entry points
│   └── styles/                # 10 modular CSS files
├── themes/                    # default.css, dark.css, high-contrast.css
└── dist/                      # Built output (ESM + CJS)
```

## CSS Class Naming

All classes use the `.rzero-combo-*` prefix:

```
.rzero-combo              (root)
.rzero-combo-input
.rzero-combo-trigger
.rzero-combo-list
.rzero-combo-item
.rzero-combo-chip
.rzero-combo-label
.rzero-combo-footer
.rzero-combo-tabs
.rzero-combo-tab
...
```

## License

MIT
