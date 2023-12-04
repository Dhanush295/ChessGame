import { Request, Response } from "express";
import { getOauthTokens } from "../utils/OAuth-Google.ts/getOauthTokens";
import { getGoogleUser } from "../utils/OAuth-Google.ts/getGooglesUser";
import  {cerateAccesstoken, createRefreshtoken} from "../utils/Createtokens/accessandrefresh";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()


export interface  userCred {
    id: number;
    email: string;
    name: string;
    password: string | null;
    profileImg: string;
    accountCreatedAt: Date;
}

export const accessTokenCookieOption  = {
    maxAge: 900000, 
    httpOnly: true,
    domain: 'localhost',
    path: '/',
    sameSite: 'lax'  as const, 
    secure: false,
};

export const refreshTokenCookieOption = {
    ...accessTokenCookieOption,
    maxAge: 3.154e10, 
}



export async function googleOauthredirect(req:Request, res:Response){
    try{

        const code = req.query.code as string;
        const {id_token, access_token} = await getOauthTokens({code})

        const googleUser = await getGoogleUser({id_token, access_token});
        

        if(!googleUser.verified_email){
            return res.status(403).json({message: "Email Not verified"});
        }

        const userexist = await prisma.user.findUnique({where: {email: googleUser.email}});
        
    
        if (userexist) {
            return res.status(200).json({message: "User Already exist Please Login"})
        } 
        
        else {
            const userCreated = await prisma.user.create({
                data:{
                    email: googleUser.email,
                    name: googleUser.name,
                    profileImg: googleUser.picture,
                }
            })

            const generatedAccessToken = cerateAccesstoken(userCreated);
            const generatedrefreshToken = createRefreshtoken(userCreated);
            const updateRefreshToken = await prisma.user.update({
                where: { email: userCreated.email }, 
                data: {
                  refreshtoken: {
                    push: generatedrefreshToken, 
                  },
                },
              });

            if(!updateRefreshToken) return res.sendStatus(400).json({message: "No refresh token created! "})
  
            // res.cookie("accessToken", generatedAccessToken, accessTokenCookieOption);
            res.cookie("refreshToken", generatedrefreshToken, refreshTokenCookieOption);
            return res.status(200).json({message: "USer Created Successfully! ", token: {generatedAccessToken}}) 
        }   
    }catch(error: any){
        console.error(error, "Failed to get User");
        return res.redirect("http://localhost:3000/oauth/error")
    }
    
}