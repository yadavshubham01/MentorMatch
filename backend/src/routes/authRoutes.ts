import { Router } from 'express';
import { registerUser, loginUser, getUserProfile, updateUserProfile, getUsers } from '../controllers/userController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', registerUser);
//@ts-ignore
router.post('/login', loginUser);
router.get('/profile/:id',authenticate, getUserProfile);
//@ts-ignore
router.put('/profile', authenticate, updateUserProfile);
router.get('/users',authenticate,getUsers)

export default router;