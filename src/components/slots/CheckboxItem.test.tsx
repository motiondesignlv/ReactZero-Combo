import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CheckboxItem } from './CheckboxItem';

describe('CheckboxItem', () => {
  it('renders the label', () => {
    render(<CheckboxItem label="Apple" />);
    expect(screen.getByText('Apple')).toBeInTheDocument();
  });

  it('renders optional description', () => {
    render(<CheckboxItem label="Read" description="View content" />);
    expect(screen.getByText('Read')).toBeInTheDocument();
    expect(screen.getByText('View content')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    const { container } = render(<CheckboxItem label="Apple" />);
    expect(
      container.querySelector('.rzero-combo-custom-item-description'),
    ).toBeNull();
  });

  it('renders optional icon', () => {
    render(<CheckboxItem label="Apple" icon={<span data-testid="icon">🍎</span>} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('uses the custom-item CSS class for layout', () => {
    const { container } = render(<CheckboxItem label="Apple" />);
    expect(
      container.querySelector('.rzero-combo-custom-item'),
    ).toBeInTheDocument();
  });
});
