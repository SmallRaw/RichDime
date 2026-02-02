# @rich-dime/adapters

Platform adapters for third-party libraries. Provides unified APIs across web and native platforms.

## Features

- 🔌 **Unified API** - Same code works on Web, iOS, and Android
- 📦 **Tree-shakeable** - Import only what you need
- 🎯 **Type-safe** - Full TypeScript support
- 🔄 **Auto-switching** - Platform implementations auto-selected
- 🛡️ **Error handling** - Graceful fallbacks

## Installation

```bash
pnpm add @rich-dime/adapters
```

### Optional Dependencies (Native only)

```bash
# For storage
pnpm add @react-native-async-storage/async-storage

# For clipboard
pnpm add @react-native-clipboard/clipboard
```

## Usage

### Storage

```typescript
import { storage, typedStorage } from '@rich-dime/adapters';

// Basic usage
await storage.setItem('key', 'value');
const value = await storage.getItem('key');

// Typed JSON storage
interface User {
  name: string;
  age: number;
}

await typedStorage.setJSON('user', { name: 'John', age: 30 });
const user = await typedStorage.getJSON<User>('user');
```

### Clipboard

```typescript
import { clipboard } from '@rich-dime/adapters';

// Copy to clipboard
await clipboard.setString('Hello World');

// Read from clipboard
const text = await clipboard.getString();

// Check if has content
const hasContent = await clipboard.hasString();
```

### Device Info

```typescript
import { deviceInfo } from '@rich-dime/adapters';

console.log(deviceInfo.platform); // 'web' | 'ios' | 'android'
console.log(deviceInfo.isWeb); // true on web
console.log(deviceInfo.isNative); // true on React Native

const name = deviceInfo.getDeviceName();
const version = deviceInfo.getSystemVersion();
```

## How it works

The package uses platform-specific files (`.web.ts` and `.native.ts`) that are automatically selected by Metro (React Native) or Webpack/Vite (Web):

```
src/storage/
├── storage.ts          # Interface & shared code
├── storage.web.ts      # Web implementation (localStorage)
├── storage.native.ts   # Native implementation (AsyncStorage)
└── index.ts            # Auto-selects correct implementation
```

## API Reference

### Storage

```typescript
interface StorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
  getAllKeys(): Promise<string[]>;
}

class TypedStorage {
  getJSON<T>(key: string): Promise<T | null>;
  setJSON<T>(key: string, value: T): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
  getAllKeys(): Promise<string[]>;
}
```

### Clipboard

```typescript
interface ClipboardAdapter {
  getString(): Promise<string>;
  setString(text: string): Promise<void>;
  hasString(): Promise<boolean>;
}
```

### Device Info

```typescript
interface DeviceInfoAdapter {
  platform: 'web' | 'ios' | 'android';
  isWeb: boolean;
  isNative: boolean;
  getDeviceName(): string;
  getSystemVersion(): string;
  getAppVersion(): string;
}
```

## Error Handling

All adapters include built-in error handling with console warnings. Errors are caught and graceful fallbacks are provided.

## Adding More Adapters

To add a new adapter:

1. Create a new directory in `src/`
2. Create interface file (`adapter-name.ts`)
3. Create platform implementations (`.web.ts`, `.native.ts`)
4. Create `index.ts` to export
5. Add to main `src/index.ts`

Example structure:

```
src/network/
├── http-client.ts
├── http-client.web.ts
├── http-client.native.ts
└── index.ts
```

## License

Private package for @rich-dime project.
