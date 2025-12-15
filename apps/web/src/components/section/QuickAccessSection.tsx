import { motion } from 'framer-motion';
import QuickAccessCard from './QuickAccessCard';
import type { Tool } from '@/types';

interface QuickAccessSectionProps {
  favoriteTools: Tool[];
  recentTools: Tool[];
  onToolClick: (tool: Tool) => void;
}

export default function QuickAccessSection({
  favoriteTools,
  recentTools,
  onToolClick,
}: QuickAccessSectionProps) {
  return (
    <section className="mb-12 space-y-6">
      {/* 收藏 */}
      {favoriteTools.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <span>⭐</span>
            <span>我的收藏</span>
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {favoriteTools.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <QuickAccessCard tool={tool} onClick={() => onToolClick(tool)} />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* 最近使用 */}
      {recentTools.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <span>📍</span>
            <span>最近使用</span>
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {recentTools.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <QuickAccessCard tool={tool} onClick={() => onToolClick(tool)} />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

