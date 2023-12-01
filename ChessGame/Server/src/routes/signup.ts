import express, { CookieOptions } from "express";
import session from "express-session";
import { mySignJwt } from "../utils/signJwt";
import { Request, Response } from "express";
import { getGoogleUrl } from "../utils/getGoogleUrl";
import { getOauthTokens } from "../utils/getOauthTokens";
import { getGoogleUser } from "../utils/getGooglesUser";
import { PrismaClient } from '@prisma/client'
import { createSession } from "../utils/createSession";

const prisma = new PrismaClient()

const router = express.Router();

const accessTokenCookieOption : CookieOptions = {
    maxAge: 900000, 
    httpOnly: true,
    domain: 'localhost',
    path: '/',
    sameSite: 'lax'  as const, 
    secure: false,
};

const refreshTokenCookieOption: CookieOptions = {
    ...accessTokenCookieOption,
    maxAge: 3.154e10, 
}

router.get('/', (req: Request, res: Response) => {
    const googleAuthUrl = getGoogleUrl(); 
    res.send(`<a href="${googleAuthUrl}">Authenticate with Google</a>`);
});

router.get('/home', (req: Request, res: Response) => {
    const googleAuthUrl = getGoogleUrl(); 
    res.send("Home boy");
});

router.get('/auth/google/callback', async (req: Request, res: Response)=>{
    try{

        const code = req.query.code as string;
        const {id_token, access_token} = await getOauthTokens({code})
        console.log({id_token, access_token})

        const googleUser = await getGoogleUser({id_token, access_token});
        console.log(getGoogleUrl)

        if(!googleUser.verified_email){
            return res.status(403).json({message: "Email Not verified"});
        }

        const user = await prisma.user.findUnique({where: {email: googleUser.email}});
    
        if (!user) {
        const user = await prisma.user.create({
            data: {
            email: googleUser.email,
            name: googleUser.name,
            profileImg: googleUser.picture
            },
        });

        const session = await createSession({ userId: user.id });
            const accessToken = signJwt(
                { ...user, session: session.id },
                { expiresIn:  '15m'  } 
            );

            const refreshToken = signJwt(
                { ...user, session: session.id },
                { expiresIn:  '30d'  } 
                );

            res.cookie("accessToken", accessToken, accessTokenCookieOption);

            res.cookie("refreshToken", refreshToken,refreshTokenCookieOption);
    
        console.log("Email updated successfully");
        } 
        
        else {
            const session = await createSession({ userId: user.id });
            const accessToken = mySignJwt(
                { ...user, session: session.id },
                { expiresIn:  '15m'  } 
            );

            const refreshToken = mySignJwt(
                { ...user, session: session.id },
                { expiresIn:  '30d'  } 
                );

            res.cookie("accessToken", accessToken, accessTokenCookieOption);

            res.cookie("refreshToken", refreshToken,refreshTokenCookieOption);
        }

        return res.redirect("http://localhost:3000/home")
            

    }catch(error: any){
        console.error(error, "Failed to get User");
        
        return res.redirect("http://localhost:3000/oauth/error")
    }
    
})

export default router;

function signJwt(arg0: { session: any; id: number; email: string; name: string; password: string | null; profileImg: string; }, arg1: { expiresIn: any; }) {
    throw new Error("Function not implemented.");
}
