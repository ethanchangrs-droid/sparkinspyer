import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="py-12 sm:py-16 text-center relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-6xl mb-6"
      >
        ✨
      </motion.div>

      <motion.h1
        className="font-display font-bold text-4xl sm:text-5xl text-text-primary mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Spark<span className="text-primary-500">Hub</span>
      </motion.h1>

      <motion.p
        className="text-lg text-text-secondary max-w-md mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        探索实用小工具，点亮你的效率宇宙
      </motion.p>
    </section>
  );
}

