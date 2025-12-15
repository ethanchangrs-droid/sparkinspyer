import { motion } from 'framer-motion';
import { useUserStore } from '@/store';
import type { Tool } from '@/types';

interface ToolCardProps {
  tool: Tool;
  onClick: () => void;
}

export default function ToolCard({ tool, onClick }: ToolCardProps) {
  const { isFavorite, toggleFavorite } = useUserStore();
  const favorite = isFavorite(tool.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(tool.id);
  };

  return (
    <motion.div
      className="card card-hover p-6 cursor-pointer relative group"
      onClick={onClick}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      {/* 标签 */}
      {tool.tags && tool.tags.length > 0 && (
        <div className="absolute top-4 right-4 flex gap-2">
          {tool.tags.includes('new') && (
            <span className="px-2 py-1 text-xs font-medium bg-emerald-500/20 text-emerald-400 rounded-full">
              NEW
            </span>
          )}
          {tool.tags.includes('hot') && (
            <span className="px-2 py-1 text-xs font-medium bg-red-500/20 text-red-400 rounded-full">
              🔥
            </span>
          )}
          {tool.tags.includes('featured') && (
            <span className="px-2 py-1 text-xs font-medium bg-violet-500/20 text-violet-400 rounded-full">
              ⭐
            </span>
          )}
        </div>
      )}

      {/* 收藏按钮 */}
      <button
        onClick={handleFavoriteClick}
        className="absolute top-4 left-4 p-2 rounded-full bg-bg-tertiary/50 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-bg-elevated"
        aria-label={favorite ? '取消收藏' : '添加收藏'}
      >
        <svg
          className={`w-5 h-5 transition-colors ${
            favorite ? 'text-primary-500 fill-primary-500' : 'text-text-tertiary'
          }`}
          fill={favorite ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      </button>

      {/* 图标 */}
      <div className="w-16 h-16 flex items-center justify-center text-4xl mb-4 bg-bg-tertiary rounded-2xl">
        {tool.icon}
      </div>

      {/* 名称 */}
      <h3 className="font-display font-semibold text-lg text-text-primary mb-2">
        {tool.name}
      </h3>

      {/* 简介 */}
      <p className="text-text-secondary text-sm line-clamp-2 mb-4">
        {tool.summary}
      </p>

      {/* 操作按钮 */}
      <button className="btn btn-primary w-full">
        立即使用 →
      </button>
    </motion.div>
  );
}

