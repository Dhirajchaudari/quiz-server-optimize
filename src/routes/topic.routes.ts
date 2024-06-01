import express from 'express'
import { createTopic, getAllTopics, saveUserTopics } from '../controllers/topic.controller';
import { isUser } from '../middlewares/authMiddleware';

const router = express.Router();

router.post("/create-topic", createTopic)

router.get("/all-topics",getAllTopics)

router.post("/save-topics", isUser, saveUserTopics)



export default router;