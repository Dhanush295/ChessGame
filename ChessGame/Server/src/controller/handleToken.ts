import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import jwt, { JwtPayload } from "jsonwebtoken";
import { SECRET } from "..";
import { toInteger } from "lodash";
import { cerateAccesstoken } from "../utils/Createtokens/accessandrefresh";
const prisma = new PrismaClient()


export async function handleToken(req: Request, res: Response) {
    const foundCookies = req.cookies.refreshToken;
    if(!foundCookies) return res.status(401);

    const token:string = foundCookies

    const findUser = await prisma.user.findFirst({
        where: {
            refreshtoken: {
                has: token
            }
        }
    });

    
    if(!findUser) return res.sendStatus(403);

    jwt.verify(token, SECRET as string, (err, decoded) => {
        if (err || typeof decoded === 'string' || !decoded || !('id' in decoded) || findUser.id !== toInteger(decoded.id)) {
            return res.sendStatus(403);
        }
        const newAccessToken = cerateAccesstoken(decoded.id);
        res.json({newAccessToken})
        
    });

}