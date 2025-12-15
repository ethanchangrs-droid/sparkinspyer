#!/bin/bash
# SparkHub 项目初始化脚本

set -e

echo "🚀 SparkHub 项目初始化"
echo "========================"

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js 18+"
    exit 1
fi
echo "✅ Node.js $(node -v)"

# 检查 pnpm
if ! command -v pnpm &> /dev/null; then
    echo "📦 安装 pnpm..."
    npm install -g pnpm
fi
echo "✅ pnpm $(pnpm -v)"

# 安装依赖
echo ""
echo "📦 安装项目依赖..."
pnpm install

echo ""
echo "✅ 初始化完成！"
echo ""
echo "可用命令："
echo "  pnpm dev        - 启动开发服务器"
echo "  pnpm build      - 构建生产版本"
echo "  pnpm preview    - 预览生产版本"

