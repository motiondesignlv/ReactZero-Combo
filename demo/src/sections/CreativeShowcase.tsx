import { useState } from 'react';
import { Combo } from '@reactzero/combo';
import { useTheme } from '../context/ThemeContext';
import { DemoCard } from '../shared/DemoCard';
import { gradients, destinations, tracks, artworks, palettes, components, quickActions, menuItems, dashboardItems } from '../shared/data';
import type { GradientItem, DestinationItem, TrackItem, ArtworkItem, PaletteItem, ComponentItem, QuickAction, MenuItem, DashboardItem } from '../shared/data';

const gradientComboCode = `<Combo
  items={gradients}
  itemToString={(item) => item?.label ?? ''}
  placeholder="Pick a gradient..."
  label="Color Palette"
  renderTrigger={({ getInputProps, getToggleButtonProps, getChevronProps,
    chevronIcon, selectedItem, hasSelection, getClearButtonProps, icons }) => (
    <div className="rzero-combo-trigger" style={{
      background: selectedItem?.gradient ?? undefined,
      color: selectedItem ? '#fff' : undefined,
    }}>
      <input {...getInputProps({ placeholder: 'Pick a gradient...' })} />
      {hasSelection && <button {...getClearButtonProps()}>{icons.clear}</button>}
      <button {...getToggleButtonProps()}>
        <span {...getChevronProps()}>{chevronIcon}</span>
      </button>
    </div>
  )}
  renderItem={({ item }) => (
    <div className="creative-gradient-item">
      <span className="creative-gradient-swatch"
        style={{ background: item.gradient }} />
      <div className="creative-gradient-info">
        <span className="creative-gradient-name">{item.label}</span>
        <span className="creative-gradient-hex">{item.from} → {item.to}</span>
      </div>
    </div>
  )}
/>`;

const destinationCode = `<Combo
  items={destinations}
  itemToString={(item) => item?.label ?? ''}
  placeholder="Where to next?"
  label="Destination"
  renderItem={({ item, isHighlighted }) => (
    <div className="creative-destination-card">
      <div className="creative-destination-hero"
        style={{ background: item.gradient }}>
        <span className="creative-destination-icon">{item.icon}</span>
      </div>
      <div className="creative-destination-info">
        <span className="creative-destination-name">{item.label}</span>
        <span className="creative-destination-country">{item.country}</span>
        <div className="creative-destination-meta">
          <span className="creative-destination-rating">
            {'★'.repeat(Math.round(item.rating))} {item.rating}
          </span>
          <span className="creative-destination-price">{item.price}</span>
        </div>
      </div>
    </div>
  )}
/>`;

const galleryCode = `<Combo
  items={artworks}
  itemToString={(item) => item?.label ?? ''}
  placeholder="Browse artworks..."
  label="Gallery"
  renderListHeader={() => (
    <div className="creative-gallery-header">
      <span className="creative-gallery-pill active">All</span>
      <span className="creative-gallery-pill">Fluid</span>
      <span className="creative-gallery-pill">Geometric</span>
      <span className="creative-gallery-pill">Cosmic</span>
    </div>
  )}
  renderItem={({ item }) => (
    <div className="creative-gallery-item"
      style={{ backgroundImage: 'url(' + item.image + ')',
        backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="creative-gallery-overlay">
        <span className="creative-gallery-title">{item.label}</span>
        <span className="creative-gallery-artist">{item.artist}</span>
        <span className="creative-gallery-medium">{item.medium}</span>
      </div>
    </div>
  )}
/>`;

const paletteCode = `<Combo
  items={palettes}
  itemToString={(item) => item?.label ?? ''}
  placeholder="Choose a palette..."
  label="Color Palette"
  renderItem={({ item }) => (
    <div className="creative-palette-item">
      <div className="creative-palette-info">
        <span className="creative-palette-name">{item.label}</span>
        <span className="creative-palette-tag">{item.category}</span>
      </div>
      <div className="creative-palette-swatches">
        {item.colors.map((c) => (
          <span key={c} className="creative-palette-swatch"
            style={{ background: c }} />
        ))}
      </div>
    </div>
  )}
  renderFooter={({ selectedItem }) => (
    <div className="creative-palette-footer">
      <span>{selectedItem ? selectedItem.label : 'No palette selected'}</span>
      <button className="creative-palette-apply">Apply</button>
    </div>
  )}
/>`;

const libraryCode = `<Combo
  items={components}
  itemToString={(item) => item?.label ?? ''}
  placeholder="Search components..."
  label="Components"
  renderListHeader={() => (
    <div className="creative-library-header">
      <span>Browse Components</span>
      <span className="creative-library-count">8 available</span>
    </div>
  )}
  renderItem={({ item }) => (
    <div className="creative-library-item">
      <span className="creative-library-icon"
        style={{ background: item.gradient }}>{item.icon}</span>
      <div className="creative-library-info">
        <span className="creative-library-name">{item.label}</span>
        <span className="creative-library-desc">{item.description}</span>
      </div>
      {item.badge && <span className={'creative-library-badge ' +
        item.badge}>{item.badge}</span>}
    </div>
  )}
  renderFooter={({ selectedItem }) => (
    <div className="creative-library-footer">
      <span>{selectedItem ? 'Selected: ' + selectedItem.label : 'No selection'}</span>
      <span className="creative-library-cta">Add to project</span>
    </div>
  )}
/>`;

const trackCode = `<Combo
  items={tracks}
  itemToString={(item) => item?.title ?? ''}
  placeholder="Search tracks..."
  label="Now Playing"
  renderTrigger={({ getInputProps, getToggleButtonProps, getChevronProps,
    chevronIcon, selectedItem, hasSelection, getClearButtonProps, icons }) => (
    <div className="rzero-combo-trigger">
      {selectedItem && (
        <span className="creative-track-dot"
          style={{ background: selectedItem.color }} />
      )}
      <input {...getInputProps({ ... })} />
      ...
    </div>
  )}
  renderItem={({ item }) => (
    <div className="creative-track-item">
      <div className="creative-track-art" style={{ background: item.color }}>
        <svg viewBox="0 0 24 24">
          <polygon points="10,8 16,12 10,16" />
        </svg>
      </div>
      <div className="creative-track-info">
        <span className="creative-track-title">{item.title}</span>
        <span className="creative-track-artist">{item.artist}</span>
      </div>
      <div className="creative-track-meta">
        <span>{item.duration}</span>
        <span>{item.bpm} BPM</span>
      </div>
    </div>
  )}
/>`;

const actionMenuCode = `<Combo
  items={quickActions}
  variant="select"
  itemToString={(item) => item?.label ?? ''}
  label="Quick actions"
  renderTrigger={({ getTriggerProps }) => (
    <button {...getTriggerProps()}
      className="creative-action-fab">
      <svg width="24" height="24" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </button>
  )}
  renderItem={({ item }) => (
    <div className="creative-action-item">
      <span className="creative-action-icon">{item.icon}</span>
      <span className="creative-action-label">{item.label}</span>
      {item.shortcut && (
        <span className="creative-action-shortcut">{item.shortcut}</span>
      )}
    </div>
  )}
/>`;

const profileMenuCode = `<Combo
  items={menuItems}
  variant="select"
  itemToString={(item) => item?.label ?? ''}
  label="Account menu"
  renderTrigger={({ getTriggerProps, isOpen }) => (
    <button {...getTriggerProps()}
      className="creative-profile-trigger">
      <span className="creative-profile-avatar">JD</span>
      <div className="creative-profile-info">
        <span className="creative-profile-name">Jane Doe</span>
        <span className="creative-profile-role">Admin</span>
      </div>
      <svg className="creative-profile-chevron" ...>
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  )}
  renderItem={({ item }) => (
    <div className={"creative-profile-item" +
      (item.danger ? " danger" : "")}>
      <span>{item.icon}</span>
      <span>{item.label}</span>
    </div>
  )}
  renderFooter={() => (
    <div className="creative-profile-footer">
      v0.1.0 · reactzero
    </div>
  )}
/>`;

const dashboardCode = `<Combo
  items={dashboardItems}
  itemToString={(item) => item?.label ?? ''}
  placeholder="Search dashboard..."
  label="Dashboard"
  renderListHeader={() => (
    <div className="creative-dashboard-header">
      <span>Dashboard</span>
      <span className="creative-dashboard-count">
        {items.length} items
      </span>
    </div>
  )}
  renderItem={({ item }) => (
    <div className="creative-dashboard-item">
      <span className="creative-dashboard-icon">{item.icon}</span>
      <div className="creative-dashboard-info">
        <span className="creative-dashboard-name">{item.label}</span>
        <span className="creative-dashboard-desc">
          {item.description}
        </span>
      </div>
      {item.type === 'widget' && item.status && (
        <span className={"creative-dashboard-dot " + item.status} />
      )}
      {item.type === 'action' && (
        <span className="creative-dashboard-run">Run</span>
      )}
    </div>
  )}
/>`;

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  return (
    <span style={{ color: '#f59e0b', fontSize: 11, letterSpacing: -1 }}>
      {'★'.repeat(full)}{hasHalf ? '½' : ''}
      <span style={{ color: '#d1d5db' }}>{'★'.repeat(5 - full - (hasHalf ? 1 : 0))}</span>
      <span style={{ color: 'var(--demo-text-muted)', marginLeft: 4, letterSpacing: 0 }}>{rating}</span>
    </span>
  );
}

export function CreativeShowcase() {
  const { theme } = useTheme();
  const [galleryFilter, setGalleryFilter] = useState<string>('all');
  const filteredArtworks = galleryFilter === 'all'
    ? artworks
    : artworks.filter((a) => a.category === galleryFilter);

  return (
    <div>
      <p className="demo-section-description">
        The headless architecture gives you <strong>full creative control</strong> over
        every pixel — and every interaction. Attach a dropdown to a button, a card,
        or any element. Customize items, headers, and footers. It's not just a
        combo — it's a <strong>composable selection primitive</strong>.
      </p>
      <div className="demo-grid-2">
        {/* Gradient Palette Combo */}
        <DemoCard
          title="Gradient Palette Combo"
          description="Live gradient preview in trigger and rich swatches in the dropdown"
          code={gradientComboCode}
        >
          <div style={{ width: '100%' }}>
            <Combo<GradientItem>
              items={gradients}
              itemToString={(item) => item?.label ?? ''}
              itemToValue={(item) => item.value}
              placeholder="Pick a gradient..."
              label="Color Palette"
              theme={theme}
              renderTrigger={({ getInputProps, getToggleButtonProps, getChevronProps, chevronIcon, selectedItem, hasSelection, getClearButtonProps, icons }) => (
                <div
                  className="rzero-combo-trigger"
                  style={{
                    background: selectedItem ? selectedItem.gradient : undefined,
                    transition: 'background 0.3s ease',
                  }}
                >
                  <input {...getInputProps({
                    placeholder: hasSelection ? selectedItem?.label : 'Pick a gradient...',
                    style: selectedItem ? { color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.3)' } : {},
                  } as Record<string, unknown>)} />
                  {hasSelection && (
                    <button {...getClearButtonProps({ style: selectedItem ? { color: '#fff' } : {} } as Record<string, unknown>)}>
                      {icons.clear}
                    </button>
                  )}
                  <button {...getToggleButtonProps({ style: selectedItem ? { color: '#fff' } : {} } as Record<string, unknown>)}>
                    <span {...getChevronProps()}>{chevronIcon}</span>
                  </button>
                </div>
              )}
              renderItem={({ item }) => (
                <div className="creative-gradient-item">
                  <span
                    className="creative-gradient-swatch"
                    style={{ background: item.gradient }}
                  />
                  <div className="creative-gradient-info">
                    <span className="creative-gradient-name">{item.label}</span>
                    <span className="creative-gradient-hex">{item.from} → {item.to}</span>
                  </div>
                </div>
              )}
            />
          </div>
        </DemoCard>

        {/* Music Track Combo */}
        <DemoCard
          title="Track Selector"
          description="Album art, artist info, duration and BPM metadata"
          code={trackCode}
        >
          <div style={{ width: '100%' }}>
            <Combo<TrackItem>
              items={tracks}
              itemToString={(item) => item?.title ?? ''}
              itemToValue={(item) => item.value}
              placeholder="Search tracks..."
              label="Now Playing"
              theme={theme}
              renderTrigger={({ getInputProps, getToggleButtonProps, getChevronProps, chevronIcon, selectedItem, hasSelection, getClearButtonProps, icons }) => (
                <div className="rzero-combo-trigger" style={{ gap: 8 }}>
                  {selectedItem && (
                    <span
                      className="creative-track-trigger-art"
                      style={{ background: selectedItem.color }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                        <polygon points="8,5 19,12 8,19" />
                      </svg>
                    </span>
                  )}
                  <input {...getInputProps({
                    placeholder: hasSelection
                      ? `${selectedItem?.title} — ${selectedItem?.artist}`
                      : 'Search tracks...',
                  } as Record<string, unknown>)} />
                  {hasSelection && (
                    <button {...getClearButtonProps()}>{icons.clear}</button>
                  )}
                  <button {...getToggleButtonProps()}>
                    <span {...getChevronProps()}>{chevronIcon}</span>
                  </button>
                </div>
              )}
              renderItem={({ item }) => (
                <div className="creative-track-item">
                  <div className="creative-track-art" style={{ background: item.color }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(255,255,255,0.9)">
                      <polygon points="8,5 19,12 8,19" />
                    </svg>
                  </div>
                  <div className="creative-track-info">
                    <span className="creative-track-title">{item.title}</span>
                    <span className="creative-track-artist">{item.artist} · {item.album}</span>
                  </div>
                  <div className="creative-track-meta">
                    <span className="creative-track-duration">{item.duration}</span>
                    <span className="creative-track-bpm">{item.bpm} BPM</span>
                  </div>
                </div>
              )}
            />
          </div>
        </DemoCard>
      </div>

      {/* Full-width Destination Combo */}
      <div style={{ marginTop: 24 }}>
        <DemoCard
          title="Destination Selector"
          description="Rich travel cards with gradient backgrounds, ratings, and pricing"
          code={destinationCode}
        >
          <div style={{ width: 400, maxWidth: '100%' }}>
            <Combo<DestinationItem>
              items={destinations}
              itemToString={(item) => item?.label ?? ''}
              itemToValue={(item) => item.value}
              placeholder="Where to next?"
              label="Destination"
              theme={theme}
              renderTrigger={({ getInputProps, getToggleButtonProps, getChevronProps, chevronIcon, selectedItem, hasSelection, getClearButtonProps, icons }) => (
                <div className="rzero-combo-trigger" style={{ gap: 8 }}>
                  {selectedItem && (
                    <span className="creative-destination-trigger-badge" style={{ background: selectedItem.gradient }}>
                      {selectedItem.icon}
                    </span>
                  )}
                  <input {...getInputProps({
                    placeholder: hasSelection
                      ? `${selectedItem?.icon} ${selectedItem?.label}, ${selectedItem?.country}`
                      : 'Where to next?',
                  } as Record<string, unknown>)} />
                  {hasSelection && (
                    <button {...getClearButtonProps()}>{icons.clear}</button>
                  )}
                  <button {...getToggleButtonProps()}>
                    <span {...getChevronProps()}>{chevronIcon}</span>
                  </button>
                </div>
              )}
              renderItem={({ item }) => (
                <div className="creative-destination-card">
                  <div className="creative-destination-hero" style={{ background: item.gradient }}>
                    <span className="creative-destination-icon">{item.icon}</span>
                  </div>
                  <div className="creative-destination-info">
                    <div className="creative-destination-top">
                      <span className="creative-destination-name">{item.label}</span>
                      <span className="creative-destination-price">{item.price}</span>
                    </div>
                    <div className="creative-destination-bottom">
                      <span className="creative-destination-country">{item.country}</span>
                      <StarRating rating={item.rating} />
                    </div>
                  </div>
                </div>
              )}
            />
          </div>
        </DemoCard>
      </div>

      {/* --- Image Backgrounds & Custom Layouts --- */}
      <h3 className="demo-section-title" style={{ fontSize: '1.25rem', marginTop: 48, marginBottom: 8 }}>
        Image Backgrounds &amp; Custom Layouts
      </h3>
      <p className="demo-section-description" style={{ marginBottom: 24 }}>
        Full compositional control over <strong>headers</strong>, <strong>footers</strong>, and
        item layouts. Use <code>renderListHeader</code> and <code>renderFooter</code> to build
        complete UI experiences inside the popover.
      </p>

      {/* Art Gallery — full-bleed image items + custom header */}
      <DemoCard
        title="Abstract Art Gallery"
        description="Full-bleed image backgrounds with frosted glass overlay and category header"
        code={galleryCode}
      >
        <div style={{ width: 420, maxWidth: '100%' }}>
          <Combo<ArtworkItem>
            items={filteredArtworks}
            itemToString={(item) => item?.label ?? ''}
            itemToValue={(item) => item.value}
            placeholder="Browse artworks..."
            label="Gallery"
            theme={theme}
            renderTrigger={({ getInputProps, getToggleButtonProps, getChevronProps, chevronIcon, selectedItem, hasSelection, getClearButtonProps, icons }) => (
              <div className="rzero-combo-trigger" style={{ gap: 8 }}>
                {selectedItem && (
                  <span
                    className="creative-gallery-trigger-thumb"
                    style={{
                      backgroundImage: `url(${selectedItem.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                )}
                <input {...getInputProps({
                  placeholder: hasSelection
                    ? `${selectedItem?.label} — ${selectedItem?.artist}`
                    : 'Browse artworks...',
                } as Record<string, unknown>)} />
                {hasSelection && (
                  <button {...getClearButtonProps()}>{icons.clear}</button>
                )}
                <button {...getToggleButtonProps()}>
                  <span {...getChevronProps()}>{chevronIcon}</span>
                </button>
              </div>
            )}
            renderListHeader={() => (
              <div className="creative-gallery-header">
                {(['all', 'fluid', 'geometric', 'cosmic'] as const).map((cat) => (
                  <button
                    key={cat}
                    className={`creative-gallery-pill${galleryFilter === cat ? ' active' : ''}`}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setGalleryFilter(cat)}
                    type="button"
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            )}
            renderItem={({ item }) => (
              <div
                className="creative-gallery-item"
                style={{
                  backgroundImage: `url(${item.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="creative-gallery-overlay">
                  <div className="creative-gallery-text">
                    <span className="creative-gallery-title">{item.label}</span>
                    <span className="creative-gallery-artist">{item.artist}</span>
                  </div>
                  <span className="creative-gallery-medium">{item.medium}</span>
                </div>
              </div>
            )}
          />
        </div>
      </DemoCard>

      <div className="demo-grid-2" style={{ marginTop: 24 }}>
        {/* Palette Explorer — fluid swatch grid + custom footer */}
        <DemoCard
          title="Palette Explorer"
          description="Color swatch grids with category tags and an apply footer"
          code={paletteCode}
        >
          <div style={{ width: '100%' }}>
            <Combo<PaletteItem>
              items={palettes}
              itemToString={(item) => item?.label ?? ''}
              itemToValue={(item) => item.value}
              placeholder="Choose a palette..."
              label="Color Palette"
              theme={theme}
              renderTrigger={({ getInputProps, getToggleButtonProps, getChevronProps, chevronIcon, selectedItem, hasSelection, getClearButtonProps, icons }) => (
                <div className="rzero-combo-trigger" style={{ gap: 8 }}>
                  {selectedItem && (
                    <span className="creative-palette-trigger-dots">
                      {selectedItem.colors.map((c) => (
                        <span key={c} className="creative-palette-trigger-dot" style={{ background: c }} />
                      ))}
                    </span>
                  )}
                  <input {...getInputProps({
                    placeholder: hasSelection ? selectedItem?.label : 'Choose a palette...',
                  } as Record<string, unknown>)} />
                  {hasSelection && (
                    <button {...getClearButtonProps()}>{icons.clear}</button>
                  )}
                  <button {...getToggleButtonProps()}>
                    <span {...getChevronProps()}>{chevronIcon}</span>
                  </button>
                </div>
              )}
              renderItem={({ item }) => (
                <div className="creative-palette-item">
                  <div className="creative-palette-info">
                    <span className="creative-palette-name">{item.label}</span>
                    <span className="creative-palette-tag">{item.category}</span>
                  </div>
                  <div className="creative-palette-swatches">
                    {item.colors.map((c) => (
                      <span key={c} className="creative-palette-swatch" style={{ background: c }} />
                    ))}
                  </div>
                </div>
              )}
              renderFooter={({ selectedItem }) => (
                <div className="creative-palette-footer">
                  <span style={{ color: 'var(--demo-text-muted)', fontSize: 12 }}>
                    {selectedItem ? selectedItem.label : 'No palette selected'}
                  </span>
                  <span className="creative-palette-apply">
                    Apply to project
                  </span>
                </div>
              )}
            />
          </div>
        </DemoCard>

        {/* Component Library — complex cards + header + footer */}
        <DemoCard
          title="Component Library"
          description="Rich cards with gradient icons, badges, plus a custom header and footer"
          code={libraryCode}
        >
          <div style={{ width: '100%' }}>
            <Combo<ComponentItem>
              items={components}
              itemToString={(item) => item?.label ?? ''}
              itemToValue={(item) => item.value}
              placeholder="Search components..."
              label="Components"
              theme={theme}
              renderTrigger={({ getInputProps, getToggleButtonProps, getChevronProps, chevronIcon, selectedItem, hasSelection, getClearButtonProps, icons }) => (
                <div className="rzero-combo-trigger" style={{ gap: 8 }}>
                  {selectedItem && (
                    <span
                      className="creative-library-trigger-icon"
                      style={{ background: selectedItem.gradient }}
                    >
                      {selectedItem.icon}
                    </span>
                  )}
                  <input {...getInputProps({
                    placeholder: hasSelection ? selectedItem?.label : 'Search components...',
                  } as Record<string, unknown>)} />
                  {hasSelection && (
                    <button {...getClearButtonProps()}>{icons.clear}</button>
                  )}
                  <button {...getToggleButtonProps()}>
                    <span {...getChevronProps()}>{chevronIcon}</span>
                  </button>
                </div>
              )}
              renderListHeader={() => (
                <div className="creative-library-header">
                  <span className="creative-library-header-title">Browse Components</span>
                  <span className="creative-library-count">{components.length} available</span>
                </div>
              )}
              renderItem={({ item }) => (
                <div className="creative-library-item">
                  <span className="creative-library-icon" style={{ background: item.gradient }}>
                    {item.icon}
                  </span>
                  <div className="creative-library-info">
                    <span className="creative-library-name">{item.label}</span>
                    <span className="creative-library-desc">{item.description}</span>
                  </div>
                  {item.badge && (
                    <span className={`creative-library-badge ${item.badge}`}>
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
              renderFooter={({ selectedItem }) => (
                <div className="creative-library-footer">
                  <span style={{ color: 'var(--demo-text-muted)', fontSize: 12 }}>
                    {selectedItem ? `Selected: ${selectedItem.label}` : 'No selection'}
                  </span>
                  <span className="creative-library-cta">
                    Add to project &rarr;
                  </span>
                </div>
              )}
            />
          </div>
        </DemoCard>
      </div>

      {/* --- Attach to Anything --- */}
      <h3 className="demo-section-title" style={{ fontSize: '1.25rem', marginTop: 48, marginBottom: 8 }}>
        Attach to Anything
      </h3>
      <p className="demo-section-description" style={{ marginBottom: 24 }}>
        The dropdown doesn't need a text input. Use <code>variant="select"</code> and{' '}
        <code>renderTrigger</code> to attach selection behavior to <strong>any element</strong> — a
        floating action button, a profile card, or a dashboard panel.
      </p>

      <div className="demo-grid-2">
        {/* Floating Action Menu */}
        <DemoCard
          title="Floating Action Menu"
          description="A FAB button opens a quick-action list with keyboard shortcuts"
          code={actionMenuCode}
        >
          <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0' }}>
            <Combo<QuickAction>
              items={quickActions}
              variant="select"
              itemToString={(item) => item?.label ?? ''}
              itemToValue={(item) => item.value}
              label="Quick actions"
              theme={theme}
              classNames={{ list: 'creative-action-menu-list' }}
              renderTrigger={({ getTriggerProps, isOpen }) => (
                <button
                  {...getTriggerProps({
                    className: `creative-action-fab${isOpen ? ' open' : ''}`,
                  } as Record<string, unknown>)}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
              )}
              renderItem={({ item }) => (
                <div className="creative-action-item">
                  <span className="creative-action-icon">{item.icon}</span>
                  <span className="creative-action-label">{item.label}</span>
                  {item.shortcut && (
                    <span className="creative-action-shortcut">{item.shortcut}</span>
                  )}
                </div>
              )}
            />
          </div>
        </DemoCard>

        {/* Profile Menu */}
        <DemoCard
          title="Profile Menu"
          description="A user card that opens an account menu — nothing like a traditional input"
          code={profileMenuCode}
        >
          <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0' }}>
            <Combo<MenuItem>
              items={menuItems}
              variant="select"
              itemToString={(item) => item?.label ?? ''}
              itemToValue={(item) => item.value}
              label="Account menu"
              theme={theme}
              renderTrigger={({ getTriggerProps, isOpen }) => (
                <button
                  {...getTriggerProps({
                    className: `creative-profile-trigger${isOpen ? ' open' : ''}`,
                  } as Record<string, unknown>)}
                >
                  <span className="creative-profile-avatar">JD</span>
                  <div className="creative-profile-info">
                    <span className="creative-profile-name">Jane Doe</span>
                    <span className="creative-profile-role">Admin</span>
                  </div>
                  <svg className={`creative-profile-chevron${isOpen ? ' open' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              )}
              renderItem={({ item }) => (
                <div className={`creative-profile-item${item.danger ? ' danger' : ''}`}>
                  <span className="creative-profile-item-icon">{item.icon}</span>
                  <span className="creative-profile-item-label">{item.label}</span>
                </div>
              )}
              renderFooter={() => (
                <div className="creative-profile-footer">
                  v0.1.0 &middot; reactzero
                </div>
              )}
            />
          </div>
        </DemoCard>
      </div>

      {/* Mixed Dashboard */}
      <div style={{ marginTop: 24 }}>
        <DemoCard
          title="Mixed Dashboard"
          description="Widgets with status indicators and runnable actions in one dropdown — renderItem switches layout per item type"
          code={dashboardCode}
        >
          <div style={{ width: 420, maxWidth: '100%' }}>
            <Combo<DashboardItem>
              items={dashboardItems}
              itemToString={(item) => item?.label ?? ''}
              itemToValue={(item) => item.value}
              placeholder="Search dashboard..."
              label="Dashboard"
              theme={theme}
              renderListHeader={() => (
                <div className="creative-dashboard-header">
                  <span className="creative-dashboard-header-title">Dashboard</span>
                  <span className="creative-dashboard-count">{dashboardItems.length} items</span>
                </div>
              )}
              renderItem={({ item }) => (
                <div className={`creative-dashboard-item ${item.type}`}>
                  <span className="creative-dashboard-icon">{item.icon}</span>
                  <div className="creative-dashboard-info">
                    <span className="creative-dashboard-name">{item.label}</span>
                    <span className="creative-dashboard-desc">{item.description}</span>
                  </div>
                  {item.type === 'widget' && item.status && (
                    <span className={`creative-dashboard-dot ${item.status}`} />
                  )}
                  {item.type === 'action' && (
                    <span className="creative-dashboard-run">Run</span>
                  )}
                </div>
              )}
              renderFooter={({ selectedItem }) => (
                <div className="creative-dashboard-footer">
                  <span style={{ color: 'var(--demo-text-muted)', fontSize: 12 }}>
                    {selectedItem ? selectedItem.label : 'Select an item'}
                  </span>
                  {selectedItem && selectedItem.type === 'widget' && (
                    <span className="creative-dashboard-open">Open &rarr;</span>
                  )}
                  {selectedItem && selectedItem.type === 'action' && (
                    <span className="creative-dashboard-open">Execute &rarr;</span>
                  )}
                </div>
              )}
            />
          </div>
        </DemoCard>
      </div>
    </div>
  );
}
