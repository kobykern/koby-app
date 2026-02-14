import {Router} from 'express';
import { getUsers, createUser, getUserDetails, loginUser } from '../controller/users';
import { authenticate } from '../middleware/auth';

const router = Router();

// LOGIN //
router.post('/login', loginUser);

router.get('/', authenticate, getUsers);
router.post('/', createUser);
router.get('/:id', getUserDetails);

export default router;