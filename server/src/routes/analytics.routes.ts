import { Router } from 'express';
import { getHkiAnalytics } from '../controllers/analytics.controller';
import { protect } from '../middleware/auth.middleware'; // Asumsi middleware ini ada

const router = Router();

// Endpoint ini hanya bisa diakses oleh admin yang sudah login
router.get('/', protect, getHkiAnalytics);

export default router;