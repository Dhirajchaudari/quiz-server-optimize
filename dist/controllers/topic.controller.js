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
exports.saveUserTopics = exports.getAllTopics = exports.createTopic = void 0;
const topics_model_1 = require("../models/topics.model");
const quiz_user_model_1 = require("../models/quiz-user.model");
const createTopic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { topic } = req.body;
        const createTopic = yield topics_model_1.TopicModel.create({
            topic: topic,
            createdAt: new Date(),
        });
        res.status(200).send({
            message: "Topic created",
            success: true,
            topic: createTopic,
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(error.status).send({
            message: error.message.toString(),
            success: false,
        });
        return;
    }
});
exports.createTopic = createTopic;
const getAllTopics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allTopics = yield topics_model_1.TopicModel.find({}).select("topic").lean();
        res.status(200).send({
            message: "Topics fetched",
            success: true,
            topics: allTopics,
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(error.status).send({
            message: error.message.toString(),
            success: false,
        });
        return;
    }
});
exports.getAllTopics = getAllTopics;
const saveUserTopics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { topics } = req.body;
        const userId = (_a = req.context) === null || _a === void 0 ? void 0 : _a.user;
        const respo = yield quiz_user_model_1.QuizUserModel.create({
            user: userId,
            topics: topics,
            createdAt: new Date(),
        });
        res.status(200).json({
            message: "Topics saved successfully.",
            success: true,
            data: respo._id.toString()
        });
        return;
    }
    catch (error) {
        console.log(error.message.toString());
        res.status(400).json({
            message: error.message.toString(),
            success: false,
        });
    }
});
exports.saveUserTopics = saveUserTopics;
