#!/bin/bash

set -e

echo "🧹 Rich Dime - 清理和重建脚本"
echo "================================"
echo ""

# 步骤 1: 清理 Metro 缓存
echo "📁 步骤 1/5: 清理 Metro 缓存..."
rm -rf apps/mobile/.expo
rm -rf apps/mobile/node_modules/.cache
echo "✅ Metro 缓存已清理"
echo ""

# 步骤 2: 清理 Gradle 缓存（Android）
echo "📁 步骤 2/5: 清理 Gradle 缓存..."
if [ -d "apps/mobile/android" ]; then
  rm -rf apps/mobile/android/.gradle
  rm -rf apps/mobile/android/app/build
  echo "✅ Gradle 缓存已清理"
else
  echo "⚠️  未找到 android 目录，跳过"
fi
echo ""

# 步骤 3: 清理 watchman（如果存在）
echo "📁 步骤 3/5: 清理 watchman..."
if command -v watchman &> /dev/null; then
  watchman watch-del-all
  echo "✅ Watchman 已清理"
else
  echo "⚠️  未安装 watchman，跳过"
fi
echo ""

# 步骤 4: 重新安装依赖
echo "📦 步骤 4/5: 重新安装依赖..."
pnpm install
echo "✅ 依赖安装完成"
echo ""

# 步骤 5: 准备启动
echo "🚀 步骤 5/5: 准备完成！"
echo ""
echo "现在可以运行以下命令启动应用："
echo "  pnpm android  # Android"
echo "  pnpm ios      # iOS"
echo "  pnpm web      # Web"
echo ""
