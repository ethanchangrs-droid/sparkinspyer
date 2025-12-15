import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/store';
import { getToolUrl } from '@/utils/navigation';
import type { Tool } from '@/types';

interface ToolDetailModalProps {
  tool: Tool | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ToolDetailModal({
  tool,
  isOpen,
  onClose,
}: ToolDetailModalProps) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite, addRecentlyUsed } = useUserStore();

  // 按 ESC 关闭弹窗
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  // 更新 URL
  useEffect(() => {
    if (isOpen && tool) {
      navigate(`/tool/${tool.slug}`, { replace: true });
    } else if (!isOpen) {
      navigate('/', { replace: true });
    }
  }, [isOpen, tool, navigate]);

  const handleUse = () => {
    if (!tool) return;
    addRecentlyUsed(tool.id);
    window.open(getToolUrl(tool.slug), '_blank');
  };

  if (!tool) return null;

  const favorite = isFavorite(tool.id);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 遮罩层 */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* 弹窗 */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-bg-elevated rounded-3xl shadow-modal max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 头部 */}
              <div className="sticky top-0 bg-bg-elevated p-6 border-b border-border-default flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 flex items-center justify-center text-4xl bg-bg-tertiary rounded-2xl flex-shrink-0">
                    {tool.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="font-display font-bold text-2xl text-text-primary">
                        {tool.name}
                      </h2>
                      {tool.tags?.includes('new') && (
                        <span className="px-2 py-1 text-xs font-medium bg-emerald-500/20 text-emerald-400 rounded-full">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="text-text-secondary">{tool.summary}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-bg-tertiary transition-colors"
                  aria-label="关闭"
                >
                  <svg
                    className="w-6 h-6 text-text-secondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* 内容 */}
              <div className="p-6 space-y-6">
                {/* 详细描述 */}
                {tool.description && (
                  <section>
                    <h3 className="font-semibold text-text-primary mb-3">
                      📖 详细介绍
                    </h3>
                    <div className="prose prose-invert prose-sm max-w-none text-text-secondary whitespace-pre-wrap">
                      {tool.description}
                    </div>
                  </section>
                )}

                {/* 使用说明 */}
                {tool.guide && (
                  <section>
                    <h3 className="font-semibold text-text-primary mb-3">
                      📚 使用说明
                    </h3>
                    <div className="prose prose-invert prose-sm max-w-none text-text-secondary whitespace-pre-wrap">
                      {tool.guide}
                    </div>
                  </section>
                )}

                {/* 版本信息 */}
                <div className="flex items-center gap-4 text-sm text-text-tertiary pt-4 border-t border-border-default">
                  {tool.version && <span>版本 {tool.version}</span>}
                  <span>·</span>
                  <span>
                    更新于{' '}
                    {new Date(tool.updatedAt).toLocaleDateString('zh-CN')}
                  </span>
                </div>
              </div>

              {/* 底部操作 */}
              <div className="sticky bottom-0 bg-bg-elevated p-6 border-t border-border-default flex gap-4">
                <button
                  onClick={() => toggleFavorite(tool.id)}
                  className={`btn flex-1 ${
                    favorite
                      ? 'bg-primary-500/10 text-primary-500 border border-primary-500'
                      : 'btn-secondary'
                  }`}
                >
                  {favorite ? '⭐ 已收藏' : '⭐ 添加收藏'}
                </button>
                <button onClick={handleUse} className="btn btn-primary flex-1">
                  🚀 立即使用 →
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

