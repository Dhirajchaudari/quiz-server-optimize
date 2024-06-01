import { Request, Response } from "express";
import { QuizUserModel } from "../models/quiz-user.model";
import { QuizModel } from "../models/quiz.model";



export const quizLeaderboard = async (req: Request, res: Response) => {
    try {
      // Fetch users and their scores, sorted by score in descending order
      const leaderboardData = await QuizUserModel.find()
      .select("user finalScore topics createdAt")
        .sort({ finalScore: -1 })
        .populate("user", "firstName lastName") // Populate user details
        .populate("topics", "topic") // Populate topics
        .lean();
  
      res.status(200).json({
        success: true,
        data: leaderboardData,
      });
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching leaderboard data",
      });
    }
  };