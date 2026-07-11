import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, X, AlertCircle, Lock } from 'lucide-react';
import { validateFile } from '../services/api';

const MAX_SIZE = 20 * 1024 * 1024;

interface UploadZoneProps {
  onFileSelected: (file: File) => void;
}

export function UploadZone({ onFileSelected }: UploadZoneProps) {
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors?.[0]?.code === 'file-too-large') {
          setError('File is too large. Maximum size is 20MB.');
        } else if (rejection.errors?.[0]?.code === 'file-invalid-type') {
          setError('Please upload a PDF file.');
        } else {
          setError(rejection.errors?.[0]?.message || 'File rejected.');
        }
        return;
      }

      const file = acceptedFiles[0];
      if (!file) return;

      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      setError(null);
      setSelectedFile(file);
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: MAX_SIZE,
    maxFiles: 1,
    multiple: false,
  });

  const handleAnalyze = () => {
    if (selectedFile) {
      onFileSelected(selectedFile);
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setError(null);
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`relative cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'scale-[1.01]'
            : ''
        }`}
      >
        <input {...getInputProps()} />

        <motion.div
          animate={{
            borderColor: isDragActive
              ? '#00a3f5'
              : isDragReject
              ? '#ef4444'
              : '#e2e8f0',
            backgroundColor: isDragActive
              ? 'rgba(0, 163, 245, 0.02)'
              : 'rgba(255, 255, 255, 1)',
          }}
          className={`relative rounded-3xl border-2 border-dashed p-12 text-center transition-all ${
            isDragReject ? 'border-red-400 bg-red-50/30' : ''
          }`}
        >
          {/* Decorative gradient orbs */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary-200/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-teal-200/20 rounded-full blur-3xl" />
          </div>

          <AnimatePresence mode="wait">
            {selectedFile ? (
              <motion.div
                key="selected"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative"
              >
                <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-primary-50 border border-primary-200">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" strokeWidth={2} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-900 max-w-[200px] truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    className="ml-2 w-8 h-8 rounded-lg hover:bg-primary-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-8">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAnalyze();
                    }}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary-600 to-teal-500 text-white font-semibold shadow-xl shadow-primary-600/25 text-base"
                  >
                    <UploadCloud className="w-5 h-5" />
                    Analyze Document
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative"
              >
                <motion.div
                  animate={{
                    y: isDragActive ? -4 : 0,
                    scale: isDragActive ? 1.1 : 1,
                  }}
                  className="inline-flex w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-500 to-teal-500 items-center justify-center shadow-xl shadow-primary-600/20 mb-6"
                >
                  <UploadCloud className="w-10 h-10 text-white" strokeWidth={1.8} />
                </motion.div>

                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {isDragActive
                    ? 'Drop your PDF here'
                    : 'Drag & drop your benefits document'}
                </h3>
                <p className="text-sm text-slate-500 mb-6">
                  or{' '}
                  <span className="text-primary-600 font-semibold underline decoration-primary-300 underline-offset-2">
                    browse files
                  </span>
                </p>

                <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                  <Lock className="w-3.5 h-3.5" />
                  <span>PDF only · Max 20MB · Secure & private</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-4 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
