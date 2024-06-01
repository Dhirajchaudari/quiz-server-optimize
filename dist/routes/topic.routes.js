"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const topic_controller_1 = require("../controllers/topic.controller");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.post("/create-topic", topic_controller_1.createTopic);
router.get("/all-topics", topic_controller_1.getAllTopics);
router.post("/save-topics", authMiddleware_1.isUser, topic_controller_1.saveUserTopics);
exports.default = router;
