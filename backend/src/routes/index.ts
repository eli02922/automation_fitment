import { Router } from 'express';
import fitmentRoutes from './fitmentRoutes';

const router = Router();

router.get('/health', (_req, res) => res.json({ status: 'ok' }));
router.use('/fitments', fitmentRoutes);

export default router;
