import { motion } from 'framer-motion';
import {
  AlertTriangle,
  FileX,
  FileWarning,
  ServerCrash,
  ArrowLeft,
  ScanEye,
  RefreshCw,
} from 'lucide-react';

interface ErrorScreenProps {
  error: string;
  onReset: () => void;
}

function getErrorConfig(error: string) {
  const lower = error.toLowerCase();
  if (lower.includes('too large') || lower.includes('size')) {
    return {
      icon: FileWarning,
      title: 'File Too Large',
      description: 'Your document exceeds the 20MB limit. Please upload a smaller PDF.',
      color: 'from-amber-500 to-red-500',
    };
  }
  if (lower.includes('invalid') || lower.includes('not a pdf') || lower.includes('parse')) {
    return {
      icon: FileX,
      title: 'Invalid PDF',
      description: 'The file you uploaded could not be read as a valid PDF. Please try a different file.',
      color: 'from-red-500 to-amber-500',
    };
  }
  if (lower.includes('empty') || lower.includes('no text')) {
    return {
      icon: FileX,
      title: 'Empty Document',
      description: 'No text could be extracted from this PDF. It may be a scanned image or corrupted.',
      color: 'from-amber-500 to-amber-600',
    };
  }
  if (lower.includes('gemini') || lower.includes('api') || lower.includes('server') || lower.includes('unavailable')) {
    return {
      icon: ServerCrash,
      title: 'AI Service Unavailable',
      description: 'Our AI service is temporarily unavailable. Please try again in a moment.',
      color: 'from-primary-500 to-primary-600',
    };
  }
  return {
    icon: AlertTriangle,
    title: 'Something Went Wrong',
    description: error || 'An unexpected error occurred. Please try again.',
    color: 'from-red-500 to-amber-500',
  };
}

export function ErrorScreen({ error, onReset }: ErrorScreenProps) {
  const config = getErrorConfig(error);
  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg text-center"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-12">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-teal-500 flex items-center justify-center shadow-lg">
            <ScanEye className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <span className="font-bold text-slate-900 tracking-tight">BenefitLens</span>
            <span className="ml-1.5 text-xs font-bold text-teal-600">AI</span>
          </div>
        </div>

        {/* Error icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, delay: 0.1, type: 'spring' }}
          className={`inline-flex w-24 h-24 rounded-3xl bg-gradient-to-br ${config.color} items-center justify-center shadow-2xl mb-8`}
        >
          <Icon className="w-12 h-12 text-white" strokeWidth={1.5} />
        </motion.div>

        <h1 className="text-3xl font-extrabold text-slate-900 mb-3">
          {config.title}
        </h1>
        <p className="text-base text-slate-500 mb-8 max-w-md mx-auto leading-relaxed">
          {config.description}
        </p>

        {/* Error detail */}
        <div className="mb-8 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-left">
          <p className="text-xs text-red-600 font-mono break-words">{error}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onReset}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-teal-500 text-white font-semibold shadow-lg shadow-primary-600/20"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onReset}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold hover:border-primary-300 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
