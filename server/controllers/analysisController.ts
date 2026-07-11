import { Request, Response } from 'express';
import fs from 'fs';
import { createRequire } from 'module';
import { analyzeDocument, chatAboutDocument } from '../utils/gemini';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

type MulterRequest = Request & {
  file?: {
    path: string;
    originalname: string;
    mimetype: string;
    size: number;
  };
};
export async function analyzeHandler(req: MulterRequest, res: Response) {
  let filePath = '';

  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded. Please upload a PDF document.',
      });
    }

    filePath = req.file.path;

    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);

    if (!pdfData.text || pdfData.text.trim().length === 0) {
      return res.status(400).json({
        error:
          'No text could be extracted from this PDF. It may be a scanned image or corrupted.',
      });
    }

    const analysis = await analyzeDocument(pdfData.text);

    return res.json({
      analysis,
      extractedText: pdfData.text,
      fileName: req.file.originalname,
      pageCount: pdfData.numpages || 1,
    });
  } catch (error: any) {
    console.error('Analyze error:', error);

    if (
      error?.message?.includes('API key') ||
      error?.message?.includes('API_KEY_INVALID')
    ) {
      return res.status(500).json({
        error:
          'Gemini AI service is not properly configured. Please check the API key.',
      });
    }

    if (
      error?.message?.includes('quota') ||
      error?.message?.includes('RATE_LIMIT')
    ) {
      return res.status(429).json({
        error:
          'The AI service is currently rate-limited. Please try again in a moment.',
      });
    }

    return res.status(500).json({
      error: error?.message || 'Failed to analyze the document.',
    });
  } finally {
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch {}
    }
  }
}

export async function chatHandler(req: Request, res: Response) {
  try {
    const { question, documentText, history } = req.body;

    if (!question) {
      return res.status(400).json({
        error: 'A question is required.',
      });
    }

    if (!documentText) {
      return res.status(400).json({
        error: 'Document context is required.',
      });
    }

    const result = await chatAboutDocument(
      question,
      documentText,
      Array.isArray(history) ? history : []
    );

    return res.json(result);
  } catch (error: any) {
    console.error('Chat error:', error);

    return res.status(500).json({
      error: error?.message || 'Failed to get a response.',
    });
  }
}