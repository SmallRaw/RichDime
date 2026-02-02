/**
 * Storage adapter - auto-selects platform implementation
 * Metro/Webpack will automatically choose .web.ts or .native.ts
 */
export { storage, typedStorage } from './storage';
export type { StorageAdapter } from './types';
export { TypedStorage } from './types';
