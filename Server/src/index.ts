import express, { json } from "express";
import cors from "cors";
import allRoutes from "./routes/allRoutes";
import dotenv from "dotenv";
import path from "path";
import cookieParser from 'cookie-parser';

const envPath = path.resolve(__dirname, "../", ".env");
dotenv.config({ path: envPath });

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/', allRoutes);



export const CLIENT_ID = process.env.CLIENT_ID;
export const CLIENT_SECRET = process.env.CLIENT_SECRET;
export const OAUTH_REDIRECT = process.env.OAUTH_REDIRECT;
export const SECRET = process.env.SECRET ;


app.listen(3000, () => console.log("Server listening on port: 3000"));

