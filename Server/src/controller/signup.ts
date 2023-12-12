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
    const userexist = await prisma.user.findUnique({
        where: {
            email: userData.email
        }
    })

    if(!userexist){
        if(userData.password){
            const hashedPassword = hashPassword(userData.password);

            const userCreated = await prisma.user.create({
                data: {
                    email: userData.email,
                    password: hashedPassword,
                    name: userData.name
                }
            })
            if(!userCreated) return res.sendStatus(400).json({message: " USer Not Cerated "})
    
            return res.status(200).json({message: "User Created Successfully! "})

        }
        else{
            const userCreated = await prisma.user.create({
                data: {
                    email: userData.email,
                    name: userData.name
                }
            })

            if(!userCreated) return res.sendStatus(400).json({message: " USer Not Cerated "})
            
            return res.status(200).json({message: "User Created Successfully! " })

        }
    }
    else{
        return res.sendStatus(400).json({message: "User Already Exist! "});
    }
}