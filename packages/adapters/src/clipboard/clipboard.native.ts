import type { ClipboardAdapter } from './clipboard';

/**
 * React Native implementation of ClipboardAdapter
 * Note: @react-native-clipboard/clipboard should be installed as an optional dependency
 */
export class NativeClipboard implements ClipboardAdapter {
  private clipboardModule: any;

  constructor() {
    // Lazy load Clipboard to avoid errors on web
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const Clipboard = require('@react-native-clipboard/clipboard');
      this.clipboardModule = Clipboard.default || Clipboard;
    } catch (error) {
      console.warn(
        'Clipboard not available. Install @react-native-clipboard/clipboard'
      );
      // Provide a no-op implementation
      this.clipboardModule = {
        getString: async () => '',
        setString: async () => {},
        hasString: async () => false,
      };
    }
  }

  async getString(): Promise<string> {
    try {
      return await this.clipboardModule.getString();
    } catch (error) {
      console.error('NativeClipboard.getString error:', error);
      return '';
    }
  }

  async setString(text: string): Promise<void> {
    try {
      this.clipboardModule.setString(text);
    } catch (error) {
      console.error('NativeClipboard.setString error:', error);
      throw error;
    }
  }

  async hasString(): Promise<boolean> {
    try {
      return await this.clipboardModule.hasString();
    } catch (error) {
      console.error('NativeClipboard.hasString error:', error);
      return false;
    }
  }
}

export const clipboard = new NativeClipboard();
