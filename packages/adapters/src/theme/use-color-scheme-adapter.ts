import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
  ColorSchemeAdapterState,
  ColorSchemeValue,
  UseColorSchemeAdapter,
} from './types';

const STORAGE_KEY = 'rich-dime:theme';
const MEDIA_QUERY = '(prefers-color-scheme: dark)';

const isBrowser = () => typeof window !== 'undefined';

const readStoredPreference = (): ColorSchemeValue | null => {
  if (!isBrowser()) return null;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'dark' || stored === 'light' ? stored : null;
  } catch (error) {
    console.warn('Unable to read stored theme preference:', error);
    return null;
  }
};

const getSystemPreference = (): ColorSchemeValue => {
  if (!isBrowser() || typeof window.matchMedia !== 'function') {
    return 'light';
  }

  return window.matchMedia(MEDIA_QUERY).matches ? 'dark' : 'light';
};

const applyThemeToDocument = (scheme: ColorSchemeValue) => {
  if (typeof document === 'undefined') return;

  document.documentElement.dataset.theme = scheme;
  document.documentElement.style.colorScheme = scheme;
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(scheme);
};

const persistPreference = (scheme: ColorSchemeValue | null) => {
  if (!isBrowser()) return;
  try {
    if (scheme) {
      window.localStorage.setItem(STORAGE_KEY, scheme);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    console.warn('Unable to persist theme preference:', error);
  }
};

/**
 * Web implementation using the browser color scheme media query
 */
export const useColorSchemeAdapter: UseColorSchemeAdapter = () => {
  const storedPreference = useMemo(readStoredPreference, []);
  const [colorScheme, setColorSchemeState] = useState<ColorSchemeValue>(() => {
    return storedPreference ?? getSystemPreference();
  });
  const [hasManualPreference, setHasManualPreference] = useState<boolean>(
    storedPreference !== null
  );

  useEffect(() => {
    applyThemeToDocument(colorScheme);
    if (hasManualPreference) {
      persistPreference(colorScheme);
    } else {
      persistPreference(null);
    }
  }, [colorScheme, hasManualPreference]);

  useEffect(() => {
    if (!isBrowser() || typeof window.matchMedia !== 'function') {
      return;
    }

    const mediaQueryList = window.matchMedia(MEDIA_QUERY);
    const handleChange = (event: MediaQueryListEvent) => {
      if (hasManualPreference) {
        return;
      }
      setColorSchemeState(event.matches ? 'dark' : 'light');
    };

    if (typeof mediaQueryList.addEventListener === 'function') {
      mediaQueryList.addEventListener('change', handleChange);
      return () => mediaQueryList.removeEventListener('change', handleChange);
    }

    mediaQueryList.addListener(handleChange);
    return () => mediaQueryList.removeListener(handleChange);
  }, [hasManualPreference]);

  const setColorScheme = useCallback(
    (value: ColorSchemeValue) => {
      setColorSchemeState(value);
      setHasManualPreference(true);
    },
    []
  );

  const toggleColorScheme = useCallback(() => {
    setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
  }, [colorScheme, setColorScheme]);

  return {
    colorScheme,
    setColorScheme,
    toggleColorScheme,
  } satisfies ColorSchemeAdapterState;
};
