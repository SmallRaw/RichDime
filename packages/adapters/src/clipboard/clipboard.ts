/**
 * Clipboard adapter interface
 * Provides a unified API for clipboard operations across platforms
 */
export interface ClipboardAdapter {
  /**
   * Get the current text from clipboard
   * @returns The clipboard text content
   */
  getString(): Promise<string>;

  /**
   * Set text to clipboard
   * @param text - The text to copy to clipboard
   */
  setString(text: string): Promise<void>;

  /**
   * Check if clipboard has text content
   * @returns True if clipboard has string content
   */
  hasString(): Promise<boolean>;
}

/**
 * Placeholder clipboard - will be replaced by platform-specific implementation
 * Metro/Webpack will resolve .native.ts or .web.ts at build time
 */
class PlaceholderClipboard implements ClipboardAdapter {
  async getString(): Promise<string> {
    console.warn('Clipboard not available');
    return '';
  }

  async setString(_text: string): Promise<void> {
    console.warn('Clipboard not available');
  }

  async hasString(): Promise<boolean> {
    console.warn('Clipboard not available');
    return false;
  }
}

export const clipboard: ClipboardAdapter = new PlaceholderClipboard();
