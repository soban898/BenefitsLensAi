/*
  api/analyze.ts
  Vercel Serverless Function replacing Express POST /api/analyze.

  - Parses multipart/form-data in-memory using busboy (no disk writes).
  - Extracts text from PDF using pdf-parse (already in project).
  - Reuses analyzeDocument(...) from server/utils/gemini.ts (prompts unchanged).
  - Returns the same JSON shape as the original Express controller.

  Architectural notes:
  - Express, multer, and disk-based uploads are removed in favor of per-endpoint parsing.
  - Keep uploads in memory to avoid ephemeral filesystem issues on Vercel.
*/

import type { IncomingMessage } from 'http';
import Busboy from 'busboy';
import pdfParse from 'pdf-parse';
import { analyzeDocument } from '../server/utils/gemini.js';

function parseMultipart(req: IncomingMessage): Promise<{ fileBuffer: Buffer; fileName: string | null }> {
  return new Promise((resolve, reject) => {
    const busboy = new Busboy({ headers: req.headers as any });
    let fileBuffer = Buffer.alloc(0);
    let fileName: string | null = null;
    let fileSeen = false;

    busboy.on('file', (_fieldname, file, info) => {
      fileSeen = true;
      fileName = info.filename || null;
      file.on('data', (data: Buffer) => {
        fileBuffer = Buffer.concat([fileBuffer, data]);
      });
      file.on('end', () => {
        // file complete
      });
    });

    busboy.on('error', (err) => reject(err));
    busboy.on('finish', () => {
      if (!fileSeen) {
        return reject(new Error('No file uploaded'));
      }
      resolve({ fileBuffer, fileName });
    });

    (req as any).pipe(busboy);
  });
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { fileBuffer, fileName } = await parseMultipart(req as IncomingMessage);

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
    if (err.message && err.message.includes('API key')) {
      return res.status(500).json({ error: 'Gemini AI service is not configured. Check GEMINI_API_KEY.' });
    }
    if (err.message && err.message.includes('No file uploaded')) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: err.message || 'Failed to analyze document' });
  }
}
