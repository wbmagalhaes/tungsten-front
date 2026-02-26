import { useState, useCallback } from 'react';

export const THEMES = ['cyberpunk', 'dark', 'light', 'neon'] as const;
export type Theme = (typeof THEMES)[number];

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
