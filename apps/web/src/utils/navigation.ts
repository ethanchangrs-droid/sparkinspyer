// 基础域名配置
const BASE_DOMAIN = import.meta.env.VITE_BASE_DOMAIN || 'spark.example.com';

/**
 * 获取工具的完整 URL
 * @param slug 工具的子域名前缀
 * @returns 工具的完整 URL
 */
export function getToolUrl(slug: string): string {
  // 开发环境：可能需要特殊处理
  if (import.meta.env.DEV) {
    // 开发时可以指向本地其他端口或使用完整域名
    // 如果有本地开发的工具，可以在这里配置
    return `https://${slug}.${BASE_DOMAIN}`;
  }

  return `https://${slug}.${BASE_DOMAIN}`;
}

/**
 * 打开工具页面
 * @param slug 工具的子域名前缀
 */
export function openTool(slug: string): void {
  const url = getToolUrl(slug);
  window.open(url, '_blank');
}

