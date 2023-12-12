"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mySignJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET = "MultiChessGame";
function mySignJwt(object, options) {
    return jsonwebtoken_1.default.sign(object, SECRET, Object.assign({}, (options && options)));
}
exports.mySignJwt = mySignJwt;
