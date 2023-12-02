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
exports.googleOauthredirect = exports.refreshTokenCookieOption = exports.accessTokenCookieOption = void 0;
const getOauthTokens_1 = require("../utils/OAuth-Google.ts/getOauthTokens");
const getGooglesUser_1 = require("../utils/OAuth-Google.ts/getGooglesUser");
const accessandrefresh_1 = require("../utils/Createtokens/accessandrefresh");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.accessTokenCookieOption = {
    maxAge: 900000,
    httpOnly: true,
    domain: 'localhost',
    path: '/',
    sameSite: 'lax',
    secure: false,
};
exports.refreshTokenCookieOption = Object.assign(Object.assign({}, exports.accessTokenCookieOption), { maxAge: 3.154e10 });
function googleOauthredirect(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const code = req.query.code;
            const { id_token, access_token } = yield (0, getOauthTokens_1.getOauthTokens)({ code });
            const googleUser = yield (0, getGooglesUser_1.getGoogleUser)({ id_token, access_token });
            if (!googleUser.verified_email) {
                return res.status(403).json({ message: "Email Not verified" });
            }
            const userexist = yield prisma.user.findUnique({ where: { email: googleUser.email } });
            if (userexist) {
                return res.status(200).json({ message: "User Already exist Please Login" });
            }
            else {
                const userCreated = yield prisma.user.create({
                    data: {
                        email: googleUser.email,
                        name: googleUser.name,
                        profileImg: googleUser.picture,
                    }
                });
                const generatedAccessToken = (0, accessandrefresh_1.cerateAccesstoken)(userCreated);
                const generatedrefreshToken = (0, accessandrefresh_1.createRefreshtoken)(userCreated);
                res.cookie("accessToken", generatedAccessToken, exports.accessTokenCookieOption);
                res.cookie("refreshToken", generatedrefreshToken, exports.refreshTokenCookieOption);
                console.log("Email updated successfully");
                return res.redirect("http://localhost:3000/home");
            }
        }
        catch (error) {
            console.error(error, "Failed to get User");
            return res.redirect("http://localhost:3000/oauth/error");
        }
    });
}
exports.googleOauthredirect = googleOauthredirect;
