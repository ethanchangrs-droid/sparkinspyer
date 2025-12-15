/**
 * 百度统计事件上报工具
 * 文档：https://tongji.baidu.com/api/manual/
 */

declare global {
  interface Window {
    _hmt?: Array<[string, ...unknown[]]>;
  }
}

export const analytics = {
  /**
   * 上报页面浏览（SPA 路由变化时调用）
   * @param url 页面 URL
   */
  pageView(url: string) {
    window._hmt?.push(['_trackPageview', url]);
  },

  /**
   * 上报工具点击事件
   * @param toolId 工具 ID
   * @param toolName 工具名称
   */
  toolClick(toolId: string, toolName: string) {
    window._hmt?.push(['_trackEvent', 'tool', 'click', toolId]);
    console.log(`[Analytics] Tool clicked: ${toolName} (${toolId})`);
  },

  /**
   * 上报工具进入事件
   * @param toolId 工具 ID
   */
  toolEnter(toolId: string) {
    window._hmt?.push(['_trackEvent', 'tool', 'enter', toolId]);
  },

  /**
   * 上报搜索事件
   * @param keyword 搜索关键词
   * @param resultCount 结果数量
   */
  search(keyword: string, resultCount: number) {
    window._hmt?.push(['_trackEvent', 'search', 'query', keyword, resultCount]);
  },

  /**
   * 上报收藏事件
   * @param toolId 工具 ID
   * @param action 操作类型
   */
  favorite(toolId: string, action: 'add' | 'remove') {
    window._hmt?.push(['_trackEvent', 'favorite', action, toolId]);
  },
};

export default analytics;

