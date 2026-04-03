import type { ReactNode } from 'react';

export interface CustomItemProps {
  /** Primary label / title */
  title: ReactNode;
  /** Secondary description text */
  description?: ReactNode;
  /** Leading icon or avatar element */
  icon?: ReactNode;
  /** Trailing meta text (e.g. date, status) */
  meta?: ReactNode;
  /** Trailing badge (e.g. count, tag) */
  badge?: ReactNode;
  /** Arbitrary children rendered after title/description */
  children?: ReactNode;
}

/**
 * Multi-line item layout with icon, title, description, meta, and badge slots.
 *
 * @example
 * ```tsx
 * <Combo
 *   items={users}
 *   renderItem={({ item }) => (
 *     <CustomItem
 *       icon={<img src={item.avatar} alt="" />}
 *       title={item.name}
 *       description={item.role}
 *       meta={item.department}
 *     />
 *   )}
 * />
 * ```
 */
export function CustomItem({
  title,
  description,
  icon,
  meta,
  badge,
  children,
}: CustomItemProps) {
  return (
    <div className="rzero-combo-custom-item">
      {icon && (
        <span className="rzero-combo-custom-item-icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <div className="rzero-combo-custom-item-content">
        <div className="rzero-combo-custom-item-title">{title}</div>
        {description && (
          <div className="rzero-combo-custom-item-description">
            {description}
          </div>
        )}
        {children}
      </div>
      {badge && (
        <span className="rzero-combo-custom-item-badge">{badge}</span>
      )}
      {meta && (
        <span className="rzero-combo-custom-item-meta">{meta}</span>
      )}
    </div>
  );
}
