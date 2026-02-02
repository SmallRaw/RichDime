import type { DeviceInfoAdapter } from './device-info';

/**
 * Web implementation of DeviceInfoAdapter
 */
export class WebDeviceInfo implements DeviceInfoAdapter {
  platform = 'web' as const;
  isWeb = true;
  isNative = false;

  getDeviceName(): string {
    return navigator.userAgent;
  }

  getSystemVersion(): string {
    return navigator.platform;
  }

  getAppVersion(): string {
    // Try to get version from environment variables
    // Next.js: process.env.NEXT_PUBLIC_APP_VERSION
    // Vite: import.meta.env.VITE_APP_VERSION
    if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_APP_VERSION) {
      return process.env.NEXT_PUBLIC_APP_VERSION;
    }
    return '1.0.0';
  }
}

export const deviceInfo = new WebDeviceInfo();
