import { useEffect } from 'react';

type ParsedHotkey = {
  key: string;
  ctrl: boolean;
  meta: boolean;
  shift: boolean;
  alt: boolean;
};

function parseHotkey(hotkey: string): ParsedHotkey {
  const parts = hotkey.toLowerCase().split('+');

  return {
    key: parts.find(
      (p) => !['ctrl', 'control', 'cmd', 'meta', 'shift', 'alt'].includes(p),
    )!,
    ctrl: parts.includes('ctrl') || parts.includes('control'),
    meta: parts.includes('cmd') || parts.includes('meta'),
    shift: parts.includes('shift'),
    alt: parts.includes('alt'),
  };
}

function matches(e: KeyboardEvent, hotkey: ParsedHotkey) {
  return (
    e.key.toLowerCase() === hotkey.key &&
    e.ctrlKey === hotkey.ctrl &&
    e.metaKey === hotkey.meta &&
    e.shiftKey === hotkey.shift &&
    e.altKey === hotkey.alt
  );
}

export function useHotkeys(hotkey: string, handler: () => void) {
  useEffect(() => {
    const parsed = parseHotkey(hotkey);

    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;

      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if (matches(e, parsed)) {
        e.preventDefault();
        handler();
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [hotkey, handler]);
}
