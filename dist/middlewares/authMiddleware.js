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
exports.setContext = exports.isUser = void 0;
const auth_1 = require("../utils/auth");
const isUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!((_a = req === null || req === void 0 ? void 0 : req.context) === null || _a === void 0 ? void 0 : _a.user)) {
            res.status(401).json({
                message: "Unauthorized",
                success: false,
            });
            return;
        }
        next();
    }
    catch (error) {
        res.status(error.status).json({
            message: error.message,
        });
        return;
    }
});
exports.isUser = isUser;
const setContext = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let context = {
            user: undefined,
            req: req,
            res: res,
        };
        if (req === null || req === void 0 ? void 0 : req.cookies.accessToken) {
            const user = (0, auth_1.verifyJwt)(req.cookies.accessToken);
            context.user = user === null || user === void 0 ? void 0 : user.user;
        }
        // console.log(req?.cookies.accessToken)                                                
        console.log(context === null || context === void 0 ? void 0 : context.user);
        req.context = context;
        next();
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
});
exports.setContext = setContext;
