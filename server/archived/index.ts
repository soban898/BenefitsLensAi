/*
  Archived Express server: original server/index.ts
  Moved during migration to Vercel serverless functions. Left here for reference.
*/

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import analysisRoutes from './routes/analysisRoutes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
import fs from 'fs';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Routes
app.use('/api', analysisRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);

  if (err?.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File is too large. Maximum size is 20MB.' });
  }

  if (err?.message?.includes('Only PDF files')) {
    return res.status(400).json({ error: err.message });
  }

  return res.status(500).json({ error: 'An unexpected error occurred.' });
});

app.listen(PORT, () => {
  console.log(`BenefitLens AI server running on port ${PORT}`);
});
