// packages/kit/src/navigation/link.tsx
// 跨平台的 Link 组件封装
import { Platform } from 'react-native';
import { Link as ExpoLink } from 'expo-router';
// import { Link as NextLink } from 'next/link';

export function Link({ href, children, ...props }: any) {
  if (Platform.OS === 'web') {
    // return <NextLink href={href} {...props}>{children}</NextLink>;
    return <ExpoLink href={href} {...props}>{children}</ExpoLink>;
  }
  return <ExpoLink href={href} {...props}>{children}</ExpoLink>;
}