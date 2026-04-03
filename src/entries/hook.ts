import { registerDefaultIcons, registerChevronPresets } from '../icons/icons';
import { defaultIcons, chevronPresets } from '../icons/defaults';

registerDefaultIcons(() => defaultIcons);
registerChevronPresets(() => chevronPresets);

export { useCombo } from '../hooks/useCombo';
export { setDefaultIcons } from '../icons/icons';
export type {
  UseComboOptions,
  UseComboReturn,
  ComboState,
  ComboAction,
  ComboStatus,
  IconSlots,
  ChevronStyle,
  PropGetter,
  ComboGroup,
} from '../types';
