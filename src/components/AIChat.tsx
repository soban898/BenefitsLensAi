import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Loader2,
  Sparkles,
  User,
  FileText,
  AlertCircle,
  ShieldQuestion,
} from 'lucide-react';
import type { ChatMessage, Citation } from '../types';
import { askQuestion } from '../services/api';

interface AIChatProps {
  documentText: string;
  fileName: string;
}

const SUGGESTED_QUESTIONS = [
  'Can I miss this deadline?',
  'Who pays the premiums?',
  'Can my spouse stay covered?',
  'Can I appeal a decision?',
  'Can I switch plans?',
];

const confidenceConfig = {
  high: { color: 'text-teal-600 bg-teal-50 border-teal-200', label: 'High' },
  medium: { color: 'text-amber-600 bg-amber-50 border-amber-200', label: 'Medium' },
  low: { color: 'text-slate-500 bg-slate-100 border-slate-200', label: 'Low' },
};

function CitationBadge({ citation }: { citation: Citation }) {
  const conf = confidenceConfig[citation.confidence];
  return (
    <div className="flex flex-wrap items-center gap-2 mt-3">
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary-50 text-primary-700 text-xs font-semibold border border-primary-100">
        <FileText className="w-3.5 h-3.5" />
        {citation.source}
      </span>
      {citation.pageNumber && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200">
          Page {citation.pageNumber}
        </span>
      )}
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${conf.color}`}>
        {conf.label} confidence
      </span>
    </div>
  );
}

export function AIChat({ documentText, fileName }: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (question?: string) => {
    const q = (question ?? input).trim();
    if (!q || isLoading) return;

    setInput('');
    setError(null);
    const userMessage: ChatMessage = { role: 'user', content: q };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await askQuestion({
        question: q,
        documentText,
        history: [...messages, userMessage],
      });

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: response.answer,
          citations: response.citations,
        },
      ]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to get a response. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-3xl bg-white border border-slate-100 card-shadow overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-6 border-b border-slate-100 bg-gradient-to-r from-primary-50/50 to-teal-50/50">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center shadow-lg">
          <Sparkles className="w-5 h-5 text-white" strokeWidth={2} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Ask BenefitLens AI</h3>
          <p className="text-xs text-slate-500">
            Answers are based on your uploaded document: {fileName}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="h-[400px] overflow-y-auto scrollbar-thin p-6 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mb-4">
              <ShieldQuestion className="w-8 h-8 text-primary-500" strokeWidth={1.8} />
            </div>
            <p className="text-base font-semibold text-slate-700 mb-1">
              Ask anything about your document
            </p>
            <p className="text-sm text-slate-400 mb-6 max-w-xs">
              I've read your document and can answer questions about deadlines, coverage, eligibility, and more.
            </p>
            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
              {SUGGESTED_QUESTIONS.map((q) => (
                <motion.button
                  key={q}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSend(q)}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-700 hover:border-primary-300 hover:text-primary-700 transition-colors"
                >
                  {q}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                  msg.role === 'user'
                    ? 'bg-slate-100'
                    : 'bg-gradient-to-br from-primary-500 to-teal-500'
                }`}
              >
                {msg.role === 'user' ? (
                  <User className="w-4 h-4 text-slate-500" />
                ) : (
                  <Sparkles className="w-4 h-4 text-white" />
                )}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-50 text-slate-800 border border-slate-100'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-200/50">
                    {msg.citations.map((c, ci) => (
                      <CitationBadge key={ci} citation={c} />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Analyzing document...</span>
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask a question about your document..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-all"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-r from-primary-600 to-teal-500 text-white flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
