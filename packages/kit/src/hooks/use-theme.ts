import { useColorSchemeAdapter } from '@rich-dime/adapters';

/**
 * Theme hook - provides theme state and controls
 */
export function useTheme() {
  const { colorScheme, setColorScheme, toggleColorScheme } = useColorSchemeAdapter();

  return {
    /**
     * Current theme: 'light' or 'dark'
     */
    theme: (colorScheme ?? 'light') as 'light' | 'dark',

    /**
     * Is dark mode active
     */
    isDark: colorScheme === 'dark',

    /**
     * Set theme explicitly
     */
    setTheme: setColorScheme,

    /**
     * Toggle between light and dark
     */
    toggleTheme: toggleColorScheme,
  };
}
