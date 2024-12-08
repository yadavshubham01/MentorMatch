import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import { findMentorshipMatches } from '../controllers/matchmakingController';

const router = Router();
//@ts-ignore
router.get('/matches', authenticate, findMentorshipMatches);

export default router;
