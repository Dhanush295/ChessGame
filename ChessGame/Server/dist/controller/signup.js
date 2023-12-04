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
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = void 0;
const client_1 = require("@prisma/client");
const accessandrefresh_1 = require("../utils/Createtokens/accessandrefresh");
const googleOauthRedirect_1 = require("./googleOauthRedirect");
const hash_1 = require("../utils/HashPassword/hash");
const prisma = new client_1.PrismaClient();
function signup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userData = req.body;
        const password = (0, hash_1.hashPassword)(userData.password);
        const userexist = yield prisma.user.findUnique({
            where: {
                email: userData.email
            }
        });
        if (!userexist) {
            const userCreated = yield prisma.user.create({
                data: {
                    email: userData.email,
                    password: password,
                    name: userData.name
                }
            });
            const generatedAccessToken = (0, accessandrefresh_1.cerateAccesstoken)(userCreated);
            const generatedrefreshToken = (0, accessandrefresh_1.createRefreshtoken)(userCreated);
            console.log("Email updated successfully");
            res.cookie("refreshToken", generatedrefreshToken, googleOauthRedirect_1.refreshTokenCookieOption);
            return res.status(200).json({ message: "User Created Successfully! ", token: { generatedAccessToken } });
        }
        else {
            return res.redirect('http://localhost:3000/home');
        }
    });
}
exports.signup = signup;