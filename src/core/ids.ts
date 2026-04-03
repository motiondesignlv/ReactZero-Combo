import { useId, useRef } from 'react';

const PREFIX = 'rzero';

export interface ComboIds {
  base: string;
  input: string;
  label: string;
  listbox: string;
  toggleButton: string;
  clearButton: string;
  liveRegion: string;
  item: (index: number) => string;
  group: (index: number) => string;
}

function buildIds(id: string): ComboIds {
  return {
    base: id,
    input: `${PREFIX}-input-${id}`,
    label: `${PREFIX}-label-${id}`,
    listbox: `${PREFIX}-listbox-${id}`,
    toggleButton: `${PREFIX}-toggle-${id}`,
    clearButton: `${PREFIX}-clear-${id}`,
    liveRegion: `${PREFIX}-live-${id}`,
    item: (index: number) => `${PREFIX}-item-${id}-${index}`,
    group: (index: number) => `${PREFIX}-group-${id}-${index}`,
  };
}

export function useComboIds(userProvidedId?: string): ComboIds {
  const reactId = useId();
  const id = userProvidedId ?? reactId;

  const idsRef = useRef<ComboIds | null>(null);
  if (!idsRef.current || idsRef.current.base !== id) {
    idsRef.current = buildIds(id);
  }
  return idsRef.current;
}
