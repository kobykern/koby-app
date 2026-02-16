import { Router } from 'express';
import { getUsers, getUserDetails } from '../../controller/users';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.get('/', authenticate, getUsers);
router.get('/:id', authenticate, getUserDetails);

export default router;