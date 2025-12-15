import type { Tool } from '@/types';

// 基础域名配置
const BASE_DOMAIN = import.meta.env.VITE_BASE_DOMAIN || 'spark.example.com';

/**
 * 获取工具的完整 URL
 * @param tool 工具对象，或 slug 字符串
 * @returns 工具的完整 URL
 */
export function getToolUrl(tool: Tool | string): string {
  // 如果传入的是 Tool 对象，优先使用自定义 url
  if (typeof tool === 'object') {
    if (tool.url) {
      return tool.url;
    }
    return `https://${tool.slug}.${BASE_DOMAIN}`;
  }

  // 兼容旧的 slug 字符串调用方式
  return `https://${tool}.${BASE_DOMAIN}`;
}

/**
 * 打开工具页面
 * @param tool 工具对象，或 slug 字符串
 */
export function openTool(tool: Tool | string): void {
  const url = getToolUrl(tool);
  window.open(url, '_blank');
}

