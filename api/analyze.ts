/*
  api/analyze.ts
  Vercel Serverless Function replacing Express POST /api/analyze.

  Simplified to rely solely on the Web Request API (req.formData()), which is
  supported by Vercel serverless runtimes. The Busboy fallback has been removed
  to avoid runtime inconsistencies and to keep the function minimal.

  - Parses multipart/form-data using req.formData() (in-memory).
  - Extracts text from PDF using pdf-parse.
  - Calls analyzeDocument(...) from server/utils/gemini.js (prompts unchanged).
  - Returns the same JSON shape as the original Express controller.
*/

import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import { analyzeDocument } from '../server/utils/gemini.js';

async function parseMultipart(req: any): Promise<{ fileBuffer: Buffer; fileName: string | null }> {
  if (typeof req.formData !== 'function') {
    // Explicit error — this function requires the Vercel runtime (or other runtimes
    // that implement the Web Request API). We intentionally do not provide a
    // fallback parser to avoid Busboy inconsistencies.
    throw new Error('Multipart parsing is not supported in this environment. Use the Vercel runtime.');
  }

  const formData = await req.formData();
  const file = formData.get('document') as any;

  if (!file) {
    throw new Error('No file uploaded');
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const fileName = file.name || null;

  return { fileBuffer: buffer, fileName };
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { fileBuffer, fileName } = await parseMultipart(req);

    if (!fileBuffer || fileBuffer.length === 0) {
      return res.status(400).json({ error: 'No file uploaded or empty file' });
    }

    const pdfData = await pdfParse(fileBuffer as Buffer);

    if (!pdfData.text || pdfData.text.trim().length === 0) {
      return res.status(400).json({ error: 'No text could be extracted from this PDF. It may be a scanned image or corrupted.' });
    }

    const analysis = await analyzeDocument(pdfData.text as string);

    res.status(200).json({
      analysis,
      extractedText: pdfData.text,
      fileName: fileName || null,
      pageCount: (pdfData as any).numpages || 1,
    });
  } catch (err: any) {
    console.error('analyze error', err);
    if (err?.message && err.message.includes('API key')) {
      return res.status(500).json({ error: 'Gemini AI service is not configured. Check GEMINI_API_KEY.' });
    }
    if (err?.message && (err.message.includes('No file uploaded') || err.message.includes('Multipart parsing'))) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: err?.message || 'Failed to analyze document' });
  }
}
