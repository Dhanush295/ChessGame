import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import { cerateAccesstoken, createRefreshtoken } from "../utils/Createtokens/accessandrefresh";
import { accessTokenCookieOption, refreshTokenCookieOption } from "./googleOauthRedirect";
import { hashPassword } from "../utils/HashPassword/hash";

const prisma = new PrismaClient()

export interface userBodydataI {
    email: string;
    name: string;
    password: string;
}


export async function signup(req: Request, res: Response){
    const userData:userBodydataI = req.body;

    const password = hashPassword(userData.password);
    const userexist = await prisma.user.findUnique({
        where: {
            email: userData.email
        }
    })

    if(!userexist){
        const userCreated = await prisma.user.create({
            data: {
                email: userData.email,
                password: password,
                name: userData.name
            }
        })
        
        const generatedAccessToken = cerateAccesstoken(userCreated);
        const generatedrefreshToken = createRefreshtoken(userCreated);

        console.log("Email updated successfully");
        res.cookie("refreshToken", generatedrefreshToken, refreshTokenCookieOption);
        return res.status(200).json({message: "User Created Successfully! ", token: {generatedAccessToken}})
    }
    else{
        return res.redirect('http://localhost:3000/home');
    }
}