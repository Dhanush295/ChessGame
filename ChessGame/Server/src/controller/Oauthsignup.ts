import express, { CookieOptions } from "express";
import { Request, Response } from "express";
import { getGoogleUrl } from "../utils/OAuth-Google.ts/getGoogleUrl";
import { getOauthTokens } from "../utils/OAuth-Google.ts/getOauthTokens";
import { getGoogleUser } from "../utils/OAuth-Google.ts/getGooglesUser";
import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()

export async function Oauthsignup(req:Request, res:Response){
    const googleAuthUrl = getGoogleUrl(); 
    res.send(`<a href="${googleAuthUrl}">Authenticate with Google</a>`);
};
    
