import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TabbedCombo } from './TabbedCombo';
import type { TabConfig } from './TabbedCombo';

type Item = { label: string; value: string };

const fruits: Item[] = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
];

const vegetables: Item[] = [
  { label: 'Carrot', value: 'carrot' },
  { label: 'Spinach', value: 'spinach' },
];

const tabs: TabConfig<Item>[] = [
  { id: 'fruits', label: 'Fruits', items: fruits },
  { id: 'vegetables', label: 'Vegetables', items: vegetables },
];

beforeEach(() => {
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    const id = setTimeout(() => cb(performance.now()), 0);
    return id;
  });
});

describe('TabbedCombo', () => {
  it('renders the input trigger', () => {
    render(
      <TabbedCombo
        tabs={tabs}
        itemToString={(item) => item?.label ?? ''}
        itemToValue={(item) => item.value}
        placeholder="Search..."
      />,
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('shows tab strip when menu opens', async () => {
    const user = userEvent.setup();
    render(
      <TabbedCombo
        tabs={tabs}
        itemToString={(item) => item?.label ?? ''}
        itemToValue={(item) => item.value}
        placeholder="Search..."
      />,
    );

    const input = screen.getByRole('combobox');
    await user.click(input);

    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Fruits' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Vegetables' })).toBeInTheDocument();
  });

  it('displays items from the active tab', async () => {
    const user = userEvent.setup();
    render(
      <TabbedCombo
        tabs={tabs}
        itemToString={(item) => item?.label ?? ''}
        itemToValue={(item) => item.value}
        placeholder="Search..."
      />,
    );

    const input = screen.getByRole('combobox');
    await user.click(input);

    // Default first tab (Fruits)
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Banana')).toBeInTheDocument();
    expect(screen.queryByText('Carrot')).toBeNull();
  });

  it('switches tabs on click', async () => {
    const user = userEvent.setup();
    render(
      <TabbedCombo
        tabs={tabs}
        itemToString={(item) => item?.label ?? ''}
        itemToValue={(item) => item.value}
        placeholder="Search..."
      />,
    );

    const input = screen.getByRole('combobox');
    await user.click(input);

    // Click Vegetables tab
    await user.click(screen.getByRole('tab', { name: 'Vegetables' }));

    expect(screen.getByText('Carrot')).toBeInTheDocument();
    expect(screen.getByText('Spinach')).toBeInTheDocument();
  });

  it('calls onTabChange when tab is switched', async () => {
    const user = userEvent.setup();
    const onTabChange = vi.fn();

    render(
      <TabbedCombo
        tabs={tabs}
        itemToString={(item) => item?.label ?? ''}
        itemToValue={(item) => item.value}
        placeholder="Search..."
        onTabChange={onTabChange}
      />,
    );

    const input = screen.getByRole('combobox');
    await user.click(input);

    await user.click(screen.getByRole('tab', { name: 'Vegetables' }));
    expect(onTabChange).toHaveBeenCalledWith('vegetables');
  });

  it('supports defaultActiveTab', async () => {
    const user = userEvent.setup();

    render(
      <TabbedCombo
        tabs={tabs}
        itemToString={(item) => item?.label ?? ''}
        itemToValue={(item) => item.value}
        placeholder="Search..."
        defaultActiveTab="vegetables"
      />,
    );

    const input = screen.getByRole('combobox');
    await user.click(input);

    expect(screen.getByText('Carrot')).toBeInTheDocument();
    expect(screen.queryByText('Apple')).toBeNull();
  });

  it('renders tab badges', async () => {
    const user = userEvent.setup();
    const tabsWithBadges: TabConfig<Item>[] = [
      { id: 'fruits', label: 'Fruits', items: fruits, badge: 2 },
      { id: 'vegetables', label: 'Vegetables', items: vegetables, badge: 2 },
    ];

    render(
      <TabbedCombo
        tabs={tabsWithBadges}
        itemToString={(item) => item?.label ?? ''}
        itemToValue={(item) => item.value}
        placeholder="Search..."
      />,
    );

    const input = screen.getByRole('combobox');
    await user.click(input);

    const tabList = screen.getByRole('tablist');
    const badges = within(tabList).getAllByText('2');
    expect(badges).toHaveLength(2);
  });

  it('switches tabs with Ctrl+ArrowRight from search input', async () => {
    const user = userEvent.setup();
    const onTabChange = vi.fn();

    render(
      <TabbedCombo
        tabs={tabs}
        itemToString={(item) => item?.label ?? ''}
        itemToValue={(item) => item.value}
        placeholder="Search..."
        onTabChange={onTabChange}
      />,
    );

    const input = screen.getByRole('combobox');
    await user.click(input);

    // Verify we're on Fruits tab
    expect(screen.getByText('Apple')).toBeInTheDocument();

    // Press Ctrl+ArrowRight to switch to Vegetables
    await user.keyboard('{Control>}{ArrowRight}{/Control}');

    expect(onTabChange).toHaveBeenCalledWith('vegetables');
    expect(screen.getByText('Carrot')).toBeInTheDocument();
    expect(screen.queryByText('Apple')).toBeNull();
  });

  it('switches tabs with Ctrl+ArrowLeft from search input', async () => {
    const user = userEvent.setup();
    const onTabChange = vi.fn();

    render(
      <TabbedCombo
        tabs={tabs}
        itemToString={(item) => item?.label ?? ''}
        itemToValue={(item) => item.value}
        placeholder="Search..."
        defaultActiveTab="vegetables"
        onTabChange={onTabChange}
      />,
    );

    const input = screen.getByRole('combobox');
    await user.click(input);

    // Verify we're on Vegetables tab
    expect(screen.getByText('Carrot')).toBeInTheDocument();

    // Press Ctrl+ArrowLeft to switch to Fruits
    await user.keyboard('{Control>}{ArrowLeft}{/Control}');

    expect(onTabChange).toHaveBeenCalledWith('fruits');
    expect(screen.getByText('Apple')).toBeInTheDocument();
  });

  it('sets aria-selected on active tab', async () => {
    const user = userEvent.setup();

    render(
      <TabbedCombo
        tabs={tabs}
        itemToString={(item) => item?.label ?? ''}
        itemToValue={(item) => item.value}
        placeholder="Search..."
      />,
    );

    const input = screen.getByRole('combobox');
    await user.click(input);

    const fruitsTab = screen.getByRole('tab', { name: 'Fruits' });
    const veggieTab = screen.getByRole('tab', { name: 'Vegetables' });

    expect(fruitsTab).toHaveAttribute('aria-selected', 'true');
    expect(veggieTab).toHaveAttribute('aria-selected', 'false');
  });
});
