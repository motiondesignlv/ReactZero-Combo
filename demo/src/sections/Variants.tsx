import { Combo } from '@reactzero/combo';
import { useTheme } from '../context/ThemeContext';
import { DemoCard } from '../shared/DemoCard';
import { fruits, currencies } from '../shared/data';

const chevronStyles = ['caret', 'arrow', 'angle', 'plusminus', 'dots', 'none'] as const;

const searchPrefixCode = `<Combo
  items={fruits}
  placeholder="Search fruits..."
  renderTrigger={({ getInputProps, getToggleButtonProps, getChevronProps, chevronIcon }) => (
    <div className="rzero-combo-trigger">
      <SearchIcon />
      <input {...getInputProps({ placeholder: 'Search fruits...' })} />
      <button {...getToggleButtonProps()}>
        <span {...getChevronProps()}>{chevronIcon}</span>
      </button>
    </div>
  )}
/>`;

const currencyPrefixCode = `<Combo
  items={currencies}
  placeholder="Currency..."
  renderTrigger={({ getInputProps, getToggleButtonProps, getChevronProps, chevronIcon }) => (
    <div className="rzero-combo-trigger">
      <span style={{ color: '#9ca3af', fontWeight: 600 }}>$</span>
      <input {...getInputProps({ placeholder: 'Currency...' })} />
      <button {...getToggleButtonProps()}>
        <span {...getChevronProps()}>{chevronIcon}</span>
      </button>
    </div>
  )}
/>`;

const actionPostfixCode = `<Combo
  items={fruits}
  placeholder="Search fruits..."
  renderTrigger={({ getInputProps, getToggleButtonProps, getChevronProps, chevronIcon }) => (
    <div className="rzero-combo-trigger">
      <input {...getInputProps({ placeholder: 'Search fruits...' })} />
      <button
        onMouseDown={(e) => e.preventDefault()}
        onClick={(e) => { e.stopPropagation(); }}
        style={{ padding: '4px 10px', borderRadius: 4, border: '1px solid #3b82f6',
          background: '#3b82f6', color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
      >
        Go
      </button>
      <button {...getToggleButtonProps()}>
        <span {...getChevronProps()}>{chevronIcon}</span>
      </button>
    </div>
  )}
/>`;

const tagInputPostfixCode = `<Combo
  items={fruits}
  placeholder="Add item..."
  renderTrigger={({ getInputProps, getToggleButtonProps, getChevronProps, chevronIcon }) => (
    <div className="rzero-combo-trigger">
      <input {...getInputProps({ placeholder: 'Add item...' })} />
      <button
        onMouseDown={(e) => e.preventDefault()}
        onClick={(e) => { e.stopPropagation(); }}
        style={{ padding: '4px 10px', borderRadius: 4, border: '1px solid #d1d5db',
          background: 'transparent', color: '#374151', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}
      >
        Add
      </button>
      <button {...getToggleButtonProps()}>
        <span {...getChevronProps()}>{chevronIcon}</span>
      </button>
    </div>
  )}
/>`;

export function Variants() {
  const { theme } = useTheme();

  return (
    <div>
      {/* Comparison table */}
      <div className="demo-comparison">
        <div className="demo-comparison-row demo-comparison-header">
          <div>Feature</div>
          <div>Input</div>
          <div>Select</div>
        </div>
        <div className="demo-comparison-row">
          <div>Text filtering</div>
          <div>{'\u2713'} Type to search</div>
          <div>{'\u2717'} Click only</div>
        </div>
        <div className="demo-comparison-row">
          <div>Best for</div>
          <div>Long lists, known values</div>
          <div>Short, fixed lists</div>
        </div>
        <div className="demo-comparison-row">
          <div>Trigger element</div>
          <div>Input field</div>
          <div>Button</div>
        </div>
        <div className="demo-comparison-row">
          <div>Keyboard</div>
          <div>Letter keys filter</div>
          <div>Space / Enter to open</div>
        </div>
      </div>

      <div className="demo-grid-2">
        <DemoCard
          title="Input (default)"
          description="Type to search and filter items"
          code={`<Combo\n  items={fruits}\n  placeholder="Search fruits..."\n/>`}
        >
          <div style={{ width: 280 }}>
            <Combo items={fruits} placeholder="Search fruits..." theme={theme} />
          </div>
        </DemoCard>
        <DemoCard
          title="Select"
          description="Click to choose from a fixed list"
          code={`<Combo\n  items={fruits}\n  variant="select"\n  placeholder="Choose a fruit"\n/>`}
        >
          <div style={{ width: 280 }}>
            <Combo items={fruits} variant="select" placeholder="Choose a fruit" theme={theme} />
          </div>
        </DemoCard>
      </div>
      <h3 className="demo-section-title" style={{ fontSize: '1.25rem', marginTop: 48, marginBottom: 24 }}>
        Chevron Styles
      </h3>
      <div className="demo-grid-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
        {chevronStyles.map((style) => (
          <DemoCard
            key={style}
            title={style}
            description={style === 'none' ? 'Escape hatch — you must provide your own visual affordance.' : undefined}
          >
            <div style={{ width: '100%' }}>
              <Combo items={fruits} chevronStyle={style} placeholder="Search..." theme={theme} />
            </div>
          </DemoCard>
        ))}
      </div>
      <h3 className="demo-section-title" style={{ fontSize: '1.25rem', marginTop: 48, marginBottom: 24 }}>
        Trigger Decorations
      </h3>
      <p className="demo-section-description">
        Use <code>renderTrigger</code> to customize the input with leading icons, prefix text,
        or trailing action buttons.
      </p>
      <div className="demo-grid-2">
        <DemoCard title="Search Icon Prefix" code={searchPrefixCode}>
          <div style={{ width: 280 }}>
            <Combo
              items={fruits}
              placeholder="Search fruits..."
              theme={theme}
              renderTrigger={({ getInputProps, getToggleButtonProps, getChevronProps, chevronIcon }) => (
                <div className="rzero-combo-trigger" style={{ gap: 8 }}>
                  <span style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 28, height: 28, borderRadius: 6,
                    background: 'var(--rzero-combo-item-highlighted-bg, #f1f5f9)',
                    flexShrink: 0,
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--demo-accent, #3b82f6)' }}>
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                    </svg>
                  </span>
                  <input {...getInputProps({ placeholder: 'Search fruits...' })} />
                  <button {...getToggleButtonProps()}>
                    <span {...getChevronProps()}>{chevronIcon}</span>
                  </button>
                </div>
              )}
            />
          </div>
        </DemoCard>
        <DemoCard title="Currency Prefix" code={currencyPrefixCode}>
          <div style={{ width: 280 }}>
            <Combo
              items={currencies}
              placeholder="Currency..."
              theme={theme}
              renderTrigger={({ getInputProps, getToggleButtonProps, getChevronProps, chevronIcon }) => (
                <div className="rzero-combo-trigger">
                  <span style={{ color: '#9ca3af', fontWeight: 600, flexShrink: 0 }}>$</span>
                  <input {...getInputProps({ placeholder: 'Currency...' })} />
                  <button {...getToggleButtonProps()}>
                    <span {...getChevronProps()}>{chevronIcon}</span>
                  </button>
                </div>
              )}
            />
          </div>
        </DemoCard>
        <DemoCard title="Action Postfix" code={actionPostfixCode}>
          <div style={{ width: 280 }}>
            <Combo
              items={fruits}
              placeholder="Search fruits..."
              theme={theme}
              renderTrigger={({ getInputProps, getToggleButtonProps, getChevronProps, chevronIcon }) => (
                <div className="rzero-combo-trigger">
                  <input {...getInputProps({ placeholder: 'Search fruits...' })} />
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => { e.stopPropagation(); }}
                    style={{ padding: '4px 10px', borderRadius: 4, border: '1px solid #3b82f6', background: '#3b82f6', color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}
                  >
                    Go
                  </button>
                  <button {...getToggleButtonProps()}>
                    <span {...getChevronProps()}>{chevronIcon}</span>
                  </button>
                </div>
              )}
            />
          </div>
        </DemoCard>
        <DemoCard title="Tag Input Postfix" code={tagInputPostfixCode}>
          <div style={{ width: 280 }}>
            <Combo
              items={fruits}
              placeholder="Add item..."
              theme={theme}
              renderTrigger={({ getInputProps, getToggleButtonProps, getChevronProps, chevronIcon }) => (
                <div className="rzero-combo-trigger">
                  <input {...getInputProps({ placeholder: 'Add item...' })} />
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => { e.stopPropagation(); }}
                    style={{ padding: '4px 10px', borderRadius: 4, border: '1px solid #d1d5db', background: 'transparent', color: '#374151', fontSize: 12, fontWeight: 500, cursor: 'pointer', flexShrink: 0 }}
                  >
                    Add
                  </button>
                  <button {...getToggleButtonProps()}>
                    <span {...getChevronProps()}>{chevronIcon}</span>
                  </button>
                </div>
              )}
            />
          </div>
        </DemoCard>
      </div>
    </div>
  );
}
