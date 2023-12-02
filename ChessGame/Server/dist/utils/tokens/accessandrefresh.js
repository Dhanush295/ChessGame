"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRefreshtoken = exports.cerateAccesstoken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const __1 = require("../..");
function cerateAccesstoken(user) {
    if (__1.SECRET) {
        return jsonwebtoken_1.default.sign({
            id: user.id
        }, __1.SECRET, {
            expiresIn: '45m'
        });
    }
    return undefined;
}
exports.cerateAccesstoken = cerateAccesstoken;
function createRefreshtoken(user) {
    if (__1.SECRET) {
        return jsonwebtoken_1.default.sign({
            id: user.id
        }, __1.SECRET, {
            expiresIn: '45m'
        });
    }
    return undefined;
}
exports.createRefreshtoken = createRefreshtoken;
