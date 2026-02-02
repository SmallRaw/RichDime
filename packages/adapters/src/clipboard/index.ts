/**
 * Clipboard adapter - auto-selects platform implementation
 * Metro/Webpack will automatically choose .web.ts or .native.ts
 */
export { clipboard } from './clipboard';
export type { ClipboardAdapter } from './clipboard';
