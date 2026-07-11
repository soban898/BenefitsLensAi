export interface BenefitsAnalysis {
  documentType: string;
  summary: string;
  keyDeadlines: string[];
  importantDates: string[];
  planType: string;
  coverage: string[];
  employeeResponsibilities: string[];
  employerResponsibilities: string[];
  importantWarnings: string[];
  nextSteps: string[];
  commonQuestions: { question: string; answer: string }[];
}

export interface AnalysisResponse {
  analysis: BenefitsAnalysis;
  extractedText: string;
  fileName: string;
  pageCount: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
}

export interface Citation {
  source: string;
  pageNumber: string | null;
  confidence: 'high' | 'medium' | 'low';
}

export interface ChatRequest {
  question: string;
  documentText: string;
  history: ChatMessage[];
}

export interface ChatResponse {
  answer: string;
  citations: Citation[];
}

export interface ApiError {
  error: string;
  code?: string;
}

export type View = 'landing' | 'loading' | 'results' | 'error';

export interface LoadingStep {
  label: string;
  description: string;
}

export const LOADING_STEPS: LoadingStep[] = [
  { label: 'Uploading document', description: 'Securely transmitting your file' },
  { label: 'Reading PDF', description: 'Parsing document structure' },
  { label: 'Extracting text', description: 'Pulling text from pages' },
  { label: 'Analyzing benefits', description: 'AI understanding the content' },
  { label: 'Finding deadlines', description: 'Identifying critical dates' },
  { label: 'Generating summary', description: 'Writing plain-English explanation' },
];
