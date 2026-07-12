/*
  api/analyze.ts

  Vercel Node.js Serverless Function (Node runtime, NOT Edge).

  This implementation:
  - Uses the Node-style handler: export default async function handler(req, res)
  - Parses multipart/form-data using formidable (server-side parser that works in Vercel Node functions)
  - Keeps the uploaded PDF entirely in memory (no disk writes)
  - Extracts text with pdf-parse (stable entrypoint)
  - Reuses analyzeDocument(...) from server/utils/gemini.js
  - Returns the same response shape: { analysis, extractedText, fileName, pageCount }

  Error codes:
  - 400: missing file or invalid PDF
  - 500: Gemini errors or unexpected server errors
*/

import { IncomingMessage } from 'http';
import { PassThrough } from 'stream';
import { IncomingForm, File as FormidableFile } from 'formidable';
import pdfParse from 'pdf-parse';
import { analyzeDocument } from '../server/utils/gemini.js';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

function parseMultipartNode(req: IncomingMessage): Promise<{ fileBuffer: Buffer; fileName: string | null }> {
  return new Promise((resolve, reject) => {
    const fileBuffers = new Map<string, Buffer>();

    const form = new IncomingForm({
      maxFileSize: MAX_FILE_SIZE,
      multiples: false,
      // Provide a write stream handler that accumulates the file in memory
      fileWriteStreamHandler: (file: FormidableFile) => {
        const pass = new PassThrough();
        const chunks: Buffer[] = [];
        pass.on('data', (chunk: Buffer) => chunks.push(Buffer.from(chunk)));
        pass.on('end', () => {
          const name = (file.originalFilename || file.newFilename || file.newFilename || 'file') as string;
          try {
            fileBuffers.set(name, Buffer.concat(chunks));
          } catch (err) {
            // ignore
          }
        });
        return pass;
      },
    });

    form.parse(req, (err, _fields, files) => {
      if (err) {
        return reject(err);
      }

      // files is an object keyed by field name; we expect a single file field named 'document'
      const fileField = Object.keys(files)[0];
      if (!fileField) {
        return reject(new Error('No file uploaded'));
      }

      const fileObj: any = (files as any)[fileField];

      // Formidable may represent single file as an object or array
      const fileEntry = Array.isArray(fileObj) ? fileObj[0] : fileObj;

      const name = fileEntry?.originalFilename || fileEntry?.newFilename || fileEntry?.filename || fileEntry?.name || null;

      // Find buffer by name; if not present, fall back to the first buffer stored
      let buffer: Buffer | undefined = undefined;
      if (name && fileBuffers.has(name)) {
        buffer = fileBuffers.get(name);
      } else if (fileBuffers.size > 0) {
        buffer = Array.from(fileBuffers.values())[0];
      }

      if (!buffer || buffer.length === 0) {
        return reject(new Error('No file uploaded or file is empty'));
      }

      resolve({ fileBuffer: buffer, fileName: name });
    });
  });
}

export default async function handler(req: any, res: any) {
  // Vercel Node.js Serverless Function signature
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { fileBuffer, fileName } = await parseMultipartNode(req as IncomingMessage);

    if (!fileBuffer || fileBuffer.length === 0) {
      res.status(400).json({ error: 'No file uploaded or empty file' });
      return;
    }

    // Parse PDF in-memory
    let pdfData: any;
    try {
      pdfData = await pdfParse(fileBuffer as Buffer);
    } catch (err: any) {
      console.error('pdf-parse error', err);
      res.status(400).json({ error: 'Failed to parse PDF. The file may be corrupted or not a valid PDF.' });
      return;
    }

    if (!pdfData?.text || pdfData.text.trim().length === 0) {
      res.status(400).json({ error: 'No text could be extracted from this PDF. It may be a scanned image or contain embedded images only.' });
      return;
    }

    // Call the existing analyzeDocument function
    let analysis: any;
    try {
      analysis = await analyzeDocument(pdfData.text as string);
    } catch (err: any) {
      console.error('analyzeDocument (Gemini) error', err);
      // If the error mentions API key, return 500 with a helpful message
      if (err?.message && err.message.includes('API key')) {
        res.status(500).json({ error: 'Gemini AI service is not configured. Check GEMINI_API_KEY.' });
        return;
      }
      // Other Gemini-related errors
      res.status(500).json({ error: err?.message || 'Failed to analyze document' });
      return;
    }

    res.status(200).json({
      analysis,
      extractedText: pdfData.text,
      fileName: fileName || null,
      pageCount: (pdfData as any).numpages || 1,
    });
  } catch (err: any) {
    console.error('analyze handler error', err);
    // Distinguish known errors
    if (err?.message && (err.message.includes('No file uploaded') || err.message.includes('file is empty') || err.message.includes('Multipart parsing'))) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.status(500).json({ error: err?.message || 'Internal server error' });
  }
}
