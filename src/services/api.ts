import type {
  AnalysisResponse,
  ChatRequest,
  ChatResponse,
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      message = body.error || body.message || message;
    } catch {
      // response wasn't JSON
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export async function analyzeDocument(file: File): Promise<AnalysisResponse> {
  const formData = new FormData();
  formData.append('document', file);

  const res = await fetch(`${API_BASE}/api/analyze`, {
    method: 'POST',
    body: formData,
  });

  return handleResponse<AnalysisResponse>(res);
}

export async function askQuestion(
  request: ChatRequest
): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  return handleResponse<ChatResponse>(res);
}

export function validateFile(file: File): string | null {
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    return 'Please upload a PDF file.';
  }
  const MAX_SIZE = 20 * 1024 * 1024; // 20MB
  if (file.size > MAX_SIZE) {
    return 'File is too large. Maximum size is 20MB.';
  }
  if (file.size === 0) {
    return 'The selected file is empty.';
  }
  return null;
}
