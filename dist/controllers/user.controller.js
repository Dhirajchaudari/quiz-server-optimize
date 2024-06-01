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
exports.leaderboard = exports.testController = exports.me = exports.loginUser = exports.verifyEmail = exports.registerUser = void 0;
const joi_1 = __importDefault(require("joi"));
const user_model_1 = require("../models/user.model");
const nodemailer_1 = require("../nodemailer");
const auth_1 = require("../utils/auth");
const user_interface_1 = require("../interfaces/user.interface");
const helpers_1 = require("../helpers");
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, firstName, lastName, number, password } = req.body;
        // Validations on input
        const joiSchema = joi_1.default.object({
            firstName: joi_1.default.string().required().messages({
                "string.empty": "You have not entered your first name.",
            }),
            lastName: joi_1.default.string().required().messages({
                "string.empty": "You have not entered your first name.",
            }),
            email: joi_1.default.string().required().email().messages({
                "string.empty": "You have not entered your email id.",
                "string.email": "You have entered an invalid email id.",
            }),
            number: joi_1.default.string()
                .length(10)
                .pattern(/^[0-9]+$/)
                .messages({
                "string.empty": "You have not entered your phone number.",
                "string.length": "You have entered an invalid phone number.",
                "string.pattern": "You have entered an invalid phone number.",
            }),
            password: joi_1.default.string()
                .required()
                .messages({ "string.empty": "You have not entered your password." }),
        });
        // Schema Validation
        const { error } = joiSchema.validate({
            firstName: firstName,
            lastName: lastName,
            email: email,
            number: number,
            password: password,
        });
        if (error) {
            res.status(300).send({
                message: error.message,
                success: false,
            });
            return;
        }
        // 1. check if the user already exists
        const user = yield user_model_1.UserModel.countDocuments({
            $or: [{ email: email }, { number: number }],
        });
        if (user !== 0) {
            res.status(400).send({
                message: "Looks like user email and number is already in used.",
                success: false,
            });
            return;
        }
        const storeUserInDB = yield user_model_1.UserModel.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            number: number,
            password: password,
            createdAt: new Date(),
        });
        yield (0, nodemailer_1.sendUserVerificationEmail)({
            email: email,
            name: firstName + lastName,
            userId: storeUserInDB._id.toString(),
        });
        res.status(201).send({
            message: "User created successfully",
            success: true,
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Something went wrong",
            success: false,
        });
        return;
    }
});
exports.registerUser = registerUser;
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    const payload = (0, auth_1.verifyJwt)(token);
    if (!payload) {
        return res.status(400).send({
            message: "Invalid token",
            success: false,
        });
    }
    const user = yield user_model_1.UserModel.findById(payload === null || payload === void 0 ? void 0 : payload.id)
        .select("userVerifyStatus")
        .lean();
    if (!user) {
        return res.status(400).send({
            message: "User not found",
            success: false,
        });
    }
    if ((user === null || user === void 0 ? void 0 : user.userVerifyStatus) === user_interface_1.UserProfileStatus.completed) {
        return res.status(400).send({
            message: "User already verified",
            success: false,
        });
    }
    try {
        yield user_model_1.UserModel.findByIdAndUpdate(payload === null || payload === void 0 ? void 0 : payload.id, {
            userVerifyStatus: user_interface_1.UserProfileStatus.completed,
        });
        return res.status(200).send({
            message: "User verified successfully",
            success: true,
        });
    }
    catch (error) {
        return res.status(400).json({
            message: error.message.toString(),
            success: false,
        });
    }
});
exports.verifyEmail = verifyEmail;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const joiSchema = joi_1.default.object({
            email: joi_1.default.string().required().email().messages({
                "string.empty": "You have not entered your email id.",
                "string.email": "You have entered an invalid email id.",
            }),
            password: joi_1.default.string()
                .required()
                .messages({ "string.empty": "You have not entered your password." }),
        });
        const { error } = joiSchema.validate({
            email: email,
            password: password,
        });
        if (error) {
            res.status(300).send({
                message: error.message,
                success: false,
            });
            return;
        }
        const { status, user } = yield (0, helpers_1.emailAndPasswordChecker)(email, password);
        if (!status || !user) {
            res.status(400).send({
                message: "Looks like your email or password is incorrect.",
                success: false,
            });
            return;
        }
        if ((user === null || user === void 0 ? void 0 : user.userVerifyStatus) !== user_interface_1.UserProfileStatus.completed) {
            res.status(403).send({
                message: "Looks like your email is not yet verified.",
                success: false,
            });
            return;
        }
        // create jwt
        const token = (0, auth_1.signJwt)({
            user: user._id,
        });
        // create cookie
        if (process.env.NODE_ENV === "production") {
            res.cookie("accessToken", token, {
                maxAge: 3.154e10,
                httpOnly: true,
                sameSite: "none",
                secure: true,
                domain: process.env.APP_URI,
                path: "/",
            });
        }
        else {
            res.cookie("accessToken", token, {
                maxAge: 3.154e10,
                httpOnly: true,
            });
        }
        res.status(200).send({
            message: "User logged in successfully",
            success: true,
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
exports.loginUser = loginUser;
const me = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield user_model_1.UserModel.findById((_a = req === null || req === void 0 ? void 0 : req.context) === null || _a === void 0 ? void 0 : _a.user)
            .select("firstName lastName email number")
            .lean();
        res.status(200).send({
            message: "User found",
            success: true,
            user: user,
        });
        return;
    }
    catch (error) {
        res.status(300).send({
            message: error.message,
            success: false,
        });
        return;
    }
});
exports.me = me;
const testController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Test Controller");
        const data = ["India", "Pakistan", "United States"];
        res.status(200).send({
            message: "Test Controller",
            users: data,
        });
    }
    catch (error) {
        res.status(500).send({
            message: error.message.toString(),
        });
    }
});
exports.testController = testController;
const leaderboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.cookies.user);
        const users = yield user_model_1.UserModel.find()
            .select("firstName lastName email number")
            .lean();
        res.status(200).send({
            message: "Leaderboard Controller",
            users: users,
        });
    }
    catch (error) {
        res.status(500).send({
            message: error.message.toString(),
        });
    }
    return;
});
exports.leaderboard = leaderboard;
