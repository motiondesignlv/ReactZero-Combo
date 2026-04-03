# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-03-25

### Added

- **`useCombo` hook** — Headless hook with 9 prop getters, 8 imperative actions, full state exposure
  - `getInputProps`, `getToggleButtonProps`, `getLabelProps`, `getClearButtonProps`, `getMenuProps`, `getItemProps`, `getGroupProps`, `getChevronProps`, `getTriggerProps`
  - Actions: `openMenu`, `closeMenu`, `toggleMenu`, `selectItem`, `removeItem`, `clearSelection`, `setInputValue`, `reset`
- **`<Combo>` component** — Pre-built component with render props
  - `renderItem`, `renderEmpty`, `renderLoading`, `renderError`, `renderFooter`, `renderTrigger`, `renderGroupHeader`
  - `classNames` slots for all sub-elements
  - `label` prop with automatic `<label>` association
  - `variant="select"` for non-editable dropdown
  - `groups` prop for grouped item rendering
  - `theme` prop for built-in theme switching
- **Portal component** — Renders listbox in a portal to escape overflow containers
- **LiveRegion component** — ARIA live region for screen reader announcements
- **Pure state machine** — 7 status states, 16+ actions, pure reducer
- **Keyboard navigation** — ArrowUp/Down, Enter, Escape, Home, End, Tab
- **CSS custom properties** — 40+ design tokens for full visual customization
- **Built-in themes** — Default, dark, and high-contrast
- **Icon system** — 5 swappable icon slots + 6 chevron styles (caret, arrow, angle, plusminus, dots, none)
- **Dual entry points** — `@reactzero/combo/hook` (4.2 kB) and `@reactzero/combo` (5.5 kB)
- **332 tests** — Full coverage with jest-axe accessibility validation
- **TypeScript** — Full generic type inference
