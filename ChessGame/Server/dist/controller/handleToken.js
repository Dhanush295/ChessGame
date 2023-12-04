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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleToken = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const __1 = require("..");
const lodash_1 = require("lodash");
const accessandrefresh_1 = require("../utils/Createtokens/accessandrefresh");
const prisma = new client_1.PrismaClient();
function handleToken(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const foundCookies = req.cookies.refreshToken;
        if (!foundCookies)
            return res.status(401);
        console.log(foundCookies);
        const token = foundCookies;
        const findUser = yield prisma.user.findFirst({
            where: {
                refreshtoken: {
                    has: token
                }
            }
        });
        if (!findUser)
            return res.sendStatus(403);
        jsonwebtoken_1.default.verify(token, __1.SECRET, (err, decoded) => {
            if (err || typeof decoded === 'string' || !decoded || !('id' in decoded) || findUser.id !== (0, lodash_1.toInteger)(decoded.id)) {
                return res.sendStatus(403);
            }
            const newAccessToken = (0, accessandrefresh_1.cerateAccesstoken)(decoded.id);
            res.json({ newAccessToken });
        });
    });
}
exports.handleToken = handleToken;
