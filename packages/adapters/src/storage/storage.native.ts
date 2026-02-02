import type { StorageAdapter } from './types';
import { TypedStorage } from './types';

/**
 * React Native implementation of StorageAdapter using AsyncStorage
 * Note: AsyncStorage should be installed as an optional dependency
 */
export class NativeStorage implements StorageAdapter {
  private asyncStorage: any;

  constructor() {
    // Lazy load AsyncStorage to avoid errors on web
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      this.asyncStorage = AsyncStorage.default || AsyncStorage;
    } catch (error) {
      console.warn(
        'AsyncStorage not available. Install @react-native-async-storage/async-storage'
      );
      // Provide a no-op implementation
      this.asyncStorage = {
        getItem: async () => null,
        setItem: async () => {},
        removeItem: async () => {},
        clear: async () => {},
        getAllKeys: async () => [],
      };
    }
  }

  async getItem(key: string): Promise<string | null> {
    try {
      return await this.asyncStorage.getItem(key);
    } catch (error) {
      console.error('NativeStorage.getItem error:', error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      await this.asyncStorage.setItem(key, value);
    } catch (error) {
      console.error('NativeStorage.setItem error:', error);
      throw error;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await this.asyncStorage.removeItem(key);
    } catch (error) {
      console.error('NativeStorage.removeItem error:', error);
    }
  }

  async clear(): Promise<void> {
    try {
      await this.asyncStorage.clear();
    } catch (error) {
      console.error('NativeStorage.clear error:', error);
    }
  }

  async getAllKeys(): Promise<string[]> {
    try {
      return await this.asyncStorage.getAllKeys();
    } catch (error) {
      console.error('NativeStorage.getAllKeys error:', error);
      return [];
    }
  }
}

const nativeStorage = new NativeStorage();

export const storage = nativeStorage;
export const typedStorage = new TypedStorage(nativeStorage);
