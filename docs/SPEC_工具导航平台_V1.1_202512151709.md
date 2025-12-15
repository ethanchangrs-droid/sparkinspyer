# SPEC_工具导航平台_V1.1

> **版本**: V1.1  
> **创建日期**: 2025-12-15 17:09  
> **作者**: Claude  
> **状态**: 草稿

---

## 版本记录

| 版本 | 日期 | 修改内容 | 作者 |
|------|------|----------|------|
| V1.0 | 2025-12-15 | 初始版本（完整后端方案） | Claude |
| V1.1 | 2025-12-15 | 简化为纯静态方案，使用 EdgeOne 托管 + 第三方统计 | Claude |

---

## 1. 系统架构

### 1.1 整体架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                         用户端                                   │
├─────────────────────┬─────────────────────┬─────────────────────┤
│    导航页 (Web)     │   导航页 (小程序)    │    各工具 (Web)     │
│   React + Vite      │   Taro + React      │   各自独立部署       │
└─────────┬───────────┴─────────┬───────────┴─────────────────────┘
          │                     │
          ▼                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                    腾讯云 EdgeOne                                │
│              (CDN + 静态托管 + 边缘加速)                          │
├─────────────────────────────────────────────────────────────────┤
│  spark.example.com     →  导航页静态文件                         │
│  tigang.spark.example.com  →  提肛计数器静态文件                  │
│  ...其他工具子域名...                                             │
└─────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      第三方统计服务                               │
│              (百度统计 / 友盟 / Google Analytics)                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 MVP 方案特点

| 特性 | 说明 |
|------|------|
| **纯静态部署** | 无需服务器，使用 EdgeOne 静态托管 |
| **JSON 数据源** | 工具信息存储在静态 JSON 文件中 |
| **本地存储** | 收藏、最近使用存储在 localStorage |
| **第三方统计** | 使用百度统计等免费服务 |
| **手动管理** | 通过编辑 JSON 文件管理工具列表 |

### 1.3 技术栈选型

| 层级 | 技术选型 | 选型理由 |
|------|----------|----------|
| 导航页 Web | React + Vite + TypeScript | 与现有项目技术栈一致 |
| 导航页小程序 | Taro + React | 跨端框架，复用 React 生态 |
| 样式方案 | TailwindCSS | 快速开发，原子化 CSS |
| 动画库 | Framer Motion | 流畅的交互动效 |
| 状态管理 | Zustand | 轻量，支持持久化 |
| 数据统计 | 百度统计 | 免费，功能完善 |
| 静态托管 | 腾讯云 EdgeOne | CDN 加速，免费额度 |

### 1.4 项目结构

```
sparkinspyer/
├── apps/
│   ├── web/                    # 导航页 Web 端
│   │   ├── public/
│   │   │   ├── data/
│   │   │   │   └── tools.json  # 工具数据（静态 JSON）
│   │   │   └── favicon.svg
│   │   ├── src/
│   │   │   ├── components/     # UI 组件
│   │   │   ├── hooks/          # 自定义 Hooks
│   │   │   ├── pages/          # 页面
│   │   │   ├── store/          # Zustand 状态
│   │   │   ├── styles/         # 样式
│   │   │   ├── types/          # 类型定义
│   │   │   └── utils/          # 工具函数
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.js
│   │   └── package.json
│   │
│   └── miniapp/                # 微信小程序
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   └── utils/
│       ├── project.config.json
│       └── package.json
│
├── packages/
│   └── shared/                 # 共享代码
│       ├── types/              # TypeScript 类型
│       └── constants/          # 常量
│
├── docs/                       # 文档
├── log/                        # 日志
├── scripts/                    # 构建/部署脚本
├── package.json                # Monorepo 配置
├── pnpm-workspace.yaml
└── README.md
```

---

## 2. 数据设计

### 2.1 工具数据结构

工具信息存储在 `public/data/tools.json` 静态文件中：

```typescript
// types/tool.ts

interface Tool {
  id: string;                    // 唯一标识，如 "tigang"
  name: string;                  // 工具名称
  slug: string;                  // 子域名前缀（与 id 相同）
  icon: string;                  // 图标路径或 emoji
  summary: string;               // 一句话简介（≤100字）
  description?: string;          // 详细描述（Markdown）
  guide?: string;                // 使用说明（Markdown）
  screenshots?: string[];        // 截图 URL 列表
  version?: string;              // 版本号
  tags?: ToolTag[];              // 标签
  status: ToolStatus;            // 状态
  sortOrder: number;             // 排序权重（数字越小越靠前）
  createdAt: string;             // 创建时间 ISO 8601
  updatedAt: string;             // 更新时间 ISO 8601
}

type ToolTag = 'new' | 'hot' | 'featured';
type ToolStatus = 'active' | 'inactive' | 'maintenance';
```

### 2.2 tools.json 示例

```json
{
  "version": "1.0.0",
  "updatedAt": "2025-12-15T17:00:00+08:00",
  "tools": [
    {
      "id": "tigang",
      "name": "提肛计数器",
      "slug": "tigang",
      "icon": "🏋️",
      "summary": "科学的提肛运动引导工具，帮助你坚持每日锻炼",
      "description": "提肛计数器是一款专业的凯格尔运动辅助工具...",
      "guide": "## 使用方法\n\n1. 设置训练参数\n2. 开始训练\n3. 跟随提示完成动作",
      "screenshots": [],
      "version": "2.0.0",
      "tags": ["new"],
      "status": "active",
      "sortOrder": 1,
      "createdAt": "2025-12-04T10:00:00+08:00",
      "updatedAt": "2025-12-15T12:00:00+08:00"
    }
  ]
}
```

### 2.3 本地存储结构

使用 Zustand 的 persist 中间件，数据存储在 localStorage：

```typescript
// store/userStore.ts

interface UserState {
  // 收藏的工具 ID 列表
  favorites: string[];
  
  // 最近使用的工具
  recentlyUsed: RecentItem[];
  
  // 用户偏好
  preferences: {
    theme: 'dark' | 'light' | 'system';
  };
}

interface RecentItem {
  toolId: string;
  visitedAt: number;  // Unix timestamp
}

// localStorage key: 'spark-user-store'
```

---

## 3. 页面与路由

### 3.1 Web 端路由

| 路由 | 组件 | 描述 |
|------|------|------|
| `/` | HomePage | 首页，展示工具列表 |
| `/tool/:slug` | ToolModal | 工具详情（弹窗形式，URL 可分享） |

### 3.2 小程序页面

| 页面路径 | 描述 |
|----------|------|
| `pages/index/index` | 首页 |
| `pages/tool/detail` | 工具详情 |
| `pages/search/index` | 搜索页 |
| `pages/webview/index` | WebView 容器 |

---

## 4. 核心功能实现

### 4.1 工具列表加载

```typescript
// hooks/useTools.ts
import { useState, useEffect } from 'react';
import type { Tool } from '@/types';

const TOOLS_URL = '/data/tools.json';

export function useTools() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(TOOLS_URL)
      .then(res => res.json())
      .then(data => {
        // 过滤掉非 active 状态的工具
        const activeTools = data.tools.filter(
          (t: Tool) => t.status === 'active'
        );
        // 按 sortOrder 排序
        activeTools.sort((a: Tool, b: Tool) => a.sortOrder - b.sortOrder);
        setTools(activeTools);
      })
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { tools, loading, error };
}
```

### 4.2 搜索功能

```typescript
// hooks/useSearch.ts
import { useMemo } from 'react';
import type { Tool } from '@/types';

export function useSearch(tools: Tool[], keyword: string) {
  return useMemo(() => {
    if (!keyword.trim()) return tools;
    
    const lowerKeyword = keyword.toLowerCase();
    return tools.filter(tool => 
      tool.name.toLowerCase().includes(lowerKeyword) ||
      tool.summary.toLowerCase().includes(lowerKeyword) ||
      tool.description?.toLowerCase().includes(lowerKeyword)
    );
  }, [tools, keyword]);
}
```

### 4.3 收藏与最近使用

```typescript
// store/userStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserStore {
  favorites: string[];
  recentlyUsed: { toolId: string; visitedAt: number }[];
  
  addFavorite: (toolId: string) => void;
  removeFavorite: (toolId: string) => void;
  isFavorite: (toolId: string) => boolean;
  
  addRecentlyUsed: (toolId: string) => void;
  getRecentlyUsed: () => string[];
}

const MAX_RECENT = 10;

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      recentlyUsed: [],
      
      addFavorite: (toolId) => {
        set(state => ({
          favorites: [...new Set([toolId, ...state.favorites])]
        }));
      },
      
      removeFavorite: (toolId) => {
        set(state => ({
          favorites: state.favorites.filter(id => id !== toolId)
        }));
      },
      
      isFavorite: (toolId) => {
        return get().favorites.includes(toolId);
      },
      
      addRecentlyUsed: (toolId) => {
        set(state => {
          const filtered = state.recentlyUsed.filter(
            item => item.toolId !== toolId
          );
          return {
            recentlyUsed: [
              { toolId, visitedAt: Date.now() },
              ...filtered
            ].slice(0, MAX_RECENT)
          };
        });
      },
      
      getRecentlyUsed: () => {
        return get().recentlyUsed.map(item => item.toolId);
      },
    }),
    {
      name: 'spark-user-store',
    }
  )
);
```

### 4.4 工具跳转

```typescript
// utils/navigation.ts

const BASE_DOMAIN = 'spark.example.com'; // 实际部署时替换

export function getToolUrl(slug: string): string {
  // 开发环境可能需要特殊处理
  if (import.meta.env.DEV) {
    return `http://localhost:3001`; // 或其他开发地址
  }
  return `https://${slug}.${BASE_DOMAIN}`;
}

export function openTool(slug: string): void {
  const url = getToolUrl(slug);
  window.open(url, '_blank');
}
```

---

## 5. 数据统计方案

### 5.1 百度统计集成

在 `index.html` 中添加百度统计代码：

```html
<!-- index.html -->
<head>
  <!-- 百度统计代码 -->
  <script>
    var _hmt = _hmt || [];
    (function() {
      var hm = document.createElement("script");
      hm.src = "https://hm.baidu.com/hm.js?YOUR_SITE_ID";
      var s = document.getElementsByTagName("script")[0]; 
      s.parentNode.insertBefore(hm, s);
    })();
  </script>
</head>
```

### 5.2 自定义事件上报

```typescript
// utils/analytics.ts

declare global {
  interface Window {
    _hmt?: Array<[string, ...any[]]>;
  }
}

export const analytics = {
  // 页面浏览（SPA 路由变化时调用）
  pageView(url: string) {
    window._hmt?.push(['_trackPageview', url]);
  },
  
  // 工具点击
  toolClick(toolId: string, toolName: string) {
    window._hmt?.push(['_trackEvent', 'tool', 'click', toolId]);
  },
  
  // 工具进入
  toolEnter(toolId: string) {
    window._hmt?.push(['_trackEvent', 'tool', 'enter', toolId]);
  },
  
  // 搜索
  search(keyword: string, resultCount: number) {
    window._hmt?.push(['_trackEvent', 'search', 'query', keyword, resultCount]);
  },
  
  // 收藏
  favorite(toolId: string, action: 'add' | 'remove') {
    window._hmt?.push(['_trackEvent', 'favorite', action, toolId]);
  },
};
```

### 5.3 统计功能对照

| 需求指标 | 百度统计功能 | 说明 |
|----------|--------------|------|
| PV/UV | ✅ 自动采集 | 默认功能 |
| 活跃用户 | ✅ 访客分析 | DAU/WAU/MAU |
| 工具使用频次 | ✅ 事件分析 | 自定义事件 |
| 使用时长 | ✅ 页面分析 | 停留时长 |
| 来源分析 | ✅ 来源分析 | 默认功能 |
| 按日/周/月 | ✅ 时间筛选 | 默认功能 |

---

## 6. 小程序实现

### 6.1 Taro 配置

```typescript
// config/index.ts
export default {
  projectName: 'spark-miniapp',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  framework: 'react',
  compiler: 'webpack5',
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
      },
      cssModules: {
        enable: true,
        config: {
          namingPattern: 'module',
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
  },
};
```

### 6.2 数据获取

小程序同样从静态 JSON 文件获取数据：

```typescript
// services/tool.ts
import Taro from '@tarojs/taro';

const TOOLS_URL = 'https://spark.example.com/data/tools.json';

export async function fetchTools() {
  const res = await Taro.request({
    url: TOOLS_URL,
    method: 'GET',
  });
  return res.data.tools;
}
```

### 6.3 WebView 打开工具

```typescript
// pages/webview/index.tsx
import { WebView } from '@tarojs/components';
import { useRouter } from '@tarojs/taro';

export default function WebViewPage() {
  const router = useRouter();
  const { url } = router.params;
  
  return <WebView src={decodeURIComponent(url || '')} />;
}

// 使用
Taro.navigateTo({
  url: `/pages/webview/index?url=${encodeURIComponent(toolUrl)}`
});
```

### 6.4 小程序统计

使用微信小程序自带的数据分析功能，无需额外集成。

---

## 7. 部署方案

### 7.1 腾讯云 EdgeOne 配置

#### 7.1.1 创建站点

1. 登录腾讯云控制台 → EdgeOne
2. 添加站点（需要已备案的域名）
3. 配置 DNS 解析到 EdgeOne

#### 7.1.2 静态托管配置

```yaml
# edgeone.yaml（概念配置，实际在控制台操作）

site: spark.example.com
origin:
  type: cos  # 使用 COS 作为源站
  bucket: spark-static-xxxxx
  region: ap-shanghai

rules:
  # 主导航页
  - match: spark.example.com/*
    origin: /web/
    cache:
      ttl: 3600  # 1小时

  # 工具子域名
  - match: "*.spark.example.com/*"
    origin: /tools/${subdomain}/
    cache:
      ttl: 86400  # 24小时

  # SPA 回退
  - match: "*/index.html"
    cache:
      ttl: 0  # 不缓存
```

#### 7.1.3 域名配置

| 域名 | 用途 | 源站路径 |
|------|------|----------|
| spark.example.com | 导航页 | /web/ |
| tigang.spark.example.com | 提肛计数器 | /tools/tigang/ |
| *.spark.example.com | 其他工具 | /tools/*/ |

### 7.2 部署脚本

```bash
#!/bin/bash
# scripts/deploy.sh

set -e

echo "🔨 Building web app..."
cd apps/web
pnpm build

echo "📦 Uploading to COS..."
# 使用腾讯云 COSCLI 上传
coscli sync ./dist cos://spark-static-xxxxx/web/ \
  --delete \
  --exclude ".DS_Store"

echo "🔄 Refreshing EdgeOne cache..."
# 使用腾讯云 CLI 刷新缓存
tccli teo CreatePurgeTask \
  --ZoneId zone-xxxxx \
  --Type purge_prefix \
  --Targets '["https://spark.example.com/"]'

echo "✅ Deploy completed!"
```

### 7.3 CI/CD 配置（GitHub Actions）

```yaml
# .github/workflows/deploy.yml

name: Deploy to EdgeOne

on:
  push:
    branches: [main]
    paths:
      - 'apps/web/**'
      - 'public/data/tools.json'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
          
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
          
      - name: Install dependencies
        run: pnpm install
        
      - name: Build
        run: pnpm --filter web build
        
      - name: Upload to COS
        uses: TencentCloud/cos-action@v1
        with:
          secret_id: ${{ secrets.TENCENT_SECRET_ID }}
          secret_key: ${{ secrets.TENCENT_SECRET_KEY }}
          bucket: spark-static-xxxxx
          region: ap-shanghai
          local_path: apps/web/dist
          remote_path: /web/
          clean: true
```

### 7.4 成本估算

| 资源 | 规格 | 月费用 |
|------|------|--------|
| EdgeOne 免费版 | 10GB 流量/月 | ¥0 |
| COS 存储 | 按量（约 100MB） | ¥0.1 |
| 百度统计 | 免费版 | ¥0 |
| **总计** | | **约 ¥0-5/月** |

> 注：个人站点流量较小时，基本在免费额度内。

---

## 8. 未来扩展路径

### 8.1 Phase 2：动态管理

当需要更频繁地管理工具时，可添加：

```
方案 A：GitHub 作为 CMS
- 通过 GitHub Actions 自动构建
- 编辑 tools.json 后自动部署

方案 B：添加简单后端
- EdgeOne 边缘函数 + CloudBase 数据库
- 简单的管理 API
```

### 8.2 Phase 3：用户系统

```
- 添加微信登录
- 用户数据云同步
- 完整的数据分析后台
```

### 8.3 数据迁移

从 JSON 迁移到数据库时：
1. 保持 Tool 类型定义不变
2. 只需修改数据获取层（useTools hook）
3. 前端组件无需改动

---

## 9. 安全考虑

### 9.1 内容安全

| 措施 | 说明 |
|------|------|
| HTTPS | EdgeOne 默认启用 |
| CSP | 配置 Content-Security-Policy |
| 子域名隔离 | 各工具独立子域名，隔离风险 |

### 9.2 EdgeOne 安全配置

```javascript
// EdgeOne 规则示例
// 添加安全响应头
response.headers.set('X-Content-Type-Options', 'nosniff');
response.headers.set('X-Frame-Options', 'SAMEORIGIN');
response.headers.set('X-XSS-Protection', '1; mode=block');
```

---

## 10. 附录

### 10.1 技术依赖

```json
{
  "导航页 Web": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.x",
    "zustand": "^4.x",
    "framer-motion": "^10.x",
    "tailwindcss": "^3.x",
    "vite": "^5.x",
    "typescript": "^5.x"
  },
  "小程序": {
    "@tarojs/taro": "^3.6.x",
    "@tarojs/components": "^3.6.x",
    "@tarojs/react": "^3.6.x"
  }
}
```

### 10.2 环境变量

```bash
# .env.example

# 基础配置
VITE_BASE_DOMAIN=spark.example.com
VITE_APP_NAME=SparkHub

# 百度统计
VITE_BAIDU_ANALYTICS_ID=your_site_id

# 小程序（在小程序后台配置）
# WECHAT_APP_ID=your_app_id
```

### 10.3 开发命令

```bash
# 安装依赖
pnpm install

# 开发导航页
pnpm --filter web dev

# 构建导航页
pnpm --filter web build

# 开发小程序
pnpm --filter miniapp dev:weapp

# 预览小程序
pnpm --filter miniapp build:weapp
```

