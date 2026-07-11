import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LandingPage } from './pages/LandingPage';
import { LoadingScreen } from './pages/LoadingScreen';
import { ResultsPage } from './pages/ResultsPage';
import { ErrorScreen } from './pages/ErrorScreen';
import { analyzeDocument } from './services/api';
import type { AnalysisResponse, View } from './types';

function App() {
  const [view, setView] = useState<View>('landing');
  const [loadingFileName, setLoadingFileName] = useState('');
  const [analysisData, setAnalysisData] = useState<AnalysisResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileSelected = useCallback(async (file: File) => {
    setLoadingFileName(file.name);
    setView('loading');

    try {
      const data = await analyzeDocument(file);
      setAnalysisData(data);
      setView('results');
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'An unexpected error occurred.'
      );
      setView('error');
    }
  }, []);

  const handleReset = useCallback(() => {
    setView('landing');
    setAnalysisData(null);
    setErrorMessage('');
    setLoadingFileName('');
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={view}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {view === 'landing' && <LandingPage onFileSelected={handleFileSelected} />}
        {view === 'loading' && <LoadingScreen fileName={loadingFileName} />}
        {view === 'results' && analysisData && (
          <ResultsPage data={analysisData} onReset={handleReset} />
        )}
        {view === 'error' && (
          <ErrorScreen error={errorMessage} onReset={handleReset} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default App;
