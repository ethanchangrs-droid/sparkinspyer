// 工具标签类型
export type ToolTag = 'new' | 'hot' | 'featured';

// 工具状态类型
export type ToolStatus = 'active' | 'inactive' | 'maintenance';

// 工具数据结构
export interface Tool {
  id: string;
  name: string;
  slug: string;
  icon: string;
  summary: string;
  description?: string;
  guide?: string;
  screenshots?: string[];
  version?: string;
  tags?: ToolTag[];
  status: ToolStatus;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// tools.json 文件结构
export interface ToolsData {
  version: string;
  updatedAt: string;
  tools: Tool[];
}

// 最近使用记录
export interface RecentItem {
  toolId: string;
  visitedAt: number;
}

// 用户偏好设置
export interface UserPreferences {
  theme: 'dark' | 'light' | 'system';
}

