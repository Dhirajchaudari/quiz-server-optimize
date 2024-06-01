import express from 'express'
import { createQuizQuestions, getAllQuiz, getQuizByTopics, quizCompleted, quizResult, saveQuizResponse } from '../controllers/quiz.controller';
import { isUser } from '../middlewares/authMiddleware';

const router = express.Router();

router.post("/create-quiz-questions", createQuizQuestions)

router.get("/all-quiz", getAllQuiz)

router.get("/start-quiz",isUser,getQuizByTopics)

router.put("/save-response", isUser, saveQuizResponse)

router.put("/quiz-completed", isUser, quizCompleted)

router.get("/result",isUser, quizResult)


export default router;