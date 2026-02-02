/**
 * Theme adapter shared types
 */
export type ColorSchemeValue = 'light' | 'dark';

export interface ColorSchemeAdapterState {
  colorScheme: ColorSchemeValue | null;
  setColorScheme: (value: ColorSchemeValue) => void;
  toggleColorScheme: () => void;
}

export type UseColorSchemeAdapter = () => ColorSchemeAdapterState;
