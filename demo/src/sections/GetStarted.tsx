import { useState, useCallback } from 'react';
import { CodeBlock } from '../shared/CodeBlock';

const quickStart = `import { Combo } from '@reactzero/combo';

function App() {
  return (
    <Combo
      items={['Apple', 'Banana', 'Cherry']}
      placeholder="Search fruits..."
    />
  );
}`;

export function GetStarted() {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText('npm install @reactzero/combo');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <div className="demo-text-center">
      <div className="demo-hero-install" onClick={handleCopy} style={{ cursor: 'pointer', marginBottom: 32 }}>
        <code>npm install @reactzero/combo</code>
        <span className="demo-code-copy" style={{ position: 'static' }}>
          {copied ? 'Copied!' : 'Copy'}
        </span>
      </div>
      <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'left' }}>
        <CodeBlock code={quickStart} collapsible={false} />
      </div>
      <div className="demo-hero-badges" style={{ marginTop: 32 }}>
        <span className="demo-badge">hook: 4.2kB</span>
        <span className="demo-badge">full: 6.2kB</span>
        <span className="demo-badge">CSS: 2.5kB</span>
      </div>
      <p style={{ marginTop: 24 }}>
        <a
          href="https://github.com/nicober1/reactzero-combo"
          target="_blank"
          rel="noopener"
          className="demo-github-link"
        >
          View on GitHub
        </a>
      </p>
    </div>
  );
}
