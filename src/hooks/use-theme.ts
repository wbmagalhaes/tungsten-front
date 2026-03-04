import { useState, useCallback } from 'react';

export const THEMES = ['cyberpunk', 'dark', 'light', 'neon'] as const;
export type Theme = (typeof THEMES)[number];

export const THEME_META: Record<
  Theme,
  { label: string; bg: string; primary: string; accent: string }
> = {
  cyberpunk: {
    label: 'Cyberpunk',
    bg: '#0b0f1a',
    primary: '#9131be',
    accent: '#ff2bd6',
  },
  dark: {
    label: 'Dark',
    bg: '#09090b',
    primary: '#6d28d9',
    accent: '#7c3aed',
  },
  light: {
    label: 'Light',
    bg: '#ffffff',
    primary: '#7c3aed',
    accent: '#a855f7',
  },
  neon: {
    label: 'Neon',
    bg: '#000000',
    primary: '#00ffcc',
    accent: '#ff00ff',
  },
};

const STORAGE_KEY = 'app-theme';

function getInitialTheme(): Theme {
  const saved = localStorage.getItem(STORAGE_KEY);
  return (THEMES as readonly string[]).includes(saved ?? '')
    ? (saved as Theme)
    : 'cyberpunk';
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.setAttribute('data-theme', next);
  }, []);

  return { theme, setTheme, themes: THEMES };
}
