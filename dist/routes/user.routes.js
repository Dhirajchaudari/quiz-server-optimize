"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.post("/register", user_controller_1.registerUser);
router.post("/verify-email", user_controller_1.verifyEmail);
router.post("/login", user_controller_1.loginUser);
router.get("/me", authMiddleware_1.isUser, user_controller_1.me);
router.get("/test", authMiddleware_1.isUser, user_controller_1.testController);
router.get("/leaderboard", user_controller_1.leaderboard);
exports.default = router;
