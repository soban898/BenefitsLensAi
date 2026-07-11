import { Router } from 'express';
import { upload } from '../utils/upload';
import { analyzeHandler, chatHandler } from '../controllers/analysisController';

const router = Router();

router.post('/analyze', upload.single('document'), analyzeHandler);
router.post('/chat', chatHandler);

export default router;
