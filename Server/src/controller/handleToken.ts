import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import jwt, { JwtPayload } from "jsonwebtoken";
import { SECRET } from "..";
import { toInteger } from "lodash";
import { cerateAccesstoken, createRefreshtoken } from "../utils/Createtokens/accessandrefresh";
import { refreshTokenCookieOption } from './googleOauthRedirect';
const prisma = new PrismaClient()


export async function handleToken(req: Request, res: Response) {
    const recievedRefreshToken = req.cookies.refreshToken;
   
    if(!recievedRefreshToken) return res.status(401);

    const token:string = recievedRefreshToken;
    console.log(token)

    res.clearCookie('refreshToken',{httpOnly: true, sameSite: "none", secure: true })

    const findUser = await prisma.user.findFirst({
        where: {
            refreshtoken: {
                has: token
            }
        }
    });

    console.log(findUser)

    
    if (!findUser) {
        jwt.verify(token, SECRET as string, async (err, decoded) => {
            if (err || !decoded || typeof decoded === 'string') {
                return res.sendStatus(403);
            }
    
            const decodedId = typeof decoded.id === 'string' ? toInteger(decoded.id) : null;
            if (decodedId === null) {
                return res.sendStatus(403);
            }
    
            const tamperedToken = await prisma.user.findUnique({
                where: {
                    id: decodedId
                }
            });

            if (!tamperedToken) {
                return res.sendStatus(404); 
            }
    
            tamperedToken.refreshtoken = []; 

            const result = await prisma.user.update({
                where: {
                    id: decodedId
                },
                data: {
                    refreshtoken: tamperedToken.refreshtoken
                }
            })

            console.log(result)
            
            
        });
        return res.sendStatus(403);
    }

    const refreshTokenArray = findUser.refreshtoken.filter( rt => rt !== recievedRefreshToken)
    console.log(refreshTokenArray)

    jwt.verify(token, SECRET as string, 
        async (err, decoded) => {
            if (err){
                console.log(err)
                findUser.refreshtoken = {...refreshTokenArray};
                
                const result = await prisma.user.update({
                    where: {
                        id: findUser.id
                    },
                    data: {
                        refreshtoken: findUser.refreshtoken
                    }
                })
                console.log(result, "Please Login Again")   
            }

            if (err || typeof decoded === 'string' || !decoded || !('id' in decoded) || findUser.id !== toInteger(decoded.id)) {
                return res.sendStatus(403);
            }

            const newRefreshToken = createRefreshtoken(decoded.id);
            console.log(newRefreshToken)

            if(!newRefreshToken) return res.status(404)

            findUser.refreshtoken = [...refreshTokenArray, newRefreshToken]
            const result = await prisma.user.update({
                where: {
                    id: findUser.id
                },
                data: {
                    refreshtoken: findUser.refreshtoken
                }
            })
            console.log(result)   

            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                sameSite: 'none',
                secure: true
            });

            const newAccessToken = cerateAccesstoken(decoded.id);
            res.json({newAccessToken})
        
        }
    );

}