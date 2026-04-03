import { useState, useCallback } from 'react';

export function AIBanner() {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const url = window.location.origin + '/llms.txt';
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <div className="ai-banner" data-section>
      <div className="ai-banner-inner">
        <div className="ai-banner-header">
          <div className="ai-banner-left">
            <span className="ai-banner-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" />
                <path d="M16 14h.01" />
                <path d="M8 14h.01" />
                <path d="M12 22c4.97 0 9-2.69 9-6v-2c0-3.31-4.03-6-9-6s-9 2.69-9 6v2c0 3.31 4.03 6 9 6z" />
              </svg>
            </span>
            <span className="ai-banner-label">
              <strong>AI-Ready Documentation</strong>
              <span className="ai-banner-sep"> — </span>
              <span className="ai-banner-desc">This library ships with <code>llms.txt</code> for AI code assistants</span>
            </span>
          </div>
          <div className="ai-banner-actions">
            <button
              className="ai-banner-btn"
              onClick={handleCopy}
            >
              {copied ? 'Copied!' : 'Copy URL'}
            </button>
            <button
              className="ai-banner-btn ai-banner-btn--toggle"
              onClick={() => setExpanded(!expanded)}
              aria-expanded={expanded}
            >
              {expanded ? 'Hide' : 'Preview'}
            </button>
          </div>
        </div>
        {expanded && (
          <div className="ai-banner-preview">
            <pre className="ai-banner-code">
{`# @reactzero/combo

> Headless, accessible React combo & select.
> ARIA 1.2 compliant, zero deps, <6kB gzipped.

## Entry Points
- @reactzero/combo       → Full component + hook (~6kB)
- @reactzero/combo/hook  → Hook only (~4kB)
- @reactzero/combo/slots → Slot components (~1.5kB)
- @reactzero/combo/tabs  → TabbedCombo (~7kB)

## Hook: useCombo(options)
Props: items, mode, variant, filterFunction,
  closeOnSelect, onSelectedItemChange, ...
Returns: getInputProps, getMenuProps, getItemProps,
  isOpen, filteredItems, selectedItem, ...

## Component: <Combo />
Additional: label, placeholder, theme, hintText,
  errorText, renderItem, renderTrigger, ...

Full docs → /llms.txt`}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
