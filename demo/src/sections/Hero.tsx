import { useState, useCallback } from 'react';
import { Combo } from '@reactzero/combo';
import { useTheme } from '../context/ThemeContext';
import { fruits } from '../shared/data';

export function Hero() {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText('npm install @reactzero/combo');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <div className="demo-hero" id="hero" data-section>
      <h1 className="demo-hero-title">@reactzero/combo</h1>
      <p className="demo-hero-subtitle">
        A headless dropdown you can attach to anything. Accessible, ARIA 1.2 compliant, zero dependencies, under 6kB.
      </p>
      <div className="demo-hero-badges">
        <span className="demo-badge">ARIA 1.2</span>
        <span className="demo-badge">3 Themes</span>
        <span className="demo-badge">&lt; 6kB</span>
      </div>
      <div className="demo-hero-demo">
        <Combo
          items={fruits}
          placeholder="Search fruits..."
          label="Try it out"
          theme={theme}
        />
      </div>
      <div className="demo-hero-install" onClick={handleCopy} style={{ cursor: 'pointer' }}>
        <code>npm install @reactzero/combo</code>
        <span className="demo-code-copy" style={{ position: 'static' }}>
          {copied ? 'Copied!' : 'Copy'}
        </span>
      </div>
    </div>
  );
}
