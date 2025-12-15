import { motion } from 'framer-motion';
import type { Tool } from '@/types';

interface QuickAccessCardProps {
  tool: Tool;
  onClick: () => void;
}

export default function QuickAccessCard({ tool, onClick }: QuickAccessCardProps) {
  return (
    <motion.button
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 bg-bg-secondary border border-border-default rounded-xl hover:border-border-hover hover:bg-bg-tertiary transition-all whitespace-nowrap"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="text-2xl">{tool.icon}</span>
      <span className="font-medium text-text-primary">{tool.name}</span>
    </motion.button>
  );
}

