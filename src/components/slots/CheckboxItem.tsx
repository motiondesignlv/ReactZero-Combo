import type { ReactNode } from 'react';

export interface CheckboxItemProps {
  /** Display label for the item */
  label: string;
  /** Optional secondary description text */
  description?: string;
  /** Optional leading icon */
  icon?: ReactNode;
  /** Whether the item is currently highlighted */
  isHighlighted?: boolean;
  /** Whether the item is currently selected */
  isSelected?: boolean;
  /** Whether the item is disabled */
  isDisabled?: boolean;
}

/**
 * Pre-built item content for checkbox-style multi-select.
 * Pair with `itemVariant="checkbox"` on the Combo for CSS-driven checkbox visuals.
 *
 * @example
 * ```tsx
 * <Combo
 *   items={items}
 *   itemVariant="checkbox"
 *   renderItem={({ item, isHighlighted, isSelected, isDisabled }) => (
 *     <CheckboxItem
 *       label={item.label}
 *       description={item.description}
 *       isHighlighted={isHighlighted}
 *       isSelected={isSelected}
 *       isDisabled={isDisabled}
 *     />
 *   )}
 * />
 * ```
 */
export function CheckboxItem({
  label,
  description,
  icon,
  // isHighlighted, isSelected, isDisabled accepted for renderItem type compat;
  // visual states are driven by CSS via parent data-attributes.
}: CheckboxItemProps) {
  return (
    <div className="rzero-combo-custom-item">
      {icon && (
        <span className="rzero-combo-custom-item-icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <div className="rzero-combo-custom-item-content">
        <div className="rzero-combo-custom-item-title">{label}</div>
        {description && (
          <div className="rzero-combo-custom-item-description">
            {description}
          </div>
        )}
      </div>
    </div>
  );
}
