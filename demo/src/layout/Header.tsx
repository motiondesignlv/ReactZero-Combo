import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const navItems = [
  { label: 'Playground', href: '#playground' },
  { label: 'Variants', href: '#variants' },
  { label: 'Rich Content', href: '#rich-content' },
  { label: 'Creative', href: '#creative' },
  { label: 'Grouped', href: '#grouped' },
  { label: 'Tabbed', href: '#tabbed' },
  { label: 'Edge Cases', href: '#edge-cases' },
  { label: 'Mixed', href: '#mixed' },
  { label: 'Themes', href: '#themes' },
  { label: 'A11y', href: '#accessibility' },
];

export function Header() {
  const { theme, setTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px' }
    );

    const sections = document.querySelectorAll('[data-section]');
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="demo-header">
      <a href="#hero" className="demo-header-logo" onClick={(e) => { e.preventDefault(); scrollTo('#hero'); }}>
        @reactzero/combo
      </a>
      <nav className="demo-header-nav">
        {navItems.map(({ label, href }) => (
          <a
            key={href}
            href={href}
            className={activeSection === href.slice(1) ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); scrollTo(href); }}
          >
            {label}
          </a>
        ))}
      </nav>
      <div className="demo-header-actions">
        <a href="#" className="demo-header-icon-link" title="GitHub" target="_blank" rel="noopener noreferrer">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.627-5.373-12-12-12z"/>
          </svg>
        </a>
        <div className="demo-theme-switcher">
          <button
            data-active={theme === 'default' || undefined}
            onClick={() => setTheme('default')}
            title="Light theme"
            type="button"
          >
            Light
          </button>
          <button
            data-active={theme === 'dark' || undefined}
            onClick={() => setTheme('dark')}
            title="Dark theme"
            type="button"
          >
            Dark
          </button>
          <button
            data-active={theme === 'high-contrast' || undefined}
            onClick={() => setTheme('high-contrast')}
            title="High contrast theme"
            type="button"
          >
            HC
          </button>
        </div>
      </div>
    </header>
  );
}
