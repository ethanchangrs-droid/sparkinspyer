import { motion } from 'framer-motion';
import SearchBar from '@/components/search/SearchBar';

interface HeaderProps {
  searchKeyword: string;
  onSearchChange: (keyword: string) => void;
}

export default function Header({ searchKeyword, onSearchChange }: HeaderProps) {
  return (
    <motion.header
      className="sticky top-0 z-50 bg-bg-primary/80 backdrop-blur-lg border-b border-border-default"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <span className="text-2xl">✨</span>
            <span className="font-display font-bold text-xl text-text-primary group-hover:text-primary-500 transition-colors">
              SparkHub
            </span>
          </a>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <SearchBar value={searchKeyword} onChange={onSearchChange} />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* 未来可以添加主题切换等按钮 */}
          </div>
        </div>
      </div>
    </motion.header>
  );
}

