import express from 'express'
import { quizLeaderboard } from '../controllers/quiz-user.controller';

const router = express.Router();

router.get("/leaderboard",quizLeaderboard)

export default router;