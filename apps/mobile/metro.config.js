const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. 监视整个 monorepo
config.watchFolders = [workspaceRoot];

// 2. 让 Metro 能找到 workspace root 的 node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 3. 映射 workspace 包到源文件（支持子路径导出）
const workspacePackages = {
  '@rich-dime/kit': path.resolve(workspaceRoot, 'packages/kit/src'),
  '@rich-dime/adapters': path.resolve(workspaceRoot, 'packages/adapters/src'),
  '@rich-dime/common': path.resolve(workspaceRoot, 'packages/common/src'),
  '@rich-dime/component': path.resolve(workspaceRoot, 'packages/component/src'),
  '@rich-dime/database': path.resolve(workspaceRoot, 'packages/database/src'),
};

config.resolver.extraNodeModules = workspacePackages;

// 4. 保存原始解析器
const originalResolveRequest = config.resolver.resolveRequest;

// 5. 支持 WASM 文件（expo-sqlite Web 支持需要）
config.resolver.assetExts = [...(config.resolver.assetExts || []), 'wasm'];

// 5.1 排除不应被打包的工具包（返回空模块）
const devOnlyPackages = ['drizzle-kit', 'prettier', 'prettier-plugin-tailwindcss'];

// 5.2 强制使用 CommonJS 版本的包（避免 import.meta 在 Web 上的问题）
const forceCommonJS = {
  'jotai': path.resolve(workspaceRoot, 'node_modules/jotai/index.js'),
  'jotai/utils': path.resolve(workspaceRoot, 'node_modules/jotai/utils.js'),
  'jotai/vanilla': path.resolve(workspaceRoot, 'node_modules/jotai/vanilla.js'),
  'jotai/vanilla/utils': path.resolve(workspaceRoot, 'node_modules/jotai/vanilla/utils.js'),
  'jotai/react': path.resolve(workspaceRoot, 'node_modules/jotai/react.js'),
  'jotai/react/utils': path.resolve(workspaceRoot, 'node_modules/jotai/react/utils.js'),
};

// 6. 自定义解析器：处理子路径导出和排除工具包
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // 排除开发工具包（避免 import.meta 等兼容性问题）
  if (devOnlyPackages.some(pkg => moduleName === pkg || moduleName.startsWith(pkg + '/'))) {
    return { type: 'empty' };
  }

  // Web 平台强制使用 CommonJS 版本（避免 import.meta 问题）
  if (platform === 'web' && forceCommonJS[moduleName]) {
    return {
      filePath: forceCommonJS[moduleName],
      type: 'sourceFile',
    };
  }

  // 处理 workspace 包的子路径导出
  for (const [pkgName, pkgPath] of Object.entries(workspacePackages)) {
    if (moduleName.startsWith(pkgName + '/')) {
      const subpath = moduleName.slice(pkgName.length + 1);
      const resolvedPath = path.resolve(pkgPath, subpath);
      return {
        filePath: resolvedPath + '/index.ts',
        type: 'sourceFile',
      };
    }
  }

  // 使用默认解析器
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

// 7. expo-sqlite Web 需要 SharedArrayBuffer，必须设置 COOP/COEP 头
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
      res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
      return middleware(req, res, next);
    };
  },
};

module.exports = config;
