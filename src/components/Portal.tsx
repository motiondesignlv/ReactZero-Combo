import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';

export interface PortalProps {
  children: ReactNode;
  target?: Element | null;
  disabled?: boolean;
}

export function Portal({ children, target, disabled }: PortalProps) {
  if (disabled) return <>{children}</>;

  const mountNode =
    target ?? (typeof document !== 'undefined' ? document.body : null);
  if (!mountNode) return null;

  return createPortal(children, mountNode);
}
