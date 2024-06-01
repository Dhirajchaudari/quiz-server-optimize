"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const quiz_controller_1 = require("../controllers/quiz.controller");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.post("/create-quiz-questions", quiz_controller_1.createQuizQuestions);
router.get("/all-quiz", quiz_controller_1.getAllQuiz);
router.get("/start-quiz", authMiddleware_1.isUser, quiz_controller_1.getQuizByTopics);
router.put("/save-response", authMiddleware_1.isUser, quiz_controller_1.saveQuizResponse);
router.put("/quiz-completed", authMiddleware_1.isUser, quiz_controller_1.quizCompleted);
router.get("/result", authMiddleware_1.isUser, quiz_controller_1.quizResult);
exports.default = router;
