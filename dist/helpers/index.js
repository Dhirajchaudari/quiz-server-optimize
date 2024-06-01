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
exports.emailAndPasswordChecker = void 0;
const user_model_1 = require("../models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
// Check if user exists for given email and password
const emailAndPasswordChecker = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const check = yield user_model_1.UserModel.findOne({
        email: { $eq: email },
    })
        .lean()
        .select("_id userVerifyStatus password");
    if (!check) {
        return { status: false, user: undefined };
    }
    const checkPass = yield bcrypt_1.default.compare(password, check.password);
    return {
        status: checkPass === true,
        user: {
            _id: check._id.toString(),
            userVerifyStatus: check.userVerifyStatus,
        },
    };
});
exports.emailAndPasswordChecker = emailAndPasswordChecker;
