import type { ClipboardAdapter } from './clipboard';

/**
 * Web implementation of ClipboardAdapter using navigator.clipboard
 */
export class WebClipboard implements ClipboardAdapter {
  async getString(): Promise<string> {
    try {
      if (navigator.clipboard?.readText) {
        return await navigator.clipboard.readText();
      }
      console.warn('Clipboard API not available');
      return '';
    } catch (error) {
      console.error('WebClipboard.getString error:', error);
      return '';
    }
  }

  async setString(text: string): Promise<void> {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    } catch (error) {
      console.error('WebClipboard.setString error:', error);
      throw error;
    }
  }

  async hasString(): Promise<boolean> {
    try {
      const text = await this.getString();
      return text.length > 0;
    } catch (error) {
      console.error('WebClipboard.hasString error:', error);
      return false;
    }
  }
}

export const clipboard = new WebClipboard();
