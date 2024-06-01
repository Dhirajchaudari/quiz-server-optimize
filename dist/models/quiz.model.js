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
exports.QuizModel = exports.Quiz = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const topics_model_1 = require("./topics.model");
let Quiz = class Quiz {
};
exports.Quiz = Quiz;
__decorate([
    (0, typegoose_1.prop)({ ref: topics_model_1.Topic }),
    __metadata("design:type", Object)
], Quiz.prototype, "topic", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Quiz.prototype, "question", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Array)
], Quiz.prototype, "options", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Quiz.prototype, "ans", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Quiz.prototype, "level", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], Quiz.prototype, "weightage", void 0);
__decorate([
    (0, typegoose_1.prop)(() => Date),
    __metadata("design:type", Date)
], Quiz.prototype, "updatedAt", void 0);
__decorate([
    (0, typegoose_1.prop)(() => Date),
    __metadata("design:type", Date)
], Quiz.prototype, "createdAt", void 0);
exports.Quiz = Quiz = __decorate([
    (0, typegoose_1.ModelOptions)({ options: { allowMixed: typegoose_1.Severity.ALLOW } })
], Quiz);
exports.QuizModel = (0, typegoose_1.getModelForClass)(Quiz, {
    schemaOptions: { timestamps: true },
});
