/*
  api/analyze.ts
  Vercel Serverless Function replacing Express POST /api/analyze.

  Improvements:
  - Uses the Web Request API (req.formData()) when available on Vercel to parse multipart/form-data in-memory.
  - Falls back to busboy if req.formData is not available (handles older runtimes).
  - Extracts text from PDF using pdf-parse and calls analyzeDocument from server/utils/gemini.js
  - Returns the same JSON shape as the original Express controller.

  Notes:
  - This removes reliance on Busboy when possible and resolves the "Busboy is not a constructor" runtime error.
  - Keeps uploads in memory (Buffer) to be compatible with Vercel serverless.
*/

import type { IncomingMessage } from 'http';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import { analyzeDocument } from '../server/utils/gemini.js';

async function parseMultipart(req: any): Promise<{ fileBuffer: Buffer; fileName: string | null }> {
  // Prefer the Web Request API (available in Vercel runtimes) which exposes formData()
  if (typeof req.formData === 'function') {
    const formData = await req.formData();
    const file = formData.get('document') as any;
    if (!file) {
      throw new Error('No file uploaded');
    }
    // file implements the File interface (has arrayBuffer and name)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = file.name || null;
    return { fileBuffer: buffer, fileName };
  }

  // Fallback to Busboy for environments without formData(). Use dynamic import to avoid bundling issues.
  const BusboyModule = await import('busboy');
  // busboy v1.x exports a default function; handle both shapes.
  const busboyFactory = (BusboyModule && (BusboyModule.default ?? BusboyModule)) as any;

  return await new Promise((resolve, reject) => {
    try {
      const bb = typeof busboyFactory === 'function' ? busboyFactory({ headers: req.headers }) : new busboyFactory({ headers: req.headers });

      let fileBuffer = Buffer.alloc(0);
      let fileName: string | null = null;
      let fileSeen = false;

      bb.on('file', (_fieldname: any, file: any, info: any) => {
        fileSeen = true;
        fileName = info?.filename || null;
        file.on('data', (data: Buffer) => {
          fileBuffer = Buffer.concat([fileBuffer, data]);
        });
        file.on('end', () => {
          // file finished
        });
      });

      bb.on('error', (err: any) => reject(err));
      bb.on('finish', () => {
        if (!fileSeen) return reject(new Error('No file uploaded'));
        resolve({ fileBuffer, fileName });
      });

      // In Node.js serverless handler, req is a Node IncomingMessage
      (req as IncomingMessage).pipe(bb);
    } catch (err) {
      reject(err);
    }
  });
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
    if (err?.message && err.message.includes('No file uploaded')) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: err?.message || 'Failed to analyze document' });
  }
}
