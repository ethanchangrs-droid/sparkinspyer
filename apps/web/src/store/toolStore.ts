import { create } from 'zustand';
import type { Tool, ToolsData } from '@/types';

const TOOLS_URL = '/data/tools.json';

interface ToolStore {
  tools: Tool[];
  loading: boolean;
  error: string | null;

  fetchTools: () => Promise<void>;
  getToolBySlug: (slug: string) => Tool | undefined;
  searchTools: (keyword: string) => Tool[];
}

export const useToolStore = create<ToolStore>((set, get) => ({
  tools: [],
  loading: true,
  error: null,

  fetchTools: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(TOOLS_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch tools');
      }
      const data: ToolsData = await response.json();
      
      // 过滤掉非 active 状态的工具，并按 sortOrder 排序
      const activeTools = data.tools
        .filter((tool) => tool.status === 'active')
        .sort((a, b) => a.sortOrder - b.sortOrder);
      
      set({ tools: activeTools, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        loading: false,
      });
    }
  },

  getToolBySlug: (slug) => {
    return get().tools.find((tool) => tool.slug === slug);
  },

  searchTools: (keyword) => {
    const tools = get().tools;
    if (!keyword.trim()) return tools;

    const lowerKeyword = keyword.toLowerCase();
    return tools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(lowerKeyword) ||
        tool.summary.toLowerCase().includes(lowerKeyword) ||
        tool.description?.toLowerCase().includes(lowerKeyword)
    );
  },
}));

