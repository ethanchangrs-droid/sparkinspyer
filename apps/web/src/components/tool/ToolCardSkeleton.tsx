export default function ToolCardSkeleton() {
  return (
    <div className="card p-6 animate-pulse">
      {/* 图标骨架 */}
      <div className="w-16 h-16 bg-bg-tertiary rounded-2xl mb-4" />

      {/* 标题骨架 */}
      <div className="h-6 bg-bg-tertiary rounded-lg w-3/4 mb-2" />

      {/* 描述骨架 */}
      <div className="h-4 bg-bg-tertiary rounded-lg w-full mb-2" />
      <div className="h-4 bg-bg-tertiary rounded-lg w-2/3 mb-4" />

      {/* 按钮骨架 */}
      <div className="h-10 bg-bg-tertiary rounded-xl w-full" />
    </div>
  );
}

