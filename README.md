# @reactzero/combo

Headless, accessible React combo & select. **Zero dependencies.** ARIA 1.2 compliant, < 7 kB gzipped.

[![npm version](https://img.shields.io/npm/v/@reactzero/combo)](https://www.npmjs.com/package/@reactzero/combo)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@reactzero/combo)](https://bundlephobia.com/package/@reactzero/combo)
[![license](https://img.shields.io/npm/l/@reactzero/combo)](./LICENSE)

## Features

- **Zero dependencies** — Only peer depends on React 18+. No runtime surprises.
- **Headless architecture** — Full control over markup and styling via the `useCombo` hook
- **Pre-built component** — Drop-in `<Combo>` with render props for quick setup
- **ARIA 1.2 compliant** — Keyboard navigation, screen reader support, live region announcements
- **Tiny bundle** — Hook: 4.8 kB, Full: 6.7 kB, CSS: 2.5 kB (all brotli)
- **CSS custom properties** — 40+ design tokens, built-in dark and high-contrast themes
- **TypeScript first** — Full generic type inference on all APIs
- **Multiple variants** — Combobox, select dropdown, grouped items, custom triggers

## AI Reference

Download the [AI reference file](./ai-reference.md) and feed it to your AI coding assistant for complete API docs, examples, and patterns.

## Installation

```bash
npm install @reactzero/combo
```

## Quick Start — Headless Hook

```tsx
import { useCombo } from '@reactzero/combo/hook';

function MyCombo() {
  const items = ['Apple', 'Banana', 'Cherry', 'Date'];

  const {
    isOpen,
    filteredItems,
    highlightedIndex,
    selectedItem,
    getLabelProps,
    getInputProps,
    getToggleButtonProps,
    getClearButtonProps,
    getMenuProps,
    getItemProps,
    getChevronProps,
    hasSelection,
    icons,
    chevronIcon,
  } = useCombo({ items });

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
      <ul {...getMenuProps()} style={{ display: isOpen ? 'block' : 'none' }}>
        {isOpen &&
          filteredItems.map((item, index) => (
            <li
              key={index}
              {...getItemProps({ item, index })}
              style={{
                background: highlightedIndex === index ? '#dbeafe' : 'transparent',
                fontWeight: selectedItem === item ? 600 : 400,
              }}
            >
              {String(item)}
            </li>
          ))}
      </ul>
    </div>
  );
}
```

## Quick Start — Pre-built Component

```tsx
import { Combo } from '@reactzero/combo';
import '@reactzero/combo/styles';

function App() {
  return (
    <Combo
      items={['Apple', 'Banana', 'Cherry', 'Date']}
      label="Favorite Fruit"
      placeholder="Search fruits..."
      onSelectedItemChange={(item) => console.log('Selected:', item)}
      renderItem={({ item, isHighlighted, isSelected }) => (
        <div style={{ fontWeight: isSelected ? 600 : 400 }}>
          {String(item)}
        </div>
      )}
    />
  );
}
```

## Import Paths

| Path | Size | Description |
|------|------|-------------|
| `@reactzero/combo/hook` | 4.8 kB | Hook + types only |
| `@reactzero/combo` | 6.7 kB | Hook + Combo + Portal + LiveRegion |
| `@reactzero/combo/styles` | 2.5 kB | Base structural CSS |
| `@reactzero/combo/themes/dark.css` | — | Dark theme tokens |
| `@reactzero/combo/themes/high-contrast.css` | — | High-contrast theme tokens |

## Variants

### Select Dropdown

```tsx
<Combo
  items={['United States', 'Canada', 'Mexico']}
  variant="select"
  placeholder="Choose a country..."
/>
```

### Grouped Items

```tsx
<Combo
  groups={[
    { label: 'Fruits', items: ['Apple', 'Banana'] },
    { label: 'Vegetables', items: ['Carrot', 'Broccoli'] },
  ]}
  items={[]}
  placeholder="Search..."
/>
```

### Custom Trigger

```tsx
<Combo
  items={items}
  renderTrigger={({ getInputProps, getToggleButtonProps, isOpen, chevronIcon }) => (
    <div className="my-trigger">
      <input {...getInputProps()} />
      <button {...getToggleButtonProps()}>{chevronIcon}</button>
    </div>
  )}
/>
```

## Theming

Override CSS custom properties to customize the appearance:

```css
.my-combobox {
  --rzero-combo-input-border: 2px solid #6366f1;
  --rzero-combo-input-focus-ring: 0 0 0 3px rgba(99, 102, 241, 0.3);
  --rzero-combo-item-highlighted-bg: #e0e7ff;
  --rzero-combo-item-selected-color: #4f46e5;
}
```

Or use built-in themes:

```tsx
<Combo items={items} theme="dark" />
```

## Documentation

- [Getting Started](https://reactzero-combo.dev/guide/getting-started)
- [Headless Usage](https://reactzero-combo.dev/guide/headless-usage)
- [Pre-built Component](https://reactzero-combo.dev/guide/pre-built)
- [Theming](https://reactzero-combo.dev/guide/theming)
- [Accessibility](https://reactzero-combo.dev/guide/accessibility)
- [API Reference — useCombo](https://reactzero-combo.dev/api/use-combo)
- [API Reference — Combo](https://reactzero-combo.dev/api/combo)

## License

[MIT](./LICENSE)
