import type { ReactNode } from 'react';

export interface GroupSeparatorProps {
  /** Group heading label */
  label: string;
  /** Optional item count badge */
  count?: number;
  /** Optional leading icon */
  icon?: ReactNode;
  /** Enable sticky positioning for scrollable lists */
  sticky?: boolean;
}

/**
 * Enhanced group header with optional count badge and sticky positioning.
 *
 * @example
 * ```tsx
 * <Combo
 *   groups={groups}
 *   renderGroupHeader={({ group }) => (
 *     <GroupSeparator
 *       label={group.label}
 *       count={group.items.length}
 *       sticky
 *     />
 *   )}
 * />
 * ```
 */
export function GroupSeparator({
  label,
  count,
  icon,
  sticky,
}: GroupSeparatorProps) {
  return (
    <div
      className="rzero-combo-group-header"
      data-sticky={sticky || undefined}
    >
      {icon && (
        <span style={{ marginRight: 6, display: 'inline-flex' }} aria-hidden="true">
          {icon}
        </span>
      )}
      <span>{label}</span>
      {count !== undefined && (
        <span className="rzero-combo-group-header-count">{count}</span>
      )}
    </div>
  );
}
