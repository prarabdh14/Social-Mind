import { useEffect, useRef, useCallback } from 'react';

interface UseKeyboardNavigationOptions {
  onEscape?: () => void;
  onEnter?: () => void;
  onSpace?: () => void;
  onTab?: (direction: 'forward' | 'backward') => void;
  trapFocus?: boolean;
  focusableSelectors?: string;
}

export const useKeyboardNavigation = (options: UseKeyboardNavigationOptions = {}) => {
  const containerRef = useRef<HTMLElement>(null);
  const {
    onEscape,
    onEnter,
    onSpace,
    onTab,
    trapFocus = false,
    focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]'
  } = options;

  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];
    
    return Array.from(
      containerRef.current.querySelectorAll(focusableSelectors)
    ).filter((el) => {
      const element = el as HTMLElement;
      return !element.disabled && element.offsetParent !== null;
    }) as HTMLElement[];
  }, [focusableSelectors]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const { key, shiftKey, target } = event;

    // Handle Tab key for focus trapping
    if (key === 'Tab' && trapFocus) {
      const focusableElements = getFocusableElements();
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (shiftKey) {
        // Shift + Tab (backward)
        if (target === firstElement) {
          event.preventDefault();
          lastElement?.focus();
          onTab?.('backward');
        }
      } else {
        // Tab (forward)
        if (target === lastElement) {
          event.preventDefault();
          firstElement?.focus();
          onTab?.('forward');
        }
      }
    }

    // Handle other keys
    switch (key) {
      case 'Escape':
        event.preventDefault();
        onEscape?.();
        break;
      case 'Enter':
        if (target instanceof HTMLElement && target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          event.preventDefault();
          onEnter?.();
        }
        break;
      case ' ':
        if (target instanceof HTMLElement && target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          event.preventDefault();
          onSpace?.();
        }
        break;
    }
  }, [onEscape, onEnter, onSpace, onTab, trapFocus, getFocusableElements]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return containerRef;
};

// Hook for managing focus states
export const useFocusManagement = () => {
  const focusHistory = useRef<HTMLElement[]>([]);

  const saveFocus = useCallback(() => {
    if (document.activeElement instanceof HTMLElement) {
      focusHistory.current.push(document.activeElement);
    }
  }, []);

  const restoreFocus = useCallback(() => {
    const lastFocus = focusHistory.current.pop();
    if (lastFocus) {
      lastFocus.focus();
    }
  }, []);

  const clearFocusHistory = useCallback(() => {
    focusHistory.current = [];
  }, []);

  return {
    saveFocus,
    restoreFocus,
    clearFocusHistory
  };
};

// Hook for skip links
export const useSkipLink = (targetId: string) => {
  const handleSkip = useCallback(() => {
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }, [targetId]);

  return handleSkip;
}; 