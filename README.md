# SparkHub ✨

> 工具导航平台 - 统一管理和展示个人开发的小工具

## 项目结构

```
sparkinspyer/
├── apps/
│   ├── web/          # 导航页 Web 端 (React + Vite)
│   └── miniapp/      # 微信小程序 (Taro + React)
├── packages/
│   └── shared/       # 共享代码（类型、常量）
├── docs/             # 项目文档
└── log/              # 任务日志
```

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发

```bash
# 启动 Web 端开发服务器
pnpm dev

# 启动小程序开发（需要微信开发者工具）
pnpm dev:miniapp
```

### 构建

```bash
# 构建 Web 端
pnpm build

# 构建小程序
pnpm build:miniapp
```

## 技术栈

- **Web 端**: React 18 + Vite + TypeScript + TailwindCSS
- **小程序**: Taro 3 + React
- **状态管理**: Zustand
- **动画**: Framer Motion
- **统计**: 百度统计
- **部署**: 腾讯云 EdgeOne

## 文档

- [PRD - 产品需求文档](./docs/PRD_工具导航平台_V1.1_202512151709.md)
- [SPEC - 技术设计文档](./docs/SPEC_工具导航平台_V1.1_202512151709.md)
- [UI - 界面设计文档](./docs/UI_工具导航平台_V1.0_202512151650.md)

## 许可证

MIT

