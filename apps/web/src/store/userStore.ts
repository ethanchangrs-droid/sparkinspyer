import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RecentItem } from '@/types';

const MAX_RECENT = 10;

interface UserStore {
  // 收藏的工具 ID 列表
  favorites: string[];
  // 最近使用的工具
  recentlyUsed: RecentItem[];

  // 收藏操作
  addFavorite: (toolId: string) => void;
  removeFavorite: (toolId: string) => void;
  isFavorite: (toolId: string) => boolean;
  toggleFavorite: (toolId: string) => void;

  // 最近使用操作
  addRecentlyUsed: (toolId: string) => void;
  getRecentToolIds: () => string[];
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      recentlyUsed: [],

      addFavorite: (toolId) => {
        set((state) => ({
          favorites: [...new Set([toolId, ...state.favorites])],
        }));
      },

      removeFavorite: (toolId) => {
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== toolId),
        }));
      },

      isFavorite: (toolId) => {
        return get().favorites.includes(toolId);
      },

      toggleFavorite: (toolId) => {
        const { isFavorite, addFavorite, removeFavorite } = get();
        if (isFavorite(toolId)) {
          removeFavorite(toolId);
        } else {
          addFavorite(toolId);
        }
      },

      addRecentlyUsed: (toolId) => {
        set((state) => {
          const filtered = state.recentlyUsed.filter(
            (item) => item.toolId !== toolId
          );
          return {
            recentlyUsed: [
              { toolId, visitedAt: Date.now() },
              ...filtered,
            ].slice(0, MAX_RECENT),
          };
        });
      },

      getRecentToolIds: () => {
        return get().recentlyUsed.map((item) => item.toolId);
      },
    }),
    {
      name: 'spark-user-store',
    }
  )
);

