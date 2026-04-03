export interface FooterAction {
  /** Button label */
  label: string;
  /** Click handler */
  onClick: () => void;
  /** Visual variant */
  variant?: 'primary' | 'secondary' | 'ghost';
  /** Disable this action */
  disabled?: boolean;
}

export interface FooterActionsProps {
  /** Action buttons to render */
  actions: FooterAction[];
  /** Optional note/help text displayed below or beside actions */
  note?: string;
  /** Number of currently selected items (for summary display) */
  selectedCount?: number;
  /** Total number of items (for summary display) */
  totalCount?: number;
}

/**
 * Pre-built footer with action buttons and optional selection summary.
 *
 * @example
 * ```tsx
 * <Combo
 *   items={items}
 *   renderFooter={({ clearSelection, closeMenu }) => (
 *     <FooterActions
 *       selectedCount={3}
 *       totalCount={10}
 *       actions={[
 *         { label: 'Clear', onClick: clearSelection, variant: 'ghost' },
 *         { label: 'Done', onClick: closeMenu, variant: 'primary' },
 *       ]}
 *     />
 *   )}
 * />
 * ```
 */
export function FooterActions({
  actions,
  note,
  selectedCount,
  totalCount,
}: FooterActionsProps) {
  const showStats =
    selectedCount !== undefined && totalCount !== undefined;

  return (
    <div className="rzero-combo-footer-actions">
      <div>
        {showStats && (
          <span className="rzero-combo-footer-note">
            {selectedCount} of {totalCount} selected
          </span>
        )}
        {note && !showStats && (
          <span className="rzero-combo-footer-note">{note}</span>
        )}
      </div>
      <div className="rzero-combo-footer-actions-buttons">
        {actions.map((action, i) => (
          <button
            key={`${action.label}-${i}`}
            type="button"
            onClick={action.onClick}
            disabled={action.disabled}
            data-variant={action.variant}
            onMouseDown={(e) => e.preventDefault()}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
