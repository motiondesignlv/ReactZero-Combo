import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GroupSeparator } from './GroupSeparator';

describe('GroupSeparator', () => {
  it('renders the label', () => {
    render(<GroupSeparator label="Fruits" />);
    expect(screen.getByText('Fruits')).toBeInTheDocument();
  });

  it('renders optional count badge', () => {
    render(<GroupSeparator label="Fruits" count={5} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('does not render count when not provided', () => {
    const { container } = render(<GroupSeparator label="Fruits" />);
    expect(
      container.querySelector('.rzero-combo-group-header-count'),
    ).toBeNull();
  });

  it('renders optional icon', () => {
    render(
      <GroupSeparator label="Fruits" icon={<span data-testid="icon">🍎</span>} />,
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('applies data-sticky attribute when sticky is true', () => {
    const { container } = render(<GroupSeparator label="Fruits" sticky />);
    const header = container.querySelector('.rzero-combo-group-header');
    expect(header).toHaveAttribute('data-sticky');
  });

  it('does not apply data-sticky when sticky is false', () => {
    const { container } = render(<GroupSeparator label="Fruits" />);
    const header = container.querySelector('.rzero-combo-group-header');
    expect(header).not.toHaveAttribute('data-sticky');
  });

  it('uses the group-header CSS class', () => {
    const { container } = render(<GroupSeparator label="Test" />);
    expect(
      container.querySelector('.rzero-combo-group-header'),
    ).toBeInTheDocument();
  });
});
