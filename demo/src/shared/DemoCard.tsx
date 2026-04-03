import type { ReactNode } from 'react';
import { CodeBlock } from './CodeBlock';

interface DemoCardProps {
  title?: string;
  description?: string;
  code?: string;
  children: ReactNode;
}

export function DemoCard({ title, description, code, children }: DemoCardProps) {
  return (
    <div className="demo-card">
      {(title || description) && (
        <div className="demo-card-header">
          {title && <span>{title}</span>}
          {description && <span className="demo-card-description">{description}</span>}
        </div>
      )}
      <div className="demo-card-body">
        {children}
      </div>
      {code && (
        <div className="demo-card-code">
          <CodeBlock code={code} />
        </div>
      )}
    </div>
  );
}
