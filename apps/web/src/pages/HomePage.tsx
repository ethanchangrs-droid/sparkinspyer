import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToolStore, useUserStore } from '@/store';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ToolGrid from '@/components/tool/ToolGrid';
import ToolDetailModal from '@/components/tool/ToolDetailModal';
import QuickAccessSection from '@/components/section/QuickAccessSection';
import HeroSection from '@/components/section/HeroSection';
import type { Tool } from '@/types';

export default function HomePage() {
  const { slug } = useParams<{ slug: string }>();
  const { tools, loading, error, fetchTools } = useToolStore();
  const { favorites, getRecentToolIds } = useUserStore();
  
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  // 加载工具列表
  useEffect(() => {
    fetchTools();
  }, [fetchTools]);

  // 根据 URL 参数打开工具详情
  useEffect(() => {
    if (slug && tools.length > 0) {
      const tool = tools.find((t) => t.slug === slug);
      if (tool) {
        setSelectedTool(tool);
      }
    }
  }, [slug, tools]);

  // 搜索过滤
  const filteredTools = searchKeyword.trim()
    ? tools.filter(
        (tool) =>
          tool.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          tool.summary.toLowerCase().includes(searchKeyword.toLowerCase())
      )
    : tools;

  // 收藏的工具
  const favoriteTools = tools.filter((tool) => favorites.includes(tool.id));

  // 最近使用的工具
  const recentToolIds = getRecentToolIds();
  const recentTools = recentToolIds
    .map((id) => tools.find((t) => t.id === id))
    .filter((t): t is Tool => t !== undefined);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-secondary mb-4">加载失败: {error}</p>
          <button onClick={fetchTools} className="btn btn-primary">
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        searchKeyword={searchKeyword} 
        onSearchChange={setSearchKeyword} 
      />

      <main className="flex-1">
        <div className="container py-8">
          {/* Hero Section - 仅在首次访问时显示 */}
          {!searchKeyword && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <HeroSection />
            </motion.div>
          )}

          {/* 快速访问区 - 收藏和最近使用 */}
          {!searchKeyword && (favoriteTools.length > 0 || recentTools.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <QuickAccessSection
                favoriteTools={favoriteTools}
                recentTools={recentTools}
                onToolClick={setSelectedTool}
              />
            </motion.div>
          )}

          {/* 搜索结果提示 */}
          {searchKeyword && (
            <div className="mb-6">
              <p className="text-text-secondary">
                搜索 "{searchKeyword}" 找到 {filteredTools.length} 个结果
              </p>
            </div>
          )}

          {/* 工具列表 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {!searchKeyword && (
              <h2 className="text-xl font-semibold text-text-primary mb-6">
                🔥 全部工具
              </h2>
            )}
            <ToolGrid
              tools={filteredTools}
              loading={loading}
              onToolClick={setSelectedTool}
            />
          </motion.section>
        </div>
      </main>

      <Footer />

      {/* 工具详情弹窗 */}
      <ToolDetailModal
        tool={selectedTool}
        isOpen={!!selectedTool}
        onClose={() => setSelectedTool(null)}
      />
    </div>
  );
}

