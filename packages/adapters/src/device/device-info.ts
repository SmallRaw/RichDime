/**
 * Device information adapter interface
 */
export interface DeviceInfoAdapter {
  /**
   * Current platform: 'web', 'ios', or 'android'
   */
  platform: 'web' | 'ios' | 'android';

  /**
   * Is running on web
   */
  isWeb: boolean;

  /**
   * Is running on native (iOS or Android)
   */
  isNative: boolean;

  /**
   * Get device/browser name
   */
  getDeviceName(): string;

  /**
   * Get system version
   */
  getSystemVersion(): string;

  /**
   * Get app version
   */
  getAppVersion(): string;
}

/**
 * Placeholder device info - will be replaced by platform-specific implementation
 * Metro/Webpack will resolve .native.ts or .web.ts at build time
 */
class PlaceholderDeviceInfo implements DeviceInfoAdapter {
  platform: 'web' | 'ios' | 'android' = 'web';
  isWeb = true;
  isNative = false;

  getDeviceName(): string {
    return 'Unknown';
  }

  getSystemVersion(): string {
    return 'Unknown';
  }

  getAppVersion(): string {
    return '1.0.0';
  }
}

export const deviceInfo: DeviceInfoAdapter = new PlaceholderDeviceInfo();
