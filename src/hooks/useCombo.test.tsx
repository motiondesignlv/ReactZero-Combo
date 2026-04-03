import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from '../test-utils/setup';
import { useCombo } from './useCombo';
import type { UseComboOptions } from '../types';

// ---------------------------------------------------------------------------
// Test component
// ---------------------------------------------------------------------------

function TestCombo<T>(props: UseComboOptions<T> & { placeholder?: string }) {
  const { placeholder, ...hookOptions } = props;
  const combo = useCombo(hookOptions);
  return (
    <div>
      <label {...combo.getLabelProps()}>Label</label>
      <input {...combo.getInputProps({ placeholder })} />
      <button {...combo.getToggleButtonProps()}>Toggle</button>
      {combo.hasSelection && <button {...combo.getClearButtonProps()}>Clear</button>}
      <ul {...combo.getMenuProps()} hidden={!combo.isOpen}>
        {combo.isOpen && combo.filteredItems.map((item, index) => (
          <li key={index} {...combo.getItemProps({ item, index })}>
            {(hookOptions.itemToString ?? String)(item)}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared data
// ---------------------------------------------------------------------------

const items = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Stub requestAnimationFrame so the announce module works in jsdom. */
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

describe('useCombo', () => {
  // ---- ARIA attributes ----
  describe('ARIA attributes', () => {
    it('renders with role="combobox" on the input', () => {
      render(<TestCombo items={items} />);
      const input = screen.getByRole('combobox');
      expect(input).toBeInTheDocument();
      expect(input.tagName).toBe('INPUT');
    });

    it('has aria-expanded="false" when closed', () => {
      render(<TestCombo items={items} />);
      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('aria-expanded', 'false');
    });

    it('has aria-haspopup="listbox" on the input', () => {
      render(<TestCombo items={items} />);
      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('aria-haspopup', 'listbox');
    });

    it('has aria-controls pointing to the listbox id', () => {
      render(<TestCombo items={items} />);
      const input = screen.getByRole('combobox');
      const listbox = screen.getByRole('listbox', { hidden: true });
      expect(input).toHaveAttribute('aria-controls', listbox.id);
    });

    it('renders a listbox with role="listbox"', () => {
      render(<TestCombo items={items} />);
      // The listbox is hidden initially
      const listbox = screen.getByRole('listbox', { hidden: true });
      expect(listbox).toBeInTheDocument();
    });
  });

  // ---- Opens on click ----
  describe('opening the menu', () => {
    it('opens on click and shows all items', async () => {
      const user = userEvent.setup();
      render(<TestCombo items={items} />);
      const input = screen.getByRole('combobox');

      await user.click(input);

      expect(input).toHaveAttribute('aria-expanded', 'true');
      const listbox = screen.getByRole('listbox');
      const options = within(listbox).getAllByRole('option');
      expect(options).toHaveLength(5);
      expect(options.map((o) => o.textContent)).toEqual(items);
    });

    it('opens on ArrowDown and highlights the first item', async () => {
      const user = userEvent.setup();
      render(<TestCombo items={items} />);
      const input = screen.getByRole('combobox');

      await user.click(input); // focus
      // Close menu first to test ArrowDown from closed state
      await user.keyboard('{Escape}');
      expect(input).toHaveAttribute('aria-expanded', 'false');

      await user.keyboard('{ArrowDown}');

      expect(input).toHaveAttribute('aria-expanded', 'true');
      const options = screen.getAllByRole('option');
      expect(options[0]).toHaveAttribute('data-highlighted', 'true');
    });
  });

  // ---- Filtering ----
  describe('filtering', () => {
    it('filters items when typing', async () => {
      const user = userEvent.setup();
      render(<TestCombo items={items} />);
      const input = screen.getByRole('combobox');

      await user.click(input);
      await user.type(input, 'ch');

      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(1);
      expect(options[0]).toHaveTextContent('Cherry');
    });
  });

  // ---- Selection ----
  describe('selection', () => {
    it('selects an item on click, closes menu, input shows selected label', async () => {
      const user = userEvent.setup();
      render(<TestCombo items={items} />);
      const input = screen.getByRole('combobox');

      await user.click(input);
      const options = screen.getAllByRole('option');
      await user.click(options[2]); // Cherry

      expect(input).toHaveValue('Cherry');
      expect(input).toHaveAttribute('aria-expanded', 'false');
    });

    it('selects the highlighted item on Enter', async () => {
      const user = userEvent.setup();
      render(<TestCombo items={items} />);
      const input = screen.getByRole('combobox');

      await user.click(input);
      // ArrowDown to highlight first item (index 0 -> Apple)
      await user.keyboard('{ArrowDown}');
      // ArrowDown again to highlight second item (index 1 -> Banana)
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');

      expect(input).toHaveValue('Banana');
      expect(input).toHaveAttribute('aria-expanded', 'false');
    });
  });

  // ---- Escape ----
  describe('Escape key', () => {
    it('closes the menu and reverts input value', async () => {
      const user = userEvent.setup();
      render(<TestCombo items={items} />);
      const input = screen.getByRole('combobox');

      // First select an item
      await user.click(input);
      await user.click(screen.getAllByRole('option')[0]); // Apple
      expect(input).toHaveValue('Apple');

      // Open menu again and type something
      await user.click(input);
      await user.clear(input);
      await user.type(input, 'xyz');

      // Escape should revert
      await user.keyboard('{Escape}');

      expect(input).toHaveAttribute('aria-expanded', 'false');
      expect(input).toHaveValue('Apple');
    });
  });

  // ---- Clear button ----
  describe('clear button', () => {
    it('clears the selection when clicked', async () => {
      const user = userEvent.setup();
      render(<TestCombo items={items} />);
      const input = screen.getByRole('combobox');

      // Select an item first
      await user.click(input);
      await user.click(screen.getAllByRole('option')[1]); // Banana
      expect(input).toHaveValue('Banana');

      // Clear button should now be visible
      const clearBtn = screen.getByRole('button', { name: 'Clear selection' });
      expect(clearBtn).toBeInTheDocument();
      await user.click(clearBtn);

      expect(input).toHaveValue('');
      expect(screen.queryByRole('button', { name: 'Clear selection' })).not.toBeInTheDocument();
    });
  });

  // ---- Toggle button ----
  describe('toggle button', () => {
    it('toggles the menu open and closed', async () => {
      const user = userEvent.setup();
      render(<TestCombo items={items} />);
      const input = screen.getByRole('combobox');
      const toggleBtn = screen.getByRole('button', { name: /open options/i });

      // Open
      await user.click(toggleBtn);
      expect(input).toHaveAttribute('aria-expanded', 'true');

      // Close
      await user.click(toggleBtn);
      expect(input).toHaveAttribute('aria-expanded', 'false');
    });
  });

  // ---- Disabled ----
  describe('disabled state', () => {
    it('prevents interaction when disabled', async () => {
      const user = userEvent.setup();
      render(<TestCombo items={items} disabled={true} />);
      const input = screen.getByRole('combobox');

      expect(input).toBeDisabled();
      await user.click(input);
      expect(input).toHaveAttribute('aria-expanded', 'false');
    });
  });

  // ---- Home / End navigation ----
  describe('Home/End navigation', () => {
    it('Home highlights the first item', async () => {
      const user = userEvent.setup();
      render(<TestCombo items={items} />);
      const input = screen.getByRole('combobox');

      await user.click(input);
      // Go to end first
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');

      // Now press Home
      await user.keyboard('{Home}');

      const options = screen.getAllByRole('option');
      expect(options[0]).toHaveAttribute('data-highlighted', 'true');
    });

    it('End highlights the last item', async () => {
      const user = userEvent.setup();
      render(<TestCombo items={items} />);
      const input = screen.getByRole('combobox');

      await user.click(input);
      await user.keyboard('{ArrowDown}'); // highlight first

      // Now press End
      await user.keyboard('{End}');

      const options = screen.getAllByRole('option');
      expect(options[options.length - 1]).toHaveAttribute('data-highlighted', 'true');
    });
  });

  // ---- Callbacks ----
  describe('callbacks', () => {
    it('fires onSelectedItemChange when an item is selected', async () => {
      const onSelectedItemChange = vi.fn();
      const user = userEvent.setup();
      render(
        <TestCombo items={items} onSelectedItemChange={onSelectedItemChange} />,
      );
      const input = screen.getByRole('combobox');

      await user.click(input);
      await user.click(screen.getAllByRole('option')[3]); // Date

      expect(onSelectedItemChange).toHaveBeenCalledWith('Date');
    });

    it('fires onIsOpenChange when the menu opens and closes', async () => {
      const onIsOpenChange = vi.fn();
      const user = userEvent.setup();
      render(<TestCombo items={items} onIsOpenChange={onIsOpenChange} />);
      const input = screen.getByRole('combobox');

      await user.click(input); // opens
      expect(onIsOpenChange).toHaveBeenCalledWith(true);

      await user.keyboard('{Escape}'); // closes
      expect(onIsOpenChange).toHaveBeenCalledWith(false);
    });
  });

  // ---- renderHook isolated test ----
  describe('renderHook', () => {
    it('returns initial state values via renderHook', () => {
      const { result } = renderHook(() =>
        useCombo({ items }),
      );

      expect(result.current.isOpen).toBe(false);
      expect(result.current.inputValue).toBe('');
      expect(result.current.selectedItem).toBeNull();
      expect(result.current.filteredItems).toEqual(items);
      expect(result.current.hasSelection).toBe(false);
      expect(result.current.highlightedIndex).toBe(-1);
    });

    it('opens and closes via imperative actions', () => {
      const { result } = renderHook(() =>
        useCombo({ items }),
      );

      act(() => {
        result.current.openMenu();
      });
      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.closeMenu();
      });
      expect(result.current.isOpen).toBe(false);
    });

    it('selects an item via imperative selectItem', () => {
      const { result } = renderHook(() =>
        useCombo({ items }),
      );

      act(() => {
        result.current.selectItem('Cherry');
      });

      expect(result.current.selectedItem).toBe('Cherry');
      expect(result.current.inputValue).toBe('Cherry');
      expect(result.current.hasSelection).toBe(true);
    });

    it('clears selection via imperative clearSelection', () => {
      const { result } = renderHook(() =>
        useCombo({ items }),
      );

      act(() => {
        result.current.selectItem('Date');
      });
      expect(result.current.selectedItem).toBe('Date');

      act(() => {
        result.current.clearSelection();
      });
      expect(result.current.selectedItem).toBeNull();
      expect(result.current.inputValue).toBe('');
    });
  });

  // ---- Accessibility ----
  describe('accessibility (jest-axe)', () => {
    it('has no violations when closed', async () => {
      const { container } = render(
        <TestCombo items={items} id="axe-test" />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations when open', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <TestCombo items={items} id="axe-test-open" />,
      );

      const input = screen.getByRole('combobox');
      await user.click(input);

      expect(input).toHaveAttribute('aria-expanded', 'true');

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // ---- Multi-select mode ----
  describe('multi-select mode', () => {
    it('hasSelection is true when selectedItems is non-empty', () => {
      const { result } = renderHook(() =>
        useCombo({ items, mode: 'multi' }),
      );

      expect(result.current.hasSelection).toBe(false);

      act(() => {
        result.current.selectItem('Apple');
      });

      expect(result.current.hasSelection).toBe(true);
      expect(result.current.selectedItems).toEqual(['Apple']);
    });

    it('getMenuProps returns aria-multiselectable=true in multi mode', () => {
      const { result } = renderHook(() =>
        useCombo({ items, mode: 'multi' }),
      );

      const menuProps = result.current.getMenuProps();
      expect(menuProps['aria-multiselectable']).toBe(true);
    });

    it('selectAll selects all items', () => {
      const { result } = renderHook(() =>
        useCombo({ items, mode: 'multi' }),
      );

      act(() => {
        result.current.openMenu();
      });

      act(() => {
        result.current.selectAll();
      });

      expect(result.current.selectedItems).toEqual(items);
    });

    it('clearSelection clears selectedItems', () => {
      const { result } = renderHook(() =>
        useCombo({ items, mode: 'multi' }),
      );

      act(() => {
        result.current.selectItem('Apple');
      });
      act(() => {
        result.current.selectItem('Banana');
      });
      expect(result.current.selectedItems).toEqual(['Apple', 'Banana']);

      act(() => {
        result.current.clearSelection();
      });

      expect(result.current.selectedItems).toEqual([]);
      expect(result.current.hasSelection).toBe(false);
    });

    it('onSelectedItemsChange fires when items toggle', () => {
      const onSelectedItemsChange = vi.fn();
      const { result } = renderHook(() =>
        useCombo({ items, mode: 'multi', onSelectedItemsChange }),
      );

      act(() => {
        result.current.selectItem('Cherry');
      });

      expect(onSelectedItemsChange).toHaveBeenCalledWith(['Cherry']);

      act(() => {
        result.current.selectItem('Date');
      });

      expect(onSelectedItemsChange).toHaveBeenCalledWith(['Cherry', 'Date']);

      // Toggle Cherry off
      act(() => {
        result.current.selectItem('Cherry');
      });

      expect(onSelectedItemsChange).toHaveBeenCalledWith(['Date']);
    });
  });
});
