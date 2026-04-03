/**
 * Scroll a highlighted item into view within a scrollable listbox.
 */
export function scrollIntoView(
  listboxElement: HTMLElement | null,
  highlightedIndex: number,
): void {
  if (!listboxElement || highlightedIndex < 0) return;
  const item = listboxElement.querySelector(
    `[data-rzero-index="${highlightedIndex}"]`,
  );
  if (item && typeof item.scrollIntoView === 'function') {
    item.scrollIntoView({ block: 'nearest' });
  }
}
