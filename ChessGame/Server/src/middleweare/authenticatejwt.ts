import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";
import  {SECRET } from '..';
import { cerateAccesstoken, createRefreshtoken } from '../utils/Createtokens/accessandrefresh';
import { get } from "lodash";

export const authenticatemiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, SECRET as string, (err, decoded) => {
          if (err) {
            return res.sendStatus(403);
          }
          if (!decoded) {
            return res.sendStatus(403);
          }
          if (typeof decoded === "string") {
            return res.sendStatus(403);
          }
          
          req.user = decoded.id;
          console.log(req.user)
          next();
        });
      } else {
        res.sendStatus(401);
      }
    };



