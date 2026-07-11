import { motion } from 'framer-motion';
import { ScanEye, Github } from 'lucide-react';

export function Navbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between rounded-2xl glass-card px-6 py-3 card-shadow">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-teal-500 flex items-center justify-center shadow-lg shadow-primary-600/20">
              <ScanEye className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-lg tracking-tight">BenefitLens</span>
              <span className="ml-1.5 text-xs font-bold text-teal-600">AI</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-primary-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-primary-600 transition-colors">How it Works</a>
            <a href="#supported" className="hover:text-primary-600 transition-colors">Supported Documents</a>
          </div>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <Github className="w-5 h-5" />
            <span className="hidden sm:inline">Star on GitHub</span>
          </a>
        </div>
      </div>
    </motion.nav>
  );
}
