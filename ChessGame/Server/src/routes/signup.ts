import express, { CookieOptions } from "express";
import { Request, Response } from "express";
import { getGoogleUrl } from "../utils/OAuth-Google.ts/getGoogleUrl";
import { getOauthTokens } from "../utils/OAuth-Google.ts/getOauthTokens";
import { getGoogleUser } from "../utils/OAuth-Google.ts/getGooglesUser";
import { PrismaClient } from '@prisma/client'


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

        const googleUser = await getGoogleUser({id_token, access_token});
        

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
        console.log("Email updated successfully");
        return res.redirect("http://localhost:3000/home")

        } 
        
        else {
            return res.status(403).json({message: "User Not Found"})
        }

        
            

    }catch(error: any){
        console.error(error, "Failed to get User");
        
        return res.redirect("http://localhost:3000/oauth/error")
    }
    
})

export default router;


