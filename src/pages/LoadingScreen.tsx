import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, ScanEye, FileText, Sparkles } from 'lucide-react';
import { LOADING_STEPS } from '../types';

interface LoadingScreenProps {
  fileName: string;
}

export function LoadingScreen({ fileName }: LoadingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < LOADING_STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const progress = ((currentStep + 1) / LOADING_STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-6">
      <div className="w-full max-w-xl">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-2.5 mb-12"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-teal-500 flex items-center justify-center shadow-lg shadow-primary-600/20">
            <ScanEye className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <span className="font-bold text-slate-900 text-lg tracking-tight">BenefitLens</span>
            <span className="ml-1.5 text-xs font-bold text-teal-600">AI</span>
          </div>
        </motion.div>

        {/* Animated document icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 2, -2, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center shadow-2xl shadow-primary-600/30"
            >
              <FileText className="w-12 h-12 text-white" strokeWidth={1.5} />
            </motion.div>

            {/* Orbiting sparkles */}
            {[0, 120, 240].map((angle, i) => (
              <motion.div
                key={angle}
                className="absolute top-1/2 left-1/2 w-6 h-6"
                animate={{
                  x: [
                    Math.cos((angle * Math.PI) / 180) * 60,
                    Math.cos(((angle + 360) * Math.PI) / 180) * 60,
                  ],
                  y: [
                    Math.sin((angle * Math.PI) / 180) * 60,
                    Math.sin(((angle + 360) * Math.PI) / 180) * 60,
                  ],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 1,
                  ease: 'linear',
                }}
              >
                <Sparkles className="w-6 h-6 text-teal-400" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* File name */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center text-sm text-slate-500 mb-8 truncate max-w-xs mx-auto"
        >
          {fileName}
        </motion.p>

        {/* Progress bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-700">
              {LOADING_STEPS[currentStep]?.label}...
            </span>
            <span className="text-sm font-bold text-primary-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary-500 to-teal-500"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Steps list */}
        <div className="space-y-2">
          {LOADING_STEPS.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                i < currentStep
                  ? 'bg-teal-50/50'
                  : i === currentStep
                  ? 'bg-primary-50'
                  : 'bg-transparent'
              }`}
            >
              <div className="flex-shrink-0">
                {i < currentStep ? (
                  <CheckCircle2 className="w-5 h-5 text-teal-500" />
                ) : i === currentStep ? (
                  <Loader2 className="w-5 h-5 text-primary-600 animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-200" />
                )}
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    i <= currentStep ? 'text-slate-900' : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </p>
                <AnimatePresence>
                  {i === currentStep && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-slate-500"
                    >
                      {step.description}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
