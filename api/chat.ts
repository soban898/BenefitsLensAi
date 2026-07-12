/**
 * api/chat.ts
 * Vercel Serverless Function replacing Express POST /api/chat
 *
 * Accepts JSON body: { question, documentText, history }
 * Calls chatAboutDocument from server/utils/gemini.ts and returns its parsed JSON result.
 * Preserves the same response shape as the previous Express controller.
 */

import { chatAboutDocument } from '../server/utils/gemini.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const body = req.body ?? {};
    const { question, documentText, history } = body;

    if (!question) {
      return res.status(400).json({ error: 'A question is required.' });
    }

    if (!documentText) {
      return res.status(400).json({ error: 'Document context is required.' });
    }

    const result = await chatAboutDocument(question, documentText, Array.isArray(history) ? history : []);

    res.status(200).json(result);
  } catch (err: any) {
    console.error('chat error', err);
    if (err.message && err.message.includes('API key')) {
      return res.status(500).json({ error: 'Gemini AI service is not configured. Check GEMINI_API_KEY.' });
    }
    res.status(500).json({ error: err.message || 'Failed to get chat response' });
  }
}
