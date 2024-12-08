import { Router } from 'express';
import { getNotifications, markNotificationAsRead, deleteNotification } from '../controllers/notificationController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.get('/nsg', authenticate, getNotifications);
router.put('/read/:id', authenticate, markNotificationAsRead);
router.delete('/:id', authenticate, deleteNotification);

export default router;
