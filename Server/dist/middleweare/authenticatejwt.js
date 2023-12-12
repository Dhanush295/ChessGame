"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticatemiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const __1 = require("..");
const authenticatemiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jsonwebtoken_1.default.verify(token, __1.SECRET, (err, decoded) => {
            if (err) {
                return res.sendStatus(403);
            }
            if (!decoded) {
                return res.sendStatus(403);
            }
            if (typeof decoded === "string") {
                return res.sendStatus(403);
            }
            req.user = decoded.id;
            console.log(req.user);
            next();
        });
    }
    else {
        res.sendStatus(401);
    }
};
exports.authenticatemiddleware = authenticatemiddleware;
