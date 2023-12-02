import {Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { comparePasswords } from '../utils/HashPassword/hash';
import { userBodydataI } from './signup'
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
            if(!isPasswordMatch){
                return res.status(400).json({message: "Incorrect password!"})
            }
            return res.status(200).json({message: "User LoggedIN Successfully! "})

        }
        return res.status(200).json({message: "User LoggedIN Successfully! "})
    }
    return res.status(404).json({message: "user Not Found! "})

}