// api/analyze.ts
// Vercel Node.js Serverless Function (Node runtime)
// - Uses the current formidable API to parse multipart/form-data on Node
// - Keeps the uploaded PDF entirely in memory
// - Extracts text using pdf-parse
// - Calls analyzeDocument(...) from server/utils/gemini.ts
// - Returns { analysis, extractedText, fileName, pageCount }

import type { IncomingMessage, ServerResponse } from 'http';
import { PassThrough } from 'stream';
import { formidable, File, Files } from 'formidable';
import pdfParse from 'pdf-parse';
import { analyzeDocument } from '../server/utils/gemini.js';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

async function parseMultipart(req: IncomingMessage): Promise<{ fileBuffer: Buffer; fileName: string | null }> {
  return new Promise((resolve, reject) => {
    const buffers = new Map<string, Buffer>();

    const form = formidable({
      maxFileSize: MAX_FILE_SIZE,
      multiples: false,
      // Use the write stream handler to collect file data in memory
      fileWriteStreamHandler: (file: File) => {
        const pass = new PassThrough();
        const chunks: Buffer[] = [];
        pass.on('data', (chunk: Buffer) => chunks.push(Buffer.from(chunk)));
        pass.on('end', () => {
          const key = file.originalFilename ?? file.newFilename ?? file.newFilename ?? 'file';
          try {
            buffers.set(key, Buffer.concat(chunks));
          } catch (err) {
            // If buffer concat fails, we will handle missing buffer later
          }
        });
        return pass;
      },
    });

    form.parse(req, (err, _fields, files: Files) => {
      if (err) {
        return reject(err);
      }

      // Prefer field named 'document', otherwise pick the first file available
      let fileEntry: File | undefined;

      const documentField = files['document'];
      if (documentField) {
        fileEntry = Array.isArray(documentField) ? documentField[0] : documentField;
      } else {
        const keys = Object.keys(files);
        if (keys.length === 0) {
          return reject(new Error('No file uploaded'));
        }
        const first = files[keys[0]];
        fileEntry = Array.isArray(first) ? first[0] : first;
      }

      if (!fileEntry) {
        return reject(new Error('No file uploaded'));
      }

      const key = fileEntry.originalFilename ?? fileEntry.newFilename ?? fileEntry.newFilename ?? 'file';
      const buffer = buffers.get(key) ?? Array.from(buffers.values())[0];

      if (!buffer || buffer.length === 0) {
        return reject(new Error('No file uploaded or file is empty'));
      }

      const fileName = fileEntry.originalFilename ?? fileEntry.newFilename ?? null;
      resolve({ fileBuffer: buffer, fileName });
    });
  });
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  try {
    const { fileBuffer, fileName } = await parseMultipart(req);

    if (!fileBuffer || fileBuffer.length === 0) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'No file uploaded or empty file' }));
      return;
    }

    let pdfData: any;
    try {
      pdfData = await pdfParse(fileBuffer);
    } catch (err) {
      console.error('pdf-parse error', err);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to parse PDF. The file may be corrupted or not a valid PDF.' }));
      return;
    }

    if (!pdfData?.text || String(pdfData.text).trim().length === 0) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'No text could be extracted from this PDF. It may be a scanned image or contain images only.' }));
      return;
    }

    let analysis: unknown;
    try {
      analysis = await analyzeDocument(String(pdfData.text));
    } catch (err: any) {
      console.error('analyzeDocument error', err);
      if (err?.message && typeof err.message === 'string' && err.message.includes('API key')) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Gemini AI service is not configured. Check GEMINI_API_KEY.' }));
        return;
      }
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err?.message || 'Failed to analyze document' }));
      return;
    }

    const responseBody = {
      analysis,
      extractedText: pdfData.text,
      fileName: fileName ?? null,
      pageCount: (pdfData as any).numpages ?? 1,
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(responseBody));
  } catch (err: any) {
    console.error('handler error', err);
    const message = err?.message ?? 'Internal server error';
    const status = message.includes('No file uploaded') || message.includes('file is empty') ? 400 : 500;
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: message }));
  }
}
