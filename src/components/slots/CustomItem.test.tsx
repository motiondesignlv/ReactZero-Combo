import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CustomItem } from './CustomItem';

describe('CustomItem', () => {
  it('renders the title', () => {
    render(<CustomItem title="Dashboard" />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders title and description', () => {
    render(<CustomItem title="Settings" description="Configure your app" />);
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Configure your app')).toBeInTheDocument();
  });

  it('renders icon slot', () => {
    render(
      <CustomItem
        title="Profile"
        icon={<span data-testid="icon">👤</span>}
      />,
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders meta slot', () => {
    render(<CustomItem title="Server" meta="healthy" />);
    expect(screen.getByText('healthy')).toBeInTheDocument();
  });

  it('renders badge slot', () => {
    render(<CustomItem title="Inbox" badge={23} />);
    expect(screen.getByText('23')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <CustomItem title="Item">
        <span data-testid="child">Extra content</span>
      </CustomItem>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('uses the custom-item CSS class', () => {
    const { container } = render(<CustomItem title="Test" />);
    expect(
      container.querySelector('.rzero-combo-custom-item'),
    ).toBeInTheDocument();
  });

  it('does not render optional slots when not provided', () => {
    const { container } = render(<CustomItem title="Minimal" />);
    expect(container.querySelector('.rzero-combo-custom-item-icon')).toBeNull();
    expect(container.querySelector('.rzero-combo-custom-item-description')).toBeNull();
    expect(container.querySelector('.rzero-combo-custom-item-meta')).toBeNull();
    expect(container.querySelector('.rzero-combo-custom-item-badge')).toBeNull();
  });
});
