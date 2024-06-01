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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const mongoDB_1 = require("./config/mongoDB");
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const quiz_routes_1 = __importDefault(require("./routes/quiz.routes"));
const topic_routes_1 = __importDefault(require("./routes/topic.routes"));
const quiz_user_routes_1 = __importDefault(require("./routes/quiz-user.routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const authMiddleware_1 = require("./middlewares/authMiddleware");
const helmet_1 = __importDefault(require("helmet"));
// configure env
dotenv_1.default.config();
const PORT = process.env.PORT || 8080;
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, mongoDB_1.connectToDB)();
            const app = (0, express_1.default)();
            app.use((0, cors_1.default)({
                credentials: true,
                origin: [
                    "http://localhost:5173"
                ],
                methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
                exposedHeaders: ["Authorization"]
            }));
            app.use((0, cookie_parser_1.default)());
            app.use(express_1.default.json());
            app.use((0, morgan_1.default)("dev"));
            app.use((0, helmet_1.default)({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
            // Use the context middleware
            app.use(authMiddleware_1.setContext);
            app.use("/api/users", user_routes_1.default);
            app.use("/api/quiz", quiz_routes_1.default);
            app.use("/api/topics", topic_routes_1.default);
            app.use("/api/quiz-users", quiz_user_routes_1.default);
            app.get("/test", (req, res) => {
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
        }
        catch (error) {
            console.log(error);
        }
    });
}
startServer();
