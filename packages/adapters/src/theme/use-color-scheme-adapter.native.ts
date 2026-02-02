import { useCallback, useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import type {
  ColorSchemeAdapterState,
  ColorSchemeValue,
  UseColorSchemeAdapter,
} from './types';

/**
 * Native implementation using React Native's Appearance API
 */
export const useColorSchemeAdapter: UseColorSchemeAdapter = () => {
  const [colorScheme, setColorSchemeState] = useState<ColorSchemeValue>(() => {
    const systemScheme = Appearance.getColorScheme();
    return systemScheme === 'dark' || systemScheme === 'light' ? systemScheme : 'light';
  });

  // Listen to system color scheme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme: newScheme }) => {
      if (newScheme === 'dark' || newScheme === 'light') {
        setColorSchemeState(newScheme);
      }
    });

    return () => subscription.remove();
  }, []);

  const setColorScheme = useCallback((value: ColorSchemeValue) => {
    setColorSchemeState(value);
    // Note: Appearance.setColorScheme() is available in React Native 0.72+
    // but may require additional setup. For now, we just update local state.
    try {
      Appearance.setColorScheme(value);
    } catch {
      // Ignore if not supported
    }
  }, []);

  const toggleColorScheme = useCallback(() => {
    setColorSchemeState((current) => {
      const newScheme = current === 'dark' ? 'light' : 'dark';
      try {
        Appearance.setColorScheme(newScheme);
      } catch {
        // Ignore if not supported
      }
      return newScheme;
    });
  }, []);

  return {
    colorScheme,
    setColorScheme,
    toggleColorScheme,
  } satisfies ColorSchemeAdapterState;
};
