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
        const recievedRefreshToken = req.cookies.refreshToken;
        if (!recievedRefreshToken)
            return res.status(401);
        const token = recievedRefreshToken;
        console.log(token);
        res.clearCookie('refreshToken', { httpOnly: true, sameSite: "none", secure: true });
        const findUser = yield prisma.user.findFirst({
            where: {
                refreshtoken: {
                    has: token
                }
            }
        });
        console.log(findUser);
        if (!findUser) {
            jsonwebtoken_1.default.verify(token, __1.SECRET, (err, decoded) => __awaiter(this, void 0, void 0, function* () {
                if (err || !decoded || typeof decoded === 'string') {
                    return res.sendStatus(403);
                }
                const decodedId = typeof decoded.id === 'string' ? (0, lodash_1.toInteger)(decoded.id) : null;
                if (decodedId === null) {
                    return res.sendStatus(403);
                }
                const tamperedToken = yield prisma.user.findUnique({
                    where: {
                        id: decodedId
                    }
                });
                if (!tamperedToken) {
                    return res.sendStatus(404);
                }
                tamperedToken.refreshtoken = [];
                const result = yield prisma.user.update({
                    where: {
                        id: decodedId
                    },
                    data: {
                        refreshtoken: tamperedToken.refreshtoken
                    }
                });
                console.log(result);
            }));
            return res.sendStatus(403);
        }
        const refreshTokenArray = findUser.refreshtoken.filter(rt => rt !== recievedRefreshToken);
        console.log(refreshTokenArray);
        jsonwebtoken_1.default.verify(token, __1.SECRET, (err, decoded) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                console.log(err);
                findUser.refreshtoken = Object.assign({}, refreshTokenArray);
                const result = yield prisma.user.update({
                    where: {
                        id: findUser.id
                    },
                    data: {
                        refreshtoken: findUser.refreshtoken
                    }
                });
                console.log(result, "Please Login Again");
            }
            if (err || typeof decoded === 'string' || !decoded || !('id' in decoded) || findUser.id !== (0, lodash_1.toInteger)(decoded.id)) {
                return res.sendStatus(403);
            }
            const newRefreshToken = (0, accessandrefresh_1.createRefreshtoken)(decoded.id);
            console.log(newRefreshToken);
            if (!newRefreshToken)
                return res.status(404);
            findUser.refreshtoken = [...refreshTokenArray, newRefreshToken];
            const result = yield prisma.user.update({
                where: {
                    id: findUser.id
                },
                data: {
                    refreshtoken: findUser.refreshtoken
                }
            });
            console.log(result);
            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                sameSite: 'none',
                secure: true
            });
            const newAccessToken = (0, accessandrefresh_1.cerateAccesstoken)(decoded.id);
            res.json({ newAccessToken });
        }));
    });
}
exports.handleToken = handleToken;
