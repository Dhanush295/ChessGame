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
const express_1 = __importDefault(require("express"));
const getGoogleUrl_1 = require("../utils/OAuth-Google.ts/getGoogleUrl");
const getOauthTokens_1 = require("../utils/OAuth-Google.ts/getOauthTokens");
const getGooglesUser_1 = require("../utils/OAuth-Google.ts/getGooglesUser");
const client_1 = require("@prisma/client");
const signup_1 = require("../controller/signup");
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
const accessTokenCookieOption = {
    maxAge: 900000,
    httpOnly: true,
    domain: 'localhost',
    path: '/',
    sameSite: 'lax',
    secure: false,
};
const refreshTokenCookieOption = Object.assign(Object.assign({}, accessTokenCookieOption), { maxAge: 3.154e10 });
router.get('/', (req, res) => {
    const googleAuthUrl = (0, getGoogleUrl_1.getGoogleUrl)();
    res.send(`<a href="${googleAuthUrl}">Authenticate with Google</a>`);
});
router.get('/home', (req, res) => {
    const googleAuthUrl = (0, getGoogleUrl_1.getGoogleUrl)();
    res.send("Home boy");
});
router.get('/auth/google/callback', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const code = req.query.code;
        const { id_token, access_token } = yield (0, getOauthTokens_1.getOauthTokens)({ code });
        const googleUser = yield (0, getGooglesUser_1.getGoogleUser)({ id_token, access_token });
        if (!googleUser.verified_email) {
            return res.status(403).json({ message: "Email Not verified" });
        }
        const user = yield prisma.user.findUnique({ where: { email: googleUser.email } });
        if (!user) {
            const user = yield prisma.user.create({
                data: {
                    email: googleUser.email,
                    name: googleUser.name,
                    profileImg: googleUser.picture
                },
            });
            console.log("Email updated successfully");
            return res.redirect("http://localhost:3000/home");
        }
        else {
            return res.status(403).json({ message: "User Not Found" });
        }
    }
    catch (error) {
        console.error(error, "Failed to get User");
        return res.redirect("http://localhost:3000/oauth/error");
    }
}));
router.post('/login', signup_1.signup);
exports.default = router;
