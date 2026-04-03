import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { FooterActions } from './FooterActions';

describe('FooterActions', () => {
  it('renders action buttons', () => {
    render(
      <FooterActions
        actions={[
          { label: 'Cancel', onClick: vi.fn() },
          { label: 'Apply', onClick: vi.fn() },
        ]}
      />,
    );
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Apply')).toBeInTheDocument();
  });

  it('calls onClick when a button is clicked', async () => {
    const user = userEvent.setup();
    const onApply = vi.fn();
    render(
      <FooterActions
        actions={[{ label: 'Apply', onClick: onApply }]}
      />,
    );
    await user.click(screen.getByText('Apply'));
    expect(onApply).toHaveBeenCalledOnce();
  });

  it('renders disabled buttons', () => {
    render(
      <FooterActions
        actions={[
          { label: 'Submit', onClick: vi.fn(), disabled: true },
        ]}
      />,
    );
    expect(screen.getByText('Submit')).toBeDisabled();
  });

  it('renders selection count summary', () => {
    render(
      <FooterActions
        selectedCount={3}
        totalCount={10}
        actions={[]}
      />,
    );
    expect(screen.getByText('3 of 10 selected')).toBeInTheDocument();
  });

  it('renders note text', () => {
    render(
      <FooterActions
        note="Press Enter to confirm"
        actions={[]}
      />,
    );
    expect(screen.getByText('Press Enter to confirm')).toBeInTheDocument();
  });

  it('prefers selection summary over note', () => {
    render(
      <FooterActions
        selectedCount={2}
        totalCount={5}
        note="This should not appear"
        actions={[]}
      />,
    );
    expect(screen.getByText('2 of 5 selected')).toBeInTheDocument();
    expect(screen.queryByText('This should not appear')).toBeNull();
  });

  it('sets data-variant attribute on buttons', () => {
    render(
      <FooterActions
        actions={[
          { label: 'Done', onClick: vi.fn(), variant: 'primary' },
          { label: 'Cancel', onClick: vi.fn(), variant: 'ghost' },
        ]}
      />,
    );
    expect(screen.getByText('Done')).toHaveAttribute('data-variant', 'primary');
    expect(screen.getByText('Cancel')).toHaveAttribute('data-variant', 'ghost');
  });
});
