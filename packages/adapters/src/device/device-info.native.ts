import { Platform } from 'react-native';
import type { DeviceInfoAdapter } from './device-info';

/**
 * React Native implementation of DeviceInfoAdapter
 */
export class NativeDeviceInfo implements DeviceInfoAdapter {
  platform = Platform.OS as 'ios' | 'android';
  isWeb = false;
  isNative = true;

  getDeviceName(): string {
    // You can install react-native-device-info for more detailed info
    // For now, just return the OS
    return Platform.OS;
  }

  getSystemVersion(): string {
    return Platform.Version.toString();
  }

  getAppVersion(): string {
    // You can use expo-constants or react-native-device-info
    // For now, return a default
    return '1.0.0';
  }
}

export const deviceInfo = new NativeDeviceInfo();
