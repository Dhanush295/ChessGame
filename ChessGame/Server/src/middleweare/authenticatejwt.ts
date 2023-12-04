import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";
import  {SECRET } from '..';
import { cerateAccesstoken, createRefreshtoken } from '../utils/Createtokens/accessandrefresh';
import { get } from "lodash";

export const authenticatemiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken
    console.log(token)

    next();
};


