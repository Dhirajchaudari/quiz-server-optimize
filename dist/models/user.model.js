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
exports.UserModel = exports.User = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const user_interface_1 = require("../interfaces/user.interface");
const bcrypt_1 = __importDefault(require("bcrypt"));
let User = class User {
};
exports.User = User;
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, unique: true }),
    __metadata("design:type", Number)
], User.prototype, "number", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, default: user_interface_1.UserProfileStatus.emailVerificationPending }),
    __metadata("design:type", String)
], User.prototype, "userVerifyStatus", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typegoose_1.prop)(() => Date),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typegoose_1.prop)(() => Date),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
exports.User = User = __decorate([
    (0, typegoose_1.pre)("save", function () {
        return __awaiter(this, void 0, void 0, function* () {
            // check if password is being modified
            if (!this.isModified("password")) {
                return;
            }
            // hash password
            const salt = yield bcrypt_1.default.genSalt(10);
            const hash = bcrypt_1.default.hashSync(this.password, salt);
            this.password = hash;
        });
    }),
    (0, typegoose_1.index)({ email: 1, firstName: 1, lastName: 1 }),
    (0, typegoose_1.ModelOptions)({ options: { allowMixed: typegoose_1.Severity.ALLOW } })
], User);
exports.UserModel = (0, typegoose_1.getModelForClass)(User, {
    schemaOptions: { timestamps: true },
});
