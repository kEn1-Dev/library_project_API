import { Router } from 'express';
import * as userController from './user.controller';
import { authenticateJWT, requireRole } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.get('/profile', authenticateJWT, userController.getProfile);
router.get('/', authenticateJWT, requireRole([1]), userController.getAllUsers);

export default router;
