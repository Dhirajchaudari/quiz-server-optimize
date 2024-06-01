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
exports.TopicModel = exports.Topic = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const topic_interface_1 = require("../interfaces/topic.interface");
let Topic = class Topic {
};
exports.Topic = Topic;
__decorate([
    (0, typegoose_1.prop)({ required: true, default: topic_interface_1.QuizTopicEnum.CSS }),
    __metadata("design:type", String)
], Topic.prototype, "topic", void 0);
__decorate([
    (0, typegoose_1.prop)(() => Date),
    __metadata("design:type", Date)
], Topic.prototype, "updatedAt", void 0);
__decorate([
    (0, typegoose_1.prop)(() => Date),
    __metadata("design:type", Date)
], Topic.prototype, "createdAt", void 0);
exports.Topic = Topic = __decorate([
    (0, typegoose_1.ModelOptions)({ options: { allowMixed: typegoose_1.Severity.ALLOW } })
], Topic);
exports.TopicModel = (0, typegoose_1.getModelForClass)(Topic, {
    schemaOptions: { timestamps: true },
});
