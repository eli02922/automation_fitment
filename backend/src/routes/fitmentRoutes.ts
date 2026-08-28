import { Router } from 'express';
import * as fitmentController from '../controllers/fitmentController';
import { validateBody, validateQuery } from '../middleware/validate';
import {
  fitmentCreateSchema,
  fitmentSearchSchema,
  fitmentUpdateSchema,
} from '../validation/fitmentSchemas';

const router = Router();

router.get('/', validateQuery(fitmentSearchSchema), fitmentController.search);
router.get('/:id', fitmentController.getById);
router.post('/', validateBody(fitmentCreateSchema), fitmentController.create);
router.patch('/:id', validateBody(fitmentUpdateSchema), fitmentController.update);
router.delete('/:id', fitmentController.remove);

export default router;
