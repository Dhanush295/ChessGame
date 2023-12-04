"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticatemiddleware = void 0;
const authenticatemiddleware = (req, res, next) => {
    const token = req.cookies.accessToken;
    console.log(token);
    next();
};
exports.authenticatemiddleware = authenticatemiddleware;
