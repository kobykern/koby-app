import {Router} from 'express';

const router = Router();

// Example route for getting all users
router.get('/', (req, res) => {
  res.json({ message: 'Get all users' });
});

export default router;