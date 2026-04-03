import type { ReactNode } from 'react';

interface SectionProps {
  id: string;
  title?: string;
  subtitle?: string;
  alt?: boolean;
  children: ReactNode;
}

export function Section({ id, title, subtitle, alt, children }: SectionProps) {
  return (
    <section
      id={id}
      data-section
      className={`demo-section${alt ? ' demo-section--alt' : ''}`}
    >
      {title && <h2 className="demo-section-title">{title}</h2>}
      {subtitle && <p className="demo-section-subtitle">{subtitle}</p>}
      {children}
    </section>
  );
}
