import type { ComboAction, ComboState } from '../types';
import { clamp } from './utils';

interface KeyboardOptions {
  variant: 'input' | 'select';
  commitOnBlur: boolean;
  mode: 'single' | 'multi';
}

/**
 * Creates a keydown handler that dispatches combo actions.
 * The handler is a pure mapping from keyboard events to dispatch calls.
 */
export function createKeyboardHandler<T>(
  dispatch: (action: ComboAction<T>) => void,
  state: ComboState<T>,
  options: KeyboardOptions,
): (event: React.KeyboardEvent) => void {
  return (event: React.KeyboardEvent) => {
    const isOpen =
      state.status === 'OPEN_IDLE' || state.status === 'OPEN_HIGHLIGHTED';

    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        if (!isOpen) {
          dispatch({ type: 'OPEN_MENU' });
          dispatch({ type: 'HIGHLIGHT_FIRST' });
        } else {
          dispatch({ type: 'HIGHLIGHT_NEXT' });
        }
        break;
      }

      case 'ArrowUp': {
        event.preventDefault();
        if (!isOpen) {
          dispatch({ type: 'OPEN_MENU' });
          dispatch({ type: 'HIGHLIGHT_LAST' });
        } else {
          dispatch({ type: 'HIGHLIGHT_PREV' });
        }
        break;
      }

      case 'Enter': {
        if (isOpen && state.highlightedIndex >= 0) {
          event.preventDefault();
          dispatch({ type: 'SELECT_HIGHLIGHTED' });
        }
        break;
      }

      case 'Escape': {
        if (isOpen) {
          event.preventDefault();
          dispatch({ type: 'CLOSE_MENU' });
        }
        break;
      }

      case 'Home': {
        if (isOpen) {
          event.preventDefault();
          dispatch({ type: 'HIGHLIGHT_FIRST' });
        }
        break;
      }

      case 'End': {
        if (isOpen) {
          event.preventDefault();
          dispatch({ type: 'HIGHLIGHT_LAST' });
        }
        break;
      }

      case 'PageDown': {
        if (isOpen) {
          event.preventDefault();
          const maxIdx = state.filteredItems.length - 1;
          dispatch({
            type: 'HIGHLIGHT_ITEM',
            index: clamp(state.highlightedIndex + 10, 0, maxIdx),
          });
        }
        break;
      }

      case 'PageUp': {
        if (isOpen) {
          event.preventDefault();
          dispatch({
            type: 'HIGHLIGHT_ITEM',
            index: clamp(state.highlightedIndex - 10, 0, state.filteredItems.length - 1),
          });
        }
        break;
      }

      case 'Tab': {
        // Do NOT preventDefault — let focus move naturally
        if (isOpen) {
          if (options.commitOnBlur && state.highlightedIndex >= 0) {
            dispatch({ type: 'SELECT_HIGHLIGHTED' });
          }
          dispatch({ type: 'CLOSE_MENU' });
        }
        break;
      }

      case 'Backspace': {
        // In multi mode, remove last chip when input is empty
        if (state.inputValue === '') {
          dispatch({ type: 'REMOVE_LAST_CHIP' });
        }
        break;
      }

      case ' ': {
        // Space opens the menu in select variant (button trigger)
        if (options.variant === 'select' && !isOpen) {
          event.preventDefault();
          dispatch({ type: 'OPEN_MENU' });
          dispatch({ type: 'HIGHLIGHT_FIRST' });
        } else if (options.variant === 'select' && isOpen && state.highlightedIndex >= 0) {
          event.preventDefault();
          dispatch({ type: 'SELECT_HIGHLIGHTED' });
        }
        break;
      }

      case 'a':
      case 'A': {
        // Ctrl+A / Cmd+A selects all in multi mode
        if ((event.ctrlKey || event.metaKey) && options.mode === 'multi') {
          event.preventDefault();
          dispatch({ type: 'SELECT_ALL' });
        }
        break;
      }
    }
  };
}
