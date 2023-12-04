import express, { CookieOptions } from "express";
import { Request, Response } from "express";
import { getGoogleUrl } from "../utils/OAuth-Google.ts/getGoogleUrl";
import { authenticatemiddleware } from "../middleweare/authenticatejwt";
import { Oauthsignup } from "../controller/Oauthsignup";
import { googleOauthredirect } from "../controller/googleOauthRedirect";
import { signup } from "../controller/signup";
import { login } from "../controller/login";
import { handleToken } from "../controller/handleToken";


const router = express.Router();

router.get('/home', authenticatemiddleware, (req: Request, res: Response) => {
    const googleAuthUrl = getGoogleUrl(); 
    res.send("Home boy");
});

router.get('/oAuthSignup',Oauthsignup )

router.get("/auth/google/callback", googleOauthredirect)

router.post('/signup',signup )

router.post('/login', login);

router.get('/refresh/token',handleToken )

export default router;


