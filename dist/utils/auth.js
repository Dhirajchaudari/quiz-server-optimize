"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwt = exports.signJwt = exports.jwtValid = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// 1. generate public & private keys
// 2. convert public & private key to base64 format
const publicKey = Buffer.from(process.env.PUBLIC_KEY, "base64").toString("ascii");
const privateKey = Buffer.from(process.env.PRIVATE_KEY, "base64").toString("ascii");
function jwtValid(token) {
    let isValid = false;
    jsonwebtoken_1.default.verify(token, publicKey, (error, decode) => {
        if ((error === null || error === void 0 ? void 0 : error.name) === "TokenExpiredError") {
            isValid = true;
        }
        else {
            isValid = false;
        }
    });
    return isValid;
}
exports.jwtValid = jwtValid;
function signJwt(object, options) {
    return jsonwebtoken_1.default.sign(object, privateKey, Object.assign(Object.assign({}, (options && options)), { algorithm: "RS256" }));
}
exports.signJwt = signJwt;
function verifyJwt(token) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, publicKey);
        return decoded;
    }
    catch (error) {
        return null;
    }
}
exports.verifyJwt = verifyJwt;
