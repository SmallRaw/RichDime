/**
 * Storage adapter interface
 * Provides a unified API for storage across platforms
 */
export interface StorageAdapter {
  /**
   * Get an item from storage
   * @param key - The key of the item
   * @returns The value or null if not found
   */
  getItem(key: string): Promise<string | null>;

  /**
   * Set an item in storage
   * @param key - The key of the item
   * @param value - The value to store
   */
  setItem(key: string, value: string): Promise<void>;

  /**
   * Remove an item from storage
   * @param key - The key of the item to remove
   */
  removeItem(key: string): Promise<void>;

  /**
   * Clear all items from storage
   */
  clear(): Promise<void>;

  /**
   * Get all keys in storage
   * @returns Array of all keys
   */
  getAllKeys(): Promise<string[]>;
}

/**
 * Typed storage helper for JSON serialization
 */
export class TypedStorage {
  constructor(private adapter: StorageAdapter) {}

  async getJSON<T>(key: string): Promise<T | null> {
    const value = await this.adapter.getItem(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Failed to parse JSON for key "${key}":`, error);
      return null;
    }
  }

  async setJSON<T>(key: string, value: T): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      await this.adapter.setItem(key, serialized);
    } catch (error) {
      console.error(`Failed to serialize JSON for key "${key}":`, error);
      throw error;
    }
  }

  async removeItem(key: string): Promise<void> {
    return this.adapter.removeItem(key);
  }

  async clear(): Promise<void> {
    return this.adapter.clear();
  }

  async getAllKeys(): Promise<string[]> {
    return this.adapter.getAllKeys();
  }
}
