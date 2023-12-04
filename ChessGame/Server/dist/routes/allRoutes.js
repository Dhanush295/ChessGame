"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const getGoogleUrl_1 = require("../utils/OAuth-Google.ts/getGoogleUrl");
const authenticatejwt_1 = require("../middleweare/authenticatejwt");
const Oauthsignup_1 = require("../controller/Oauthsignup");
const googleOauthRedirect_1 = require("../controller/googleOauthRedirect");
const signup_1 = require("../controller/signup");
const login_1 = require("../controller/login");
const router = express_1.default.Router();
router.get('/home', authenticatejwt_1.authenticatemiddleware, (req, res) => {
    const googleAuthUrl = (0, getGoogleUrl_1.getGoogleUrl)();
    res.send("Home boy");
});
router.get('/oAuthSignup', Oauthsignup_1.Oauthsignup);
router.get("/auth/google/callback", googleOauthRedirect_1.googleOauthredirect);
router.post('/signup', signup_1.signup);
router.post('/login', login_1.login);
exports.default = router;
