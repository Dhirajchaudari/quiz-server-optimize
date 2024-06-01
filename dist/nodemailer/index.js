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
exports.sendQuizCompletionEmail = exports.sendUserVerificationEmail = void 0;
const nodemailer_express_handlebars_1 = __importDefault(require("nodemailer-express-handlebars"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = __importDefault(require("path"));
const auth_1 = require("../utils/auth");
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST,
    port: 465,
    secure: process.env.SMTP_SECURE === "yes" ? true : false,
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    },
});
const hbsOptions = {
    extName: ".hbs",
    viewEngine: {
        extname: ".html",
        partialsDir: path_1.default.join(__dirname, "../emails"),
        defaultLayout: "",
    },
    viewPath: path_1.default.join(__dirname, "../emails"),
};
transporter.use("compile", (0, nodemailer_express_handlebars_1.default)(hbsOptions));
const FROM = `Quiz app<${process.env.FROM_EMAIL}>`;
const LOGIN_LINK = `${process.env.APP_URL}`;
const sendUserVerificationEmail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, name, userId, }) {
    const appUrl = process.env.APP_URL || "http://localhost:5173";
    const token = (0, auth_1.signJwt)({ id: userId }, { expiresIn: "1d" });
    const verificationLink = `${appUrl}/verify-email?token=${token}`;
    const mailOptions = {
        from: FROM,
        bcc: process.env.SMTP_SECURE === "yes" ? "dhirajchaudhari789@gmail.com" : "",
        to: email,
        template: "verify-email",
        context: {
            verificationLink: verificationLink,
            name: name,
        },
        subject: "Verify your email!",
    };
    try {
        yield transporter.sendMail(mailOptions);
    }
    catch (error) {
        console.log("email verification mail error : " + error.toString());
        throw new Error(error.toString());
    }
});
exports.sendUserVerificationEmail = sendUserVerificationEmail;
const sendQuizCompletionEmail = (_b) => __awaiter(void 0, [_b], void 0, function* ({ email, name, }) {
    const mailOptions = {
        from: FROM,
        bcc: process.env.SMTP_SECURE === "yes" ? "dhirajchaudhari789@gmail.com" : "",
        to: email,
        template: "quiz-completion",
        context: {
            name: name,
        },
        subject: "Quiz Completion",
    };
    try {
        yield transporter.sendMail(mailOptions);
    }
    catch (error) {
        console.log("email verification mail error : " + error.toString());
        throw new Error(error.toString());
    }
});
exports.sendQuizCompletionEmail = sendQuizCompletionEmail;
