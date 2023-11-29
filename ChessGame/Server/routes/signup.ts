import express from "express";
import { Request, Response } from "express";
const route = express.Router();

route.get('/', ( req:Request, res:Response)=>{
    res.status(200).json({message: "Hii from signup"})
})

export default route;