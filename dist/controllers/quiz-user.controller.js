"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.quizLeaderboard = void 0;
const quiz_user_model_1 = require("../models/quiz-user.model");
const quizLeaderboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch users and their scores, sorted by score in descending order
        const leaderboardData = yield quiz_user_model_1.QuizUserModel.find()
            .select("user finalScore topics createdAt")
            .sort({ finalScore: -1 })
            .populate("user", "firstName lastName") // Populate user details
            .populate("topics", "topic") // Populate topics
            .lean();
        res.status(200).json({
            success: true,
            data: leaderboardData,
        });
    }
    catch (error) {
        console.error("Error fetching leaderboard data:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching leaderboard data",
        });
    }
});
exports.quizLeaderboard = quizLeaderboard;
