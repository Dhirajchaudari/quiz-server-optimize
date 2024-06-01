import express, { Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import { connectToDB } from "./config/mongoDB";
import userRoutes from "./routes/user.routes";
import quizRoutes from './routes/quiz.routes'
import topicRoutes from './routes/topic.routes'
import quizUsers from './routes/quiz-user.routes'
import cookieParser from "cookie-parser";
import { setContext } from "./middlewares/authMiddleware";
import helmet from 'helmet'

// configure env
dotenv.config();
const PORT = process.env.PORT || 8080;

async function startServer() {
  try {
    await connectToDB();
    const app = express();

    app.use(
      cors({
        credentials: true,
        origin: [
          "http://localhost:5173"
        ],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
        exposedHeaders: ["Authorization"]
      })
    );
    
    app.use(cookieParser());
    app.use(express.json());
    app.use(morgan("dev"));
    app.use(
      helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false })
    );

    // Use the context middleware
    app.use(setContext);

    app.use("/api/users", userRoutes);
    app.use("/api/quiz",quizRoutes)
    app.use("/api/topics", topicRoutes)
    app.use("/api/quiz-users",quizUsers)

    app.get("/test", (req: Request, res: Response) => {
      res.status(200).json({
        message: "Test successful",
      });
    });

    app.listen(3000, () => {
      console.log(`
        🚀  Server is running!
        📭  Query at : localhost:${PORT}
      `);
    });
  } catch (error) {
    console.log(error);
  }
}

startServer();
