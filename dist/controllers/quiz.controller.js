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
exports.quizResult = exports.quizCompleted = exports.saveQuizResponse = exports.getQuizByTopics = exports.getAllQuiz = exports.createQuizQuestions = void 0;
const quiz_model_1 = require("../models/quiz.model");
const quiz_interface_1 = require("../interfaces/quiz.interface");
const quiz_user_model_1 = require("../models/quiz-user.model");
const user_model_1 = require("../models/user.model");
const nodemailer_1 = require("../nodemailer");
const createQuizQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { topic, question, level, options, weightage, ans } = req.body;
        const createdQuestions = yield quiz_model_1.QuizModel.create({
            topic: topic,
            options: options,
            question: question,
            weightage: weightage,
            level: level,
            ans: ans,
            createdAt: new Date(),
        });
        res.status(200).send({
            message: "Quiz created successfully",
            success: true,
            data: createdQuestions,
        });
    }
    catch (error) {
        res.status(500).send({
            message: error.message.toString(),
            success: false,
        });
    }
});
exports.createQuizQuestions = createQuizQuestions;
const getAllQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quizTopics = yield quiz_model_1.QuizModel.find({})
            .select("-ans -createdAt -updatedAt")
            .populate("topic", "_id topic")
            .lean();
        res.status(200).send({
            message: "Quiz topics found",
            success: true,
            data: quizTopics,
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            message: error.message.toString(),
            success: false,
        });
    }
});
exports.getAllQuiz = getAllQuiz;
const getQuizByTopics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quizId = req.query.quizId;
        // console.log(req)
        const user = yield quiz_user_model_1.QuizUserModel.findOne({ _id: quizId }).select("topics").lean();
        const topicIds = user === null || user === void 0 ? void 0 : user.topics.map((el) => el === null || el === void 0 ? void 0 : el._id.toString());
        const easyQuestions = yield quiz_model_1.QuizModel.find({
            topic: { $in: topicIds },
            level: quiz_interface_1.QuizLevelEnum.Easy,
        })
            .select('-ans -createdAt -updatedAt') // Exclude fields
            .populate('topic', '_id topic') // Populate topic with specific fields
            .lean();
        const mediumQuestions = yield quiz_model_1.QuizModel.find({
            topic: { $in: topicIds },
            level: quiz_interface_1.QuizLevelEnum.Medium,
        })
            .select('-ans -createdAt -updatedAt') // Exclude fields
            .populate('topic', '_id topic') // Populate topic with specific fields
            .lean();
        const hardQuestions = yield quiz_model_1.QuizModel.find({
            topic: { $in: topicIds },
            level: quiz_interface_1.QuizLevelEnum.Hard,
        })
            .select('-ans -createdAt -updatedAt') // Exclude fields
            .populate('topic', '_id topic') // Populate topic with specific fields
            .lean();
        const questions = [...easyQuestions, ...mediumQuestions, ...hardQuestions].sort(() => Math.random() - 0.5);
        res.status(200).send({
            message: "All the best your quiz started.",
            success: true,
            data: questions.slice(0, 10),
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            message: error.message.toString(),
            success: false,
        });
        return;
    }
});
exports.getQuizByTopics = getQuizByTopics;
const saveQuizResponse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { questionId, userAns, quizId } = req.body;
        const userId = (_a = req.context) === null || _a === void 0 ? void 0 : _a.user;
        // await QuizUserModel.up
        const quizResponsePresent = yield quiz_user_model_1.QuizUserModel.countDocuments({
            _id: quizId
        });
        if (quizResponsePresent === 0) {
            res.status(400).json({
                message: "Quiz not found",
                success: false,
            });
            return;
        }
        // check userAns correct or not
        let isCorrect = false;
        const que = yield quiz_model_1.QuizModel.findOne({
            _id: questionId,
        })
            .select("ans weightage")
            .lean();
        if ((que === null || que === void 0 ? void 0 : que.ans) === userAns) {
            isCorrect = true;
        }
        // check question already present
        const questionPresent = yield quiz_user_model_1.QuizUserModel.countDocuments({
            _id: quizId,
            "quizResponse.questionId": questionId,
        });
        let quizResponse;
        if (questionPresent === 0) {
            quizResponse = yield quiz_user_model_1.QuizUserModel.findOneAndUpdate({ _id: quizId }, {
                $push: {
                    quizResponse: {
                        questionId: questionId,
                        userAns: userAns,
                        isCorrect: isCorrect,
                        createdAt: new Date(),
                    },
                },
            });
        }
        else {
            quizResponse = yield quiz_user_model_1.QuizUserModel.findOneAndUpdate({
                _id: quizId,
                "quizResponse.questionId": questionId,
            }, {
                $set: {
                    "quizResponse.$.userAns": userAns,
                    "quizResponse.$.isCorrect": isCorrect,
                    "quizResponse.$.updatedAt": new Date(),
                },
            });
        }
        res.status(200).json({
            message: "Quiz response saved successfully.",
            success: true,
        });
        return;
    }
    catch (error) {
        res.status(error.status).json({
            message: error.message.toString(),
            success: false,
        });
        return;
    }
});
exports.saveQuizResponse = saveQuizResponse;
const quizCompleted = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { quizId } = req.body;
        const userId = (_b = req.context) === null || _b === void 0 ? void 0 : _b.user;
        // Fetch user's quiz responses for the given quiz
        const quizUser = yield quiz_user_model_1.QuizUserModel.findOne({
            _id: quizId,
        })
            .select('quizResponse')
            .populate({
            path: 'quizResponse.questionId',
            model: quiz_model_1.QuizModel,
            select: 'weightage',
        })
            .lean();
        if (!quizUser) {
            return res.status(404).json({
                message: 'Quiz responses not found for the user',
                success: false,
            });
        }
        // Calculate the score for the correct answers
        const correctResponses = quizUser.quizResponse.filter((response) => response.isCorrect);
        const score = correctResponses.reduce((acc, response) => {
            const question = response.questionId;
            return acc + (question.weightage || 0);
        }, 0);
        // Update the final score in the QuizUser document
        yield quiz_user_model_1.QuizUserModel.updateOne({ _id: quizId, }, { $set: { finalScore: score } });
        // Optionally, send a congratulatory email
        // await sendCongratulatoryEmail(userId, score);
        const user = yield user_model_1.UserModel.findOne({ _id: userId }).select("firstName lastName email").lean();
        const userName = `${user === null || user === void 0 ? void 0 : user.firstName}  ${user.firstName}`;
        yield (0, nodemailer_1.sendQuizCompletionEmail)({
            email: user.email,
            name: userName
        });
        // Respond with success
        res.status(200).json({
            message: 'Thank you for your response!',
            success: true,
            score,
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'An error occurred',
            success: false,
        });
    }
});
exports.quizCompleted = quizCompleted;
const quizResult = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { quizId } = req.query;
        // Fetch the quiz user data
        const quizUser = yield quiz_user_model_1.QuizUserModel.findById(quizId)
            .select('user finalScore topics quizResponse')
            .populate('user', 'firstName lastName')
            .populate('topics', 'topic')
            .lean();
        if (!quizUser) {
            return res.status(404).json({
                message: 'Quiz not found',
                success: false,
            });
        }
        // Fetch the associated questions
        const questionIds = quizUser.quizResponse.map(response => response.questionId);
        const questions = yield quiz_model_1.QuizModel.find({ _id: { $in: questionIds } })
            .lean();
        // Prepare the results
        const results = quizUser.quizResponse.map(response => {
            const question = questions.find(q => q._id.toString() === response.questionId.toString());
            return {
                question: {
                    _id: question === null || question === void 0 ? void 0 : question._id,
                    question: question === null || question === void 0 ? void 0 : question.question,
                    options: question === null || question === void 0 ? void 0 : question.options,
                    correctAnswer: question === null || question === void 0 ? void 0 : question.ans,
                    score: question === null || question === void 0 ? void 0 : question.weightage,
                },
                response: {
                    questionId: response.questionId,
                    userAns: response.userAns,
                },
                isCorrect: response.isCorrect,
            };
        });
        // Construct the data to be returned
        const data = {
            user: quizUser.user,
            topics: quizUser.topics,
            results,
            totalScore: quizUser.finalScore,
        };
        // Send the response
        res.status(200).json({
            data,
            success: true,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'An error occurred',
            success: false,
        });
    }
});
exports.quizResult = quizResult;
