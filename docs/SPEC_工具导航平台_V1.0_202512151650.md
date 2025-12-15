# SPEC_工具导航平台_V1.0

> **版本**: V1.0  
> **创建日期**: 2025-12-15 16:50  
> **作者**: Claude  
> **状态**: 草稿

---

## 版本记录

| 版本 | 日期 | 修改内容 | 作者 |
|------|------|----------|------|
| V1.0 | 2025-12-15 | 初始版本 | Claude |

---

## 1. 系统架构

### 1.1 整体架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                         用户端                                   │
├─────────────────────┬─────────────────────┬─────────────────────┤
│    导航页 (Web)     │   导航页 (小程序)    │    管理后台 (Web)   │
│   React + Vite      │   Taro + React      │    Next.js          │
└─────────┬───────────┴─────────┬───────────┴─────────┬───────────┘
          │                     │                     │
          ▼                     ▼                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API Gateway                               │
│                    (Next.js API Routes)                          │
└─────────────────────────────────────────────────────────────────┘
          │                     │                     │
          ▼                     ▼                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                        服务层                                    │
├─────────────────────┬─────────────────────┬─────────────────────┤
│    工具服务         │    埋点服务          │    统计服务         │
│  (Tool Service)     │ (Tracking Service)  │ (Analytics Service) │
└─────────┬───────────┴─────────┬───────────┴─────────┬───────────┘
          │                     │                     │
          ▼                     ▼                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                        数据层                                    │
├─────────────────────┬─────────────────────────────────────────────┤
│    PostgreSQL       │              ClickHouse                    │
│   (工具元数据)       │            (埋点数据)                      │
└─────────────────────┴─────────────────────────────────────────────┘
```

### 1.2 技术栈选型

| 层级 | 技术选型 | 选型理由 |
|------|----------|----------|
| 导航页 Web | React + Vite + TypeScript | 与现有项目技术栈一致 |
| 导航页小程序 | Taro + React | 跨端框架，复用 React 生态 |
| 管理后台 | Next.js + TypeScript | 与现有 admin 项目一致，SSR 优化 |
| API | Next.js API Routes | 与后台复用，无需额外服务 |
| 数据库 | PostgreSQL + Prisma | 结构化数据，ORM 支持 |
| 埋点存储 | ClickHouse | 高性能时序数据分析 |
| UI 组件 | TailwindCSS + Radix UI | 快速开发，高质量组件 |
| 部署 | 腾讯云 CVM + 云数据库 | 用户偏好 |

### 1.3 项目结构

```
sparkinspyer/
├── apps/
│   ├── web/                    # 导航页 Web 端
│   │   ├── src/
│   │   │   ├── components/     # UI 组件
│   │   │   ├── hooks/          # 自定义 Hooks
│   │   │   ├── pages/          # 页面
│   │   │   ├── services/       # API 调用
│   │   │   ├── store/          # 状态管理
│   │   │   ├── styles/         # 样式
│   │   │   └── utils/          # 工具函数
│   │   ├── public/
│   │   └── vite.config.ts
│   │
│   ├── miniapp/                # 微信小程序
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── services/
│   │   │   └── utils/
│   │   ├── project.config.json
│   │   └── config/
│   │
│   └── admin/                  # 管理后台
│       ├── src/
│       │   ├── app/            # Next.js App Router
│       │   ├── components/
│       │   ├── lib/
│       │   └── services/
│       ├── prisma/
│       └── next.config.js
│
├── packages/
│   ├── sdk/                    # 埋点 SDK
│   │   ├── src/
│   │   └── dist/
│   ├── shared/                 # 共享代码
│   │   ├── types/              # TypeScript 类型
│   │   └── constants/          # 常量
│   └── ui/                     # 共享 UI 组件（可选）
│
├── docs/                       # 文档
├── scripts/                    # 脚本
├── package.json                # Monorepo 配置
├── pnpm-workspace.yaml
└── turbo.json                  # Turborepo 配置
```

---

## 2. 数据库设计

### 2.1 PostgreSQL 数据模型

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// 工具表
model Tool {
  id          String   @id @default(cuid())
  name        String   @db.VarChar(50)
  slug        String   @unique @db.VarChar(50)  // 子域名前缀
  icon        String   @db.VarChar(255)         // 图标 URL
  summary     String   @db.VarChar(200)         // 简介
  description String?  @db.Text                 // 详细描述
  guide       String?  @db.Text                 // 使用说明 (Markdown)
  screenshots String[] @default([])             // 截图 URLs
  version     String?  @db.VarChar(20)
  tags        String[] @default([])             // 标签: 新品、热门等
  status      ToolStatus @default(ACTIVE)
  sortOrder   Int      @default(0)              // 排序权重
  
  // 预留扩展字段
  categoryId  String?                           // 分类（未来使用）
  category    Category? @relation(fields: [categoryId], references: [id])
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([status, sortOrder])
  @@index([slug])
}

// 工具状态枚举
enum ToolStatus {
  ACTIVE      // 上线
  INACTIVE    // 下线
  MAINTENANCE // 维护中
}

// 分类表（预留）
model Category {
  id        String   @id @default(cuid())
  name      String   @db.VarChar(50)
  slug      String   @unique @db.VarChar(50)
  icon      String?  @db.VarChar(255)
  sortOrder Int      @default(0)
  tools     Tool[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// 管理员表
model Admin {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  name         String?
  role         AdminRole @default(ADMIN)
  
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  lastLoginAt  DateTime?
}

enum AdminRole {
  SUPER_ADMIN
  ADMIN
}

// 设备表（用于统计去重）
model Device {
  id          String   @id @default(cuid())
  deviceId    String   @unique              // 设备指纹
  platform    String   @db.VarChar(20)      // web / miniapp
  userAgent   String?
  
  // 预留用户关联
  userId      String?
  
  firstSeenAt DateTime @default(now())
  lastSeenAt  DateTime @default(now())
  
  @@index([deviceId])
  @@index([userId])
}
```

### 2.2 ClickHouse 数据模型

```sql
-- 事件表
CREATE TABLE events (
    event_id UUID DEFAULT generateUUIDv4(),
    event_name LowCardinality(String),      -- 事件名称
    event_time DateTime64(3),               -- 事件时间（毫秒精度）
    
    -- 设备信息
    device_id String,
    platform LowCardinality(String),        -- web / miniapp
    user_agent String,
    ip String,
    
    -- 页面信息
    page_url String,
    page_title String,
    referrer String,
    
    -- 工具信息
    tool_id String,
    tool_slug LowCardinality(String),
    
    -- 事件参数（JSON）
    properties String,                      -- JSON 格式的额外参数
    
    -- 会话信息
    session_id String,
    
    -- 预留用户 ID
    user_id String DEFAULT ''
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(event_time)
ORDER BY (event_time, device_id, event_name)
TTL event_time + INTERVAL 1 YEAR;

-- 每日统计聚合表
CREATE MATERIALIZED VIEW daily_stats
ENGINE = SummingMergeTree()
PARTITION BY toYYYYMM(date)
ORDER BY (date, tool_slug, platform)
AS SELECT
    toDate(event_time) AS date,
    tool_slug,
    platform,
    count() AS pv,
    uniqExact(device_id) AS uv,
    uniqExact(session_id) AS sessions
FROM events
WHERE event_name = 'page_view'
GROUP BY date, tool_slug, platform;

-- 工具使用时长表
CREATE TABLE tool_sessions (
    session_id String,
    device_id String,
    tool_slug LowCardinality(String),
    platform LowCardinality(String),
    enter_time DateTime64(3),
    exit_time DateTime64(3),
    duration_ms UInt64,                    -- 停留时长（毫秒）
    
    event_date Date DEFAULT toDate(enter_time)
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(event_date)
ORDER BY (event_date, tool_slug, device_id);
```

---

## 3. API 设计

### 3.1 API 概览

| 模块 | 端点 | 方法 | 描述 | 认证 |
|------|------|------|------|------|
| 工具 | /api/tools | GET | 获取工具列表 | 否 |
| 工具 | /api/tools/:slug | GET | 获取工具详情 | 否 |
| 工具 | /api/admin/tools | POST | 创建工具 | 是 |
| 工具 | /api/admin/tools/:id | PUT | 更新工具 | 是 |
| 工具 | /api/admin/tools/:id | DELETE | 删除工具 | 是 |
| 埋点 | /api/track | POST | 上报埋点 | 否 |
| 统计 | /api/admin/analytics/overview | GET | 数据概览 | 是 |
| 统计 | /api/admin/analytics/trends | GET | 趋势数据 | 是 |
| 统计 | /api/admin/analytics/tools | GET | 工具排行 | 是 |

### 3.2 接口详情

#### 3.2.1 获取工具列表

```typescript
// GET /api/tools
// Query: keyword?: string, limit?: number, offset?: number

// Response
interface ToolListResponse {
  code: number;
  data: {
    tools: Tool[];
    total: number;
  };
  message: string;
}

interface Tool {
  id: string;
  name: string;
  slug: string;
  icon: string;
  summary: string;
  tags: string[];
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
}
```

#### 3.2.2 获取工具详情

```typescript
// GET /api/tools/:slug

// Response
interface ToolDetailResponse {
  code: number;
  data: {
    id: string;
    name: string;
    slug: string;
    icon: string;
    summary: string;
    description: string;
    guide: string;          // Markdown 格式
    screenshots: string[];
    version: string;
    tags: string[];
    updatedAt: string;
  };
  message: string;
}
```

#### 3.2.3 埋点上报

```typescript
// POST /api/track

// Request
interface TrackRequest {
  events: TrackEvent[];
}

interface TrackEvent {
  eventName: string;
  eventTime: number;        // Unix timestamp (ms)
  deviceId: string;
  sessionId: string;
  platform: 'web' | 'miniapp';
  pageUrl?: string;
  pageTitle?: string;
  referrer?: string;
  toolId?: string;
  toolSlug?: string;
  properties?: Record<string, any>;
}

// Response
interface TrackResponse {
  code: number;
  message: string;
}
```

#### 3.2.4 数据概览

```typescript
// GET /api/admin/analytics/overview
// Query: range?: 'today' | 'week' | 'month'

// Response
interface OverviewResponse {
  code: number;
  data: {
    pv: number;
    pvChange: number;       // 较上期变化百分比
    uv: number;
    uvChange: number;
    activeTools: number;
    totalTools: number;
    avgDuration: number;    // 平均使用时长（秒）
    durationChange: number;
  };
  message: string;
}
```

#### 3.2.5 趋势数据

```typescript
// GET /api/admin/analytics/trends
// Query: range?: 'week' | 'month' | 'quarter', metric?: 'pv' | 'uv'

// Response
interface TrendsResponse {
  code: number;
  data: {
    labels: string[];       // 日期标签
    datasets: {
      name: string;
      data: number[];
    }[];
  };
  message: string;
}
```

---

## 4. 埋点 SDK 设计

### 4.1 SDK 架构

```typescript
// packages/sdk/src/index.ts

interface SparkSDKConfig {
  appId: string;            // 应用标识
  apiEndpoint: string;      // 上报地址
  debug?: boolean;          // 调试模式
  autoTrack?: boolean;      // 自动采集 PV
  batchSize?: number;       // 批量上报大小
  flushInterval?: number;   // 上报间隔（ms）
}

class SparkSDK {
  private config: SparkSDKConfig;
  private deviceId: string;
  private sessionId: string;
  private eventQueue: TrackEvent[];
  private timer: ReturnType<typeof setInterval> | null;

  constructor(config: SparkSDKConfig);
  
  // 初始化
  init(): void;
  
  // 手动上报事件
  track(eventName: string, properties?: Record<string, any>): void;
  
  // 页面浏览（自动调用或手动）
  pageView(pageInfo?: { title?: string; url?: string }): void;
  
  // 工具进入
  toolEnter(toolSlug: string): void;
  
  // 工具离开（自动计算时长）
  toolExit(toolSlug: string): void;
  
  // 搜索
  search(keyword: string, resultCount: number): void;
  
  // 收藏
  favorite(toolSlug: string, action: 'add' | 'remove'): void;
  
  // 立即上报队列中的事件
  flush(): Promise<void>;
  
  // 销毁
  destroy(): void;
}

export default SparkSDK;
```

### 4.2 自动采集

SDK 将自动采集以下事件：

| 事件 | 触发时机 | 采集信息 |
|------|----------|----------|
| page_view | 页面加载完成 | URL、标题、来源 |
| page_leave | 页面卸载 | 停留时长 |
| visibility_change | 页面可见性变化 | 可见/隐藏状态 |

### 4.3 设备指纹

```typescript
// 设备指纹生成策略
function generateDeviceId(): string {
  // 优先使用已存储的 ID
  const stored = localStorage.getItem('spark_device_id');
  if (stored) return stored;
  
  // 生成新的设备指纹
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
  ].join('|');
  
  const hash = hashCode(fingerprint);
  const deviceId = `d_${hash}_${Date.now()}`;
  
  localStorage.setItem('spark_device_id', deviceId);
  return deviceId;
}
```

---

## 5. 前端架构

### 5.1 导航页 Web 端

#### 5.1.1 页面路由

| 路由 | 页面 | 描述 |
|------|------|------|
| / | HomePage | 首页，工具列表 |
| /tool/:slug | ToolDetailPage | 工具详情弹窗 |
| /search | SearchPage | 搜索结果页（可选） |

#### 5.1.2 状态管理

```typescript
// store/toolStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ToolStore {
  // 工具数据
  tools: Tool[];
  loading: boolean;
  error: string | null;
  
  // 本地状态
  favorites: string[];        // 收藏的工具 slug 列表
  recentlyUsed: RecentItem[]; // 最近使用
  
  // Actions
  fetchTools: () => Promise<void>;
  searchTools: (keyword: string) => Tool[];
  addFavorite: (slug: string) => void;
  removeFavorite: (slug: string) => void;
  addRecentlyUsed: (slug: string) => void;
}

interface RecentItem {
  slug: string;
  visitedAt: number;
}

export const useToolStore = create<ToolStore>()(
  persist(
    (set, get) => ({
      // ... implementation
    }),
    {
      name: 'spark-tool-store',
      partialize: (state) => ({
        favorites: state.favorites,
        recentlyUsed: state.recentlyUsed,
      }),
    }
  )
);
```

#### 5.1.3 组件结构

```
components/
├── layout/
│   ├── Header.tsx          # 顶部导航栏
│   ├── Footer.tsx          # 底部
│   └── Container.tsx       # 内容容器
├── tool/
│   ├── ToolCard.tsx        # 工具卡片
│   ├── ToolGrid.tsx        # 工具网格
│   ├── ToolDetail.tsx      # 工具详情弹窗
│   └── ToolTags.tsx        # 标签组件
├── search/
│   ├── SearchBar.tsx       # 搜索框
│   └── SearchResults.tsx   # 搜索结果
├── section/
│   ├── FavoriteSection.tsx # 收藏区块
│   └── RecentSection.tsx   # 最近使用区块
└── common/
    ├── Button.tsx
    ├── Modal.tsx
    ├── Skeleton.tsx
    └── EmptyState.tsx
```

### 5.2 微信小程序

#### 5.2.1 页面结构

```
pages/
├── index/                  # 首页
│   ├── index.tsx
│   ├── index.config.ts
│   └── index.scss
├── tool/                   # 工具详情
│   └── [slug]/
│       ├── index.tsx
│       └── index.config.ts
├── webview/                # WebView 页面
│   ├── index.tsx
│   └── index.config.ts
├── search/                 # 搜索页
│   ├── index.tsx
│   └── index.scss
└── favorites/              # 收藏页
    ├── index.tsx
    └── index.scss
```

#### 5.2.2 Taro 配置

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
  plugins: [],
  defineConstants: {},
  copy: {
    patterns: [],
    options: {},
  },
  framework: 'react',
  compiler: 'webpack5',
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {},
      },
    },
  },
};
```

### 5.3 管理后台

#### 5.3.1 页面结构

```
app/
├── (auth)/
│   └── login/
│       └── page.tsx
├── (dashboard)/
│   ├── layout.tsx
│   ├── page.tsx            # 数据大盘
│   ├── tools/
│   │   ├── page.tsx        # 工具列表
│   │   ├── new/
│   │   │   └── page.tsx    # 新建工具
│   │   └── [id]/
│   │       └── page.tsx    # 编辑工具
│   └── analytics/
│       ├── page.tsx        # 详细分析
│       └── tools/
│           └── [slug]/
│               └── page.tsx # 单工具分析
└── api/
    ├── auth/
    ├── tools/
    ├── track/
    └── admin/
        ├── tools/
        └── analytics/
```

---

## 6. 部署方案

### 6.1 腾讯云架构

```
                    ┌─────────────────┐
                    │   CDN (腾讯云)   │
                    │  导航页静态资源   │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ spark.xxx.com │  │ admin.spark.xxx │  │ *.spark.xxx.com │
│   导航页 Web   │  │    管理后台      │  │     各工具       │
└───────┬───────┘  └────────┬────────┘  └─────────────────┘
        │                   │
        │                   │
        ▼                   ▼
┌─────────────────────────────────────┐
│           CVM / Lighthouse          │
│  ├── Nginx (反向代理)                │
│  ├── Node.js (PM2)                  │
│  └── Docker (可选)                   │
└─────────────────┬───────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
┌───────────────┐  ┌─────────────────┐
│ 云数据库       │  │    云数据库      │
│ PostgreSQL    │  │   ClickHouse    │
│ (腾讯云 TDSQL) │  │   (腾讯云 CDWCH)│
└───────────────┘  └─────────────────┘
```

### 6.2 域名配置

```nginx
# /etc/nginx/sites-available/spark

# 导航页
server {
    listen 80;
    server_name spark.example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name spark.example.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    root /var/www/spark-web/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# 管理后台
server {
    listen 443 ssl http2;
    server_name admin.spark.example.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 6.3 成本估算

| 资源 | 规格 | 月费用（估算） |
|------|------|----------------|
| 轻量应用服务器 | 2C4G 80GB | ¥50-100 |
| 云数据库 PostgreSQL | 1C2G 20GB | ¥50-80 |
| 云数据库 ClickHouse | 按量计费 | ¥30-50 |
| CDN | 按流量 | ¥10-30 |
| SSL 证书 | 免费 | ¥0 |
| 对象存储 COS | 按用量 | ¥5-10 |
| **总计** | | **¥145-270/月** |

> **MVP 阶段建议**：初期可使用单机部署，PostgreSQL 存储埋点数据，后期流量增长再迁移到 ClickHouse。

---

## 7. 安全设计

### 7.1 API 安全

| 措施 | 描述 |
|------|------|
| HTTPS | 全站强制 HTTPS |
| CORS | 限制允许的域名 |
| Rate Limiting | API 限流，防止滥用 |
| 输入验证 | 使用 Zod 进行参数校验 |
| SQL 注入 | Prisma ORM 参数化查询 |

### 7.2 管理后台安全

| 措施 | 描述 |
|------|------|
| 密码加密 | bcrypt 哈希 |
| JWT Token | 短期有效，定期刷新 |
| IP 白名单 | 可选，限制访问 IP |
| 操作日志 | 记录关键操作 |

---

## 8. 扩展性设计

### 8.1 用户系统预留

```typescript
// 当前：基于设备 ID
interface AnonymousContext {
  deviceId: string;
  sessionId: string;
}

// 未来：支持用户登录
interface AuthenticatedContext extends AnonymousContext {
  userId: string;
  openId?: string;      // 微信 openId
  unionId?: string;     // 微信 unionId
}
```

### 8.2 分类系统预留

数据库已预留 `Category` 模型和 `categoryId` 字段，启用时只需：
1. 创建分类数据
2. 前端添加分类筛选 UI
3. API 添加分类查询参数

### 8.3 多租户预留

如未来需要支持多用户创建工具导航：
1. 添加 `Workspace` 模型
2. 工具关联 `workspaceId`
3. API 添加租户隔离

---

## 9. 附录

### 9.1 技术依赖

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
  },
  "管理后台": {
    "next": "^14.x",
    "@prisma/client": "^5.x",
    "recharts": "^2.x",
    "@radix-ui/react-*": "latest"
  },
  "埋点 SDK": {
    "typescript": "^5.x",
    "esbuild": "^0.19.x"
  }
}
```

### 9.2 环境变量

```bash
# .env.example

# 数据库
DATABASE_URL="postgresql://user:pass@localhost:5432/spark"
CLICKHOUSE_URL="http://localhost:8123"

# 认证
JWT_SECRET="your-jwt-secret"
NEXTAUTH_SECRET="your-nextauth-secret"

# 腾讯云
TENCENT_SECRET_ID="your-secret-id"
TENCENT_SECRET_KEY="your-secret-key"

# 小程序
WECHAT_APP_ID="your-app-id"
WECHAT_APP_SECRET="your-app-secret"

# 其他
NODE_ENV="development"
API_BASE_URL="https://spark.example.com/api"
```

