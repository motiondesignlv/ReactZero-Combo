import { useState, useCallback } from 'react';

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlight(code: string): string {
  const escaped = escapeHtml(code);
  // Collect tokens with placeholders to avoid regexes corrupting earlier replacements
  const tokens: string[] = [];
  const ph = (cls: string, text: string) => {
    const i = tokens.length;
    tokens.push(`<span class="${cls}">${text}</span>`);
    return `\x00${i}\x00`;
  };

  let result = escaped
    // Comments first (highest priority)
    .replace(/(\/\/.*$)/gm, (_, m) => ph('token-comment', m))
    // Strings
    .replace(/(["'](?:[^"'\\]|\\.)*?["'])/g, (_, m) => ph('token-string', m))
    // JSX components (uppercase tags)
    .replace(/(&lt;\/?)([A-Z]\w*)/g, (_, pre, name) => pre + ph('token-component', name))
    // JSX html tags (lowercase tags)
    .replace(/(&lt;\/?)([a-z][\w-]*)/g, (_, pre, name) => pre + ph('token-tag', name))
    // Attributes (word followed by =)
    .replace(/\b([a-zA-Z][\w-]*)(=)/g, (_, name, eq) => ph('token-attr', name) + eq)
    // Keywords
    .replace(/\b(import|export|from|const|let|var|function|return|if|else|type|interface)\b/g, (_, kw) => ph('token-keyword', kw))
    // Self-closing tag
    .replace(/\/&gt;/g, () => ph('token-punctuation', '/&gt;'));

  // Replace all placeholders with actual HTML
  result = result.replace(/\x00(\d+)\x00/g, (_, i) => tokens[Number(i)]);
  return result;
}

interface CodeBlockProps {
  code: string;
  collapsible?: boolean;
}

export function CodeBlock({ code, collapsible = true }: CodeBlockProps) {
  const [expanded, setExpanded] = useState(!collapsible);
  const [copied, setCopied] = useState(false);
  const lines = code.trim().split('\n');
  const isLong = lines.length > 3;

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <div className="demo-code-wrapper">
      <pre className={`demo-code${collapsible && !expanded && isLong ? ' demo-code-collapsed' : ''}`}>
        <code dangerouslySetInnerHTML={{ __html: highlight(code.trim()) }} />
      </pre>
      <div className="demo-code-actions">
        {collapsible && isLong && (
          <button className="demo-code-toggle" onClick={() => setExpanded(!expanded)}>
            {expanded ? 'Hide code' : 'Show code'}
          </button>
        )}
        <button className="demo-code-copy" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
}
