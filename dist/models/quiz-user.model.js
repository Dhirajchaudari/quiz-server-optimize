"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizUserModel = exports.QuizUser = exports.QuizResponse = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const topics_model_1 = require("./topics.model");
const user_model_1 = require("./user.model");
const quiz_model_1 = require("./quiz.model");
let QuizResponse = class QuizResponse {
};
exports.QuizResponse = QuizResponse;
__decorate([
    (0, typegoose_1.prop)({ ref: quiz_model_1.Quiz }),
    __metadata("design:type", Object)
], QuizResponse.prototype, "questionId", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], QuizResponse.prototype, "userAns", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Boolean)
], QuizResponse.prototype, "isCorrect", void 0);
__decorate([
    (0, typegoose_1.prop)(() => Date),
    __metadata("design:type", Date)
], QuizResponse.prototype, "updatedAt", void 0);
__decorate([
    (0, typegoose_1.prop)(() => Date),
    __metadata("design:type", Date)
], QuizResponse.prototype, "createdAt", void 0);
exports.QuizResponse = QuizResponse = __decorate([
    (0, typegoose_1.ModelOptions)({ options: { allowMixed: typegoose_1.Severity.ALLOW } })
], QuizResponse);
let QuizUser = class QuizUser {
};
exports.QuizUser = QuizUser;
__decorate([
    (0, typegoose_1.prop)({ ref: user_model_1.User }),
    __metadata("design:type", Object)
], QuizUser.prototype, "user", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: topics_model_1.Topic }),
    __metadata("design:type", Array)
], QuizUser.prototype, "topics", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => QuizResponse }),
    __metadata("design:type", Array)
], QuizUser.prototype, "quizResponse", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], QuizUser.prototype, "finalScore", void 0);
__decorate([
    (0, typegoose_1.prop)(() => Date),
    __metadata("design:type", Date)
], QuizUser.prototype, "updatedAt", void 0);
__decorate([
    (0, typegoose_1.prop)(() => Date),
    __metadata("design:type", Date)
], QuizUser.prototype, "createdAt", void 0);
exports.QuizUser = QuizUser = __decorate([
    (0, typegoose_1.ModelOptions)({ options: { allowMixed: typegoose_1.Severity.ALLOW } })
], QuizUser);
exports.QuizUserModel = (0, typegoose_1.getModelForClass)(QuizUser, {
    schemaOptions: { timestamps: true },
});
