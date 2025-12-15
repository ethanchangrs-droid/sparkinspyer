import { motion, AnimatePresence } from 'framer-motion';
import ToolCard from './ToolCard';
import ToolCardSkeleton from './ToolCardSkeleton';
import type { Tool } from '@/types';

interface ToolGridProps {
  tools: Tool[];
  loading: boolean;
  onToolClick: (tool: Tool) => void;
}

export default function ToolGrid({ tools, loading, onToolClick }: ToolGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <ToolCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (tools.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🔍</div>
        <p className="text-text-secondary">没有找到相关工具</p>
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      layout
    >
      <AnimatePresence mode="popLayout">
        {tools.map((tool, index) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            layout
          >
            <ToolCard tool={tool} onClick={() => onToolClick(tool)} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

