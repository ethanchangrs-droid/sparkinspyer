export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border-default py-8 mt-12">
      <div className="container">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">✨</span>
            <span className="text-text-secondary">
              © {currentYear} SparkHub
            </span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-text-tertiary">
            <a
              href="#about"
              className="hover:text-text-primary transition-colors"
            >
              关于
            </a>
            <a
              href="#feedback"
              className="hover:text-text-primary transition-colors"
            >
              反馈
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

