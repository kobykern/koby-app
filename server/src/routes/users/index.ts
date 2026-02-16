import { Router } from 'express';
import { getUsers, getUserDetails, getMyDetails } from '../../controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.get('/', authenticate, getUsers);
router.get('/me', authenticate, getMyDetails);
router.get('/:id', authenticate, getUserDetails);

export default router;