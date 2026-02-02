/**
 * Re-export types and TypedStorage from types.ts
 * Platform-specific implementations are in .web.ts and .native.ts
 */
export type { StorageAdapter } from './types';
export { TypedStorage } from './types';

import type { StorageAdapter } from './types';
import { TypedStorage } from './types';

/**
 * Placeholder storage - will be replaced by platform-specific implementation
 * Metro/Webpack will resolve .native.ts or .web.ts at build time
 */
class PlaceholderStorage implements StorageAdapter {
  async getItem(_key: string): Promise<string | null> {
    console.warn('Storage not available');
    return null;
  }

  async setItem(_key: string, _value: string): Promise<void> {
    console.warn('Storage not available');
  }

  async removeItem(_key: string): Promise<void> {
    console.warn('Storage not available');
  }

  async clear(): Promise<void> {
    console.warn('Storage not available');
  }

  async getAllKeys(): Promise<string[]> {
    console.warn('Storage not available');
    return [];
  }
}

const placeholderStorage = new PlaceholderStorage();

export const storage: StorageAdapter = placeholderStorage;
export const typedStorage = new TypedStorage(placeholderStorage);
