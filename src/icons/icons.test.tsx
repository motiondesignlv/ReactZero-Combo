import React from 'react';
import { render } from '@testing-library/react';
import {
  resolveIcons,
  resolveChevron,
  setDefaultIcons,
  resetDefaultIcons,
  registerDefaultIcons,
  registerChevronPresets,
} from './icons';
import { defaultIcons, chevronPresets } from './defaults';

// ---------------------------------------------------------------------------
// Register built-in icon providers (mirrors what entry points do)
// ---------------------------------------------------------------------------

registerDefaultIcons(() => defaultIcons);
registerChevronPresets(() => chevronPresets);

// ---------------------------------------------------------------------------
// Ensure global overrides don't leak between tests
// ---------------------------------------------------------------------------

afterEach(() => {
  resetDefaultIcons();
});

// ---------------------------------------------------------------------------
// resolveIcons
// ---------------------------------------------------------------------------

describe('resolveIcons', () => {
  it('returns all 5 built-in icons when no overrides are provided', () => {
    const icons = resolveIcons();

    expect(icons).toHaveProperty('chevronDown');
    expect(icons).toHaveProperty('check');
    expect(icons).toHaveProperty('clear');
    expect(icons).toHaveProperty('search');
    expect(icons).toHaveProperty('loading');

    // Each built-in icon should be a valid React element (an SVG component)
    expect(React.isValidElement(icons.chevronDown)).toBe(true);
    expect(React.isValidElement(icons.check)).toBe(true);
    expect(React.isValidElement(icons.clear)).toBe(true);
    expect(React.isValidElement(icons.search)).toBe(true);
    expect(React.isValidElement(icons.loading)).toBe(true);
  });

  it('uses the instance override for an overridden icon and built-in for the rest', () => {
    const customCheck = <span data-testid="custom-check">OK</span>;
    const icons = resolveIcons({ check: customCheck });

    // Overridden icon should be the custom one
    expect(icons.check).toBe(customCheck);

    // Non-overridden icons should still be valid React elements (built-in)
    expect(React.isValidElement(icons.chevronDown)).toBe(true);
    expect(React.isValidElement(icons.clear)).toBe(true);
    expect(React.isValidElement(icons.search)).toBe(true);
    expect(React.isValidElement(icons.loading)).toBe(true);

    // Verify the custom icon renders correctly
    const { getByTestId } = render(<>{icons.check}</>);
    expect(getByTestId('custom-check')).toHaveTextContent('OK');
  });
});

// ---------------------------------------------------------------------------
// setDefaultIcons / resetDefaultIcons
// ---------------------------------------------------------------------------

describe('setDefaultIcons', () => {
  it('applies a global override that takes precedence over built-in', () => {
    const globalClear = <span data-testid="global-clear">X</span>;
    setDefaultIcons({ clear: globalClear });

    const icons = resolveIcons();
    expect(icons.clear).toBe(globalClear);

    const { getByTestId } = render(<>{icons.clear}</>);
    expect(getByTestId('global-clear')).toHaveTextContent('X');
  });

  it('instance override takes precedence over global override', () => {
    const globalClear = <span data-testid="global-clear">X</span>;
    const instanceClear = <span data-testid="instance-clear">Y</span>;

    setDefaultIcons({ clear: globalClear });
    const icons = resolveIcons({ clear: instanceClear });

    expect(icons.clear).toBe(instanceClear);
    expect(icons.clear).not.toBe(globalClear);

    const { getByTestId } = render(<>{icons.clear}</>);
    expect(getByTestId('instance-clear')).toHaveTextContent('Y');
  });
});

describe('resetDefaultIcons', () => {
  it('clears global overrides so built-in icons are used again', () => {
    const globalSearch = <span>Global Search</span>;
    setDefaultIcons({ search: globalSearch });

    // Before reset, global override is active
    expect(resolveIcons().search).toBe(globalSearch);

    // After reset, built-in is restored
    resetDefaultIcons();
    const icons = resolveIcons();
    expect(icons.search).not.toBe(globalSearch);
    expect(React.isValidElement(icons.search)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// resolveChevron
// ---------------------------------------------------------------------------

describe('resolveChevron', () => {
  it('returns a React element for the "caret" preset', () => {
    const icon = resolveChevron('caret');
    expect(React.isValidElement(icon)).toBe(true);

    // Render and verify it's an SVG
    const { container } = render(<>{icon}</>);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('returns a React element for the "arrow" preset', () => {
    const icon = resolveChevron('arrow');
    expect(React.isValidElement(icon)).toBe(true);

    const { container } = render(<>{icon}</>);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('returns a React element for the "angle" preset', () => {
    const icon = resolveChevron('angle');
    expect(React.isValidElement(icon)).toBe(true);

    const { container } = render(<>{icon}</>);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('returns a React element for the "dots" preset', () => {
    const icon = resolveChevron('dots');
    expect(React.isValidElement(icon)).toBe(true);

    const { container } = render(<>{icon}</>);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('returns null for the "none" preset', () => {
    const icon = resolveChevron('none');
    expect(icon).toBeNull();
  });

  it('returns the custom icon when style is "custom" and icon is provided', () => {
    const customIcon = <span data-testid="my-chevron">V</span>;
    const icon = resolveChevron('custom', customIcon);
    expect(icon).toBe(customIcon);

    const { getByTestId } = render(<>{icon}</>);
    expect(getByTestId('my-chevron')).toHaveTextContent('V');
  });

  it('returns null when style is "custom" but no icon provided', () => {
    const icon = resolveChevron('custom', undefined);
    expect(icon).toBeNull();
  });

  it('each preset returns a distinct icon (not the same reference)', () => {
    const caret = resolveChevron('caret');
    const arrow = resolveChevron('arrow');
    const angle = resolveChevron('angle');
    const dots = resolveChevron('dots');

    // They should all be different from each other
    expect(caret).not.toBe(arrow);
    expect(caret).not.toBe(angle);
    expect(caret).not.toBe(dots);
    expect(arrow).not.toBe(angle);
    expect(arrow).not.toBe(dots);
    expect(angle).not.toBe(dots);
  });
});
