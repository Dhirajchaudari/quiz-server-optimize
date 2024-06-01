import express from 'express'
import { leaderboard, loginUser, me, registerUser, testController, verifyEmail } from '../controllers/user.controller';
import { isUser } from '../middlewares/authMiddleware';

const router = express.Router();

router.post("/register", registerUser)

router.post("/verify-email", verifyEmail)

router.post("/login", loginUser)

router.get("/me",isUser,me)

router.get("/test", isUser, testController)

router.get("/leaderboard",leaderboard )


export default router;