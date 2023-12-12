import {Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { comparePasswords } from '../utils/HashPassword/hash';
import { userBodydataI } from './signup'
import { cerateAccesstoken, createRefreshtoken } from '../utils/Createtokens/accessandrefresh';
import { refreshTokenCookieOption } from './googleOauthRedirect';
const prisma = new PrismaClient()


export async function login (req:Request, res: Response){
    const userData: userBodydataI = req.body;
    const userexist = await prisma.user.findUnique({
        where: {
            email: userData.email
        }
    })

    if(userexist){
        if(userexist.password){
            const isPasswordMatch = await comparePasswords(userData.password, userexist.password);

            if(!isPasswordMatch) return res.status(400).json({message: "Incorrect password!"})

            const generatedAccessToken = cerateAccesstoken(userexist);
            const generatedrefreshToken = createRefreshtoken(userexist)

            const updateRefreshToken = await prisma.user.update({
                where: { email: userexist.email }, 
                data: {
                  refreshtoken: {
                    push: generatedrefreshToken, 
                  },
                },
              });

            if(!updateRefreshToken) return res.sendStatus(400).json({message: "No refresh token created! "})
            
            console.log("Email updated successfully");
            res.cookie("refreshToken", generatedrefreshToken, refreshTokenCookieOption);
            return res.status(200).json({message: "USer LogedIn Successfully! ", token: {generatedAccessToken}})
            

        }
        const generatedAccessToken = cerateAccesstoken(userexist);
        const generatedrefreshToken = createRefreshtoken(userexist);
        const updateRefreshToken = await prisma.user.update({
            where: { email: userexist.email }, 
            data: {
              refreshtoken: {
                push: generatedrefreshToken, 
              },
            },
          });

        if(!updateRefreshToken) return res.sendStatus(400).json({message: "No refresh token created! "})


        console.log("Email updated successfully");
        res.cookie("refreshToken", generatedrefreshToken, refreshTokenCookieOption);
        return res.status(200).json({message: "USer LogedIn Successfully! ", token: {generatedAccessToken}})
    }
    return res.status(404).json({message: "user Not Found! "})

}