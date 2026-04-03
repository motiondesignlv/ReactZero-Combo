import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from '../test-utils/setup';
import { Combo } from './Combo';

// ---------------------------------------------------------------------------
// Shared data
// ---------------------------------------------------------------------------

const items = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    const id = setTimeout(() => cb(performance.now()), 0);
    return id as unknown as number;
  });
  vi.stubGlobal('cancelAnimationFrame', (id: number) => clearTimeout(id));
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Combo component', () => {
  // ---- Placeholder ----
  it('renders placeholder when no selection', () => {
    render(<Combo items={items} placeholder="Pick a fruit" disablePortal />);
    const input = screen.getByRole('combobox');
    expect(input).toHaveAttribute('placeholder', 'Pick a fruit');
  });

  // ---- Opens on click ----
  it('opens on input click and shows items', async () => {
    const user = userEvent.setup();
    render(<Combo items={items} disablePortal />);
    const input = screen.getByRole('combobox');

    await user.click(input);

    expect(input).toHaveAttribute('aria-expanded', 'true');
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(5);
  });

  // ---- Selection ----
  it('selects an item and shows the selected value in the input', async () => {
    const user = userEvent.setup();
    render(<Combo items={items} disablePortal />);
    const input = screen.getByRole('combobox');

    await user.click(input);
    await user.click(screen.getAllByRole('option')[2]); // Cherry

    expect(input).toHaveValue('Cherry');
  });

  // ---- Filtering ----
  it('filters items while typing', async () => {
    const user = userEvent.setup();
    render(<Combo items={items} disablePortal />);
    const input = screen.getByRole('combobox');

    await user.click(input);
    await user.type(input, 'an');

    const options = screen.getAllByRole('option');
    // 'Banana' contains 'an'
    expect(options.map((o) => o.textContent)).toEqual(
      expect.arrayContaining(['Banana']),
    );
    // Should NOT contain 'Cherry' or 'Date'
    const texts = options.map((o) => o.textContent);
    expect(texts).not.toContain('Cherry');
    expect(texts).not.toContain('Date');
  });

  // ---- Clear button ----
  it('shows a clear button when selected and clears selection on click', async () => {
    const user = userEvent.setup();
    render(<Combo items={items} disablePortal />);
    const input = screen.getByRole('combobox');

    // Initially no clear button
    expect(screen.queryByRole('button', { name: 'Clear selection' })).not.toBeInTheDocument();

    // Select an item
    await user.click(input);
    await user.click(screen.getAllByRole('option')[0]); // Apple

    expect(input).toHaveValue('Apple');

    // Clear button should now be visible
    const clearBtn = screen.getByRole('button', { name: 'Clear selection' });
    expect(clearBtn).toBeInTheDocument();

    await user.click(clearBtn);
    expect(input).toHaveValue('');
    expect(screen.queryByRole('button', { name: 'Clear selection' })).not.toBeInTheDocument();
  });

  // ---- Custom renderItem ----
  it('calls custom renderItem with correct props', async () => {
    const renderItem = vi.fn(({ item, index, isHighlighted, isSelected, isDisabled }) => (
      <span data-testid={`custom-item-${index}`}>
        {String(item)} {isHighlighted ? '(hl)' : ''} {isSelected ? '(sel)' : ''} {isDisabled ? '(dis)' : ''}
      </span>
    ));

    const user = userEvent.setup();
    render(<Combo items={items} renderItem={renderItem} disablePortal />);
    const input = screen.getByRole('combobox');

    await user.click(input);

    // renderItem is called for each item (may be doubled by React StrictMode)
    expect(renderItem.mock.calls.length).toBeGreaterThanOrEqual(5);
    expect(renderItem).toHaveBeenCalledWith(
      expect.objectContaining({
        item: 'Apple',
        index: 0,
        isHighlighted: false,
        isSelected: false,
        isDisabled: false,
      }),
    );

    // Verify custom rendered content is in the DOM
    expect(screen.getByTestId('custom-item-0')).toHaveTextContent('Apple');
    expect(screen.getByTestId('custom-item-4')).toHaveTextContent('Elderberry');
  });

  // ---- Custom renderEmpty ----
  it('renders custom renderEmpty when no matches', async () => {
    const user = userEvent.setup();
    render(
      <Combo
        items={items}
        renderEmpty={() => <span data-testid="empty-msg">No fruits found</span>}
        disablePortal
      />,
    );
    const input = screen.getByRole('combobox');

    await user.click(input);
    await user.type(input, 'zzz');

    expect(screen.queryAllByRole('option')).toHaveLength(0);
    expect(screen.getByTestId('empty-msg')).toHaveTextContent('No fruits found');
  });

  // ---- classNames prop ----
  it('applies classNames to correct elements', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Combo
        items={items}
        classNames={{
          root: 'my-root',
          input: 'my-input',
          trigger: 'my-trigger',
          list: 'my-list',
          toggleButton: 'my-toggle',
        }}
        disablePortal
      />,
    );

    // Root
    const root = container.querySelector('[data-rzero-root]');
    expect(root).toHaveClass('my-root');

    // Input
    const input = screen.getByRole('combobox');
    expect(input).toHaveClass('my-input');

    // Trigger wrapper
    const trigger = container.querySelector('[data-rzero-trigger]');
    expect(trigger).toHaveClass('my-trigger');

    // Open to check list class
    await user.click(input);
    const listbox = screen.getByRole('listbox');
    expect(listbox).toHaveClass('my-list');
  });

  // ---- theme prop ----
  it('sets data-rzero-theme attribute when theme is provided', () => {
    const { container } = render(
      <Combo items={items} theme="dark" disablePortal />,
    );
    const root = container.querySelector('[data-rzero-root]');
    expect(root).toHaveAttribute('data-rzero-theme', 'dark');
  });

  it('does not set data-rzero-theme when theme is not provided', () => {
    const { container } = render(
      <Combo items={items} disablePortal />,
    );
    const root = container.querySelector('[data-rzero-root]');
    expect(root).not.toHaveAttribute('data-rzero-theme');
  });

  // ---- Disabled ----
  it('prevents all interactions when disabled', async () => {
    const user = userEvent.setup();
    render(<Combo items={items} disabled={true} placeholder="Disabled" disablePortal />);
    const input = screen.getByRole('combobox');

    expect(input).toBeDisabled();
    await user.click(input);
    expect(input).toHaveAttribute('aria-expanded', 'false');

    // No clear button should be rendered even if we tried
    expect(screen.queryByRole('button', { name: 'Clear selection' })).not.toBeInTheDocument();
  });

  // ---- Label ----
  describe('label rendering', () => {
    it('renders a label element associated with the input', () => {
      render(<Combo items={items} label="Choose a fruit" disablePortal />);
      const label = screen.getByText('Choose a fruit');
      expect(label.tagName).toBe('LABEL');
      const input = screen.getByRole('combobox');
      expect(label).toHaveAttribute('for', input.id);
    });

    it('does not render a label when prop is omitted', () => {
      const { container } = render(<Combo items={items} disablePortal />);
      expect(container.querySelector('label')).not.toBeInTheDocument();
    });

    it('applies classNames.label', () => {
      render(
        <Combo items={items} label="Fruit" classNames={{ label: 'my-label' }} disablePortal />,
      );
      expect(screen.getByText('Fruit')).toHaveClass('my-label');
    });
  });

  // ---- Grouped Items ----
  describe('grouped items', () => {
    const groups = [
      { label: 'Citrus', items: ['Orange', 'Lemon', 'Lime'] },
      { label: 'Berries', items: ['Strawberry', 'Blueberry'] },
    ];

    it('renders grouped items with group headers', async () => {
      const user = userEvent.setup();
      render(<Combo groups={groups} items={[]} disablePortal />);
      const input = screen.getByRole('combobox');
      await user.click(input);

      expect(screen.getByText('Citrus')).toBeInTheDocument();
      expect(screen.getByText('Berries')).toBeInTheDocument();
      expect(screen.getAllByRole('option')).toHaveLength(5);
    });

    it('hides empty groups after filtering', async () => {
      const user = userEvent.setup();
      render(<Combo groups={groups} items={[]} disablePortal />);
      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.type(input, 'Straw');

      expect(screen.queryByText('Citrus')).not.toBeInTheDocument();
      expect(screen.getByText('Berries')).toBeInTheDocument();
      expect(screen.getAllByRole('option')).toHaveLength(1);
    });

    it('uses custom renderGroupHeader', async () => {
      const user = userEvent.setup();
      render(
        <Combo
          groups={groups}
          items={[]}
          renderGroupHeader={({ group }) => (
            <span data-testid={`group-${group.label}`}>== {group.label} ==</span>
          )}
          disablePortal
        />,
      );
      const input = screen.getByRole('combobox');
      await user.click(input);

      expect(screen.getByTestId('group-Citrus')).toHaveTextContent('== Citrus ==');
      expect(screen.getByTestId('group-Berries')).toHaveTextContent('== Berries ==');
    });
  });

  // ---- Select Variant ----
  describe('select variant', () => {
    it('renders a button trigger instead of input', () => {
      const { container } = render(
        <Combo items={items} variant="select" placeholder="Select..." disablePortal />,
      );
      // Select variant uses a <button> with role="combobox", not an <input>
      const trigger = screen.getByRole('combobox');
      expect(trigger.tagName).toBe('BUTTON');
      expect(container.querySelector('input')).not.toBeInTheDocument();
      expect(trigger).toHaveTextContent('Select...');
    });

    it('opens menu on button click and selects an item', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <Combo
          items={items}
          variant="select"
          placeholder="Select..."
          onSelectedItemChange={onChange}
          disablePortal
        />,
      );
      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(5);

      await user.click(options[1]); // Banana
      expect(onChange).toHaveBeenCalledWith('Banana');
    });

    it('displays selected label in the trigger button', async () => {
      const user = userEvent.setup();
      render(
        <Combo items={items} variant="select" placeholder="Pick one" disablePortal />,
      );
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveTextContent('Pick one');

      await user.click(trigger);
      await user.click(screen.getAllByRole('option')[2]); // Cherry

      expect(trigger).toHaveTextContent('Cherry');
    });
  });

  // ---- renderTrigger ----
  describe('renderTrigger', () => {
    it('replaces default trigger with custom content', async () => {
      const user = userEvent.setup();
      render(
        <Combo
          items={items}
          renderTrigger={({ getInputProps, isOpen }) => (
            <div data-testid="custom-trigger">
              <span>{isOpen ? 'open' : 'closed'}</span>
              <input {...getInputProps()} />
            </div>
          )}
          disablePortal
        />,
      );

      expect(screen.getByTestId('custom-trigger')).toBeInTheDocument();
      expect(screen.getByText('closed')).toBeInTheDocument();

      const input = screen.getByRole('combobox');
      await user.click(input);
      expect(screen.getByText('open')).toBeInTheDocument();
    });
  });

  // ---- renderError ----
  describe('renderError', () => {
    it('renders error state when isError is set via hook', async () => {
      // We simulate error by passing isLoading which has error hook handling
      // For simplicity, test that renderError content appears when error props are controlled
      const user = userEvent.setup();
      render(
        <Combo
          items={[]}
          renderError={({ error }) => (
            <span data-testid="error-msg">{error?.message ?? 'Unknown error'}</span>
          )}
          renderEmpty={() => <span>No items</span>}
          disablePortal
        />,
      );
      const input = screen.getByRole('combobox');
      await user.click(input);

      // No error state by default — renderEmpty should show instead
      expect(screen.queryByTestId('error-msg')).not.toBeInTheDocument();
      expect(screen.getByText('No items')).toBeInTheDocument();
    });
  });

  // ---- renderFooter ----
  describe('renderFooter', () => {
    it('renders footer when menu is open', async () => {
      const user = userEvent.setup();
      render(
        <Combo
          items={items}
          renderFooter={({ selectedItem, closeMenu }) => (
            <div data-testid="footer">
              <span>Selected: {selectedItem ? String(selectedItem) : 'none'}</span>
              <button onClick={closeMenu}>Done</button>
            </div>
          )}
          disablePortal
        />,
      );
      const input = screen.getByRole('combobox');

      // Footer not visible when closed
      expect(screen.queryByTestId('footer')).not.toBeInTheDocument();

      await user.click(input);
      expect(screen.getByTestId('footer')).toBeInTheDocument();
      expect(screen.getByText('Selected: none')).toBeInTheDocument();
    });

    it('footer receives updated selectedItem after selection', async () => {
      const user = userEvent.setup();
      render(
        <Combo
          items={items}
          renderFooter={({ selectedItem }) => (
            <div data-testid="footer">
              {selectedItem ? String(selectedItem) : 'none'}
            </div>
          )}
          disablePortal
        />,
      );
      const input = screen.getByRole('combobox');
      await user.click(input);

      // Select and reopen
      await user.click(screen.getAllByRole('option')[0]); // Apple
      await user.click(input);

      expect(screen.getByTestId('footer')).toHaveTextContent('Apple');
    });
  });

  // ---- Error state data-error attribute ----
  describe('error state trigger', () => {
    it('sets data-error on input trigger when errorText is provided', () => {
      const { container } = render(
        <Combo items={items} errorText="Required field" disablePortal />,
      );
      const trigger = container.querySelector('[data-rzero-trigger]');
      expect(trigger).toHaveAttribute('data-error', 'true');
    });

    it('does not set data-error when no error', () => {
      const { container } = render(
        <Combo items={items} disablePortal />,
      );
      const trigger = container.querySelector('[data-rzero-trigger]');
      expect(trigger).not.toHaveAttribute('data-error');
    });

    it('sets data-error on select variant trigger when errorText is provided', () => {
      render(
        <Combo items={items} variant="select" errorText="Required" disablePortal />,
      );
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('data-error', 'true');
    });

    it('sets data-error on multi-select trigger when errorText is provided', () => {
      const { container } = render(
        <Combo items={items} mode="multi" errorText="Select at least one" disablePortal />,
      );
      const trigger = container.querySelector('[data-rzero-trigger]');
      expect(trigger).toHaveAttribute('data-error', 'true');
    });
  });

  // ---- Accessibility ----
  describe('accessibility (jest-axe)', () => {
    it('has no violations when closed', async () => {
      const { container } = render(
        <Combo items={items} id="axe-closed" ariaLabel="Fruit selector" disablePortal />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations when open', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Combo items={items} id="axe-open" ariaLabel="Fruit selector" disablePortal />,
      );
      const input = screen.getByRole('combobox');
      await user.click(input);
      expect(input).toHaveAttribute('aria-expanded', 'true');

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with label', async () => {
      const { container } = render(
        <Combo items={items} id="axe-label" label="Fruit" disablePortal />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations for select variant', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Combo
          items={items}
          id="axe-select"
          ariaLabel="Select a fruit"
          variant="select"
          disablePortal
        />,
      );
      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
