/**
 * @rich-dime/adapters
 *
 * Platform adapters for third-party libraries
 * Provides unified APIs across web and native platforms
 */

// Storage
export { storage, typedStorage } from './storage';
export type { StorageAdapter } from './storage';

// Clipboard
export { clipboard } from './clipboard';
export type { ClipboardAdapter } from './clipboard';

// Device Info
export { deviceInfo } from './device';
export type { DeviceInfoAdapter } from './device';

// Theme
export { useColorSchemeAdapter, NAV_THEME } from './theme';
export type {
  ColorSchemeAdapterState,
  ColorSchemeValue,
  UseColorSchemeAdapter,
} from './theme';
