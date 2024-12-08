import { Router } from 'express';
import {
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  getConnectionRequests,
} from '../controllers/connectionController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.post('/send',authenticate, sendConnectionRequest);
router.put('/accepted/:id', acceptConnectionRequest);
router.put('/rejected/:id', rejectConnectionRequest);
router.get('/requests', authenticate, getConnectionRequests);
export default router;
